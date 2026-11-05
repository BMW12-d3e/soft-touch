import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Pencil } from 'lucide-react-native';
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
  onEdit?: (book: Book) => void;
};

export function BookCard({ book, onEdit }: BookCardProps) {
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
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-1">
              <CardTitle className="text-base">{book.title}</CardTitle>
              <CardDescription>{book.author}</CardDescription>
            </View>
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full -mt-1 -mr-2 active:bg-accent"
                onPress={() => onEdit(book)}
                accessibilityLabel="Buch bearbeiten"
              >
                <Icon as={Pencil} className="size-4 text-muted-foreground" />
              </Button>
            )}
          </View>
        </CardHeader>
        <CardContent className="gap-1 pb-4">
          {book.description ? (
            <Text variant="muted" className="text-xs" numberOfLines={3}>
              {book.description}
            </Text>
          ) : null}
          <View className="flex-row items-center justify-between mt-1">
            <Text variant="muted" className="text-xs">
              ISBN: {book.isbn}
            </Text>
            {onEdit && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0"
                onPress={() => onEdit(book)}
              >
                <Text className="text-xs text-primary underline">Bearbeiten</Text>
              </Button>
            )}
          </View>
        </CardContent>
      </View>
    </Card>
  );
}
