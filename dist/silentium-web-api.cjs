'use strict';

var silentium = require('silentium');

const historyPoppedPage = (listenSrc, destroyedSrc) => {
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

const historyNewPate = (pushSrc, urlSrc) => {
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

const fetched = (fetchSrc, requestSrc, errorsGuest) => {
  const result = silentium.sourceOf();
  silentium.value(
    silentium.sourceAll([requestSrc, fetchSrc]),
    silentium.patron(([request, fetch]) => {
      fetch.fetch(
        request.url,
        { ...request, url: void 0 }
      ).then((response) => {
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
        silentium.give(error, errorsGuest);
      });
    })
  );
  return result;
};

const element = (createObserver, documentSrc, selectorSrc) => {
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
        silentium.give(content, guest);
      })
    );
  };
};

const input = (valueSrc, elementSrc) => {
  const setValue = () => {
    silentium.value(elementSrc, (element) => {
      valueSrc.give(element.value);
    });
  };
  let prevElement = null;
  silentium.value(
    elementSrc,
    silentium.patron((element) => {
      if (prevElement) {
        element.removeEventListener("keyup", setValue);
        element.removeEventListener("change", setValue);
      }
      element.addEventListener("keyup", setValue);
      element.addEventListener("change", setValue);
      prevElement = element;
    })
  );
  silentium.value(
    silentium.sourceAll([valueSrc, elementSrc]),
    silentium.patron(([value2, element]) => {
      element.value = String(value2);
    })
  );
  return valueSrc;
};

const text = (valueSrc, elementSrc) => {
  silentium.value(
    silentium.sourceAll([valueSrc, elementSrc]),
    silentium.patron(([v, el]) => {
      el.textContent = v;
    })
  );
  return valueSrc;
};

const html = (elementSrc, valueSrc) => {
  silentium.value(
    silentium.sourceAll([valueSrc, elementSrc]),
    silentium.patron(([v, el]) => {
      el.innerHTML = v;
    })
  );
  return valueSrc;
};

const classToggled = (elementSrc, classSrc) => {
  return silentium.sourceCombined(
    elementSrc,
    classSrc
  )((g, element, theClass) => {
    element.classList.toggle(theClass);
    silentium.give(theClass, g);
  });
};

const log = (consoleLike, title, source) => {
  const all = silentium.sourceAll([source, title, consoleLike]);
  silentium.value(
    all,
    silentium.patron(([s, title2, console]) => {
      console.log("LOG:", title2, s);
    })
  );
  return source;
};

exports.attribute = attribute;
exports.classToggled = classToggled;
exports.element = element;
exports.fetched = fetched;
exports.historyNewPate = historyNewPate;
exports.historyPoppedPage = historyPoppedPage;
exports.html = html;
exports.input = input;
exports.log = log;
exports.styleInstalled = styleInstalled;
exports.text = text;
//# sourceMappingURL=silentium-web-api.cjs.map
