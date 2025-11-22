/**
 * Transport for log values to console
 */
export function Log(group: string) {
  return (v: unknown) => {
    console.log(group, v);
  };
}
