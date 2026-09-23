# OJTLOG

OJTLOG is a role-based On-the-Job Training (OJT) attendance and management system built with React, TypeScript, Vite, Firebase/Firestore, and a set of reusable `@saintrelion/*` libraries.

The system provides separate workflows for administrators, department advisers, and interns. It covers account management, intern assignment, attendance logging and evaluation, OJT-hour tracking, accomplishments, and report generation.

> [!IMPORTANT]
> **Legacy project / library notice**
>
> This repository uses an older generation of my `@saintrelion/*` framework libraries. These packages are now **deprecated and no longer actively supported** while I develop a newer framework/library architecture.
>
> In this project, both `@saintrelion/auth-lib` and `@saintrelion/data-access-layer` are configured to use their **Firebase client providers**. Those providers were designed for fast application development and prototyping. The old libraries also supported a local mock provider for development and an API-based authentication/data approach for deployments where backend logic should remain server-side.
>
> Because this archived project uses the Firebase client provider, some authentication and data-access logic that would normally live behind a backend API is visible in the frontend bundle. **Do not treat this repository's Firebase authentication implementation as a recommended production security architecture.** A production deployment should move sensitive authentication, authorization, and privileged data operations behind a secured backend/API and enforce appropriate database security rules.

## Features

### Administrator

- Dedicated administrator portal
- Register and manage department advisers
- Register and manage interns
- View and manage account information

### Department adviser

- Department dashboard and live attendance monitoring
- Register and manage interns assigned to the department
- Review and evaluate attendance records
- Configure department attendance settings
- Track intern OJT progress
- Manage account information

### Intern

- OJT attendance workflow: **Time In → Break Out → Break In → Time Out**
- Attendance history and evaluation status
- OJT-hour/progress tracking
- Accomplishment entries
- Attendance and DTR reporting
- Account management

Attendance records can include supporting information such as timestamps, location data, and captured images depending on the workflow and browser permissions.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite
- **UI:** Tailwind CSS, Radix UI, Lucide
- **Data / backend service:** Firebase + Cloud Firestore
- **Data fetching:** TanStack Query
- **Maps / location:** Leaflet, React Leaflet, Geolib
- **PWA:** Vite PWA
- **Package manager:** pnpm
- **Reusable application libraries:** `@saintrelion/auth-lib`, `@saintrelion/data-access-layer`, `@saintrelion/forms`, `@saintrelion/routers`, `@saintrelion/notifications`, and other `@saintrelion/*` packages

## Architecture

```text
React / TypeScript UI
        │
        ├── @saintrelion/auth-lib
        ├── @saintrelion/data-access-layer
        ├── @saintrelion/forms
        ├── @saintrelion/routers
        └── other reusable @saintrelion packages
        │
        ▼
Firebase provider
        │
        ▼
Cloud Firestore
```

The project currently configures both authentication and the data-access layer in Firebase mode. The application name used by the libraries is `ojt`, allowing the shared libraries to namespace project resources.

The codebase is organized around reusable pages, components, models, repositories/resources, role-based routing, and shared framework packages rather than putting all application behavior into individual pages.

## Fresh setup

### 1. Requirements

Install:

- Node.js 22 or a compatible current Node.js version
- pnpm
- Git
- A Firebase project

This repository also depends on private/scoped `@saintrelion/*` packages hosted through GitHub Packages. Your local package manager must be authenticated with an account/token that has permission to read those packages.

The project `.npmrc` should define the package registry without committing a token:

```ini
@saintrelion:registry=https://npm.pkg.github.com
```

Configure the package token in your **user-level** pnpm/npm configuration rather than committing credentials to the repository.

### 2. Create a Firebase project

In Firebase:

1. Create or select a Firebase project.
2. Add a **Web App** to the project.
3. Open **Project Settings → General → Your apps**.
4. Copy the Firebase web-app configuration values.
5. Create a **Cloud Firestore** database for the project.

You do not need to manually create all Firestore collections before starting the application. Firestore collections/documents are created when the application writes its first records.

> Firebase web configuration values identify the Firebase project and are used by the browser application. They are not a substitute for access control. Configure appropriate Firebase/Firestore security restrictions for the environment in which the project is used.

### 3. Configure environment variables

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

Fill these values using the Web App configuration from Firebase Project Settings.

Do **not** commit `.env`. A sanitized `.env.example` may be committed as a template.

### 4. Install dependencies

```bash
pnpm install
```

### 5. Run locally

```bash
pnpm dev
```

If your local project script has been configured to use port `5174`, open:

```text
http://localhost:5174
```

Otherwise, use the local URL printed by Vite.

## First administrator setup

A fresh Firestore database has no OJTLOG users. The normal account-registration UI intentionally creates **intern** or **department adviser** accounts; it is not the bootstrap path for an administrator.

Create the first administrator using the temporary `FirstAdminSetup.tsx` bootstrap page supplied for local restoration of this project. The bootstrap must use the project's existing `auth.register(info, password)` method so that the configured legacy authentication provider creates the user document and its expected password data.

The administrator account should be registered with the role values used by OJTLOG:

```ts
{
  firstName,
  lastName,
  username,
  email,
  isEnabled: true,
  roles: ["admin"],
  role: "admin",
}
```

The registration call for this version of the library is:

```ts
await auth.register(info, password);
```

After the administrator is successfully created:

1. Remove the temporary bootstrap page/route from the application.
2. Open `/admin/login`.
3. Sign in using the newly created administrator credentials.
4. Use the Admin dashboard to register the initial department advisers and interns.

> [!WARNING]
> **Never leave a first-admin bootstrap route publicly accessible.** It exists only to initialize an empty development/restoration database and should be removed immediately after the first administrator is created.

## User roles and portals

### Administrator

Use the dedicated administrator login route:

```text
/admin/login
```

After authentication, administrators use the `/admin` area to manage department advisers, interns, and their account.

**Known legacy behavior:** the older authentication flow may also allow administrator credentials to be submitted through the regular OJT instructor/adviser login interface. This was not fully restricted in the archived implementation. Administrators should use `/admin/login`; the other behavior should be treated as a legacy limitation rather than an intended login flow.

### Department adviser

Department advisers use the regular login flow and are routed into `/departmentadviser`. Their workspace includes the department dashboard, intern management, attendance evaluation, settings, and account management.

### Intern

Interns use the regular login flow and are routed into `/intern`. Their workspace includes attendance logging, attendance records, accomplishments, and account management.

## Typical first-run workflow

```text
Create Firebase project
        ↓
Create Cloud Firestore database
        ↓
Add Firebase Web App credentials to .env
        ↓
Install dependencies and run OJTLOG
        ↓
Temporarily bootstrap the first Admin
        ↓
Remove the bootstrap route
        ↓
Admin signs in at /admin/login
        ↓
Admin registers Department Advisers and/or Interns
        ↓
Department Adviser manages assigned interns and attendance
        ↓
Intern records OJT attendance and accomplishments
```

## Firestore and authentication caveat

This project does **not** represent a conventional Firebase Authentication + trusted backend architecture.

The legacy `@saintrelion/auth-lib` Firebase provider used by this repository performs its Firebase-mode authentication flow against application data in Firestore, while the legacy data-access library communicates with Firestore from the client. That was useful for quickly developing online applications using the same higher-level interfaces as other library providers, but it means implementation details are shipped to the browser.

For that reason:

- Do not deploy this archived Firebase-provider configuration as-is for a security-sensitive production system.
- Do not assume hiding Firebase configuration values secures the database.
- Do not use permissive Firestore rules as a replacement for authentication/authorization.
- Do not place privileged secrets or server credentials in `VITE_*` variables or frontend code.
- Prefer a secured API/backend for privileged authentication, authorization, and sensitive business operations in a production architecture.

The older SaintRelion library design included different providers so application-facing APIs could remain similar while the backing implementation changed. The Firebase and mock providers were useful during development; an API-based provider was the appropriate direction when server-side enforcement was required.

## Firebase data on a clean installation

If you intentionally delete the old Firestore data, the application starts without users or application records. This is expected.

The general recovery order is:

1. Keep/configure the Firebase project and Firestore database.
2. Configure the new Firebase Web App values in `.env`.
3. Start the application.
4. Bootstrap one administrator using the temporary setup utility.
5. Log in through `/admin/login`.
6. Recreate advisers and interns through the application's normal management UI.
7. Create new attendance, settings, accomplishment, and other application records through their corresponding workflows.

For portfolio/demo use, use synthetic or authorized test data. Do not restore confidential student, examination, attendance, personal, or client records simply to populate the repository.

## Docker

The application can also be built as a static Vite application and served through Nginx. In the provided Docker setup, Node/pnpm is used only during the build stage and the generated `dist` files are served by Nginx at runtime.

Firebase `VITE_*` values are build-time frontend configuration. They must therefore be available when the Vite production build runs.

Example:

```bash
docker compose up -d --build
```

With the provided port mapping, the application is available at:

```text
http://localhost:8080
```

The GitHub Packages token used to install private `@saintrelion/*` packages should be supplied to the Docker build as a BuildKit secret/environment-backed secret and should **not** be copied into the image, committed to `.npmrc`, or passed as a Docker `ARG`.

## Project structure

Important areas of the codebase include:

```text
src/
├── components/       Reusable application components and dialogs
├── layout/           Public and authenticated layouts
├── lib/              Firebase/client utilities
├── model_types/      Shared model/type definitions
├── models/           Application data models
├── pages/            Role-specific application screens
├── repositories/     Resource/data registrations
├── navigations.tsx   Role-based application routes
└── sr-config.tsx     SaintRelion provider configuration
```

## Development notes

The project is preserved as an example of a larger application built around reusable libraries rather than as a current reference implementation of the SaintRelion framework.

Several architectural ideas from this codebase—shared authentication/data-access interfaces, reusable resources, forms, routing, notifications, and provider-based infrastructure—belong to an older iteration of that work. The original `@saintrelion/*` packages used here are deprecated, and current framework/library development is taking place separately.

This distinction is especially important when reviewing the repository: **client-visible Firebase provider code reflects the development-oriented provider selected by this application, not an assertion that privileged backend logic should generally be implemented in a frontend application.**

## Privacy and repository hygiene

Before publishing or sharing a restored copy of the project:

- Do not commit `.env` files or package-access tokens.
- Do not commit confidential OJT/student documents or production records.
- Use synthetic data for screenshots and demonstrations.
- Review Git history for credentials or private documents if the repository previously contained them.
- Revoke/rotate any credential that was accidentally exposed, even if it is later removed from Git history.

## Status

This is an archived/portfolio project. It can be restored for development and demonstration, but the legacy `@saintrelion/*` packages used by this version are deprecated and are not actively supported.
