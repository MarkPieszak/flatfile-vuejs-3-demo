!(function (e, t) {
  if ("object" == typeof exports && "object" == typeof module)
    module.exports = t();
  else if ("function" == typeof define && define.amd) define([], t);
  else {
    var n = t();
    for (var r in n) ("object" == typeof exports ? exports : e)[r] = n[r];
  }
})(self, function () {
  return (() => {
    var e,
      t,
      n = {
        418: (e, t, n) => {
          "use strict";
          n.r(t), n.d(t, { flatfileImporter: () => O });
          const r = (e, t) => {
            if ("" === e.className) return;
            const n = e.className.split(" "),
              r = n.indexOf(t);
            r > -1 && n.splice(r, 1), (e.className = n.join(" "));
          };
          let i;
          function o(e) {
            return btoa(String.fromCharCode.apply(0, e))
              .replace(/=/g, "")
              .replace(/\+/g, "-")
              .replace(/\//g, "_");
          }
          function s(e) {
            return (
              (t = (t = window.btoa(unescape(encodeURIComponent(e))))
                .replace(/-/g, "+")
                .replace(/_/g, "/")
                .replace(/\s/g, "")),
              new Uint8Array(
                Array.prototype.map.call(atob(t), (e) => e.charCodeAt(0))
              )
            );
            var t;
          }
          function a(e, t, n) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = n),
              e
            );
          }
          var c = n(687),
            u = n(10),
            l = n.n(u),
            f = n(776),
            d = n.n(f),
            h = n(121),
            p = 1e3,
            y = 3e4,
            v = (e) => "string" == typeof e;
          const m = c.gql`
  mutation InitializeEmptyBatch($importedFromUrl: String!) {
    initializeEmptyBatch(importedFromUrl: $importedFromUrl) {
      batchId
      workspaceId
      schemas {
        id
      }
    }
  }
`,
            b = c.gql`
  query GetFinalDatabaseView($skip: Int, $batchId: UUID, $limit: Int!) {
    getFinalDatabaseView(skip: $skip, limit: $limit, batchId: $batchId) {
      rows
      totalRows
    }
  }
`,
            g = c.gql`
  subscription BatchStatusUpdated($batchId: UUID!) {
    batchStatusUpdated(batchId: $batchId) {
      id
      status
    }
  }
`,
            w = new (n(729).EventEmitter)();
          function _(e, t) {
            w.emit(e, t);
          }
          const E = () => {
            w.removeAllListeners();
          };
          class x {
            constructor(e, t) {
              (this.token = e),
                (this.apiUrl = t),
                a(this, "client", void 0),
                a(this, "pubsub", void 0),
                a(this, "PAGE_LIMIT", 1e3),
                (this.client = new c.GraphQLClient(`${t}/graphql`, {
                  headers: { Authorization: `Bearer ${this.token}` },
                })),
                (this.pubsub = new (class {
                  constructor(e, t) {
                    const {
                      connectionCallback: n,
                      connectionParams: r = {},
                      minTimeout: i = p,
                      timeout: o = y,
                      reconnect: s = !1,
                      reconnectionAttempts: a = 1 / 0,
                      lazy: c = !1,
                      inactivityTimeout: u = 0,
                    } = t || {};
                    (this.wsImpl = WebSocket),
                      (this.connectionCallback = n),
                      (this.url = e),
                      (this.operations = {}),
                      (this.nextOperationId = 0),
                      (this.wsMinTimeout = i),
                      (this.wsTimeout = o),
                      (this.unsentMessagesQueue = []),
                      (this.reconnect = s),
                      (this.reconnecting = !1),
                      (this.reconnectionAttempts = a),
                      (this.lazy = !!c),
                      (this.inactivityTimeout = u),
                      (this.closedByUser = !1),
                      (this.backoff = new (l())({ jitter: 0.5 })),
                      (this.eventEmitter = new (d())()),
                      (this.client = null),
                      (this.maxConnectTimeGenerator =
                        this.createMaxConnectTimeGenerator()),
                      (this.connectionParams = this.getConnectionParams(r)),
                      this.lazy || this.connect();
                  }
                  get status() {
                    return null === this.client
                      ? this.wsImpl.CLOSED
                      : this.client.readyState;
                  }
                  close(e = !0, t = !0) {
                    this.clearInactivityTimeout(),
                      null !== this.client &&
                        ((this.closedByUser = t),
                        e &&
                          (this.clearCheckConnectionInterval(),
                          this.clearMaxConnectTimeout(),
                          this.clearTryReconnectTimeout(),
                          this.unsubscribeAll(),
                          this.sendMessage(
                            void 0,
                            "connection_terminate",
                            null
                          )),
                        this.client.close(),
                        (this.client = null),
                        this.eventEmitter.emit("disconnected"),
                        e || this.tryReconnect());
                  }
                  request(e) {
                    const t = this.getObserver.bind(this),
                      n = this.executeOperation.bind(this),
                      r = this.unsubscribe.bind(this);
                    let i;
                    return (
                      this.clearInactivityTimeout(),
                      {
                        [h.Z]() {
                          return this;
                        },
                        subscribe(o, s, a) {
                          const c = t(o, s, a);
                          return (
                            (i = n(e, (e, t) => {
                              null === e && null === t
                                ? c.complete && c.complete()
                                : e
                                ? c.error && c.error(e[0])
                                : c.next && c.next(t);
                            })),
                            {
                              unsubscribe: () => {
                                i && (r(i), (i = null));
                              },
                            }
                          );
                        },
                      }
                    );
                  }
                  on(e, t, n) {
                    const r = this.eventEmitter.on(e, t, n);
                    return () => {
                      r.off(e, t, n);
                    };
                  }
                  onConnected(e, t) {
                    return this.on("connected", e, t);
                  }
                  onConnecting(e, t) {
                    return this.on("connecting", e, t);
                  }
                  onDisconnected(e, t) {
                    return this.on("disconnected", e, t);
                  }
                  onReconnected(e, t) {
                    return this.on("reconnected", e, t);
                  }
                  onReconnecting(e, t) {
                    return this.on("reconnecting", e, t);
                  }
                  onError(e, t) {
                    return this.on("error", e, t);
                  }
                  unsubscribeAll() {
                    Object.keys(this.operations).forEach((e) => {
                      this.unsubscribe(e);
                    });
                  }
                  getConnectionParams(e) {
                    return () =>
                      new Promise((t, n) => {
                        if ("function" == typeof e)
                          try {
                            return t(e());
                          } catch (e) {
                            return n(e);
                          }
                        t(e);
                      });
                  }
                  executeOperation(e, t) {
                    null === this.client && this.connect();
                    const n = this.generateOperationId();
                    this.operations[n] = { options: e, handler: t };
                    try {
                      this.checkOperationOptions(e, t),
                        this.operations[n] &&
                          ((this.operations[n] = { options: e, handler: t }),
                          this.sendMessage(n, "start", e));
                    } catch (e) {
                      this.unsubscribe(n), t(this.formatErrors(e));
                    }
                    return n;
                  }
                  getObserver(e, t, n) {
                    return "function" == typeof e
                      ? {
                          next: (t) => e(t),
                          error: (e) => t && t(e),
                          complete: () => n && n(),
                        }
                      : e;
                  }
                  createMaxConnectTimeGenerator() {
                    const e = this.wsMinTimeout,
                      t = this.wsTimeout;
                    return new (l())({ min: e, max: t, factor: 1.2 });
                  }
                  clearCheckConnectionInterval() {
                    this.checkConnectionIntervalId &&
                      (clearInterval(this.checkConnectionIntervalId),
                      (this.checkConnectionIntervalId = null));
                  }
                  clearMaxConnectTimeout() {
                    this.maxConnectTimeoutId &&
                      (clearTimeout(this.maxConnectTimeoutId),
                      (this.maxConnectTimeoutId = null));
                  }
                  clearTryReconnectTimeout() {
                    this.tryReconnectTimeoutId &&
                      (clearTimeout(this.tryReconnectTimeoutId),
                      (this.tryReconnectTimeoutId = null));
                  }
                  clearInactivityTimeout() {
                    this.inactivityTimeoutId &&
                      (clearTimeout(this.inactivityTimeoutId),
                      (this.inactivityTimeoutId = null));
                  }
                  setInactivityTimeout() {
                    this.inactivityTimeout > 0 &&
                      0 === Object.keys(this.operations).length &&
                      (this.inactivityTimeoutId = setTimeout(() => {
                        0 === Object.keys(this.operations).length &&
                          this.close();
                      }, this.inactivityTimeout));
                  }
                  checkOperationOptions(e, t) {
                    const { query: n, variables: r, operationName: i } = e;
                    if (!n) throw new Error("Must provide a query.");
                    if (!t) throw new Error("Must provide an handler.");
                    if (
                      !v(n) ||
                      (i && !v(i)) ||
                      (r && (null === (o = r) || "object" != typeof o))
                    )
                      throw new Error(
                        "Incorrect option types. query must be a string,`operationName` must be a string, and `variables` must be an object."
                      );
                    var o;
                  }
                  buildMessage(e, t, n) {
                    return {
                      id: e,
                      type: t,
                      payload:
                        n && n.query
                          ? Object.assign({}, n, { query: n.query })
                          : n,
                    };
                  }
                  formatErrors(e) {
                    return Array.isArray(e)
                      ? e
                      : e && e.errors
                      ? this.formatErrors(e.errors)
                      : e && e.message
                      ? [e]
                      : [
                          {
                            name: "FormatedError",
                            message: "Unknown error",
                            originalError: e,
                          },
                        ];
                  }
                  sendMessage(e, t, n) {
                    this.sendMessageRaw(this.buildMessage(e, t, n));
                  }
                  sendMessageRaw(e) {
                    switch (this.status) {
                      case this.wsImpl.OPEN:
                        const t = JSON.stringify(e);
                        try {
                          JSON.parse(t);
                        } catch (t) {
                          this.eventEmitter.emit(
                            "error",
                            new Error(
                              `Message must be JSON-serializable. Got: ${e}`
                            )
                          );
                        }
                        this.client.send(t);
                        break;
                      case this.wsImpl.CONNECTING:
                        this.unsentMessagesQueue.push(e);
                        break;
                      default:
                        this.reconnecting ||
                          this.eventEmitter.emit(
                            "error",
                            new Error(
                              "A message was not sent because socket is not connected, is closing or is already closed. Message was: " +
                                JSON.stringify(e)
                            )
                          );
                    }
                  }
                  generateOperationId() {
                    return String(++this.nextOperationId);
                  }
                  tryReconnect() {
                    if (
                      !this.reconnect ||
                      this.backoff.attempts >= this.reconnectionAttempts
                    )
                      return;
                    this.reconnecting ||
                      (Object.keys(this.operations).forEach((e) => {
                        this.unsentMessagesQueue.push(
                          this.buildMessage(
                            e,
                            "start",
                            this.operations[e].options
                          )
                        );
                      }),
                      (this.reconnecting = !0)),
                      this.clearTryReconnectTimeout();
                    const e = this.backoff.duration();
                    this.tryReconnectTimeoutId = setTimeout(() => {
                      this.connect();
                    }, e);
                  }
                  flushUnsentMessagesQueue() {
                    this.unsentMessagesQueue.forEach((e) => {
                      this.sendMessageRaw(e);
                    }),
                      (this.unsentMessagesQueue = []);
                  }
                  checkConnection() {
                    this.wasKeepAliveReceived
                      ? (this.wasKeepAliveReceived = !1)
                      : this.reconnecting || this.close(!1, !0);
                  }
                  checkMaxConnectTimeout() {
                    this.clearMaxConnectTimeout(),
                      (this.maxConnectTimeoutId = setTimeout(() => {
                        this.status !== this.wsImpl.OPEN &&
                          ((this.reconnecting = !0), this.close(!1, !0));
                      }, this.maxConnectTimeGenerator.duration()));
                  }
                  connect() {
                    (this.client = new WebSocket(this.url, "graphql-ws")),
                      this.checkMaxConnectTimeout(),
                      this.client.addEventListener("open", async () => {
                        if (this.status === this.wsImpl.OPEN) {
                          this.clearMaxConnectTimeout(),
                            (this.closedByUser = !1),
                            this.eventEmitter.emit(
                              this.reconnecting ? "reconnecting" : "connecting"
                            );
                          try {
                            const e = await this.connectionParams();
                            this.sendMessage(void 0, "connection_init", e),
                              this.flushUnsentMessagesQueue();
                          } catch (e) {
                            this.sendMessage(void 0, "connection_error", e),
                              this.flushUnsentMessagesQueue();
                          }
                        }
                      }),
                      (this.client.onclose = () => {
                        this.closedByUser || this.close(!1, !1);
                      }),
                      this.client.addEventListener("error", (e) => {
                        this.eventEmitter.emit("error", e);
                      }),
                      this.client.addEventListener("message", ({ data: e }) => {
                        let t;
                        try {
                          t = JSON.parse(e);
                        } catch (t) {
                          throw new Error(
                            `Message must be JSON-parseable. Got: ${e}`
                          );
                        }
                        if (Array.isArray(t))
                          for (const e of t) this.processReceivedMessage(e);
                        else this.processReceivedMessage(t);
                      });
                  }
                  processReceivedMessage(e) {
                    const t = e.id;
                    if (
                      !["data", "complete", "error"].includes(e.type) ||
                      this.operations[t]
                    )
                      switch (e.type) {
                        case "connection_error":
                          this.connectionCallback &&
                            this.connectionCallback(e.payload);
                          break;
                        case "connection_ack":
                          this.eventEmitter.emit(
                            this.reconnecting ? "reconnected" : "connected"
                          ),
                            (this.reconnecting = !1),
                            this.backoff.reset(),
                            this.maxConnectTimeGenerator.reset(),
                            this.connectionCallback &&
                              this.connectionCallback();
                          break;
                        case "complete":
                          this.operations[t].handler(null, null),
                            delete this.operations[t];
                          break;
                        case "error":
                          this.operations[t].handler(
                            this.formatErrors(e.payload),
                            null
                          ),
                            delete this.operations[t];
                          break;
                        case "data":
                          const n = e.payload.errors
                            ? {
                                ...e.payload,
                                errors: this.formatErrors(e.payload.errors),
                              }
                            : e.payload;
                          this.operations[t].handler(null, n);
                          break;
                        case "ka":
                          const r = void 0 === this.wasKeepAliveReceived;
                          (this.wasKeepAliveReceived = !0),
                            r && this.checkConnection(),
                            this.checkConnectionIntervalId &&
                              (clearInterval(this.checkConnectionIntervalId),
                              this.checkConnection()),
                            (this.checkConnectionIntervalId = setInterval(
                              this.checkConnection.bind(this),
                              this.wsTimeout
                            ));
                          break;
                        default:
                          throw new Error("Invalid message type!");
                      }
                    else this.unsubscribe(t);
                  }
                  unsubscribe(e) {
                    this.operations[e] &&
                      (delete this.operations[e],
                      this.setInactivityTimeout(),
                      this.sendMessage(e, "stop", void 0));
                  }
                })(`${t.replace(/^http/, "ws")}/graphql`, {
                  reconnect: !0,
                  lazy: !0,
                  connectionParams: {
                    isWebSocket: !0,
                    headers: { authorization: `Bearer ${this.token}` },
                  },
                }));
            }
            handleError(e, t) {
              throw (
                (null != e &&
                  e.length &&
                  e.forEach((e) => {
                    if ("Unauthorized" === e.message)
                      throw new Error(
                        "[Flatfile SDK] Embed ID or Private Key is invalid. Please make sure your JWT contains valid credentials."
                      );
                    throw new Error(
                      `[Flatfile SDK]: Internal Server Error: "${e.message}"`
                    );
                  }),
                new Error(`[Flatfile SDK]: ${t || "Something went wrong"}`))
              );
            }
            async init() {
              return this.client
                .request(m, { importedFromUrl: location.href })
                .then(({ initializeEmptyBatch: e }) => (_("init", e), e))
                .catch((e) => this.handleError(e.response.errors, e.message));
            }
            async getFinalDatabaseView(e, t = 0, n = !1) {
              return this.client
                .request(b, { batchId: e, skip: t, limit: this.PAGE_LIMIT })
                .then(({ getFinalDatabaseView: e }) => e)
                .then(async ({ rows: r, totalRows: i }) => {
                  if (!n && t + this.PAGE_LIMIT < i) {
                    const { rows: n } = await this.getFinalDatabaseView(
                      e,
                      t + this.PAGE_LIMIT
                    );
                    return { rows: r.concat(n), totalRows: i };
                  }
                  return { rows: r, totalRows: i };
                })
                .catch((e) => this.handleError(e.response.errors, e.message));
            }
            subscribeBatchStatusUpdated(e, t) {
              this.pubsub
                .request({ query: g, variables: { batchId: e } })
                .subscribe({
                  next: ({ data: e, errors: n }) => {
                    if (n) return this.handleError(n);
                    t(e);
                  },
                });
            }
          }
          function O(e, t = {}) {
            let n,
              a = new x(e, t.apiUrl || "https://api.us.flatfile.io");
            const c = () => {
                _("close"), E();
              },
              u = (e) => {
                a.subscribeBatchStatusUpdated(e, async (t) => {
                  var r;
                  if (
                    null != t &&
                    null !== (r = t.batchStatusUpdated) &&
                    void 0 !== r &&
                    r.id
                  )
                    switch (t.batchStatusUpdated.status) {
                      case "submitted":
                        var i;
                        _("complete", {
                          batchId: e,
                          data: (t = !1) => a.getFinalDatabaseView(e, 0, t),
                        }),
                          null === (i = n) || void 0 === i || i();
                        break;
                      case "cancelled": {
                        const { batchId: e } = await a.init();
                        u(e);
                        break;
                      }
                    }
                });
              };
            return {
              async __unsafeGenerateToken({
                embedId: e,
                endUserEmail: n,
                privateKey: r,
              }) {
                console.error(
                  "[Flatfile SDK]: Using `.__unsafeGenerateToken()` is unsafe and would expose your private key."
                ),
                  (a = new x(
                    await (function (e, t) {
                      if (!t) throw new Error("Key is required.");
                      const n =
                        (window.crypto && crypto.subtle) ||
                        (window.crypto && crypto.webkitSubtle) ||
                        (window.msCrypto && window.msCrypto.Subtle);
                      if (!n)
                        throw new Error(
                          "Could not generate JWT (crypto.subtle is not found)."
                        );
                      const r = { name: "HMAC", hash: { name: "SHA-256" } };
                      let i;
                      try {
                        i = JSON.stringify(e);
                      } catch (e) {
                        throw e;
                      }
                      const a =
                          o(s(JSON.stringify({ alg: "HS256", typ: "JWT" }))) +
                          "." +
                          o(s(i)),
                        c = s(t);
                      return n
                        .importKey("raw", c, r, !1, ["sign"])
                        .then((e) => {
                          const t = i.split(""),
                            c = s(i).entries();
                          let u = 0;
                          const l = [];
                          let f;
                          for (; !(f = c.next()).done; )
                            l.push([f.value[1], t[u]]), u++;
                          const d = s(a);
                          return n.sign(r.name, e, d).then((e) => {
                            const t = o(new Uint8Array(e));
                            return a + "." + t;
                          });
                        });
                    })({ embed: e, sub: n }, r),
                    t.apiUrl || "https://api.us.flatfile.io"
                  ));
              },
              async launch() {
                try {
                  const { batchId: e } = await a.init();
                  return (
                    u(e),
                    _("launch", { batchId: e }),
                    (n = ((e) => {
                      var n;
                      document.querySelector(".flatfile-sdk") ||
                        (i ||
                          ((i = document.createElement("style")),
                          i.setAttribute("type", "text/css"),
                          null === (n = document.querySelector("head")) ||
                            void 0 === n ||
                            n.appendChild(i),
                          (i.textContent =
                            "\n  .flatfile-sdk {\n    position: fixed;\n    top: 0;\n    bottom: 0;\n    right: 0;\n    left: 0;\n    display: none;\n    z-index: 100000;\n    padding: 40px;\n    background-color: rgba(0,0,0,0.15);\n  }\n  .flatfile-sdk .flatfile-close{\n    position: absolute;\n    right: 20px;\n    top: 15px;\n    width: 20px;\n    height: 20px;\n    background-color: transparent;\n    border: none;\n    box-shadow: none;\n    cursor: pointer;\n  }\n  .flatfile-sdk .flatfile-close:after{\n    display: inline-block;\n    content: '✕';\n    color: white;\n    font-size: 20px;\n  }\n  .flatfile-sdk iframe {\n    width: calc(100% - 80px);\n    height: calc(100% - 80px);\n    position: absolute;\n    border-width: 0;\n    border-radius: 20px;\n  }\n  body.flatfile-active {\n    overflow: hidden;\n    overscroll-behavior-x: none;\n  }\n")),
                        document.body.insertAdjacentHTML(
                          "beforeend",
                          '<div class="flatfile-sdk"><button class="flatfile-close"></button></div>'
                        ));
                      const o = document.createElement("iframe");
                      o.src = `${
                        t.mountUrl || "https://app.flatfile.io"
                      }/e?jwt=${encodeURI(a.token)}${e ? `&batchId=${e}` : ""}`;
                      const s = document.querySelector(".flatfile-close"),
                        u = document.querySelector(".flatfile-sdk");
                      u.append(o),
                        (u.style.display = "block"),
                        ((e, t) => {
                          if ("" === e.className) return (e.className = t);
                          const n = e.className.split(" ");
                          n.indexOf(t) > -1 ||
                            (n.push(t), (e.className = n.join(" ")));
                        })(document.body, "flatfile-active");
                      const l = () => {
                        (u.style.display = "none"),
                          r(document.body, "flatfile-active"),
                          o.remove(),
                          c(),
                          s.removeEventListener("click", l);
                      };
                      return (
                        s.addEventListener("click", l),
                        () => {
                          (u.style.display = "none"),
                            r(document.body, "flatfile-active"),
                            o.remove(),
                            c();
                        }
                      );
                    })(e)),
                    { batchId: e }
                  );
                } catch (e) {
                  throw (E(), e);
                }
              },
              on(e, t) {
                !(function (e, t) {
                  w.on(e, t);
                })(e, t);
              },
              close() {
                if (!n)
                  throw new Error(
                    "[Flatfile SDK] Could not close the importer because it has not been launched."
                  );
                n();
              },
            };
          }
        },
        10: (e) => {
          function t(e) {
            (e = e || {}),
              (this.ms = e.min || 100),
              (this.max = e.max || 1e4),
              (this.factor = e.factor || 2),
              (this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0),
              (this.attempts = 0);
          }
          (e.exports = t),
            (t.prototype.duration = function () {
              var e = this.ms * Math.pow(this.factor, this.attempts++);
              if (this.jitter) {
                var t = Math.random(),
                  n = Math.floor(t * this.jitter * e);
                e = 0 == (1 & Math.floor(10 * t)) ? e - n : e + n;
              }
              return 0 | Math.min(e, this.max);
            }),
            (t.prototype.reset = function () {
              this.attempts = 0;
            }),
            (t.prototype.setMin = function (e) {
              this.ms = e;
            }),
            (t.prototype.setMax = function (e) {
              this.max = e;
            }),
            (t.prototype.setJitter = function (e) {
              this.jitter = e;
            });
        },
        98: function (e, t) {
          var n = "undefined" != typeof self ? self : this,
            r = (function () {
              function e() {
                (this.fetch = !1), (this.DOMException = n.DOMException);
              }
              return (e.prototype = n), new e();
            })();
          !(function (e) {
            !(function (t) {
              var n = "URLSearchParams" in e,
                r = "Symbol" in e && "iterator" in Symbol,
                i =
                  "FileReader" in e &&
                  "Blob" in e &&
                  (function () {
                    try {
                      return new Blob(), !0;
                    } catch (e) {
                      return !1;
                    }
                  })(),
                o = "FormData" in e,
                s = "ArrayBuffer" in e;
              if (s)
                var a = [
                    "[object Int8Array]",
                    "[object Uint8Array]",
                    "[object Uint8ClampedArray]",
                    "[object Int16Array]",
                    "[object Uint16Array]",
                    "[object Int32Array]",
                    "[object Uint32Array]",
                    "[object Float32Array]",
                    "[object Float64Array]",
                  ],
                  c =
                    ArrayBuffer.isView ||
                    function (e) {
                      return (
                        e && a.indexOf(Object.prototype.toString.call(e)) > -1
                      );
                    };
              function u(e) {
                if (
                  ("string" != typeof e && (e = String(e)),
                  /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(e))
                )
                  throw new TypeError("Invalid character in header field name");
                return e.toLowerCase();
              }
              function l(e) {
                return "string" != typeof e && (e = String(e)), e;
              }
              function f(e) {
                var t = {
                  next: function () {
                    var t = e.shift();
                    return { done: void 0 === t, value: t };
                  },
                };
                return (
                  r &&
                    (t[Symbol.iterator] = function () {
                      return t;
                    }),
                  t
                );
              }
              function d(e) {
                (this.map = {}),
                  e instanceof d
                    ? e.forEach(function (e, t) {
                        this.append(t, e);
                      }, this)
                    : Array.isArray(e)
                    ? e.forEach(function (e) {
                        this.append(e[0], e[1]);
                      }, this)
                    : e &&
                      Object.getOwnPropertyNames(e).forEach(function (t) {
                        this.append(t, e[t]);
                      }, this);
              }
              function h(e) {
                if (e.bodyUsed)
                  return Promise.reject(new TypeError("Already read"));
                e.bodyUsed = !0;
              }
              function p(e) {
                return new Promise(function (t, n) {
                  (e.onload = function () {
                    t(e.result);
                  }),
                    (e.onerror = function () {
                      n(e.error);
                    });
                });
              }
              function y(e) {
                var t = new FileReader(),
                  n = p(t);
                return t.readAsArrayBuffer(e), n;
              }
              function v(e) {
                if (e.slice) return e.slice(0);
                var t = new Uint8Array(e.byteLength);
                return t.set(new Uint8Array(e)), t.buffer;
              }
              function m() {
                return (
                  (this.bodyUsed = !1),
                  (this._initBody = function (e) {
                    var t;
                    (this._bodyInit = e),
                      e
                        ? "string" == typeof e
                          ? (this._bodyText = e)
                          : i && Blob.prototype.isPrototypeOf(e)
                          ? (this._bodyBlob = e)
                          : o && FormData.prototype.isPrototypeOf(e)
                          ? (this._bodyFormData = e)
                          : n && URLSearchParams.prototype.isPrototypeOf(e)
                          ? (this._bodyText = e.toString())
                          : s &&
                            i &&
                            (t = e) &&
                            DataView.prototype.isPrototypeOf(t)
                          ? ((this._bodyArrayBuffer = v(e.buffer)),
                            (this._bodyInit = new Blob([
                              this._bodyArrayBuffer,
                            ])))
                          : s &&
                            (ArrayBuffer.prototype.isPrototypeOf(e) || c(e))
                          ? (this._bodyArrayBuffer = v(e))
                          : (this._bodyText = e =
                              Object.prototype.toString.call(e))
                        : (this._bodyText = ""),
                      this.headers.get("content-type") ||
                        ("string" == typeof e
                          ? this.headers.set(
                              "content-type",
                              "text/plain;charset=UTF-8"
                            )
                          : this._bodyBlob && this._bodyBlob.type
                          ? this.headers.set(
                              "content-type",
                              this._bodyBlob.type
                            )
                          : n &&
                            URLSearchParams.prototype.isPrototypeOf(e) &&
                            this.headers.set(
                              "content-type",
                              "application/x-www-form-urlencoded;charset=UTF-8"
                            ));
                  }),
                  i &&
                    ((this.blob = function () {
                      var e = h(this);
                      if (e) return e;
                      if (this._bodyBlob)
                        return Promise.resolve(this._bodyBlob);
                      if (this._bodyArrayBuffer)
                        return Promise.resolve(
                          new Blob([this._bodyArrayBuffer])
                        );
                      if (this._bodyFormData)
                        throw new Error("could not read FormData body as blob");
                      return Promise.resolve(new Blob([this._bodyText]));
                    }),
                    (this.arrayBuffer = function () {
                      return this._bodyArrayBuffer
                        ? h(this) || Promise.resolve(this._bodyArrayBuffer)
                        : this.blob().then(y);
                    })),
                  (this.text = function () {
                    var e,
                      t,
                      n,
                      r = h(this);
                    if (r) return r;
                    if (this._bodyBlob)
                      return (
                        (e = this._bodyBlob),
                        (n = p((t = new FileReader()))),
                        t.readAsText(e),
                        n
                      );
                    if (this._bodyArrayBuffer)
                      return Promise.resolve(
                        (function (e) {
                          for (
                            var t = new Uint8Array(e),
                              n = new Array(t.length),
                              r = 0;
                            r < t.length;
                            r++
                          )
                            n[r] = String.fromCharCode(t[r]);
                          return n.join("");
                        })(this._bodyArrayBuffer)
                      );
                    if (this._bodyFormData)
                      throw new Error("could not read FormData body as text");
                    return Promise.resolve(this._bodyText);
                  }),
                  o &&
                    (this.formData = function () {
                      return this.text().then(w);
                    }),
                  (this.json = function () {
                    return this.text().then(JSON.parse);
                  }),
                  this
                );
              }
              (d.prototype.append = function (e, t) {
                (e = u(e)), (t = l(t));
                var n = this.map[e];
                this.map[e] = n ? n + ", " + t : t;
              }),
                (d.prototype.delete = function (e) {
                  delete this.map[u(e)];
                }),
                (d.prototype.get = function (e) {
                  return (e = u(e)), this.has(e) ? this.map[e] : null;
                }),
                (d.prototype.has = function (e) {
                  return this.map.hasOwnProperty(u(e));
                }),
                (d.prototype.set = function (e, t) {
                  this.map[u(e)] = l(t);
                }),
                (d.prototype.forEach = function (e, t) {
                  for (var n in this.map)
                    this.map.hasOwnProperty(n) &&
                      e.call(t, this.map[n], n, this);
                }),
                (d.prototype.keys = function () {
                  var e = [];
                  return (
                    this.forEach(function (t, n) {
                      e.push(n);
                    }),
                    f(e)
                  );
                }),
                (d.prototype.values = function () {
                  var e = [];
                  return (
                    this.forEach(function (t) {
                      e.push(t);
                    }),
                    f(e)
                  );
                }),
                (d.prototype.entries = function () {
                  var e = [];
                  return (
                    this.forEach(function (t, n) {
                      e.push([n, t]);
                    }),
                    f(e)
                  );
                }),
                r && (d.prototype[Symbol.iterator] = d.prototype.entries);
              var b = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
              function g(e, t) {
                var n,
                  r,
                  i = (t = t || {}).body;
                if (e instanceof g) {
                  if (e.bodyUsed) throw new TypeError("Already read");
                  (this.url = e.url),
                    (this.credentials = e.credentials),
                    t.headers || (this.headers = new d(e.headers)),
                    (this.method = e.method),
                    (this.mode = e.mode),
                    (this.signal = e.signal),
                    i ||
                      null == e._bodyInit ||
                      ((i = e._bodyInit), (e.bodyUsed = !0));
                } else this.url = String(e);
                if (
                  ((this.credentials =
                    t.credentials || this.credentials || "same-origin"),
                  (!t.headers && this.headers) ||
                    (this.headers = new d(t.headers)),
                  (this.method =
                    ((r = (n = t.method || this.method || "GET").toUpperCase()),
                    b.indexOf(r) > -1 ? r : n)),
                  (this.mode = t.mode || this.mode || null),
                  (this.signal = t.signal || this.signal),
                  (this.referrer = null),
                  ("GET" === this.method || "HEAD" === this.method) && i)
                )
                  throw new TypeError(
                    "Body not allowed for GET or HEAD requests"
                  );
                this._initBody(i);
              }
              function w(e) {
                var t = new FormData();
                return (
                  e
                    .trim()
                    .split("&")
                    .forEach(function (e) {
                      if (e) {
                        var n = e.split("="),
                          r = n.shift().replace(/\+/g, " "),
                          i = n.join("=").replace(/\+/g, " ");
                        t.append(decodeURIComponent(r), decodeURIComponent(i));
                      }
                    }),
                  t
                );
              }
              function _(e, t) {
                t || (t = {}),
                  (this.type = "default"),
                  (this.status = void 0 === t.status ? 200 : t.status),
                  (this.ok = this.status >= 200 && this.status < 300),
                  (this.statusText = "statusText" in t ? t.statusText : "OK"),
                  (this.headers = new d(t.headers)),
                  (this.url = t.url || ""),
                  this._initBody(e);
              }
              (g.prototype.clone = function () {
                return new g(this, { body: this._bodyInit });
              }),
                m.call(g.prototype),
                m.call(_.prototype),
                (_.prototype.clone = function () {
                  return new _(this._bodyInit, {
                    status: this.status,
                    statusText: this.statusText,
                    headers: new d(this.headers),
                    url: this.url,
                  });
                }),
                (_.error = function () {
                  var e = new _(null, { status: 0, statusText: "" });
                  return (e.type = "error"), e;
                });
              var E = [301, 302, 303, 307, 308];
              (_.redirect = function (e, t) {
                if (-1 === E.indexOf(t))
                  throw new RangeError("Invalid status code");
                return new _(null, { status: t, headers: { location: e } });
              }),
                (t.DOMException = e.DOMException);
              try {
                new t.DOMException();
              } catch (e) {
                (t.DOMException = function (e, t) {
                  (this.message = e), (this.name = t);
                  var n = Error(e);
                  this.stack = n.stack;
                }),
                  (t.DOMException.prototype = Object.create(Error.prototype)),
                  (t.DOMException.prototype.constructor = t.DOMException);
              }
              function x(e, n) {
                return new Promise(function (r, o) {
                  var s = new g(e, n);
                  if (s.signal && s.signal.aborted)
                    return o(new t.DOMException("Aborted", "AbortError"));
                  var a = new XMLHttpRequest();
                  function c() {
                    a.abort();
                  }
                  (a.onload = function () {
                    var e,
                      t,
                      n = {
                        status: a.status,
                        statusText: a.statusText,
                        headers:
                          ((e = a.getAllResponseHeaders() || ""),
                          (t = new d()),
                          e
                            .replace(/\r?\n[\t ]+/g, " ")
                            .split(/\r?\n/)
                            .forEach(function (e) {
                              var n = e.split(":"),
                                r = n.shift().trim();
                              if (r) {
                                var i = n.join(":").trim();
                                t.append(r, i);
                              }
                            }),
                          t),
                      };
                    n.url =
                      "responseURL" in a
                        ? a.responseURL
                        : n.headers.get("X-Request-URL");
                    var i = "response" in a ? a.response : a.responseText;
                    r(new _(i, n));
                  }),
                    (a.onerror = function () {
                      o(new TypeError("Network request failed"));
                    }),
                    (a.ontimeout = function () {
                      o(new TypeError("Network request failed"));
                    }),
                    (a.onabort = function () {
                      o(new t.DOMException("Aborted", "AbortError"));
                    }),
                    a.open(s.method, s.url, !0),
                    "include" === s.credentials
                      ? (a.withCredentials = !0)
                      : "omit" === s.credentials && (a.withCredentials = !1),
                    "responseType" in a && i && (a.responseType = "blob"),
                    s.headers.forEach(function (e, t) {
                      a.setRequestHeader(t, e);
                    }),
                    s.signal &&
                      (s.signal.addEventListener("abort", c),
                      (a.onreadystatechange = function () {
                        4 === a.readyState &&
                          s.signal.removeEventListener("abort", c);
                      })),
                    a.send(void 0 === s._bodyInit ? null : s._bodyInit);
                });
              }
              (x.polyfill = !0),
                e.fetch ||
                  ((e.fetch = x),
                  (e.Headers = d),
                  (e.Request = g),
                  (e.Response = _)),
                (t.Headers = d),
                (t.Request = g),
                (t.Response = _),
                (t.fetch = x),
                Object.defineProperty(t, "__esModule", { value: !0 });
            })({});
          })(r),
            (r.fetch.ponyfill = !0),
            delete r.fetch.polyfill;
          var i = r;
          ((t = i.fetch).default = i.fetch),
            (t.fetch = i.fetch),
            (t.Headers = i.Headers),
            (t.Request = i.Request),
            (t.Response = i.Response),
            (e.exports = t);
        },
        729: (e) => {
          "use strict";
          var t = Object.prototype.hasOwnProperty,
            n = "~";
          function r() {}
          function i(e, t, n) {
            (this.fn = e), (this.context = t), (this.once = n || !1);
          }
          function o(e, t, r, o, s) {
            if ("function" != typeof r)
              throw new TypeError("The listener must be a function");
            var a = new i(r, o || e, s),
              c = n ? n + t : t;
            return (
              e._events[c]
                ? e._events[c].fn
                  ? (e._events[c] = [e._events[c], a])
                  : e._events[c].push(a)
                : ((e._events[c] = a), e._eventsCount++),
              e
            );
          }
          function s(e, t) {
            0 == --e._eventsCount ? (e._events = new r()) : delete e._events[t];
          }
          function a() {
            (this._events = new r()), (this._eventsCount = 0);
          }
          Object.create &&
            ((r.prototype = Object.create(null)),
            new r().__proto__ || (n = !1)),
            (a.prototype.eventNames = function () {
              var e,
                r,
                i = [];
              if (0 === this._eventsCount) return i;
              for (r in (e = this._events))
                t.call(e, r) && i.push(n ? r.slice(1) : r);
              return Object.getOwnPropertySymbols
                ? i.concat(Object.getOwnPropertySymbols(e))
                : i;
            }),
            (a.prototype.listeners = function (e) {
              var t = n ? n + e : e,
                r = this._events[t];
              if (!r) return [];
              if (r.fn) return [r.fn];
              for (var i = 0, o = r.length, s = new Array(o); i < o; i++)
                s[i] = r[i].fn;
              return s;
            }),
            (a.prototype.listenerCount = function (e) {
              var t = n ? n + e : e,
                r = this._events[t];
              return r ? (r.fn ? 1 : r.length) : 0;
            }),
            (a.prototype.emit = function (e, t, r, i, o, s) {
              var a = n ? n + e : e;
              if (!this._events[a]) return !1;
              var c,
                u,
                l = this._events[a],
                f = arguments.length;
              if (l.fn) {
                switch (
                  (l.once && this.removeListener(e, l.fn, void 0, !0), f)
                ) {
                  case 1:
                    return l.fn.call(l.context), !0;
                  case 2:
                    return l.fn.call(l.context, t), !0;
                  case 3:
                    return l.fn.call(l.context, t, r), !0;
                  case 4:
                    return l.fn.call(l.context, t, r, i), !0;
                  case 5:
                    return l.fn.call(l.context, t, r, i, o), !0;
                  case 6:
                    return l.fn.call(l.context, t, r, i, o, s), !0;
                }
                for (u = 1, c = new Array(f - 1); u < f; u++)
                  c[u - 1] = arguments[u];
                l.fn.apply(l.context, c);
              } else {
                var d,
                  h = l.length;
                for (u = 0; u < h; u++)
                  switch (
                    (l[u].once && this.removeListener(e, l[u].fn, void 0, !0),
                    f)
                  ) {
                    case 1:
                      l[u].fn.call(l[u].context);
                      break;
                    case 2:
                      l[u].fn.call(l[u].context, t);
                      break;
                    case 3:
                      l[u].fn.call(l[u].context, t, r);
                      break;
                    case 4:
                      l[u].fn.call(l[u].context, t, r, i);
                      break;
                    default:
                      if (!c)
                        for (d = 1, c = new Array(f - 1); d < f; d++)
                          c[d - 1] = arguments[d];
                      l[u].fn.apply(l[u].context, c);
                  }
              }
              return !0;
            }),
            (a.prototype.on = function (e, t, n) {
              return o(this, e, t, n, !1);
            }),
            (a.prototype.once = function (e, t, n) {
              return o(this, e, t, n, !0);
            }),
            (a.prototype.removeListener = function (e, t, r, i) {
              var o = n ? n + e : e;
              if (!this._events[o]) return this;
              if (!t) return s(this, o), this;
              var a = this._events[o];
              if (a.fn)
                a.fn !== t ||
                  (i && !a.once) ||
                  (r && a.context !== r) ||
                  s(this, o);
              else {
                for (var c = 0, u = [], l = a.length; c < l; c++)
                  (a[c].fn !== t ||
                    (i && !a[c].once) ||
                    (r && a[c].context !== r)) &&
                    u.push(a[c]);
                u.length
                  ? (this._events[o] = 1 === u.length ? u[0] : u)
                  : s(this, o);
              }
              return this;
            }),
            (a.prototype.removeAllListeners = function (e) {
              var t;
              return (
                e
                  ? ((t = n ? n + e : e), this._events[t] && s(this, t))
                  : ((this._events = new r()), (this._eventsCount = 0)),
                this
              );
            }),
            (a.prototype.off = a.prototype.removeListener),
            (a.prototype.addListener = a.prototype.on),
            (a.prefixed = n),
            (a.EventEmitter = a),
            (e.exports = a);
        },
        445: (e) => {
          "use strict";
          e.exports = function (e) {
            var t = e.uri,
              n = e.name,
              r = e.type;
            (this.uri = t), (this.name = n), (this.type = r);
          };
        },
        804: (e, t, n) => {
          "use strict";
          var r = n(268);
          e.exports = function e(t, n, i) {
            var o;
            void 0 === n && (n = ""), void 0 === i && (i = r);
            var s = new Map();
            function a(e, t) {
              var n = s.get(t);
              n ? n.push.apply(n, e) : s.set(t, e);
            }
            if (i(t)) (o = null), a([n], t);
            else {
              var c = n ? n + "." : "";
              if ("undefined" != typeof FileList && t instanceof FileList)
                o = Array.prototype.map.call(t, function (e, t) {
                  return a(["" + c + t], e), null;
                });
              else if (Array.isArray(t))
                o = t.map(function (t, n) {
                  var r = e(t, "" + c + n, i);
                  return r.files.forEach(a), r.clone;
                });
              else if (t && t.constructor === Object)
                for (var u in ((o = {}), t)) {
                  var l = e(t[u], "" + c + u, i);
                  l.files.forEach(a), (o[u] = l.clone);
                }
              else o = t;
            }
            return { clone: o, files: s };
          };
        },
        823: (e, t, n) => {
          "use strict";
          (t.ReactNativeFile = n(445)),
            (t.extractFiles = n(804)),
            (t.isExtractableFile = n(268));
        },
        268: (e, t, n) => {
          "use strict";
          var r = n(445);
          e.exports = function (e) {
            return (
              ("undefined" != typeof File && e instanceof File) ||
              ("undefined" != typeof Blob && e instanceof Blob) ||
              e instanceof r
            );
          };
        },
        230: (e) => {
          e.exports = "object" == typeof self ? self.FormData : window.FormData;
        },
        458: function (e, t, n) {
          "use strict";
          var r =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e };
            };
          Object.defineProperty(t, "__esModule", { value: !0 });
          var i = n(823),
            o = r(n(230)),
            s = function (e) {
              return (
                i.isExtractableFile(e) ||
                (null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.pipe)
              );
            };
          t.default = function (e, t) {
            var n = i.extractFiles({ query: e, variables: t }, "", s),
              r = n.clone,
              a = n.files;
            if (0 === a.size) return JSON.stringify(r);
            var c = new (
              "undefined" == typeof FormData ? o.default : FormData
            )();
            c.append("operations", JSON.stringify(r));
            var u = {},
              l = 0;
            return (
              a.forEach(function (e) {
                u[++l] = e;
              }),
              c.append("map", JSON.stringify(u)),
              (l = 0),
              a.forEach(function (e, t) {
                c.append("" + ++l, t);
              }),
              c
            );
          };
        },
        687: function (e, t, n) {
          "use strict";
          var r =
              (this && this.__assign) ||
              function () {
                return (r =
                  Object.assign ||
                  function (e) {
                    for (var t, n = 1, r = arguments.length; n < r; n++)
                      for (var i in (t = arguments[n]))
                        Object.prototype.hasOwnProperty.call(t, i) &&
                          (e[i] = t[i]);
                    return e;
                  }).apply(this, arguments);
              },
            i =
              (this && this.__createBinding) ||
              (Object.create
                ? function (e, t, n, r) {
                    void 0 === r && (r = n),
                      Object.defineProperty(e, r, {
                        enumerable: !0,
                        get: function () {
                          return t[n];
                        },
                      });
                  }
                : function (e, t, n, r) {
                    void 0 === r && (r = n), (e[r] = t[n]);
                  }),
            o =
              (this && this.__setModuleDefault) ||
              (Object.create
                ? function (e, t) {
                    Object.defineProperty(e, "default", {
                      enumerable: !0,
                      value: t,
                    });
                  }
                : function (e, t) {
                    e.default = t;
                  }),
            s =
              (this && this.__importStar) ||
              function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                  for (var n in e)
                    "default" !== n &&
                      Object.prototype.hasOwnProperty.call(e, n) &&
                      i(t, e, n);
                return o(t, e), t;
              },
            a =
              (this && this.__awaiter) ||
              function (e, t, n, r) {
                return new (n || (n = Promise))(function (i, o) {
                  function s(e) {
                    try {
                      c(r.next(e));
                    } catch (e) {
                      o(e);
                    }
                  }
                  function a(e) {
                    try {
                      c(r.throw(e));
                    } catch (e) {
                      o(e);
                    }
                  }
                  function c(e) {
                    var t;
                    e.done
                      ? i(e.value)
                      : ((t = e.value),
                        t instanceof n
                          ? t
                          : new n(function (e) {
                              e(t);
                            })).then(s, a);
                  }
                  c((r = r.apply(e, t || [])).next());
                });
              },
            c =
              (this && this.__generator) ||
              function (e, t) {
                var n,
                  r,
                  i,
                  o,
                  s = {
                    label: 0,
                    sent: function () {
                      if (1 & i[0]) throw i[1];
                      return i[1];
                    },
                    trys: [],
                    ops: [],
                  };
                return (
                  (o = { next: a(0), throw: a(1), return: a(2) }),
                  "function" == typeof Symbol &&
                    (o[Symbol.iterator] = function () {
                      return this;
                    }),
                  o
                );
                function a(o) {
                  return function (a) {
                    return (function (o) {
                      if (n)
                        throw new TypeError("Generator is already executing.");
                      for (; s; )
                        try {
                          if (
                            ((n = 1),
                            r &&
                              (i =
                                2 & o[0]
                                  ? r.return
                                  : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                              !(i = i.call(r, o[1])).done)
                          )
                            return i;
                          switch (
                            ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                          ) {
                            case 0:
                            case 1:
                              i = o;
                              break;
                            case 4:
                              return s.label++, { value: o[1], done: !1 };
                            case 5:
                              s.label++, (r = o[1]), (o = [0]);
                              continue;
                            case 7:
                              (o = s.ops.pop()), s.trys.pop();
                              continue;
                            default:
                              if (
                                !(
                                  (i =
                                    (i = s.trys).length > 0 &&
                                    i[i.length - 1]) ||
                                  (6 !== o[0] && 2 !== o[0])
                                )
                              ) {
                                s = 0;
                                continue;
                              }
                              if (
                                3 === o[0] &&
                                (!i || (o[1] > i[0] && o[1] < i[3]))
                              ) {
                                s.label = o[1];
                                break;
                              }
                              if (6 === o[0] && s.label < i[1]) {
                                (s.label = i[1]), (i = o);
                                break;
                              }
                              if (i && s.label < i[2]) {
                                (s.label = i[2]), s.ops.push(o);
                                break;
                              }
                              i[2] && s.ops.pop(), s.trys.pop();
                              continue;
                          }
                          o = t.call(e, s);
                        } catch (e) {
                          (o = [6, e]), (r = 0);
                        } finally {
                          n = i = 0;
                        }
                      if (5 & o[0]) throw o[1];
                      return { value: o[0] ? o[1] : void 0, done: !0 };
                    })([o, a]);
                  };
                }
              },
            u =
              (this && this.__rest) ||
              function (e, t) {
                var n = {};
                for (var r in e)
                  Object.prototype.hasOwnProperty.call(e, r) &&
                    t.indexOf(r) < 0 &&
                    (n[r] = e[r]);
                if (
                  null != e &&
                  "function" == typeof Object.getOwnPropertySymbols
                ) {
                  var i = 0;
                  for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)
                    t.indexOf(r[i]) < 0 &&
                      Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
                      (n[r[i]] = e[r[i]]);
                }
                return n;
              },
            l =
              (this && this.__importDefault) ||
              function (e) {
                return e && e.__esModule ? e : { default: e };
              };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.gql =
              t.request =
              t.rawRequest =
              t.GraphQLClient =
              t.ClientError =
                void 0);
          var f = s(n(98)),
            d = f,
            h = n(33),
            p = l(n(458)),
            y = n(308),
            v = n(308);
          Object.defineProperty(t, "ClientError", {
            enumerable: !0,
            get: function () {
              return v.ClientError;
            },
          });
          var m = function (e) {
              var t = {};
              return (
                e &&
                  (("undefined" != typeof Headers && e instanceof Headers) ||
                  e instanceof d.Headers
                    ? (t = (function (e) {
                        var t = {};
                        return (
                          e.forEach(function (e, n) {
                            t[n] = e;
                          }),
                          t
                        );
                      })(e))
                    : Array.isArray(e)
                    ? e.forEach(function (e) {
                        var n = e[0],
                          r = e[1];
                        t[n] = r;
                      })
                    : (t = e)),
                t
              );
            },
            b = (function () {
              function e(e, t) {
                (this.url = e), (this.options = t || {});
              }
              return (
                (e.prototype.rawRequest = function (e, t, n) {
                  return a(this, void 0, void 0, function () {
                    var i, o, s, a, l, d, h, v, b, g, _;
                    return c(this, function (c) {
                      switch (c.label) {
                        case 0:
                          return (
                            (i = this.options),
                            (o = i.headers),
                            (s = i.fetch),
                            (a = void 0 === s ? f.default : s),
                            (l = u(i, ["headers", "fetch"])),
                            (d = p.default(e, t)),
                            [
                              4,
                              a(
                                this.url,
                                r(
                                  {
                                    method: "POST",
                                    headers: r(
                                      r(
                                        r(
                                          {},
                                          "string" == typeof d
                                            ? {
                                                "Content-Type":
                                                  "application/json",
                                              }
                                            : {}
                                        ),
                                        m(o)
                                      ),
                                      m(n)
                                    ),
                                    body: d,
                                  },
                                  l
                                )
                              ),
                            ]
                          );
                        case 1:
                          return [4, w((h = c.sent()))];
                        case 2:
                          if (((v = c.sent()), h.ok && !v.errors && v.data))
                            return (
                              (b = h.headers),
                              (g = h.status),
                              [2, r(r({}, v), { headers: b, status: g })]
                            );
                          throw (
                            ((_ = "string" == typeof v ? { error: v } : v),
                            new y.ClientError(
                              r(r({}, _), {
                                status: h.status,
                                headers: h.headers,
                              }),
                              { query: e, variables: t }
                            ))
                          );
                      }
                    });
                  });
                }),
                (e.prototype.request = function (e, t, n) {
                  return a(this, void 0, void 0, function () {
                    var i, o, s, a, l, d, v, b, g, _;
                    return c(this, function (c) {
                      switch (c.label) {
                        case 0:
                          return (
                            (i = this.options),
                            (o = i.headers),
                            (s = i.fetch),
                            (a = void 0 === s ? f.default : s),
                            (l = u(i, ["headers", "fetch"])),
                            (d = (function (e) {
                              return "string" == typeof e ? e : h.print(e);
                            })(e)),
                            (v = p.default(d, t)),
                            [
                              4,
                              a(
                                this.url,
                                r(
                                  {
                                    method: "POST",
                                    headers: r(
                                      r(
                                        r(
                                          {},
                                          "string" == typeof v
                                            ? {
                                                "Content-Type":
                                                  "application/json",
                                              }
                                            : {}
                                        ),
                                        m(o)
                                      ),
                                      m(n)
                                    ),
                                    body: v,
                                  },
                                  l
                                )
                              ),
                            ]
                          );
                        case 1:
                          return [4, w((b = c.sent()))];
                        case 2:
                          if (((g = c.sent()), b.ok && !g.errors && g.data))
                            return [2, g.data];
                          throw (
                            ((_ = "string" == typeof g ? { error: g } : g),
                            new y.ClientError(
                              r(r({}, _), { status: b.status }),
                              { query: d, variables: t }
                            ))
                          );
                      }
                    });
                  });
                }),
                (e.prototype.setHeaders = function (e) {
                  return (this.options.headers = e), this;
                }),
                (e.prototype.setHeader = function (e, t) {
                  var n,
                    r = this.options.headers;
                  return (
                    r
                      ? (r[e] = t)
                      : (this.options.headers = (((n = {})[e] = t), n)),
                    this
                  );
                }),
                e
              );
            })();
          function g(e, t, n) {
            return a(this, void 0, void 0, function () {
              return c(this, function (r) {
                return [2, new b(e).request(t, n)];
              });
            });
          }
          function w(e) {
            var t = e.headers.get("Content-Type");
            return t && t.startsWith("application/json") ? e.json() : e.text();
          }
          (t.GraphQLClient = b),
            (t.rawRequest = function (e, t, n) {
              return a(this, void 0, void 0, function () {
                return c(this, function (r) {
                  return [2, new b(e).rawRequest(t, n)];
                });
              });
            }),
            (t.request = g),
            (t.default = g),
            (t.gql = function (e) {
              for (var t = [], n = 1; n < arguments.length; n++)
                t[n - 1] = arguments[n];
              return e.reduce(function (e, n, r) {
                return "" + e + n + (r in t ? t[r] : "");
              }, "");
            });
        },
        308: function (e, t) {
          "use strict";
          var n,
            r =
              (this && this.__extends) ||
              ((n = function (e, t) {
                return (n =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (e, t) {
                      e.__proto__ = t;
                    }) ||
                  function (e, t) {
                    for (var n in t)
                      Object.prototype.hasOwnProperty.call(t, n) &&
                        (e[n] = t[n]);
                  })(e, t);
              }),
              function (e, t) {
                function r() {
                  this.constructor = e;
                }
                n(e, t),
                  (e.prototype =
                    null === t
                      ? Object.create(t)
                      : ((r.prototype = t.prototype), new r()));
              });
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.ClientError = void 0);
          var i = (function (e) {
            function t(n, r) {
              var i = this,
                o =
                  t.extractMessage(n) +
                  ": " +
                  JSON.stringify({ response: n, request: r });
              return (
                (i = e.call(this, o) || this),
                Object.setPrototypeOf(i, t.prototype),
                (i.response = n),
                (i.request = r),
                "function" == typeof Error.captureStackTrace &&
                  Error.captureStackTrace(i, t),
                i
              );
            }
            return (
              r(t, e),
              (t.extractMessage = function (e) {
                try {
                  return e.errors[0].message;
                } catch (t) {
                  return "GraphQL Error (Code: " + e.status + ")";
                }
              }),
              t
            );
          })(Error);
          t.ClientError = i;
        },
        776: (e) => {
          "use strict";
          var t = Object.prototype.hasOwnProperty,
            n = "~";
          function r() {}
          function i(e, t, n) {
            (this.fn = e), (this.context = t), (this.once = n || !1);
          }
          function o(e, t, r, o, s) {
            if ("function" != typeof r)
              throw new TypeError("The listener must be a function");
            var a = new i(r, o || e, s),
              c = n ? n + t : t;
            return (
              e._events[c]
                ? e._events[c].fn
                  ? (e._events[c] = [e._events[c], a])
                  : e._events[c].push(a)
                : ((e._events[c] = a), e._eventsCount++),
              e
            );
          }
          function s(e, t) {
            0 == --e._eventsCount ? (e._events = new r()) : delete e._events[t];
          }
          function a() {
            (this._events = new r()), (this._eventsCount = 0);
          }
          Object.create &&
            ((r.prototype = Object.create(null)),
            new r().__proto__ || (n = !1)),
            (a.prototype.eventNames = function () {
              var e,
                r,
                i = [];
              if (0 === this._eventsCount) return i;
              for (r in (e = this._events))
                t.call(e, r) && i.push(n ? r.slice(1) : r);
              return Object.getOwnPropertySymbols
                ? i.concat(Object.getOwnPropertySymbols(e))
                : i;
            }),
            (a.prototype.listeners = function (e) {
              var t = n ? n + e : e,
                r = this._events[t];
              if (!r) return [];
              if (r.fn) return [r.fn];
              for (var i = 0, o = r.length, s = new Array(o); i < o; i++)
                s[i] = r[i].fn;
              return s;
            }),
            (a.prototype.listenerCount = function (e) {
              var t = n ? n + e : e,
                r = this._events[t];
              return r ? (r.fn ? 1 : r.length) : 0;
            }),
            (a.prototype.emit = function (e, t, r, i, o, s) {
              var a = n ? n + e : e;
              if (!this._events[a]) return !1;
              var c,
                u,
                l = this._events[a],
                f = arguments.length;
              if (l.fn) {
                switch (
                  (l.once && this.removeListener(e, l.fn, void 0, !0), f)
                ) {
                  case 1:
                    return l.fn.call(l.context), !0;
                  case 2:
                    return l.fn.call(l.context, t), !0;
                  case 3:
                    return l.fn.call(l.context, t, r), !0;
                  case 4:
                    return l.fn.call(l.context, t, r, i), !0;
                  case 5:
                    return l.fn.call(l.context, t, r, i, o), !0;
                  case 6:
                    return l.fn.call(l.context, t, r, i, o, s), !0;
                }
                for (u = 1, c = new Array(f - 1); u < f; u++)
                  c[u - 1] = arguments[u];
                l.fn.apply(l.context, c);
              } else {
                var d,
                  h = l.length;
                for (u = 0; u < h; u++)
                  switch (
                    (l[u].once && this.removeListener(e, l[u].fn, void 0, !0),
                    f)
                  ) {
                    case 1:
                      l[u].fn.call(l[u].context);
                      break;
                    case 2:
                      l[u].fn.call(l[u].context, t);
                      break;
                    case 3:
                      l[u].fn.call(l[u].context, t, r);
                      break;
                    case 4:
                      l[u].fn.call(l[u].context, t, r, i);
                      break;
                    default:
                      if (!c)
                        for (d = 1, c = new Array(f - 1); d < f; d++)
                          c[d - 1] = arguments[d];
                      l[u].fn.apply(l[u].context, c);
                  }
              }
              return !0;
            }),
            (a.prototype.on = function (e, t, n) {
              return o(this, e, t, n, !1);
            }),
            (a.prototype.once = function (e, t, n) {
              return o(this, e, t, n, !0);
            }),
            (a.prototype.removeListener = function (e, t, r, i) {
              var o = n ? n + e : e;
              if (!this._events[o]) return this;
              if (!t) return s(this, o), this;
              var a = this._events[o];
              if (a.fn)
                a.fn !== t ||
                  (i && !a.once) ||
                  (r && a.context !== r) ||
                  s(this, o);
              else {
                for (var c = 0, u = [], l = a.length; c < l; c++)
                  (a[c].fn !== t ||
                    (i && !a[c].once) ||
                    (r && a[c].context !== r)) &&
                    u.push(a[c]);
                u.length
                  ? (this._events[o] = 1 === u.length ? u[0] : u)
                  : s(this, o);
              }
              return this;
            }),
            (a.prototype.removeAllListeners = function (e) {
              var t;
              return (
                e
                  ? ((t = n ? n + e : e), this._events[t] && s(this, t))
                  : ((this._events = new r()), (this._eventsCount = 0)),
                this
              );
            }),
            (a.prototype.off = a.prototype.removeListener),
            (a.prototype.addListener = a.prototype.on),
            (a.prefixed = n),
            (a.EventEmitter = a),
            (e.exports = a);
        },
        972: (e, t, n) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.default = function (e) {
              var t = e.prototype.toJSON;
              "function" == typeof t || (0, r.default)(0),
                (e.prototype.inspect = t),
                i.default && (e.prototype[i.default] = t);
            });
          var r = o(n(706)),
            i = o(n(554));
          function o(e) {
            return e && e.__esModule ? e : { default: e };
          }
        },
        2: (e, t, n) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.default = function (e) {
              return s(e, []);
            });
          var r,
            i = (r = n(554)) && r.__esModule ? r : { default: r };
          function o(e) {
            return (o =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (e) {
                    return typeof e;
                  }
                : function (e) {
                    return e &&
                      "function" == typeof Symbol &&
                      e.constructor === Symbol &&
                      e !== Symbol.prototype
                      ? "symbol"
                      : typeof e;
                  })(e);
          }
          function s(e, t) {
            switch (o(e)) {
              case "string":
                return JSON.stringify(e);
              case "function":
                return e.name ? "[function ".concat(e.name, "]") : "[function]";
              case "object":
                return null === e
                  ? "null"
                  : (function (e, t) {
                      if (-1 !== t.indexOf(e)) return "[Circular]";
                      var n = [].concat(t, [e]),
                        r = (function (e) {
                          var t = e[String(i.default)];
                          return "function" == typeof t
                            ? t
                            : "function" == typeof e.inspect
                            ? e.inspect
                            : void 0;
                        })(e);
                      if (void 0 !== r) {
                        var o = r.call(e);
                        if (o !== e) return "string" == typeof o ? o : s(o, n);
                      } else if (Array.isArray(e))
                        return (function (e, t) {
                          if (0 === e.length) return "[]";
                          if (t.length > 2) return "[Array]";
                          for (
                            var n = Math.min(10, e.length),
                              r = e.length - n,
                              i = [],
                              o = 0;
                            o < n;
                            ++o
                          )
                            i.push(s(e[o], t));
                          return (
                            1 === r
                              ? i.push("... 1 more item")
                              : r > 1 &&
                                i.push("... ".concat(r, " more items")),
                            "[" + i.join(", ") + "]"
                          );
                        })(e, n);
                      return (function (e, t) {
                        var n = Object.keys(e);
                        return 0 === n.length
                          ? "{}"
                          : t.length > 2
                          ? "[" +
                            (function (e) {
                              var t = Object.prototype.toString
                                .call(e)
                                .replace(/^\[object /, "")
                                .replace(/]$/, "");
                              if (
                                "Object" === t &&
                                "function" == typeof e.constructor
                              ) {
                                var n = e.constructor.name;
                                if ("string" == typeof n && "" !== n) return n;
                              }
                              return t;
                            })(e) +
                            "]"
                          : "{ " +
                            n
                              .map(function (n) {
                                return n + ": " + s(e[n], t);
                              })
                              .join(", ") +
                            " }";
                      })(e, n);
                    })(e, t);
              default:
                return String(e);
            }
          }
        },
        706: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.default = function (e, t) {
              if (!Boolean(e))
                throw new Error(
                  null != t ? t : "Unexpected invariant triggered."
                );
            });
        },
        554: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.default = void 0);
          var n =
            "function" == typeof Symbol && "function" == typeof Symbol.for
              ? Symbol.for("nodejs.util.inspect.custom")
              : void 0;
          t.default = n;
        },
        807: (e, t, n) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.isNode = function (e) {
              return null != e && "string" == typeof e.kind;
            }),
            (t.Token = t.Location = void 0);
          var r,
            i = (r = n(972)) && r.__esModule ? r : { default: r },
            o = (function () {
              function e(e, t, n) {
                (this.start = e.start),
                  (this.end = t.end),
                  (this.startToken = e),
                  (this.endToken = t),
                  (this.source = n);
              }
              return (
                (e.prototype.toJSON = function () {
                  return { start: this.start, end: this.end };
                }),
                e
              );
            })();
          (t.Location = o), (0, i.default)(o);
          var s = (function () {
            function e(e, t, n, r, i, o, s) {
              (this.kind = e),
                (this.start = t),
                (this.end = n),
                (this.line = r),
                (this.column = i),
                (this.value = s),
                (this.prev = o),
                (this.next = null);
            }
            return (
              (e.prototype.toJSON = function () {
                return {
                  kind: this.kind,
                  value: this.value,
                  line: this.line,
                  column: this.column,
                };
              }),
              e
            );
          })();
          (t.Token = s), (0, i.default)(s);
        },
        849: (e, t) => {
          "use strict";
          function n(e) {
            for (var t = 0; t < e.length; ++t)
              if (" " !== e[t] && "\t" !== e[t]) return !1;
            return !0;
          }
          function r(e) {
            for (
              var t, n = !0, r = !0, i = 0, o = null, s = 0;
              s < e.length;
              ++s
            )
              switch (e.charCodeAt(s)) {
                case 13:
                  10 === e.charCodeAt(s + 1) && ++s;
                case 10:
                  (n = !1), (r = !0), (i = 0);
                  break;
                case 9:
                case 32:
                  ++i;
                  break;
                default:
                  r && !n && (null === o || i < o) && (o = i), (r = !1);
              }
            return null !== (t = o) && void 0 !== t ? t : 0;
          }
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.dedentBlockStringValue = function (e) {
              var t = e.split(/\r\n|[\n\r]/g),
                i = r(e);
              if (0 !== i)
                for (var o = 1; o < t.length; o++) t[o] = t[o].slice(i);
              for (var s = 0; s < t.length && n(t[s]); ) ++s;
              for (var a = t.length; a > s && n(t[a - 1]); ) --a;
              return t.slice(s, a).join("\n");
            }),
            (t.getBlockStringIndentation = r),
            (t.printBlockString = function (e) {
              var t =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : "",
                n =
                  arguments.length > 2 &&
                  void 0 !== arguments[2] &&
                  arguments[2],
                r = -1 === e.indexOf("\n"),
                i = " " === e[0] || "\t" === e[0],
                o = '"' === e[e.length - 1],
                s = "\\" === e[e.length - 1],
                a = !r || o || s || n,
                c = "";
              return (
                !a || (r && i) || (c += "\n" + t),
                (c += t ? e.replace(/\n/g, "\n" + t) : e),
                a && (c += "\n"),
                '"""' + c.replace(/"""/g, '\\"""') + '"""'
              );
            });
        },
        33: (e, t, n) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.print = function (e) {
              return (0, r.visit)(e, { leave: o });
            });
          var r = n(285),
            i = n(849),
            o = {
              Name: function (e) {
                return e.value;
              },
              Variable: function (e) {
                return "$" + e.name;
              },
              Document: function (e) {
                return a(e.definitions, "\n\n") + "\n";
              },
              OperationDefinition: function (e) {
                var t = e.operation,
                  n = e.name,
                  r = u("(", a(e.variableDefinitions, ", "), ")"),
                  i = a(e.directives, " "),
                  o = e.selectionSet;
                return n || i || r || "query" !== t
                  ? a([t, a([n, r]), i, o], " ")
                  : o;
              },
              VariableDefinition: function (e) {
                var t = e.variable,
                  n = e.type,
                  r = e.defaultValue,
                  i = e.directives;
                return t + ": " + n + u(" = ", r) + u(" ", a(i, " "));
              },
              SelectionSet: function (e) {
                return c(e.selections);
              },
              Field: function (e) {
                var t = e.alias,
                  n = e.name,
                  r = e.arguments,
                  i = e.directives,
                  o = e.selectionSet,
                  s = u("", t, ": ") + n,
                  c = s + u("(", a(r, ", "), ")");
                return (
                  c.length > 80 && (c = s + u("(\n", l(a(r, "\n")), "\n)")),
                  a([c, a(i, " "), o], " ")
                );
              },
              Argument: function (e) {
                return e.name + ": " + e.value;
              },
              FragmentSpread: function (e) {
                return "..." + e.name + u(" ", a(e.directives, " "));
              },
              InlineFragment: function (e) {
                var t = e.typeCondition,
                  n = e.directives,
                  r = e.selectionSet;
                return a(["...", u("on ", t), a(n, " "), r], " ");
              },
              FragmentDefinition: function (e) {
                var t = e.name,
                  n = e.typeCondition,
                  r = e.variableDefinitions,
                  i = e.directives,
                  o = e.selectionSet;
                return (
                  "fragment ".concat(t).concat(u("(", a(r, ", "), ")"), " ") +
                  "on ".concat(n, " ").concat(u("", a(i, " "), " ")) +
                  o
                );
              },
              IntValue: function (e) {
                return e.value;
              },
              FloatValue: function (e) {
                return e.value;
              },
              StringValue: function (e, t) {
                var n = e.value;
                return e.block
                  ? (0, i.printBlockString)(n, "description" === t ? "" : "  ")
                  : JSON.stringify(n);
              },
              BooleanValue: function (e) {
                return e.value ? "true" : "false";
              },
              NullValue: function () {
                return "null";
              },
              EnumValue: function (e) {
                return e.value;
              },
              ListValue: function (e) {
                return "[" + a(e.values, ", ") + "]";
              },
              ObjectValue: function (e) {
                return "{" + a(e.fields, ", ") + "}";
              },
              ObjectField: function (e) {
                return e.name + ": " + e.value;
              },
              Directive: function (e) {
                return "@" + e.name + u("(", a(e.arguments, ", "), ")");
              },
              NamedType: function (e) {
                return e.name;
              },
              ListType: function (e) {
                return "[" + e.type + "]";
              },
              NonNullType: function (e) {
                return e.type + "!";
              },
              SchemaDefinition: s(function (e) {
                var t = e.directives,
                  n = e.operationTypes;
                return a(["schema", a(t, " "), c(n)], " ");
              }),
              OperationTypeDefinition: function (e) {
                return e.operation + ": " + e.type;
              },
              ScalarTypeDefinition: s(function (e) {
                return a(["scalar", e.name, a(e.directives, " ")], " ");
              }),
              ObjectTypeDefinition: s(function (e) {
                var t = e.name,
                  n = e.interfaces,
                  r = e.directives,
                  i = e.fields;
                return a(
                  ["type", t, u("implements ", a(n, " & ")), a(r, " "), c(i)],
                  " "
                );
              }),
              FieldDefinition: s(function (e) {
                var t = e.name,
                  n = e.arguments,
                  r = e.type,
                  i = e.directives;
                return (
                  t +
                  (d(n)
                    ? u("(\n", l(a(n, "\n")), "\n)")
                    : u("(", a(n, ", "), ")")) +
                  ": " +
                  r +
                  u(" ", a(i, " "))
                );
              }),
              InputValueDefinition: s(function (e) {
                var t = e.name,
                  n = e.type,
                  r = e.defaultValue,
                  i = e.directives;
                return a([t + ": " + n, u("= ", r), a(i, " ")], " ");
              }),
              InterfaceTypeDefinition: s(function (e) {
                var t = e.name,
                  n = e.interfaces,
                  r = e.directives,
                  i = e.fields;
                return a(
                  [
                    "interface",
                    t,
                    u("implements ", a(n, " & ")),
                    a(r, " "),
                    c(i),
                  ],
                  " "
                );
              }),
              UnionTypeDefinition: s(function (e) {
                var t = e.name,
                  n = e.directives,
                  r = e.types;
                return a(
                  [
                    "union",
                    t,
                    a(n, " "),
                    r && 0 !== r.length ? "= " + a(r, " | ") : "",
                  ],
                  " "
                );
              }),
              EnumTypeDefinition: s(function (e) {
                var t = e.name,
                  n = e.directives,
                  r = e.values;
                return a(["enum", t, a(n, " "), c(r)], " ");
              }),
              EnumValueDefinition: s(function (e) {
                return a([e.name, a(e.directives, " ")], " ");
              }),
              InputObjectTypeDefinition: s(function (e) {
                var t = e.name,
                  n = e.directives,
                  r = e.fields;
                return a(["input", t, a(n, " "), c(r)], " ");
              }),
              DirectiveDefinition: s(function (e) {
                var t = e.name,
                  n = e.arguments,
                  r = e.repeatable,
                  i = e.locations;
                return (
                  "directive @" +
                  t +
                  (d(n)
                    ? u("(\n", l(a(n, "\n")), "\n)")
                    : u("(", a(n, ", "), ")")) +
                  (r ? " repeatable" : "") +
                  " on " +
                  a(i, " | ")
                );
              }),
              SchemaExtension: function (e) {
                var t = e.directives,
                  n = e.operationTypes;
                return a(["extend schema", a(t, " "), c(n)], " ");
              },
              ScalarTypeExtension: function (e) {
                return a(["extend scalar", e.name, a(e.directives, " ")], " ");
              },
              ObjectTypeExtension: function (e) {
                var t = e.name,
                  n = e.interfaces,
                  r = e.directives,
                  i = e.fields;
                return a(
                  [
                    "extend type",
                    t,
                    u("implements ", a(n, " & ")),
                    a(r, " "),
                    c(i),
                  ],
                  " "
                );
              },
              InterfaceTypeExtension: function (e) {
                var t = e.name,
                  n = e.interfaces,
                  r = e.directives,
                  i = e.fields;
                return a(
                  [
                    "extend interface",
                    t,
                    u("implements ", a(n, " & ")),
                    a(r, " "),
                    c(i),
                  ],
                  " "
                );
              },
              UnionTypeExtension: function (e) {
                var t = e.name,
                  n = e.directives,
                  r = e.types;
                return a(
                  [
                    "extend union",
                    t,
                    a(n, " "),
                    r && 0 !== r.length ? "= " + a(r, " | ") : "",
                  ],
                  " "
                );
              },
              EnumTypeExtension: function (e) {
                var t = e.name,
                  n = e.directives,
                  r = e.values;
                return a(["extend enum", t, a(n, " "), c(r)], " ");
              },
              InputObjectTypeExtension: function (e) {
                var t = e.name,
                  n = e.directives,
                  r = e.fields;
                return a(["extend input", t, a(n, " "), c(r)], " ");
              },
            };
          function s(e) {
            return function (t) {
              return a([t.description, e(t)], "\n");
            };
          }
          function a(e) {
            var t,
              n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : "";
            return null !==
              (t =
                null == e
                  ? void 0
                  : e
                      .filter(function (e) {
                        return e;
                      })
                      .join(n)) && void 0 !== t
              ? t
              : "";
          }
          function c(e) {
            return u("{\n", l(a(e, "\n")), "\n}");
          }
          function u(e, t) {
            var n =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : "";
            return null != t && "" !== t ? e + t + n : "";
          }
          function l(e) {
            return u("  ", e.replace(/\n/g, "\n  "));
          }
          function f(e) {
            return -1 !== e.indexOf("\n");
          }
          function d(e) {
            return null != e && e.some(f);
          }
        },
        285: (e, t, n) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.visit = function (e, t) {
              var n =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : s,
                r = void 0,
                u = Array.isArray(e),
                l = [e],
                f = -1,
                d = [],
                h = void 0,
                p = void 0,
                y = void 0,
                v = [],
                m = [],
                b = e;
              do {
                var g = ++f === l.length,
                  w = g && 0 !== d.length;
                if (g) {
                  if (
                    ((p = 0 === m.length ? void 0 : v[v.length - 1]),
                    (h = y),
                    (y = m.pop()),
                    w)
                  ) {
                    if (u) h = h.slice();
                    else {
                      for (
                        var _ = {}, E = 0, x = Object.keys(h);
                        E < x.length;
                        E++
                      ) {
                        var O = x[E];
                        _[O] = h[O];
                      }
                      h = _;
                    }
                    for (var T = 0, I = 0; I < d.length; I++) {
                      var k = d[I][0],
                        j = d[I][1];
                      u && (k -= T),
                        u && null === j ? (h.splice(k, 1), T++) : (h[k] = j);
                    }
                  }
                  (f = r.index),
                    (l = r.keys),
                    (d = r.edits),
                    (u = r.inArray),
                    (r = r.prev);
                } else {
                  if (
                    ((p = y ? (u ? f : l[f]) : void 0),
                    null == (h = y ? y[p] : b))
                  )
                    continue;
                  y && v.push(p);
                }
                var S,
                  D = void 0;
                if (!Array.isArray(h)) {
                  if (!(0, o.isNode)(h))
                    throw new Error(
                      "Invalid AST Node: ".concat((0, i.default)(h), ".")
                    );
                  var A = c(t, h.kind, g);
                  if (A) {
                    if ((D = A.call(t, h, p, y, v, m)) === a) break;
                    if (!1 === D) {
                      if (!g) {
                        v.pop();
                        continue;
                      }
                    } else if (void 0 !== D && (d.push([p, D]), !g)) {
                      if (!(0, o.isNode)(D)) {
                        v.pop();
                        continue;
                      }
                      h = D;
                    }
                  }
                }
                void 0 === D && w && d.push([p, h]),
                  g
                    ? v.pop()
                    : ((r = {
                        inArray: u,
                        index: f,
                        keys: l,
                        edits: d,
                        prev: r,
                      }),
                      (l = (u = Array.isArray(h))
                        ? h
                        : null !== (S = n[h.kind]) && void 0 !== S
                        ? S
                        : []),
                      (f = -1),
                      (d = []),
                      y && m.push(y),
                      (y = h));
              } while (void 0 !== r);
              return 0 !== d.length && (b = d[d.length - 1][1]), b;
            }),
            (t.visitInParallel = function (e) {
              var t = new Array(e.length);
              return {
                enter: function (n) {
                  for (var r = 0; r < e.length; r++)
                    if (null == t[r]) {
                      var i = c(e[r], n.kind, !1);
                      if (i) {
                        var o = i.apply(e[r], arguments);
                        if (!1 === o) t[r] = n;
                        else if (o === a) t[r] = a;
                        else if (void 0 !== o) return o;
                      }
                    }
                },
                leave: function (n) {
                  for (var r = 0; r < e.length; r++)
                    if (null == t[r]) {
                      var i = c(e[r], n.kind, !0);
                      if (i) {
                        var o = i.apply(e[r], arguments);
                        if (o === a) t[r] = a;
                        else if (void 0 !== o && !1 !== o) return o;
                      }
                    } else t[r] === n && (t[r] = null);
                },
              };
            }),
            (t.getVisitFn = c),
            (t.BREAK = t.QueryDocumentKeys = void 0);
          var r,
            i = (r = n(2)) && r.__esModule ? r : { default: r },
            o = n(807),
            s = {
              Name: [],
              Document: ["definitions"],
              OperationDefinition: [
                "name",
                "variableDefinitions",
                "directives",
                "selectionSet",
              ],
              VariableDefinition: [
                "variable",
                "type",
                "defaultValue",
                "directives",
              ],
              Variable: ["name"],
              SelectionSet: ["selections"],
              Field: [
                "alias",
                "name",
                "arguments",
                "directives",
                "selectionSet",
              ],
              Argument: ["name", "value"],
              FragmentSpread: ["name", "directives"],
              InlineFragment: ["typeCondition", "directives", "selectionSet"],
              FragmentDefinition: [
                "name",
                "variableDefinitions",
                "typeCondition",
                "directives",
                "selectionSet",
              ],
              IntValue: [],
              FloatValue: [],
              StringValue: [],
              BooleanValue: [],
              NullValue: [],
              EnumValue: [],
              ListValue: ["values"],
              ObjectValue: ["fields"],
              ObjectField: ["name", "value"],
              Directive: ["name", "arguments"],
              NamedType: ["name"],
              ListType: ["type"],
              NonNullType: ["type"],
              SchemaDefinition: ["description", "directives", "operationTypes"],
              OperationTypeDefinition: ["type"],
              ScalarTypeDefinition: ["description", "name", "directives"],
              ObjectTypeDefinition: [
                "description",
                "name",
                "interfaces",
                "directives",
                "fields",
              ],
              FieldDefinition: [
                "description",
                "name",
                "arguments",
                "type",
                "directives",
              ],
              InputValueDefinition: [
                "description",
                "name",
                "type",
                "defaultValue",
                "directives",
              ],
              InterfaceTypeDefinition: [
                "description",
                "name",
                "interfaces",
                "directives",
                "fields",
              ],
              UnionTypeDefinition: [
                "description",
                "name",
                "directives",
                "types",
              ],
              EnumTypeDefinition: [
                "description",
                "name",
                "directives",
                "values",
              ],
              EnumValueDefinition: ["description", "name", "directives"],
              InputObjectTypeDefinition: [
                "description",
                "name",
                "directives",
                "fields",
              ],
              DirectiveDefinition: [
                "description",
                "name",
                "arguments",
                "locations",
              ],
              SchemaExtension: ["directives", "operationTypes"],
              ScalarTypeExtension: ["name", "directives"],
              ObjectTypeExtension: [
                "name",
                "interfaces",
                "directives",
                "fields",
              ],
              InterfaceTypeExtension: [
                "name",
                "interfaces",
                "directives",
                "fields",
              ],
              UnionTypeExtension: ["name", "directives", "types"],
              EnumTypeExtension: ["name", "directives", "values"],
              InputObjectTypeExtension: ["name", "directives", "fields"],
            };
          t.QueryDocumentKeys = s;
          var a = Object.freeze({});
          function c(e, t, n) {
            var r = e[t];
            if (r) {
              if (!n && "function" == typeof r) return r;
              var i = n ? r.leave : r.enter;
              if ("function" == typeof i) return i;
            } else {
              var o = n ? e.leave : e.enter;
              if (o) {
                if ("function" == typeof o) return o;
                var s = o[t];
                if ("function" == typeof s) return s;
              }
            }
          }
          t.BREAK = a;
        },
        121: (e, t, n) => {
          "use strict";
          n.d(t, { Z: () => r }), (e = n.hmd(e));
          const r = (function (e) {
            var t,
              n = e.Symbol;
            return (
              "function" == typeof n
                ? n.observable
                  ? (t = n.observable)
                  : ((t = n("observable")), (n.observable = t))
                : (t = "@@observable"),
              t
            );
          })(
            "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : void 0 !== n.g
              ? n.g
              : e
          );
        },
      },
      r = {};
    function i(e) {
      var t = r[e];
      if (void 0 !== t) {
        if (void 0 !== t.error) throw t.error;
        return t.exports;
      }
      var o = (r[e] = { id: e, loaded: !1, exports: {} });
      try {
        var s = { id: e, module: o, factory: n[e], require: i };
        i.i.forEach(function (e) {
          e(s);
        }),
          (o = s.module),
          s.factory.call(o.exports, o, o.exports, s.require);
      } catch (e) {
        throw ((o.error = e), e);
      }
      return (o.loaded = !0), o.exports;
    }
    return (
      (i.m = n),
      (i.c = r),
      (i.i = []),
      (i.n = (e) => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return i.d(t, { a: t }), t;
      }),
      (i.d = (e, t) => {
        for (var n in t)
          i.o(t, n) &&
            !i.o(e, n) &&
            Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
      }),
      (i.hu = (e) => e + "." + i.h() + ".hot-update.js"),
      (i.hmrF = () => "main." + i.h() + ".hot-update.json"),
      (i.h = () => "df85e118b5f63cf04044"),
      (i.g = (function () {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || new Function("return this")();
        } catch (e) {
          if ("object" == typeof window) return window;
        }
      })()),
      (i.hmd = (e) => (
        (e = Object.create(e)).children || (e.children = []),
        Object.defineProperty(e, "exports", {
          enumerable: !0,
          set: () => {
            throw new Error(
              "ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: " +
                e.id
            );
          },
        }),
        e
      )),
      (i.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
      (e = {}),
      (t = "@flatfile/sdk:"),
      (i.l = (n, r, o, s) => {
        if (e[n]) e[n].push(r);
        else {
          var a, c;
          if (void 0 !== o)
            for (
              var u = document.getElementsByTagName("script"), l = 0;
              l < u.length;
              l++
            ) {
              var f = u[l];
              if (
                f.getAttribute("src") == n ||
                f.getAttribute("data-webpack") == t + o
              ) {
                a = f;
                break;
              }
            }
          a ||
            ((c = !0),
            ((a = document.createElement("script")).charset = "utf-8"),
            (a.timeout = 120),
            i.nc && a.setAttribute("nonce", i.nc),
            a.setAttribute("data-webpack", t + o),
            (a.src = n)),
            (e[n] = [r]);
          var d = (t, r) => {
              (a.onerror = a.onload = null), clearTimeout(h);
              var i = e[n];
              if (
                (delete e[n],
                a.parentNode && a.parentNode.removeChild(a),
                i && i.forEach((e) => e(r)),
                t)
              )
                return t(r);
            },
            h = setTimeout(
              d.bind(null, void 0, { type: "timeout", target: a }),
              12e4
            );
          (a.onerror = d.bind(null, a.onerror)),
            (a.onload = d.bind(null, a.onload)),
            c && document.head.appendChild(a);
        }
      }),
      (i.r = (e) => {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      }),
      (() => {
        var e,
          t,
          n,
          r,
          o = {},
          s = i.c,
          a = [],
          c = [],
          u = "idle";
        function l(e) {
          u = e;
          for (var t = 0; t < c.length; t++) c[t].call(null, e);
        }
        function f(e) {
          if (0 === t.length) return e();
          var n = t;
          return (
            (t = []),
            Promise.all(n).then(function () {
              return f(e);
            })
          );
        }
        function d(e) {
          if ("idle" !== u)
            throw new Error("check() is only allowed in idle status");
          return (
            l("check"),
            i.hmrM().then(function (r) {
              if (!r) return l(y() ? "ready" : "idle"), null;
              l("prepare");
              var o = [];
              return (
                (t = []),
                (n = []),
                Promise.all(
                  Object.keys(i.hmrC).reduce(function (e, t) {
                    return i.hmrC[t](r.c, r.r, r.m, e, n, o), e;
                  }, [])
                ).then(function () {
                  return f(function () {
                    return e ? p(e) : (l("ready"), o);
                  });
                })
              );
            })
          );
        }
        function h(e) {
          return "ready" !== u
            ? Promise.resolve().then(function () {
                throw new Error("apply() is only allowed in ready status");
              })
            : p(e);
        }
        function p(e) {
          (e = e || {}), y();
          var t = n.map(function (t) {
            return t(e);
          });
          n = void 0;
          var i,
            o = t
              .map(function (e) {
                return e.error;
              })
              .filter(Boolean);
          if (o.length > 0)
            return (
              l("abort"),
              Promise.resolve().then(function () {
                throw o[0];
              })
            );
          l("dispose"),
            t.forEach(function (e) {
              e.dispose && e.dispose();
            }),
            l("apply");
          var s = function (e) {
              i || (i = e);
            },
            a = [];
          return (
            t.forEach(function (e) {
              if (e.apply) {
                var t = e.apply(s);
                if (t) for (var n = 0; n < t.length; n++) a.push(t[n]);
              }
            }),
            i
              ? (l("fail"),
                Promise.resolve().then(function () {
                  throw i;
                }))
              : r
              ? p(e).then(function (e) {
                  return (
                    a.forEach(function (t) {
                      e.indexOf(t) < 0 && e.push(t);
                    }),
                    e
                  );
                })
              : (l("idle"), Promise.resolve(a))
          );
        }
        function y() {
          if (r)
            return (
              n || (n = []),
              Object.keys(i.hmrI).forEach(function (e) {
                r.forEach(function (t) {
                  i.hmrI[e](t, n);
                });
              }),
              (r = void 0),
              !0
            );
        }
        (i.hmrD = o),
          i.i.push(function (p) {
            var y,
              v,
              m,
              b,
              g = p.module,
              w = (function (n, r) {
                var i = s[r];
                if (!i) return n;
                var o = function (t) {
                    if (i.hot.active) {
                      if (s[t]) {
                        var o = s[t].parents;
                        -1 === o.indexOf(r) && o.push(r);
                      } else (a = [r]), (e = t);
                      -1 === i.children.indexOf(t) && i.children.push(t);
                    } else
                      console.warn(
                        "[HMR] unexpected require(" +
                          t +
                          ") from disposed module " +
                          r
                      ),
                        (a = []);
                    return n(t);
                  },
                  c = function (e) {
                    return {
                      configurable: !0,
                      enumerable: !0,
                      get: function () {
                        return n[e];
                      },
                      set: function (t) {
                        n[e] = t;
                      },
                    };
                  };
                for (var d in n)
                  Object.prototype.hasOwnProperty.call(n, d) &&
                    "e" !== d &&
                    Object.defineProperty(o, d, c(d));
                return (
                  (o.e = function (e) {
                    return (function (e) {
                      switch (u) {
                        case "ready":
                          return (
                            l("prepare"),
                            t.push(e),
                            f(function () {
                              l("ready");
                            }),
                            e
                          );
                        case "prepare":
                          return t.push(e), e;
                        default:
                          return e;
                      }
                    })(n.e(e));
                  }),
                  o
                );
              })(p.require, p.id);
            (g.hot =
              ((y = p.id),
              (v = g),
              (b = {
                _acceptedDependencies: {},
                _acceptedErrorHandlers: {},
                _declinedDependencies: {},
                _selfAccepted: !1,
                _selfDeclined: !1,
                _selfInvalidated: !1,
                _disposeHandlers: [],
                _main: (m = e !== y),
                _requireSelf: function () {
                  (a = v.parents.slice()), (e = m ? void 0 : y), i(y);
                },
                active: !0,
                accept: function (e, t, n) {
                  if (void 0 === e) b._selfAccepted = !0;
                  else if ("function" == typeof e) b._selfAccepted = e;
                  else if ("object" == typeof e && null !== e)
                    for (var r = 0; r < e.length; r++)
                      (b._acceptedDependencies[e[r]] = t || function () {}),
                        (b._acceptedErrorHandlers[e[r]] = n);
                  else
                    (b._acceptedDependencies[e] = t || function () {}),
                      (b._acceptedErrorHandlers[e] = n);
                },
                decline: function (e) {
                  if (void 0 === e) b._selfDeclined = !0;
                  else if ("object" == typeof e && null !== e)
                    for (var t = 0; t < e.length; t++)
                      b._declinedDependencies[e[t]] = !0;
                  else b._declinedDependencies[e] = !0;
                },
                dispose: function (e) {
                  b._disposeHandlers.push(e);
                },
                addDisposeHandler: function (e) {
                  b._disposeHandlers.push(e);
                },
                removeDisposeHandler: function (e) {
                  var t = b._disposeHandlers.indexOf(e);
                  t >= 0 && b._disposeHandlers.splice(t, 1);
                },
                invalidate: function () {
                  switch (((this._selfInvalidated = !0), u)) {
                    case "idle":
                      (n = []),
                        Object.keys(i.hmrI).forEach(function (e) {
                          i.hmrI[e](y, n);
                        }),
                        l("ready");
                      break;
                    case "ready":
                      Object.keys(i.hmrI).forEach(function (e) {
                        i.hmrI[e](y, n);
                      });
                      break;
                    case "prepare":
                    case "check":
                    case "dispose":
                    case "apply":
                      (r = r || []).push(y);
                  }
                },
                check: d,
                apply: h,
                status: function (e) {
                  if (!e) return u;
                  c.push(e);
                },
                addStatusHandler: function (e) {
                  c.push(e);
                },
                removeStatusHandler: function (e) {
                  var t = c.indexOf(e);
                  t >= 0 && c.splice(t, 1);
                },
                data: o[y],
              }),
              (e = void 0),
              b)),
              (g.parents = a),
              (g.children = []),
              (a = []),
              (p.require = w);
          }),
          (i.hmrC = {}),
          (i.hmrI = {});
      })(),
      (i.p = "/"),
      (() => {
        var e,
          t,
          n,
          r,
          o = { 179: 0 },
          s = {};
        function a(e) {
          return new Promise((t, n) => {
            s[e] = t;
            var r = i.p + i.hu(e),
              o = new Error();
            i.l(r, (t) => {
              if (s[e]) {
                s[e] = void 0;
                var r = t && ("load" === t.type ? "missing" : t.type),
                  i = t && t.target && t.target.src;
                (o.message =
                  "Loading hot update chunk " +
                  e +
                  " failed.\n(" +
                  r +
                  ": " +
                  i +
                  ")"),
                  (o.name = "ChunkLoadError"),
                  (o.type = r),
                  (o.request = i),
                  n(o);
              }
            });
          });
        }
        function c(s) {
          function a(e) {
            for (
              var t = [e],
                n = {},
                r = t.map(function (e) {
                  return { chain: [e], id: e };
                });
              r.length > 0;

            ) {
              var o = r.pop(),
                s = o.id,
                a = o.chain,
                u = i.c[s];
              if (u && (!u.hot._selfAccepted || u.hot._selfInvalidated)) {
                if (u.hot._selfDeclined)
                  return { type: "self-declined", chain: a, moduleId: s };
                if (u.hot._main)
                  return { type: "unaccepted", chain: a, moduleId: s };
                for (var l = 0; l < u.parents.length; l++) {
                  var f = u.parents[l],
                    d = i.c[f];
                  if (d) {
                    if (d.hot._declinedDependencies[s])
                      return {
                        type: "declined",
                        chain: a.concat([f]),
                        moduleId: s,
                        parentId: f,
                      };
                    -1 === t.indexOf(f) &&
                      (d.hot._acceptedDependencies[s]
                        ? (n[f] || (n[f] = []), c(n[f], [s]))
                        : (delete n[f],
                          t.push(f),
                          r.push({ chain: a.concat([f]), id: f })));
                  }
                }
              }
            }
            return {
              type: "accepted",
              moduleId: e,
              outdatedModules: t,
              outdatedDependencies: n,
            };
          }
          function c(e, t) {
            for (var n = 0; n < t.length; n++) {
              var r = t[n];
              -1 === e.indexOf(r) && e.push(r);
            }
          }
          i.f && delete i.f.jsonpHmr, (e = void 0);
          var u = {},
            l = [],
            f = {},
            d = function (e) {
              console.warn(
                "[HMR] unexpected require(" + e.id + ") to disposed module"
              );
            };
          for (var h in t)
            if (i.o(t, h)) {
              var p,
                y = t[h],
                v = !1,
                m = !1,
                b = !1,
                g = "";
              switch (
                ((p = y ? a(h) : { type: "disposed", moduleId: h }).chain &&
                  (g = "\nUpdate propagation: " + p.chain.join(" -> ")),
                p.type)
              ) {
                case "self-declined":
                  s.onDeclined && s.onDeclined(p),
                    s.ignoreDeclined ||
                      (v = new Error(
                        "Aborted because of self decline: " + p.moduleId + g
                      ));
                  break;
                case "declined":
                  s.onDeclined && s.onDeclined(p),
                    s.ignoreDeclined ||
                      (v = new Error(
                        "Aborted because of declined dependency: " +
                          p.moduleId +
                          " in " +
                          p.parentId +
                          g
                      ));
                  break;
                case "unaccepted":
                  s.onUnaccepted && s.onUnaccepted(p),
                    s.ignoreUnaccepted ||
                      (v = new Error(
                        "Aborted because " + h + " is not accepted" + g
                      ));
                  break;
                case "accepted":
                  s.onAccepted && s.onAccepted(p), (m = !0);
                  break;
                case "disposed":
                  s.onDisposed && s.onDisposed(p), (b = !0);
                  break;
                default:
                  throw new Error("Unexception type " + p.type);
              }
              if (v) return { error: v };
              if (m)
                for (h in ((f[h] = y),
                c(l, p.outdatedModules),
                p.outdatedDependencies))
                  i.o(p.outdatedDependencies, h) &&
                    (u[h] || (u[h] = []), c(u[h], p.outdatedDependencies[h]));
              b && (c(l, [p.moduleId]), (f[h] = d));
            }
          t = void 0;
          for (var w, _ = [], E = 0; E < l.length; E++) {
            var x = l[E],
              O = i.c[x];
            O &&
              (O.hot._selfAccepted || O.hot._main) &&
              f[x] !== d &&
              !O.hot._selfInvalidated &&
              _.push({
                module: x,
                require: O.hot._requireSelf,
                errorHandler: O.hot._selfAccepted,
              });
          }
          return {
            dispose: function () {
              var e;
              n.forEach(function (e) {
                delete o[e];
              }),
                (n = void 0);
              for (var t, r = l.slice(); r.length > 0; ) {
                var s = r.pop(),
                  a = i.c[s];
                if (a) {
                  var c = {},
                    f = a.hot._disposeHandlers;
                  for (E = 0; E < f.length; E++) f[E].call(null, c);
                  for (
                    i.hmrD[s] = c,
                      a.hot.active = !1,
                      delete i.c[s],
                      delete u[s],
                      E = 0;
                    E < a.children.length;
                    E++
                  ) {
                    var d = i.c[a.children[E]];
                    d &&
                      (e = d.parents.indexOf(s)) >= 0 &&
                      d.parents.splice(e, 1);
                  }
                }
              }
              for (var h in u)
                if (i.o(u, h) && (a = i.c[h]))
                  for (w = u[h], E = 0; E < w.length; E++)
                    (t = w[E]),
                      (e = a.children.indexOf(t)) >= 0 &&
                        a.children.splice(e, 1);
            },
            apply: function (e) {
              for (var t in f) i.o(f, t) && (i.m[t] = f[t]);
              for (var n = 0; n < r.length; n++) r[n](i);
              for (var o in u)
                if (i.o(u, o)) {
                  var a = i.c[o];
                  if (a) {
                    w = u[o];
                    for (var c = [], d = [], h = [], p = 0; p < w.length; p++) {
                      var y = w[p],
                        v = a.hot._acceptedDependencies[y],
                        m = a.hot._acceptedErrorHandlers[y];
                      if (v) {
                        if (-1 !== c.indexOf(v)) continue;
                        c.push(v), d.push(m), h.push(y);
                      }
                    }
                    for (var b = 0; b < c.length; b++)
                      try {
                        c[b].call(null, w);
                      } catch (t) {
                        if ("function" == typeof d[b])
                          try {
                            d[b](t, { moduleId: o, dependencyId: h[b] });
                          } catch (n) {
                            s.onErrored &&
                              s.onErrored({
                                type: "accept-error-handler-errored",
                                moduleId: o,
                                dependencyId: h[b],
                                error: n,
                                originalError: t,
                              }),
                              s.ignoreErrored || (e(n), e(t));
                          }
                        else
                          s.onErrored &&
                            s.onErrored({
                              type: "accept-errored",
                              moduleId: o,
                              dependencyId: h[b],
                              error: t,
                            }),
                            s.ignoreErrored || e(t);
                      }
                  }
                }
              for (var g = 0; g < _.length; g++) {
                var E = _[g],
                  x = E.module;
                try {
                  E.require(x);
                } catch (t) {
                  if ("function" == typeof E.errorHandler)
                    try {
                      E.errorHandler(t, { moduleId: x, module: i.c[x] });
                    } catch (n) {
                      s.onErrored &&
                        s.onErrored({
                          type: "self-accept-error-handler-errored",
                          moduleId: x,
                          error: n,
                          originalError: t,
                        }),
                        s.ignoreErrored || (e(n), e(t));
                    }
                  else
                    s.onErrored &&
                      s.onErrored({
                        type: "self-accept-errored",
                        moduleId: x,
                        error: t,
                      }),
                      s.ignoreErrored || e(t);
                }
              }
              return l;
            },
          };
        }
        (self.webpackHotUpdate_flatfile_sdk = (e, n, o) => {
          for (var a in n) i.o(n, a) && (t[a] = n[a]);
          o && r.push(o), s[e] && (s[e](), (s[e] = void 0));
        }),
          (i.hmrI.jsonp = function (e, o) {
            t || ((t = {}), (r = []), (n = []), o.push(c)),
              i.o(t, e) || (t[e] = i.m[e]);
          }),
          (i.hmrC.jsonp = function (s, u, l, f, d, h) {
            d.push(c),
              (e = {}),
              (n = u),
              (t = l.reduce(function (e, t) {
                return (e[t] = !1), e;
              }, {})),
              (r = []),
              s.forEach(function (t) {
                i.o(o, t) && void 0 !== o[t] && (f.push(a(t)), (e[t] = !0));
              }),
              i.f &&
                (i.f.jsonpHmr = function (t, n) {
                  e &&
                    !i.o(e, t) &&
                    i.o(o, t) &&
                    void 0 !== o[t] &&
                    (n.push(a(t)), (e[t] = !0));
                });
          }),
          (i.hmrM = () => {
            if ("undefined" == typeof fetch)
              throw new Error("No browser support: need fetch API");
            return fetch(i.p + i.hmrF()).then((e) => {
              if (404 !== e.status) {
                if (!e.ok)
                  throw new Error(
                    "Failed to fetch update manifest " + e.statusText
                  );
                return e.json();
              }
            });
          });
      })(),
      i(418)
    );
  })();
});
