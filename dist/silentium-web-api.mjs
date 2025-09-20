import { TheInformation, From, All } from 'silentium';

class FetchedData extends TheInformation {
  constructor(requestSrc, errorOwner, abortSrc) {
    super(requestSrc, abortSrc);
    this.requestSrc = requestSrc;
    this.errorOwner = errorOwner;
    this.abortSrc = abortSrc;
  }
  value(o) {
    const abortController = new AbortController();
    if (this.abortSrc) {
      this.abortSrc.value(
        new From((abort) => {
          if (abort) {
            abortController.abort();
          }
        })
      );
    }
    this.requestSrc.value(
      new From((request) => {
        const { baseUrl, url, method, credentials, headers, body, query } = request;
        let urlWithQuery;
        try {
          urlWithQuery = new URL(String(url), baseUrl);
        } catch {
          this.errorOwner?.give(new Error("Invalid URL"));
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
        fetch(urlWithQuery.toString(), options).then((response) => response.text()).then((data) => o.give(data)).catch((error) => {
          this.errorOwner?.give(error);
        });
      })
    );
    return this;
  }
}

class RequestJson extends TheInformation {
  constructor(requestSrc, errorOwner) {
    super(requestSrc, errorOwner);
    this.requestSrc = requestSrc;
    this.errorOwner = errorOwner;
  }
  value(o) {
    this.requestSrc.value(
      new From((r) => {
        try {
          o.give({
            ...r,
            headers: {
              ...r.headers ?? {},
              "Content-Type": "application/json"
            },
            body: JSON.stringify(r.body)
          });
        } catch {
          this.errorOwner?.give(new Error("Failed to parse JSON"));
        }
      })
    );
    return this;
  }
}

class Elements extends TheInformation {
  constructor(selectorSrc) {
    super(selectorSrc);
    this.selectorSrc = selectorSrc;
  }
  value(o) {
    this.selectorSrc.value(
      new From((selectorContent) => {
        const element = document.querySelectorAll(selectorContent);
        if (element.length) {
          o.give(Array.from(element));
        } else {
          const targetNode = document.body;
          const config = { childList: true, subtree: true };
          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "childList") {
                const element2 = document.querySelectorAll(selectorContent);
                if (element2) {
                  o.give(Array.from(element2));
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
    return this;
  }
}

class Log extends TheInformation {
  constructor(sourceSrc, titleSrc) {
    super(sourceSrc, titleSrc);
    this.sourceSrc = sourceSrc;
    this.titleSrc = titleSrc;
  }
  value(o) {
    new All(this.sourceSrc, this.titleSrc).value(
      new From(([source, title]) => {
        console.log("LOG:", title, source);
        o.give(source);
      })
    );
    return this;
  }
}

class Timer extends TheInformation {
  constructor(delay) {
    super();
    this.delay = delay;
  }
  value(o) {
    setTimeout(() => {
      o.give(this.delay);
    }, this.delay);
    return this;
  }
}

export { Elements, FetchedData, Log, RequestJson, Timer };
//# sourceMappingURL=silentium-web-api.mjs.map
