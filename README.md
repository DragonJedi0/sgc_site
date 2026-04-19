# SGC Database

A fictional Stargate Command personnel and mission records system inspired by the TV series Stargate SG-1. Built as a portfolio project to demonstrate full-stack development and professional testing practices.

The in-universe premise: NORAD has contracted a developer to digitize the SGC's personnel and mission files into a clean, accessible web application.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Supabase (PostgreSQL, REST API)
- **Testing:** Vitest, React Testing Library, userEvent
- **CI/CD:** GitHub Actions

## Features

- Full CRUD for SGC personnel records
- Role-aware display (military rank abbreviations vs civilian titles)
- Enum-enforced data integrity (rank, status, prefix, personnel type)
- Comprehensive unit test suite with mocked Supabase client
- Automated CI pipeline on push to main, staging, and dev branches

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Installation

```bash
git clone https://github.com/yourusername/sgc_site.git
cd sgc_site
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running Locally

`npm run dev`

## Running Tests

`npm run test:run`

## Project Structure

```
src/
  lib/
    supabase.ts           # Supabase client
    rankAbbreviations.ts  # Military rank lookup (Air Force specific)
  pages/
    PersonnelList.tsx
    PersonnelDetail.tsx
    PersonnelForm.tsx
  test/
    PersonnelList.test.tsx
    PersonnelDetail.test.tsx
    PersonnelForm.test.tsx
```

## Roadmap

- [x] Personnel CRUD
- [x] Unit tests
- [ ] Teams management
- [ ] Mission records
- [ ] Integration tests with MSW
- [ ] E2E tests with Playwright
- [ ] GitHub Pages deployment
- [ ] Role-based access control