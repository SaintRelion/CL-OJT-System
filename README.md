# OJTLOG

OJTLOG is a role-based On-the-Job Training (OJT) attendance and management system built with React, TypeScript, Vite, Firebase/Firestore, and reusable `@saintrelion/*` libraries.

It provides workflows for **administrators, department advisers, and interns**, including attendance, OJT-hour tracking, evaluations, accomplishments, reports, and account management.

> **Legacy project:** This archived project uses an older generation of my `@saintrelion/*` libraries, which are now deprecated. OJTLOG uses their Firebase provider for rapid online development/prototyping. The same library architecture also supported a local mock provider and a generic REST API provider for production-oriented deployments.

## Features

- **Administrator:** manage department advisers, interns, and accounts
- **Department adviser:** monitor attendance, manage assigned interns, evaluate records, configure attendance settings, and track OJT progress
- **Intern:** four-step attendance (`Time In → Break Out → Break In → Time Out`), attendance history, OJT-hour tracking, accomplishments, DTR/reports, and account management
- Attendance can include timestamps, location information, and captured images depending on permissions and workflow

## Tech stack

React 19 · TypeScript · Vite · Firebase/Firestore · TanStack Query · Tailwind CSS · Leaflet · Vite PWA · pnpm · `@saintrelion/*`

```text
React / TypeScript
       ↓
@saintrelion/* libraries
       ↓
Firebase provider
       ↓
Cloud Firestore
```

## Setup

### Requirements

- Node.js 22
- pnpm
- Git
- A Firebase project
- Access to the private `@saintrelion/*` packages

### Private package access

The required SaintRelion package keys/tokens are **not included in this repository**. Contact the developer to request access to the required keys.

Keep the project `.npmrc` free of tokens:

```ini
@saintrelion:registry=https://npm.pkg.github.com
```

Configure GitHub Packages authentication in your user-level pnpm/npm configuration using the key provided by the developer.

### Firebase

Create/select a Firebase project, add a Web App, and create a Cloud Firestore database.

Create `.env` from `.env.example`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Use your Firebase Web App configuration for these values. Do not commit `.env`.

### Run locally

```bash
pnpm install
pnpm dev
```

Use the URL printed by Vite. The restored local configuration may use port `5174`.

## First administrator

A fresh Firestore database has no OJTLOG users. Use the temporary `/setup-admin` restoration route to create the first administrator.

After creating it:

1. Remove/disable the temporary first-admin setup page and route.
2. Open `/admin/login`.
3. Sign in with the administrator account.
4. Register department advisers and interns through the Admin dashboard.

> **Important:** `/setup-admin` is only for initializing an empty development/restoration database. Do not leave it publicly accessible.

Regular interns and department advisers use `/login`.

## Docker

Build and run the application with:

```bash
docker compose up -d --build
```

Then open:

```text
http://localhost:8080
```

Firebase `VITE_*` values are needed during the Vite build. The private GitHub Packages token is supplied through the configured BuildKit secret and must not be committed to `.npmrc` or passed as a Docker `ARG`.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Main application |
| `/login` | Intern/adviser login |
| `/admin/login` | Administrator login |
| `/setup-admin` | Temporary first-admin restoration route |

## Security notes

This repository is preserved as an **archived portfolio project**. The Firebase provider in this version was intended for rapid development/prototyping rather than being the recommended production security architecture.

Do not commit `.env`, package tokens, confidential OJT/student records, or other private client data. Firebase web configuration does not replace proper access control and Firestore Security Rules. Use synthetic or authorized data for demonstrations and screenshots.

## Status

**Archived / portfolio project.** The legacy `@saintrelion/*` packages used by this version are deprecated and no longer actively supported.

## Author

**June Aurelius Jacinto**  
Full-Stack Software Developer

GitHub: https://github.com/SaintRelion

