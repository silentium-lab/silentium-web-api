import { OwnerType, TheInformation } from "silentium";

export class Timer extends TheInformation<number> {
  public constructor(private delay: number) {
    super();
  }

  public value(o: OwnerType<number>): this {
    setTimeout(() => {
      o.give(this.delay);
    }, this.delay);
    return this;
  }
}
