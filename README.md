# Tagged Error

Type-safe error handling for TypeScript — return errors instead of throwing
them.

[![npm version](https://badge.fury.io/js/@nakanoaas%2Ftagged-error.svg)](https://www.npmjs.com/package/@nakanoaas/tagged-error)
[![JSR Version](https://jsr.io/badges/@nakanoaas/tagged-error)](https://jsr.io/@nakanoaas/tagged-error)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## The Problem with try/catch in TypeScript

In TypeScript, `try/catch` has a fundamental limitation: **the caught value is
always typed as `unknown`**.

```typescript
try {
  const data = await fetchUser(id);
} catch (e) {
  // e is `unknown` — TypeScript has no idea what was thrown
  console.error(e.message); // Error: Object is of type 'unknown'
}
```

This means:

- You must cast or narrow `e` manually before using it
- The function signature gives no hint about what errors it might produce
- Callers have no way to know what to handle — unless they read the source

Even with custom error classes, `throw` cannot surface error types to callers.
The errors a function may throw are invisible to its type signature.

## The Idea: Return Errors, Don't Throw Them

Tagged Error takes a different approach, inspired by Rust's `Result<T, E>`
pattern: **treat errors as return values**.

When a function returns a `TaggedError`, it becomes part of the function's
return type. TypeScript can now see — and enforce — every possible outcome.

```typescript
// Return type is inferred as `User | TaggedError<"USER_NOT_FOUND">`
function findUser(id: string) {
  const user = db.users.findById(id);
  if (!user) {
    return new TaggedError("USER_NOT_FOUND", {
      message: `No user with id "${id}"`,
      cause: { id },
    });
  }
  return user;
}
```

The caller uses `instanceof` to narrow the type — TypeScript handles the rest:

```typescript
const result = findUser("u_123");

if (result instanceof Error) {
  // result is TaggedError<"USER_NOT_FOUND"> — fully typed
  console.error(result.message);
  console.error("Searched for id:", result.cause.id); // typed as string
  return;
}

// result is User here
console.log(result.name);
```

No `try/catch`. No type casting. No guessing.

## Quick Start

```typescript
import { TaggedError } from "@nakanoaas/tagged-error";
```

### Step 1 — Define a function that returns errors

```typescript
function login(username: string, password: string) {
  const user = db.users.findByUsername(username);

  if (!user) {
    return new TaggedError("USER_NOT_FOUND", {
      message: `No account found for "${username}"`,
    });
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return new TaggedError("ACCOUNT_LOCKED", {
      message: "Account is temporarily locked",
      cause: { lockedUntil: user.lockedUntil },
    });
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return new TaggedError("WRONG_PASSWORD", {
      message: "Incorrect password",
      cause: { attemptsRemaining: user.maxAttempts - user.failedAttempts - 1 },
    });
  }

  return { userId: user.id, token: generateToken(user) };
}
```

### Step 2 — Handle the result with full type safety

```typescript
const result = login("alice", "hunter2");

if (result instanceof Error) {
  switch (result.tag) {
    case "USER_NOT_FOUND":
      console.error(result.message);
      break;
    case "ACCOUNT_LOCKED":
      // result.cause.lockedUntil is typed as Date
      console.error(
        `Try again after ${result.cause.lockedUntil.toLocaleString()}`,
      );
      break;
    case "WRONG_PASSWORD":
      // result.cause.attemptsRemaining is typed as number
      console.error(`${result.cause.attemptsRemaining} attempts remaining`);
      break;
  }
  return;
}

// result is typed as { userId: string; token: string }
console.log("Logged in:", result.userId);
```

TypeScript infers the union return type automatically. If you forget to handle
an error case, the compiler will tell you.

## Features

- **Type-safe**: Every error appears in the return type — no hidden throws
- **No boilerplate**: No need to define custom error classes
- **Structured**: Attach typed context data via `cause`
- **Lightweight**: Zero dependencies, ~100 lines of source
- **Compatible**: Extends native `Error` — works with existing tooling

## Installation

Requires ES2022 or later.

```bash
npm install @nakanoaas/tagged-error    # npm
pnpm add @nakanoaas/tagged-error       # pnpm
yarn add @nakanoaas/tagged-error       # yarn
```

For Deno users (ESM only):

```bash
deno add jsr:@nakanoaas/tagged-error     # deno
npx jsr add @nakanoaas/tagged-error      # npm
pnpm dlx jsr add @nakanoaas/tagged-error # pnpm
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

| Property  | Type     | Enumerable | Description                                         |
| --------- | -------- | ---------- | --------------------------------------------------- |
| `tag`     | `Tag`    | Yes        | The string literal passed at construction           |
| `cause`   | `Cause`  | No         | Context data; excluded from `JSON.stringify`        |
| `name`    | `string` | No         | Computed as `TaggedError(TAG)` via prototype getter |
| `message` | `string` | No         | Inherited from `Error`                              |
| `stack`   | `string` | No         | Inherited from `Error`                              |

`JSON.stringify` will only include `tag`:

```typescript
const err = new TaggedError("MY_TAG", { cause: { value: 42 } });
JSON.stringify(err); // '{"tag":"MY_TAG"}'
err.cause.value; // 42
```

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
