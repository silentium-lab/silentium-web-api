'use strict';

var silentium = require('silentium');

function FetchedData($request, error, $abort) {
  return silentium.Event((u) => {
    const abortController = new AbortController();
    if ($abort) {
      $abort.event(
        silentium.Transport((abort) => {
          if (abort) {
            abortController.abort();
          }
        })
      );
    }
    $request.event(
      silentium.Transport((request) => {
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
  return silentium.Event((t) => {
    $request.event(
      silentium.Transport((r) => {
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
  return silentium.Event((t) => {
    $selector.event(
      silentium.Transport((selector) => {
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

function Log(sourceSrc, titleSrc) {
  return silentium.Event((t) => {
    silentium.All(sourceSrc, titleSrc).event(
      silentium.Transport(([source, title]) => {
        console.log("LOG:", title, source);
        t.use(source);
      })
    );
  });
}

function Timer(delay) {
  return silentium.Event((t) => {
    setTimeout(() => {
      t.use(delay);
    }, delay);
  });
}

exports.Elements = Elements;
exports.FetchedData = FetchedData;
exports.Log = Log;
exports.RequestJson = RequestJson;
exports.Timer = Timer;
//# sourceMappingURL=silentium-web-api.cjs.map
