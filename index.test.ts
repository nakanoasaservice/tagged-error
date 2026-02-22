import { assertEquals, assertInstanceOf } from "@std/assert";
import { assertType, type IsExact } from "@std/testing/types";
import { describe, it } from "@std/testing/bdd";
import { TaggedError } from "./index.ts";

Deno.test("TaggedError - basic instantiation", () => {
  const error = new TaggedError("TEST_ERROR");

  assertInstanceOf(error, Error);
  assertInstanceOf(error, TaggedError);
  assertEquals(error.tag, "TEST_ERROR");
  assertEquals(error.name, "TaggedError(TEST_ERROR)");
  assertEquals(error.message, "");
  assertEquals(error.cause, undefined);
  assertType<IsExact<typeof error, TaggedError<"TEST_ERROR", undefined>>>(true);
});

Deno.test("TaggedError - with message", () => {
  const errorMessage = "This is a test error message";
  const error = new TaggedError("TEST_ERROR", { message: errorMessage });

  assertEquals(error.message, errorMessage);
  assertEquals(error.tag, "TEST_ERROR");
  assertType<IsExact<typeof error, TaggedError<"TEST_ERROR", undefined>>>(true);
});

Deno.test("TaggedError - with cause data", () => {
  const causeData = { field: "email", value: "invalid" };
  const error = new TaggedError("VALIDATION_ERROR", {
    message: "Invalid input",
    cause: causeData,
  });

  assertEquals(error.tag, "VALIDATION_ERROR");
  assertEquals(error.message, "Invalid input");
  assertEquals(error.cause, causeData);
  assertType<
    IsExact<
      typeof error,
      TaggedError<"VALIDATION_ERROR", { field: string; value: string }>
    >
  >(true);
});

Deno.test("TaggedError - should set falsy cause values (0/empty string/false/null)", () => {
  const errorWithZero = new TaggedError("CAUSE_ZERO", { cause: 0 });
  assertEquals(errorWithZero.cause, 0);

  const errorWithEmptyString = new TaggedError("CAUSE_EMPTY_STRING", {
    cause: "",
  });
  assertEquals(errorWithEmptyString.cause, "");

  const errorWithFalse = new TaggedError("CAUSE_FALSE", { cause: false });
  assertEquals(errorWithFalse.cause, false);

  const errorWithNull = new TaggedError<"CAUSE_NULL", null>("CAUSE_NULL", {
    cause: null,
  });
  assertEquals(errorWithNull.cause, null);
});

Deno.test("TaggedError - should not set cause when cause is undefined", () => {
  const error = new TaggedError("CAUSE_UNDEFINED", { cause: undefined });
  assertEquals(error.cause, undefined);
});

describe("TaggedError in practice", () => {
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

  it("should return the correct result for valid inputs", () => {
    const result = divideAndSquareRoot(16, 4);
    assertEquals(result, 2);
  });

  it("should return a DIVISOR_IS_ZERO error when dividing by zero", () => {
    const result = divideAndSquareRoot(10, 0);

    assertInstanceOf(result, TaggedError);
    assertEquals(result.tag, "DIVISOR_IS_ZERO");
    assertEquals(result.message, "Cannot divide by zero");
  });

  it("should return a NEGATIVE_RESULT error when result is negative", () => {
    const result = divideAndSquareRoot(-10, 1);

    assertInstanceOf(result, TaggedError);
    assertEquals(result.tag, "NEGATIVE_RESULT");
    assertEquals(
      result.message,
      "Cannot calculate square root of negative number",
    );
    assertEquals(result.cause?.value, -10);
  });
});

// Property attribute tests
Deno.test("TaggedError - tag is enumerable", () => {
  const error = new TaggedError("TEST_ERROR", { cause: { value: 1 } });
  const descriptor = Object.getOwnPropertyDescriptor(error, "tag");

  assertEquals(descriptor?.enumerable, true);
});

Deno.test("TaggedError - cause is non-enumerable", () => {
  const error = new TaggedError("TEST_ERROR", { cause: { value: 1 } });
  const descriptor = Object.getOwnPropertyDescriptor(error, "cause");

  assertEquals(descriptor?.enumerable, false);
});

Deno.test("TaggedError - cause property exists even when not specified", () => {
  const error = new TaggedError("TEST_ERROR");

  assertEquals(Object.hasOwn(error, "cause"), true);
  assertEquals(error.cause, undefined);
});

Deno.test("TaggedError - name is a non-enumerable prototype getter", () => {
  const instanceDescriptor = Object.getOwnPropertyDescriptor(
    new TaggedError("TEST_ERROR"),
    "name",
  );
  assertEquals(instanceDescriptor, undefined);

  const protoDescriptor = Object.getOwnPropertyDescriptor(
    TaggedError.prototype,
    "name",
  );
  assertEquals(typeof protoDescriptor?.get, "function");
  assertEquals(protoDescriptor?.enumerable, false);
});

Deno.test("TaggedError - message is non-enumerable", () => {
  const error = new TaggedError("TEST_ERROR", { message: "hello" });
  const descriptor = Object.getOwnPropertyDescriptor(error, "message");

  assertEquals(descriptor?.enumerable, false);
});

Deno.test("TaggedError - JSON.stringify includes only tag", () => {
  const error = new TaggedError("TEST_ERROR", {
    message: "hello",
    cause: { value: 1 },
  });

  assertEquals(JSON.stringify(error), '{"tag":"TEST_ERROR"}');
});

// Type safety tests
Deno.test("TaggedError - type narrowing with instanceof", () => {
  function processResult(
    result: number | TaggedError<"ERROR_A" | "ERROR_B", { code: number }>,
  ) {
    if (result instanceof TaggedError) {
      // Type should be narrowed to TaggedError here
      assertEquals(typeof result.tag, "string");

      if (result.tag === "ERROR_A") {
        // Further narrowing based on tag
        assertEquals(typeof result.cause.code, "number");
      }

      return "error";
    } else {
      // Type should be narrowed to number here
      return result * 2;
    }
  }

  const errorResult = new TaggedError("ERROR_A", {
    message: "Test error",
    cause: { code: 123 },
  });

  assertEquals(processResult(errorResult), "error");
  assertEquals(processResult(42), 84);
});
