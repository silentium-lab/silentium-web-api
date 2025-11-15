import { Message } from "silentium";

export function Timer(delay: number) {
  return Message<number>((t) => {
    setTimeout(() => {
      t.use(delay);
    }, delay);
  });
}
