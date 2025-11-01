import { Event, EventType } from "silentium";

export function Timer(delay: number): EventType<number> {
  return Event((t) => {
    setTimeout(() => {
      t.use(delay);
    }, delay);
  });
}
