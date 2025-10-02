import { all } from 'silentium';

const fetchedData = (requestSrc, errorOwner, abortSrc) => {
  return (u) => {
    const abortController = new AbortController();
    if (abortSrc) {
      abortSrc((abort) => {
        if (abort) {
          abortController.abort();
        }
      });
    }
    requestSrc((request) => {
      const { baseUrl, url, method, credentials, headers, body, query } = request;
      let urlWithQuery;
      try {
        urlWithQuery = new URL(String(url), baseUrl);
      } catch {
        errorOwner?.(new Error("Invalid URL"));
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
      fetch(urlWithQuery.toString(), options).then((response) => response.text()).then((data) => u(data)).catch((error) => {
        errorOwner?.(error);
      });
    });
  };
};

const requestJson = (requestSrc, errorOwner) => {
  return (u) => {
    requestSrc((r) => {
      try {
        u({
          ...r,
          headers: {
            ...r.headers ?? {},
            "Content-Type": "application/json"
          },
          body: JSON.stringify(r.body)
        });
      } catch {
        errorOwner?.(new Error("Failed to parse JSON"));
      }
    });
  };
};

const elements = (selectorSrc) => {
  return (u) => {
    selectorSrc((selectorContent) => {
      const element = document.querySelectorAll(selectorContent);
      if (element.length) {
        u(Array.from(element));
      } else {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
              const element2 = document.querySelectorAll(selectorContent);
              if (element2) {
                u(Array.from(element2));
                observer.disconnect();
                break;
              }
            }
          }
        });
        observer.observe(targetNode, config);
      }
    });
  };
};

const log = (sourceSrc, titleSrc) => {
  return (u) => {
    all(
      sourceSrc,
      titleSrc
    )(([source, title]) => {
      console.log("LOG:", title, source);
      u(source);
    });
  };
};

const timer = (delay) => {
  return (u) => {
    setTimeout(() => {
      u(delay);
    }, delay);
  };
};

export { elements, fetchedData, log, requestJson, timer };
//# sourceMappingURL=silentium-web-api.mjs.map
