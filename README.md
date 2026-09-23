# OJTLOG

OJTLOG is a role-based On-the-Job Training (OJT) attendance and management system built with React, TypeScript, Vite, Firebase/Firestore, and reusable `@saintrelion/*` libraries.

It provides dedicated workflows for administrators, department advisers, and interns, covering account and intern management, attendance logging and evaluation, OJT-hour tracking, accomplishments, and reports.

> [!IMPORTANT]
> **Legacy SaintRelion library notice**
>
> This project uses an older generation of my `@saintrelion/*` libraries. These packages are now **deprecated and no longer actively supported** while I develop a newer framework/library architecture.
>
> OJTLOG uses the libraries' **Firebase client providers**, which were intended for rapid online development and prototyping. This is why some authentication and data-access implementation is visible in the frontend.
>
> The same library architecture also supported a **local mock provider** for development and a **generic REST API provider** for production-oriented deployments, allowing authentication, authorization, data access, and sensitive business logic to remain server-side. The API provider is backend-framework agnostic.
>
> The Firebase-provider implementation in this archived project should therefore **not** be treated as a recommended production security architecture.

## Features

### Administrator

- Dedicated administrator portal
- Register and manage department advisers
- Register and manage interns
- Manage account information

### Department adviser

- Department dashboard and attendance monitoring
- Manage assigned interns
- Review and evaluate attendance records
- Configure department attendance settings
- Track intern OJT progress
- Manage account information

### Intern

- Four-step attendance workflow: **Time In → Break Out → Break In → Time Out**
- Attendance history and evaluation status
- OJT-hour/progress tracking
- Accomplishment entries
- Attendance and DTR reports
- Account management

Attendance records can include timestamps, location information, and captured images depending on browser permissions and the workflow being used.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite
- **UI:** Tailwind CSS, Radix UI, Lucide
- **Data service:** Firebase + Cloud Firestore
- **Data fetching:** TanStack Query
- **Maps / location:** Leaflet, React Leaflet, Geolib
- **PWA:** Vite PWA
- **Package manager:** pnpm
- **Reusable libraries:** `@saintrelion/auth-lib`, `@saintrelion/data-access-layer`, `@saintrelion/forms`, `@saintrelion/routers`, `@saintrelion/notifications`, and other `@saintrelion/*` packages

## Architecture

```text
React / TypeScript UI
        │
        ├── @saintrelion/auth-lib
        ├── @saintrelion/data-access-layer
        ├── @saintrelion/forms
        ├── @saintrelion/routers
        └── other @saintrelion packages
        │
        ▼
Firebase provider
        │
        ▼
Cloud Firestore
```

This archived version configures authentication and data access in Firebase mode. The application itself is organized around reusable pages, components, models, repositories/resources, role-based routing, and shared framework packages.

## Setup

### Requirements

- Node.js 22 or a compatible current version
- pnpm
- Git
- A Firebase project
- Access to the private/scoped `@saintrelion/*` packages used by this project

The project `.npmrc` should contain the package registry without a committed access token:

```ini
@saintrelion:registry=https://npm.pkg.github.com
```

Configure GitHub Packages authentication in your **user-level** pnpm/npm configuration.

### 1. Configure Firebase

Create or select a Firebase project, then:

1. Add a **Web App**.
2. Open **Project Settings → General → Your apps**.
3. Copy the Firebase web-app configuration.
4. Create a **Cloud Firestore** database.

Firestore collections do not need to be created manually. They are created as the application writes its records.

### 2. Configure environment variables

Create `.env` in the project root:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Fill these values using the Firebase Web App configuration.

Do **not** commit `.env`. Use `.env.example` as the repository template.

### 3. Install and run

```bash
pnpm install
pnpm dev
```

Use the URL printed by Vite. The restored local configuration may use port `5174`.

## First administrator setup

A fresh Firestore database contains no OJTLOG users. The normal registration UI creates **intern** and **department adviser** accounts, so the first administrator must be bootstrapped separately.

Use the temporary `FirstAdminSetup.tsx` page included for restoration. It uses the same legacy authentication provider as the application:

```ts
await auth.register(
  {
    firstName,
    lastName,
    username,
    email,
    isEnabled: true,
    roles: ["admin"],
    role: "admin",
  },
  password,
);
```

After the account is created:

1. Remove the temporary first-admin setup page/route.
2. Open `/admin/login`.
3. Sign in with the new administrator account.
4. Register department advisers and interns through the Admin dashboard.

> [!WARNING]
> Do not leave the first-admin bootstrap route publicly accessible. It is only intended to initialize an empty development/restoration database.

Administrators should use `/admin/login`. The archived authentication flow may also accept administrator credentials through the regular instructor/adviser login interface; this is a known legacy limitation rather than the intended Admin login flow.

## Typical workflow

```text
Firebase + Firestore setup
        ↓
Configure .env
        ↓
Run OJTLOG
        ↓
Bootstrap first Admin
        ↓
Admin registers Advisers / Interns
        ↓
Adviser manages attendance and OJT progress
        ↓
Intern records attendance and accomplishments
```

## Docker

The application can be built as a static Vite application and served through Nginx. Node/pnpm is used during the build stage; the generated `dist` files are served by Nginx at runtime.

```bash
docker compose up -d --build
```

With the provided Docker configuration:

```text
http://localhost:8080
```

Firebase `VITE_*` values are frontend build-time configuration and must be available when the Vite build runs.

The GitHub Packages token should be supplied to the Docker build through the configured BuildKit secret. Do **not** commit it to `.npmrc`, copy it into the image, or pass it as a Docker `ARG`.

## Project structure

```text
src/
├── components/       Reusable application components and dialogs
├── layout/           Public and authenticated layouts
├── lib/              Firebase/client utilities
├── model_types/      Shared model/type definitions
├── models/           Application data models
├── pages/            Role-specific application screens
├── repositories/     Resource/data registrations
├── navigations.tsx   Role-based routes
└── sr-config.tsx     SaintRelion provider configuration
```


## Application routes

After starting OJTLOG, use these entry points:

| Route | Purpose |
| --- | --- |
| `/` | Main application entry point |
| `/login` | Regular login for interns and department advisers |
| `/admin/login` | Dedicated administrator login |
| `/setup-admin` | Temporary first-administrator bootstrap page added for restoration |

For a fresh installation, open `/setup-admin` first and create the initial administrator. After the account is created, remove or disable the bootstrap route and continue through `/admin/login`. Department advisers and interns use the regular login flow.

> [!WARNING]
> `/setup-admin` is a temporary restoration route. Do not leave it publicly accessible after the first administrator has been created.

## Security and portfolio notes

This repository is preserved as an archived portfolio project and as an example of an earlier reusable-library architecture.

- The Firebase client provider was intended for rapid development/prototyping, not as the recommended production security model.
- Production-oriented use of the old SaintRelion architecture could use its generic REST API provider to keep privileged logic server-side.
- Firebase web configuration does not replace proper access control or Firestore security rules.
- Never place server credentials or privileged secrets in `VITE_*` variables or frontend code.
- Do not commit `.env`, GitHub Packages tokens, confidential OJT/student records, or other private client data.
- Use synthetic or authorized test data for demonstrations and screenshots.

## Status

**Archived / portfolio project.** The legacy `@saintrelion/*` packages used by this version are deprecated and are no longer actively supported. A newer framework/library architecture is being developed separately.
