import { DataType } from "silentium";

export const timer = (delay: number): DataType<number> => {
  return (u) => {
    setTimeout(() => {
      u(delay);
    }, delay);
  };
};
