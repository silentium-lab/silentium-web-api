import { From, InformationType, OwnerType, TheInformation } from "silentium";
import { FetchRequestType } from "./FetchedData";

/**
 * Represents a request for JSON data.
 */
export class RequestJson extends TheInformation<Partial<FetchRequestType>> {
  public constructor(
    private requestSrc: InformationType<Partial<FetchRequestType>>,
    private errorOwner?: OwnerType<unknown>,
  ) {
    super(requestSrc, errorOwner);
  }

  public value(o: OwnerType<Partial<FetchRequestType>>): this {
    this.requestSrc.value(
      new From((r) => {
        try {
          o.give({
            ...r,
            headers: {
              ...(r.headers ?? {}),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(r.body),
          });
        } catch {
          this.errorOwner?.give(new Error("Failed to parse JSON"));
        }
      }),
    );
    return this;
  }
}
