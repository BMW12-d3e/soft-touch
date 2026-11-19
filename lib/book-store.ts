import { useSyncExternalStore } from 'react';
import type { Book } from '@/components/book-card';

export const INITIAL_BOOKS: Book[] = [
  // Gruppe 1: Buch der Träume (3 Bände - Fantasy / Jugendbuch / Romantik)
  {
    title: 'Buch der Träume: Band 1 - Das Erwachen',
    author: 'Kerstin Gier',
    isbn: '978-3-596-52100-5',
    coverUri: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80',
    description: 'Liv Silber zieht nach London und entdeckt die geheime Welt der Träume, in der finstere Rituale lauern.',
    genres: ['Fantasy', 'Jugendbuch (Young Adult)', 'Romantik / Liebesroman'],
  },
  {
    title: 'Buch der Träume: Band 2 - Das Portal',
    author: 'Kerstin Gier',
    isbn: '978-3-596-52101-2',
    coverUri: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80',
    description: 'Das Rätsel um die Traumtüren vertieft sich, während eine geheimnisvolle Gefahr Livs Familie bedroht.',
    genres: ['Fantasy', 'Jugendbuch (Young Adult)', 'Romantik / Liebesroman'],
  },
  {
    title: 'Buch der Träume: Band 3 - Die Ewigkeit',
    author: 'Kerstin Gier',
    isbn: '978-3-596-52102-9',
    coverUri: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&auto=format&fit=crop&q=80',
    description: 'Das fulminante Finale der Traumtrilogie: Liv muss das ultimative Opfer bringen, um die Traumwelt zu retten.',
    genres: ['Fantasy', 'Jugendbuch (Young Adult)', 'Romantik / Liebesroman'],
  },

  // Gruppe 2: Projekt Chronos (2 Bände - Science Fiction / Dystopie / Wissenschaft)
  {
    title: 'Projekt Chronos 1: Der Sprung',
    author: 'Dr. Elena Vance',
    isbn: '978-3-453-31901-1',
    coverUri: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    description: 'Der erste erfolgreiche Quantensprung durch die Raumzeit öffnet ein Tor in eine gefährliche Paralleldimension.',
    genres: ['Science Fiction', 'Dystopie', 'Wissenschaft & Natur'],
  },
  {
    title: 'Projekt Chronos 2: Die Zeitschleife',
    author: 'Dr. Elena Vance',
    isbn: '978-3-453-31902-8',
    coverUri: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&auto=format&fit=crop&q=80',
    description: 'Gefangen im Jahr 2184 versucht das Forschungsteam, den drohenden temporalen Kollaps der Gegenwart abzuwenden.',
    genres: ['Science Fiction', 'Dystopie', 'Wissenschaft & Natur'],
  },

  // Gruppe 3: Faust (2 Bände - Klassiker / Drama / Lyrik)
  {
    title: 'Faust I',
    author: 'Johann Wolfgang von Goethe',
    isbn: '978-3-15-000001-3',
    coverUri: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&auto=format&fit=crop&q=80',
    description: 'Der Gelehrte Heinrich Faust schließt einen verhängnisvollen Pakt mit Mephisto auf der Suche nach Erfüllung.',
    genres: ['Klassiker', 'Drama & Tragödie', 'Lyrik & Poesie'],
  },
  {
    title: 'Faust II',
    author: 'Johann Wolfgang von Goethe',
    isbn: '978-3-15-000002-0',
    coverUri: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&auto=format&fit=crop&q=80',
    description: 'Der zweite Teil der Tragödie führt durch antike Mythen, kaiserliche Höfe und Fausts Erlösung.',
    genres: ['Klassiker', 'Drama & Tragödie', 'Lyrik & Poesie'],
  },

  // Gruppe 4: Schatten über Berlin (2 Bände - Krimi & Thriller)
  {
    title: 'Schatten über Berlin - Fall 1: Kaltes Blut',
    author: 'Kommissar Jan Weber',
    isbn: '978-3-499-27001-4',
    coverUri: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&auto=format&fit=crop&q=80',
    description: 'Ein mysteriöser Mordfall an der Spree bringt die dunkelsten Geheimnisse der Berliner Unterwelt ans Licht.',
    genres: ['Krimi & Thriller'],
  },
  {
    title: 'Schatten über Berlin - Fall 2: Stille Zeugen',
    author: 'Kommissar Jan Weber',
    isbn: '978-3-499-27002-1',
    coverUri: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&auto=format&fit=crop&q=80',
    description: 'Als ein Kronzeuge spurlos verschwindet, beginnt für Ermittler Weber ein gnadenloser Wettlauf gegen die Zeit.',
    genres: ['Krimi & Thriller'],
  },

  // Einzelbände (Diverse Genres & Themen)
  {
    title: 'Der Prozess',
    author: 'Franz Kafka',
    isbn: '978-3-15-009676-7',
    coverUri: 'https://covers.openlibrary.org/b/isbn/9783150096767-M.jpg',
    description: 'Josef K. wird eines Morgens verhaftet, ohne dass er erfährt, was ihm zur Last gelegt wird.',
    genres: ['Klassiker', 'Drama & Tragödie', 'Philosophie'],
  },
  {
    title: 'Echo der Sterne',
    author: 'Aria Thorne',
    isbn: '978-3-551-58401-2',
    coverUri: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&auto=format&fit=crop&q=80',
    description: 'Eine interstellare Expedition empfängt Signale einer ausgestorbenen Zivilisation am Rande der bekannten Galaxie.',
    genres: ['Science Fiction', 'Abenteuer'],
  },
  {
    title: 'Nebel über London',
    author: 'Arthur Conan Blake',
    isbn: '978-3-423-28102-3',
    coverUri: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&auto=format&fit=crop&q=80',
    description: 'Viktorianisches London im Jahr 1888: Im dichten Herbstnebel geschehen unheimliche Diebstähle alter Artefakte.',
    genres: ['Krimi & Thriller', 'Historischer Roman'],
  },
  {
    title: 'Digitale Seelen',
    author: 'Marcus Chen',
    isbn: '978-3-446-26701-0',
    coverUri: 'https://images.unsplash.com/photo-1507842229452-7b56ff1f73b6?w=400&auto=format&fit=crop&q=80',
    description: 'Über das menschliche Bewusstsein im Zeitalter denkender Maschinen und die Frage, was uns unersetzlich macht.',
    genres: ['Dystopie', 'Philosophie', 'Wissenschaft & Natur'],
  },
  {
    title: 'Der Klang der Stille',
    author: 'Sophia Lindner',
    isbn: '978-3-518-42801-9',
    coverUri: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=400&auto=format&fit=crop&q=80',
    description: 'Feinsinnige Gedichte und Aphorismen über Einsamkeit, Neuanfänge und die leisen Momente des Lebens.',
    genres: ['Lyrik & Poesie', 'Kunst & Kultur'],
  },
  {
    title: 'Der Geist der Aufklärung',
    author: 'Immanuel Stern',
    isbn: '978-3-7873-3501-1',
    coverUri: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=80',
    description: 'Eine zeitgemäße Reflexion über Vernunft, Mündigkeit und demokratische Werte im 21. Jahrhundert.',
    genres: ['Philosophie', 'Geschichte & Politik'],
  },
  {
    title: 'Spuren im Schnee',
    author: 'Lukas Berggren',
    isbn: '978-3-492-40501-8',
    coverUri: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&auto=format&fit=crop&q=80',
    description: 'Allein durch die endlosen Weiten Grönlands: Der packende Erlebnisbericht einer 800-Kilometer-Skiexpedition.',
    genres: ['Abenteuer', 'Biografie & Memoiren'],
  },
];

export const PRESET_COVERS = [
  {
    id: 'kafka-prozess',
    label: 'Der Prozess',
    uri: 'https://covers.openlibrary.org/b/isbn/9783150096767-M.jpg',
  },
  {
    id: 'kafka-verwandlung',
    label: 'Verwandlung',
    uri: 'https://covers.openlibrary.org/b/isbn/9783150099003-M.jpg',
  },
  {
    id: 'vintage',
    label: 'Vintage Buch',
    uri: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'modern',
    label: 'Moderne Kunst',
    uri: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&auto=format&fit=crop&q=80',
  },
];

// In-memory array of books
let booksStore: Book[] = [...INITIAL_BOOKS];

// Set of reactive subscribers
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Book[] {
  return booksStore;
}

/**
 * Add a new book to the in-memory store.
 * Places the newest book at the beginning of the list.
 */
export function addBookToStore(newBook: Book): Book {
  const bookWithDefaults: Book = {
    ...newBook,
    isbn: newBook.isbn?.trim() ? newBook.isbn.trim() : `MEM-${Date.now().toString(36).toUpperCase()}`,
  };

  booksStore = [bookWithDefaults, ...booksStore];
  emitChange();
  return bookWithDefaults;
}

/**
 * Update an existing book in the in-memory store.
 * Matches by the original ISBN and updates all fields.
 */
export function updateBookInStore(originalIsbn: string, updatedBook: Book): Book {
  const finalUpdated: Book = {
    ...updatedBook,
    isbn: updatedBook.isbn?.trim() ? updatedBook.isbn.trim() : originalIsbn,
  };

  booksStore = booksStore.map((book) => (book.isbn === originalIsbn ? finalUpdated : book));
  emitChange();
  return finalUpdated;
}

/**
 * Remove a book from the in-memory store by ISBN.
 */
export function deleteBookFromStore(isbn: string): void {
  booksStore = booksStore.filter((book) => book.isbn !== isbn);
  emitChange();
}

/**
 * Reset store to initial seed books.
 */
export function resetBooksStore(): void {
  booksStore = [...INITIAL_BOOKS];
  emitChange();
}

/**
 * Reactive hook to access and mutate the in-memory books store.
 */
export function useBooks() {
  const books = useSyncExternalStore(subscribe, getSnapshot, () => INITIAL_BOOKS);

  return {
    books,
    addBook: addBookToStore,
    updateBook: updateBookInStore,
    deleteBook: deleteBookFromStore,
    resetBooks: resetBooksStore,
  };
}
