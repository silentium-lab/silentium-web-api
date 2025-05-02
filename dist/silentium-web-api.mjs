import { sourceOf, value, patronOnce, destroy, give, sourceAll, guestCast, patron, subSourceMany } from 'silentium';

const historyPoppedPage = (listenSrc, destroyedSrc) => {
  const result = sourceOf();
  const handler = (e) => {
    const { state } = e;
    if (state?.url) {
      give(String(state.url), result);
    }
  };
  value(
    listenSrc,
    patronOnce((listen) => {
      listen.addEventListener("popstate", handler);
    })
  );
  value(
    destroyedSrc,
    patronOnce(() => {
      destroy([result]);
      value(listenSrc, (listen) => {
        listen.removeEventListener("popstate", handler);
      });
    })
  );
  return result;
};

const historyNewPate = (pushSrc, urlSrc) => {
  return (guest) => {
    value(
      sourceAll([urlSrc, pushSrc]),
      guestCast(guest, ([url, push]) => {
        push.pushState(
          {
            url,
            date: Date.now()
          },
          "",
          url
        );
        give(url, guest);
      })
    );
  };
};

const fetched = (fetch, request, errors) => {
  const result = sourceOf();
  value(
    sourceAll([request, fetch]),
    patron(([req, fetch2]) => {
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
        give(content, result);
      }).catch((error) => {
        give(error, errors);
      });
    })
  );
  return result;
};

const element = (createObserver, documentSrc, selectorSrc) => {
  return (guest) => {
    value(
      sourceAll([selectorSrc, documentSrc]),
      guestCast(guest, ([selector, document]) => {
        const element2 = document.querySelector(selector);
        if (element2) {
          give(element2, guest);
        } else if (createObserver) {
          const targetNode = document.body;
          const config = { childList: true, subtree: true };
          const observer = createObserver.get((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "childList") {
                const element3 = document.querySelector(selector);
                if (element3) {
                  give(element3, guest);
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
  const result = sourceOf();
  subSourceMany(result, [elementSrc, attrNameSrc, defaultValueSrc]);
  value(
    sourceAll([elementSrc, attrNameSrc, defaultValueSrc]),
    patron(([el, attrName, defaultValue]) => {
      give(el.getAttribute(attrName) || defaultValue, result);
    })
  );
  return result;
};

const styleInstalled = (documentSrc, contentSrc) => {
  return (guest) => {
    value(
      sourceAll([documentSrc, contentSrc]),
      guestCast(guest, ([document, content]) => {
        const styleEl = document.createElement("style");
        styleEl.textContent = content;
        document.head.appendChild(styleEl);
        give(content, guest);
      })
    );
  };
};

const input = (valueSrc, elementSrc) => {
  const setValue = () => {
    value(elementSrc, (element) => {
      valueSrc.give(element.value);
    });
  };
  let prevElement = null;
  value(
    elementSrc,
    patron((element) => {
      if (prevElement) {
        element.removeEventListener("keyup", setValue);
        element.removeEventListener("change", setValue);
      }
      element.addEventListener("keyup", setValue);
      element.addEventListener("change", setValue);
      prevElement = element;
    })
  );
  value(
    sourceAll([valueSrc, elementSrc]),
    patron(([value2, element]) => {
      element.value = String(value2);
    })
  );
  return valueSrc;
};

const text = (valueSrc, elementSrc) => {
  value(
    sourceAll([valueSrc, elementSrc]),
    patron(([v, el]) => {
      el.textContent = v;
    })
  );
  return valueSrc;
};

const html = (elementSrc, valueSrc) => {
  value(
    sourceAll([valueSrc, elementSrc]),
    patron(([v, el]) => {
      el.innerHTML = v;
    })
  );
  return valueSrc;
};

const log = (consoleLike, title, source) => {
  const all = sourceAll([source, title, consoleLike]);
  value(
    all,
    patron(([s, title2, console]) => {
      console.log("LOG:", title2, s);
    })
  );
  return source;
};

export { attribute, element, fetched, historyNewPate, historyPoppedPage, html, input, log, styleInstalled, text };
//# sourceMappingURL=silentium-web-api.mjs.map
