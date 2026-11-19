import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Link } from 'expo-router';
import {
  BookCopy,
  BookPlus,
  ChevronDown,
  ChevronUp,
  Layers,
  Library,
  ListFilter,
  Tag,
} from 'lucide-react-native';

import { BookCard, type Book } from '@/components/book-card';
import { EditBookModal } from '@/components/edit-book-modal';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import {
  groupBooksByGenreAndTitle,
  groupBooksByTitle,
} from '@/lib/book-grouping';
import { useBooks } from '@/lib/book-store';

type ViewMode = 'genre' | 'series' | 'flat';

export default function BookshelfTab() {
  const { books, updateBook, deleteBook } = useBooks();
  const [editingBook, setEditingBook] = React.useState<Book | null>(null);

  // View mode: 'genre' (default, categorized by genre with series accordions), 'series' or 'flat'
  const [viewMode, setViewMode] = React.useState<ViewMode>('genre');
  const [selectedGenreFilter, setSelectedGenreFilter] = React.useState<string | null>(null);

  // Collapsed states for genre sections and series accordions
  const [collapsedGenres, setCollapsedGenres] = React.useState<Record<string, boolean>>({});
  const [collapsedSeries, setCollapsedSeries] = React.useState<Record<string, boolean>>({});

  // Compute groupings
  const genreGroupedResult = React.useMemo(
    () => groupBooksByGenreAndTitle(books),
    [books]
  );
  const titleGroupedResult = React.useMemo(() => groupBooksByTitle(books), [books]);

  // Filtered genre categories if a specific genre pill is active
  const displayedGenreGroups = React.useMemo(() => {
    if (!selectedGenreFilter) return genreGroupedResult;
    return genreGroupedResult.filter((g) => g.genre === selectedGenreFilter);
  }, [genreGroupedResult, selectedGenreFilter]);

  function handleSaveEdit(originalIsbn: string, updatedBook: Book) {
    updateBook(originalIsbn, updatedBook);
    setEditingBook(null);
  }

  function handleDeleteBook(isbn: string) {
    deleteBook(isbn);
    setEditingBook(null);
  }

  function toggleGenreCollapse(genreName: string) {
    setCollapsedGenres((prev) => ({
      ...prev,
      [genreName]: !prev[genreName],
    }));
  }

  function toggleSeriesCollapse(seriesKey: string) {
    setCollapsedSeries((prev) => ({
      ...prev,
      [seriesKey]: !prev[seriesKey],
    }));
  }

  return (
    <>
      <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4 pb-12 gap-4">
        {/* Header with Title and View Switcher */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text variant="h3">Ihre Bücher</Text>
              <Text variant="muted" className="text-xs mt-0.5">
                {books.length} {books.length === 1 ? 'Buch' : 'Bücher'}
                {viewMode === 'genre' && genreGroupedResult.length > 0
                  ? ` • ${genreGroupedResult.length} ${
                      genreGroupedResult.length === 1 ? 'Genre' : 'Genres'
                    }`
                  : ''}
              </Text>
            </View>

            {/* View Mode Switcher */}
            {books.length > 0 && (
              <View className="flex-row items-center bg-muted/60 p-0.5 rounded-full border border-border">
                <Button
                  variant={viewMode === 'genre' ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-7 px-2.5 rounded-full flex-row items-center gap-1 ${
                    viewMode === 'genre' ? 'shadow-xs' : ''
                  }`}
                  onPress={() => setViewMode('genre')}
                >
                  <Icon
                    as={Tag}
                    className={`size-3 ${
                      viewMode === 'genre' ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  />
                  <Text
                    className={`text-[11px] font-medium ${
                      viewMode === 'genre' ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    Nach Genre
                  </Text>
                </Button>

                <Button
                  variant={viewMode === 'series' ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-7 px-2.5 rounded-full flex-row items-center gap-1 ${
                    viewMode === 'series' ? 'shadow-xs' : ''
                  }`}
                  onPress={() => setViewMode('series')}
                >
                  <Icon
                    as={Layers}
                    className={`size-3 ${
                      viewMode === 'series' ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  />
                  <Text
                    className={`text-[11px] font-medium ${
                      viewMode === 'series' ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    Reihen
                  </Text>
                </Button>

                <Button
                  variant={viewMode === 'flat' ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-7 px-2.5 rounded-full flex-row items-center gap-1 ${
                    viewMode === 'flat' ? 'shadow-xs' : ''
                  }`}
                  onPress={() => setViewMode('flat')}
                >
                  <Icon
                    as={ListFilter}
                    className={`size-3 ${
                      viewMode === 'flat' ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  />
                  <Text
                    className={`text-[11px] font-medium ${
                      viewMode === 'flat' ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    Flach
                  </Text>
                </Button>
              </View>
            )}
          </View>

          {/* Quick Genre Filter Bar (when in genre mode) */}
          {viewMode === 'genre' && genreGroupedResult.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row gap-1.5 py-1"
            >
              <Pressable
                onPress={() => setSelectedGenreFilter(null)}
                className={`px-3 py-1 rounded-full border text-xs font-medium mr-1.5 ${
                  selectedGenreFilter === null
                    ? 'bg-primary border-primary'
                    : 'bg-muted/40 border-border active:bg-muted'
                }`}
              >
                <Text
                  className={`text-xs ${
                    selectedGenreFilter === null
                      ? 'text-primary-foreground font-semibold'
                      : 'text-foreground'
                  }`}
                >
                  Alle Genres ({books.length})
                </Text>
              </Pressable>

              {genreGroupedResult.map((g) => {
                const isSelected = selectedGenreFilter === g.genre;
                return (
                  <Pressable
                    key={g.genre}
                    onPress={() =>
                      setSelectedGenreFilter(isSelected ? null : g.genre)
                    }
                    className={`px-3 py-1 rounded-full border text-xs font-medium mr-1.5 ${
                      isSelected
                        ? 'bg-primary border-primary'
                        : 'bg-muted/40 border-border active:bg-muted'
                    }`}
                  >
                    <Text
                      className={`text-xs ${
                        isSelected
                          ? 'text-primary-foreground font-semibold'
                          : 'text-foreground'
                      }`}
                    >
                      {g.genre} ({g.totalBooks})
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Empty State */}
        {books.length === 0 ? (
          <View className="items-center justify-center p-8 border border-dashed border-border rounded-xl gap-3 bg-muted/20 mt-4">
            <View className="size-14 rounded-full bg-muted items-center justify-center">
              <Icon as={Library} className="size-7 text-muted-foreground" />
            </View>
            <View className="items-center gap-1">
              <Text className="text-base font-semibold text-foreground text-center">
                Ihr Bücherregal ist leer
              </Text>
              <Text variant="muted" className="text-xs text-center max-w-xs">
                Sie haben alle Bücher gelöscht oder noch keine hinzugefügt.
              </Text>
            </View>
            <Link href="/book/add" asChild>
              <Button size="sm" className="mt-2 flex-row items-center gap-1.5">
                <Icon as={BookPlus} className="size-4 text-primary-foreground" />
                <Text>Neues Buch hinzufügen</Text>
              </Button>
            </Link>
          </View>
        ) : viewMode === 'genre' ? (
          /* =========================================================================
           * 1. GENRE CATEGORIZATION VIEW (Hierarchical: Genre -> Series Accordion -> Books)
           * ========================================================================= */
          <View className="gap-5">
            {displayedGenreGroups.map((genreGroup) => {
              const isGenreCollapsed = Boolean(collapsedGenres[genreGroup.genre]);

              return (
                <View
                  key={genreGroup.genre}
                  className="rounded-2xl border border-border/80 bg-card p-4 gap-3 shadow-xs"
                >
                  {/* Genre Category Header */}
                  <Pressable
                    onPress={() => toggleGenreCollapse(genreGroup.genre)}
                    className="flex-row items-center justify-between active:opacity-80"
                  >
                    <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                      <View className="size-8 rounded-lg bg-primary/10 items-center justify-center">
                        <Icon as={Tag} className="size-4 text-primary" />
                      </View>
                      <View className="flex-row items-center gap-2 flex-wrap">
                        <Text className="text-lg font-bold text-foreground">
                          {genreGroup.genre}
                        </Text>
                        <View className="bg-secondary px-2 py-0.5 rounded-full border border-border/60">
                          <Text className="text-[11px] font-semibold text-secondary-foreground">
                            {genreGroup.totalBooks}{' '}
                            {genreGroup.totalBooks === 1 ? 'Buch' : 'Bücher'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="size-7 rounded-full bg-muted items-center justify-center">
                      <Icon
                        as={isGenreCollapsed ? ChevronDown : ChevronUp}
                        className="size-4 text-muted-foreground"
                      />
                    </View>
                  </Pressable>

                  {/* Genre Category Body */}
                  {!isGenreCollapsed && (
                    <View className="gap-3.5 pt-1">
                      {/* Similar Books / Series Accordions inside this Genre */}
                      {genreGroup.groups.map((group) => {
                        const seriesKey = `${genreGroup.genre}-${group.id}`;
                        const isSeriesCollapsed = Boolean(collapsedSeries[seriesKey]);

                        return (
                          <View
                            key={seriesKey}
                            className="rounded-xl border border-border/70 bg-muted/20 p-3 gap-2.5"
                          >
                            {/* Accordion Header for Similar Books Group */}
                            <Pressable
                              onPress={() => toggleSeriesCollapse(seriesKey)}
                              className="flex-row items-center justify-between py-1 active:opacity-75"
                            >
                              <View className="flex-row items-center gap-2 flex-1 pr-2">
                                <View className="size-7 rounded-md bg-primary/10 items-center justify-center">
                                  <Icon as={BookCopy} className="size-3.5 text-primary" />
                                </View>
                                <View className="flex-1">
                                  <View className="flex-row items-center gap-2 flex-wrap">
                                    <Text className="text-sm font-bold text-foreground">
                                      {group.title}
                                    </Text>
                                    <View className="bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-md">
                                      <Text className="text-[10px] font-semibold text-primary">
                                        {group.books.length} Bände
                                      </Text>
                                    </View>
                                  </View>
                                  <Text variant="muted" className="text-[11px]">
                                    Buchreihe in {genreGroup.genre}
                                  </Text>
                                </View>
                              </View>

                              {/* Accordion Arrow Indicator */}
                              <View className="size-6 rounded-full bg-muted items-center justify-center">
                                <Icon
                                  as={isSeriesCollapsed ? ChevronDown : ChevronUp}
                                  className="size-3.5 text-muted-foreground"
                                />
                              </View>
                            </Pressable>

                            {/* Accordion Content: Books in this group */}
                            {!isSeriesCollapsed && (
                              <View className="gap-2.5 pt-1 pl-1">
                                {group.books.map((book) => (
                                  <BookCard
                                    key={`${genreGroup.genre}-${book.isbn}`}
                                    book={book}
                                    onEdit={(targetBook) => setEditingBook(targetBook)}
                                  />
                                ))}
                              </View>
                            )}
                          </View>
                        );
                      })}

                      {/* Standalone Books in this Genre */}
                      {genreGroup.standalone.length > 0 && (
                        <View className="gap-2 pt-1">
                          {genreGroup.groups.length > 0 && (
                            <Text className="text-xs font-semibold text-muted-foreground px-1">
                              Einzelbände ({genreGroup.standalone.length})
                            </Text>
                          )}
                          <View className="gap-2.5">
                            {genreGroup.standalone.map((book) => (
                              <BookCard
                                key={`${genreGroup.genre}-${book.isbn}`}
                                book={book}
                                onEdit={(targetBook) => setEditingBook(targetBook)}
                              />
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : viewMode === 'series' ? (
          /* =========================================================================
           * 2. SERIES / TITLE CLUSTERS VIEW
           * ========================================================================= */
          <View className="gap-4">
            {titleGroupedResult.groups.map((group) => {
              const isCollapsed = Boolean(collapsedSeries[group.id]);
              return (
                <View
                  key={group.id}
                  className="rounded-2xl border border-border bg-card p-3.5 gap-3 shadow-xs"
                >
                  <Pressable
                    onPress={() => toggleSeriesCollapse(group.id)}
                    className="flex-row items-center justify-between py-1 active:opacity-80"
                  >
                    <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                      <View className="size-9 rounded-xl bg-primary/10 items-center justify-center">
                        <Icon as={BookCopy} className="size-4 text-primary" />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 flex-wrap">
                          <Text className="text-base font-bold text-foreground">
                            {group.title}
                          </Text>
                          <View className="bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                            <Text className="text-[11px] font-semibold text-primary">
                              {group.books.length} Bände
                            </Text>
                          </View>
                        </View>
                        <Text variant="muted" className="text-xs">
                          Buchreihe
                        </Text>
                      </View>
                    </View>

                    <View className="size-7 rounded-full bg-muted items-center justify-center">
                      <Icon
                        as={isCollapsed ? ChevronDown : ChevronUp}
                        className="size-4 text-muted-foreground"
                      />
                    </View>
                  </Pressable>

                  {!isCollapsed && (
                    <View className="gap-2.5 pt-1 pl-1">
                      {group.books.map((book) => (
                        <BookCard
                          key={book.isbn}
                          book={book}
                          onEdit={(targetBook) => setEditingBook(targetBook)}
                        />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}

            {titleGroupedResult.standalone.length > 0 && (
              <View className="gap-2.5 pt-1">
                <Text className="text-sm font-semibold text-muted-foreground px-1">
                  Einzelbände ({titleGroupedResult.standalone.length})
                </Text>
                {titleGroupedResult.standalone.map((book) => (
                  <BookCard
                    key={book.isbn}
                    book={book}
                    onEdit={(targetBook) => setEditingBook(targetBook)}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          /* =========================================================================
           * 3. FLAT LIST VIEW
           * ========================================================================= */
          <View className="gap-3">
            {books.map((book) => (
              <BookCard
                key={book.isbn}
                book={book}
                onEdit={(targetBook) => setEditingBook(targetBook)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Book Info / Edit Modal */}
      <EditBookModal
        book={editingBook}
        visible={Boolean(editingBook)}
        onClose={() => setEditingBook(null)}
        onSave={handleSaveEdit}
        onDelete={handleDeleteBook}
      />
    </>
  );
}
