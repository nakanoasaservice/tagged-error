/**
 * Options for creating a TaggedError
 * @template Cause - The type of the cause data
 */
interface TaggedErrorOptions<Cause = undefined> {
  /**
   * Optional error message.
   *
   * Stored as a non-enumerable property — does not appear in `JSON.stringify`
   * or object spread. Access it directly via `err.message`.
   */
  message?: string;
  /**
   * Optional cause data.
   *
   * Stored as a non-enumerable property — does not appear in `JSON.stringify`
   * or object spread. Access it directly via `err.cause`.
   */
  cause?: Cause;
}

/**
 * A type-safe error class that includes a tag and optional cause data
 * @template Tag - The literal string type of the error tag
 * @template Cause - The type of the cause data
 * @example
 * ```ts
 * const result = divideAndSquareRoot(10, 0);
 *
 * if (result instanceof TaggedError) {
 *   switch (result.tag) {
 *     case "DIVIDE_BY_ZERO":
 *       console.log("Cannot divide by zero");
 *       break;
 *     case "NEGATIVE_RESULT":
 *       console.log(`Cannot square root ${result.cause.value}`);
 *       break;
 *   }
 * } else {
 *   console.log("Result:", result); // result is typed as number
 * }
 * ```
 */
export class TaggedError<Tag extends string, Cause = undefined> extends Error {
  /**
   * The tag identifying the type of error.
   *
   * Enumerable (appears in `JSON.stringify` and object spread).
   */
  declare readonly tag: Tag;

  /**
   * The cause data associated with the error.
   *
   * Non-enumerable — does not appear in `JSON.stringify` or object spread.
   * Access it directly via `err.cause`.
   */
  declare cause: Cause;

  /**
   * A human-readable name for the error, formatted as `TaggedError(TAG)`.
   *
   * Non-enumerable (defined as a prototype getter) — does not appear in
   * `JSON.stringify` or object spread.
   */
  override get name(): string {
    return `TaggedError(${this.tag})`;
  }

  /**
   * Creates a new TaggedError instance
   * @param tag - The tag identifying the type of error
   * @param options - Optional configuration options
   * @example
   * ```ts
   * // Create a simple tagged error
   * return new TaggedError("NOT_FOUND", {
   *   message: "Resource not found"
   * });
   *
   * // Create a tagged error with cause data
   * return new TaggedError("VALIDATION_ERROR", {
   *   message: "Invalid input",
   *   cause: { field: "email", value: "invalid" }
   * });
   * ```
   */
  constructor(
    tag: Tag,
    options?: TaggedErrorOptions<Cause>,
  ) {
    super(options?.message, { cause: options?.cause });
    this.tag = tag;
  }
}
