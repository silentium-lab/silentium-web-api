import { Tap, TapType } from "silentium";

/**
 * Transport for log values to console
 */
export function Log<T>(group: string): TapType {
  return Tap<T>((v) => {
    console.log(group, v);
  });
}
