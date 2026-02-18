# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands are run from the repo root using **Bun** as the package manager.

```bash
bun dev          # Start all apps in dev mode (via Turborepo)
bun build        # Build all apps and packages
bun lint         # Lint all packages
bun format       # Prettier format all TS/TSX/MD files

# Run for a single app
cd apps/web && bun dev
```

Install dependencies: `bun install`

## Architecture

This is a **Turborepo monorepo** with Bun workspaces.

```
apps/
  web/                  # React + Vite + TypeScript app (port 5173)
    src/
      main.tsx          # App entry point
      style.css         # Global styles (Tailwind v4 import)
    components/
      recreations/      # UI recreations (e.g. mac-bottom-bar.tsx)
packages/
  ui/                   # Shared component library (@repo/ui)
    components/         # counter.tsx, header.tsx, etc.
    index.ts            # Re-exports from ./components
  eslint-config/        # Shared ESLint config (@repo/eslint-config)
  typescript-config/    # Shared tsconfig presets (@repo/typescript-config)
```

### Key conventions

- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin. Import with `@import "tailwindcss"` in CSS — no config file needed.
- **Animations**: `motion` library (Framer Motion v12+) is installed in `apps/web`.
- **Shared components**: Add to `packages/ui/components/` and export from `packages/ui/index.ts`. Import as `@repo/ui` in apps.
- **App-local components**: Add to `apps/web/components/`. UI recreations go in `apps/web/components/recreations/`.
- **Turbo task graph**: `build` depends on `^build` (packages build before apps). `dev` is persistent and non-cached.
