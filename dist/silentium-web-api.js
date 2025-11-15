import { Message, Transport } from 'silentium';

function FetchedData($request, error, $abort) {
  return Message((u) => {
    const abortController = new AbortController();
    if ($abort) {
      $abort.to(
        Transport((abort) => {
          if (abort) {
            abortController.abort();
          }
        })
      );
    }
    $request.to(
      Transport((request) => {
        const { baseUrl, url, method, credentials, headers, body, query } = request;
        let urlWithQuery;
        try {
          urlWithQuery = new URL(String(url), baseUrl);
        } catch {
          error?.use(new Error("Invalid URL"));
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
        fetch(urlWithQuery.toString(), options).then((response) => response.text()).then((data) => u.use(data)).catch((error2) => {
          error2?.(error2);
        });
      })
    );
  });
}

function RequestJson($request, error) {
  return Message((t) => {
    $request.to(
      Transport((r) => {
        try {
          t.use({
            ...r,
            headers: {
              ...r.headers ?? {},
              "Content-Type": "application/json"
            },
            body: JSON.stringify(r.body)
          });
        } catch {
          error?.use(new Error("Failed to parse JSON"));
        }
      })
    );
  });
}

function Elements($selector) {
  return Message((t) => {
    $selector.to(
      Transport((selector) => {
        const element = document.querySelectorAll(selector);
        if (element.length > 0) {
          t.use(Array.from(element));
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
                          t.use(Array.from(allElements));
                          observer.disconnect();
                          return true;
                        }
                      }
                      if (element2.querySelector && element2.querySelector(selector)) {
                        const allElements = document.querySelectorAll(selector);
                        if (allElements.length > 0) {
                          t.use(Array.from(allElements));
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
                    t.use(Array.from(allElements));
                    observer.disconnect();
                    break;
                  }
                }
              }
            }
          });
          observer.observe(targetNode, config);
        }
      })
    );
  });
}

function Element($selector) {
  return Message((t) => {
    $selector.to(
      Transport((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          t.use(element);
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
                        t.use(element2);
                        observer.disconnect();
                        return true;
                      }
                      if (element2.querySelector && element2.querySelector(selector)) {
                        const found = element2.querySelector(selector);
                        t.use(found);
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
                  t.use(target);
                  observer.disconnect();
                  break;
                }
              }
            }
          });
          observer.observe(targetNode, config);
        }
      })
    );
  });
}

function Log(group) {
  return Transport((v) => {
    console.log(group, v);
  });
}

function Timer(delay) {
  return Message((t) => {
    setTimeout(() => {
      t.use(delay);
    }, delay);
  });
}

export { Element, Elements, FetchedData, Log, RequestJson, Timer };
//# sourceMappingURL=silentium-web-api.js.map
