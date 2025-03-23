# Easygen task

## Running the project

Install the project's dependencies by running the following command
```bash
yarn
```

## What's inside?

This repo includes the following packages/apps:

### Apps and Packages

    .
    ├── apps
    │   ├── api                       # NestJS app (https://nestjs.com).
    │   └── web                       # Next.js app (https://nextjs.org).
    └── packages
        ├── @repo/eslint-config       # `eslint` configurations (includes `prettier`)
        ├── @repo/jest-config         # `jest` configurations
        ├── @repo/typescript-config   # `tsconfig.json`s used throughout the monorepo
        └── @repo/api                 # Shared Zod Schemes & Types

### Commands

#### Build

```bash
yarn run build
```

#### Develop

```bash
yarn run dev
```

#### Lint

```bash
yarn run lint
```

#### Format

```bash
yarn format
```

### Notes
I am more of an expressjs guy so forgive me if the code is a little bit express like 