import { BookCard, type Book } from '@/components/book-card';
import { Text } from '@/components/ui/text';
import { ScrollView, View } from 'react-native';

const SAMPLE_BOOKS: Book[] = [
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

export default function BookshelfTab() {
  return (
    <ScrollView className="flex-1">
      <View className="p-4 gap-4">
        <Text variant="h3">Ihre Bücher</Text>
        {SAMPLE_BOOKS.map((book) => (
          <BookCard key={book.isbn} book={book} />
        ))}
      </View>
    </ScrollView>
  );
}
