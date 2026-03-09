# CLAUDE.md — Card Expense Tracker

This file provides guidance for AI assistants working on this codebase.

## Project Overview

A Korean-language personal finance PWA (Progressive Web App) for tracking card/credit expenses. Built with React 19 + TypeScript + Vite, deployed on Netlify. Core feature: receipt scanning via the Anthropic Claude Vision API.

**App name:** 카드 지출 관리 (Card Expense Management)

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Charts | Recharts |
| Spreadsheets | XLSX |
| Persistence | Browser `localStorage` (no backend DB) |
| Serverless | Netlify Functions |
| AI | Anthropic Claude API (Vision) |
| Hosting | Netlify |
| PWA | vite-plugin-pwa + Workbox |

---

## Repository Structure

```
card-expense-tracker/
├── src/
│   ├── components/          # React UI components (16 files)
│   ├── data/
│   │   └── defaultCategories.ts   # 10 built-in Korean expense categories
│   ├── hooks/
│   │   ├── useExpenses.ts         # Main expense CRUD + analytics hook
│   │   └── useLocalStorage.ts     # Generic typed localStorage hook
│   ├── types/
│   │   └── index.ts               # Shared TypeScript types
│   ├── utils/
│   │   ├── categorize.ts          # Keyword-based auto-categorization
│   │   ├── csv.ts                 # CSV export (UTF-8 BOM for Excel)
│   │   ├── excel.ts               # Excel import/export + Web Share API
│   │   ├── fileOperations.ts      # File handling utilities
│   │   └── format.ts              # Date/currency formatting helpers
│   ├── App.tsx                    # Root component — state hub
│   ├── main.tsx                   # React entry point (StrictMode)
│   └── index.css                  # Global styles + CSS variables
├── netlify/
│   └── functions/
│       └── analyze-receipt.ts     # Serverless: receipt OCR via Anthropic
├── public/                        # Static assets, PWA icons
├── vite.config.ts
├── tsconfig.json                  # References tsconfig.app.json & tsconfig.node.json
├── eslint.config.js               # Flat ESLint config
├── netlify.toml                   # Build + redirect config
├── .env.example                   # Environment variable template
└── DEPLOYMENT_GUIDE.md
```

---

## Key Types

Defined in `src/types/index.ts`:

```typescript
// 10 expense categories (Korean)
type CategoryKey = '식비' | '카페' | '교통' | '자동차' | '쇼핑' | '편의점' | '의료' | '문화/여가' | '통신' | '기타';

interface Expense {
  id: string;
  merchant: string;
  amount: number;
  date: string;         // "YYYY-MM-DD"
  category: CategoryKey;
  manualCategory: boolean;
  memo?: string;
}

interface CategoryConfig {
  key: CategoryKey;
  color: string;        // Tailwind color token
  keywords: string[];   // For auto-categorization
}

type TabKey = 'input' | 'dashboard' | 'settings';
```

---

## State Management

**No Redux or global context.** State is managed at the `App.tsx` level using React hooks:

- `useState` — active tab, current month
- `useLocalStorage<CategoryConfig[]>('categories', defaultCategories)` — persisted categories
- `useExpenses()` — encapsulates all expense state and logic (reads/writes `'expenses'` key in localStorage)

**Data flows downward via props; mutations flow upward via callbacks.**

`useLocalStorage` returns `[value, setValue, reset]`. The `reset` function restores the default value.

---

## Components

| Component | Purpose |
|---|---|
| `Layout` | Tab bar navigation shell |
| `ExpenseForm` | Add new expense (includes receipt scanner trigger) |
| `ExpenseList` | Monthly expense list with month picker |
| `ExpenseRow` | Single expense row with inline edit/delete |
| `Dashboard` | Analytics tab — pie chart + bar chart |
| `PieChartCard` | Category breakdown pie chart (Recharts) |
| `BarChartCard` | 6-month spending trend bar chart (Recharts) |
| `MonthlySummary` | Total spending display for selected month |
| `MonthPicker` | Previous/next month navigation |
| `ReceiptScanner` | Camera capture → base64 → `/api/analyze-receipt` |
| `FileManager` / `FileManagerCompact` | Import/export UI (Excel, CSV, JSON) |
| `CategoryManager` | Add/edit/delete expense categories (settings tab) |
| `UpdatePrompt` | PWA service worker update notification |
| `IOSInstallGuide` | "Add to Home Screen" instructions for iOS |

---

## Serverless API

**`POST /api/analyze-receipt`** — `netlify/functions/analyze-receipt.ts`

- **Input:** `{ imageBase64: string; mediaType?: string }`
- **Output:** `{ merchant: string; amount: number; date: string; memo?: string }`
- Calls Anthropic's API directly using `fetch` (no SDK — raw HTTP)
- Uses model `claude-haiku-4-5-20251001` for cost efficiency
- Prompts in Korean, returns JSON only
- Falls back to today's date if no date found on receipt

**Environment variable required:** `ANTHROPIC_API_KEY`

---

## Development Workflow

### Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # TypeScript type-check + Vite production build
npm run lint      # ESLint (flat config, TypeScript rules)
npm run preview   # Serve the production build locally
```

### Environment Setup

```bash
cp .env.example .env
# Add ANTHROPIC_API_KEY to .env for local receipt scanning
```

The receipt scanning function runs as a Netlify Function. In local dev, you need the [Netlify CLI](https://docs.netlify.com/cli/get-started/) to test it:

```bash
netlify dev   # Runs Vite + Netlify Functions together
```

### No Test Suite

There are currently no automated tests. TypeScript strict mode (`tsconfig.app.json`) serves as the primary correctness check. Always run `npm run build` before committing to catch type errors.

---

## Styling Conventions

**Tailwind CSS 4** utility classes are used throughout. Do not add inline styles unless absolutely necessary.

**CSS custom properties** are defined in `src/index.css`:

```css
--toss-blue: #3182F6        /* Primary brand/action color */
--text-primary: #191F28
--text-secondary: #4E5968
--text-tertiary: #8B95A1
--bg-primary: #FFFFFF
--bg-secondary: #F2F4F6
```

Design is inspired by **Toss** (Korean fintech). Use system font stack, clean card layouts, and smooth `0.2s ease` transitions.

---

## Categorization Logic

`src/utils/categorize.ts` — Keyword matching (case-insensitive substring):

1. Iterates through `categories` (in order, skipping `'기타'`)
2. Checks if `merchant.toLowerCase()` includes any keyword
3. Returns first matching category key
4. Falls back to `'기타'` (Other)

When `manualCategory: true` on an `Expense`, the auto-categorization is bypassed and the user's choice is preserved.

---

## Data Persistence

All data is stored in `localStorage` under two keys:

| Key | Type | Default |
|---|---|---|
| `'expenses'` | `Expense[]` | `[]` |
| `'categories'` | `CategoryConfig[]` | `defaultCategories` |

**No backend database.** Import/export (Excel, CSV, JSON) is the primary data portability mechanism.

---

## PWA Notes

- Service worker: auto-update strategy (Workbox via vite-plugin-pwa)
- `UpdatePrompt` component shows a reload prompt when a new SW version is detected
- `IOSInstallGuide` detects iOS Safari and shows "Add to Home Screen" instructions
- App manifest: `public/manifest.webmanifest`
- Icons: 192×192 and 512×512 PNG in `public/`

---

## Conventions for AI Assistants

1. **Language:** The UI is in Korean. Keep user-facing strings (labels, placeholders, error messages) in Korean.
2. **No new dependencies** without a clear reason — the stack is intentionally minimal.
3. **No test files to update** — but ensure `npm run build` passes (TypeScript check).
4. **Use `useCallback`/`useMemo`** for functions returned from custom hooks (matches existing pattern).
5. **Do not add a backend database.** If persistence beyond localStorage is needed, discuss first.
6. **New components** go in `src/components/`. New utilities go in `src/utils/`.
7. **New types** go in `src/types/index.ts`.
8. **The `Expense.id`** should be generated as a timestamp string: `Date.now().toString()` or similar.
9. **Date format** is always `"YYYY-MM-DD"` (ISO date string, no time component).
10. **Currency** is Korean Won (₩). Use `formatAmount()` from `src/utils/format.ts` for display.
11. **ESLint flat config** — do not use `.eslintrc` files; configuration lives in `eslint.config.js`.
12. **The Anthropic API call** in the Netlify function uses raw `fetch`, not the SDK. Keep it consistent unless migrating deliberately.

---

## Deployment

Deployed on Netlify. All pushes to the connected GitHub branch trigger automatic deploys.

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- Required env var in Netlify dashboard: `ANTHROPIC_API_KEY`
- SPA routing: all requests redirect to `/index.html` (configured in `netlify.toml`)

See `DEPLOYMENT_GUIDE.md` for step-by-step setup instructions.
