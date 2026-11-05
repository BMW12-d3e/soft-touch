import * as React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import {
  Check,
  Image as ImageIcon,
  Pencil,
  Trash2,
  Upload,
  X,
} from 'lucide-react-native';

import type { Book } from '@/components/book-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { PRESET_COVERS } from '@/lib/book-store';

type EditBookModalProps = {
  book: Book | null;
  visible: boolean;
  onClose: () => void;
  onSave: (originalIsbn: string, updatedBook: Book) => void;
};

export function EditBookModal({
  book,
  visible,
  onClose,
  onSave,
}: EditBookModalProps) {
  const [title, setTitle] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [isbn, setIsbn] = React.useState('');
  const [coverUri, setCoverUri] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const authorInputRef = React.useRef<TextInput>(null);
  const isbnInputRef = React.useRef<TextInput>(null);
  const descriptionInputRef = React.useRef<TextInput>(null);

  // Synchronize state when the book prop changes
  React.useEffect(() => {
    if (book) {
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setIsbn(book.isbn || '');
      setCoverUri(book.coverUri || '');
      setDescription(book.description || '');
      setErrorMessage(null);
      setShowUrlInput(false);
    }
  }, [book]);

  function handleWebFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setCoverUri(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  function handleTriggerPickImage() {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleSave() {
    if (!book) return;

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedTitle || !trimmedAuthor) {
      setErrorMessage('Titel und Autor dürfen nicht leer sein.');
      return;
    }

    setErrorMessage(null);

    const updatedBook: Book = {
      title: trimmedTitle,
      author: trimmedAuthor,
      isbn: isbn.trim() || book.isbn,
      coverUri: coverUri.trim() || undefined,
      description: description.trim() || undefined,
    };

    onSave(book.isbn, updatedBook);
    onClose();
  }

  if (!visible || !book) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Hidden file input for web */}
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleWebFileChange}
        />
      )}

      {/* Backdrop */}
      <View className="flex-1 justify-center items-center bg-black/60 p-4">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="w-full max-w-lg max-h-[90%]"
        >
          <Card className="w-full overflow-hidden shadow-2xl border-border bg-card">
            {/* Modal Header */}
            <CardHeader className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-1 pr-2">
                <CardTitle className="text-lg">Buch bearbeiten</CardTitle>
                <CardDescription numberOfLines={1}>
                  Details für &quot;{book.title}&quot; anpassen
                </CardDescription>
              </View>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full"
                onPress={onClose}
              >
                <Icon as={X} className="size-5 text-muted-foreground" />
              </Button>
            </CardHeader>

            {/* Modal Scrollable Content */}
            <ScrollView
              className="max-h-[500px]"
              contentContainerClassName="p-5 gap-4"
              keyboardShouldPersistTaps="handled"
            >
              {errorMessage && (
                <View className="rounded-md bg-destructive/15 p-2.5 border border-destructive/30">
                  <Text className="text-destructive text-xs font-medium">
                    {errorMessage}
                  </Text>
                </View>
              )}

              {/* Title */}
              <View className="gap-1.5">
                <Label htmlFor="edit-title">Titel *</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Titel des Buches"
                  returnKeyType="next"
                  onSubmitEditing={() => authorInputRef.current?.focus()}
                />
              </View>

              {/* Author */}
              <View className="gap-1.5">
                <Label htmlFor="edit-author">Autor *</Label>
                <Input
                  ref={authorInputRef}
                  id="edit-author"
                  value={author}
                  onChangeText={setAuthor}
                  placeholder="Autor des Buches"
                  returnKeyType="next"
                  onSubmitEditing={() => isbnInputRef.current?.focus()}
                />
              </View>

              {/* ISBN */}
              <View className="gap-1.5">
                <Label htmlFor="edit-isbn">ISBN</Label>
                <Input
                  ref={isbnInputRef}
                  id="edit-isbn"
                  value={isbn}
                  onChangeText={setIsbn}
                  placeholder="ISBN-Nummer"
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="next"
                  onSubmitEditing={() => descriptionInputRef.current?.focus()}
                />
              </View>

              {/* Cover Image Editor */}
              <View className="gap-2">
                <Label>Cover-Bild / Cover-Location</Label>
                <Text variant="muted" className="text-xs">
                  Bild anpassen oder ersetzen (wird nur im Arbeitsspeicher gehalten).
                </Text>

                {coverUri ? (
                  /* Current Image Preview & Actions */
                  <View className="flex-row items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
                    <Image
                      source={{ uri: coverUri }}
                      className="w-14 h-20 rounded-md border border-border bg-muted"
                      resizeMode="cover"
                    />
                    <View className="flex-1 gap-1">
                      <Text className="text-xs font-semibold text-foreground">
                        Cover aktiv
                      </Text>
                      <Text variant="muted" className="text-[11px]" numberOfLines={1}>
                        {coverUri.startsWith('data:')
                          ? 'In-Memory Bilddatei (Base64)'
                          : coverUri}
                      </Text>
                      <View className="flex-row gap-2 mt-1.5">
                        {Platform.OS === 'web' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2"
                            onPress={handleTriggerPickImage}
                          >
                            <Icon as={Upload} className="size-3 mr-1" />
                            <Text className="text-xs">Neues Bild</Text>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onPress={() => setCoverUri('')}
                        >
                          <Icon as={Trash2} className="size-3 mr-1 text-destructive" />
                          <Text className="text-xs text-destructive">Entfernen</Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                ) : (
                  /* No Image Selected: Upload or Choose Preset */
                  <View className="gap-2">
                    <Pressable
                      onPress={handleTriggerPickImage}
                      className="border-2 border-dashed border-border rounded-lg p-3 items-center justify-center bg-muted/20 active:bg-muted/40 gap-1.5"
                    >
                      <Icon as={Upload} className="size-4 text-primary" />
                      <Text className="text-xs font-medium text-foreground text-center">
                        {Platform.OS === 'web'
                          ? 'Bilddatei auswählen'
                          : 'Cover-Bild festlegen'}
                      </Text>
                      <Text variant="muted" className="text-[10px] text-center">
                        PNG, JPG oder WEBP
                      </Text>
                    </Pressable>

                    {/* Presets */}
                    <View className="gap-1">
                      <Text variant="muted" className="text-[11px] font-medium">
                        Oder Vorlage wählen:
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
                            className="items-center mr-2 active:opacity-75"
                          >
                            <Image
                              source={{ uri: preset.uri }}
                              className="w-12 h-16 rounded border border-border bg-muted"
                              resizeMode="cover"
                            />
                            <Text className="text-[9px] text-muted-foreground mt-0.5 max-w-[48px] text-center" numberOfLines={1}>
                              {preset.label}
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                )}

                {/* Direct location / URL editing toggle */}
                <View className="gap-1 mt-1">
                  <Pressable onPress={() => setShowUrlInput((prev) => !prev)}>
                    <Text variant="muted" className="text-xs underline">
                      {showUrlInput
                        ? 'Cover-Location Eingabe verbergen'
                        : 'Cover-Location / URL direkt bearbeiten'}
                    </Text>
                  </Pressable>
                  {showUrlInput && (
                    <Input
                      value={coverUri}
                      onChangeText={setCoverUri}
                      placeholder="https://... oder Pfad"
                      keyboardType="url"
                      autoCapitalize="none"
                      className="mt-1 text-xs"
                    />
                  )}
                </View>
              </View>

              {/* Description */}
              <View className="gap-1.5">
                <Label htmlFor="edit-description">Beschreibung / Notizen</Label>
                <Input
                  ref={descriptionInputRef}
                  id="edit-description"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Inhaltsangabe..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="h-20 py-2"
                />
              </View>
            </ScrollView>

            {/* Modal Footer Actions */}
            <CardFooter className="flex-row justify-end gap-2 p-4 border-t border-border bg-muted/10">
              <Button variant="outline" size="sm" onPress={onClose}>
                <Text>Abbrechen</Text>
              </Button>
              <Button size="sm" className="flex-row items-center gap-1.5" onPress={handleSave}>
                <Icon as={Check} className="size-4 text-primary-foreground" />
                <Text>Speichern</Text>
              </Button>
            </CardFooter>
          </Card>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

