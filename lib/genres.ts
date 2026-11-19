export type GenreCategory = 'Belletristik' | 'Sachbuch' | 'Kinder & Jugend' | 'Weitere';

export type GenreDefinition = {
  id: string;
  name: string;
  category: GenreCategory;
};

export const ALL_BOOK_GENRES: GenreDefinition[] = [
  // Belletristik / Fiction
  { id: 'fantasy', name: 'Fantasy', category: 'Belletristik' },
  { id: 'scifi', name: 'Science Fiction', category: 'Belletristik' },
  { id: 'dystopie', name: 'Dystopie', category: 'Belletristik' },
  { id: 'krimi', name: 'Krimi & Thriller', category: 'Belletristik' },
  { id: 'historisch', name: 'Historischer Roman', category: 'Belletristik' },
  { id: 'romantik', name: 'Romantik / Liebesroman', category: 'Belletristik' },
  { id: 'horror', name: 'Horror & Grusel', category: 'Belletristik' },
  { id: 'abenteuer', name: 'Abenteuer', category: 'Belletristik' },
  { id: 'drama', name: 'Drama & Tragödie', category: 'Belletristik' },
  { id: 'klassiker', name: 'Klassiker', category: 'Belletristik' },
  { id: 'humor', name: 'Humor & Satire', category: 'Belletristik' },
  { id: 'kurzgeschichten', name: 'Kurzgeschichten', category: 'Belletristik' },

  // Sachbuch / Non-Fiction
  { id: 'biografie', name: 'Biografie & Memoiren', category: 'Sachbuch' },
  { id: 'philosophie', name: 'Philosophie', category: 'Sachbuch' },
  { id: 'psychologie', name: 'Psychologie', category: 'Sachbuch' },
  { id: 'geschichte', name: 'Geschichte & Politik', category: 'Sachbuch' },
  { id: 'wissenschaft', name: 'Wissenschaft & Natur', category: 'Sachbuch' },
  { id: 'wirtschaft', name: 'Wirtschaft & Finanzen', category: 'Sachbuch' },
  { id: 'ratgeber', name: 'Ratgeber & Selbsthilfe', category: 'Sachbuch' },
  { id: 'kunst', name: 'Kunst & Kultur', category: 'Sachbuch' },
  { id: 'religion', name: 'Religion & Spiritualität', category: 'Sachbuch' },

  // Kinder- & Jugendbuch
  { id: 'jugendbuch', name: 'Jugendbuch (Young Adult)', category: 'Kinder & Jugend' },
  { id: 'kinderbuch', name: 'Kinderbuch', category: 'Kinder & Jugend' },
  { id: 'maerchen', name: 'Märchen & Sagen', category: 'Kinder & Jugend' },

  // Weitere
  { id: 'lyrik', name: 'Lyrik & Poesie', category: 'Weitere' },
  { id: 'comic', name: 'Comic & Manga', category: 'Weitere' },
  { id: 'reisen', name: 'Reisebericht & Geografie', category: 'Weitere' },
  { id: 'kochen', name: 'Kochen & Genuss', category: 'Weitere' },
];

export const GENRE_NAMES: string[] = ALL_BOOK_GENRES.map((g) => g.name);

export const DEFAULT_FALLBACK_GENRE = 'Allgemein / Ohne Genre';

