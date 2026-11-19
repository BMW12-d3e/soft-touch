import * as React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { Check, ChevronDown, Search, Tag, X } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { ALL_BOOK_GENRES, type GenreCategory } from '@/lib/genres';

type GenreSelectProps = {
  selectedGenres: string[];
  onChange: (genres: string[]) => void;
  label?: string;
  placeholder?: string;
};

const CATEGORY_ORDER: GenreCategory[] = [
  'Belletristik',
  'Sachbuch',
  'Kinder & Jugend',
  'Weitere',
];

export function GenreSelect({
  selectedGenres = [],
  onChange,
  label = 'Genres',
  placeholder = 'Genres auswählen (Mehrfachauswahl)...',
}: GenreSelectProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredGenres = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ALL_BOOK_GENRES;
    return ALL_BOOK_GENRES.filter(
      (g) =>
        g.name.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group filtered genres by category
  const groupedByCategory = React.useMemo(() => {
    const map = new Map<GenreCategory, typeof ALL_BOOK_GENRES>();
    for (const cat of CATEGORY_ORDER) {
      map.set(cat, []);
    }
    for (const genre of filteredGenres) {
      if (!map.has(genre.category)) {
        map.set(genre.category, []);
      }
      map.get(genre.category)!.push(genre);
    }
    return map;
  }, [filteredGenres]);

  function toggleGenre(genreName: string) {
    if (selectedGenres.includes(genreName)) {
      onChange(selectedGenres.filter((g) => g !== genreName));
    } else {
      onChange([...selectedGenres, genreName]);
    }
  }

  function removeGenre(genreName: string) {
    onChange(selectedGenres.filter((g) => g !== genreName));
  }

  return (
    <View className="gap-1.5">
      {label && <Label>{label}</Label>}

      {/* Trigger Field */}
      <Pressable
        onPress={() => setModalOpen(true)}
        className="min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs active:bg-muted/30"
      >
        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-1 flex-row flex-wrap items-center gap-1.5">
            {selectedGenres.length === 0 ? (
              <View className="flex-row items-center gap-2">
                <Icon as={Tag} className="size-4 text-muted-foreground/60" />
                <Text className="text-sm text-muted-foreground">{placeholder}</Text>
              </View>
            ) : (
              selectedGenres.map((genre) => (
                <View
                  key={genre}
                  className="flex-row items-center gap-1 rounded-md bg-secondary border border-border px-2 py-0.5"
                >
                  <Text className="text-xs font-medium text-secondary-foreground">
                    {genre}
                  </Text>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      removeGenre(genre);
                    }}
                    hitSlop={8}
                    className="rounded-full p-0.5 active:bg-muted"
                  >
                    <Icon as={X} className="size-3 text-muted-foreground hover:text-foreground" />
                  </Pressable>
                </View>
              ))
            )}
          </View>
          <Icon as={ChevronDown} className="size-4 text-muted-foreground shrink-0" />
        </View>
      </Pressable>

      {/* Multi-Select Dropdown Modal */}
      <Modal
        visible={modalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 p-4">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="w-full max-w-md max-h-[85%]"
          >
            <Card className="w-full overflow-hidden shadow-2xl border-border bg-card">
              {/* Header */}
              <CardHeader className="flex-row items-center justify-between pb-3 border-b border-border">
                <View className="flex-1 pr-2">
                  <CardTitle className="text-base">Genres auswählen</CardTitle>
                  <Text variant="muted" className="text-xs mt-0.5">
                    {selectedGenres.length}{' '}
                    {selectedGenres.length === 1 ? 'Genre ausgewählt' : 'Genres ausgewählt'}
                  </Text>
                </View>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full"
                  onPress={() => setModalOpen(false)}
                >
                  <Icon as={X} className="size-5 text-muted-foreground" />
                </Button>
              </CardHeader>

              {/* Search Bar */}
              <View className="px-4 pt-3 pb-2">
                <View className="flex-row items-center rounded-lg border border-input bg-muted/30 px-2.5">
                  <Icon as={Search} className="size-4 text-muted-foreground mr-2" />
                  <Input
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Genre suchen..."
                    className="border-0 bg-transparent shadow-none px-0 h-9 text-xs focus-visible:ring-0"
                    autoFocus={Platform.OS === 'web'}
                  />
                  {searchQuery ? (
                    <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
                      <Icon as={X} className="size-3.5 text-muted-foreground" />
                    </Pressable>
                  ) : null}
                </View>
              </View>

              {/* Genre Items List */}
              <ScrollView
                className="max-h-[360px]"
                contentContainerClassName="p-4 pt-1 gap-4"
                keyboardShouldPersistTaps="handled"
              >
                {CATEGORY_ORDER.map((category) => {
                  const genres = groupedByCategory.get(category) || [];
                  if (genres.length === 0) return null;

                  return (
                    <View key={category} className="gap-1.5">
                      <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
                        {category}
                      </Text>
                      <View className="gap-1">
                        {genres.map((genre) => {
                          const isSelected = selectedGenres.includes(genre.name);
                          return (
                            <Pressable
                              key={genre.id}
                              onPress={() => toggleGenre(genre.name)}
                              className={`flex-row items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
                                isSelected
                                  ? 'bg-primary/10 border-primary/40'
                                  : 'bg-card border-transparent hover:bg-muted/40 active:bg-muted/60'
                              }`}
                            >
                              <View className="flex-row items-center gap-2 flex-1 pr-2">
                                <View
                                  className={`size-4 rounded border items-center justify-center ${
                                    isSelected
                                      ? 'bg-primary border-primary'
                                      : 'border-muted-foreground/40'
                                  }`}
                                >
                                  {isSelected && (
                                    <Icon as={Check} className="size-3 text-primary-foreground" />
                                  )}
                                </View>
                                <Text
                                  className={`text-sm ${
                                    isSelected
                                      ? 'font-semibold text-primary'
                                      : 'text-foreground'
                                  }`}
                                >
                                  {genre.name}
                                </Text>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}

                {filteredGenres.length === 0 && (
                  <View className="items-center py-6">
                    <Text variant="muted" className="text-xs">
                      Keine Genres gefunden für &quot;{searchQuery}&quot;.
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* Footer */}
              <CardFooter className="flex-row items-center justify-between p-3.5 border-t border-border bg-muted/10">
                {selectedGenres.length > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground"
                    onPress={() => onChange([])}
                  >
                    <Text className="text-xs">Alle abwählen</Text>
                  </Button>
                ) : (
                  <View />
                )}
                <Button
                  size="sm"
                  className="h-8 px-4"
                  onPress={() => setModalOpen(false)}
                >
                  <Text className="text-xs font-semibold">
                    Fertig ({selectedGenres.length})
                  </Text>
                </Button>
              </CardFooter>
            </Card>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

