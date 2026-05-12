# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start dev server (clears cache)
npm run dev

# Target a specific platform
npm run android
npm run ios
npm run web

# Add a React Native Reusables component
npx react-native-reusables/cli@latest add <component-name>
```

There are no tests or linting scripts configured.

## Architecture

**Expo Router** file-based routing — every file under `app/` becomes a route:
- `app/_layout.tsx` — root layout; wraps the whole app in `ThemeProvider` (React Navigation) and `PortalHost` (for modals/overlays via `@rn-primitives/portal`)
- `app/index.tsx` — home screen
- `app/(auth)/` — auth group (login, sign-up); routes are `/(auth)/login` and `/(auth)/sign-up`
- `app/book.tsx`, `app/profilePage.tsx` — top-level pages linked from the home screen

**Styling** is done with [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native). Dark mode is `class`-based and toggled via `useColorScheme()` from `nativewind`. Theme tokens live in [lib/theme.ts](lib/theme.ts) and CSS variables in [global.css](global.css); Tailwind maps them in [tailwind.config.js](tailwind.config.js).

**UI components** in `components/ui/` come from [React Native Reusables](https://reactnativereusables.com) — they are built on `@rn-primitives/*` and styled with `class-variance-authority` (CVA). The `cn()` helper in [lib/utils.ts](lib/utils.ts) merges Tailwind classes (`clsx` + `tailwind-merge`). Always use the custom `<Text>` from `components/ui/text` (not React Native's built-in `Text`) so that theme-aware text colors propagate through `TextClassContext`.

**Platform-specific styles** use `Platform.select({ web: '...', native: '...' })` inside CVA definitions — web hover/focus states are gated this way.

**Path alias** `@/` maps to the repo root (configured in `tsconfig.json`).

## Formatting

Prettier is configured in `.prettierrc` with single quotes, 100-char print width, and `prettier-plugin-tailwindcss` for automatic Tailwind class sorting. The `cva` function is declared as a Tailwind function so classes inside it are also sorted.
