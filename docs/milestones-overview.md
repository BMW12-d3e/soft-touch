# Soft-Touch — Master Milestones Roadmap

*Document: `docs/milestones-overview.md`*  
*Approach: Spec-Driven Development (SDD) & Domain-Driven Design (DDD)*  
*Target Release: 1.0.0 General Availability (GA)*  
*Reference Glossary: [`docs/glossary.md`](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/glossary.md)*  
*Current State Audit: [`ai/current-state.md`](file:///c:/Users/aaron/Documents/projects/soft-touch/ai/current-state.md)*

---

## 1. Executive Vision & Scope

**Soft-Touch** is a modern, cross-platform (iOS, Android, Web) digital companion designed for readers and book lovers. The application blends:
1. **Personal Library & Bookshelf Curation**: Organize, track, rate, and annotate physical and digital books.
2. **Book Intake & Automated Metadata Discovery**: Barcode scanning, ISBN lookup, and online bibliographic imports.
3. **Reader Identity & Profile**: Personalized reading goals, statistics, streaks, and preferences.
4. **Bookstore & Commerce**: Commercial book discovery, curated recommendations, wishlist, shopping cart, and checkout.

To evolve the application from its current prototype state into a robust, secure, and production-ready mobile and web application, work is structured across **seven discrete milestones**.

---

## 2. Milestone Summary Matrix

| Milestone | Title | Focus Area | Status | Target Deliverables |
| :--- | :--- | :--- | :--- | :--- |
| [**M1**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-01-foundation-and-architecture.md) | **Foundation & Architecture** | Tech debt remediation, icon convergence, routing fix, testing harness, state foundations | 🔄 Ready for Execution | Stable cross-platform core, Jest/ESLint setup, unified icons, clean layouts |
| [**M2**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-02-identity-auth-and-profile.md) | **Identity, Auth & Profile** | User onboarding, Zod form validation, OAuth, session lifecycle, profile & settings | 📋 Planned | Authenticated session management, secure storage, validated forms, user profile |
| [**M3**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-03-personal-library-and-reading.md) | **Personal Library & Reading Lifecycle** | Bookshelf views, reading statuses, progress tracking, book detail views, notes & ratings | 📋 Planned | Multi-shelf views, reading progress log, comprehensive book detail page |
| [**M4**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-04-book-intake-and-discovery.md) | **Book Intake & Catalog Discovery** | Camera ISBN barcode scanner, OpenLibrary/Google Books API, manual add, recommendations | 📋 Planned | Zero-friction book scanning, auto-filling metadata, recommendation engine |
| [**M5**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-05-bookstore-and-commerce.md) | **Bookstore & Commerce** | Bookstore catalog, search, wishlist, shopping cart, mock checkout, order history | 📋 Planned | End-to-end commerce experience, cart state, order management |
| [**M6**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-06-offline-persistence-and-i18n.md) | **Offline Persistence & i18n** | Local SQLite storage, background sync, bilingual English/German i18n, accessibility | 📋 Planned | 100% offline capability, zero data loss, full bilingual support |
| [**M7**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-07-testing-qa-and-production-release.md) | **Testing, QA & Production Release** | Test coverage (>85%), E2E automation, performance optimization, EAS build & App Stores | 📋 Planned | Production store builds (IPA/AAB), automated CI/CD pipeline, crash monitoring |

---

## 3. Milestone Dependency & Execution Roadmap

```mermaid
flowchart TD
    M1["Milestone 1:\nFoundation & Architecture\n(Tech Debt, Icons, Routes, Tooling)"]
    
    subgraph ParallelCore["Core Feature Stream"]
        M2["Milestone 2:\nIdentity, Auth & Profile\n(Validation, Tokens, Settings)"]
        M3["Milestone 3:\nPersonal Library & Reading\n(Bookshelf, Statuses, Details)"]
    end

    subgraph Extensions["Intake & Commerce Stream"]
        M4["Milestone 4:\nBook Intake & Discovery\n(Barcode Scanner, APIs, Recs)"]
        M5["Milestone 5:\nBookstore & Commerce\n(Catalog, Cart, Orders)"]
    end

    subgraph Hardening["Production Hardening Stream"]
        M6["Milestone 6:\nOffline Persistence & i18n\n(SQLite, Sync, EN/DE, a11y)"]
        M7["Milestone 7:\nTesting, QA & Release\n(E2E, Performance, EAS, Stores)"]
    end

    M1 --> M2
    M1 --> M3
    M2 --> M3
    M3 --> M4
    M3 --> M5
    M2 --> M5
    M4 --> M6
    M5 --> M6
    M6 --> M7

    classDef foundational fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
    classDef feature fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#15803d;
    classDef hardening fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#b45309;

    class M1 foundational;
    class M2,M3,M4,M5 feature;
    class M6,M7 hardening;
```

---

## 4. Spec-Driven Development (SDD) Workflow per Milestone

Every milestone follows a strict SDD lifecycle to prevent regressions and maintain continuous architectural integrity:

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer / Agent
    participant Spec as Milestone Specification (docs/*.md)
    participant Contract as Contracts & Invariants (Types / Zod)
    participant Tests as Automated Tests (Jest / RTL)
    participant Code as Implementation (app/*, components/*)
    participant Review as Verification & Human Sign-off

    Dev->>Spec: Review requirements & acceptance criteria
    Dev->>Contract: Define domain types, schemas & state interfaces
    Dev->>Tests: Author failing unit/integration tests for contracts
    Dev->>Code: Implement UI components & business logic
    Dev->>Tests: Verify tests pass & invariants hold
    Dev->>Review: Manual review & developer-managed git commit
```

### Invariant Rules for Implementation:
1. **No Automated Commits**: In compliance with [`ai/rule.md`](file:///c:/Users/aaron/Documents/projects/soft-touch/ai/rule.md), all git commits are staged and reviewed by the human developer.
2. **Canonical Ubiquitous Language**: Terminology across all code, identifiers, types, and database tables must strictly align with [`docs/glossary.md`](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/glossary.md).
3. **Cross-Platform Parity**: Features must run properly across iOS, Android, and Web without runtime crashes caused by platform-incompatible web DOM or native-only APIs.

---

## 5. Milestone Index & Navigation

Detailed documentation for each individual milestone can be accessed via the links below:

- 📄 [**Milestone 1 — Technical Debt Remediation & Cross-Platform Foundation**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-01-foundation-and-architecture.md)
- 📄 [**Milestone 2 — Reader Identity, Authentication & Profile**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-02-identity-auth-and-profile.md)
- 📄 [**Milestone 3 — Personal Library & Reading Lifecycle**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-03-personal-library-and-reading.md)
- 📄 [**Milestone 4 — Book Intake & Catalog Discovery**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-04-book-intake-and-discovery.md)
- 📄 [**Milestone 5 — Bookstore & Commerce**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-05-bookstore-and-commerce.md)
- 📄 [**Milestone 6 — Offline Persistence, State Sync & Internationalization**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-06-offline-persistence-and-i18n.md)
- 📄 [**Milestone 7 — Testing, QA Automation & Production Release**](file:///c:/Users/aaron/Documents/projects/soft-touch/docs/milestone-07-testing-qa-and-production-release.md)
