'use strict';

var silentium = require('silentium');

class FetchedData extends silentium.TheInformation {
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
        new silentium.From((abort) => {
          if (abort) {
            abortController.abort();
          }
        })
      );
    }
    this.requestSrc.value(
      new silentium.From((request) => {
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

class RequestJson extends silentium.TheInformation {
  constructor(requestSrc, errorOwner) {
    super(requestSrc, errorOwner);
    this.requestSrc = requestSrc;
    this.errorOwner = errorOwner;
  }
  value(o) {
    this.requestSrc.value(
      new silentium.From((r) => {
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

class Elements extends silentium.TheInformation {
  constructor(selectorSrc) {
    super(selectorSrc);
    this.selectorSrc = selectorSrc;
  }
  value(o) {
    this.selectorSrc.value(
      new silentium.From((selectorContent) => {
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

class Log extends silentium.TheInformation {
  constructor(sourceSrc, titleSrc) {
    super(sourceSrc, titleSrc);
    this.sourceSrc = sourceSrc;
    this.titleSrc = titleSrc;
  }
  value(o) {
    new silentium.All(this.sourceSrc, this.titleSrc).value(
      new silentium.From(([source, title]) => {
        console.log("LOG:", title, source);
        o.give(source);
      })
    );
    return this;
  }
}

exports.Elements = Elements;
exports.FetchedData = FetchedData;
exports.Log = Log;
exports.RequestJson = RequestJson;
//# sourceMappingURL=silentium-web-api.cjs.map
