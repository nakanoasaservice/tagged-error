/**
 * Options for creating a TaggedError
 * @template Cause - The type of the cause data
 */
interface TaggedErrorOptions<Cause = never> {
  /** Optional error message */
  message?: string;
  /** Optional cause data */
  cause?: Cause;
}

/**
 * A type-safe error class that includes a tag and optional cause data
 * @template Tag - The literal string type of the error tag
 * @template Cause - The type of the cause data
 * @example
 * ```ts
 * // Create a simple tagged error
 * const error = new TaggedError("NOT_FOUND", {
 *   message: "Resource not found"
 * });
 *
 * // Create a tagged error with cause data
 * const error = new TaggedError("VALIDATION_ERROR", {
 *   message: "Invalid input",
 *   cause: { field: "email", value: "invalid" }
 * });
 * ```
 */
export class TaggedError<Tag extends string, Cause = never> extends Error {
  /** The tag identifying the type of error */
  tag: Tag;
  /** The cause data associated with the error */
  override cause: Cause;

  constructor(
    tag: Tag,
    options: TaggedErrorOptions<Cause> | undefined = undefined,
  ) {
    super(options?.message);

    this.tag = tag;

    if (options?.cause) {
      this.cause = options.cause;
    }

    this.name = `TaggedError('${tag}')`;
  }
}
