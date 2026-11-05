# Milestone 4: Book Intake & Catalog Discovery

*Document: `docs/milestone-04-book-intake-and-discovery.md`*  
*Status: Planned*  
*Prerequisites: [Milestone 3 — Personal Library & Reading Lifecycle](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-03-personal-library-and-reading.md)*  
*Part of: [Milestones Overview](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestones-overview.md)*  
*Reference Glossary: [`docs/glossary.md`](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/glossary.md#22-book-catalog--bibliographic-metadata-subdomain)*

---

## 1. Objective & Purpose

Eliminate manual data entry friction for readers when adding books to their personal library. Provide physical barcode scanning using device cameras, instant bibliographic lookup via OpenLibrary/Google Books APIs, rich cover image selection, and an algorithmic book recommendation engine in `/book/recommendations`.

---

## 2. Book Intake & Lookup Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Reader as Reader
    participant Camera as Barcode Scanner (expo-camera)
    participant Validator as ISBN Check-Digit Validator
    participant API as OpenLibrary / Google Books API
    participant AddForm as Add Book Form (app/book/add.tsx)
    participant LibraryStore as Library Store (useLibraryStore)

    alt Option A: Camera Barcode Scan
        Reader->>Camera: Point camera at book EAN-13 barcode
        Camera->>Validator: Scan barcode string
        Validator->>Validator: Validate ISBN-13 checksum
        Validator->>API: Query ISBN (GET /isbn/{isbn}.json)
        API-->>AddForm: Return bibliographic metadata & cover URL
    else Option B: Manual Title / Author Search
        Reader->>AddForm: Enter title or ISBN in search box
        AddForm->>API: Query search endpoint
        API-->>AddForm: Populate matching suggestions
    end

    AddForm->>Reader: Pre-populate form with title, author, cover, pages
    Reader->>AddForm: Review / edit & select initial status
    AddForm->>LibraryStore: Dispatch addBook(bookData)
    LibraryStore-->>Reader: Book added; navigate to Bookshelf or Detail view
```

---

## 3. Bibliographic Service Contract (`lib/services/book-lookup.ts`)

```typescript
export interface BibliographicLookupResult {
  isbn: string;
  title: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  coverUrl?: string;
  genres?: string[];
  language?: string;
}

export interface BookLookupService {
  lookupByIsbn(isbn: string): Promise<BibliographicLookupResult | null>;
  searchByQuery(query: string, maxResults?: number): Promise<BibliographicLookupResult[]>;
}
```

### ISBN Invariants & Validation:
- Supports ISBN-10 and ISBN-13 formats with or without hyphens.
- Enforces Modulo 10 checksum for ISBN-13 and Modulo 11 for ISBN-10.
- Normalizes barcodes (strips hyphens and whitespace) before querying external APIs.

---

## 4. Key Epics & Features

### Epic 4.1: ISBN Barcode Scanner (`components/isbn-scanner-modal.tsx`)
- Implement camera barcode scanning modal using `expo-camera`:
  - Barcode scanner viewfinder overlay with targeting reticle and visual guidelines.
  - Flashlight toggle button for low-light scanning.
  - Permission handling: Request camera access with explanatory permission prompt.
  - On barcode detected: Haptic feedback vibration (`expo-haptics`), audio beep confirmation, validate check-digit, fetch metadata, and autofill the form.
  - Graceful fallback for web/desktop environments (manual ISBN text entry).

### Epic 4.2: Add Book Screen Polish (`app/book/add.tsx`)
- Refactor existing interactive form into a robust multi-step or collapsible section layout:
  - **Quick Intake Bar**: Scan barcode button + ISBN quick search field.
  - **Bibliographic Details**: Title, Author, ISBN, Publisher, Published Year, Total Pages.
  - **Cover Selection**:
    - Image from API lookup.
    - Custom cover from device photo gallery (`expo-image-picker`).
    - Take photo with camera (`expo-image-picker`).
    - Choose preset stylized typographic banner.
  - **Personal Classification**: Select initial reading status (`Want to Read`, `Reading`), shelf tags, rating.
- Validation: Zod schema ensuring Title, Author, and Page Count (>0) are valid before submission.

### Epic 4.3: External Metadata Provider Integrations
- Integrate OpenLibrary Books API (`https://openlibrary.org/api/books` and `https://covers.openlibrary.org/`).
- Secondary fallback to Google Books Volume API (`https://www.googleapis.com/books/v1/volumes?q=isbn:...`).
- Cache lookup responses locally to avoid redundant network calls.

### Epic 4.4: Curated Recommendations Engine (`app/book/recommendations.tsx`)
- Populate the currently stubbed recommendations screen:
  - **"Based on your favorite authors"**: Books by authors already in the user's library with high ratings.
  - **"Explore Genres"**: Curated category badges (Classics, Sci-Fi, Philosophy, Mystery, Non-Fiction).
  - **Featured Recommendations Carousel**: Highlighting celebrated literary works with synopses.
  - **Action buttons**:
    - "Add to Library" (instantly adds to `WANT_TO_READ`).
    - "Add to Wishlist" (adds to commercial wishlist).

---

## 5. Acceptance Criteria (Given-When-Then)

### AC-4.1: ISBN Barcode Scan & Autofill
- **Given** the user opens the camera scanner on `/book/add`
- **When** an ISBN-13 barcode (`9783150096767`) is scanned
- **Then** the scanner vibrates, dismisses, and the form fields (Title: *Der Prozess*, Author: *Franz Kafka*, Pages, Cover) are populated automatically.

### AC-4.2: ISBN Validation Invariant
- **Given** a user manually enters an invalid ISBN (e.g., `12345` or invalid checksum)
- **When** the user attempts lookup or form submission
- **Then** an error message *"Please enter a valid ISBN-10 or ISBN-13"* is displayed and API request is blocked.

### AC-4.3: One-Click Recommendation Intake
- **Given** the user is browsing recommendations on `/book/recommendations`
- **When** the user taps "Add to Bookshelf" on a recommended book card
- **Then** the book is added to their library with status `WANT_TO_READ`, a success badge appears, and the bookshelf counter increments.

---

## 6. Verification Checklist

- [ ] Camera permissions flow configured in `app.json` (iOS NSCameraUsageDescription, Android CAMERA).
- [ ] Barcode scanning tested on physical device or simulator mock.
- [ ] OpenLibrary API integration handles success, 404 (not found), and network timeouts gracefully.
- [ ] `AddBookSchema` validates title, author, and page count before saving.
- [ ] Cover image picker supports device gallery, camera photo, and presets.
- [ ] Recommendations screen renders curated list with working "Add" action.
- [ ] No git commit executed (per `ai/rule.md`).
