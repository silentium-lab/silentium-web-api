import { Event, Transport } from 'silentium';

function FetchedData($request, error, $abort) {
  return Event((u) => {
    const abortController = new AbortController();
    if ($abort) {
      $abort.event(
        Transport((abort) => {
          if (abort) {
            abortController.abort();
          }
        })
      );
    }
    $request.event(
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
  return Event((t) => {
    $request.event(
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
  return Event((t) => {
    $selector.event(
      Transport((selector) => {
        const element = document.querySelectorAll(selector);
        if (element.length) {
          t.use(Array.from(element));
        } else {
          const targetNode = document.body;
          const config = { childList: true, subtree: true };
          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "childList") {
                const element2 = document.querySelectorAll(selector);
                if (element2) {
                  t.use(Array.from(element2));
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
  return Event((t) => {
    setTimeout(() => {
      t.use(delay);
    }, delay);
  });
}

export { Elements, FetchedData, Log, RequestJson, Timer };
//# sourceMappingURL=silentium-web-api.mjs.map
