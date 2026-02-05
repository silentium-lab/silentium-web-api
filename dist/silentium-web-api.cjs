'use strict';

var silentium = require('silentium');

function FetchedData($request, $abort) {
  return silentium.Message(function FetchedDataImpl(resolve, reject) {
    const abortController = new AbortController();
    if ($abort) {
      $abort.then((abort) => {
        if (abort) {
          abortController.abort();
        }
      });
    }
    $request.then((request) => {
      const { baseUrl, url, method, credentials, headers, body, query } = request;
      let urlWithQuery;
      try {
        urlWithQuery = new URL(String(url), baseUrl);
      } catch {
        reject(new Error("Invalid URL"));
        return;
      }
      Object.entries(query ?? {}).forEach(
        ([key, value]) => urlWithQuery.searchParams.append(key, String(value))
      );
      const options = {
        method,
        credentials,
        headers,
        body,
        signal: abortController.signal
      };
      fetch(urlWithQuery.toString(), options).then((response) => response.text()).then(resolve).catch(reject);
    });
  });
}

function RequestJson($request) {
  return silentium.Message(
    function RequestJsonImpl(resolve, reject) {
      $request.then((r) => {
        try {
          resolve({
            ...r,
            headers: {
              ...r.headers ?? {},
              "Content-Type": "application/json"
            },
            body: JSON.stringify(r.body)
          });
        } catch {
          reject(new Error("Failed to parse JSON"));
        }
      });
    }
  );
}

function Elements(_selector) {
  const $selector = silentium.Actual(_selector);
  return silentium.Message(function ElementsImpl(r) {
    $selector.then((selector) => {
      const element = document.querySelectorAll(selector);
      if (element.length > 0) {
        r(Array.from(element));
      } else {
        const targetNode = document;
        const config = {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class", "id"]
        };
        const observer = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
              const checkNodes = (nodes) => {
                for (const node of Array.from(nodes)) {
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    const element2 = node;
                    if (element2.matches && element2.matches(selector)) {
                      const allElements = document.querySelectorAll(selector);
                      if (allElements.length > 0) {
                        r(Array.from(allElements));
                        observer.disconnect();
                        return true;
                      }
                    }
                    if (element2.querySelector && element2.querySelector(selector)) {
                      const allElements = document.querySelectorAll(selector);
                      if (allElements.length > 0) {
                        r(Array.from(allElements));
                        observer.disconnect();
                        return true;
                      }
                    }
                  }
                }
                return false;
              };
              if (checkNodes(mutation.addedNodes)) {
                break;
              }
            } else if (mutation.type === "attributes") {
              const target = mutation.target;
              if (target.matches && target.matches(selector)) {
                const allElements = document.querySelectorAll(selector);
                if (allElements.length > 0) {
                  r(Array.from(allElements));
                  observer.disconnect();
                  break;
                }
              }
            }
          }
        });
        observer.observe(targetNode, config);
      }
    });
  });
}

function Element(_selector) {
  const $selector = silentium.Actual(_selector);
  return silentium.Message(function ElementImpl(r) {
    $selector.then((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        r(element);
      } else {
        const targetNode = document;
        const config = {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class", "id"]
        };
        const observer = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
              const checkNodes = (nodes) => {
                for (const node of Array.from(nodes)) {
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    const element2 = node;
                    if (element2.matches && element2.matches(selector)) {
                      r(element2);
                      observer.disconnect();
                      return true;
                    }
                    if (element2.querySelector && element2.querySelector(selector)) {
                      const found = element2.querySelector(selector);
                      r(found);
                      observer.disconnect();
                      return true;
                    }
                  }
                }
                return false;
              };
              if (checkNodes(mutation.addedNodes)) {
                break;
              }
            } else if (mutation.type === "attributes") {
              const target = mutation.target;
              if (target.matches && target.matches(selector)) {
                r(target);
                observer.disconnect();
                break;
              }
            }
          }
        });
        observer.observe(targetNode, config);
      }
    });
  });
}

function Log(group) {
  return (v) => {
    console.log(group, v);
  };
}

function Timer(delay) {
  return silentium.Message((t) => {
    setTimeout(() => {
      t(delay);
    }, delay);
  });
}

function StorageRecord($name, defaultValue, storageType = "localStorage") {
  const nameSync = silentium.Primitive($name);
  const resultSrc = silentium.Late();
  return silentium.Source(
    (resolve) => {
      resultSrc.then(resolve);
      const storage = window[storageType];
      $name.then((name) => {
        window.addEventListener("storage", (e) => {
          if (e.storageArea === storage) {
            if (e.key === name) {
              const newValue = e.newValue ? JSON.parse(e.newValue) : defaultValue;
              if (newValue !== void 0 && newValue !== null) {
                resultSrc.use(newValue);
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
        } else if (defaultValue !== void 0) {
          resultSrc.use(defaultValue);
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
    }
  );
}

exports.Element = Element;
exports.Elements = Elements;
exports.FetchedData = FetchedData;
exports.Log = Log;
exports.RequestJson = RequestJson;
exports.StorageRecord = StorageRecord;
exports.Timer = Timer;
//# sourceMappingURL=silentium-web-api.cjs.map
