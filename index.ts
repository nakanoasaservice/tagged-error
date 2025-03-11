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
 */
export class TaggedError<Tag extends string, Cause = never> extends Error {
  /** The tag identifying the type of error */
  tag: Tag;
  /** The cause data associated with the error */
  override cause: Cause;

  /**
   * Creates a new TaggedError instance
   * @param tag - The tag identifying the type of error
   * @param options - Optional configuration options
   * @example
   * ```ts
   * const error = new TaggedError("NOT_FOUND", {
   *   message: "Resource not found",
   *   cause: { field: "email", value: "invalid" },
   * });
   *
   * const error = new TaggedError("NOT_FOUND", {
   *   message: "Resource not found",
   *   cause: { field: "email", value: "invalid" },
   * });
   * ```
   */
  constructor(
    tag: Tag,
    options?: TaggedErrorOptions<Cause>,
  ) {
    super(options?.message);

    this.tag = tag;

    if (options?.cause) {
      this.cause = options.cause;
    }

    this.name = `TaggedError('${tag}')`;
  }
}
