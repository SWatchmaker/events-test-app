# Agent Instructions for recylink-test

This document contains instructions for coding agents operating in this repository. 
Follow these guidelines to ensure consistency, quality, and adherence to project standards.

## 1. Project Overview

This is a monorepo managed by **Nx** and **pnpm**.
It contains the following applications:
- **apps/webapp**: A React application using Vite and TanStack Router.
- **apps/svs-events**: A NestJS backend application using Prisma.
- **apps/webapp-bff**: A Backend-for-Frontend (BFF) using Express and GraphQL.

## 2. Build, Lint, and Test Commands

Always use `nx` to run tasks. This ensures caching and proper dependency handling.

### Building
To build all projects:
```bash
nx run-many -t build
```
To build a specific project:
```bash
nx build <project-name>
# Example:
nx build svs-events
nx build webapp
```

### Linting
To lint all projects:
```bash
nx run-many -t lint
```
To lint a specific project:
```bash
nx lint <project-name>
```
The project uses ESLint. Fixable errors can often be resolved automatically:
```bash
nx lint <project-name> --fix
```

### Testing
Currently, tests are primarily set up for the **svs-events** (NestJS) application.
To run all tests for a project:
```bash
nx test <project-name>
# Example:
nx test svs-events
```

**Running a Single Test:**
To run a specific test file or test case, pass arguments to the underlying test runner (Jest).
```bash
# Run tests in a specific file
nx test svs-events -- --testPathPattern="app.controller.spec.ts"

# Run a specific test case by name (using -t)
nx test svs-events -- --t "should return \"Hello World!\""
```
*Note: The `--` separator is required to pass arguments to the underlying script.*

### Development Server
To start the development servers:
```bash
nx run-many -t start:dev
# or for a single app:
nx run <project-name>:start:dev
```

## 3. Code Style Guidelines

Adhere strictly to the following conventions.

### General
- **Language**: TypeScript is used exclusively.
- **Formatting**: Code is formatted using Prettier. Run `nx format:write` if unsure.
- **Indentation**: 2 spaces.
- **Semicolons**: Always use semicolons.
- **Quotes**: Single quotes `'` generally, but follow Prettier's auto-formatting.

### Naming Conventions
- **Files**: Kebab-case (e.g., `app.module.ts`, `user-profile.component.tsx`).
- **Classes/Components**: PascalCase (e.g., `AppController`, `UserProfile`).
- **Interfaces/Types**: PascalCase (e.g., `User`, `AuthResponse`).
- **Variables/Functions**: camelCase (e.g., `getUser`, `isValid`).
- **Constants**: UPPER_SNAKE_CASE for global constants, camelCase for local constants.
- **Directories**: Kebab-case.

### TypeScript
- **Strict Mode**: `strict: true` is enabled. Do not disable it.
- **Types**: Explicitly define return types for public methods and complex functions.
- **Any**: Avoid `any` at all costs. Use `unknown` or specific types/interfaces.
- **Imports**:
  - Group imports: External libraries first, then internal modules.
  - Use absolute paths or standard relative paths as configured in `tsconfig`.
  - Avoid circular dependencies.

### React (apps/webapp)
- **Components**: Functional components only. Use hooks.
- **State**: Use strictly typed state.
- **Router**: Uses TanStack Router (`createRouter`, `RouterProvider`).
- **Styling**: Tailwind CSS is used (`index.css`). Use utility classes.
- **File Structure**:
  - Routes in `src/routes/`.
  - Components in `src/components/`.
  - Utils in `src/utils/`.

### NestJS (apps/svs-events)
- **Architecture**: Follow the Module-Controller-Service pattern.
- **Dependency Injection**: Use constructor injection with `private readonly`.
- **Validation**: Use DTOs with `class-validator` decorators (e.g., `@IsString()`, `@IsNotEmpty()`).
- **Database**: Use Prisma for database interactions.
  - Define models in `prisma/schema.prisma`.
  - Run `nx run svs-events:prisma:generate` after schema changes.

### Error Handling
- **Async/Await**: Use `async/await` over raw promises.
- **Try/Catch**: Wrap fallible async operations in try/catch blocks.
- **NestJS**: Use Exception Filters or standard HTTP exceptions (`NotFoundException`, `BadRequestException`).

## 4. Workflow for Agents

1.  **Explore**: Before making changes, explore the file structure and read related files to understand the context.
2.  **Verify**: Check for existing functionality to avoid duplication.
3.  **Implement**: Write code following the style guide above.
4.  **Test**:
    - If modifying `svs-events`, write or update unit tests (`.spec.ts`).
    - Run tests to ensure no regressions: `nx test svs-events`.
5.  **Lint**: Run linting before finalizing: `nx lint <project-name>`.

## 5. Environment & Configuration

- **Environment Variables**: Managed via `.env` files (not committed). Use `process.env` or `@nestjs/config`.
- **Package Management**: Use `pnpm`. Do not mix with `npm` or `yarn`.
- **Nx Configuration**: `nx.json` handles global configuration. Project-specific config is in `project.json` or inferred from `package.json`.

## 6. Specific Tooling Notes

- **TanStack Router**: The router is file-system based in `src/routes`. Run the generator if routes are added/changed manually (though the watcher should handle it).
- **Prisma**: If you modify the schema, remember to migrate or push changes.
  - `nx run svs-events:prisma:push` (for dev)
  - `nx run svs-events:prisma:generate` (to update client)

## 7. Cursor/Copilot Rules

(No specific `.cursorrules` or `copilot-instructions.md` were found in the repository. Follow the general guidelines above.)
