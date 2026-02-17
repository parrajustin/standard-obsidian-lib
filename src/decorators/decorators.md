# Result Span Decorators

These decorators automatically instrument methods with OpenTelemetry spans, specifically designed for methods returning `Result<T, StatusError>`. They capture the success/failure status of the `Result` and add it to the span.

## Importing

```typescript
import { ResultSpanError, PromiseResultSpanError } from "standard-obsidian-lib/src/decorators/result_span.decorator";
```

## Decorators

### `@ResultSpanError`

Use this for **synchronous** methods that return a `Result`.

**Usage:**

```typescript
class MyClass {
    @ResultSpanError
    public mySyncMethod(arg: string): Result<string, StatusError> {
        // ... logic
        return Ok("success");
    }
}
```

**Behavior:**
1.  Starts a span named `MyClass::mySyncMethod` (or just method name if class name unavailable).
2.  Executes the methods.
3.  If `Result` is `Ok`: Sets span status to `OK`.
4.  If `Result` is `Err`: Sets span status to `ERROR` and records the error message.

### `@PromiseResultSpanError`

Use this for **asynchronous** methods that return a `Promise<Result>`.

**Usage:**

```typescript
class MyClass {
    @PromiseResultSpanError
    public async myAsyncMethod(arg: string): Promise<Result<string, StatusError>> {
        // ... async logic
        return Ok("success");
    }
}
```

**Behavior:**
1.  Starts a span.
2.  Awaits the promise.
3.  On resolution, checks the `Result` and sets span status (`OK` or `ERROR`) accordingly.
