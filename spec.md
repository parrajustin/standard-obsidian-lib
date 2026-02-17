# Standard Obsidian Library Specification

## Overview
This library aims to provide standardized utilities for Obsidian plugin development, building upon the `standard-ts-lib` and adopting Google's TypeScript Style Guide.

## Prerequisites & Setup

### GEMINI.md
- [ ] Create `standard-obsidian-lib/GEMINI.md`.
- **Content**:
  - Link to `standard-ts-lib/GEMINI.md`.
  - Reference Google TypeScript Style Guide.

### Dependency Management
- [ ] Create/Update `standard-obsidian-lib/package.json`.
- **Dependencies**:
  - `obsidian` (Peer Dependency)
  - `standard-ts-lib` (Dependency/DevDependency depending on linking strategy)
  - `zod` (For schema validation)
  - `@opentelemetry/api` (For decorators)
  - `typescript` (Dev)
  - `tslib` (Runtime)

## Modules

### 1. Decorators (`src/decorators`)
**Source**: `obsidian-drive-sync/src/logging/tracing/result_span.decorator.ts`

**Goal**: Port tracing decorators for standardized observability in `Result`-returning functions.

**Plan**:
- [ ] Copy `result_span.decorator.ts`.
- [ ] Ensure `SetSpanStatusFromResult` is available (copy from `set-span-status.ts`).
- [ ] Update imports to point to `standard-ts-lib` for `Result` and `StatusError`.

### 2. Filesystem (`src/filesystem`)
**Source**: 
- `obsidian-drive-sync/src/filesystem/file_util_obsidian_api.ts`
- `obsidian-drive-sync/src/filesystem/file_util_raw_api.ts`

**Goal**: Generalize filesystem access with a unified API.

**Plan**:
- [ ] Copy `file_util_obsidian_api.ts` and `file_util_raw_api.ts`.
- [ ] **Refactor**:
  - Remove `@Span()` decorators.
  - Remove `LOGGER` usage and imports.
  - Update imports to `standard-ts-lib` for `Result`, `WrapPromise`, `InjectMeta`, etc.
  - Keep `@PromiseResultSpanError` if decorators are available (allows mostly-transparent error reporting to spans if they exist).
  - Update imports of `@Span()` to remove or replace with no-op if necessary, but removing usage entirely is preferred.
- [ ] **New Generalization API**:
  - Create `file_util.ts`.
  - Define `FileSystemType` enum: `OBSIDIAN`, `RAW`.
  - Implement `fetchFile(app: App, path: string, type: FileSystemType): Promise<Result<Uint8Array, StatusError>>`.
    - Delegates to `FileUtilObsidian` or `FileUtilRaw` based on type.

### 3. Schema (`src/schema`)
**Source**: `obsidian-drive-sync/src/schema/schema.ts`

**Goal**: provide versioned schema management using `zod`.

**Plan**:
- [ ] Copy `schema.ts`.
- [ ] **Refactor**:
  - Remove `@Span()` decorators.
  - Remove `setAttributeOnActiveSpan`.
  - Remove any logging imports.
  - Update imports to `standard-ts-lib`.

## Testing
**Source**:
- `obsidian-drive-sync/src/filesystem/file_util_obsidian_api.test.ts`
- `obsidian-drive-sync/src/filesystem/file_util_raw_api.test.ts`
- `obsidian-drive-sync/src/schema/schema.test.ts`

**Plan**:
- [ ] Copy and adapt tests to new package structure.
- [ ] Ensure tests run with `jest` (or configured test runner).
- [ ] Add strict type checking.

## Usage Guidelines
- All code must strictly follow Google TypeScript Style Guide.
- Use `standard-ts-lib` utilities (`Result`, `Optional`, etc.) over ad-hoc solutions.
