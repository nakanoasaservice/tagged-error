interface LastErrOptions<Cause = never> {
  message?: string;
  cause?: Cause;
}

export class LastErr<Code extends string, Cause = never> extends Error {
  code: Code;

  // @ts-expect-error [TS2564]
  cause: Cause;

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
