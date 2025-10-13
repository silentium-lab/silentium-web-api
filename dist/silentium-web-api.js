import { All } from 'silentium';

function FetchedData(requestSrc, errorOwner, abortSrc) {
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
}

function RequestJson(requestSrc, errorOwner) {
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
}

function Elements(selectorSrc) {
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
}

function Log(sourceSrc, titleSrc) {
  return (u) => {
    All(
      sourceSrc,
      titleSrc
    )(([source, title]) => {
      console.log("LOG:", title, source);
      u(source);
    });
  };
}

function Timer(delay) {
  return (user) => {
    setTimeout(() => {
      user(delay);
    }, delay);
  };
}

export { Elements, FetchedData, Log, RequestJson, Timer };
//# sourceMappingURL=silentium-web-api.js.map
