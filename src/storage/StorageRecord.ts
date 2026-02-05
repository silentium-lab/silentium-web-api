import { Late, Source, MessageType, Primitive } from "silentium";

/**
 * Data representation from Storage API
 */
export function StorageRecord<T = string>(
  $name: MessageType<string>,
  defaultValue?: unknown,
  storageType: "localStorage" | "sessionStorage" = "localStorage",
) {
  const nameSync = Primitive($name);
  const resultSrc = Late<T>();
  return Source<T>(
    (resolve) => {
      resultSrc.then(resolve);
      const storage = window[storageType];
      $name.then((name) => {
        window.addEventListener("storage", (e) => {
          if (e.storageArea === storage) {
            if (e.key === name) {
              const newValue = e.newValue
                ? JSON.parse(e.newValue)
                : defaultValue;
              if (newValue !== undefined && newValue !== null) {
                resultSrc.use(newValue as T);
              }
            }
          }
        });
        if (storage[name]) {
          try {
            resultSrc.use(JSON.parse(storage[name]));
          } catch {
            console.warn(`LocalStorageRecord cant parse value ${name}`);
          }
        } else if (defaultValue !== undefined) {
          resultSrc.use(defaultValue as T);
        }
      });
    },
    (v) => {
      const storage = window[storageType];
      resultSrc.use(v);

      try {
        storage[nameSync.primitiveWithException()] = JSON.stringify(v);
      } catch {
        console.warn(`LocalStorageRecord cant stringify value`);
      }
    },
  );
}
