# Tagged Error

🏷️ Type-safe error handling in TypeScript without the hassle of custom error
classes.

[![npm version](https://badge.fury.io/js/@nakanoaas%2Ftagged-error.svg)](https://www.npmjs.com/package/@nakanoaas/tagged-error)
[![JSR Version](https://jsr.io/badges/@nakanoaas/tagged-error)](https://jsr.io/@nakanoaas/tagged-error)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Type-safe**: Full TypeScript support with type inference
- 🪶 **Lightweight**: Zero dependencies, minimal code
- 🔍 **Easy debugging**: Clear error messages with structured data
- 💡 **Simple API**: No need to create custom error classes

## Installation

Requires ES2022 or later.

Choose your preferred package manager:

```bash
npm install @nakanoaas/tagged-error    # npm
pnpm add @nakanoaas/tagged-error       # pnpm
yarn add @nakanoaas/tagged-error       # yarn
```

For Deno users (ESM only):

```bash
deno add jsr:@nakanoaas/tagged-error   # deno
npx jsr add @nakanoaas/tagged-error    # npm
pnpm dlx jsr add @nakanoaas/tagged-error # pnpm
```

## Quick Start

```typescript
import { TaggedError } from "@nakanoaas/tagged-error";

// Example: A function that might fail in different ways
function divideAndSquareRoot(num: number, divisor: number) {
  if (divisor === 0) {
    return new TaggedError("DIVISOR_IS_ZERO", {
      message: "Cannot divide by zero",
    });
  }

  const result = num / divisor;

  if (result < 0) {
    return new TaggedError("NEGATIVE_RESULT", {
      message: "Cannot calculate square root of negative number",
      cause: { value: result },
    });
  }

  return Math.sqrt(result);
}

// Using the function
const result = divideAndSquareRoot(10, 0);

// Type-safe error handling
if (result instanceof TaggedError) {
  switch (result.tag) {
    case "DIVISOR_IS_ZERO":
      console.error("Division by zero error:", result.message);
      break;
    case "NEGATIVE_RESULT":
      console.error(
        "Negative result error:",
        result.message,
        "Value:",
        result.cause.value,
      );
      break;
  }
} else {
  console.log("Result:", result); // result is typed as number
}
```

## Why Tagged Error?

Traditional error handling in TypeScript often involves creating multiple error
classes or using string literals. Tagged Error provides a simpler approach:

```typescript
// ❌ Traditional approach - lots of boilerplate
class DivisorZeroError extends Error {
  constructor() {
    super("Cannot divide by zero");
  }
}

// ✅ Tagged Error approach - clean and type-safe
return new TaggedError("DIVISOR_IS_ZERO", {
  message: "Cannot divide by zero",
});
```

## API Reference

### `TaggedError<Tag, Cause>`

```typescript
new TaggedError(tag: string, options?: {
  message?: string;
  cause?: any;
})
```

#### Parameters

- `tag`: A string literal that identifies the error type (stored as a `readonly`
  property)
- `options`: Optional configuration object
  - `message`: Human-readable error message (non-enumerable, matching native
    `Error` behavior)
  - `cause`: Additional error context data (non-enumerable, matching native
    `Error` behavior)

#### Properties

- `tag` _(readonly)_: The string literal passed at construction, narrowed to its
  exact type for use in `switch` statements
- `cause`: The cause data passed in options. Non-enumerable — will not appear in
  `JSON.stringify` or object spread
- `name`: Computed as `TaggedError(TAG)` via a prototype getter —
  non-enumerable, will not appear in `JSON.stringify` or object spread
- `message`, `stack`: Inherited from `Error`

## Migrating to v2

### `error.name` format changed

The tag is no longer wrapped in single quotes, and `name` is now a
non-enumerable prototype getter.

```ts
// v1
error.name === "TaggedError('MY_TAG')";

// v2
error.name === "TaggedError(MY_TAG)";
```

### `cause` and `name` are now non-enumerable

Both `cause` and `name` now behave like native `Error` properties — they will
not appear in `JSON.stringify` or object spread.

```ts
const err = new TaggedError("MY_TAG", { cause: { value: 42 } });

// v1: {"tag":"MY_TAG","name":"TaggedError('MY_TAG')","cause":{"value":42}}
// v2: {"tag":"MY_TAG"}
JSON.stringify(err);

// Access cause directly as before — no change needed
err.cause.value; // 42
```

### `tag` is now `readonly`

Assigning to `tag` after construction is now a compile-time error.

### ES2022 or later is required

Ensure your `tsconfig.json` targets ES2022 or later:

```json
{ "compilerOptions": { "target": "ES2022" } }
```

## License

MIT © [Nakano as a Service](https://github.com/nakanoasaservice)
