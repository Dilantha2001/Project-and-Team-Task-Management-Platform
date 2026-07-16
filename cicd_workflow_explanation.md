# CI/CD Workflow Explanation

This project utilizes **GitHub Actions** to automate continuous integration and ensure code quality before it is deployed. The configuration file is located at `.github/workflows/ci.yml`.

## Overview

The pipeline triggers automatically on two events:
1. When code is **pushed** to the `dev`, `main`, or `live` branches.
2. When a **Pull Request** is opened against the `dev`, `main`, or `live` branches.

It is split into two independent, parallel jobs: **Backend CI** and **Frontend CI**.

## Job 1: Backend CI
This job runs in an `ubuntu-latest` environment and executes exclusively inside the `./backend` directory.

### Steps:
1. **Checkout Code**: Retrieves the repository code onto the runner.
2. **Setup Node.js**: Installs Node.js version 20 and configures npm caching based on `backend/package-lock.json` to speed up subsequent runs.
3. **Install Dependencies**: Runs `npm ci` (Clean Install) to reliably install exactly what is defined in the lockfile.
4. **Generate Prisma Client**: Runs `npx prisma generate` to build the database types needed for the backend to compile.
5. **Build Backend**: Runs `npm run build` to compile the TypeScript Express code into executable JavaScript. If there are syntax errors, the pipeline fails here.

## Job 2: Frontend CI
This job also runs in an `ubuntu-latest` environment but executes exclusively inside the `./frontend` directory.

### Steps:
1. **Checkout Code**: Retrieves the repository code.
2. **Setup Node.js**: Installs Node.js version 20 and caches dependencies based on `frontend/package-lock.json`.
3. **Install Dependencies**: Runs `npm ci` for the Next.js frontend.
4. **Lint Frontend**: Runs `npm run lint` (ESLint) to catch stylistic issues, bad imports, or problematic React code (e.g., unused variables).
5. **Build Frontend**: Runs `npm run build` to create a Next.js production build. This step rigorously checks TypeScript typings across all `.tsx` and `.ts` files, ensuring that the application will render correctly in production.

## Why this matters?
This pipeline acts as a safety net. If a developer accidentally pushes broken code, or code with type errors, the CI pipeline will fail, marking the commit with a red "X" on GitHub. This prevents broken code from being deployed to production (`live`) or merged into the main development line (`dev`/`main`).
