'use strict';

var silentium = require('silentium');

const historyPoppedPage = (destroyedSrc, listenSrc) => {
  const result = silentium.sourceOf();
  const handler = (e) => {
    const { state } = e;
    if (state?.url) {
      silentium.give(String(state.url), result);
    }
  };
  silentium.value(
    listenSrc,
    silentium.patronOnce((listen) => {
      listen.addEventListener("popstate", handler);
    })
  );
  silentium.value(
    destroyedSrc,
    silentium.patronOnce(() => {
      silentium.destroy([result]);
      silentium.value(listenSrc, (listen) => {
        listen.removeEventListener("popstate", handler);
      });
    })
  );
  return result;
};

const historyNewPate = (urlSrc, pushSrc) => {
  return (guest) => {
    silentium.value(
      silentium.sourceAll([urlSrc, pushSrc]),
      silentium.guestCast(guest, ([url, push]) => {
        push.pushState(
          {
            url,
            date: Date.now()
          },
          "",
          url
        );
        silentium.give(url, guest);
      })
    );
  };
};

const fetched = (request, errors, fetch) => {
  const result = silentium.sourceOf();
  silentium.value(
    silentium.sourceAll([request, fetch]),
    silentium.patron(([req, fetch2]) => {
      fetch2.fetch(req).then((response) => {
        let readableResponse;
        if (response.headers.get("Content-Type") === "application/json") {
          readableResponse = response.json();
        } else {
          readableResponse = response.text();
        }
        if (!response.ok) {
          return Promise.reject(readableResponse);
        }
        return readableResponse;
      }).then((content) => {
        silentium.give(content, result);
      }).catch((error) => {
        silentium.give(error, errors);
      });
    })
  );
  return result;
};

const element = (selectorSrc, documentSrc, createObserver) => {
  return (guest) => {
    silentium.value(
      silentium.sourceAll([selectorSrc, documentSrc]),
      silentium.guestCast(guest, ([selector, document]) => {
        const element2 = document.querySelector(selector);
        if (element2) {
          silentium.give(element2, guest);
        } else if (createObserver) {
          const targetNode = document.body;
          const config = { childList: true, subtree: true };
          const observer = createObserver.get((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "childList") {
                const element3 = document.querySelector(selector);
                if (element3) {
                  silentium.give(element3, guest);
                  observer.disconnect();
                  break;
                }
              }
            }
          });
          observer.observe(targetNode, config);
        } else {
          throw new Error(`Element with selector=${selector} was not found!`);
        }
      })
    );
  };
};

const attribute = (elementSrc, attrNameSrc, defaultValueSrc = "") => {
  const result = silentium.sourceOf();
  silentium.subSourceMany(result, [elementSrc, attrNameSrc, defaultValueSrc]);
  silentium.value(
    silentium.sourceAll([elementSrc, attrNameSrc, defaultValueSrc]),
    silentium.patron(([el, attrName, defaultValue]) => {
      silentium.give(el.getAttribute(attrName) || defaultValue, result);
    })
  );
  return result;
};

const styleInstalled = (documentSrc, contentSrc) => {
  return (guest) => {
    silentium.value(
      silentium.sourceAll([documentSrc, contentSrc]),
      silentium.guestCast(guest, ([document, content]) => {
        const styleEl = document.createElement("style");
        styleEl.textContent = content;
        document.head.appendChild(styleEl);
        silentium.give(document, guest);
      })
    );
  };
};

const log = (source, title = "", consoleLike = console) => {
  const all = silentium.sourceAll([source, title, consoleLike]);
  silentium.value(
    all,
    silentium.patron(([s, title2, console2]) => {
      console2.log("LOG:", title2, s);
    })
  );
  return source;
};

exports.attribute = attribute;
exports.element = element;
exports.fetched = fetched;
exports.historyNewPate = historyNewPate;
exports.historyPoppedPage = historyPoppedPage;
exports.log = log;
exports.styleInstalled = styleInstalled;
//# sourceMappingURL=silentium-web-api.cjs.map
