import type { Book } from '@/components/book-card';
import { DEFAULT_FALLBACK_GENRE } from '@/lib/genres';

export type BookGroup = {
  id: string;
  title: string;
  books: Book[];
};

export type GroupedBooksResult = {
  groups: BookGroup[];
  standalone: Book[];
  hasGroups: boolean;
};

export type GenreGroupResult = {
  genre: string;
  totalBooks: number;
  groups: BookGroup[];
  standalone: Book[];
  hasGroups: boolean;
};

/**
 * Normalizes a string for robust fuzzy/stem comparisons:
 * - lowercase
 * - strips diacritics/accents (ä -> a, é -> e, etc.)
 * - normalizes whitespace and punctuation
 */
export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts candidate base stems for a book title:
 * 1. Full cleaned title
 * 2. Title with volume, part, or edition indicators stripped
 *    (e.g., 'Buch der Träume 1' -> 'Buch der Träume', 'Faust I' -> 'Faust')
 * 3. Title with subtitle stripped (before ':', '-', '/', ';')
 * 4. Word prefixes for multi-word titles
 */
export function extractCandidateStems(title: string): string[] {
  const candidates: string[] = [];
  const raw = title.trim();
  if (!raw) return candidates;

  candidates.push(raw);

  // Strip trailing volume, part, book, or edition indicators:
  // Matches: ' 1', ' 2', ' I', ' II', ' Band 1', ' Teil 2', ' Vol. 3', ' Book 1'
  const volPattern =
    /\s*[\(\[]?\s*(?:band|teil|buch|book|vol\.?|volume|part|fall|edition)?\s*\b(\d+|[ivxlcdm]+)\s*[\)\]]?$/i;
  const strippedVol = raw.replace(volPattern, '').trim();
  if (strippedVol && strippedVol.length >= 2 && strippedVol !== raw) {
    candidates.push(strippedVol);
  }

  // Strip subtitles separated by colon, dash, slash, or semicolon:
  // e.g. 'Der Herr der Ringe - Die Gefährten' -> 'Der Herr der Ringe'
  const subPattern = /^(.+?)\s*[:–—\-\/;]\s*(.+)$/;
  const subMatch = raw.match(subPattern);
  if (subMatch && subMatch[1].trim().length >= 3) {
    const mainTitle = subMatch[1].trim();
    candidates.push(mainTitle);
    const mainWithoutVol = mainTitle.replace(volPattern, '').trim();
    if (mainWithoutVol && mainWithoutVol.length >= 2) {
      candidates.push(mainWithoutVol);
    }
  }

  // Word prefixes for titles with 3+ words (e.g. 'Harry Potter und...')
  const words = raw.split(/\s+/);
  if (words.length >= 3) {
    candidates.push(words.slice(0, 2).join(' '));
    if (words.length >= 4) {
      candidates.push(words.slice(0, 3).join(' '));
    }
  }

  // Deduplicate and filter out candidates that are too short
  return Array.from(new Set(candidates.map((s) => s.trim()))).filter((s) => s.length >= 2);
}

/**
 * Automatically groups books with similar or related titles (e.g. series, multi-volume editions).
 * Returns both the formed groups (>= 2 books) and standalone books.
 */
export function groupBooksByTitle(books: Book[]): GroupedBooksResult {
  if (books.length === 0) {
    return { groups: [], standalone: [], hasGroups: false };
  }

  // Map normalized candidate stem -> { display: string, indices: Set<number> }
  const stemMap = new Map<string, { display: string; indices: Set<number> }>();

  books.forEach((book, index) => {
    const candidates = extractCandidateStems(book.title);
    candidates.forEach((stem) => {
      const key = normalizeText(stem);
      if (!key || key.length < 2) return;

      if (!stemMap.has(key)) {
        stemMap.set(key, { display: stem, indices: new Set() });
      }
      stemMap.get(key)!.indices.add(index);
    });
  });

  // Keep candidate stems that match 2 or more books.
  // Sort candidate stems by length descending to match the most specific/informative title stem first.
  const validCandidates = Array.from(stemMap.values())
    .filter((entry) => entry.indices.size >= 2)
    .sort((a, b) => b.display.length - a.display.length);

  const assignedIndices = new Set<number>();
  const groups: BookGroup[] = [];

  for (const candidate of validCandidates) {
    // Only books that haven't been assigned to a more specific group yet
    const unassigned = Array.from(candidate.indices).filter((idx) => !assignedIndices.has(idx));
    if (unassigned.length >= 2) {
      unassigned.forEach((idx) => assignedIndices.add(idx));

      // Sort books within the group numerically/alphabetically (e.g. Band 1 before Band 2)
      const groupBooks = unassigned
        .map((idx) => books[idx])
        .sort((a, b) => a.title.localeCompare(b.title, 'de', { numeric: true }));

      groups.push({
        id: normalizeText(candidate.display),
        title: candidate.display,
        books: groupBooks,
      });
    }
  }

  // Sort groups alphabetically by their title
  groups.sort((a, b) => a.title.localeCompare(b.title, 'de', { numeric: true }));

  // Standalone books (not part of any 2+ series group)
  const standalone = books.filter((_, idx) => !assignedIndices.has(idx));

  return {
    groups,
    standalone,
    hasGroups: groups.length > 0,
  };
}

/**
 * Categorizes books primarily by their Genre(s).
 * Within each genre category, books with similar titles are grouped into series accordions.
 */
export function groupBooksByGenreAndTitle(books: Book[]): GenreGroupResult[] {
  if (books.length === 0) {
    return [];
  }

  // Map each genre -> list of books belonging to that genre
  const genreMap = new Map<string, Book[]>();

  books.forEach((book) => {
    const bookGenres =
      book.genres && book.genres.length > 0 ? book.genres : [DEFAULT_FALLBACK_GENRE];

    bookGenres.forEach((genre) => {
      if (!genreMap.has(genre)) {
        genreMap.set(genre, []);
      }
      genreMap.get(genre)!.push(book);
    });
  });

  // Sort genre names alphabetically, placing the fallback genre at the end
  const sortedGenreNames = Array.from(genreMap.keys()).sort((a, b) => {
    if (a === DEFAULT_FALLBACK_GENRE) return 1;
    if (b === DEFAULT_FALLBACK_GENRE) return -1;
    return a.localeCompare(b, 'de');
  });

  // For each genre category, run groupBooksByTitle on its books
  return sortedGenreNames.map((genreName) => {
    const genreBooks = genreMap.get(genreName)!;
    const titleGrouped = groupBooksByTitle(genreBooks);

    return {
      genre: genreName,
      totalBooks: genreBooks.length,
      groups: titleGrouped.groups,
      standalone: titleGrouped.standalone,
      hasGroups: titleGrouped.hasGroups,
    };
  });
}
