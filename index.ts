interface LastErrOptions<Cause = never> {
  message?: string;
  cause?: Cause;
}

export class LastErr<Code extends string, Cause = never> extends Error {
  code: Code;

  // @ts-ignore [TS2564] cause may not exists
  override cause: Cause;

  constructor(
    code: Code,
    options: LastErrOptions<Cause> | undefined = undefined,
  ) {
    super(options?.message);

    this.code = code;

    if (options?.cause) {
      this.cause = options.cause;
    }

    this.name = `LastErr('${code}')`;
  }
}
