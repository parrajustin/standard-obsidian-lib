# Schema Manager

Assuming you are using `zod` for schema validation, the `SchemaManager` simplifies managing versioned data schemas (e.g., for plugin settings or file formats). It handles validation, version detection, and automatic upgrades (migrations) from older versions to the latest.

## Importing

```typescript
import { SchemaManager, VersionedSchema } from "standard-obsidian-lib/src/schema/schema";
```

## Types

### `VersionedSchema<T, V>`

A helper type to enforce a `version` field on your schema types.

```typescript
// Define Zod schemas
const v0Schema = z.object({ version: z.literal(0), name: z.string() });
const v1Schema = z.object({ version: z.literal(1), fullName: z.string() });

// Define Types
type DataV0 = z.infer<typeof v0Schema>;
type DataV1 = z.infer<typeof v1Schema>;
```

## Usage

### 1. Initialize `SchemaManager`

You must provide:
1.  **Name**: For error messages.
2.  **Schema List**: Array of Zod schemas, ordered by version (0, 1, 2...).
3.  **Converters**: Array of migration functions. Index `i` converts version `i` to `i+1`.
4.  **Default Value**: Function returning the latest version data (default).

```typescript
const SCHEMA_MANAGER = new SchemaManager<[DataV0, DataV1], 1>(
    "MyPluginSettings",
    [v0Schema, v1Schema], // Schemas
    [
        // Converter: V0 -> V1
        (prev: DataV0) => {
            return Ok({
                version: 1,
                fullName: prev.name
            });
        }
    ],
    // Default Factory
    () => ({ version: 1, fullName: "Default User" })
);
```

### 2. `getDefault()`

Returns a `Result` containing the default data (latest version).

```typescript
const defaultData = SCHEMA_MANAGER.getDefault();
```

### 3. `updateSchema(data: any)`

Takes input data (unknown version or format), validates it, and upgrades it to the latest version.

1.  Checks if `data` is valid.
2.  Reads `version` field.
3.  Validates against that version's Zod schema.
4.  Runs converter chain (e.g., V0 -> V1 -> V2) until latest version is reached.

```typescript
const loadedData = await loadData(); // from Obsidian
const result = SCHEMA_MANAGER.updateSchema(loadedData);

if (result.ok) {
    const latestSettings = result.val; // Typed as DataV1
} else {
    console.error("Schema migration failed:", result.val);
}
```
