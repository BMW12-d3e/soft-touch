import * as React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  BookPlus,
  CheckCircle2,
  Image as ImageIcon,
  Library,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react-native';

import { BookCard, type Book } from '@/components/book-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { PRESET_COVERS, useBooks } from '@/lib/book-store';

export default function AddBookTab() {
  const router = useRouter();
  const { addBook } = useBooks();

  // Form input states
  const [title, setTitle] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [isbn, setIsbn] = React.useState('');
  const [coverUri, setCoverUri] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [showUrlFallback, setShowUrlFallback] = React.useState(false);

  // UI status states
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [lastAddedBook, setLastAddedBook] = React.useState<Book | null>(null);
  const [recentlyAdded, setRecentlyAdded] = React.useState<Book[]>([]);

  // Input refs for keyboard navigation and file input
  const authorInputRef = React.useRef<TextInput>(null);
  const isbnInputRef = React.useRef<TextInput>(null);
  const descriptionInputRef = React.useRef<TextInput>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  function resetForm() {
    setTitle('');
    setAuthor('');
    setIsbn('');
    setCoverUri('');
    setDescription('');
    setShowUrlFallback(false);
    setErrorMessage(null);
  }

  function handleAddAnother() {
    resetForm();
    setLastAddedBook(null);
  }

  // Handle image upload from device (Web file input)
  function handleWebFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Read the file as an in-memory Data URL without persisting to disk or server
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setCoverUri(dataUrl);
      }
    };
    reader.readAsDataURL(file);

    // Reset input so re-selecting the same file also triggers onChange
    event.target.value = '';
  }

  function handleTriggerPickImage() {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleSubmit() {
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedTitle || !trimmedAuthor) {
      setErrorMessage('Bitte geben Sie mindestens Titel und Autor ein.');
      return;
    }

    setErrorMessage(null);

    const newBook: Book = {
      title: trimmedTitle,
      author: trimmedAuthor,
      isbn: isbn.trim(),
      coverUri: coverUri.trim() || undefined,
      description: description.trim() || undefined,
    };

    // Commit to in-memory store
    const saved = addBook(newBook);
    setLastAddedBook(saved);
    setRecentlyAdded((prev) => [saved, ...prev]);
    resetForm();
  }

  // Pre-fill a sample book for quick testing
  function handleFillSample() {
    setTitle('Die Verwandlung');
    setAuthor('Franz Kafka');
    setIsbn('978-3-15-009900-3');
    setCoverUri('https://covers.openlibrary.org/b/isbn/9783150099003-M.jpg');
    setDescription(
      'Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheuren Ungeziefer verwandelt.'
    );
    setErrorMessage(null);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="p-4 pb-12 gap-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Hidden Web file input to trigger native file dialog */}
        {Platform.OS === 'web' && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleWebFileChange}
          />
        )}

        {/* Header */}
        <View className="gap-1">
          <View className="flex-row items-center justify-between">
            <Text variant="h3">Add Book</Text>
            <Button
              variant="outline"
              size="sm"
              onPress={handleFillSample}
              className="flex-row items-center gap-1.5"
            >
              <Icon as={Sparkles} className="size-3.5 text-muted-foreground" />
              <Text className="text-xs">Beispiel einfügen</Text>
            </Button>
          </View>
          <Text variant="muted">
            Fügen Sie ein neues Buch zu Ihrer persönlichen Bibliothek hinzu.
          </Text>
        </View>

        {/* Success Banner when a book was added */}
        {lastAddedBook && (
          <Card className="border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/20">
            <CardHeader className="pb-3">
              <View className="flex-row items-center gap-2">
                <Icon as={CheckCircle2} className="size-5 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-base text-emerald-900 dark:text-emerald-200">
                  Buch erfolgreich hinzugefügt!
                </CardTitle>
              </View>
              <CardDescription className="text-emerald-800/80 dark:text-emerald-300/80">
                &quot;{lastAddedBook.title}&quot; wurde im In-Memory-Speicher abgelegt.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-3 pt-0">
              <BookCard book={lastAddedBook} />
              <View className="flex-row gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onPress={handleAddAnother}
                >
                  <Icon as={BookPlus} className="size-4 mr-1.5" />
                  <Text>Weiteres Buch</Text>
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onPress={() => router.push('/book')}
                >
                  <Icon as={Library} className="size-4 mr-1.5 text-primary-foreground" />
                  <Text>Zum Regal</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Add Book Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Buchdetails eingeben</CardTitle>
            <CardDescription>
              Pflichtfelder sind mit einem Sternchen (*) markiert.
            </CardDescription>
          </CardHeader>

          <CardContent className="gap-5">
            {/* Error Message */}
            {errorMessage ? (
              <View className="rounded-md bg-destructive/15 p-3 border border-destructive/30">
                <Text className="text-destructive text-sm font-medium">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* Title Input */}
            <View className="gap-1.5">
              <Label htmlFor="book-title">Titel *</Label>
              <Input
                id="book-title"
                value={title}
                onChangeText={setTitle}
                placeholder="z.B. Die Verwandlung"
                returnKeyType="next"
                onSubmitEditing={() => authorInputRef.current?.focus()}
              />
            </View>

            {/* Author Input */}
            <View className="gap-1.5">
              <Label htmlFor="book-author">Autor *</Label>
              <Input
                ref={authorInputRef}
                id="book-author"
                value={author}
                onChangeText={setAuthor}
                placeholder="z.B. Franz Kafka"
                returnKeyType="next"
                onSubmitEditing={() => isbnInputRef.current?.focus()}
              />
            </View>

            {/* ISBN Input */}
            <View className="gap-1.5">
              <Label htmlFor="book-isbn">ISBN (optional)</Label>
              <Input
                ref={isbnInputRef}
                id="book-isbn"
                value={isbn}
                onChangeText={setIsbn}
                placeholder="z.B. 978-3-15-009676-7"
                keyboardType="numbers-and-punctuation"
                returnKeyType="next"
                onSubmitEditing={() => descriptionInputRef.current?.focus()}
              />
            </View>

            {/* Cover Image Input (In-Memory Image Selection) */}
            <View className="gap-2">
              <Label htmlFor="book-cover">Cover-Bild (optional)</Label>
              <Text variant="muted" className="text-xs">
                Fügen Sie ein Bild hinzu. Das Bild wird nicht dauerhaft gespeichert, sondern nur im
                Arbeitsspeicher gehalten.
              </Text>

              {coverUri ? (
                /* Selected Image Preview */
                <View className="flex-row items-center gap-3 p-3 rounded-xl border border-border bg-card shadow-xs">
                  <Image
                    source={{ uri: coverUri }}
                    className="w-16 h-24 rounded-lg border border-border bg-muted"
                    resizeMode="cover"
                  />
                  <View className="flex-1 gap-1">
                    <Text className="text-sm font-semibold text-foreground">
                      Cover ausgewählt
                    </Text>
                    <Text variant="muted" className="text-xs">
                      In-Memory (temporär aktiv)
                    </Text>
                    <View className="flex-row gap-2 mt-2">
                      {Platform.OS === 'web' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onPress={handleTriggerPickImage}
                          className="h-7 px-2.5"
                        >
                          <Icon as={Upload} className="size-3 mr-1" />
                          <Text className="text-xs">Ändern</Text>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => setCoverUri('')}
                        className="h-7 px-2.5"
                      >
                        <Icon as={Trash2} className="size-3 mr-1 text-destructive" />
                        <Text className="text-xs text-destructive">Entfernen</Text>
                      </Button>
                    </View>
                  </View>
                </View>
              ) : (
                /* Upload Dropzone & Preset Selection */
                <View className="gap-3">
                  <Pressable
                    onPress={handleTriggerPickImage}
                    className="border-2 border-dashed border-border rounded-xl p-4 items-center justify-center bg-muted/20 active:bg-muted/40 gap-2"
                  >
                    <View className="size-10 rounded-full bg-primary/10 items-center justify-center">
                      <Icon as={Upload} className="size-5 text-primary" />
                    </View>
                    <View className="items-center">
                      <Text className="text-sm font-medium text-foreground text-center">
                        {Platform.OS === 'web'
                          ? 'Bilddatei vom Gerät auswählen'
                          : 'Cover-Bild auswählen'}
                      </Text>
                      <Text variant="muted" className="text-xs text-center mt-0.5">
                        PNG, JPG oder WEBP (nur im Arbeitsspeicher)
                      </Text>
                    </View>
                    {Platform.OS === 'web' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={handleTriggerPickImage}
                        className="flex-row items-center gap-1.5 mt-1"
                      >
                        <Icon as={ImageIcon} className="size-4" />
                        <Text className="text-xs">Datei durchsuchen</Text>
                      </Button>
                    )}
                  </Pressable>

                  {/* Preset Covers Bar */}
                  <View className="gap-1.5">
                    <Text variant="muted" className="text-xs font-medium">
                      Oder Cover-Vorlage auswählen:
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="flex-row gap-2 py-1"
                    >
                      {PRESET_COVERS.map((preset) => (
                        <Pressable
                          key={preset.id}
                          onPress={() => setCoverUri(preset.uri)}
                          className="items-center gap-1 mr-3 active:opacity-75"
                        >
                          <Image
                            source={{ uri: preset.uri }}
                            className="w-14 h-20 rounded-md border border-border bg-muted"
                            resizeMode="cover"
                          />
                          <Text
                            className="text-[10px] text-muted-foreground text-center max-w-[56px]"
                            numberOfLines={1}
                          >
                            {preset.label}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Manual URL toggle fallback */}
                  <View className="gap-1 pt-1">
                    <Pressable onPress={() => setShowUrlFallback((prev) => !prev)}>
                      <Text variant="muted" className="text-xs underline">
                        {showUrlFallback
                          ? 'Bild-URL Eingabe verbergen'
                          : 'Oder Bild-URL manuell eingeben'}
                      </Text>
                    </Pressable>
                    {showUrlFallback && (
                      <Input
                        value={coverUri}
                        onChangeText={setCoverUri}
                        placeholder="https://... oder data:image/..."
                        keyboardType="url"
                        autoCapitalize="none"
                        className="mt-1"
                      />
                    )}
                  </View>
                </View>
              )}
            </View>

            {/* Description Input */}
            <View className="gap-1.5">
              <Label htmlFor="book-description">Beschreibung / Notiz (optional)</Label>
              <Input
                ref={descriptionInputRef}
                id="book-description"
                value={description}
                onChangeText={setDescription}
                placeholder="Kurze Inhaltsangabe oder persönliche Notiz zum Buch..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="h-24 py-2"
              />
            </View>

            {/* Submit Button */}
            <Button className="mt-2 w-full flex-row items-center gap-2" onPress={handleSubmit}>
              <Icon as={BookPlus} className="size-4 text-primary-foreground" />
              <Text>Buch speichern</Text>
            </Button>
          </CardContent>
        </Card>

        {/* Recently Added Section (in-session history) */}
        {recentlyAdded.length > 0 && (
          <View className="gap-3 pt-2">
            <View className="flex-row items-baseline justify-between">
              <Text variant="h4">In dieser Sitzung hinzugefügt</Text>
              <Text variant="muted" className="text-xs">
                {recentlyAdded.length} {recentlyAdded.length === 1 ? 'Buch' : 'Bücher'}
              </Text>
            </View>
            <View className="gap-3">
              {recentlyAdded.map((book) => (
                <BookCard key={book.isbn} book={book} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
