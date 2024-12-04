interface TaggedErrorOptions<Cause = never> {
  message?: string;
  cause?: Cause;
}

export class TaggedError<Tag extends string, Cause = never> extends Error {
  tag: Tag;
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
