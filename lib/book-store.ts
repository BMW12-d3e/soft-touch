import { useSyncExternalStore } from 'react';
import type { Book } from '@/components/book-card';

export const INITIAL_BOOKS: Book[] = [
  {
    title: 'Der Prozess',
    author: 'Franz Kafka',
    isbn: '978-3-15-009676-7',
    coverUri: 'https://covers.openlibrary.org/b/isbn/9783150096767-M.jpg',
    description:
      'Josef K. wird eines Morgens verhaftet, ohne dass er weiß, was ihm vorgeworfen wird.',
  },
  {
    title: 'Faust I',
    author: 'Johann Wolfgang von Goethe',
    isbn: '978-3-15-000001-3',
    description: 'Das Meisterwerk der deutschen Literatur.',
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
