# CineVault (myFlix Angular Client)

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Angular%20Material](https://img.shields.io/badge/Angular%20Material-21-009688?logo=materialdesign&logoColor=white)
![License](https://img.shields.io/badge/License-Not%20specified-lightgrey)

Modern Angular frontend for the CineVault movie discovery app. This client provides authentication, movie browsing, favorites management, and a dark themed UI with Angular Material.

## Screenshots

![Welcome page](docs/screenshots/welcome.png)
![Movies carousel](docs/screenshots/movies.png)
![Profile and favorites](docs/screenshots/profile.png)

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

## Technologies Used

- Angular CLI 21
- Angular Animations
- Angular CDK
- Angular Forms (Reactive Forms)
- Angular Router
- Angular Material (MatToolbar, MatCard, MatDialog, MatButton, MatIcon, MatSnackBar)
- RxJS Observables
- SCSS
- JWT-based authentication

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
	apiUrl: 'your_api'
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
