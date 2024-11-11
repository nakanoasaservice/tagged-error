# Last Err

Typing errors without custom error class.

## Installation

### via npm

```bash
# for npm
npm i @nakanoasaservice/last-err

# for pnpm
pnpm i @nakanoasaservice/last-err

# for yarn
yarn add @nakanoasaservice/last-err
```

### via jsr (esm only)

```bash
# for deno
deno add jsr:@naas/last-err

# for npm
npx jsr add @naas/last-err

# for pnpm
pnpm dlx jsr add @naas/last-err
```

## Usage

```ts
import { LastErr } from "@naas/last-err";

function divideAndSquareRoot(
  num: number,
  divisor: number,
):
  | number /* You don't have to write the return type because it's inferred */
  | LastErr<"DIVISOR_IS_ZERO">
  | LastErr<"UNSUPPORTED_COMPLEX_NUMBERS", { num: number; divisor: number }> {
  if (divisor === 0) {
    return new LastErr("DIVISOR_IS_ZERO", {
      message: "Divisor is zero",
    });
  }

  const dividedNum = num / divisor;

  if (dividedNum < 0) {
    return new LastErr("UNSUPPORTED_COMPLEX_NUMBERS", {
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
if (result instanceof LastErr) {
  if (result.code === "DIVISOR_IS_ZERO") {
    console.log("Divisor is zero");
    return;
  }

  if (result.code === "UNSUPPORTED_COMPLEX_NUMBERS") {
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
