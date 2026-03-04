# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Development Commands

```bash
pnpm dev      # Start development server
pnpm build    # TypeScript type check + Vite build
pnpm preview  # Preview build output
```

## Tech Stack

- **Build Tool**: Vite (using rolldown-vite)
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Immer + use-immer
- **React Compiler**: babel-plugin-react-compiler enabled
- **Icons**: @egoist/tailwindcss-icons + @iconify-json/carbon

## Project Architecture

- `src/main.tsx` - Application entry point
- `src/App.tsx` - Root component
- `src/layouts/` - Layout components (Default includes ThemeProvider)
- `src/components/` - UI components
  - `theme-provider.tsx` - Theme context (dark/light/system)
  - `mode-toggle.tsx` - Dark mode toggle button (with View Transitions API animation)

## Path Aliases

`@/` maps to `./src/`

## Styling Conventions

- Uses Tailwind CSS v4 syntax
- Dark mode controlled via `.dark` class, using `@custom-variant dark`
- Icons use `i-carbon-*` class names
- Predefined component classes: `.btn`, `.icon-btn`
