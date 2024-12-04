# Tagged Err

Typing errors without custom error class.

## Installation

### via npm

```bash
# for npm
npm i @nakanoasaservice/tagged-err

# for pnpm
pnpm i @nakanoasaservice/tagged-err

# for yarn
yarn add @nakanoasaservice/tagged-err
```

### via jsr (esm only)

```bash
# for deno
deno add jsr:@naas/tagged-err

# for npm
npx jsr add @naas/tagged-err

# for pnpm
pnpm dlx jsr add @naas/tagged-err
```

## Usage

```ts
import { TaggedErr } from "@naas/tagged-err";

function divideAndSquareRoot(
  num: number,
  divisor: number,
):
  | number /* You don't have to write the return type because it's inferred */
  | TaggedErr<"DIVISOR_IS_ZERO">
  | TaggedErr<"UNSUPPORTED_COMPLEX_NUMBERS", { num: number; divisor: number }> {
  if (divisor === 0) {
    return new TaggedErr("DIVISOR_IS_ZERO", {
      message: "Divisor is zero",
    });
  }

  const dividedNum = num / divisor;

  if (dividedNum < 0) {
    return new TaggedErr("UNSUPPORTED_COMPLEX_NUMBERS", {
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
if (result instanceof TaggedErr) {
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
