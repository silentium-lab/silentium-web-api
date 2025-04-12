import { GuestObjectType } from "silentium";

export class Log implements GuestObjectType<unknown> {
  public constructor(private title: string = "") {}

  public introduction(): "patron" {
    return "patron";
  }

  public give(value: unknown): this {
    console.log("LOG: ", this.title, value);
    return this;
  }
}
