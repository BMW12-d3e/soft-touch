import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Image, View } from 'react-native';

export type Book = {
  title: string;
  author: string;
  isbn: string;
  coverUri?: string;
  description?: string;
};

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="flex-row gap-0 py-0 overflow-hidden">
      {book.coverUri ? (
        <Image
          source={{ uri: book.coverUri }}
          className="w-24 rounded-l-xl"
          resizeMode="cover"
        />
      ) : (
        <View className="w-24 bg-muted rounded-l-xl items-center justify-center">
          <Text variant="muted" className="text-xs text-center px-2">
            No cover
          </Text>
        </View>
      )}
      <View className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{book.title}</CardTitle>
          <CardDescription>{book.author}</CardDescription>
        </CardHeader>
        <CardContent className="gap-1 pb-4">
          {book.description ? (
            <Text variant="muted" className="text-xs" numberOfLines={3}>
              {book.description}
            </Text>
          ) : null}
          <Text variant="muted" className="text-xs">
            ISBN: {book.isbn}
          </Text>
        </CardContent>
      </View>
    </Card>
  );
}
