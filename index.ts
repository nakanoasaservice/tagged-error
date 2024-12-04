interface TaggedErrOptions<Cause = never> {
  message?: string;
  cause?: Cause;
}

export class TaggedErr<Tag extends string, Cause = never> extends Error {
  tag: Tag;
  override cause: Cause;

  constructor(
    tag: Tag,
    options: TaggedErrOptions<Cause> | undefined = undefined,
  ) {
    super(options?.message);

    this.tag = tag;

    if (options?.cause) {
      this.cause = options.cause;
    }

    this.name = `TaggedErr('${tag}')`;
  }
}
