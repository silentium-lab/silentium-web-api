import { sourceOf, value, patronOnce, destroy, give, sourceAll, patron, guestCast, subSourceMany, source, sourceCombined } from 'silentium';

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
  value(
    sourceAll([urlSrc, pushSrc]),
    patron(([url, push]) => {
      push.pushState(
        {
          url,
          date: Date.now()
        },
        "",
        url
      );
    })
  );
  return urlSrc;
};

const fetched = (fetchSrc, requestSrc, errorsGuest) => {
  const result = sourceOf();
  value(
    sourceAll([requestSrc, fetchSrc]),
    patron(([request, fetch]) => {
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
        give(content, result);
      }).catch((error) => {
        give(error, errorsGuest);
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

const elements = (createObserver, documentSrc, selectorSrc) => {
  return (guest) => {
    value(
      sourceAll([selectorSrc, documentSrc]),
      guestCast(guest, ([selector, document]) => {
        const element = document.querySelectorAll(selector);
        if (element) {
          give(Array.from(element), guest);
        } else if (createObserver) {
          const targetNode = document.body;
          const config = { childList: true, subtree: true };
          const observer = createObserver.get((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "childList") {
                const element2 = document.querySelectorAll(selector);
                if (element2) {
                  give(Array.from(element2), guest);
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

const attribute = (attrNameSrc, elementSrc, defaultValueSrc = "") => {
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

const link = (wrapperSrc, elementSelectorSrc, attributeSrc = source("href")) => {
  const result = sourceOf();
  value(
    sourceAll([wrapperSrc, elementSelectorSrc, attributeSrc]),
    ([wrapper, elementSelector, attribute]) => {
      wrapper.addEventListener("click", (e) => {
        if (e.target !== null && "matches" in e.target && typeof e.target.matches == "function" && e.target.matches(elementSelector)) {
          e.preventDefault();
          const href = e?.target?.getAttribute(attribute);
          if (href) {
            result.give(href);
          }
        }
      });
    }
  );
  return result;
};

const visible = (valueSrc, elementSrc, visibilityTypeSrc = "block") => {
  value(
    sourceAll([valueSrc, elementSrc, visibilityTypeSrc]),
    patron(([v, el, vt]) => {
      el.style.display = v ? vt : "none";
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

const classToggled = (elementSrc, classSrc) => {
  return sourceCombined(
    elementSrc,
    classSrc
  )((g, element, theClass) => {
    element.classList.toggle(theClass);
    give(theClass, g);
  });
};
const classAdded = (elementSrc, classSrc) => {
  return sourceCombined(
    elementSrc,
    classSrc
  )((g, element, theClass) => {
    element.classList.add(theClass);
    give(theClass, g);
  });
};
const classRemoved = (elementSrc, classSrc) => {
  return sourceCombined(
    elementSrc,
    classSrc
  )((g, element, theClass) => {
    element.classList.remove(theClass);
    give(theClass, g);
  });
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

export { attribute, classAdded, classRemoved, classToggled, element, elements, fetched, historyNewPate, historyPoppedPage, html, input, link, log, styleInstalled, text, visible };
//# sourceMappingURL=silentium-web-api.js.map
