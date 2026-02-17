# File System Utilities

The `FileUtil` class provides a unified API for file operations in Obsidian plugins, abstracting away the differences between using the high-level Obsidian `Vault` API and the lower-level `Adapter` API.

## Importing

```typescript
import { FileUtil, FileSystemType } from "standard-obsidian-lib/src/filesystem/file_util";
```

## Enum: `FileSystemType`

Determines which underlying API to use for the operation.

*   `OBSIDIAN` (Default): Uses `app.vault` methods (`readBinary`, `modifyBinary`, `createBinary`, `trash`). Safe and recommended for most vault operations.
*   `RAW`: Uses `app.vault.adapter` methods (`readBinary`, `writeBinary`, `trashSystem`/`trashLocal`). Useful for accessing files outside the vault or when raw filesystem access is needed.

## Methods

### `fetchFile`

Reads a file and returns its content as a `Uint8Array`.

**Signature:**

```typescript
static async fetchFile(
    app: App, 
    filePath: string, 
    type: FileSystemType = FileSystemType.OBSIDIAN
): Promise<Result<Uint8Array, StatusError>>
```

**Parameters:**
*   `app`: The Obsidian `App` instance.
*   `filePath`: Path to the file.
*   `type`: `FileSystemType` (default: `OBSIDIAN`).

**Returns:**
*   `Ok(Uint8Array)`: The file content.
*   `Err(StatusError)`: If file not found or read failure.

### `writeToFile`

Writes data to a file. Handles creating parent directories if they don't exist.

**Signature:**

```typescript
static async writeToFile(
    app: App,
    filePath: string,
    data: Uint8Array,
    type: FileSystemType = FileSystemType.OBSIDIAN,
    opts?: DataWriteOptions
): Promise<StatusResult<StatusError>>
```

**Parameters:**
*   `app`: The Obsidian `App` instance.
*   `filePath`: Path to write to.
*   `data`: Content to write.
*   `type`: `FileSystemType` (default: `OBSIDIAN`).
*   `opts`: Optional `DataWriteOptions` (e.g., `mtime`, `ctime`).

**Returns:**
*   `Ok()`: Success.
*   `Err(StatusError)`: If write failed (e.g., mkdir error).

### `deleteFile`

Deletes a file, moving it to trash.

**Signature:**

```typescript
static async deleteFile(
    app: App,
    filePath: string,
    type: FileSystemType = FileSystemType.OBSIDIAN
): Promise<StatusResult<StatusError>>
```

**Parameters:**
*   `app`: The Obsidian `App` instance.
*   `filePath`: Path to delete.
*   `type`: `FileSystemType` (default: `OBSIDIAN`).

**Returns:**
*   `Ok()`: Success.
*   `Err(StatusError)`: If delete failed (e.g., file not found).
