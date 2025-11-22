import { Message } from 'silentium';

function FetchedData($request, $abort) {
  return Message(function FetchedDataImpl(resolve, reject) {
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
  return Message(
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

function Elements($selector) {
  return Message(function ElementsImpl(r) {
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

function Element($selector) {
  return Message(function ElementImpl(r) {
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
  return Message((t) => {
    setTimeout(() => {
      t.use(delay);
    }, delay);
  });
}

export { Element, Elements, FetchedData, Log, RequestJson, Timer };
//# sourceMappingURL=silentium-web-api.mjs.map
