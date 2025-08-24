import { All, From, TheInformation, TheOwner } from "silentium";

/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
export class Log<T> extends TheInformation<T> {
  public constructor(
    private sourceSrc: TheInformation<T>,
    private titleSrc: TheInformation<string>,
  ) {
    super(sourceSrc, titleSrc);
  }

  public value(o: TheOwner<T>): this {
    new All(this.sourceSrc, this.titleSrc).value(
      new From(([source, title]) => {
        console.log("LOG:", title, source);
        o.give(source);
      }),
    );
    return this;
  }
}
