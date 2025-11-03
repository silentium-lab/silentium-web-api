import { Transport, TransportType } from "silentium";

/**
 * Transport for log values to console
 */
export function Log<T>(group: string): TransportType {
  return Transport<T>((v) => {
    console.log(group, v);
  });
}
