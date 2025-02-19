# Tagged Error

A type-safe error handling solution without custom error classes.

## Installation

### via npm

```bash
# using npm
npm i @nakanoaas/tagged-error

# using pnpm
pnpm i @nakanoaas/tagged-error

# using yarn
yarn add @nakanoaas/tagged-error
```

### via jsr (ESM only)

```bash
# using deno
deno add jsr:@nakanoaas/tagged-error

# using npm
npx jsr add @nakanoaas/tagged-error

# using pnpm
pnpm dlx jsr add @nakanoaas/tagged-error
```

## Usage

```ts
import { TaggedError } from "@nakanoaas/tagged-error";

function divideAndSquareRoot(
  num: number,
  divisor: number,
):
  | number // The return type is inferred, so this type annotation is optional
  | TaggedError<"DIVISOR_IS_ZERO">
  | TaggedError<
    "UNSUPPORTED_COMPLEX_NUMBERS",
    { num: number; divisor: number }
  > {
  if (divisor === 0) {
    return new TaggedError("DIVISOR_IS_ZERO", {
      message: "Divisor is zero",
    });
  }

  const dividedNum = num / divisor;

  if (dividedNum < 0) {
    return new TaggedError("UNSUPPORTED_COMPLEX_NUMBERS", {
      message: "Complex numbers are not supported",
      cause: {
        num,
        divisor,
      },
    });
  }

  return Math.sqrt(dividedNum);
}

const result = divideAndSquareRoot(1, 0);

/*
  You can't use the result as a number because it might be an error.
*/

// Check if the result is an error
if (result instanceof TaggedError) {
  if (result.tag === "DIVISOR_IS_ZERO") {
    console.log("Divisor is zero");
    return;
  }

  if (result.tag === "UNSUPPORTED_COMPLEX_NUMBERS") {
    console.log("Unsupported complex numbers");

    // You can access the typed cause
    console.log("number: ", result.cause.num);
    console.log("divisor: ", result.cause.divisor);
    return;
  }
}

// Now you can use the result as a number
console.log("Result * 2 = ", result * 2);
```
