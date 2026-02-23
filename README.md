# CineVault (myFlix Angular Client)

Modern Angular frontend for the CineVault movie discovery app. This client provides authentication, movie browsing, favorites management, and a dark themed UI with Angular Material.

## Features

- Authentication with JWT (login and registration)
- Movie catalog with poster images
- Favorite movies management with animated toggle
- Profile management (update info, delete account)
- Standalone components with signals and modern control flow
- Dark UI theme with custom dialogs

## Tech Stack

- Angular 21 (standalone, signals)
- Angular Material 21
- RxJS 7
- TypeScript 5

## Getting Started

### Prerequisites

- Node.js (recommended: latest LTS)
- npm 11+

### Install

```bash
npm install
```

### Run

```bash
npm start
```

Open http://localhost:4200

## Configuration

The API base URL is defined in `src/environments/environment.ts`:

```ts
export const environment = {
	production: false,
	apiUrl: 'https://mymov-e6f0370bab7c.herokuapp.com/'
};
```

Update `apiUrl` to point to your backend if needed.

## Scripts

- `npm start` - start the dev server
- `npm run build` - production build
- `npm run watch` - build in watch mode
- `npm test` - run unit tests (Vitest)

## Routes

- `/welcome` - landing page
- `/movies` - movie catalog
- `/profile` - user profile and favorites

## Project Structure (high level)

- `src/app` - components, services, routes
- `src/assets` and `public/assets` - static assets (posters, logo)
- `src/environments` - environment configuration

## Notes

- This project uses Angular Material with a custom dark theme.
- Dialog content is intentionally non-scrollable for a clean presentation.

## License

No license specified.
