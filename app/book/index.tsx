import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { BookCard, type Book } from '@/components/book-card';
import { EditBookModal } from '@/components/edit-book-modal';
import { Text } from '@/components/ui/text';
import { useBooks } from '@/lib/book-store';

export default function BookshelfTab() {
  const { books, updateBook } = useBooks();
  const [editingBook, setEditingBook] = React.useState<Book | null>(null);

  function handleSaveEdit(originalIsbn: string, updatedBook: Book) {
    updateBook(originalIsbn, updatedBook);
    setEditingBook(null);
  }

  return (
    <>
      <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4 pb-12 gap-4">
        <View className="flex-row items-baseline justify-between">
          <Text variant="h3">Ihre Bücher</Text>
          <Text variant="muted" className="text-sm">
            {books.length} {books.length === 1 ? 'Buch' : 'Bücher'}
          </Text>
        </View>

        <View className="gap-3">
          {books.map((book) => (
            <BookCard
              key={book.isbn}
              book={book}
              onEdit={(targetBook) => setEditingBook(targetBook)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Edit Book Modal */}
      <EditBookModal
        book={editingBook}
        visible={Boolean(editingBook)}
        onClose={() => setEditingBook(null)}
        onSave={handleSaveEdit}
      />
    </>
  );
}
