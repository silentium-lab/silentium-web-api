import {
  All,
  From,
  InformationType,
  OwnerType,
  TheInformation,
} from "silentium";

/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
export class Log<T> extends TheInformation<T> {
  public constructor(
    private sourceSrc: InformationType<T>,
    private titleSrc: InformationType<string>,
  ) {
    super(sourceSrc, titleSrc);
  }

  public value(o: OwnerType<T>): this {
    new All(this.sourceSrc, this.titleSrc).value(
      new From(([source, title]) => {
        console.log("LOG:", title, source);
        o.give(source);
      }),
    );
    return this;
  }
}
