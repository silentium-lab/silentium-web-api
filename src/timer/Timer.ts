import { EventType } from "silentium";

export function Timer(delay: number): EventType<number> {
  return (user) => {
    setTimeout(() => {
      user(delay);
    }, delay);
  };
}
