# Milestone 6: Offline Persistence, State Sync & Internationalization

*Document: `docs/milestone-06-offline-persistence-and-i18n.md`*  
*Status: Planned*  
*Prerequisites: [Milestone 3 — Personal Library](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-03-personal-library-and-reading.md), [Milestone 5 — Bookstore](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-05-bookstore-and-commerce.md)*  
*Part of: [Milestones Overview](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestones-overview.md)*  
*Reference Glossary: [`docs/glossary.md`](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/glossary.md#4-bilingual-translation--canonical-normalization-table)*

---

## 1. Objective & Purpose

Transition Soft-Touch from in-memory mock stores to an industrial-strength, offline-first persistent database powered by `expo-sqlite`. Introduce a complete internationalization (`i18n`) framework supporting English and German to eliminate mixed-language UI strings, and enforce full WCAG 2.1 AA accessibility across all native and web platforms.

---

## 2. Offline-First Architecture

```mermaid
flowchart TD
    UI["User Interface (Screens & Hooks)"]
    Store["Reactive Zustand Stores"]
    DB[("Local SQLite Database (expo-sqlite)")]
    SyncEngine["Background Sync Engine"]
    RemoteAPI["Remote Backend / Cloud Sync"]

    UI <-->|Read / Mutate| Store
    Store <-->|Instant Read / Write| DB
    DB <-->|Unsynced Mutations Queue| SyncEngine
    SyncEngine <-->|Bi-directional Sync (When Online)| RemoteAPI

    classDef local fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
    classDef remote fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#b45309;

    class UI,Store,DB local;
    class SyncEngine,RemoteAPI remote;
```

---

## 3. SQLite Database Schema & Migrations (`lib/db/schema.sql`)

```sql
-- Schema Version 1

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT,
  avatar_uri TEXT,
  bio TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY NOT NULL,
  isbn TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_uri TEXT,
  description TEXT,
  publisher TEXT,
  published_year INTEGER,
  page_count INTEGER NOT NULL,
  genres TEXT, -- JSON string array
  language TEXT
);

CREATE TABLE IF NOT EXISTS library_entries (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  reading_status TEXT NOT NULL, -- WANT_TO_READ, READING, COMPLETED, ON_HOLD, DROPPED
  current_page INTEGER NOT NULL DEFAULT 0,
  progress_percent REAL NOT NULL DEFAULT 0.0,
  rating INTEGER,
  personal_notes TEXT,
  favorite INTEGER NOT NULL DEFAULT 0,
  date_added TEXT NOT NULL,
  date_started TEXT,
  date_completed TEXT,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_library_user_status ON library_entries(user_id, reading_status);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_author_title ON books(author, title);
```

---

## 4. Key Epics & Features

### Epic 6.1: Expo SQLite Database Layer (`lib/db/`)
- Install and configure `expo-sqlite`.
- Database initialization and migration runner:
  - Execute schema setup on app startup.
  - Data seeding for initial catalog (Franz Kafka, Goethe, etc.).
- Repository pattern services:
  - `BookRepository`: `findById`, `findByIsbn`, `search(query)`.
  - `LibraryRepository`: `getByUser`, `upsertEntry`, `updateProgress`, `deleteEntry`.
  - `OrderRepository`: `saveOrder`, `getOrdersByUser`.
- Zustand persistent store middleware: Connect Zustand stores to SQLite via asynchronous write-behind caching.

### Epic 6.2: Complete Internationalization (`i18n`) Framework
- Install `i18next` and `react-i18next`.
- Initialize translation modules in `lib/i18n/`:
  - `lib/i18n/index.ts`
  - `lib/i18n/locales/en.json` (Canonical English)
  - `lib/i18n/locales/de.json` (German)
- **Eliminate Mixed Language Strings**:
  - Replace all hardcoded German strings in `components/sign-up-form.tsx`, `components/sign-in-form.tsx`, `app/book/index.tsx`, `app/book/add.tsx`, and `app/book/recommendations.tsx` with `useTranslation()` keys:
    - `"Vorname"` -> `t('auth.firstName')`
    - `"Ihre Bücher"` -> `t('library.yourBooks')`
    - `"Hier können Sie ein neues Buch hinzufügen"` -> `t('library.addBookDescription')`
- Wire language switcher in `app/settingsPage.tsx` to switch languages instantly and persist preference in SQLite / secure storage.

### Epic 6.3: Accessibility (a11y) & WCAG Compliance
- Ensure all interactive elements meet minimum touch target dimensions (44x44 points).
- Add semantic accessibility props across all UI primitives:
  - `accessibilityRole` (`button`, `header`, `image`, `link`, `search`).
  - `accessibilityLabel` and `accessibilityHint` for icon-only buttons (theme toggle, search, cart, back button).
- Color contrast verification: Audit light and dark theme tokens in `lib/theme.ts` to ensure 4.5:1 minimum contrast ratio for text and 3:1 for graphical UI elements.
- Ensure screen readers correctly announce reading progress percentage and star ratings.

---

## 5. Acceptance Criteria (Given-When-Then)

### AC-6.1: Offline Persistence Across Restarts
- **Given** the device has no internet connection (Airplane Mode)
- **When** the reader adds a new book to the library and force-quits the app
- **Then** upon reopening, the added book persists and is immediately visible on the bookshelf.

### AC-6.2: Dynamic Language Switching
- **Given** the app is displaying English
- **When** the user changes the language to "Deutsch" in Settings
- **Then** all navigation titles, form labels, buttons, and system messages immediately re-render in German without requiring app reload.

### AC-6.3: Screen Reader Labeling
- **Given** VoiceOver (iOS) or TalkBack (Android) is active
- **When** focusing on the Theme Toggle button in the header
- **Then** the screen reader announces *"Switch to Dark Theme, button"* or *"Switch to Light Theme, button"*.

---

## 6. Verification Checklist

- [ ] `expo-sqlite` database initializes and migrates successfully on iOS, Android, and Web.
- [ ] In-memory stores successfully replaced with SQLite-backed repositories.
- [ ] Zero unlocalized strings in the application (all routed through `t(...)`).
- [ ] English and German JSON dictionaries contain 100% reciprocal key parity.
- [ ] Language preference persists across sessions.
- [ ] All icon buttons have explicit `accessibilityLabel` properties.
- [ ] No git commit executed (per `ai/rule.md`).
