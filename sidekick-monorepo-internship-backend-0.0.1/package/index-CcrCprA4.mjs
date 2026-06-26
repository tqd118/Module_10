var nf = Object.defineProperty;
var eo = (e) => {
  throw TypeError(e);
};
var rf = (e, t, n) => t in e ? nf(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var V = (e, t, n) => rf(e, typeof t != "symbol" ? t + "" : t, n), ii = (e, t, n) => t.has(e) || eo("Cannot " + n);
var W = (e, t, n) => (ii(e, t, "read from private field"), n ? n.call(e) : t.get(e)), Ue = (e, t, n) => t.has(e) ? eo("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), At = (e, t, n, r) => (ii(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n), we = (e, t, n) => (ii(e, t, "access private method"), n);
var sf = /(%?)(%([sdijo]))/g;
function af(e, t) {
  switch (t) {
    case "s":
      return e;
    case "d":
    case "i":
      return Number(e);
    case "j":
      return JSON.stringify(e);
    case "o": {
      if (typeof e == "string")
        return e;
      const n = JSON.stringify(e);
      return n === "{}" || n === "[]" || /^\[object .+?\]$/.test(n) ? e : n;
    }
  }
}
function qn(e, ...t) {
  if (t.length === 0)
    return e;
  let n = 0, r = e.replace(
    sf,
    (s, i, a, o) => {
      const c = t[n], u = af(c, o);
      return i ? s : (n++, u);
    }
  );
  return n < t.length && (r += ` ${t.slice(n).join(" ")}`), r = r.replace(/%{2,2}/g, "%"), r;
}
var of = 2;
function cf(e) {
  if (!e.stack)
    return;
  const t = e.stack.split(`
`);
  t.splice(1, of), e.stack = t.join(`
`);
}
var uf = class extends Error {
  constructor(t, ...n) {
    super(t), this.message = t, this.name = "Invariant Violation", this.message = qn(t, ...n), cf(this);
  }
}, Ke = (e, t, ...n) => {
  if (!e)
    throw new uf(t, ...n);
};
Ke.as = (e, t, n, ...r) => {
  if (!t) {
    const s = r.length === 0 ? n : qn(n, ...r);
    let i;
    try {
      i = Reflect.construct(e, [
        s
      ]);
    } catch {
      i = e(s);
    }
    throw i;
  }
};
const lf = "[MSW]";
function ca(e, ...t) {
  const n = qn(e, ...t);
  return `${lf} ${n}`;
}
function df(e, ...t) {
  console.warn(ca(e, ...t));
}
function ff(e, ...t) {
  console.error(ca(e, ...t));
}
const B = {
  formatMessage: ca,
  warn: df,
  error: ff
};
class to extends Error {
  constructor(t) {
    super(t), this.name = "InternalError";
  }
}
function pf() {
  Ke(
    typeof URL < "u",
    B.formatMessage(
      `Global "URL" class is not defined. This likely means that you're running MSW in an environment that doesn't support all Node.js standard API (e.g. React Native). If that's the case, please use an appropriate polyfill for the "URL" class, like "react-native-url-polyfill".`
    )
  );
}
var hf = class extends Error {
  constructor(t, n, r) {
    super(
      `Possible EventEmitter memory leak detected. ${r} ${n.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`
    ), this.emitter = t, this.type = n, this.count = r, this.name = "MaxListenersExceededWarning";
  }
}, Kc = class {
  static listenerCount(t, n) {
    return t.listenerCount(n);
  }
  constructor() {
    this.events = /* @__PURE__ */ new Map(), this.maxListeners = Kc.defaultMaxListeners, this.hasWarnedAboutPotentialMemoryLeak = !1;
  }
  _emitInternalEvent(t, n, r) {
    this.emit(
      t,
      n,
      r
    );
  }
  _getListeners(t) {
    return Array.prototype.concat.apply([], this.events.get(t)) || [];
  }
  _removeListener(t, n) {
    const r = t.indexOf(n);
    return r > -1 && t.splice(r, 1), [];
  }
  _wrapOnceListener(t, n) {
    const r = (...s) => (this.removeListener(t, r), n.apply(this, s));
    return Object.defineProperty(r, "name", { value: n.name }), r;
  }
  setMaxListeners(t) {
    return this.maxListeners = t, this;
  }
  /**
   * Returns the current max listener value for the `Emitter` which is
   * either set by `emitter.setMaxListeners(n)` or defaults to
   * `Emitter.defaultMaxListeners`.
   */
  getMaxListeners() {
    return this.maxListeners;
  }
  /**
   * Returns an array listing the events for which the emitter has registered listeners.
   * The values in the array will be strings or Symbols.
   */
  eventNames() {
    return Array.from(this.events.keys());
  }
  /**
   * Synchronously calls each of the listeners registered for the event named `eventName`,
   * in the order they were registered, passing the supplied arguments to each.
   * Returns `true` if the event has listeners, `false` otherwise.
   *
   * @example
   * const emitter = new Emitter<{ hello: [string] }>()
   * emitter.emit('hello', 'John')
   */
  emit(t, ...n) {
    const r = this._getListeners(t);
    return r.forEach((s) => {
      s.apply(this, n);
    }), r.length > 0;
  }
  addListener(t, n) {
    this._emitInternalEvent("newListener", t, n);
    const r = this._getListeners(t).concat(n);
    if (this.events.set(t, r), this.maxListeners > 0 && this.listenerCount(t) > this.maxListeners && !this.hasWarnedAboutPotentialMemoryLeak) {
      this.hasWarnedAboutPotentialMemoryLeak = !0;
      const s = new hf(
        this,
        t,
        this.listenerCount(t)
      );
      console.warn(s);
    }
    return this;
  }
  on(t, n) {
    return this.addListener(t, n);
  }
  once(t, n) {
    return this.addListener(
      t,
      this._wrapOnceListener(t, n)
    );
  }
  prependListener(t, n) {
    const r = this._getListeners(t);
    if (r.length > 0) {
      const s = [n].concat(r);
      this.events.set(t, s);
    } else
      this.events.set(t, r.concat(n));
    return this;
  }
  prependOnceListener(t, n) {
    return this.prependListener(
      t,
      this._wrapOnceListener(t, n)
    );
  }
  removeListener(t, n) {
    const r = this._getListeners(t);
    return r.length > 0 && (this._removeListener(r, n), this.events.set(t, r), this._emitInternalEvent("removeListener", t, n)), this;
  }
  /**
   * Alias for `emitter.removeListener()`.
   *
   * @example
   * emitter.off('hello', listener)
   */
  off(t, n) {
    return this.removeListener(t, n);
  }
  removeAllListeners(t) {
    return t ? this.events.delete(t) : this.events.clear(), this;
  }
  /**
   * Returns a copy of the array of listeners for the event named `eventName`.
   */
  listeners(t) {
    return Array.from(this._getListeners(t));
  }
  /**
   * Returns the number of listeners listening to the event named `eventName`.
   */
  listenerCount(t) {
    return this._getListeners(t).length;
  }
  rawListeners(t) {
    return this.listeners(t);
  }
}, ls = Kc;
ls.defaultMaxListeners = 10;
function mf(e, t) {
  const n = e.emit;
  if (n._isPiped)
    return;
  const r = function(i, ...a) {
    return t.emit(i, ...a), n.call(this, i, ...a);
  };
  r._isPiped = !0, e.emit = r;
}
function gf(e) {
  const t = [...e];
  return Object.freeze(t), t;
}
class yf {
  constructor() {
    V(this, "subscriptions", []);
  }
  dispose() {
    let t;
    for (; t = this.subscriptions.shift(); )
      t();
  }
}
class vf {
  constructor(t) {
    V(this, "handlers");
    this.initialHandlers = t, this.handlers = [...t];
  }
  prepend(t) {
    this.handlers.unshift(...t);
  }
  reset(t) {
    this.handlers = t.length > 0 ? [...t] : [...this.initialHandlers];
  }
  currentHandlers() {
    return this.handlers;
  }
}
class bf extends yf {
  constructor(...n) {
    super();
    V(this, "handlersController");
    V(this, "emitter");
    V(this, "publicEmitter");
    V(this, "events");
    Ke(
      this.validateHandlers(n),
      B.formatMessage(
        "Failed to apply given request handlers: invalid input. Did you forget to spread the request handlers Array?"
      )
    ), this.handlersController = new vf(n), this.emitter = new ls(), this.publicEmitter = new ls(), mf(this.emitter, this.publicEmitter), this.events = this.createLifeCycleEvents(), this.subscriptions.push(() => {
      this.emitter.removeAllListeners(), this.publicEmitter.removeAllListeners();
    });
  }
  validateHandlers(n) {
    return n.every((r) => !Array.isArray(r));
  }
  use(...n) {
    Ke(
      this.validateHandlers(n),
      B.formatMessage(
        'Failed to call "use()" with the given request handlers: invalid input. Did you forget to spread the array of request handlers?'
      )
    ), this.handlersController.prepend(n);
  }
  restoreHandlers() {
    this.handlersController.currentHandlers().forEach((n) => {
      "isUsed" in n && (n.isUsed = !1);
    });
  }
  resetHandlers(...n) {
    this.handlersController.reset(n);
  }
  listHandlers() {
    return gf(this.handlersController.currentHandlers());
  }
  createLifeCycleEvents() {
    return {
      on: (...n) => this.publicEmitter.on(...n),
      removeListener: (...n) => this.publicEmitter.removeListener(...n),
      removeAllListeners: (...n) => this.publicEmitter.removeAllListeners(...n)
    };
  }
}
const kf = /[/\\]msw[/\\]src[/\\](.+)/, wf = /(node_modules)?[/\\]lib[/\\](core|browser|node|native|iife)[/\\]|^[^/\\]*$/;
function Tf(e) {
  const t = e.stack;
  if (!t)
    return;
  const r = t.split(`
`).slice(1).find((i) => !(kf.test(i) || wf.test(i)));
  return r ? r.replace(/\s*at [^()]*\(([^)]+)\)/, "$1").replace(/^@/, "") : void 0;
}
function Ef(e) {
  return e ? Reflect.has(e, Symbol.iterator) || Reflect.has(e, Symbol.asyncIterator) : !1;
}
const vr = class vr {
  constructor(t) {
    V(this, "__kind");
    V(this, "info");
    /**
     * Indicates whether this request handler has been used
     * (its resolver has successfully executed).
     */
    V(this, "isUsed");
    V(this, "resolver");
    V(this, "resolverIterator");
    V(this, "resolverIteratorResult");
    V(this, "options");
    this.resolver = t.resolver, this.options = t.options;
    const n = Tf(new Error());
    this.info = {
      ...t.info,
      callFrame: n
    }, this.isUsed = !1, this.__kind = "RequestHandler";
  }
  /**
   * Parse the intercepted request to extract additional information from it.
   * Parsed result is then exposed to other methods of this request handler.
   */
  async parse(t) {
    return {};
  }
  /**
   * Test if this handler matches the given request.
   *
   * This method is not used internally but is exposed
   * as a convenience method for consumers writing custom
   * handlers.
   */
  async test(t) {
    const n = await this.parse({
      request: t.request,
      resolutionContext: t.resolutionContext
    });
    return this.predicate({
      request: t.request,
      parsedResult: n,
      resolutionContext: t.resolutionContext
    });
  }
  extendResolverArgs(t) {
    return {};
  }
  // Clone the request instance before it's passed to the handler phases
  // and the response resolver so we can always read it for logging.
  // We only clone it once per request to avoid unnecessary overhead.
  cloneRequestOrGetFromCache(t) {
    const n = vr.cache.get(t);
    if (typeof n < "u")
      return n;
    const r = t.clone();
    return vr.cache.set(t, r), r;
  }
  /**
   * Execute this request handler and produce a mocked response
   * using the given resolver function.
   */
  async run(t) {
    var l, d;
    if (this.isUsed && ((l = this.options) != null && l.once))
      return null;
    const n = this.cloneRequestOrGetFromCache(t.request), r = await this.parse({
      request: t.request,
      resolutionContext: t.resolutionContext
    });
    if (!await this.predicate({
      request: t.request,
      parsedResult: r,
      resolutionContext: t.resolutionContext
    }) || this.isUsed && ((d = this.options) != null && d.once))
      return null;
    this.isUsed = !0;
    const i = this.wrapResolver(this.resolver), a = this.extendResolverArgs({
      request: t.request,
      parsedResult: r
    }), c = await i({
      ...a,
      requestId: t.requestId,
      request: t.request
    }).catch((p) => {
      if (p instanceof Response)
        return p;
      throw p;
    });
    return this.createExecutionResult({
      // Pass the cloned request to the result so that logging
      // and other consumers could read its body once more.
      request: n,
      requestId: t.requestId,
      response: c,
      parsedResult: r
    });
  }
  wrapResolver(t) {
    return async (n) => {
      var a;
      if (!this.resolverIterator) {
        const o = await t(n);
        if (!Ef(o))
          return o;
        this.resolverIterator = Symbol.iterator in o ? o[Symbol.iterator]() : o[Symbol.asyncIterator]();
      }
      this.isUsed = !1;
      const { done: r, value: s } = await this.resolverIterator.next(), i = await s;
      return i && (this.resolverIteratorResult = i.clone()), r ? (this.isUsed = !0, (a = this.resolverIteratorResult) == null ? void 0 : a.clone()) : i;
    };
  }
  createExecutionResult(t) {
    return {
      handler: this,
      request: t.request,
      requestId: t.requestId,
      response: t.response,
      parsedResult: t.parsedResult
    };
  }
};
V(vr, "cache", /* @__PURE__ */ new WeakMap());
let br = vr;
function If(e, t) {
  return e.toLowerCase() === t.toLowerCase();
}
function eu(e) {
  return e < 300 ? "#69AB32" : e < 400 ? "#F0BB4B" : "#E95F5D";
}
function _t(e) {
  const t = /* @__PURE__ */ new Date(), n = `${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}:${t.getSeconds().toString().padStart(2, "0")}`;
  return e != null && e.milliseconds ? `${n}.${t.getMilliseconds().toString().padStart(3, "0")}` : n;
}
async function tu(e) {
  const n = await e.clone().text();
  return {
    url: new URL(e.url),
    method: e.method,
    headers: Object.fromEntries(e.headers.entries()),
    body: n
  };
}
var xf = Object.create, nu = Object.defineProperty, Sf = Object.getOwnPropertyDescriptor, ru = Object.getOwnPropertyNames, Nf = Object.getPrototypeOf, _f = Object.prototype.hasOwnProperty, su = (e, t) => function() {
  return t || (0, e[ru(e)[0]])((t = { exports: {} }).exports, t), t.exports;
}, Of = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let s of ru(t))
      !_f.call(e, s) && s !== n && nu(e, s, { get: () => t[s], enumerable: !(r = Sf(t, s)) || r.enumerable });
  return e;
}, Df = (e, t, n) => (n = e != null ? xf(Nf(e)) : {}, Of(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  nu(n, "default", { value: e, enumerable: !0 }),
  e
)), Af = su({
  "node_modules/.pnpm/statuses@2.0.2/node_modules/statuses/codes.json"(e, t) {
    t.exports = {
      100: "Continue",
      101: "Switching Protocols",
      102: "Processing",
      103: "Early Hints",
      200: "OK",
      201: "Created",
      202: "Accepted",
      203: "Non-Authoritative Information",
      204: "No Content",
      205: "Reset Content",
      206: "Partial Content",
      207: "Multi-Status",
      208: "Already Reported",
      226: "IM Used",
      300: "Multiple Choices",
      301: "Moved Permanently",
      302: "Found",
      303: "See Other",
      304: "Not Modified",
      305: "Use Proxy",
      307: "Temporary Redirect",
      308: "Permanent Redirect",
      400: "Bad Request",
      401: "Unauthorized",
      402: "Payment Required",
      403: "Forbidden",
      404: "Not Found",
      405: "Method Not Allowed",
      406: "Not Acceptable",
      407: "Proxy Authentication Required",
      408: "Request Timeout",
      409: "Conflict",
      410: "Gone",
      411: "Length Required",
      412: "Precondition Failed",
      413: "Payload Too Large",
      414: "URI Too Long",
      415: "Unsupported Media Type",
      416: "Range Not Satisfiable",
      417: "Expectation Failed",
      418: "I'm a Teapot",
      421: "Misdirected Request",
      422: "Unprocessable Entity",
      423: "Locked",
      424: "Failed Dependency",
      425: "Too Early",
      426: "Upgrade Required",
      428: "Precondition Required",
      429: "Too Many Requests",
      431: "Request Header Fields Too Large",
      451: "Unavailable For Legal Reasons",
      500: "Internal Server Error",
      501: "Not Implemented",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
      505: "HTTP Version Not Supported",
      506: "Variant Also Negotiates",
      507: "Insufficient Storage",
      508: "Loop Detected",
      509: "Bandwidth Limit Exceeded",
      510: "Not Extended",
      511: "Network Authentication Required"
    };
  }
}), Cf = su({
  "node_modules/.pnpm/statuses@2.0.2/node_modules/statuses/index.js"(e, t) {
    var n = Af();
    t.exports = o, o.message = n, o.code = r(n), o.codes = s(n), o.redirect = {
      300: !0,
      301: !0,
      302: !0,
      303: !0,
      305: !0,
      307: !0,
      308: !0
    }, o.empty = {
      204: !0,
      205: !0,
      304: !0
    }, o.retry = {
      502: !0,
      503: !0,
      504: !0
    };
    function r(c) {
      var u = {};
      return Object.keys(c).forEach(function(d) {
        var p = c[d], h = Number(d);
        u[p.toLowerCase()] = h;
      }), u;
    }
    function s(c) {
      return Object.keys(c).map(function(l) {
        return Number(l);
      });
    }
    function i(c) {
      var u = c.toLowerCase();
      if (!Object.prototype.hasOwnProperty.call(o.code, u))
        throw new Error('invalid status message: "' + c + '"');
      return o.code[u];
    }
    function a(c) {
      if (!Object.prototype.hasOwnProperty.call(o.message, c))
        throw new Error("invalid status code: " + c);
      return o.message[c];
    }
    function o(c) {
      if (typeof c == "number")
        return a(c);
      if (typeof c != "string")
        throw new TypeError("code must be a number or string");
      var u = parseInt(c, 10);
      return isNaN(u) ? i(c) : a(u);
    }
  }
}), no = Df(Cf()), iu = no.default || no;
iu.message;
var au = iu;
/*! Bundled license information:

statuses/index.js:
  (*!
   * statuses
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
const { message: Rf } = au;
async function ou(e) {
  const t = e.clone(), n = await t.text(), r = t.status || 200, s = t.statusText || Rf[r] || "OK";
  return {
    status: r,
    statusText: s,
    headers: Object.fromEntries(t.headers.entries()),
    body: n
  };
}
function Lf(e) {
  for (var t = [], n = 0; n < e.length; ) {
    var r = e[n];
    if (r === "*" || r === "+" || r === "?") {
      t.push({ type: "MODIFIER", index: n, value: e[n++] });
      continue;
    }
    if (r === "\\") {
      t.push({ type: "ESCAPED_CHAR", index: n++, value: e[n++] });
      continue;
    }
    if (r === "{") {
      t.push({ type: "OPEN", index: n, value: e[n++] });
      continue;
    }
    if (r === "}") {
      t.push({ type: "CLOSE", index: n, value: e[n++] });
      continue;
    }
    if (r === ":") {
      for (var s = "", i = n + 1; i < e.length; ) {
        var a = e.charCodeAt(i);
        if (
          // `0-9`
          a >= 48 && a <= 57 || // `A-Z`
          a >= 65 && a <= 90 || // `a-z`
          a >= 97 && a <= 122 || // `_`
          a === 95
        ) {
          s += e[i++];
          continue;
        }
        break;
      }
      if (!s)
        throw new TypeError("Missing parameter name at ".concat(n));
      t.push({ type: "NAME", index: n, value: s }), n = i;
      continue;
    }
    if (r === "(") {
      var o = 1, c = "", i = n + 1;
      if (e[i] === "?")
        throw new TypeError('Pattern cannot start with "?" at '.concat(i));
      for (; i < e.length; ) {
        if (e[i] === "\\") {
          c += e[i++] + e[i++];
          continue;
        }
        if (e[i] === ")") {
          if (o--, o === 0) {
            i++;
            break;
          }
        } else if (e[i] === "(" && (o++, e[i + 1] !== "?"))
          throw new TypeError("Capturing groups are not allowed at ".concat(i));
        c += e[i++];
      }
      if (o)
        throw new TypeError("Unbalanced pattern at ".concat(n));
      if (!c)
        throw new TypeError("Missing pattern at ".concat(n));
      t.push({ type: "PATTERN", index: n, value: c }), n = i;
      continue;
    }
    t.push({ type: "CHAR", index: n, value: e[n++] });
  }
  return t.push({ type: "END", index: n, value: "" }), t;
}
function jf(e, t) {
  t === void 0 && (t = {});
  for (var n = Lf(e), r = t.prefixes, s = r === void 0 ? "./" : r, i = t.delimiter, a = i === void 0 ? "/#?" : i, o = [], c = 0, u = 0, l = "", d = function(re) {
    if (u < n.length && n[u].type === re)
      return n[u++].value;
  }, p = function(re) {
    var H = d(re);
    if (H !== void 0)
      return H;
    var X = n[u], xe = X.type, Fe = X.index;
    throw new TypeError("Unexpected ".concat(xe, " at ").concat(Fe, ", expected ").concat(re));
  }, h = function() {
    for (var re = "", H; H = d("CHAR") || d("ESCAPED_CHAR"); )
      re += H;
    return re;
  }, m = function(re) {
    for (var H = 0, X = a; H < X.length; H++) {
      var xe = X[H];
      if (re.indexOf(xe) > -1)
        return !0;
    }
    return !1;
  }, g = function(re) {
    var H = o[o.length - 1], X = re || (H && typeof H == "string" ? H : "");
    if (H && !X)
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(H.name, '"'));
    return !X || m(X) ? "[^".concat(zt(a), "]+?") : "(?:(?!".concat(zt(X), ")[^").concat(zt(a), "])+?");
  }; u < n.length; ) {
    var k = d("CHAR"), E = d("NAME"), I = d("PATTERN");
    if (E || I) {
      var D = k || "";
      s.indexOf(D) === -1 && (l += D, D = ""), l && (o.push(l), l = ""), o.push({
        name: E || c++,
        prefix: D,
        suffix: "",
        pattern: I || g(D),
        modifier: d("MODIFIER") || ""
      });
      continue;
    }
    var C = k || d("ESCAPED_CHAR");
    if (C) {
      l += C;
      continue;
    }
    l && (o.push(l), l = "");
    var ne = d("OPEN");
    if (ne) {
      var D = h(), ue = d("NAME") || "", oe = d("PATTERN") || "", Ie = h();
      p("CLOSE"), o.push({
        name: ue || (oe ? c++ : ""),
        pattern: ue && !oe ? g(D) : oe,
        prefix: D,
        suffix: Ie,
        modifier: d("MODIFIER") || ""
      });
      continue;
    }
    p("END");
  }
  return o;
}
function Pf(e, t) {
  var n = [], r = uu(e, n, t);
  return $f(r, n, t);
}
function $f(e, t, n) {
  n === void 0 && (n = {});
  var r = n.decode, s = r === void 0 ? function(i) {
    return i;
  } : r;
  return function(i) {
    var a = e.exec(i);
    if (!a)
      return !1;
    for (var o = a[0], c = a.index, u = /* @__PURE__ */ Object.create(null), l = function(p) {
      if (a[p] === void 0)
        return "continue";
      var h = t[p - 1];
      h.modifier === "*" || h.modifier === "+" ? u[h.name] = a[p].split(h.prefix + h.suffix).map(function(m) {
        return s(m, h);
      }) : u[h.name] = s(a[p], h);
    }, d = 1; d < a.length; d++)
      l(d);
    return { path: o, index: c, params: u };
  };
}
function zt(e) {
  return e.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function cu(e) {
  return e && e.sensitive ? "" : "i";
}
function Mf(e, t) {
  if (!t)
    return e;
  for (var n = /\((?:\?<(.*?)>)?(?!\?)/g, r = 0, s = n.exec(e.source); s; )
    t.push({
      // Use parenthesized substring match if available, index otherwise
      name: s[1] || r++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    }), s = n.exec(e.source);
  return e;
}
function Ff(e, t, n) {
  var r = e.map(function(s) {
    return uu(s, t, n).source;
  });
  return new RegExp("(?:".concat(r.join("|"), ")"), cu(n));
}
function Uf(e, t, n) {
  return zf(jf(e, n), t, n);
}
function zf(e, t, n) {
  n === void 0 && (n = {});
  for (var r = n.strict, s = r === void 0 ? !1 : r, i = n.start, a = i === void 0 ? !0 : i, o = n.end, c = o === void 0 ? !0 : o, u = n.encode, l = u === void 0 ? function(H) {
    return H;
  } : u, d = n.delimiter, p = d === void 0 ? "/#?" : d, h = n.endsWith, m = h === void 0 ? "" : h, g = "[".concat(zt(m), "]|$"), k = "[".concat(zt(p), "]"), E = a ? "^" : "", I = 0, D = e; I < D.length; I++) {
    var C = D[I];
    if (typeof C == "string")
      E += zt(l(C));
    else {
      var ne = zt(l(C.prefix)), ue = zt(l(C.suffix));
      if (C.pattern)
        if (t && t.push(C), ne || ue)
          if (C.modifier === "+" || C.modifier === "*") {
            var oe = C.modifier === "*" ? "?" : "";
            E += "(?:".concat(ne, "((?:").concat(C.pattern, ")(?:").concat(ue).concat(ne, "(?:").concat(C.pattern, "))*)").concat(ue, ")").concat(oe);
          } else
            E += "(?:".concat(ne, "(").concat(C.pattern, ")").concat(ue, ")").concat(C.modifier);
        else {
          if (C.modifier === "+" || C.modifier === "*")
            throw new TypeError('Can not repeat "'.concat(C.name, '" without a prefix and suffix'));
          E += "(".concat(C.pattern, ")").concat(C.modifier);
        }
      else
        E += "(?:".concat(ne).concat(ue, ")").concat(C.modifier);
    }
  }
  if (c)
    s || (E += "".concat(k, "?")), E += n.endsWith ? "(?=".concat(g, ")") : "$";
  else {
    var Ie = e[e.length - 1], re = typeof Ie == "string" ? k.indexOf(Ie[Ie.length - 1]) > -1 : Ie === void 0;
    s || (E += "(?:".concat(k, "(?=").concat(g, "))?")), re || (E += "(?=".concat(k, "|").concat(g, ")"));
  }
  return new RegExp(E, cu(n));
}
function uu(e, t, n) {
  return e instanceof RegExp ? Mf(e, t) : Array.isArray(e) ? Ff(e, t, n) : Uf(e, t, n);
}
new TextEncoder();
function qf(e) {
  try {
    return new URL(e), !0;
  } catch {
    return !1;
  }
}
function ro(e, t) {
  const r = Object.getOwnPropertySymbols(t).find((s) => s.description === e);
  if (r)
    return Reflect.get(t, r);
}
var Tn = class extends Response {
  static isConfigurableStatusCode(t) {
    return t >= 200 && t <= 599;
  }
  static isRedirectResponse(t) {
    return Tn.STATUS_CODES_WITH_REDIRECT.includes(t);
  }
  /**
   * Returns a boolean indicating whether the given response status
   * code represents a response that can have a body.
   */
  static isResponseWithBody(t) {
    return !Tn.STATUS_CODES_WITHOUT_BODY.includes(t);
  }
  static setUrl(t, n) {
    if (!t || t === "about:" || !qf(t))
      return;
    const r = ro("state", n);
    r ? r.urlList.push(new URL(t)) : Object.defineProperty(n, "url", {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !1
    });
  }
  /**
   * Parses the given raw HTTP headers into a Fetch API `Headers` instance.
   */
  static parseRawHeaders(t) {
    const n = new Headers();
    for (let r = 0; r < t.length; r += 2)
      n.append(t[r], t[r + 1]);
    return n;
  }
  constructor(t, n = {}) {
    var r;
    const s = (r = n.status) != null ? r : 200, i = Tn.isConfigurableStatusCode(s) ? s : 200, a = Tn.isResponseWithBody(s) ? t : null;
    if (super(a, {
      status: i,
      statusText: n.statusText,
      headers: n.headers
    }), s !== i) {
      const o = ro("state", this);
      o ? o.status = s : Object.defineProperty(this, "status", {
        value: s,
        enumerable: !0,
        configurable: !0,
        writable: !1
      });
    }
    Tn.setUrl(n.url, this);
  }
}, ua = Tn;
ua.STATUS_CODES_WITHOUT_BODY = [101, 103, 204, 205, 304];
ua.STATUS_CODES_WITH_REDIRECT = [301, 302, 303, 307, 308];
function lu() {
  if (typeof navigator < "u" && navigator.product === "ReactNative")
    return !0;
  if (typeof process < "u") {
    const e = process.type;
    return e === "renderer" || e === "worker" ? !1 : !!(process.versions && process.versions.node);
  }
  return !1;
}
var Vf = Object.defineProperty, Bf = (e, t) => {
  for (var n in t)
    Vf(e, n, { get: t[n], enumerable: !0 });
}, Ai = {};
Bf(Ai, {
  blue: () => Zf,
  gray: () => Ci,
  green: () => Wf,
  red: () => Gf,
  yellow: () => Hf
});
function Hf(e) {
  return `\x1B[33m${e}\x1B[0m`;
}
function Zf(e) {
  return `\x1B[34m${e}\x1B[0m`;
}
function Ci(e) {
  return `\x1B[90m${e}\x1B[0m`;
}
function Gf(e) {
  return `\x1B[31m${e}\x1B[0m`;
}
function Wf(e) {
  return `\x1B[32m${e}\x1B[0m`;
}
var Ls = lu(), du = class {
  constructor(t) {
    V(this, "prefix");
    this.name = t, this.prefix = `[${this.name}]`;
    const n = so("DEBUG"), r = so("LOG_LEVEL");
    n === "1" || n === "true" || typeof n < "u" && this.name.startsWith(n) ? (this.debug = Wn(r, "debug") ? st : this.debug, this.info = Wn(r, "info") ? st : this.info, this.success = Wn(r, "success") ? st : this.success, this.warning = Wn(r, "warning") ? st : this.warning, this.error = Wn(r, "error") ? st : this.error) : (this.info = st, this.success = st, this.warning = st, this.error = st, this.only = st);
  }
  extend(t) {
    return new du(`${this.name}:${t}`);
  }
  /**
   * Print a debug message.
   * @example
   * logger.debug('no duplicates found, creating a document...')
   */
  debug(t, ...n) {
    this.logEntry({
      level: "debug",
      message: Ci(t),
      positionals: n,
      prefix: this.prefix,
      colors: {
        prefix: "gray"
      }
    });
  }
  /**
   * Print an info message.
   * @example
   * logger.info('start parsing...')
   */
  info(t, ...n) {
    this.logEntry({
      level: "info",
      message: t,
      positionals: n,
      prefix: this.prefix,
      colors: {
        prefix: "blue"
      }
    });
    const r = new Jf();
    return (s, ...i) => {
      r.measure(), this.logEntry({
        level: "info",
        message: `${s} ${Ci(`${r.deltaTime}ms`)}`,
        positionals: i,
        prefix: this.prefix,
        colors: {
          prefix: "blue"
        }
      });
    };
  }
  /**
   * Print a success message.
   * @example
   * logger.success('successfully created document')
   */
  success(t, ...n) {
    this.logEntry({
      level: "info",
      message: t,
      positionals: n,
      prefix: `✔ ${this.prefix}`,
      colors: {
        timestamp: "green",
        prefix: "green"
      }
    });
  }
  /**
   * Print a warning.
   * @example
   * logger.warning('found legacy document format')
   */
  warning(t, ...n) {
    this.logEntry({
      level: "warning",
      message: t,
      positionals: n,
      prefix: `⚠ ${this.prefix}`,
      colors: {
        timestamp: "yellow",
        prefix: "yellow"
      }
    });
  }
  /**
   * Print an error message.
   * @example
   * logger.error('something went wrong')
   */
  error(t, ...n) {
    this.logEntry({
      level: "error",
      message: t,
      positionals: n,
      prefix: `✖ ${this.prefix}`,
      colors: {
        timestamp: "red",
        prefix: "red"
      }
    });
  }
  /**
   * Execute the given callback only when the logging is enabled.
   * This is skipped in its entirety and has no runtime cost otherwise.
   * This executes regardless of the log level.
   * @example
   * logger.only(() => {
   *   logger.info('additional info')
   * })
   */
  only(t) {
    t();
  }
  createEntry(t, n) {
    return {
      timestamp: /* @__PURE__ */ new Date(),
      level: t,
      message: n
    };
  }
  logEntry(t) {
    const {
      level: n,
      message: r,
      prefix: s,
      colors: i,
      positionals: a = []
    } = t, o = this.createEntry(n, r), c = (i == null ? void 0 : i.timestamp) || "gray", u = (i == null ? void 0 : i.prefix) || "gray", l = {
      timestamp: Ai[c],
      prefix: Ai[u]
    };
    this.getWriter(n)(
      [l.timestamp(this.formatTimestamp(o.timestamp))].concat(s != null ? l.prefix(s) : []).concat(io(r)).join(" "),
      ...a.map(io)
    );
  }
  formatTimestamp(t) {
    return `${t.toLocaleTimeString(
      "en-GB"
    )}:${t.getMilliseconds()}`;
  }
  getWriter(t) {
    switch (t) {
      case "debug":
      case "success":
      case "info":
        return Yf;
      case "warning":
        return Qf;
      case "error":
        return Xf;
    }
  }
}, Jf = class {
  constructor() {
    V(this, "startTime");
    V(this, "endTime");
    V(this, "deltaTime");
    this.startTime = performance.now();
  }
  measure() {
    this.endTime = performance.now();
    const t = this.endTime - this.startTime;
    this.deltaTime = t.toFixed(2);
  }
}, st = () => {
};
function Yf(e, ...t) {
  if (Ls) {
    process.stdout.write(qn(e, ...t) + `
`);
    return;
  }
  console.log(e, ...t);
}
function Qf(e, ...t) {
  if (Ls) {
    process.stderr.write(qn(e, ...t) + `
`);
    return;
  }
  console.warn(e, ...t);
}
function Xf(e, ...t) {
  if (Ls) {
    process.stderr.write(qn(e, ...t) + `
`);
    return;
  }
  console.error(e, ...t);
}
function so(e) {
  var t;
  return Ls ? process.env[e] : (t = globalThis[e]) == null ? void 0 : t.toString();
}
function Wn(e, t) {
  return e !== void 0 && e !== t;
}
function io(e) {
  return typeof e > "u" ? "undefined" : e === null ? "null" : typeof e == "string" ? e : typeof e == "object" ? JSON.stringify(e) : e.toString();
}
function ao(e) {
  return (
    // @ts-ignore https://github.com/Microsoft/TypeScript/issues/24587
    globalThis[e] || void 0
  );
}
function Kf(e, t) {
  globalThis[e] = t;
}
function ep(e) {
  delete globalThis[e];
}
var tp = class {
  constructor(t) {
    this.symbol = t, this.readyState = "INACTIVE", this.emitter = new ls(), this.subscriptions = [], this.logger = new du(t.description), this.emitter.setMaxListeners(0), this.logger.info("constructing the interceptor...");
  }
  /**
   * Determine if this interceptor can be applied
   * in the current environment.
   */
  checkEnvironment() {
    return !0;
  }
  /**
   * Apply this interceptor to the current process.
   * Returns an already running interceptor instance if it's present.
   */
  apply() {
    const t = this.logger.extend("apply");
    if (t.info("applying the interceptor..."), this.readyState === "APPLIED") {
      t.info("intercepted already applied!");
      return;
    }
    if (!this.checkEnvironment()) {
      t.info("the interceptor cannot be applied in this environment!");
      return;
    }
    this.readyState = "APPLYING";
    const r = this.getInstance();
    if (r) {
      t.info("found a running instance, reusing..."), this.on = (s, i) => (t.info('proxying the "%s" listener', s), r.emitter.addListener(s, i), this.subscriptions.push(() => {
        r.emitter.removeListener(s, i), t.info('removed proxied "%s" listener!', s);
      }), this), this.readyState = "APPLIED";
      return;
    }
    t.info("no running instance found, setting up a new instance..."), this.setup(), this.setInstance(), this.readyState = "APPLIED";
  }
  /**
   * Setup the module augments and stubs necessary for this interceptor.
   * This method is not run if there's a running interceptor instance
   * to prevent instantiating an interceptor multiple times.
   */
  setup() {
  }
  /**
   * Listen to the interceptor's public events.
   */
  on(t, n) {
    const r = this.logger.extend("on");
    return this.readyState === "DISPOSING" || this.readyState === "DISPOSED" ? (r.info("cannot listen to events, already disposed!"), this) : (r.info('adding "%s" event listener:', t, n), this.emitter.on(t, n), this);
  }
  once(t, n) {
    return this.emitter.once(t, n), this;
  }
  off(t, n) {
    return this.emitter.off(t, n), this;
  }
  removeAllListeners(t) {
    return this.emitter.removeAllListeners(t), this;
  }
  /**
   * Disposes of any side-effects this interceptor has introduced.
   */
  dispose() {
    const t = this.logger.extend("dispose");
    if (this.readyState === "DISPOSED") {
      t.info("cannot dispose, already disposed!");
      return;
    }
    if (t.info("disposing the interceptor..."), this.readyState = "DISPOSING", !this.getInstance()) {
      t.info("no interceptors running, skipping dispose...");
      return;
    }
    if (this.clearInstance(), t.info("global symbol deleted:", ao(this.symbol)), this.subscriptions.length > 0) {
      t.info("disposing of %d subscriptions...", this.subscriptions.length);
      for (const n of this.subscriptions)
        n();
      this.subscriptions = [], t.info("disposed of all subscriptions!", this.subscriptions.length);
    }
    this.emitter.removeAllListeners(), t.info("destroyed the listener!"), this.readyState = "DISPOSED";
  }
  getInstance() {
    var t;
    const n = ao(this.symbol);
    return this.logger.info("retrieved global instance:", (t = n == null ? void 0 : n.constructor) == null ? void 0 : t.name), n;
  }
  setInstance() {
    Kf(this.symbol, this), this.logger.info("set global instance!", this.symbol.description);
  }
  clearInstance() {
    ep(this.symbol), this.logger.info("cleared global instance!", this.symbol.description);
  }
};
function np() {
  return Math.random().toString(16).slice(2);
}
function rp(e, t = !0) {
  return [t && e.origin, e.pathname].filter(Boolean).join("");
}
const sp = /[?|#].*$/g;
function fu(e) {
  return e.endsWith("?") ? e : e.replace(sp, "");
}
function ip(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function ap(e, t) {
  if (ip(e) || e.startsWith("*"))
    return e;
  const n = t || typeof location < "u" && location.href;
  return n ? (
    // Encode and decode the path to preserve escaped characters.
    decodeURI(new URL(encodeURI(e), n).href)
  ) : e;
}
function op(e, t) {
  if (e instanceof RegExp)
    return e;
  const n = ap(e, t);
  return fu(n);
}
function cp(e) {
  return e.replace(
    /([:a-zA-Z_-]*)(\*{1,2})+/g,
    (t, n, r) => {
      const s = "(.*)";
      return n ? n.startsWith(":") ? `${n}${r}` : `${n}${s}` : s;
    }
  ).replace(/([^/])(:)(?=\d+)/, "$1\\$2").replace(/^([^/]+)(:)(?=\/\/)/, "$1\\$2");
}
function pu(e, t, n) {
  const r = op(t, n), s = typeof r == "string" ? cp(r) : r, i = rp(e), a = Pf(s, { decode: decodeURIComponent })(i), o = a && a.params || {};
  return {
    matches: a !== !1,
    params: o
  };
}
function dn(e) {
  if (typeof location > "u")
    return e.toString();
  const t = e instanceof URL ? e : new URL(e);
  return t.origin === location.origin ? t.pathname : t.origin + t.pathname;
}
var up = Object.create, hu = Object.defineProperty, lp = Object.getOwnPropertyDescriptor, mu = Object.getOwnPropertyNames, dp = Object.getPrototypeOf, fp = Object.prototype.hasOwnProperty, pp = (e, t) => function() {
  return t || (0, e[mu(e)[0]])((t = { exports: {} }).exports, t), t.exports;
}, hp = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let s of mu(t))
      !fp.call(e, s) && s !== n && hu(e, s, { get: () => t[s], enumerable: !(r = lp(t, s)) || r.enumerable });
  return e;
}, mp = (e, t, n) => (n = e != null ? up(dp(e)) : {}, hp(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  hu(n, "default", { value: e, enumerable: !0 }),
  e
)), gp = pp({
  "node_modules/.pnpm/cookie@1.0.2/node_modules/cookie/dist/index.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.parse = o, e.serialize = l;
    var t = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/, n = /^[\u0021-\u003A\u003C-\u007E]*$/, r = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i, s = /^[\u0020-\u003A\u003D-\u007E]*$/, i = Object.prototype.toString, a = /* @__PURE__ */ (() => {
      const h = function() {
      };
      return h.prototype = /* @__PURE__ */ Object.create(null), h;
    })();
    function o(h, m) {
      const g = new a(), k = h.length;
      if (k < 2)
        return g;
      const E = (m == null ? void 0 : m.decode) || d;
      let I = 0;
      do {
        const D = h.indexOf("=", I);
        if (D === -1)
          break;
        const C = h.indexOf(";", I), ne = C === -1 ? k : C;
        if (D > ne) {
          I = h.lastIndexOf(";", D - 1) + 1;
          continue;
        }
        const ue = c(h, I, D), oe = u(h, D, ue), Ie = h.slice(ue, oe);
        if (g[Ie] === void 0) {
          let re = c(h, D + 1, ne), H = u(h, ne, re);
          const X = E(h.slice(re, H));
          g[Ie] = X;
        }
        I = ne + 1;
      } while (I < k);
      return g;
    }
    function c(h, m, g) {
      do {
        const k = h.charCodeAt(m);
        if (k !== 32 && k !== 9)
          return m;
      } while (++m < g);
      return g;
    }
    function u(h, m, g) {
      for (; m > g; ) {
        const k = h.charCodeAt(--m);
        if (k !== 32 && k !== 9)
          return m + 1;
      }
      return g;
    }
    function l(h, m, g) {
      const k = (g == null ? void 0 : g.encode) || encodeURIComponent;
      if (!t.test(h))
        throw new TypeError(`argument name is invalid: ${h}`);
      const E = k(m);
      if (!n.test(E))
        throw new TypeError(`argument val is invalid: ${m}`);
      let I = h + "=" + E;
      if (!g)
        return I;
      if (g.maxAge !== void 0) {
        if (!Number.isInteger(g.maxAge))
          throw new TypeError(`option maxAge is invalid: ${g.maxAge}`);
        I += "; Max-Age=" + g.maxAge;
      }
      if (g.domain) {
        if (!r.test(g.domain))
          throw new TypeError(`option domain is invalid: ${g.domain}`);
        I += "; Domain=" + g.domain;
      }
      if (g.path) {
        if (!s.test(g.path))
          throw new TypeError(`option path is invalid: ${g.path}`);
        I += "; Path=" + g.path;
      }
      if (g.expires) {
        if (!p(g.expires) || !Number.isFinite(g.expires.valueOf()))
          throw new TypeError(`option expires is invalid: ${g.expires}`);
        I += "; Expires=" + g.expires.toUTCString();
      }
      if (g.httpOnly && (I += "; HttpOnly"), g.secure && (I += "; Secure"), g.partitioned && (I += "; Partitioned"), g.priority)
        switch (typeof g.priority == "string" ? g.priority.toLowerCase() : void 0) {
          case "low":
            I += "; Priority=Low";
            break;
          case "medium":
            I += "; Priority=Medium";
            break;
          case "high":
            I += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${g.priority}`);
        }
      if (g.sameSite)
        switch (typeof g.sameSite == "string" ? g.sameSite.toLowerCase() : g.sameSite) {
          case !0:
          case "strict":
            I += "; SameSite=Strict";
            break;
          case "lax":
            I += "; SameSite=Lax";
            break;
          case "none":
            I += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${g.sameSite}`);
        }
      return I;
    }
    function d(h) {
      if (h.indexOf("%") === -1)
        return h;
      try {
        return decodeURIComponent(h);
      } catch {
        return h;
      }
    }
    function p(h) {
      return i.call(h) === "[object Date]";
    }
  }
}), oo = mp(gp()), gu = oo.default || oo, yp = gu.parse, vp = gu.serialize;
function bp(e, t) {
  return e.endsWith(t) ? e.length === t.length || e[e.length - t.length - 1] === "." : !1;
}
function kp(e, t) {
  const n = e.length - t.length - 2, r = e.lastIndexOf(".", n);
  return r === -1 ? e : e.slice(r + 1);
}
function wp(e, t, n) {
  if (n.validHosts !== null) {
    const s = n.validHosts;
    for (const i of s)
      if (
        /*@__INLINE__*/
        bp(t, i)
      )
        return i;
  }
  let r = 0;
  if (t.startsWith("."))
    for (; r < t.length && t[r] === "."; )
      r += 1;
  return e.length === t.length - r ? null : (
    /*@__INLINE__*/
    kp(t, e)
  );
}
function co(e, t) {
  let n = 0, r = e.length, s = !1;
  if (!t) {
    if (e.startsWith("data:"))
      return null;
    for (; n < e.length && e.charCodeAt(n) <= 32; )
      n += 1;
    for (; r > n + 1 && e.charCodeAt(r - 1) <= 32; )
      r -= 1;
    if (e.charCodeAt(n) === 47 && e.charCodeAt(n + 1) === 47)
      n += 2;
    else {
      const u = e.indexOf(":/", n);
      if (u !== -1) {
        const l = u - n, d = e.charCodeAt(n), p = e.charCodeAt(n + 1), h = e.charCodeAt(n + 2), m = e.charCodeAt(n + 3), g = e.charCodeAt(n + 4);
        if (!(l === 5 && d === 104 && p === 116 && h === 116 && m === 112 && g === 115)) {
          if (!(l === 4 && d === 104 && p === 116 && h === 116 && m === 112)) {
            if (!(l === 3 && d === 119 && p === 115 && h === 115)) {
              if (!(l === 2 && d === 119 && p === 115)) for (let k = n; k < u; k += 1) {
                const E = e.charCodeAt(k) | 32;
                if (!(E >= 97 && E <= 122 || // [a, z]
                E >= 48 && E <= 57 || // [0, 9]
                E === 46 || // '.'
                E === 45 || // '-'
                E === 43))
                  return null;
              }
            }
          }
        }
        for (n = u + 2; e.charCodeAt(n) === 47; )
          n += 1;
      }
    }
    let a = -1, o = -1, c = -1;
    for (let u = n; u < r; u += 1) {
      const l = e.charCodeAt(u);
      if (l === 35 || // '#'
      l === 47 || // '/'
      l === 63) {
        r = u;
        break;
      } else l === 64 ? a = u : l === 93 ? o = u : l === 58 ? c = u : l >= 65 && l <= 90 && (s = !0);
    }
    if (a !== -1 && a > n && a < r && (n = a + 1), e.charCodeAt(n) === 91)
      return o !== -1 ? e.slice(n + 1, o).toLowerCase() : null;
    c !== -1 && c > n && c < r && (r = c);
  }
  for (; r > n + 1 && e.charCodeAt(r - 1) === 46; )
    r -= 1;
  const i = n !== 0 || r !== e.length ? e.slice(n, r) : e;
  return s ? i.toLowerCase() : i;
}
function Tp(e) {
  if (e.length < 7 || e.length > 15)
    return !1;
  let t = 0;
  for (let n = 0; n < e.length; n += 1) {
    const r = e.charCodeAt(n);
    if (r === 46)
      t += 1;
    else if (r < 48 || r > 57)
      return !1;
  }
  return t === 3 && e.charCodeAt(0) !== 46 && e.charCodeAt(e.length - 1) !== 46;
}
function Ep(e) {
  if (e.length < 3)
    return !1;
  let t = e.startsWith("[") ? 1 : 0, n = e.length;
  if (e[n - 1] === "]" && (n -= 1), n - t > 39)
    return !1;
  let r = !1;
  for (; t < n; t += 1) {
    const s = e.charCodeAt(t);
    if (s === 58)
      r = !0;
    else if (!(s >= 48 && s <= 57 || // 0-9
    s >= 97 && s <= 102 || // a-f
    s >= 65 && s <= 90))
      return !1;
  }
  return r;
}
function Ip(e) {
  return Ep(e) || Tp(e);
}
function uo(e) {
  return e >= 97 && e <= 122 || e >= 48 && e <= 57 || e > 127;
}
function lo(e) {
  if (e.length > 255 || e.length === 0 || /*@__INLINE__*/
  !uo(e.charCodeAt(0)) && e.charCodeAt(0) !== 46 && // '.' (dot)
  e.charCodeAt(0) !== 95)
    return !1;
  let t = -1, n = -1;
  const r = e.length;
  for (let s = 0; s < r; s += 1) {
    const i = e.charCodeAt(s);
    if (i === 46) {
      if (
        // Check that previous label is < 63 bytes long (64 = 63 + '.')
        s - t > 64 || // Check that previous character was not already a '.'
        n === 46 || // Check that the previous label does not end with a '-' (dash)
        n === 45 || // Check that the previous label does not end with a '_' (underscore)
        n === 95
      )
        return !1;
      t = s;
    } else if (!/*@__INLINE__*/
    (uo(i) || i === 45 || i === 95))
      return !1;
    n = i;
  }
  return (
    // Check that last label is shorter than 63 chars
    r - t - 1 <= 63 && // Check that the last character is an allowed trailing label character.
    // Since we already checked that the char is a valid hostname character,
    // we only need to check that it's different from '-'.
    n !== 45
  );
}
function yu({ allowIcannDomains: e = !0, allowPrivateDomains: t = !1, detectIp: n = !0, extractHostname: r = !0, mixedInputs: s = !0, validHosts: i = null, validateHostname: a = !0 }) {
  return {
    allowIcannDomains: e,
    allowPrivateDomains: t,
    detectIp: n,
    extractHostname: r,
    mixedInputs: s,
    validHosts: i,
    validateHostname: a
  };
}
const xp = (
  /*@__INLINE__*/
  yu({})
);
function Sp(e) {
  return e === void 0 ? xp : (
    /*@__INLINE__*/
    yu(e)
  );
}
function Np() {
  return {
    domain: null,
    domainWithoutSuffix: null,
    hostname: null,
    isIcann: null,
    isIp: null,
    isPrivate: null,
    publicSuffix: null,
    subdomain: null
  };
}
function _p(e) {
  e.domain = null, e.domainWithoutSuffix = null, e.hostname = null, e.isIcann = null, e.isIp = null, e.isPrivate = null, e.publicSuffix = null, e.subdomain = null;
}
function Op(e, t, n, r, s) {
  const i = (
    /*@__INLINE__*/
    Sp(r)
  );
  return typeof e != "string" || (i.extractHostname ? i.mixedInputs ? s.hostname = co(e, lo(e)) : s.hostname = co(e, !1) : s.hostname = e, i.detectIp && s.hostname !== null && (s.isIp = Ip(s.hostname), s.isIp)) ? s : i.validateHostname && i.extractHostname && s.hostname !== null && !lo(s.hostname) ? (s.hostname = null, s) : (s.hostname === null || (n(s.hostname, i, s), s.publicSuffix === null) || (s.domain = wp(s.publicSuffix, s.hostname, i)), s);
}
function Dp(e, t, n) {
  if (!t.allowPrivateDomains && e.length > 3) {
    const r = e.length - 1, s = e.charCodeAt(r), i = e.charCodeAt(r - 1), a = e.charCodeAt(r - 2), o = e.charCodeAt(r - 3);
    if (s === 109 && i === 111 && a === 99 && o === 46)
      return n.isIcann = !0, n.isPrivate = !1, n.publicSuffix = "com", !0;
    if (s === 103 && i === 114 && a === 111 && o === 46)
      return n.isIcann = !0, n.isPrivate = !1, n.publicSuffix = "org", !0;
    if (s === 117 && i === 100 && a === 101 && o === 46)
      return n.isIcann = !0, n.isPrivate = !1, n.publicSuffix = "edu", !0;
    if (s === 118 && i === 111 && a === 103 && o === 46)
      return n.isIcann = !0, n.isPrivate = !1, n.publicSuffix = "gov", !0;
    if (s === 116 && i === 101 && a === 110 && o === 46)
      return n.isIcann = !0, n.isPrivate = !1, n.publicSuffix = "net", !0;
    if (s === 101 && i === 100 && a === 46)
      return n.isIcann = !0, n.isPrivate = !1, n.publicSuffix = "de", !0;
  }
  return !1;
}
const Ap = /* @__PURE__ */ function() {
  const e = [1, {}], t = [0, { city: e }];
  return [0, { ck: [0, { www: e }], jp: [0, { kawasaki: t, kitakyushu: t, kobe: t, nagoya: t, sapporo: t, sendai: t, yokohama: t }] }];
}(), Cp = /* @__PURE__ */ function() {
  const e = [1, {}], t = [2, {}], n = [1, { com: e, edu: e, gov: e, net: e, org: e }], r = [1, { com: e, edu: e, gov: e, mil: e, net: e, org: e }], s = [0, { "*": t }], i = [2, { s }], a = [0, { relay: t }], o = [2, { id: t }], c = [1, { gov: e }], u = [2, { vps: t }], l = [0, { airflow: s, "transfer-webapp": t }], d = [0, { "transfer-webapp": t, "transfer-webapp-fips": t }], p = [0, { notebook: t, studio: t }], h = [0, { labeling: t, notebook: t, studio: t }], m = [0, { notebook: t }], g = [0, { labeling: t, notebook: t, "notebook-fips": t, studio: t }], k = [0, { notebook: t, "notebook-fips": t, studio: t, "studio-fips": t }], E = [0, { shop: t }], I = [0, { "*": e }], D = [1, { co: t }], C = [0, { objects: t }], ne = [2, { nodes: t }], ue = [0, { my: t }], oe = [0, { s3: t, "s3-accesspoint": t, "s3-website": t }], Ie = [0, { s3: t, "s3-accesspoint": t }], re = [0, { direct: t }], H = [0, { "webview-assets": t }], X = [0, { vfs: t, "webview-assets": t }], xe = [0, { "execute-api": t, "emrappui-prod": t, "emrnotebooks-prod": t, "emrstudio-prod": t, dualstack: oe, s3: t, "s3-accesspoint": t, "s3-object-lambda": t, "s3-website": t, "aws-cloud9": H, cloud9: X }], Fe = [0, { "execute-api": t, "emrappui-prod": t, "emrnotebooks-prod": t, "emrstudio-prod": t, dualstack: Ie, s3: t, "s3-accesspoint": t, "s3-object-lambda": t, "s3-website": t, "aws-cloud9": H, cloud9: X }], Dt = [0, { "execute-api": t, "emrappui-prod": t, "emrnotebooks-prod": t, "emrstudio-prod": t, dualstack: oe, s3: t, "s3-accesspoint": t, "s3-object-lambda": t, "s3-website": t, "analytics-gateway": t, "aws-cloud9": H, cloud9: X }], We = [0, { "execute-api": t, "emrappui-prod": t, "emrnotebooks-prod": t, "emrstudio-prod": t, dualstack: oe, s3: t, "s3-accesspoint": t, "s3-object-lambda": t, "s3-website": t }], Wt = [0, { s3: t, "s3-accesspoint": t, "s3-accesspoint-fips": t, "s3-fips": t, "s3-website": t }], Bn = [0, { "execute-api": t, "emrappui-prod": t, "emrnotebooks-prod": t, "emrstudio-prod": t, dualstack: Wt, s3: t, "s3-accesspoint": t, "s3-accesspoint-fips": t, "s3-fips": t, "s3-object-lambda": t, "s3-website": t, "aws-cloud9": H, cloud9: X }], Hn = [0, { "execute-api": t, "emrappui-prod": t, "emrnotebooks-prod": t, "emrstudio-prod": t, dualstack: Wt, s3: t, "s3-accesspoint": t, "s3-accesspoint-fips": t, "s3-deprecated": t, "s3-fips": t, "s3-object-lambda": t, "s3-website": t, "analytics-gateway": t, "aws-cloud9": H, cloud9: X }], mn = [0, { s3: t, "s3-accesspoint": t, "s3-accesspoint-fips": t, "s3-fips": t }], Zn = [0, { "execute-api": t, "emrappui-prod": t, "emrnotebooks-prod": t, "emrstudio-prod": t, dualstack: mn, s3: t, "s3-accesspoint": t, "s3-accesspoint-fips": t, "s3-fips": t, "s3-object-lambda": t, "s3-website": t }], Z = [0, { auth: t }], y = [0, { auth: t, "auth-fips": t }], S = [0, { "auth-fips": t }], x = [0, { apps: t }], N = [0, { paas: t }], J = [2, { eu: t }], K = [0, { app: t }], Y = [0, { site: t }], Je = [1, { com: e, edu: e, net: e, org: e }], Jt = [0, { j: t }], gn = [0, { dyn: t }], Se = [2, { web: t }], Ha = [1, { co: e, com: e, edu: e, gov: e, net: e, org: e }], Za = [0, { p: t }], Ga = [0, { user: t }], Gn = [0, { cdn: t }], Wa = [2, { raw: s }], ni = [0, { cust: t, reservd: t }], Ja = [0, { cust: t }], ri = [0, { s3: t }], Ya = [1, { biz: e, com: e, edu: e, gov: e, info: e, net: e, org: e }], si = [0, { ipfs: t }], Fr = [1, { framer: t }], Qa = [0, { forgot: t }], ae = [1, { gs: e }], Xa = [0, { nes: e }], R = [1, { k12: e, cc: e, lib: e }], Ka = [1, { cc: e }], Ur = [1, { cc: e, lib: e }];
  return [0, { ac: [1, { com: e, edu: e, gov: e, mil: e, net: e, org: e, drr: t, feedback: t, forms: t }], ad: e, ae: [1, { ac: e, co: e, gov: e, mil: e, net: e, org: e, sch: e }], aero: [1, { airline: e, airport: e, "accident-investigation": e, "accident-prevention": e, aerobatic: e, aeroclub: e, aerodrome: e, agents: e, "air-surveillance": e, "air-traffic-control": e, aircraft: e, airtraffic: e, ambulance: e, association: e, author: e, ballooning: e, broker: e, caa: e, cargo: e, catering: e, certification: e, championship: e, charter: e, civilaviation: e, club: e, conference: e, consultant: e, consulting: e, control: e, council: e, crew: e, design: e, dgca: e, educator: e, emergency: e, engine: e, engineer: e, entertainment: e, equipment: e, exchange: e, express: e, federation: e, flight: e, freight: e, fuel: e, gliding: e, government: e, groundhandling: e, group: e, hanggliding: e, homebuilt: e, insurance: e, journal: e, journalist: e, leasing: e, logistics: e, magazine: e, maintenance: e, marketplace: e, media: e, microlight: e, modelling: e, navigation: e, parachuting: e, paragliding: e, "passenger-association": e, pilot: e, press: e, production: e, recreation: e, repbody: e, res: e, research: e, rotorcraft: e, safety: e, scientist: e, services: e, show: e, skydiving: e, software: e, student: e, taxi: e, trader: e, trading: e, trainer: e, union: e, workinggroup: e, works: e }], af: n, ag: [1, { co: e, com: e, net: e, nom: e, org: e, obj: t }], ai: [1, { com: e, net: e, off: e, org: e, uwu: t, framer: t }], al: r, am: [1, { co: e, com: e, commune: e, net: e, org: e, radio: t }], ao: [1, { co: e, ed: e, edu: e, gov: e, gv: e, it: e, og: e, org: e, pb: e }], aq: e, ar: [1, { bet: e, com: e, coop: e, edu: e, gob: e, gov: e, int: e, mil: e, musica: e, mutual: e, net: e, org: e, seg: e, senasa: e, tur: e }], arpa: [1, { e164: e, home: e, "in-addr": e, ip6: e, iris: e, uri: e, urn: e }], as: c, asia: [1, { cloudns: t, daemon: t, dix: t }], at: [1, { 4: t, ac: [1, { sth: e }], co: e, gv: e, or: e, funkfeuer: [0, { wien: t }], futurecms: [0, { "*": t, ex: s, in: s }], futurehosting: t, futuremailing: t, ortsinfo: [0, { ex: s, kunden: s }], biz: t, info: t, "123webseite": t, priv: t, my: t, myspreadshop: t, "12hp": t, "2ix": t, "4lima": t, "lima-city": t }], au: [1, { asn: e, com: [1, { cloudlets: [0, { mel: t }], myspreadshop: t }], edu: [1, { act: e, catholic: e, nsw: e, nt: e, qld: e, sa: e, tas: e, vic: e, wa: e }], gov: [1, { qld: e, sa: e, tas: e, vic: e, wa: e }], id: e, net: e, org: e, conf: e, oz: e, act: e, nsw: e, nt: e, qld: e, sa: e, tas: e, vic: e, wa: e, hrsn: u }], aw: [1, { com: e }], ax: e, az: [1, { biz: e, co: e, com: e, edu: e, gov: e, info: e, int: e, mil: e, name: e, net: e, org: e, pp: e, pro: e }], ba: [1, { com: e, edu: e, gov: e, mil: e, net: e, org: e, brendly: E, rs: t }], bb: [1, { biz: e, co: e, com: e, edu: e, gov: e, info: e, net: e, org: e, store: e, tv: e }], bd: I, be: [1, { ac: e, cloudns: t, webhosting: t, interhostsolutions: [0, { cloud: t }], kuleuven: [0, { ezproxy: t }], "123website": t, myspreadshop: t, transurl: s }], bf: c, bg: [1, { 0: e, 1: e, 2: e, 3: e, 4: e, 5: e, 6: e, 7: e, 8: e, 9: e, a: e, b: e, c: e, d: e, e, f: e, g: e, h: e, i: e, j: e, k: e, l: e, m: e, n: e, o: e, p: e, q: e, r: e, s: e, t: e, u: e, v: e, w: e, x: e, y: e, z: e, barsy: t }], bh: n, bi: [1, { co: e, com: e, edu: e, or: e, org: e }], biz: [1, { activetrail: t, "cloud-ip": t, cloudns: t, jozi: t, dyndns: t, "for-better": t, "for-more": t, "for-some": t, "for-the": t, selfip: t, webhop: t, orx: t, mmafan: t, myftp: t, "no-ip": t, dscloud: t }], bj: [1, { africa: e, agro: e, architectes: e, assur: e, avocats: e, co: e, com: e, eco: e, econo: e, edu: e, info: e, loisirs: e, money: e, net: e, org: e, ote: e, restaurant: e, resto: e, tourism: e, univ: e }], bm: n, bn: [1, { com: e, edu: e, gov: e, net: e, org: e, co: t }], bo: [1, { com: e, edu: e, gob: e, int: e, mil: e, net: e, org: e, tv: e, web: e, academia: e, agro: e, arte: e, blog: e, bolivia: e, ciencia: e, cooperativa: e, democracia: e, deporte: e, ecologia: e, economia: e, empresa: e, indigena: e, industria: e, info: e, medicina: e, movimiento: e, musica: e, natural: e, nombre: e, noticias: e, patria: e, plurinacional: e, politica: e, profesional: e, pueblo: e, revista: e, salud: e, tecnologia: e, tksat: e, transporte: e, wiki: e }], br: [1, { "9guacu": e, abc: e, adm: e, adv: e, agr: e, aju: e, am: e, anani: e, aparecida: e, api: e, app: e, arq: e, art: e, ato: e, b: e, barueri: e, belem: e, bet: e, bhz: e, bib: e, bio: e, blog: e, bmd: e, boavista: e, bsb: e, campinagrande: e, campinas: e, caxias: e, cim: e, cng: e, cnt: e, com: [1, { simplesite: t }], contagem: e, coop: e, coz: e, cri: e, cuiaba: e, curitiba: e, def: e, des: e, det: e, dev: e, ecn: e, eco: e, edu: e, emp: e, enf: e, eng: e, esp: e, etc: e, eti: e, far: e, feira: e, flog: e, floripa: e, fm: e, fnd: e, fortal: e, fot: e, foz: e, fst: e, g12: e, geo: e, ggf: e, goiania: e, gov: [1, { ac: e, al: e, am: e, ap: e, ba: e, ce: e, df: e, es: e, go: e, ma: e, mg: e, ms: e, mt: e, pa: e, pb: e, pe: e, pi: e, pr: e, rj: e, rn: e, ro: e, rr: e, rs: e, sc: e, se: e, sp: e, to: e }], gru: e, ia: e, imb: e, ind: e, inf: e, jab: e, jampa: e, jdf: e, joinville: e, jor: e, jus: e, leg: [1, { ac: t, al: t, am: t, ap: t, ba: t, ce: t, df: t, es: t, go: t, ma: t, mg: t, ms: t, mt: t, pa: t, pb: t, pe: t, pi: t, pr: t, rj: t, rn: t, ro: t, rr: t, rs: t, sc: t, se: t, sp: t, to: t }], leilao: e, lel: e, log: e, londrina: e, macapa: e, maceio: e, manaus: e, maringa: e, mat: e, med: e, mil: e, morena: e, mp: e, mus: e, natal: e, net: e, niteroi: e, nom: I, not: e, ntr: e, odo: e, ong: e, org: e, osasco: e, palmas: e, poa: e, ppg: e, pro: e, psc: e, psi: e, pvh: e, qsl: e, radio: e, rec: e, recife: e, rep: e, ribeirao: e, rio: e, riobranco: e, riopreto: e, salvador: e, sampa: e, santamaria: e, santoandre: e, saobernardo: e, saogonca: e, seg: e, sjc: e, slg: e, slz: e, social: e, sorocaba: e, srv: e, taxi: e, tc: e, tec: e, teo: e, the: e, tmp: e, trd: e, tur: e, tv: e, udi: e, vet: e, vix: e, vlog: e, wiki: e, xyz: e, zlg: e, tche: t }], bs: [1, { com: e, edu: e, gov: e, net: e, org: e, we: t }], bt: n, bv: e, bw: [1, { ac: e, co: e, gov: e, net: e, org: e }], by: [1, { gov: e, mil: e, com: e, of: e, mediatech: t }], bz: [1, { co: e, com: e, edu: e, gov: e, net: e, org: e, za: t, mydns: t, gsj: t }], ca: [1, { ab: e, bc: e, mb: e, nb: e, nf: e, nl: e, ns: e, nt: e, nu: e, on: e, pe: e, qc: e, sk: e, yk: e, gc: e, barsy: t, awdev: s, co: t, "no-ip": t, onid: t, myspreadshop: t, box: t }], cat: e, cc: [1, { cleverapps: t, "cloud-ip": t, cloudns: t, ftpaccess: t, "game-server": t, myphotos: t, scrapping: t, twmail: t, csx: t, fantasyleague: t, spawn: [0, { instances: t }] }], cd: c, cf: e, cg: e, ch: [1, { square7: t, cloudns: t, cloudscale: [0, { cust: t, lpg: C, rma: C }], objectstorage: [0, { lpg: t, rma: t }], flow: [0, { ae: [0, { alp1: t }], appengine: t }], "linkyard-cloud": t, gotdns: t, dnsking: t, "123website": t, myspreadshop: t, firenet: [0, { "*": t, svc: s }], "12hp": t, "2ix": t, "4lima": t, "lima-city": t }], ci: [1, { ac: e, "xn--aroport-bya": e, aéroport: e, asso: e, co: e, com: e, ed: e, edu: e, go: e, gouv: e, int: e, net: e, or: e, org: e }], ck: I, cl: [1, { co: e, gob: e, gov: e, mil: e, cloudns: t }], cm: [1, { co: e, com: e, gov: e, net: e }], cn: [1, { ac: e, com: [1, { amazonaws: [0, { "cn-north-1": [0, { "execute-api": t, "emrappui-prod": t, "emrnotebooks-prod": t, "emrstudio-prod": t, dualstack: oe, s3: t, "s3-accesspoint": t, "s3-deprecated": t, "s3-object-lambda": t, "s3-website": t }], "cn-northwest-1": [0, { "execute-api": t, "emrappui-prod": t, "emrnotebooks-prod": t, "emrstudio-prod": t, dualstack: Ie, s3: t, "s3-accesspoint": t, "s3-object-lambda": t, "s3-website": t }], compute: s, airflow: [0, { "cn-north-1": s, "cn-northwest-1": s }], eb: [0, { "cn-north-1": t, "cn-northwest-1": t }], elb: s }], amazonwebservices: [0, { on: [0, { "cn-north-1": l, "cn-northwest-1": l }] }], sagemaker: [0, { "cn-north-1": p, "cn-northwest-1": p }] }], edu: e, gov: e, mil: e, net: e, org: e, "xn--55qx5d": e, 公司: e, "xn--od0alg": e, 網絡: e, "xn--io0a7i": e, 网络: e, ah: e, bj: e, cq: e, fj: e, gd: e, gs: e, gx: e, gz: e, ha: e, hb: e, he: e, hi: e, hk: e, hl: e, hn: e, jl: e, js: e, jx: e, ln: e, mo: e, nm: e, nx: e, qh: e, sc: e, sd: e, sh: [1, { as: t }], sn: e, sx: e, tj: e, tw: e, xj: e, xz: e, yn: e, zj: e, "canva-apps": t, canvasite: ue, myqnapcloud: t, quickconnect: re }], co: [1, { com: e, edu: e, gov: e, mil: e, net: e, nom: e, org: e, carrd: t, crd: t, otap: s, hidns: t, leadpages: t, lpages: t, mypi: t, xmit: s, firewalledreplit: o, repl: o, supabase: [2, { realtime: t, storage: t }] }], com: [1, { a2hosted: t, cpserver: t, adobeaemcloud: [2, { dev: s }], africa: t, aivencloud: t, alibabacloudcs: t, kasserver: t, amazonaws: [0, { "af-south-1": xe, "ap-east-1": Fe, "ap-northeast-1": Dt, "ap-northeast-2": Dt, "ap-northeast-3": xe, "ap-south-1": Dt, "ap-south-2": We, "ap-southeast-1": Dt, "ap-southeast-2": Dt, "ap-southeast-3": We, "ap-southeast-4": We, "ap-southeast-5": [0, { "execute-api": t, dualstack: oe, s3: t, "s3-accesspoint": t, "s3-deprecated": t, "s3-object-lambda": t, "s3-website": t }], "ca-central-1": Bn, "ca-west-1": [0, { "execute-api": t, "emrappui-prod": t, "emrnotebooks-prod": t, "emrstudio-prod": t, dualstack: Wt, s3: t, "s3-accesspoint": t, "s3-accesspoint-fips": t, "s3-fips": t, "s3-object-lambda": t, "s3-website": t }], "eu-central-1": Dt, "eu-central-2": We, "eu-north-1": Fe, "eu-south-1": xe, "eu-south-2": We, "eu-west-1": [0, { "execute-api": t, "emrappui-prod": t, "emrnotebooks-prod": t, "emrstudio-prod": t, dualstack: oe, s3: t, "s3-accesspoint": t, "s3-deprecated": t, "s3-object-lambda": t, "s3-website": t, "analytics-gateway": t, "aws-cloud9": H, cloud9: X }], "eu-west-2": Fe, "eu-west-3": xe, "il-central-1": [0, { "execute-api": t, "emrappui-prod": t, "emrnotebooks-prod": t, "emrstudio-prod": t, dualstack: oe, s3: t, "s3-accesspoint": t, "s3-object-lambda": t, "s3-website": t, "aws-cloud9": H, cloud9: [0, { vfs: t }] }], "me-central-1": We, "me-south-1": Fe, "sa-east-1": xe, "us-east-1": [2, { "execute-api": t, "emrappui-prod": t, "emrnotebooks-prod": t, "emrstudio-prod": t, dualstack: Wt, s3: t, "s3-accesspoint": t, "s3-accesspoint-fips": t, "s3-deprecated": t, "s3-fips": t, "s3-object-lambda": t, "s3-website": t, "analytics-gateway": t, "aws-cloud9": H, cloud9: X }], "us-east-2": Hn, "us-gov-east-1": Zn, "us-gov-west-1": Zn, "us-west-1": Bn, "us-west-2": Hn, compute: s, "compute-1": s, airflow: [0, { "af-south-1": s, "ap-east-1": s, "ap-northeast-1": s, "ap-northeast-2": s, "ap-northeast-3": s, "ap-south-1": s, "ap-south-2": s, "ap-southeast-1": s, "ap-southeast-2": s, "ap-southeast-3": s, "ap-southeast-4": s, "ap-southeast-5": s, "ca-central-1": s, "ca-west-1": s, "eu-central-1": s, "eu-central-2": s, "eu-north-1": s, "eu-south-1": s, "eu-south-2": s, "eu-west-1": s, "eu-west-2": s, "eu-west-3": s, "il-central-1": s, "me-central-1": s, "me-south-1": s, "sa-east-1": s, "us-east-1": s, "us-east-2": s, "us-west-1": s, "us-west-2": s }], s3: t, "s3-1": t, "s3-ap-east-1": t, "s3-ap-northeast-1": t, "s3-ap-northeast-2": t, "s3-ap-northeast-3": t, "s3-ap-south-1": t, "s3-ap-southeast-1": t, "s3-ap-southeast-2": t, "s3-ca-central-1": t, "s3-eu-central-1": t, "s3-eu-north-1": t, "s3-eu-west-1": t, "s3-eu-west-2": t, "s3-eu-west-3": t, "s3-external-1": t, "s3-fips-us-gov-east-1": t, "s3-fips-us-gov-west-1": t, "s3-global": [0, { accesspoint: [0, { mrap: t }] }], "s3-me-south-1": t, "s3-sa-east-1": t, "s3-us-east-2": t, "s3-us-gov-east-1": t, "s3-us-gov-west-1": t, "s3-us-west-1": t, "s3-us-west-2": t, "s3-website-ap-northeast-1": t, "s3-website-ap-southeast-1": t, "s3-website-ap-southeast-2": t, "s3-website-eu-west-1": t, "s3-website-sa-east-1": t, "s3-website-us-east-1": t, "s3-website-us-gov-west-1": t, "s3-website-us-west-1": t, "s3-website-us-west-2": t, elb: s }], amazoncognito: [0, { "af-south-1": Z, "ap-east-1": Z, "ap-northeast-1": Z, "ap-northeast-2": Z, "ap-northeast-3": Z, "ap-south-1": Z, "ap-south-2": Z, "ap-southeast-1": Z, "ap-southeast-2": Z, "ap-southeast-3": Z, "ap-southeast-4": Z, "ap-southeast-5": Z, "ap-southeast-7": Z, "ca-central-1": Z, "ca-west-1": Z, "eu-central-1": Z, "eu-central-2": Z, "eu-north-1": Z, "eu-south-1": Z, "eu-south-2": Z, "eu-west-1": Z, "eu-west-2": Z, "eu-west-3": Z, "il-central-1": Z, "me-central-1": Z, "me-south-1": Z, "mx-central-1": Z, "sa-east-1": Z, "us-east-1": y, "us-east-2": y, "us-gov-east-1": S, "us-gov-west-1": S, "us-west-1": y, "us-west-2": y }], amplifyapp: t, awsapprunner: s, awsapps: t, elasticbeanstalk: [2, { "af-south-1": t, "ap-east-1": t, "ap-northeast-1": t, "ap-northeast-2": t, "ap-northeast-3": t, "ap-south-1": t, "ap-southeast-1": t, "ap-southeast-2": t, "ap-southeast-3": t, "ca-central-1": t, "eu-central-1": t, "eu-north-1": t, "eu-south-1": t, "eu-west-1": t, "eu-west-2": t, "eu-west-3": t, "il-central-1": t, "me-south-1": t, "sa-east-1": t, "us-east-1": t, "us-east-2": t, "us-gov-east-1": t, "us-gov-west-1": t, "us-west-1": t, "us-west-2": t }], awsglobalaccelerator: t, siiites: t, appspacehosted: t, appspaceusercontent: t, "on-aptible": t, myasustor: t, "balena-devices": t, boutir: t, bplaced: t, cafjs: t, "canva-apps": t, "rice-labs": t, "cdn77-storage": t, br: t, cn: t, de: t, eu: t, jpn: t, mex: t, ru: t, sa: t, uk: t, us: t, za: t, "clever-cloud": [0, { services: s }], abrdns: t, dnsabr: t, "ip-ddns": t, jdevcloud: t, wpdevcloud: t, "cf-ipfs": t, "cloudflare-ipfs": t, trycloudflare: t, co: t, devinapps: s, builtwithdark: t, datadetect: [0, { demo: t, instance: t }], dattolocal: t, dattorelay: t, dattoweb: t, mydatto: t, digitaloceanspaces: s, discordsays: t, discordsez: t, drayddns: t, dreamhosters: t, durumis: t, blogdns: t, cechire: t, dnsalias: t, dnsdojo: t, doesntexist: t, dontexist: t, doomdns: t, "dyn-o-saur": t, dynalias: t, "dyndns-at-home": t, "dyndns-at-work": t, "dyndns-blog": t, "dyndns-free": t, "dyndns-home": t, "dyndns-ip": t, "dyndns-mail": t, "dyndns-office": t, "dyndns-pics": t, "dyndns-remote": t, "dyndns-server": t, "dyndns-web": t, "dyndns-wiki": t, "dyndns-work": t, "est-a-la-maison": t, "est-a-la-masion": t, "est-le-patron": t, "est-mon-blogueur": t, "from-ak": t, "from-al": t, "from-ar": t, "from-ca": t, "from-ct": t, "from-dc": t, "from-de": t, "from-fl": t, "from-ga": t, "from-hi": t, "from-ia": t, "from-id": t, "from-il": t, "from-in": t, "from-ks": t, "from-ky": t, "from-ma": t, "from-md": t, "from-mi": t, "from-mn": t, "from-mo": t, "from-ms": t, "from-mt": t, "from-nc": t, "from-nd": t, "from-ne": t, "from-nh": t, "from-nj": t, "from-nm": t, "from-nv": t, "from-oh": t, "from-ok": t, "from-or": t, "from-pa": t, "from-pr": t, "from-ri": t, "from-sc": t, "from-sd": t, "from-tn": t, "from-tx": t, "from-ut": t, "from-va": t, "from-vt": t, "from-wa": t, "from-wi": t, "from-wv": t, "from-wy": t, getmyip: t, gotdns: t, "hobby-site": t, homelinux: t, homeunix: t, iamallama: t, "is-a-anarchist": t, "is-a-blogger": t, "is-a-bookkeeper": t, "is-a-bulls-fan": t, "is-a-caterer": t, "is-a-chef": t, "is-a-conservative": t, "is-a-cpa": t, "is-a-cubicle-slave": t, "is-a-democrat": t, "is-a-designer": t, "is-a-doctor": t, "is-a-financialadvisor": t, "is-a-geek": t, "is-a-green": t, "is-a-guru": t, "is-a-hard-worker": t, "is-a-hunter": t, "is-a-landscaper": t, "is-a-lawyer": t, "is-a-liberal": t, "is-a-libertarian": t, "is-a-llama": t, "is-a-musician": t, "is-a-nascarfan": t, "is-a-nurse": t, "is-a-painter": t, "is-a-personaltrainer": t, "is-a-photographer": t, "is-a-player": t, "is-a-republican": t, "is-a-rockstar": t, "is-a-socialist": t, "is-a-student": t, "is-a-teacher": t, "is-a-techie": t, "is-a-therapist": t, "is-an-accountant": t, "is-an-actor": t, "is-an-actress": t, "is-an-anarchist": t, "is-an-artist": t, "is-an-engineer": t, "is-an-entertainer": t, "is-certified": t, "is-gone": t, "is-into-anime": t, "is-into-cars": t, "is-into-cartoons": t, "is-into-games": t, "is-leet": t, "is-not-certified": t, "is-slick": t, "is-uberleet": t, "is-with-theband": t, "isa-geek": t, "isa-hockeynut": t, issmarterthanyou: t, "likes-pie": t, likescandy: t, "neat-url": t, "saves-the-whales": t, selfip: t, "sells-for-less": t, "sells-for-u": t, servebbs: t, "simple-url": t, "space-to-rent": t, "teaches-yoga": t, writesthisblog: t, ddnsfree: t, ddnsgeek: t, giize: t, gleeze: t, kozow: t, loseyourip: t, ooguy: t, theworkpc: t, mytuleap: t, "tuleap-partners": t, encoreapi: t, evennode: [0, { "eu-1": t, "eu-2": t, "eu-3": t, "eu-4": t, "us-1": t, "us-2": t, "us-3": t, "us-4": t }], onfabrica: t, "fastly-edge": t, "fastly-terrarium": t, "fastvps-server": t, mydobiss: t, firebaseapp: t, fldrv: t, forgeblocks: t, framercanvas: t, "freebox-os": t, freeboxos: t, freemyip: t, aliases121: t, gentapps: t, gentlentapis: t, githubusercontent: t, "0emm": s, appspot: [2, { r: s }], blogspot: t, codespot: t, googleapis: t, googlecode: t, pagespeedmobilizer: t, withgoogle: t, withyoutube: t, grayjayleagues: t, hatenablog: t, hatenadiary: t, herokuapp: t, gr: t, smushcdn: t, wphostedmail: t, wpmucdn: t, pixolino: t, "apps-1and1": t, "live-website": t, "webspace-host": t, dopaas: t, "hosted-by-previder": N, hosteur: [0, { "rag-cloud": t, "rag-cloud-ch": t }], "ik-server": [0, { jcloud: t, "jcloud-ver-jpc": t }], jelastic: [0, { demo: t }], massivegrid: N, wafaicloud: [0, { jed: t, ryd: t }], "jote-dr-lt1": t, "jote-rd-lt1": t, webadorsite: t, joyent: [0, { cns: s }], "on-forge": t, "on-vapor": t, lpusercontent: t, linode: [0, { members: t, nodebalancer: s }], linodeobjects: s, linodeusercontent: [0, { ip: t }], localtonet: t, lovableproject: t, barsycenter: t, barsyonline: t, lutrausercontent: s, modelscape: t, mwcloudnonprod: t, polyspace: t, mazeplay: t, miniserver: t, atmeta: t, fbsbx: x, meteorapp: J, routingthecloud: t, "same-app": t, "same-preview": t, mydbserver: t, hostedpi: t, "mythic-beasts": [0, { caracal: t, customer: t, fentiger: t, lynx: t, ocelot: t, oncilla: t, onza: t, sphinx: t, vs: t, x: t, yali: t }], nospamproxy: [0, { cloud: [2, { o365: t }] }], "4u": t, nfshost: t, "3utilities": t, blogsyte: t, ciscofreak: t, damnserver: t, ddnsking: t, ditchyourip: t, dnsiskinky: t, dynns: t, geekgalaxy: t, "health-carereform": t, homesecuritymac: t, homesecuritypc: t, myactivedirectory: t, mysecuritycamera: t, myvnc: t, "net-freaks": t, onthewifi: t, point2this: t, quicksytes: t, securitytactics: t, servebeer: t, servecounterstrike: t, serveexchange: t, serveftp: t, servegame: t, servehalflife: t, servehttp: t, servehumour: t, serveirc: t, servemp3: t, servep2p: t, servepics: t, servequake: t, servesarcasm: t, stufftoread: t, unusualperson: t, workisboring: t, myiphost: t, observableusercontent: [0, { static: t }], simplesite: t, oaiusercontent: s, orsites: t, operaunite: t, "customer-oci": [0, { "*": t, oci: s, ocp: s, ocs: s }], oraclecloudapps: s, oraclegovcloudapps: s, "authgear-staging": t, authgearapps: t, skygearapp: t, outsystemscloud: t, ownprovider: t, pgfog: t, pagexl: t, gotpantheon: t, paywhirl: s, upsunapp: t, "postman-echo": t, prgmr: [0, { xen: t }], "project-study": [0, { dev: t }], pythonanywhere: J, qa2: t, "alpha-myqnapcloud": t, "dev-myqnapcloud": t, mycloudnas: t, mynascloud: t, myqnapcloud: t, qualifioapp: t, ladesk: t, qualyhqpartner: s, qualyhqportal: s, qbuser: t, quipelements: s, rackmaze: t, "readthedocs-hosted": t, rhcloud: t, onrender: t, render: K, "subsc-pay": t, "180r": t, dojin: t, sakuratan: t, sakuraweb: t, x0: t, code: [0, { builder: s, "dev-builder": s, "stg-builder": s }], salesforce: [0, { platform: [0, { "code-builder-stg": [0, { test: [0, { "001": s }] }] }] }], logoip: t, scrysec: t, "firewall-gateway": t, myshopblocks: t, myshopify: t, shopitsite: t, "1kapp": t, appchizi: t, applinzi: t, sinaapp: t, vipsinaapp: t, streamlitapp: t, "try-snowplow": t, "playstation-cloud": t, myspreadshop: t, "w-corp-staticblitz": t, "w-credentialless-staticblitz": t, "w-staticblitz": t, "stackhero-network": t, stdlib: [0, { api: t }], strapiapp: [2, { media: t }], "streak-link": t, streaklinks: t, streakusercontent: t, "temp-dns": t, dsmynas: t, familyds: t, mytabit: t, taveusercontent: t, "tb-hosting": Y, reservd: t, thingdustdata: t, "townnews-staging": t, typeform: [0, { pro: t }], hk: t, it: t, "deus-canvas": t, vultrobjects: s, wafflecell: t, hotelwithflight: t, "reserve-online": t, cprapid: t, pleskns: t, remotewd: t, wiardweb: [0, { pages: t }], wixsite: t, wixstudio: t, messwithdns: t, "woltlab-demo": t, wpenginepowered: [2, { js: t }], xnbay: [2, { u2: t, "u2-local": t }], yolasite: t }], coop: e, cr: [1, { ac: e, co: e, ed: e, fi: e, go: e, or: e, sa: e }], cu: [1, { com: e, edu: e, gob: e, inf: e, nat: e, net: e, org: e }], cv: [1, { com: e, edu: e, id: e, int: e, net: e, nome: e, org: e, publ: e }], cw: Je, cx: [1, { gov: e, cloudns: t, ath: t, info: t, assessments: t, calculators: t, funnels: t, paynow: t, quizzes: t, researched: t, tests: t }], cy: [1, { ac: e, biz: e, com: [1, { scaleforce: Jt }], ekloges: e, gov: e, ltd: e, mil: e, net: e, org: e, press: e, pro: e, tm: e }], cz: [1, { gov: e, contentproxy9: [0, { rsc: t }], realm: t, e4: t, co: t, metacentrum: [0, { cloud: s, custom: t }], muni: [0, { cloud: [0, { flt: t, usr: t }] }] }], de: [1, { bplaced: t, square7: t, com: t, cosidns: gn, dnsupdater: t, "dynamisches-dns": t, "internet-dns": t, "l-o-g-i-n": t, ddnss: [2, { dyn: t, dyndns: t }], "dyn-ip24": t, dyndns1: t, "home-webserver": [2, { dyn: t }], "myhome-server": t, dnshome: t, fuettertdasnetz: t, isteingeek: t, istmein: t, lebtimnetz: t, leitungsen: t, traeumtgerade: t, frusky: s, goip: t, "xn--gnstigbestellen-zvb": t, günstigbestellen: t, "xn--gnstigliefern-wob": t, günstigliefern: t, "hs-heilbronn": [0, { it: [0, { pages: t, "pages-research": t }] }], "dyn-berlin": t, "in-berlin": t, "in-brb": t, "in-butter": t, "in-dsl": t, "in-vpn": t, iservschule: t, "mein-iserv": t, schuldock: t, schulplattform: t, schulserver: t, "test-iserv": t, keymachine: t, co: t, "git-repos": t, "lcube-server": t, "svn-repos": t, barsy: t, webspaceconfig: t, "123webseite": t, rub: t, "ruhr-uni-bochum": [2, { noc: [0, { io: t }] }], logoip: t, "firewall-gateway": t, "my-gateway": t, "my-router": t, spdns: t, my: t, speedpartner: [0, { customer: t }], myspreadshop: t, "taifun-dns": t, "12hp": t, "2ix": t, "4lima": t, "lima-city": t, "dd-dns": t, "dray-dns": t, draydns: t, "dyn-vpn": t, dynvpn: t, "mein-vigor": t, "my-vigor": t, "my-wan": t, "syno-ds": t, "synology-diskstation": t, "synology-ds": t, "virtual-user": t, virtualuser: t, "community-pro": t, diskussionsbereich: t, xenonconnect: s }], dj: e, dk: [1, { biz: t, co: t, firm: t, reg: t, store: t, "123hjemmeside": t, myspreadshop: t }], dm: Ha, do: [1, { art: e, com: e, edu: e, gob: e, gov: e, mil: e, net: e, org: e, sld: e, web: e }], dz: [1, { art: e, asso: e, com: e, edu: e, gov: e, net: e, org: e, pol: e, soc: e, tm: e }], ec: [1, { abg: e, adm: e, agron: e, arqt: e, art: e, bar: e, chef: e, com: e, cont: e, cpa: e, cue: e, dent: e, dgn: e, disco: e, doc: e, edu: e, eng: e, esm: e, fin: e, fot: e, gal: e, gob: e, gov: e, gye: e, ibr: e, info: e, k12: e, lat: e, loj: e, med: e, mil: e, mktg: e, mon: e, net: e, ntr: e, odont: e, org: e, pro: e, prof: e, psic: e, psiq: e, pub: e, rio: e, rrpp: e, sal: e, tech: e, tul: e, tur: e, uio: e, vet: e, xxx: e, base: t, official: t }], edu: [1, { rit: [0, { "git-pages": t }] }], ee: [1, { aip: e, com: e, edu: e, fie: e, gov: e, lib: e, med: e, org: e, pri: e, riik: e }], eg: [1, { ac: e, com: e, edu: e, eun: e, gov: e, info: e, me: e, mil: e, name: e, net: e, org: e, sci: e, sport: e, tv: e }], er: I, es: [1, { com: e, edu: e, gob: e, nom: e, org: e, "123miweb": t, myspreadshop: t }], et: [1, { biz: e, com: e, edu: e, gov: e, info: e, name: e, net: e, org: e }], eu: [1, { cloudns: t, dogado: [0, { jelastic: t }], barsy: t, spdns: t, nxa: s, transurl: s, diskstation: t }], fi: [1, { aland: e, dy: t, "xn--hkkinen-5wa": t, häkkinen: t, iki: t, cloudplatform: [0, { fi: t }], datacenter: [0, { demo: t, paas: t }], kapsi: t, "123kotisivu": t, myspreadshop: t }], fj: [1, { ac: e, biz: e, com: e, gov: e, info: e, mil: e, name: e, net: e, org: e, pro: e }], fk: I, fm: [1, { com: e, edu: e, net: e, org: e, radio: t, user: s }], fo: e, fr: [1, { asso: e, com: e, gouv: e, nom: e, prd: e, tm: e, avoues: e, cci: e, greta: e, "huissier-justice": e, "en-root": t, "fbx-os": t, fbxos: t, "freebox-os": t, freeboxos: t, goupile: t, "123siteweb": t, "on-web": t, "chirurgiens-dentistes-en-france": t, dedibox: t, aeroport: t, avocat: t, chambagri: t, "chirurgiens-dentistes": t, "experts-comptables": t, medecin: t, notaires: t, pharmacien: t, port: t, veterinaire: t, myspreadshop: t, ynh: t }], ga: e, gb: e, gd: [1, { edu: e, gov: e }], ge: [1, { com: e, edu: e, gov: e, net: e, org: e, pvt: e, school: e }], gf: e, gg: [1, { co: e, net: e, org: e, botdash: t, kaas: t, stackit: t, panel: [2, { daemon: t }] }], gh: [1, { biz: e, com: e, edu: e, gov: e, mil: e, net: e, org: e }], gi: [1, { com: e, edu: e, gov: e, ltd: e, mod: e, org: e }], gl: [1, { co: e, com: e, edu: e, net: e, org: e }], gm: e, gn: [1, { ac: e, com: e, edu: e, gov: e, net: e, org: e }], gov: e, gp: [1, { asso: e, com: e, edu: e, mobi: e, net: e, org: e }], gq: e, gr: [1, { com: e, edu: e, gov: e, net: e, org: e, barsy: t, simplesite: t }], gs: e, gt: [1, { com: e, edu: e, gob: e, ind: e, mil: e, net: e, org: e }], gu: [1, { com: e, edu: e, gov: e, guam: e, info: e, net: e, org: e, web: e }], gw: [1, { nx: t }], gy: Ha, hk: [1, { com: e, edu: e, gov: e, idv: e, net: e, org: e, "xn--ciqpn": e, 个人: e, "xn--gmqw5a": e, 個人: e, "xn--55qx5d": e, 公司: e, "xn--mxtq1m": e, 政府: e, "xn--lcvr32d": e, 敎育: e, "xn--wcvs22d": e, 教育: e, "xn--gmq050i": e, 箇人: e, "xn--uc0atv": e, 組織: e, "xn--uc0ay4a": e, 組织: e, "xn--od0alg": e, 網絡: e, "xn--zf0avx": e, 網络: e, "xn--mk0axi": e, 组織: e, "xn--tn0ag": e, 组织: e, "xn--od0aq3b": e, 网絡: e, "xn--io0a7i": e, 网络: e, inc: t, ltd: t }], hm: e, hn: [1, { com: e, edu: e, gob: e, mil: e, net: e, org: e }], hr: [1, { com: e, from: e, iz: e, name: e, brendly: E }], ht: [1, { adult: e, art: e, asso: e, com: e, coop: e, edu: e, firm: e, gouv: e, info: e, med: e, net: e, org: e, perso: e, pol: e, pro: e, rel: e, shop: e, rt: t }], hu: [1, { 2e3: e, agrar: e, bolt: e, casino: e, city: e, co: e, erotica: e, erotika: e, film: e, forum: e, games: e, hotel: e, info: e, ingatlan: e, jogasz: e, konyvelo: e, lakas: e, media: e, news: e, org: e, priv: e, reklam: e, sex: e, shop: e, sport: e, suli: e, szex: e, tm: e, tozsde: e, utazas: e, video: e }], id: [1, { ac: e, biz: e, co: e, desa: e, go: e, kop: e, mil: e, my: e, net: e, or: e, ponpes: e, sch: e, web: e, e: t, zone: t }], ie: [1, { gov: e, myspreadshop: t }], il: [1, { ac: e, co: [1, { ravpage: t, mytabit: t, tabitorder: t }], gov: e, idf: e, k12: e, muni: e, net: e, org: e }], "xn--4dbrk0ce": [1, { "xn--4dbgdty6c": e, "xn--5dbhl8d": e, "xn--8dbq2a": e, "xn--hebda8b": e }], ישראל: [1, { אקדמיה: e, ישוב: e, צהל: e, ממשל: e }], im: [1, { ac: e, co: [1, { ltd: e, plc: e }], com: e, net: e, org: e, tt: e, tv: e }], in: [1, { "5g": e, "6g": e, ac: e, ai: e, am: e, bihar: e, biz: e, business: e, ca: e, cn: e, co: e, com: e, coop: e, cs: e, delhi: e, dr: e, edu: e, er: e, firm: e, gen: e, gov: e, gujarat: e, ind: e, info: e, int: e, internet: e, io: e, me: e, mil: e, net: e, nic: e, org: e, pg: e, post: e, pro: e, res: e, travel: e, tv: e, uk: e, up: e, us: e, cloudns: t, barsy: t, web: t, supabase: t }], info: [1, { cloudns: t, "dynamic-dns": t, "barrel-of-knowledge": t, "barrell-of-knowledge": t, dyndns: t, "for-our": t, "groks-the": t, "groks-this": t, "here-for-more": t, knowsitall: t, selfip: t, webhop: t, barsy: t, mayfirst: t, mittwald: t, mittwaldserver: t, typo3server: t, dvrcam: t, ilovecollege: t, "no-ip": t, forumz: t, nsupdate: t, dnsupdate: t, "v-info": t }], int: [1, { eu: e }], io: [1, { 2038: t, co: e, com: e, edu: e, gov: e, mil: e, net: e, nom: e, org: e, "on-acorn": s, myaddr: t, apigee: t, "b-data": t, beagleboard: t, bitbucket: t, bluebite: t, boxfuse: t, brave: i, browsersafetymark: t, bubble: Gn, bubbleapps: t, bigv: [0, { uk0: t }], cleverapps: t, cloudbeesusercontent: t, dappnode: [0, { dyndns: t }], darklang: t, definima: t, dedyn: t, icp0: Wa, icp1: Wa, qzz: t, "fh-muenster": t, shw: t, forgerock: [0, { id: t }], github: t, gitlab: t, lolipop: t, "hasura-app": t, hostyhosting: t, hypernode: t, moonscale: s, beebyte: N, beebyteapp: [0, { sekd1: t }], jele: t, webthings: t, loginline: t, barsy: t, azurecontainer: s, ngrok: [2, { ap: t, au: t, eu: t, in: t, jp: t, sa: t, us: t }], nodeart: [0, { stage: t }], pantheonsite: t, pstmn: [2, { mock: t }], protonet: t, qcx: [2, { sys: s }], qoto: t, vaporcloud: t, myrdbx: t, "rb-hosting": Y, "on-k3s": s, "on-rio": s, readthedocs: t, resindevice: t, resinstaging: [0, { devices: t }], hzc: t, sandcats: t, scrypted: [0, { client: t }], "mo-siemens": t, lair: x, stolos: s, musician: t, utwente: t, edugit: t, telebit: t, thingdust: [0, { dev: ni, disrec: ni, prod: Ja, testing: ni }], tickets: t, webflow: t, webflowtest: t, editorx: t, wixstudio: t, basicserver: t, virtualserver: t }], iq: r, ir: [1, { ac: e, co: e, gov: e, id: e, net: e, org: e, sch: e, "xn--mgba3a4f16a": e, ایران: e, "xn--mgba3a4fra": e, ايران: e, arvanedge: t, vistablog: t }], is: e, it: [1, { edu: e, gov: e, abr: e, abruzzo: e, "aosta-valley": e, aostavalley: e, bas: e, basilicata: e, cal: e, calabria: e, cam: e, campania: e, "emilia-romagna": e, emiliaromagna: e, emr: e, "friuli-v-giulia": e, "friuli-ve-giulia": e, "friuli-vegiulia": e, "friuli-venezia-giulia": e, "friuli-veneziagiulia": e, "friuli-vgiulia": e, "friuliv-giulia": e, "friulive-giulia": e, friulivegiulia: e, "friulivenezia-giulia": e, friuliveneziagiulia: e, friulivgiulia: e, fvg: e, laz: e, lazio: e, lig: e, liguria: e, lom: e, lombardia: e, lombardy: e, lucania: e, mar: e, marche: e, mol: e, molise: e, piedmont: e, piemonte: e, pmn: e, pug: e, puglia: e, sar: e, sardegna: e, sardinia: e, sic: e, sicilia: e, sicily: e, taa: e, tos: e, toscana: e, "trentin-sud-tirol": e, "xn--trentin-sd-tirol-rzb": e, "trentin-süd-tirol": e, "trentin-sudtirol": e, "xn--trentin-sdtirol-7vb": e, "trentin-südtirol": e, "trentin-sued-tirol": e, "trentin-suedtirol": e, trentino: e, "trentino-a-adige": e, "trentino-aadige": e, "trentino-alto-adige": e, "trentino-altoadige": e, "trentino-s-tirol": e, "trentino-stirol": e, "trentino-sud-tirol": e, "xn--trentino-sd-tirol-c3b": e, "trentino-süd-tirol": e, "trentino-sudtirol": e, "xn--trentino-sdtirol-szb": e, "trentino-südtirol": e, "trentino-sued-tirol": e, "trentino-suedtirol": e, "trentinoa-adige": e, trentinoaadige: e, "trentinoalto-adige": e, trentinoaltoadige: e, "trentinos-tirol": e, trentinostirol: e, "trentinosud-tirol": e, "xn--trentinosd-tirol-rzb": e, "trentinosüd-tirol": e, trentinosudtirol: e, "xn--trentinosdtirol-7vb": e, trentinosüdtirol: e, "trentinosued-tirol": e, trentinosuedtirol: e, "trentinsud-tirol": e, "xn--trentinsd-tirol-6vb": e, "trentinsüd-tirol": e, trentinsudtirol: e, "xn--trentinsdtirol-nsb": e, trentinsüdtirol: e, "trentinsued-tirol": e, trentinsuedtirol: e, tuscany: e, umb: e, umbria: e, "val-d-aosta": e, "val-daosta": e, "vald-aosta": e, valdaosta: e, "valle-aosta": e, "valle-d-aosta": e, "valle-daosta": e, valleaosta: e, "valled-aosta": e, valledaosta: e, "vallee-aoste": e, "xn--valle-aoste-ebb": e, "vallée-aoste": e, "vallee-d-aoste": e, "xn--valle-d-aoste-ehb": e, "vallée-d-aoste": e, valleeaoste: e, "xn--valleaoste-e7a": e, valléeaoste: e, valleedaoste: e, "xn--valledaoste-ebb": e, valléedaoste: e, vao: e, vda: e, ven: e, veneto: e, ag: e, agrigento: e, al: e, alessandria: e, "alto-adige": e, altoadige: e, an: e, ancona: e, "andria-barletta-trani": e, "andria-trani-barletta": e, andriabarlettatrani: e, andriatranibarletta: e, ao: e, aosta: e, aoste: e, ap: e, aq: e, aquila: e, ar: e, arezzo: e, "ascoli-piceno": e, ascolipiceno: e, asti: e, at: e, av: e, avellino: e, ba: e, balsan: e, "balsan-sudtirol": e, "xn--balsan-sdtirol-nsb": e, "balsan-südtirol": e, "balsan-suedtirol": e, bari: e, "barletta-trani-andria": e, barlettatraniandria: e, belluno: e, benevento: e, bergamo: e, bg: e, bi: e, biella: e, bl: e, bn: e, bo: e, bologna: e, bolzano: e, "bolzano-altoadige": e, bozen: e, "bozen-sudtirol": e, "xn--bozen-sdtirol-2ob": e, "bozen-südtirol": e, "bozen-suedtirol": e, br: e, brescia: e, brindisi: e, bs: e, bt: e, bulsan: e, "bulsan-sudtirol": e, "xn--bulsan-sdtirol-nsb": e, "bulsan-südtirol": e, "bulsan-suedtirol": e, bz: e, ca: e, cagliari: e, caltanissetta: e, "campidano-medio": e, campidanomedio: e, campobasso: e, "carbonia-iglesias": e, carboniaiglesias: e, "carrara-massa": e, carraramassa: e, caserta: e, catania: e, catanzaro: e, cb: e, ce: e, "cesena-forli": e, "xn--cesena-forl-mcb": e, "cesena-forlì": e, cesenaforli: e, "xn--cesenaforl-i8a": e, cesenaforlì: e, ch: e, chieti: e, ci: e, cl: e, cn: e, co: e, como: e, cosenza: e, cr: e, cremona: e, crotone: e, cs: e, ct: e, cuneo: e, cz: e, "dell-ogliastra": e, dellogliastra: e, en: e, enna: e, fc: e, fe: e, fermo: e, ferrara: e, fg: e, fi: e, firenze: e, florence: e, fm: e, foggia: e, "forli-cesena": e, "xn--forl-cesena-fcb": e, "forlì-cesena": e, forlicesena: e, "xn--forlcesena-c8a": e, forlìcesena: e, fr: e, frosinone: e, ge: e, genoa: e, genova: e, go: e, gorizia: e, gr: e, grosseto: e, "iglesias-carbonia": e, iglesiascarbonia: e, im: e, imperia: e, is: e, isernia: e, kr: e, "la-spezia": e, laquila: e, laspezia: e, latina: e, lc: e, le: e, lecce: e, lecco: e, li: e, livorno: e, lo: e, lodi: e, lt: e, lu: e, lucca: e, macerata: e, mantova: e, "massa-carrara": e, massacarrara: e, matera: e, mb: e, mc: e, me: e, "medio-campidano": e, mediocampidano: e, messina: e, mi: e, milan: e, milano: e, mn: e, mo: e, modena: e, monza: e, "monza-brianza": e, "monza-e-della-brianza": e, monzabrianza: e, monzaebrianza: e, monzaedellabrianza: e, ms: e, mt: e, na: e, naples: e, napoli: e, no: e, novara: e, nu: e, nuoro: e, og: e, ogliastra: e, "olbia-tempio": e, olbiatempio: e, or: e, oristano: e, ot: e, pa: e, padova: e, padua: e, palermo: e, parma: e, pavia: e, pc: e, pd: e, pe: e, perugia: e, "pesaro-urbino": e, pesarourbino: e, pescara: e, pg: e, pi: e, piacenza: e, pisa: e, pistoia: e, pn: e, po: e, pordenone: e, potenza: e, pr: e, prato: e, pt: e, pu: e, pv: e, pz: e, ra: e, ragusa: e, ravenna: e, rc: e, re: e, "reggio-calabria": e, "reggio-emilia": e, reggiocalabria: e, reggioemilia: e, rg: e, ri: e, rieti: e, rimini: e, rm: e, rn: e, ro: e, roma: e, rome: e, rovigo: e, sa: e, salerno: e, sassari: e, savona: e, si: e, siena: e, siracusa: e, so: e, sondrio: e, sp: e, sr: e, ss: e, "xn--sdtirol-n2a": e, südtirol: e, suedtirol: e, sv: e, ta: e, taranto: e, te: e, "tempio-olbia": e, tempioolbia: e, teramo: e, terni: e, tn: e, to: e, torino: e, tp: e, tr: e, "trani-andria-barletta": e, "trani-barletta-andria": e, traniandriabarletta: e, tranibarlettaandria: e, trapani: e, trento: e, treviso: e, trieste: e, ts: e, turin: e, tv: e, ud: e, udine: e, "urbino-pesaro": e, urbinopesaro: e, va: e, varese: e, vb: e, vc: e, ve: e, venezia: e, venice: e, verbania: e, vercelli: e, verona: e, vi: e, "vibo-valentia": e, vibovalentia: e, vicenza: e, viterbo: e, vr: e, vs: e, vt: e, vv: e, "12chars": t, ibxos: t, iliadboxos: t, neen: [0, { jc: t }], "123homepage": t, "16-b": t, "32-b": t, "64-b": t, myspreadshop: t, syncloud: t }], je: [1, { co: e, net: e, org: e, of: t }], jm: I, jo: [1, { agri: e, ai: e, com: e, edu: e, eng: e, fm: e, gov: e, mil: e, net: e, org: e, per: e, phd: e, sch: e, tv: e }], jobs: e, jp: [1, { ac: e, ad: e, co: e, ed: e, go: e, gr: e, lg: e, ne: [1, { aseinet: Ga, gehirn: t, ivory: t, "mail-box": t, mints: t, mokuren: t, opal: t, sakura: t, sumomo: t, topaz: t }], or: e, aichi: [1, { aisai: e, ama: e, anjo: e, asuke: e, chiryu: e, chita: e, fuso: e, gamagori: e, handa: e, hazu: e, hekinan: e, higashiura: e, ichinomiya: e, inazawa: e, inuyama: e, isshiki: e, iwakura: e, kanie: e, kariya: e, kasugai: e, kira: e, kiyosu: e, komaki: e, konan: e, kota: e, mihama: e, miyoshi: e, nishio: e, nisshin: e, obu: e, oguchi: e, oharu: e, okazaki: e, owariasahi: e, seto: e, shikatsu: e, shinshiro: e, shitara: e, tahara: e, takahama: e, tobishima: e, toei: e, togo: e, tokai: e, tokoname: e, toyoake: e, toyohashi: e, toyokawa: e, toyone: e, toyota: e, tsushima: e, yatomi: e }], akita: [1, { akita: e, daisen: e, fujisato: e, gojome: e, hachirogata: e, happou: e, higashinaruse: e, honjo: e, honjyo: e, ikawa: e, kamikoani: e, kamioka: e, katagami: e, kazuno: e, kitaakita: e, kosaka: e, kyowa: e, misato: e, mitane: e, moriyoshi: e, nikaho: e, noshiro: e, odate: e, oga: e, ogata: e, semboku: e, yokote: e, yurihonjo: e }], aomori: [1, { aomori: e, gonohe: e, hachinohe: e, hashikami: e, hiranai: e, hirosaki: e, itayanagi: e, kuroishi: e, misawa: e, mutsu: e, nakadomari: e, noheji: e, oirase: e, owani: e, rokunohe: e, sannohe: e, shichinohe: e, shingo: e, takko: e, towada: e, tsugaru: e, tsuruta: e }], chiba: [1, { abiko: e, asahi: e, chonan: e, chosei: e, choshi: e, chuo: e, funabashi: e, futtsu: e, hanamigawa: e, ichihara: e, ichikawa: e, ichinomiya: e, inzai: e, isumi: e, kamagaya: e, kamogawa: e, kashiwa: e, katori: e, katsuura: e, kimitsu: e, kisarazu: e, kozaki: e, kujukuri: e, kyonan: e, matsudo: e, midori: e, mihama: e, minamiboso: e, mobara: e, mutsuzawa: e, nagara: e, nagareyama: e, narashino: e, narita: e, noda: e, oamishirasato: e, omigawa: e, onjuku: e, otaki: e, sakae: e, sakura: e, shimofusa: e, shirako: e, shiroi: e, shisui: e, sodegaura: e, sosa: e, tako: e, tateyama: e, togane: e, tohnosho: e, tomisato: e, urayasu: e, yachimata: e, yachiyo: e, yokaichiba: e, yokoshibahikari: e, yotsukaido: e }], ehime: [1, { ainan: e, honai: e, ikata: e, imabari: e, iyo: e, kamijima: e, kihoku: e, kumakogen: e, masaki: e, matsuno: e, matsuyama: e, namikata: e, niihama: e, ozu: e, saijo: e, seiyo: e, shikokuchuo: e, tobe: e, toon: e, uchiko: e, uwajima: e, yawatahama: e }], fukui: [1, { echizen: e, eiheiji: e, fukui: e, ikeda: e, katsuyama: e, mihama: e, minamiechizen: e, obama: e, ohi: e, ono: e, sabae: e, sakai: e, takahama: e, tsuruga: e, wakasa: e }], fukuoka: [1, { ashiya: e, buzen: e, chikugo: e, chikuho: e, chikujo: e, chikushino: e, chikuzen: e, chuo: e, dazaifu: e, fukuchi: e, hakata: e, higashi: e, hirokawa: e, hisayama: e, iizuka: e, inatsuki: e, kaho: e, kasuga: e, kasuya: e, kawara: e, keisen: e, koga: e, kurate: e, kurogi: e, kurume: e, minami: e, miyako: e, miyama: e, miyawaka: e, mizumaki: e, munakata: e, nakagawa: e, nakama: e, nishi: e, nogata: e, ogori: e, okagaki: e, okawa: e, oki: e, omuta: e, onga: e, onojo: e, oto: e, saigawa: e, sasaguri: e, shingu: e, shinyoshitomi: e, shonai: e, soeda: e, sue: e, tachiarai: e, tagawa: e, takata: e, toho: e, toyotsu: e, tsuiki: e, ukiha: e, umi: e, usui: e, yamada: e, yame: e, yanagawa: e, yukuhashi: e }], fukushima: [1, { aizubange: e, aizumisato: e, aizuwakamatsu: e, asakawa: e, bandai: e, date: e, fukushima: e, furudono: e, futaba: e, hanawa: e, higashi: e, hirata: e, hirono: e, iitate: e, inawashiro: e, ishikawa: e, iwaki: e, izumizaki: e, kagamiishi: e, kaneyama: e, kawamata: e, kitakata: e, kitashiobara: e, koori: e, koriyama: e, kunimi: e, miharu: e, mishima: e, namie: e, nango: e, nishiaizu: e, nishigo: e, okuma: e, omotego: e, ono: e, otama: e, samegawa: e, shimogo: e, shirakawa: e, showa: e, soma: e, sukagawa: e, taishin: e, tamakawa: e, tanagura: e, tenei: e, yabuki: e, yamato: e, yamatsuri: e, yanaizu: e, yugawa: e }], gifu: [1, { anpachi: e, ena: e, gifu: e, ginan: e, godo: e, gujo: e, hashima: e, hichiso: e, hida: e, higashishirakawa: e, ibigawa: e, ikeda: e, kakamigahara: e, kani: e, kasahara: e, kasamatsu: e, kawaue: e, kitagata: e, mino: e, minokamo: e, mitake: e, mizunami: e, motosu: e, nakatsugawa: e, ogaki: e, sakahogi: e, seki: e, sekigahara: e, shirakawa: e, tajimi: e, takayama: e, tarui: e, toki: e, tomika: e, wanouchi: e, yamagata: e, yaotsu: e, yoro: e }], gunma: [1, { annaka: e, chiyoda: e, fujioka: e, higashiagatsuma: e, isesaki: e, itakura: e, kanna: e, kanra: e, katashina: e, kawaba: e, kiryu: e, kusatsu: e, maebashi: e, meiwa: e, midori: e, minakami: e, naganohara: e, nakanojo: e, nanmoku: e, numata: e, oizumi: e, ora: e, ota: e, shibukawa: e, shimonita: e, shinto: e, showa: e, takasaki: e, takayama: e, tamamura: e, tatebayashi: e, tomioka: e, tsukiyono: e, tsumagoi: e, ueno: e, yoshioka: e }], hiroshima: [1, { asaminami: e, daiwa: e, etajima: e, fuchu: e, fukuyama: e, hatsukaichi: e, higashihiroshima: e, hongo: e, jinsekikogen: e, kaita: e, kui: e, kumano: e, kure: e, mihara: e, miyoshi: e, naka: e, onomichi: e, osakikamijima: e, otake: e, saka: e, sera: e, seranishi: e, shinichi: e, shobara: e, takehara: e }], hokkaido: [1, { abashiri: e, abira: e, aibetsu: e, akabira: e, akkeshi: e, asahikawa: e, ashibetsu: e, ashoro: e, assabu: e, atsuma: e, bibai: e, biei: e, bifuka: e, bihoro: e, biratori: e, chippubetsu: e, chitose: e, date: e, ebetsu: e, embetsu: e, eniwa: e, erimo: e, esan: e, esashi: e, fukagawa: e, fukushima: e, furano: e, furubira: e, haboro: e, hakodate: e, hamatonbetsu: e, hidaka: e, higashikagura: e, higashikawa: e, hiroo: e, hokuryu: e, hokuto: e, honbetsu: e, horokanai: e, horonobe: e, ikeda: e, imakane: e, ishikari: e, iwamizawa: e, iwanai: e, kamifurano: e, kamikawa: e, kamishihoro: e, kamisunagawa: e, kamoenai: e, kayabe: e, kembuchi: e, kikonai: e, kimobetsu: e, kitahiroshima: e, kitami: e, kiyosato: e, koshimizu: e, kunneppu: e, kuriyama: e, kuromatsunai: e, kushiro: e, kutchan: e, kyowa: e, mashike: e, matsumae: e, mikasa: e, minamifurano: e, mombetsu: e, moseushi: e, mukawa: e, muroran: e, naie: e, nakagawa: e, nakasatsunai: e, nakatombetsu: e, nanae: e, nanporo: e, nayoro: e, nemuro: e, niikappu: e, niki: e, nishiokoppe: e, noboribetsu: e, numata: e, obihiro: e, obira: e, oketo: e, okoppe: e, otaru: e, otobe: e, otofuke: e, otoineppu: e, oumu: e, ozora: e, pippu: e, rankoshi: e, rebun: e, rikubetsu: e, rishiri: e, rishirifuji: e, saroma: e, sarufutsu: e, shakotan: e, shari: e, shibecha: e, shibetsu: e, shikabe: e, shikaoi: e, shimamaki: e, shimizu: e, shimokawa: e, shinshinotsu: e, shintoku: e, shiranuka: e, shiraoi: e, shiriuchi: e, sobetsu: e, sunagawa: e, taiki: e, takasu: e, takikawa: e, takinoue: e, teshikaga: e, tobetsu: e, tohma: e, tomakomai: e, tomari: e, toya: e, toyako: e, toyotomi: e, toyoura: e, tsubetsu: e, tsukigata: e, urakawa: e, urausu: e, uryu: e, utashinai: e, wakkanai: e, wassamu: e, yakumo: e, yoichi: e }], hyogo: [1, { aioi: e, akashi: e, ako: e, amagasaki: e, aogaki: e, asago: e, ashiya: e, awaji: e, fukusaki: e, goshiki: e, harima: e, himeji: e, ichikawa: e, inagawa: e, itami: e, kakogawa: e, kamigori: e, kamikawa: e, kasai: e, kasuga: e, kawanishi: e, miki: e, minamiawaji: e, nishinomiya: e, nishiwaki: e, ono: e, sanda: e, sannan: e, sasayama: e, sayo: e, shingu: e, shinonsen: e, shiso: e, sumoto: e, taishi: e, taka: e, takarazuka: e, takasago: e, takino: e, tamba: e, tatsuno: e, toyooka: e, yabu: e, yashiro: e, yoka: e, yokawa: e }], ibaraki: [1, { ami: e, asahi: e, bando: e, chikusei: e, daigo: e, fujishiro: e, hitachi: e, hitachinaka: e, hitachiomiya: e, hitachiota: e, ibaraki: e, ina: e, inashiki: e, itako: e, iwama: e, joso: e, kamisu: e, kasama: e, kashima: e, kasumigaura: e, koga: e, miho: e, mito: e, moriya: e, naka: e, namegata: e, oarai: e, ogawa: e, omitama: e, ryugasaki: e, sakai: e, sakuragawa: e, shimodate: e, shimotsuma: e, shirosato: e, sowa: e, suifu: e, takahagi: e, tamatsukuri: e, tokai: e, tomobe: e, tone: e, toride: e, tsuchiura: e, tsukuba: e, uchihara: e, ushiku: e, yachiyo: e, yamagata: e, yawara: e, yuki: e }], ishikawa: [1, { anamizu: e, hakui: e, hakusan: e, kaga: e, kahoku: e, kanazawa: e, kawakita: e, komatsu: e, nakanoto: e, nanao: e, nomi: e, nonoichi: e, noto: e, shika: e, suzu: e, tsubata: e, tsurugi: e, uchinada: e, wajima: e }], iwate: [1, { fudai: e, fujisawa: e, hanamaki: e, hiraizumi: e, hirono: e, ichinohe: e, ichinoseki: e, iwaizumi: e, iwate: e, joboji: e, kamaishi: e, kanegasaki: e, karumai: e, kawai: e, kitakami: e, kuji: e, kunohe: e, kuzumaki: e, miyako: e, mizusawa: e, morioka: e, ninohe: e, noda: e, ofunato: e, oshu: e, otsuchi: e, rikuzentakata: e, shiwa: e, shizukuishi: e, sumita: e, tanohata: e, tono: e, yahaba: e, yamada: e }], kagawa: [1, { ayagawa: e, higashikagawa: e, kanonji: e, kotohira: e, manno: e, marugame: e, mitoyo: e, naoshima: e, sanuki: e, tadotsu: e, takamatsu: e, tonosho: e, uchinomi: e, utazu: e, zentsuji: e }], kagoshima: [1, { akune: e, amami: e, hioki: e, isa: e, isen: e, izumi: e, kagoshima: e, kanoya: e, kawanabe: e, kinko: e, kouyama: e, makurazaki: e, matsumoto: e, minamitane: e, nakatane: e, nishinoomote: e, satsumasendai: e, soo: e, tarumizu: e, yusui: e }], kanagawa: [1, { aikawa: e, atsugi: e, ayase: e, chigasaki: e, ebina: e, fujisawa: e, hadano: e, hakone: e, hiratsuka: e, isehara: e, kaisei: e, kamakura: e, kiyokawa: e, matsuda: e, minamiashigara: e, miura: e, nakai: e, ninomiya: e, odawara: e, oi: e, oiso: e, sagamihara: e, samukawa: e, tsukui: e, yamakita: e, yamato: e, yokosuka: e, yugawara: e, zama: e, zushi: e }], kochi: [1, { aki: e, geisei: e, hidaka: e, higashitsuno: e, ino: e, kagami: e, kami: e, kitagawa: e, kochi: e, mihara: e, motoyama: e, muroto: e, nahari: e, nakamura: e, nankoku: e, nishitosa: e, niyodogawa: e, ochi: e, okawa: e, otoyo: e, otsuki: e, sakawa: e, sukumo: e, susaki: e, tosa: e, tosashimizu: e, toyo: e, tsuno: e, umaji: e, yasuda: e, yusuhara: e }], kumamoto: [1, { amakusa: e, arao: e, aso: e, choyo: e, gyokuto: e, kamiamakusa: e, kikuchi: e, kumamoto: e, mashiki: e, mifune: e, minamata: e, minamioguni: e, nagasu: e, nishihara: e, oguni: e, ozu: e, sumoto: e, takamori: e, uki: e, uto: e, yamaga: e, yamato: e, yatsushiro: e }], kyoto: [1, { ayabe: e, fukuchiyama: e, higashiyama: e, ide: e, ine: e, joyo: e, kameoka: e, kamo: e, kita: e, kizu: e, kumiyama: e, kyotamba: e, kyotanabe: e, kyotango: e, maizuru: e, minami: e, minamiyamashiro: e, miyazu: e, muko: e, nagaokakyo: e, nakagyo: e, nantan: e, oyamazaki: e, sakyo: e, seika: e, tanabe: e, uji: e, ujitawara: e, wazuka: e, yamashina: e, yawata: e }], mie: [1, { asahi: e, inabe: e, ise: e, kameyama: e, kawagoe: e, kiho: e, kisosaki: e, kiwa: e, komono: e, kumano: e, kuwana: e, matsusaka: e, meiwa: e, mihama: e, minamiise: e, misugi: e, miyama: e, nabari: e, shima: e, suzuka: e, tado: e, taiki: e, taki: e, tamaki: e, toba: e, tsu: e, udono: e, ureshino: e, watarai: e, yokkaichi: e }], miyagi: [1, { furukawa: e, higashimatsushima: e, ishinomaki: e, iwanuma: e, kakuda: e, kami: e, kawasaki: e, marumori: e, matsushima: e, minamisanriku: e, misato: e, murata: e, natori: e, ogawara: e, ohira: e, onagawa: e, osaki: e, rifu: e, semine: e, shibata: e, shichikashuku: e, shikama: e, shiogama: e, shiroishi: e, tagajo: e, taiwa: e, tome: e, tomiya: e, wakuya: e, watari: e, yamamoto: e, zao: e }], miyazaki: [1, { aya: e, ebino: e, gokase: e, hyuga: e, kadogawa: e, kawaminami: e, kijo: e, kitagawa: e, kitakata: e, kitaura: e, kobayashi: e, kunitomi: e, kushima: e, mimata: e, miyakonojo: e, miyazaki: e, morotsuka: e, nichinan: e, nishimera: e, nobeoka: e, saito: e, shiiba: e, shintomi: e, takaharu: e, takanabe: e, takazaki: e, tsuno: e }], nagano: [1, { achi: e, agematsu: e, anan: e, aoki: e, asahi: e, azumino: e, chikuhoku: e, chikuma: e, chino: e, fujimi: e, hakuba: e, hara: e, hiraya: e, iida: e, iijima: e, iiyama: e, iizuna: e, ikeda: e, ikusaka: e, ina: e, karuizawa: e, kawakami: e, kiso: e, kisofukushima: e, kitaaiki: e, komagane: e, komoro: e, matsukawa: e, matsumoto: e, miasa: e, minamiaiki: e, minamimaki: e, minamiminowa: e, minowa: e, miyada: e, miyota: e, mochizuki: e, nagano: e, nagawa: e, nagiso: e, nakagawa: e, nakano: e, nozawaonsen: e, obuse: e, ogawa: e, okaya: e, omachi: e, omi: e, ookuwa: e, ooshika: e, otaki: e, otari: e, sakae: e, sakaki: e, saku: e, sakuho: e, shimosuwa: e, shinanomachi: e, shiojiri: e, suwa: e, suzaka: e, takagi: e, takamori: e, takayama: e, tateshina: e, tatsuno: e, togakushi: e, togura: e, tomi: e, ueda: e, wada: e, yamagata: e, yamanouchi: e, yasaka: e, yasuoka: e }], nagasaki: [1, { chijiwa: e, futsu: e, goto: e, hasami: e, hirado: e, iki: e, isahaya: e, kawatana: e, kuchinotsu: e, matsuura: e, nagasaki: e, obama: e, omura: e, oseto: e, saikai: e, sasebo: e, seihi: e, shimabara: e, shinkamigoto: e, togitsu: e, tsushima: e, unzen: e }], nara: [1, { ando: e, gose: e, heguri: e, higashiyoshino: e, ikaruga: e, ikoma: e, kamikitayama: e, kanmaki: e, kashiba: e, kashihara: e, katsuragi: e, kawai: e, kawakami: e, kawanishi: e, koryo: e, kurotaki: e, mitsue: e, miyake: e, nara: e, nosegawa: e, oji: e, ouda: e, oyodo: e, sakurai: e, sango: e, shimoichi: e, shimokitayama: e, shinjo: e, soni: e, takatori: e, tawaramoto: e, tenkawa: e, tenri: e, uda: e, yamatokoriyama: e, yamatotakada: e, yamazoe: e, yoshino: e }], niigata: [1, { aga: e, agano: e, gosen: e, itoigawa: e, izumozaki: e, joetsu: e, kamo: e, kariwa: e, kashiwazaki: e, minamiuonuma: e, mitsuke: e, muika: e, murakami: e, myoko: e, nagaoka: e, niigata: e, ojiya: e, omi: e, sado: e, sanjo: e, seiro: e, seirou: e, sekikawa: e, shibata: e, tagami: e, tainai: e, tochio: e, tokamachi: e, tsubame: e, tsunan: e, uonuma: e, yahiko: e, yoita: e, yuzawa: e }], oita: [1, { beppu: e, bungoono: e, bungotakada: e, hasama: e, hiji: e, himeshima: e, hita: e, kamitsue: e, kokonoe: e, kuju: e, kunisaki: e, kusu: e, oita: e, saiki: e, taketa: e, tsukumi: e, usa: e, usuki: e, yufu: e }], okayama: [1, { akaiwa: e, asakuchi: e, bizen: e, hayashima: e, ibara: e, kagamino: e, kasaoka: e, kibichuo: e, kumenan: e, kurashiki: e, maniwa: e, misaki: e, nagi: e, niimi: e, nishiawakura: e, okayama: e, satosho: e, setouchi: e, shinjo: e, shoo: e, soja: e, takahashi: e, tamano: e, tsuyama: e, wake: e, yakage: e }], okinawa: [1, { aguni: e, ginowan: e, ginoza: e, gushikami: e, haebaru: e, higashi: e, hirara: e, iheya: e, ishigaki: e, ishikawa: e, itoman: e, izena: e, kadena: e, kin: e, kitadaito: e, kitanakagusuku: e, kumejima: e, kunigami: e, minamidaito: e, motobu: e, nago: e, naha: e, nakagusuku: e, nakijin: e, nanjo: e, nishihara: e, ogimi: e, okinawa: e, onna: e, shimoji: e, taketomi: e, tarama: e, tokashiki: e, tomigusuku: e, tonaki: e, urasoe: e, uruma: e, yaese: e, yomitan: e, yonabaru: e, yonaguni: e, zamami: e }], osaka: [1, { abeno: e, chihayaakasaka: e, chuo: e, daito: e, fujiidera: e, habikino: e, hannan: e, higashiosaka: e, higashisumiyoshi: e, higashiyodogawa: e, hirakata: e, ibaraki: e, ikeda: e, izumi: e, izumiotsu: e, izumisano: e, kadoma: e, kaizuka: e, kanan: e, kashiwara: e, katano: e, kawachinagano: e, kishiwada: e, kita: e, kumatori: e, matsubara: e, minato: e, minoh: e, misaki: e, moriguchi: e, neyagawa: e, nishi: e, nose: e, osakasayama: e, sakai: e, sayama: e, sennan: e, settsu: e, shijonawate: e, shimamoto: e, suita: e, tadaoka: e, taishi: e, tajiri: e, takaishi: e, takatsuki: e, tondabayashi: e, toyonaka: e, toyono: e, yao: e }], saga: [1, { ariake: e, arita: e, fukudomi: e, genkai: e, hamatama: e, hizen: e, imari: e, kamimine: e, kanzaki: e, karatsu: e, kashima: e, kitagata: e, kitahata: e, kiyama: e, kouhoku: e, kyuragi: e, nishiarita: e, ogi: e, omachi: e, ouchi: e, saga: e, shiroishi: e, taku: e, tara: e, tosu: e, yoshinogari: e }], saitama: [1, { arakawa: e, asaka: e, chichibu: e, fujimi: e, fujimino: e, fukaya: e, hanno: e, hanyu: e, hasuda: e, hatogaya: e, hatoyama: e, hidaka: e, higashichichibu: e, higashimatsuyama: e, honjo: e, ina: e, iruma: e, iwatsuki: e, kamiizumi: e, kamikawa: e, kamisato: e, kasukabe: e, kawagoe: e, kawaguchi: e, kawajima: e, kazo: e, kitamoto: e, koshigaya: e, kounosu: e, kuki: e, kumagaya: e, matsubushi: e, minano: e, misato: e, miyashiro: e, miyoshi: e, moroyama: e, nagatoro: e, namegawa: e, niiza: e, ogano: e, ogawa: e, ogose: e, okegawa: e, omiya: e, otaki: e, ranzan: e, ryokami: e, saitama: e, sakado: e, satte: e, sayama: e, shiki: e, shiraoka: e, soka: e, sugito: e, toda: e, tokigawa: e, tokorozawa: e, tsurugashima: e, urawa: e, warabi: e, yashio: e, yokoze: e, yono: e, yorii: e, yoshida: e, yoshikawa: e, yoshimi: e }], shiga: [1, { aisho: e, gamo: e, higashiomi: e, hikone: e, koka: e, konan: e, kosei: e, koto: e, kusatsu: e, maibara: e, moriyama: e, nagahama: e, nishiazai: e, notogawa: e, omihachiman: e, otsu: e, ritto: e, ryuoh: e, takashima: e, takatsuki: e, torahime: e, toyosato: e, yasu: e }], shimane: [1, { akagi: e, ama: e, gotsu: e, hamada: e, higashiizumo: e, hikawa: e, hikimi: e, izumo: e, kakinoki: e, masuda: e, matsue: e, misato: e, nishinoshima: e, ohda: e, okinoshima: e, okuizumo: e, shimane: e, tamayu: e, tsuwano: e, unnan: e, yakumo: e, yasugi: e, yatsuka: e }], shizuoka: [1, { arai: e, atami: e, fuji: e, fujieda: e, fujikawa: e, fujinomiya: e, fukuroi: e, gotemba: e, haibara: e, hamamatsu: e, higashiizu: e, ito: e, iwata: e, izu: e, izunokuni: e, kakegawa: e, kannami: e, kawanehon: e, kawazu: e, kikugawa: e, kosai: e, makinohara: e, matsuzaki: e, minamiizu: e, mishima: e, morimachi: e, nishiizu: e, numazu: e, omaezaki: e, shimada: e, shimizu: e, shimoda: e, shizuoka: e, susono: e, yaizu: e, yoshida: e }], tochigi: [1, { ashikaga: e, bato: e, haga: e, ichikai: e, iwafune: e, kaminokawa: e, kanuma: e, karasuyama: e, kuroiso: e, mashiko: e, mibu: e, moka: e, motegi: e, nasu: e, nasushiobara: e, nikko: e, nishikata: e, nogi: e, ohira: e, ohtawara: e, oyama: e, sakura: e, sano: e, shimotsuke: e, shioya: e, takanezawa: e, tochigi: e, tsuga: e, ujiie: e, utsunomiya: e, yaita: e }], tokushima: [1, { aizumi: e, anan: e, ichiba: e, itano: e, kainan: e, komatsushima: e, matsushige: e, mima: e, minami: e, miyoshi: e, mugi: e, nakagawa: e, naruto: e, sanagochi: e, shishikui: e, tokushima: e, wajiki: e }], tokyo: [1, { adachi: e, akiruno: e, akishima: e, aogashima: e, arakawa: e, bunkyo: e, chiyoda: e, chofu: e, chuo: e, edogawa: e, fuchu: e, fussa: e, hachijo: e, hachioji: e, hamura: e, higashikurume: e, higashimurayama: e, higashiyamato: e, hino: e, hinode: e, hinohara: e, inagi: e, itabashi: e, katsushika: e, kita: e, kiyose: e, kodaira: e, koganei: e, kokubunji: e, komae: e, koto: e, kouzushima: e, kunitachi: e, machida: e, meguro: e, minato: e, mitaka: e, mizuho: e, musashimurayama: e, musashino: e, nakano: e, nerima: e, ogasawara: e, okutama: e, ome: e, oshima: e, ota: e, setagaya: e, shibuya: e, shinagawa: e, shinjuku: e, suginami: e, sumida: e, tachikawa: e, taito: e, tama: e, toshima: e }], tottori: [1, { chizu: e, hino: e, kawahara: e, koge: e, kotoura: e, misasa: e, nanbu: e, nichinan: e, sakaiminato: e, tottori: e, wakasa: e, yazu: e, yonago: e }], toyama: [1, { asahi: e, fuchu: e, fukumitsu: e, funahashi: e, himi: e, imizu: e, inami: e, johana: e, kamiichi: e, kurobe: e, nakaniikawa: e, namerikawa: e, nanto: e, nyuzen: e, oyabe: e, taira: e, takaoka: e, tateyama: e, toga: e, tonami: e, toyama: e, unazuki: e, uozu: e, yamada: e }], wakayama: [1, { arida: e, aridagawa: e, gobo: e, hashimoto: e, hidaka: e, hirogawa: e, inami: e, iwade: e, kainan: e, kamitonda: e, katsuragi: e, kimino: e, kinokawa: e, kitayama: e, koya: e, koza: e, kozagawa: e, kudoyama: e, kushimoto: e, mihama: e, misato: e, nachikatsuura: e, shingu: e, shirahama: e, taiji: e, tanabe: e, wakayama: e, yuasa: e, yura: e }], yamagata: [1, { asahi: e, funagata: e, higashine: e, iide: e, kahoku: e, kaminoyama: e, kaneyama: e, kawanishi: e, mamurogawa: e, mikawa: e, murayama: e, nagai: e, nakayama: e, nanyo: e, nishikawa: e, obanazawa: e, oe: e, oguni: e, ohkura: e, oishida: e, sagae: e, sakata: e, sakegawa: e, shinjo: e, shirataka: e, shonai: e, takahata: e, tendo: e, tozawa: e, tsuruoka: e, yamagata: e, yamanobe: e, yonezawa: e, yuza: e }], yamaguchi: [1, { abu: e, hagi: e, hikari: e, hofu: e, iwakuni: e, kudamatsu: e, mitou: e, nagato: e, oshima: e, shimonoseki: e, shunan: e, tabuse: e, tokuyama: e, toyota: e, ube: e, yuu: e }], yamanashi: [1, { chuo: e, doshi: e, fuefuki: e, fujikawa: e, fujikawaguchiko: e, fujiyoshida: e, hayakawa: e, hokuto: e, ichikawamisato: e, kai: e, kofu: e, koshu: e, kosuge: e, "minami-alps": e, minobu: e, nakamichi: e, nanbu: e, narusawa: e, nirasaki: e, nishikatsura: e, oshino: e, otsuki: e, showa: e, tabayama: e, tsuru: e, uenohara: e, yamanakako: e, yamanashi: e }], "xn--ehqz56n": e, 三重: e, "xn--1lqs03n": e, 京都: e, "xn--qqqt11m": e, 佐賀: e, "xn--f6qx53a": e, 兵庫: e, "xn--djrs72d6uy": e, 北海道: e, "xn--mkru45i": e, 千葉: e, "xn--0trq7p7nn": e, 和歌山: e, "xn--5js045d": e, 埼玉: e, "xn--kbrq7o": e, 大分: e, "xn--pssu33l": e, 大阪: e, "xn--ntsq17g": e, 奈良: e, "xn--uisz3g": e, 宮城: e, "xn--6btw5a": e, 宮崎: e, "xn--1ctwo": e, 富山: e, "xn--6orx2r": e, 山口: e, "xn--rht61e": e, 山形: e, "xn--rht27z": e, 山梨: e, "xn--nit225k": e, 岐阜: e, "xn--rht3d": e, 岡山: e, "xn--djty4k": e, 岩手: e, "xn--klty5x": e, 島根: e, "xn--kltx9a": e, 広島: e, "xn--kltp7d": e, 徳島: e, "xn--c3s14m": e, 愛媛: e, "xn--vgu402c": e, 愛知: e, "xn--efvn9s": e, 新潟: e, "xn--1lqs71d": e, 東京: e, "xn--4pvxs": e, 栃木: e, "xn--uuwu58a": e, 沖縄: e, "xn--zbx025d": e, 滋賀: e, "xn--8pvr4u": e, 熊本: e, "xn--5rtp49c": e, 石川: e, "xn--ntso0iqx3a": e, 神奈川: e, "xn--elqq16h": e, 福井: e, "xn--4it168d": e, 福岡: e, "xn--klt787d": e, 福島: e, "xn--rny31h": e, 秋田: e, "xn--7t0a264c": e, 群馬: e, "xn--uist22h": e, 茨城: e, "xn--8ltr62k": e, 長崎: e, "xn--2m4a15e": e, 長野: e, "xn--32vp30h": e, 青森: e, "xn--4it797k": e, 静岡: e, "xn--5rtq34k": e, 香川: e, "xn--k7yn95e": e, 高知: e, "xn--tor131o": e, 鳥取: e, "xn--d5qv7z876c": e, 鹿児島: e, kawasaki: I, kitakyushu: I, kobe: I, nagoya: I, sapporo: I, sendai: I, yokohama: I, buyshop: t, fashionstore: t, handcrafted: t, kawaiishop: t, supersale: t, theshop: t, "0am": t, "0g0": t, "0j0": t, "0t0": t, mydns: t, pgw: t, wjg: t, usercontent: t, angry: t, babyblue: t, babymilk: t, backdrop: t, bambina: t, bitter: t, blush: t, boo: t, boy: t, boyfriend: t, but: t, candypop: t, capoo: t, catfood: t, cheap: t, chicappa: t, chillout: t, chips: t, chowder: t, chu: t, ciao: t, cocotte: t, coolblog: t, cranky: t, cutegirl: t, daa: t, deca: t, deci: t, digick: t, egoism: t, fakefur: t, fem: t, flier: t, floppy: t, fool: t, frenchkiss: t, girlfriend: t, girly: t, gloomy: t, gonna: t, greater: t, hacca: t, heavy: t, her: t, hiho: t, hippy: t, holy: t, hungry: t, icurus: t, itigo: t, jellybean: t, kikirara: t, kill: t, kilo: t, kuron: t, littlestar: t, lolipopmc: t, lolitapunk: t, lomo: t, lovepop: t, lovesick: t, main: t, mods: t, mond: t, mongolian: t, moo: t, namaste: t, nikita: t, nobushi: t, noor: t, oops: t, parallel: t, parasite: t, pecori: t, peewee: t, penne: t, pepper: t, perma: t, pigboat: t, pinoko: t, punyu: t, pupu: t, pussycat: t, pya: t, raindrop: t, readymade: t, sadist: t, schoolbus: t, secret: t, staba: t, stripper: t, sub: t, sunnyday: t, thick: t, tonkotsu: t, under: t, upper: t, velvet: t, verse: t, versus: t, vivian: t, watson: t, weblike: t, whitesnow: t, zombie: t, hateblo: t, hatenablog: t, hatenadiary: t, "2-d": t, bona: t, crap: t, daynight: t, eek: t, flop: t, halfmoon: t, jeez: t, matrix: t, mimoza: t, netgamers: t, nyanta: t, o0o0: t, rdy: t, rgr: t, rulez: t, sakurastorage: [0, { isk01: ri, isk02: ri }], saloon: t, sblo: t, skr: t, tank: t, "uh-oh": t, undo: t, webaccel: [0, { rs: t, user: t }], websozai: t, xii: t }], ke: [1, { ac: e, co: e, go: e, info: e, me: e, mobi: e, ne: e, or: e, sc: e }], kg: [1, { com: e, edu: e, gov: e, mil: e, net: e, org: e, us: t, xx: t }], kh: I, ki: Ya, km: [1, { ass: e, com: e, edu: e, gov: e, mil: e, nom: e, org: e, prd: e, tm: e, asso: e, coop: e, gouv: e, medecin: e, notaires: e, pharmaciens: e, presse: e, veterinaire: e }], kn: [1, { edu: e, gov: e, net: e, org: e }], kp: [1, { com: e, edu: e, gov: e, org: e, rep: e, tra: e }], kr: [1, { ac: e, ai: e, co: e, es: e, go: e, hs: e, io: e, it: e, kg: e, me: e, mil: e, ms: e, ne: e, or: e, pe: e, re: e, sc: e, busan: e, chungbuk: e, chungnam: e, daegu: e, daejeon: e, gangwon: e, gwangju: e, gyeongbuk: e, gyeonggi: e, gyeongnam: e, incheon: e, jeju: e, jeonbuk: e, jeonnam: e, seoul: e, ulsan: e, c01: t, "eliv-cdn": t, "eliv-dns": t, mmv: t, vki: t }], kw: [1, { com: e, edu: e, emb: e, gov: e, ind: e, net: e, org: e }], ky: Je, kz: [1, { com: e, edu: e, gov: e, mil: e, net: e, org: e, jcloud: t }], la: [1, { com: e, edu: e, gov: e, info: e, int: e, net: e, org: e, per: e, bnr: t }], lb: n, lc: [1, { co: e, com: e, edu: e, gov: e, net: e, org: e, oy: t }], li: e, lk: [1, { ac: e, assn: e, com: e, edu: e, gov: e, grp: e, hotel: e, int: e, ltd: e, net: e, ngo: e, org: e, sch: e, soc: e, web: e }], lr: n, ls: [1, { ac: e, biz: e, co: e, edu: e, gov: e, info: e, net: e, org: e, sc: e }], lt: c, lu: [1, { "123website": t }], lv: [1, { asn: e, com: e, conf: e, edu: e, gov: e, id: e, mil: e, net: e, org: e }], ly: [1, { com: e, edu: e, gov: e, id: e, med: e, net: e, org: e, plc: e, sch: e }], ma: [1, { ac: e, co: e, gov: e, net: e, org: e, press: e }], mc: [1, { asso: e, tm: e }], md: [1, { ir: t }], me: [1, { ac: e, co: e, edu: e, gov: e, its: e, net: e, org: e, priv: e, c66: t, craft: t, edgestack: t, filegear: t, "filegear-sg": t, lohmus: t, barsy: t, mcdir: t, brasilia: t, ddns: t, dnsfor: t, hopto: t, loginto: t, noip: t, webhop: t, soundcast: t, tcp4: t, vp4: t, diskstation: t, dscloud: t, i234: t, myds: t, synology: t, transip: Y, nohost: t }], mg: [1, { co: e, com: e, edu: e, gov: e, mil: e, nom: e, org: e, prd: e }], mh: e, mil: e, mk: [1, { com: e, edu: e, gov: e, inf: e, name: e, net: e, org: e }], ml: [1, { ac: e, art: e, asso: e, com: e, edu: e, gouv: e, gov: e, info: e, inst: e, net: e, org: e, pr: e, presse: e }], mm: I, mn: [1, { edu: e, gov: e, org: e, nyc: t }], mo: n, mobi: [1, { barsy: t, dscloud: t }], mp: [1, { ju: t }], mq: e, mr: c, ms: [1, { com: e, edu: e, gov: e, net: e, org: e, minisite: t }], mt: Je, mu: [1, { ac: e, co: e, com: e, gov: e, net: e, or: e, org: e }], museum: e, mv: [1, { aero: e, biz: e, com: e, coop: e, edu: e, gov: e, info: e, int: e, mil: e, museum: e, name: e, net: e, org: e, pro: e }], mw: [1, { ac: e, biz: e, co: e, com: e, coop: e, edu: e, gov: e, int: e, net: e, org: e }], mx: [1, { com: e, edu: e, gob: e, net: e, org: e }], my: [1, { biz: e, com: e, edu: e, gov: e, mil: e, name: e, net: e, org: e }], mz: [1, { ac: e, adv: e, co: e, edu: e, gov: e, mil: e, net: e, org: e }], na: [1, { alt: e, co: e, com: e, gov: e, net: e, org: e }], name: [1, { her: Qa, his: Qa }], nc: [1, { asso: e, nom: e }], ne: e, net: [1, { adobeaemcloud: t, "adobeio-static": t, adobeioruntime: t, akadns: t, akamai: t, "akamai-staging": t, akamaiedge: t, "akamaiedge-staging": t, akamaihd: t, "akamaihd-staging": t, akamaiorigin: t, "akamaiorigin-staging": t, akamaized: t, "akamaized-staging": t, edgekey: t, "edgekey-staging": t, edgesuite: t, "edgesuite-staging": t, alwaysdata: t, myamaze: t, cloudfront: t, appudo: t, "atlassian-dev": [0, { prod: Gn }], myfritz: t, onavstack: t, shopselect: t, blackbaudcdn: t, boomla: t, bplaced: t, square7: t, cdn77: [0, { r: t }], "cdn77-ssl": t, gb: t, hu: t, jp: t, se: t, uk: t, clickrising: t, "ddns-ip": t, "dns-cloud": t, "dns-dynamic": t, cloudaccess: t, cloudflare: [2, { cdn: t }], cloudflareanycast: Gn, cloudflarecn: Gn, cloudflareglobal: Gn, ctfcloud: t, "feste-ip": t, "knx-server": t, "static-access": t, cryptonomic: s, dattolocal: t, mydatto: t, debian: t, definima: t, deno: t, icp: s, "at-band-camp": t, blogdns: t, "broke-it": t, buyshouses: t, dnsalias: t, dnsdojo: t, "does-it": t, dontexist: t, dynalias: t, dynathome: t, endofinternet: t, "from-az": t, "from-co": t, "from-la": t, "from-ny": t, "gets-it": t, "ham-radio-op": t, homeftp: t, homeip: t, homelinux: t, homeunix: t, "in-the-band": t, "is-a-chef": t, "is-a-geek": t, "isa-geek": t, "kicks-ass": t, "office-on-the": t, podzone: t, "scrapper-site": t, selfip: t, "sells-it": t, servebbs: t, serveftp: t, thruhere: t, webhop: t, casacam: t, dynu: t, dynv6: t, twmail: t, ru: t, channelsdvr: [2, { u: t }], fastly: [0, { freetls: t, map: t, prod: [0, { a: t, global: t }], ssl: [0, { a: t, b: t, global: t }] }], fastlylb: [2, { map: t }], edgeapp: t, "keyword-on": t, "live-on": t, "server-on": t, "cdn-edges": t, heteml: t, cloudfunctions: t, "grafana-dev": t, iobb: t, moonscale: t, "in-dsl": t, "in-vpn": t, oninferno: t, botdash: t, "apps-1and1": t, ipifony: t, cloudjiffy: [2, { "fra1-de": t, "west1-us": t }], elastx: [0, { "jls-sto1": t, "jls-sto2": t, "jls-sto3": t }], massivegrid: [0, { paas: [0, { "fr-1": t, "lon-1": t, "lon-2": t, "ny-1": t, "ny-2": t, "sg-1": t }] }], saveincloud: [0, { jelastic: t, "nordeste-idc": t }], scaleforce: Jt, kinghost: t, uni5: t, krellian: t, ggff: t, localto: s, barsy: t, luyani: t, memset: t, "azure-api": t, "azure-mobile": t, azureedge: t, azurefd: t, azurestaticapps: [2, { 1: t, 2: t, 3: t, 4: t, 5: t, 6: t, 7: t, centralus: t, eastasia: t, eastus2: t, westeurope: t, westus2: t }], azurewebsites: t, cloudapp: t, trafficmanager: t, windows: [0, { core: [0, { blob: t }], servicebus: t }], mynetname: [0, { sn: t }], routingthecloud: t, bounceme: t, ddns: t, "eating-organic": t, mydissent: t, myeffect: t, mymediapc: t, mypsx: t, mysecuritycamera: t, nhlfan: t, "no-ip": t, pgafan: t, privatizehealthinsurance: t, redirectme: t, serveblog: t, serveminecraft: t, sytes: t, dnsup: t, hicam: t, "now-dns": t, ownip: t, vpndns: t, cloudycluster: t, ovh: [0, { hosting: s, webpaas: s }], rackmaze: t, myradweb: t, in: t, "subsc-pay": t, squares: t, schokokeks: t, "firewall-gateway": t, seidat: t, senseering: t, siteleaf: t, mafelo: t, myspreadshop: t, "vps-host": [2, { jelastic: [0, { atl: t, njs: t, ric: t }] }], srcf: [0, { soc: t, user: t }], supabase: t, dsmynas: t, familyds: t, ts: [2, { c: s }], torproject: [2, { pages: t }], vusercontent: t, "reserve-online": t, localcert: t, "community-pro": t, meinforum: t, yandexcloud: [2, { storage: t, website: t }], za: t, zabc: t }], nf: [1, { arts: e, com: e, firm: e, info: e, net: e, other: e, per: e, rec: e, store: e, web: e }], ng: [1, { com: e, edu: e, gov: e, i: e, mil: e, mobi: e, name: e, net: e, org: e, sch: e, biz: [2, { co: t, dl: t, go: t, lg: t, on: t }], col: t, firm: t, gen: t, ltd: t, ngo: t, plc: t }], ni: [1, { ac: e, biz: e, co: e, com: e, edu: e, gob: e, in: e, info: e, int: e, mil: e, net: e, nom: e, org: e, web: e }], nl: [1, { co: t, "hosting-cluster": t, gov: t, khplay: t, "123website": t, myspreadshop: t, transurl: s, cistron: t, demon: t }], no: [1, { fhs: e, folkebibl: e, fylkesbibl: e, idrett: e, museum: e, priv: e, vgs: e, dep: e, herad: e, kommune: e, mil: e, stat: e, aa: ae, ah: ae, bu: ae, fm: ae, hl: ae, hm: ae, "jan-mayen": ae, mr: ae, nl: ae, nt: ae, of: ae, ol: ae, oslo: ae, rl: ae, sf: ae, st: ae, svalbard: ae, tm: ae, tr: ae, va: ae, vf: ae, akrehamn: e, "xn--krehamn-dxa": e, åkrehamn: e, algard: e, "xn--lgrd-poac": e, ålgård: e, arna: e, bronnoysund: e, "xn--brnnysund-m8ac": e, brønnøysund: e, brumunddal: e, bryne: e, drobak: e, "xn--drbak-wua": e, drøbak: e, egersund: e, fetsund: e, floro: e, "xn--flor-jra": e, florø: e, fredrikstad: e, hokksund: e, honefoss: e, "xn--hnefoss-q1a": e, hønefoss: e, jessheim: e, jorpeland: e, "xn--jrpeland-54a": e, jørpeland: e, kirkenes: e, kopervik: e, krokstadelva: e, langevag: e, "xn--langevg-jxa": e, langevåg: e, leirvik: e, mjondalen: e, "xn--mjndalen-64a": e, mjøndalen: e, "mo-i-rana": e, mosjoen: e, "xn--mosjen-eya": e, mosjøen: e, nesoddtangen: e, orkanger: e, osoyro: e, "xn--osyro-wua": e, osøyro: e, raholt: e, "xn--rholt-mra": e, råholt: e, sandnessjoen: e, "xn--sandnessjen-ogb": e, sandnessjøen: e, skedsmokorset: e, slattum: e, spjelkavik: e, stathelle: e, stavern: e, stjordalshalsen: e, "xn--stjrdalshalsen-sqb": e, stjørdalshalsen: e, tananger: e, tranby: e, vossevangen: e, aarborte: e, aejrie: e, afjord: e, "xn--fjord-lra": e, åfjord: e, agdenes: e, akershus: Xa, aknoluokta: e, "xn--koluokta-7ya57h": e, ákŋoluokta: e, al: e, "xn--l-1fa": e, ål: e, alaheadju: e, "xn--laheadju-7ya": e, álaheadju: e, alesund: e, "xn--lesund-hua": e, ålesund: e, alstahaug: e, alta: e, "xn--lt-liac": e, áltá: e, alvdal: e, amli: e, "xn--mli-tla": e, åmli: e, amot: e, "xn--mot-tla": e, åmot: e, andasuolo: e, andebu: e, andoy: e, "xn--andy-ira": e, andøy: e, ardal: e, "xn--rdal-poa": e, årdal: e, aremark: e, arendal: e, "xn--s-1fa": e, ås: e, aseral: e, "xn--seral-lra": e, åseral: e, asker: e, askim: e, askoy: e, "xn--asky-ira": e, askøy: e, askvoll: e, asnes: e, "xn--snes-poa": e, åsnes: e, audnedaln: e, aukra: e, aure: e, aurland: e, "aurskog-holand": e, "xn--aurskog-hland-jnb": e, "aurskog-høland": e, austevoll: e, austrheim: e, averoy: e, "xn--avery-yua": e, averøy: e, badaddja: e, "xn--bdddj-mrabd": e, bådåddjå: e, "xn--brum-voa": e, bærum: e, bahcavuotna: e, "xn--bhcavuotna-s4a": e, báhcavuotna: e, bahccavuotna: e, "xn--bhccavuotna-k7a": e, báhccavuotna: e, baidar: e, "xn--bidr-5nac": e, báidár: e, bajddar: e, "xn--bjddar-pta": e, bájddar: e, balat: e, "xn--blt-elab": e, bálát: e, balestrand: e, ballangen: e, balsfjord: e, bamble: e, bardu: e, barum: e, batsfjord: e, "xn--btsfjord-9za": e, båtsfjord: e, bearalvahki: e, "xn--bearalvhki-y4a": e, bearalváhki: e, beardu: e, beiarn: e, berg: e, bergen: e, berlevag: e, "xn--berlevg-jxa": e, berlevåg: e, bievat: e, "xn--bievt-0qa": e, bievát: e, bindal: e, birkenes: e, bjarkoy: e, "xn--bjarky-fya": e, bjarkøy: e, bjerkreim: e, bjugn: e, bodo: e, "xn--bod-2na": e, bodø: e, bokn: e, bomlo: e, "xn--bmlo-gra": e, bømlo: e, bremanger: e, bronnoy: e, "xn--brnny-wuac": e, brønnøy: e, budejju: e, buskerud: Xa, bygland: e, bykle: e, cahcesuolo: e, "xn--hcesuolo-7ya35b": e, čáhcesuolo: e, davvenjarga: e, "xn--davvenjrga-y4a": e, davvenjárga: e, davvesiida: e, deatnu: e, dielddanuorri: e, divtasvuodna: e, divttasvuotna: e, donna: e, "xn--dnna-gra": e, dønna: e, dovre: e, drammen: e, drangedal: e, dyroy: e, "xn--dyry-ira": e, dyrøy: e, eid: e, eidfjord: e, eidsberg: e, eidskog: e, eidsvoll: e, eigersund: e, elverum: e, enebakk: e, engerdal: e, etne: e, etnedal: e, evenassi: e, "xn--eveni-0qa01ga": e, evenášši: e, evenes: e, "evje-og-hornnes": e, farsund: e, fauske: e, fedje: e, fet: e, finnoy: e, "xn--finny-yua": e, finnøy: e, fitjar: e, fjaler: e, fjell: e, fla: e, "xn--fl-zia": e, flå: e, flakstad: e, flatanger: e, flekkefjord: e, flesberg: e, flora: e, folldal: e, forde: e, "xn--frde-gra": e, førde: e, forsand: e, fosnes: e, "xn--frna-woa": e, fræna: e, frana: e, frei: e, frogn: e, froland: e, frosta: e, froya: e, "xn--frya-hra": e, frøya: e, fuoisku: e, fuossko: e, fusa: e, fyresdal: e, gaivuotna: e, "xn--givuotna-8ya": e, gáivuotna: e, galsa: e, "xn--gls-elac": e, gálsá: e, gamvik: e, gangaviika: e, "xn--ggaviika-8ya47h": e, gáŋgaviika: e, gaular: e, gausdal: e, giehtavuoatna: e, gildeskal: e, "xn--gildeskl-g0a": e, gildeskål: e, giske: e, gjemnes: e, gjerdrum: e, gjerstad: e, gjesdal: e, gjovik: e, "xn--gjvik-wua": e, gjøvik: e, gloppen: e, gol: e, gran: e, grane: e, granvin: e, gratangen: e, grimstad: e, grong: e, grue: e, gulen: e, guovdageaidnu: e, ha: e, "xn--h-2fa": e, hå: e, habmer: e, "xn--hbmer-xqa": e, hábmer: e, hadsel: e, "xn--hgebostad-g3a": e, hægebostad: e, hagebostad: e, halden: e, halsa: e, hamar: e, hamaroy: e, hammarfeasta: e, "xn--hmmrfeasta-s4ac": e, hámmárfeasta: e, hammerfest: e, hapmir: e, "xn--hpmir-xqa": e, hápmir: e, haram: e, hareid: e, harstad: e, hasvik: e, hattfjelldal: e, haugesund: e, hedmark: [0, { os: e, valer: e, "xn--vler-qoa": e, våler: e }], hemne: e, hemnes: e, hemsedal: e, hitra: e, hjartdal: e, hjelmeland: e, hobol: e, "xn--hobl-ira": e, hobøl: e, hof: e, hol: e, hole: e, holmestrand: e, holtalen: e, "xn--holtlen-hxa": e, holtålen: e, hordaland: [0, { os: e }], hornindal: e, horten: e, hoyanger: e, "xn--hyanger-q1a": e, høyanger: e, hoylandet: e, "xn--hylandet-54a": e, høylandet: e, hurdal: e, hurum: e, hvaler: e, hyllestad: e, ibestad: e, inderoy: e, "xn--indery-fya": e, inderøy: e, iveland: e, ivgu: e, jevnaker: e, jolster: e, "xn--jlster-bya": e, jølster: e, jondal: e, kafjord: e, "xn--kfjord-iua": e, kåfjord: e, karasjohka: e, "xn--krjohka-hwab49j": e, kárášjohka: e, karasjok: e, karlsoy: e, karmoy: e, "xn--karmy-yua": e, karmøy: e, kautokeino: e, klabu: e, "xn--klbu-woa": e, klæbu: e, klepp: e, kongsberg: e, kongsvinger: e, kraanghke: e, "xn--kranghke-b0a": e, kråanghke: e, kragero: e, "xn--krager-gya": e, kragerø: e, kristiansand: e, kristiansund: e, krodsherad: e, "xn--krdsherad-m8a": e, krødsherad: e, "xn--kvfjord-nxa": e, kvæfjord: e, "xn--kvnangen-k0a": e, kvænangen: e, kvafjord: e, kvalsund: e, kvam: e, kvanangen: e, kvinesdal: e, kvinnherad: e, kviteseid: e, kvitsoy: e, "xn--kvitsy-fya": e, kvitsøy: e, laakesvuemie: e, "xn--lrdal-sra": e, lærdal: e, lahppi: e, "xn--lhppi-xqa": e, láhppi: e, lardal: e, larvik: e, lavagis: e, lavangen: e, leangaviika: e, "xn--leagaviika-52b": e, leaŋgaviika: e, lebesby: e, leikanger: e, leirfjord: e, leka: e, leksvik: e, lenvik: e, lerdal: e, lesja: e, levanger: e, lier: e, lierne: e, lillehammer: e, lillesand: e, lindas: e, "xn--linds-pra": e, lindås: e, lindesnes: e, loabat: e, "xn--loabt-0qa": e, loabát: e, lodingen: e, "xn--ldingen-q1a": e, lødingen: e, lom: e, loppa: e, lorenskog: e, "xn--lrenskog-54a": e, lørenskog: e, loten: e, "xn--lten-gra": e, løten: e, lund: e, lunner: e, luroy: e, "xn--lury-ira": e, lurøy: e, luster: e, lyngdal: e, lyngen: e, malatvuopmi: e, "xn--mlatvuopmi-s4a": e, málatvuopmi: e, malselv: e, "xn--mlselv-iua": e, målselv: e, malvik: e, mandal: e, marker: e, marnardal: e, masfjorden: e, masoy: e, "xn--msy-ula0h": e, måsøy: e, "matta-varjjat": e, "xn--mtta-vrjjat-k7af": e, "mátta-várjjat": e, meland: e, meldal: e, melhus: e, meloy: e, "xn--mely-ira": e, meløy: e, meraker: e, "xn--merker-kua": e, meråker: e, midsund: e, "midtre-gauldal": e, moareke: e, "xn--moreke-jua": e, moåreke: e, modalen: e, modum: e, molde: e, "more-og-romsdal": [0, { heroy: e, sande: e }], "xn--mre-og-romsdal-qqb": [0, { "xn--hery-ira": e, sande: e }], "møre-og-romsdal": [0, { herøy: e, sande: e }], moskenes: e, moss: e, mosvik: e, muosat: e, "xn--muost-0qa": e, muosát: e, naamesjevuemie: e, "xn--nmesjevuemie-tcba": e, nååmesjevuemie: e, "xn--nry-yla5g": e, nærøy: e, namdalseid: e, namsos: e, namsskogan: e, nannestad: e, naroy: e, narviika: e, narvik: e, naustdal: e, navuotna: e, "xn--nvuotna-hwa": e, návuotna: e, "nedre-eiker": e, nesna: e, nesodden: e, nesseby: e, nesset: e, nissedal: e, nittedal: e, "nord-aurdal": e, "nord-fron": e, "nord-odal": e, norddal: e, nordkapp: e, nordland: [0, { bo: e, "xn--b-5ga": e, bø: e, heroy: e, "xn--hery-ira": e, herøy: e }], "nordre-land": e, nordreisa: e, "nore-og-uvdal": e, notodden: e, notteroy: e, "xn--nttery-byae": e, nøtterøy: e, odda: e, oksnes: e, "xn--ksnes-uua": e, øksnes: e, omasvuotna: e, oppdal: e, oppegard: e, "xn--oppegrd-ixa": e, oppegård: e, orkdal: e, orland: e, "xn--rland-uua": e, ørland: e, orskog: e, "xn--rskog-uua": e, ørskog: e, orsta: e, "xn--rsta-fra": e, ørsta: e, osen: e, osteroy: e, "xn--ostery-fya": e, osterøy: e, ostfold: [0, { valer: e }], "xn--stfold-9xa": [0, { "xn--vler-qoa": e }], østfold: [0, { våler: e }], "ostre-toten": e, "xn--stre-toten-zcb": e, "østre-toten": e, overhalla: e, "ovre-eiker": e, "xn--vre-eiker-k8a": e, "øvre-eiker": e, oyer: e, "xn--yer-zna": e, øyer: e, oygarden: e, "xn--ygarden-p1a": e, øygarden: e, "oystre-slidre": e, "xn--ystre-slidre-ujb": e, "øystre-slidre": e, porsanger: e, porsangu: e, "xn--porsgu-sta26f": e, porsáŋgu: e, porsgrunn: e, rade: e, "xn--rde-ula": e, råde: e, radoy: e, "xn--rady-ira": e, radøy: e, "xn--rlingen-mxa": e, rælingen: e, rahkkeravju: e, "xn--rhkkervju-01af": e, ráhkkerávju: e, raisa: e, "xn--risa-5na": e, ráisa: e, rakkestad: e, ralingen: e, rana: e, randaberg: e, rauma: e, rendalen: e, rennebu: e, rennesoy: e, "xn--rennesy-v1a": e, rennesøy: e, rindal: e, ringebu: e, ringerike: e, ringsaker: e, risor: e, "xn--risr-ira": e, risør: e, rissa: e, roan: e, rodoy: e, "xn--rdy-0nab": e, rødøy: e, rollag: e, romsa: e, romskog: e, "xn--rmskog-bya": e, rømskog: e, roros: e, "xn--rros-gra": e, røros: e, rost: e, "xn--rst-0na": e, røst: e, royken: e, "xn--ryken-vua": e, røyken: e, royrvik: e, "xn--ryrvik-bya": e, røyrvik: e, ruovat: e, rygge: e, salangen: e, salat: e, "xn--slat-5na": e, sálat: e, "xn--slt-elab": e, sálát: e, saltdal: e, samnanger: e, sandefjord: e, sandnes: e, sandoy: e, "xn--sandy-yua": e, sandøy: e, sarpsborg: e, sauda: e, sauherad: e, sel: e, selbu: e, selje: e, seljord: e, siellak: e, sigdal: e, siljan: e, sirdal: e, skanit: e, "xn--sknit-yqa": e, skánit: e, skanland: e, "xn--sknland-fxa": e, skånland: e, skaun: e, skedsmo: e, ski: e, skien: e, skierva: e, "xn--skierv-uta": e, skiervá: e, skiptvet: e, skjak: e, "xn--skjk-soa": e, skjåk: e, skjervoy: e, "xn--skjervy-v1a": e, skjervøy: e, skodje: e, smola: e, "xn--smla-hra": e, smøla: e, snaase: e, "xn--snase-nra": e, snåase: e, snasa: e, "xn--snsa-roa": e, snåsa: e, snillfjord: e, snoasa: e, sogndal: e, sogne: e, "xn--sgne-gra": e, søgne: e, sokndal: e, sola: e, solund: e, somna: e, "xn--smna-gra": e, sømna: e, "sondre-land": e, "xn--sndre-land-0cb": e, "søndre-land": e, songdalen: e, "sor-aurdal": e, "xn--sr-aurdal-l8a": e, "sør-aurdal": e, "sor-fron": e, "xn--sr-fron-q1a": e, "sør-fron": e, "sor-odal": e, "xn--sr-odal-q1a": e, "sør-odal": e, "sor-varanger": e, "xn--sr-varanger-ggb": e, "sør-varanger": e, sorfold: e, "xn--srfold-bya": e, sørfold: e, sorreisa: e, "xn--srreisa-q1a": e, sørreisa: e, sortland: e, sorum: e, "xn--srum-gra": e, sørum: e, spydeberg: e, stange: e, stavanger: e, steigen: e, steinkjer: e, stjordal: e, "xn--stjrdal-s1a": e, stjørdal: e, stokke: e, "stor-elvdal": e, stord: e, stordal: e, storfjord: e, strand: e, stranda: e, stryn: e, sula: e, suldal: e, sund: e, sunndal: e, surnadal: e, sveio: e, svelvik: e, sykkylven: e, tana: e, telemark: [0, { bo: e, "xn--b-5ga": e, bø: e }], time: e, tingvoll: e, tinn: e, tjeldsund: e, tjome: e, "xn--tjme-hra": e, tjøme: e, tokke: e, tolga: e, tonsberg: e, "xn--tnsberg-q1a": e, tønsberg: e, torsken: e, "xn--trna-woa": e, træna: e, trana: e, tranoy: e, "xn--trany-yua": e, tranøy: e, troandin: e, trogstad: e, "xn--trgstad-r1a": e, trøgstad: e, tromsa: e, tromso: e, "xn--troms-zua": e, tromsø: e, trondheim: e, trysil: e, tvedestrand: e, tydal: e, tynset: e, tysfjord: e, tysnes: e, "xn--tysvr-vra": e, tysvær: e, tysvar: e, ullensaker: e, ullensvang: e, ulvik: e, unjarga: e, "xn--unjrga-rta": e, unjárga: e, utsira: e, vaapste: e, vadso: e, "xn--vads-jra": e, vadsø: e, "xn--vry-yla5g": e, værøy: e, vaga: e, "xn--vg-yiab": e, vågå: e, vagan: e, "xn--vgan-qoa": e, vågan: e, vagsoy: e, "xn--vgsy-qoa0j": e, vågsøy: e, vaksdal: e, valle: e, vang: e, vanylven: e, vardo: e, "xn--vard-jra": e, vardø: e, varggat: e, "xn--vrggt-xqad": e, várggát: e, varoy: e, vefsn: e, vega: e, vegarshei: e, "xn--vegrshei-c0a": e, vegårshei: e, vennesla: e, verdal: e, verran: e, vestby: e, vestfold: [0, { sande: e }], vestnes: e, "vestre-slidre": e, "vestre-toten": e, vestvagoy: e, "xn--vestvgy-ixa6o": e, vestvågøy: e, vevelstad: e, vik: e, vikna: e, vindafjord: e, voagat: e, volda: e, voss: e, co: t, "123hjemmeside": t, myspreadshop: t }], np: I, nr: Ya, nu: [1, { merseine: t, mine: t, shacknet: t, enterprisecloud: t }], nz: [1, { ac: e, co: e, cri: e, geek: e, gen: e, govt: e, health: e, iwi: e, kiwi: e, maori: e, "xn--mori-qsa": e, māori: e, mil: e, net: e, org: e, parliament: e, school: e, cloudns: t }], om: [1, { co: e, com: e, edu: e, gov: e, med: e, museum: e, net: e, org: e, pro: e }], onion: e, org: [1, { altervista: t, pimienta: t, poivron: t, potager: t, sweetpepper: t, cdn77: [0, { c: t, rsc: t }], "cdn77-secure": [0, { origin: [0, { ssl: t }] }], ae: t, cloudns: t, "ip-dynamic": t, ddnss: t, dpdns: t, duckdns: t, tunk: t, blogdns: t, blogsite: t, boldlygoingnowhere: t, dnsalias: t, dnsdojo: t, doesntexist: t, dontexist: t, doomdns: t, dvrdns: t, dynalias: t, dyndns: [2, { go: t, home: t }], endofinternet: t, endoftheinternet: t, "from-me": t, "game-host": t, gotdns: t, "hobby-site": t, homedns: t, homeftp: t, homelinux: t, homeunix: t, "is-a-bruinsfan": t, "is-a-candidate": t, "is-a-celticsfan": t, "is-a-chef": t, "is-a-geek": t, "is-a-knight": t, "is-a-linux-user": t, "is-a-patsfan": t, "is-a-soxfan": t, "is-found": t, "is-lost": t, "is-saved": t, "is-very-bad": t, "is-very-evil": t, "is-very-good": t, "is-very-nice": t, "is-very-sweet": t, "isa-geek": t, "kicks-ass": t, misconfused: t, podzone: t, readmyblog: t, selfip: t, sellsyourhome: t, servebbs: t, serveftp: t, servegame: t, "stuff-4-sale": t, webhop: t, accesscam: t, camdvr: t, freeddns: t, mywire: t, webredirect: t, twmail: t, eu: [2, { al: t, asso: t, at: t, au: t, be: t, bg: t, ca: t, cd: t, ch: t, cn: t, cy: t, cz: t, de: t, dk: t, edu: t, ee: t, es: t, fi: t, fr: t, gr: t, hr: t, hu: t, ie: t, il: t, in: t, int: t, is: t, it: t, jp: t, kr: t, lt: t, lu: t, lv: t, me: t, mk: t, mt: t, my: t, net: t, ng: t, nl: t, no: t, nz: t, pl: t, pt: t, ro: t, ru: t, se: t, si: t, sk: t, tr: t, uk: t, us: t }], fedorainfracloud: t, fedorapeople: t, fedoraproject: [0, { cloud: t, os: K, stg: [0, { os: K }] }], freedesktop: t, hatenadiary: t, hepforge: t, "in-dsl": t, "in-vpn": t, js: t, barsy: t, mayfirst: t, routingthecloud: t, bmoattachments: t, "cable-modem": t, collegefan: t, couchpotatofries: t, hopto: t, mlbfan: t, myftp: t, mysecuritycamera: t, nflfan: t, "no-ip": t, "read-books": t, ufcfan: t, zapto: t, dynserv: t, "now-dns": t, "is-local": t, httpbin: t, pubtls: t, jpn: t, "my-firewall": t, myfirewall: t, spdns: t, "small-web": t, dsmynas: t, familyds: t, teckids: ri, tuxfamily: t, diskstation: t, hk: t, us: t, toolforge: t, wmcloud: [2, { beta: t }], wmflabs: t, za: t }], pa: [1, { abo: e, ac: e, com: e, edu: e, gob: e, ing: e, med: e, net: e, nom: e, org: e, sld: e }], pe: [1, { com: e, edu: e, gob: e, mil: e, net: e, nom: e, org: e }], pf: [1, { com: e, edu: e, org: e }], pg: I, ph: [1, { com: e, edu: e, gov: e, i: e, mil: e, net: e, ngo: e, org: e, cloudns: t }], pk: [1, { ac: e, biz: e, com: e, edu: e, fam: e, gkp: e, gob: e, gog: e, gok: e, gop: e, gos: e, gov: e, net: e, org: e, web: e }], pl: [1, { com: e, net: e, org: e, agro: e, aid: e, atm: e, auto: e, biz: e, edu: e, gmina: e, gsm: e, info: e, mail: e, media: e, miasta: e, mil: e, nieruchomosci: e, nom: e, pc: e, powiat: e, priv: e, realestate: e, rel: e, sex: e, shop: e, sklep: e, sos: e, szkola: e, targi: e, tm: e, tourism: e, travel: e, turystyka: e, gov: [1, { ap: e, griw: e, ic: e, is: e, kmpsp: e, konsulat: e, kppsp: e, kwp: e, kwpsp: e, mup: e, mw: e, oia: e, oirm: e, oke: e, oow: e, oschr: e, oum: e, pa: e, pinb: e, piw: e, po: e, pr: e, psp: e, psse: e, pup: e, rzgw: e, sa: e, sdn: e, sko: e, so: e, sr: e, starostwo: e, ug: e, ugim: e, um: e, umig: e, upow: e, uppo: e, us: e, uw: e, uzs: e, wif: e, wiih: e, winb: e, wios: e, witd: e, wiw: e, wkz: e, wsa: e, wskr: e, wsse: e, wuoz: e, wzmiuw: e, zp: e, zpisdn: e }], augustow: e, "babia-gora": e, bedzin: e, beskidy: e, bialowieza: e, bialystok: e, bielawa: e, bieszczady: e, boleslawiec: e, bydgoszcz: e, bytom: e, cieszyn: e, czeladz: e, czest: e, dlugoleka: e, elblag: e, elk: e, glogow: e, gniezno: e, gorlice: e, grajewo: e, ilawa: e, jaworzno: e, "jelenia-gora": e, jgora: e, kalisz: e, karpacz: e, kartuzy: e, kaszuby: e, katowice: e, "kazimierz-dolny": e, kepno: e, ketrzyn: e, klodzko: e, kobierzyce: e, kolobrzeg: e, konin: e, konskowola: e, kutno: e, lapy: e, lebork: e, legnica: e, lezajsk: e, limanowa: e, lomza: e, lowicz: e, lubin: e, lukow: e, malbork: e, malopolska: e, mazowsze: e, mazury: e, mielec: e, mielno: e, mragowo: e, naklo: e, nowaruda: e, nysa: e, olawa: e, olecko: e, olkusz: e, olsztyn: e, opoczno: e, opole: e, ostroda: e, ostroleka: e, ostrowiec: e, ostrowwlkp: e, pila: e, pisz: e, podhale: e, podlasie: e, polkowice: e, pomorskie: e, pomorze: e, prochowice: e, pruszkow: e, przeworsk: e, pulawy: e, radom: e, "rawa-maz": e, rybnik: e, rzeszow: e, sanok: e, sejny: e, skoczow: e, slask: e, slupsk: e, sosnowiec: e, "stalowa-wola": e, starachowice: e, stargard: e, suwalki: e, swidnica: e, swiebodzin: e, swinoujscie: e, szczecin: e, szczytno: e, tarnobrzeg: e, tgory: e, turek: e, tychy: e, ustka: e, walbrzych: e, warmia: e, warszawa: e, waw: e, wegrow: e, wielun: e, wlocl: e, wloclawek: e, wodzislaw: e, wolomin: e, wroclaw: e, zachpomor: e, zagan: e, zarow: e, zgora: e, zgorzelec: e, art: t, gliwice: t, krakow: t, poznan: t, wroc: t, zakopane: t, beep: t, "ecommerce-shop": t, cfolks: t, dfirma: t, dkonto: t, you2: t, shoparena: t, homesklep: t, sdscloud: t, unicloud: t, lodz: t, pabianice: t, plock: t, sieradz: t, skierniewice: t, zgierz: t, krasnik: t, leczna: t, lubartow: t, lublin: t, poniatowa: t, swidnik: t, co: t, torun: t, simplesite: t, myspreadshop: t, gda: t, gdansk: t, gdynia: t, med: t, sopot: t, bielsko: t }], pm: [1, { own: t, name: t }], pn: [1, { co: e, edu: e, gov: e, net: e, org: e }], post: e, pr: [1, { biz: e, com: e, edu: e, gov: e, info: e, isla: e, name: e, net: e, org: e, pro: e, ac: e, est: e, prof: e }], pro: [1, { aaa: e, aca: e, acct: e, avocat: e, bar: e, cpa: e, eng: e, jur: e, law: e, med: e, recht: e, "12chars": t, cloudns: t, barsy: t, ngrok: t }], ps: [1, { com: e, edu: e, gov: e, net: e, org: e, plo: e, sec: e }], pt: [1, { com: e, edu: e, gov: e, int: e, net: e, nome: e, org: e, publ: e, "123paginaweb": t }], pw: [1, { gov: e, cloudns: t, x443: t }], py: [1, { com: e, coop: e, edu: e, gov: e, mil: e, net: e, org: e }], qa: [1, { com: e, edu: e, gov: e, mil: e, name: e, net: e, org: e, sch: e }], re: [1, { asso: e, com: e, netlib: t, can: t }], ro: [1, { arts: e, com: e, firm: e, info: e, nom: e, nt: e, org: e, rec: e, store: e, tm: e, www: e, co: t, shop: t, barsy: t }], rs: [1, { ac: e, co: e, edu: e, gov: e, in: e, org: e, brendly: E, barsy: t, ox: t }], ru: [1, { ac: t, edu: t, gov: t, int: t, mil: t, eurodir: t, adygeya: t, bashkiria: t, bir: t, cbg: t, com: t, dagestan: t, grozny: t, kalmykia: t, kustanai: t, marine: t, mordovia: t, msk: t, mytis: t, nalchik: t, nov: t, pyatigorsk: t, spb: t, vladikavkaz: t, vladimir: t, na4u: t, mircloud: t, myjino: [2, { hosting: s, landing: s, spectrum: s, vps: s }], cldmail: [0, { hb: t }], mcdir: u, mcpre: t, net: t, org: t, pp: t, lk3: t, ras: t }], rw: [1, { ac: e, co: e, coop: e, gov: e, mil: e, net: e, org: e }], sa: [1, { com: e, edu: e, gov: e, med: e, net: e, org: e, pub: e, sch: e }], sb: n, sc: n, sd: [1, { com: e, edu: e, gov: e, info: e, med: e, net: e, org: e, tv: e }], se: [1, { a: e, ac: e, b: e, bd: e, brand: e, c: e, d: e, e, f: e, fh: e, fhsk: e, fhv: e, g: e, h: e, i: e, k: e, komforb: e, kommunalforbund: e, komvux: e, l: e, lanbib: e, m: e, n: e, naturbruksgymn: e, o: e, org: e, p: e, parti: e, pp: e, press: e, r: e, s: e, t: e, tm: e, u: e, w: e, x: e, y: e, z: e, com: t, iopsys: t, "123minsida": t, itcouldbewor: t, myspreadshop: t }], sg: [1, { com: e, edu: e, gov: e, net: e, org: e, enscaled: t }], sh: [1, { com: e, gov: e, mil: e, net: e, org: e, hashbang: t, botda: t, lovable: t, platform: [0, { ent: t, eu: t, us: t }], teleport: t, now: t }], si: [1, { f5: t, gitapp: t, gitpage: t }], sj: e, sk: e, sl: n, sm: e, sn: [1, { art: e, com: e, edu: e, gouv: e, org: e, perso: e, univ: e }], so: [1, { com: e, edu: e, gov: e, me: e, net: e, org: e, surveys: t }], sr: e, ss: [1, { biz: e, co: e, com: e, edu: e, gov: e, me: e, net: e, org: e, sch: e }], st: [1, { co: e, com: e, consulado: e, edu: e, embaixada: e, mil: e, net: e, org: e, principe: e, saotome: e, store: e, helioho: t, kirara: t, noho: t }], su: [1, { abkhazia: t, adygeya: t, aktyubinsk: t, arkhangelsk: t, armenia: t, ashgabad: t, azerbaijan: t, balashov: t, bashkiria: t, bryansk: t, bukhara: t, chimkent: t, dagestan: t, "east-kazakhstan": t, exnet: t, georgia: t, grozny: t, ivanovo: t, jambyl: t, kalmykia: t, kaluga: t, karacol: t, karaganda: t, karelia: t, khakassia: t, krasnodar: t, kurgan: t, kustanai: t, lenug: t, mangyshlak: t, mordovia: t, msk: t, murmansk: t, nalchik: t, navoi: t, "north-kazakhstan": t, nov: t, obninsk: t, penza: t, pokrovsk: t, sochi: t, spb: t, tashkent: t, termez: t, togliatti: t, troitsk: t, tselinograd: t, tula: t, tuva: t, vladikavkaz: t, vladimir: t, vologda: t }], sv: [1, { com: e, edu: e, gob: e, org: e, red: e }], sx: c, sy: r, sz: [1, { ac: e, co: e, org: e }], tc: e, td: e, tel: e, tf: [1, { sch: t }], tg: e, th: [1, { ac: e, co: e, go: e, in: e, mi: e, net: e, or: e, online: t, shop: t }], tj: [1, { ac: e, biz: e, co: e, com: e, edu: e, go: e, gov: e, int: e, mil: e, name: e, net: e, nic: e, org: e, test: e, web: e }], tk: e, tl: c, tm: [1, { co: e, com: e, edu: e, gov: e, mil: e, net: e, nom: e, org: e }], tn: [1, { com: e, ens: e, fin: e, gov: e, ind: e, info: e, intl: e, mincom: e, nat: e, net: e, org: e, perso: e, tourism: e, orangecloud: t }], to: [1, { 611: t, com: e, edu: e, gov: e, mil: e, net: e, org: e, oya: t, x0: t, quickconnect: re, vpnplus: t }], tr: [1, { av: e, bbs: e, bel: e, biz: e, com: e, dr: e, edu: e, gen: e, gov: e, info: e, k12: e, kep: e, mil: e, name: e, net: e, org: e, pol: e, tel: e, tsk: e, tv: e, web: e, nc: c }], tt: [1, { biz: e, co: e, com: e, edu: e, gov: e, info: e, mil: e, name: e, net: e, org: e, pro: e }], tv: [1, { "better-than": t, dyndns: t, "on-the-web": t, "worse-than": t, from: t, sakura: t }], tw: [1, { club: e, com: [1, { mymailer: t }], ebiz: e, edu: e, game: e, gov: e, idv: e, mil: e, net: e, org: e, url: t, mydns: t }], tz: [1, { ac: e, co: e, go: e, hotel: e, info: e, me: e, mil: e, mobi: e, ne: e, or: e, sc: e, tv: e }], ua: [1, { com: e, edu: e, gov: e, in: e, net: e, org: e, cherkassy: e, cherkasy: e, chernigov: e, chernihiv: e, chernivtsi: e, chernovtsy: e, ck: e, cn: e, cr: e, crimea: e, cv: e, dn: e, dnepropetrovsk: e, dnipropetrovsk: e, donetsk: e, dp: e, if: e, "ivano-frankivsk": e, kh: e, kharkiv: e, kharkov: e, kherson: e, khmelnitskiy: e, khmelnytskyi: e, kiev: e, kirovograd: e, km: e, kr: e, kropyvnytskyi: e, krym: e, ks: e, kv: e, kyiv: e, lg: e, lt: e, lugansk: e, luhansk: e, lutsk: e, lv: e, lviv: e, mk: e, mykolaiv: e, nikolaev: e, od: e, odesa: e, odessa: e, pl: e, poltava: e, rivne: e, rovno: e, rv: e, sb: e, sebastopol: e, sevastopol: e, sm: e, sumy: e, te: e, ternopil: e, uz: e, uzhgorod: e, uzhhorod: e, vinnica: e, vinnytsia: e, vn: e, volyn: e, yalta: e, zakarpattia: e, zaporizhzhe: e, zaporizhzhia: e, zhitomir: e, zhytomyr: e, zp: e, zt: e, cc: t, inf: t, ltd: t, cx: t, biz: t, co: t, pp: t, v: t }], ug: [1, { ac: e, co: e, com: e, edu: e, go: e, gov: e, mil: e, ne: e, or: e, org: e, sc: e, us: e }], uk: [1, { ac: e, co: [1, { bytemark: [0, { dh: t, vm: t }], layershift: Jt, barsy: t, barsyonline: t, retrosnub: Ja, "nh-serv": t, "no-ip": t, adimo: t, myspreadshop: t }], gov: [1, { api: t, campaign: t, service: t }], ltd: e, me: e, net: e, nhs: e, org: [1, { glug: t, lug: t, lugs: t, affinitylottery: t, raffleentry: t, weeklylottery: t }], plc: e, police: e, sch: I, conn: t, copro: t, hosp: t, "independent-commission": t, "independent-inquest": t, "independent-inquiry": t, "independent-panel": t, "independent-review": t, "public-inquiry": t, "royal-commission": t, pymnt: t, barsy: t, nimsite: t, oraclegovcloudapps: s }], us: [1, { dni: e, isa: e, nsn: e, ak: R, al: R, ar: R, as: R, az: R, ca: R, co: R, ct: R, dc: R, de: Ka, fl: R, ga: R, gu: R, hi: Ur, ia: R, id: R, il: R, in: R, ks: R, ky: R, la: R, ma: [1, { k12: [1, { chtr: e, paroch: e, pvt: e }], cc: e, lib: e }], md: R, me: R, mi: [1, { k12: e, cc: e, lib: e, "ann-arbor": e, cog: e, dst: e, eaton: e, gen: e, mus: e, tec: e, washtenaw: e }], mn: R, mo: R, ms: [1, { k12: e, cc: e }], mt: R, nc: R, nd: Ur, ne: R, nh: R, nj: R, nm: R, nv: R, ny: R, oh: R, ok: R, or: R, pa: R, pr: R, ri: Ur, sc: R, sd: Ur, tn: R, tx: R, ut: R, va: R, vi: R, vt: R, wa: R, wi: R, wv: Ka, wy: R, cloudns: t, "is-by": t, "land-4-sale": t, "stuff-4-sale": t, heliohost: t, enscaled: [0, { phx: t }], mircloud: t, ngo: t, golffan: t, noip: t, pointto: t, freeddns: t, srv: [2, { gh: t, gl: t }], platterp: t, servername: t }], uy: [1, { com: e, edu: e, gub: e, mil: e, net: e, org: e }], uz: [1, { co: e, com: e, net: e, org: e }], va: e, vc: [1, { com: e, edu: e, gov: e, mil: e, net: e, org: e, gv: [2, { d: t }], "0e": s, mydns: t }], ve: [1, { arts: e, bib: e, co: e, com: e, e12: e, edu: e, emprende: e, firm: e, gob: e, gov: e, info: e, int: e, mil: e, net: e, nom: e, org: e, rar: e, rec: e, store: e, tec: e, web: e }], vg: [1, { edu: e }], vi: [1, { co: e, com: e, k12: e, net: e, org: e }], vn: [1, { ac: e, ai: e, biz: e, com: e, edu: e, gov: e, health: e, id: e, info: e, int: e, io: e, name: e, net: e, org: e, pro: e, angiang: e, bacgiang: e, backan: e, baclieu: e, bacninh: e, "baria-vungtau": e, bentre: e, binhdinh: e, binhduong: e, binhphuoc: e, binhthuan: e, camau: e, cantho: e, caobang: e, daklak: e, daknong: e, danang: e, dienbien: e, dongnai: e, dongthap: e, gialai: e, hagiang: e, haiduong: e, haiphong: e, hanam: e, hanoi: e, hatinh: e, haugiang: e, hoabinh: e, hungyen: e, khanhhoa: e, kiengiang: e, kontum: e, laichau: e, lamdong: e, langson: e, laocai: e, longan: e, namdinh: e, nghean: e, ninhbinh: e, ninhthuan: e, phutho: e, phuyen: e, quangbinh: e, quangnam: e, quangngai: e, quangninh: e, quangtri: e, soctrang: e, sonla: e, tayninh: e, thaibinh: e, thainguyen: e, thanhhoa: e, thanhphohochiminh: e, thuathienhue: e, tiengiang: e, travinh: e, tuyenquang: e, vinhlong: e, vinhphuc: e, yenbai: e }], vu: Je, wf: [1, { biz: t, sch: t }], ws: [1, { com: e, edu: e, gov: e, net: e, org: e, advisor: s, cloud66: t, dyndns: t, mypets: t }], yt: [1, { org: t }], "xn--mgbaam7a8h": e, امارات: e, "xn--y9a3aq": e, հայ: e, "xn--54b7fta0cc": e, বাংলা: e, "xn--90ae": e, бг: e, "xn--mgbcpq6gpa1a": e, البحرين: e, "xn--90ais": e, бел: e, "xn--fiqs8s": e, 中国: e, "xn--fiqz9s": e, 中國: e, "xn--lgbbat1ad8j": e, الجزائر: e, "xn--wgbh1c": e, مصر: e, "xn--e1a4c": e, ею: e, "xn--qxa6a": e, ευ: e, "xn--mgbah1a3hjkrd": e, موريتانيا: e, "xn--node": e, გე: e, "xn--qxam": e, ελ: e, "xn--j6w193g": [1, { "xn--gmqw5a": e, "xn--55qx5d": e, "xn--mxtq1m": e, "xn--wcvs22d": e, "xn--uc0atv": e, "xn--od0alg": e }], 香港: [1, { 個人: e, 公司: e, 政府: e, 教育: e, 組織: e, 網絡: e }], "xn--2scrj9c": e, ಭಾರತ: e, "xn--3hcrj9c": e, ଭାରତ: e, "xn--45br5cyl": e, ভাৰত: e, "xn--h2breg3eve": e, भारतम्: e, "xn--h2brj9c8c": e, भारोत: e, "xn--mgbgu82a": e, ڀارت: e, "xn--rvc1e0am3e": e, ഭാരതം: e, "xn--h2brj9c": e, भारत: e, "xn--mgbbh1a": e, بارت: e, "xn--mgbbh1a71e": e, بھارت: e, "xn--fpcrj9c3d": e, భారత్: e, "xn--gecrj9c": e, ભારત: e, "xn--s9brj9c": e, ਭਾਰਤ: e, "xn--45brj9c": e, ভারত: e, "xn--xkc2dl3a5ee0h": e, இந்தியா: e, "xn--mgba3a4f16a": e, ایران: e, "xn--mgba3a4fra": e, ايران: e, "xn--mgbtx2b": e, عراق: e, "xn--mgbayh7gpa": e, الاردن: e, "xn--3e0b707e": e, 한국: e, "xn--80ao21a": e, қаз: e, "xn--q7ce6a": e, ລາວ: e, "xn--fzc2c9e2c": e, ලංකා: e, "xn--xkc2al3hye2a": e, இலங்கை: e, "xn--mgbc0a9azcg": e, المغرب: e, "xn--d1alf": e, мкд: e, "xn--l1acc": e, мон: e, "xn--mix891f": e, 澳門: e, "xn--mix082f": e, 澳门: e, "xn--mgbx4cd0ab": e, مليسيا: e, "xn--mgb9awbf": e, عمان: e, "xn--mgbai9azgqp6j": e, پاکستان: e, "xn--mgbai9a5eva00b": e, پاكستان: e, "xn--ygbi2ammx": e, فلسطين: e, "xn--90a3ac": [1, { "xn--80au": e, "xn--90azh": e, "xn--d1at": e, "xn--c1avg": e, "xn--o1ac": e, "xn--o1ach": e }], срб: [1, { ак: e, обр: e, од: e, орг: e, пр: e, упр: e }], "xn--p1ai": e, рф: e, "xn--wgbl6a": e, قطر: e, "xn--mgberp4a5d4ar": e, السعودية: e, "xn--mgberp4a5d4a87g": e, السعودیة: e, "xn--mgbqly7c0a67fbc": e, السعودیۃ: e, "xn--mgbqly7cvafr": e, السعوديه: e, "xn--mgbpl2fh": e, سودان: e, "xn--yfro4i67o": e, 新加坡: e, "xn--clchc0ea0b2g2a9gcd": e, சிங்கப்பூர்: e, "xn--ogbpf8fl": e, سورية: e, "xn--mgbtf8fl": e, سوريا: e, "xn--o3cw4h": [1, { "xn--o3cyx2a": e, "xn--12co0c3b4eva": e, "xn--m3ch0j3a": e, "xn--h3cuzk1di": e, "xn--12c1fe0br": e, "xn--12cfi8ixb8l": e }], ไทย: [1, { ทหาร: e, ธุรกิจ: e, เน็ต: e, รัฐบาล: e, ศึกษา: e, องค์กร: e }], "xn--pgbs0dh": e, تونس: e, "xn--kpry57d": e, 台灣: e, "xn--kprw13d": e, 台湾: e, "xn--nnx388a": e, 臺灣: e, "xn--j1amh": e, укр: e, "xn--mgb2ddes": e, اليمن: e, xxx: e, ye: r, za: [0, { ac: e, agric: e, alt: e, co: e, edu: e, gov: e, grondar: e, law: e, mil: e, net: e, ngo: e, nic: e, nis: e, nom: e, org: e, school: e, tm: e, web: e }], zm: [1, { ac: e, biz: e, co: e, com: e, edu: e, gov: e, info: e, mil: e, net: e, org: e, sch: e }], zw: [1, { ac: e, co: e, gov: e, mil: e, org: e }], aaa: e, aarp: e, abb: e, abbott: e, abbvie: e, abc: e, able: e, abogado: e, abudhabi: e, academy: [1, { official: t }], accenture: e, accountant: e, accountants: e, aco: e, actor: e, ads: e, adult: e, aeg: e, aetna: e, afl: e, africa: e, agakhan: e, agency: e, aig: e, airbus: e, airforce: e, airtel: e, akdn: e, alibaba: e, alipay: e, allfinanz: e, allstate: e, ally: e, alsace: e, alstom: e, amazon: e, americanexpress: e, americanfamily: e, amex: e, amfam: e, amica: e, amsterdam: e, analytics: e, android: e, anquan: e, anz: e, aol: e, apartments: e, app: [1, { adaptable: t, aiven: t, beget: s, brave: i, clerk: t, clerkstage: t, wnext: t, csb: [2, { preview: t }], convex: t, deta: t, ondigitalocean: t, easypanel: t, encr: [2, { frontend: t }], evervault: a, expo: [2, { staging: t }], edgecompute: t, "on-fleek": t, flutterflow: t, e2b: t, framer: t, github: t, hosted: s, run: [0, { "*": t, mtls: s }], web: t, hackclub: t, hasura: t, botdash: t, leapcell: t, loginline: t, lovable: t, luyani: t, medusajs: t, messerli: t, netfy: t, netlify: t, ngrok: t, "ngrok-free": t, developer: s, noop: t, northflank: s, upsun: s, railway: [0, { up: t }], replit: o, nyat: t, snowflake: [0, { "*": t, privatelink: s }], streamlit: t, storipress: t, telebit: t, typedream: t, vercel: t, wal: t, bookonline: t, wdh: t, windsurf: t, zeabur: t, zerops: s }], apple: e, aquarelle: e, arab: e, aramco: e, archi: e, army: e, art: e, arte: e, asda: e, associates: e, athleta: e, attorney: e, auction: e, audi: e, audible: e, audio: e, auspost: e, author: e, auto: e, autos: e, aws: [1, { on: [0, { "af-south-1": l, "ap-east-1": l, "ap-northeast-1": l, "ap-northeast-2": l, "ap-northeast-3": l, "ap-south-1": l, "ap-south-2": l, "ap-southeast-1": l, "ap-southeast-2": l, "ap-southeast-3": l, "ap-southeast-4": l, "ap-southeast-5": l, "ca-central-1": l, "ca-west-1": l, "eu-central-1": l, "eu-central-2": l, "eu-north-1": l, "eu-south-1": l, "eu-south-2": l, "eu-west-1": l, "eu-west-2": l, "eu-west-3": l, "il-central-1": l, "me-central-1": l, "me-south-1": l, "sa-east-1": l, "us-east-1": l, "us-east-2": l, "us-west-1": l, "us-west-2": l, "us-gov-east-1": d, "us-gov-west-1": d }], sagemaker: [0, { "ap-northeast-1": h, "ap-northeast-2": h, "ap-south-1": h, "ap-southeast-1": h, "ap-southeast-2": h, "ca-central-1": g, "eu-central-1": h, "eu-west-1": h, "eu-west-2": h, "us-east-1": g, "us-east-2": g, "us-west-2": g, "af-south-1": p, "ap-east-1": p, "ap-northeast-3": p, "ap-south-2": m, "ap-southeast-3": p, "ap-southeast-4": m, "ca-west-1": [0, { notebook: t, "notebook-fips": t }], "eu-central-2": p, "eu-north-1": p, "eu-south-1": p, "eu-south-2": p, "eu-west-3": p, "il-central-1": p, "me-central-1": p, "me-south-1": p, "sa-east-1": p, "us-gov-east-1": k, "us-gov-west-1": k, "us-west-1": [0, { notebook: t, "notebook-fips": t, studio: t }], experiments: s }], repost: [0, { private: s }] }], axa: e, azure: e, baby: e, baidu: e, banamex: e, band: e, bank: e, bar: e, barcelona: e, barclaycard: e, barclays: e, barefoot: e, bargains: e, baseball: e, basketball: [1, { aus: t, nz: t }], bauhaus: e, bayern: e, bbc: e, bbt: e, bbva: e, bcg: e, bcn: e, beats: e, beauty: e, beer: e, berlin: e, best: e, bestbuy: e, bet: e, bharti: e, bible: e, bid: e, bike: e, bing: e, bingo: e, bio: e, black: e, blackfriday: e, blockbuster: e, blog: e, bloomberg: e, blue: e, bms: e, bmw: e, bnpparibas: e, boats: e, boehringer: e, bofa: e, bom: e, bond: e, boo: e, book: e, booking: e, bosch: e, bostik: e, boston: e, bot: e, boutique: e, box: e, bradesco: e, bridgestone: e, broadway: e, broker: e, brother: e, brussels: e, build: [1, { v0: t, windsurf: t }], builders: [1, { cloudsite: t }], business: D, buy: e, buzz: e, bzh: e, cab: e, cafe: e, cal: e, call: e, calvinklein: e, cam: e, camera: e, camp: [1, { emf: [0, { at: t }] }], canon: e, capetown: e, capital: e, capitalone: e, car: e, caravan: e, cards: e, care: e, career: e, careers: e, cars: e, casa: [1, { nabu: [0, { ui: t }] }], case: e, cash: e, casino: e, catering: e, catholic: e, cba: e, cbn: e, cbre: e, center: e, ceo: e, cern: e, cfa: e, cfd: e, chanel: e, channel: e, charity: e, chase: e, chat: e, cheap: e, chintai: e, christmas: e, chrome: e, church: e, cipriani: e, circle: e, cisco: e, citadel: e, citi: e, citic: e, city: e, claims: e, cleaning: e, click: e, clinic: e, clinique: e, clothing: e, cloud: [1, { convex: t, elementor: t, encoway: [0, { eu: t }], statics: s, ravendb: t, axarnet: [0, { "es-1": t }], diadem: t, jelastic: [0, { vip: t }], jele: t, "jenv-aruba": [0, { aruba: [0, { eur: [0, { it1: t }] }], it1: t }], keliweb: [2, { cs: t }], oxa: [2, { tn: t, uk: t }], primetel: [2, { uk: t }], reclaim: [0, { ca: t, uk: t, us: t }], trendhosting: [0, { ch: t, de: t }], jote: t, jotelulu: t, kuleuven: t, laravel: t, linkyard: t, magentosite: s, matlab: t, observablehq: t, perspecta: t, vapor: t, "on-rancher": s, scw: [0, { baremetal: [0, { "fr-par-1": t, "fr-par-2": t, "nl-ams-1": t }], "fr-par": [0, { cockpit: t, ddl: t, dtwh: t, fnc: [2, { functions: t }], ifr: t, k8s: ne, kafk: t, mgdb: t, rdb: t, s3: t, "s3-website": t, scbl: t, whm: t }], instances: [0, { priv: t, pub: t }], k8s: t, "nl-ams": [0, { cockpit: t, ddl: t, dtwh: t, ifr: t, k8s: ne, kafk: t, mgdb: t, rdb: t, s3: t, "s3-website": t, scbl: t, whm: t }], "pl-waw": [0, { cockpit: t, ddl: t, dtwh: t, ifr: t, k8s: ne, kafk: t, mgdb: t, rdb: t, s3: t, "s3-website": t, scbl: t }], scalebook: t, smartlabeling: t }], servebolt: t, onstackit: [0, { runs: t }], trafficplex: t, "unison-services": t, urown: t, voorloper: t, zap: t }], club: [1, { cloudns: t, jele: t, barsy: t }], clubmed: e, coach: e, codes: [1, { owo: s }], coffee: e, college: e, cologne: e, commbank: e, community: [1, { nog: t, ravendb: t, myforum: t }], company: e, compare: e, computer: e, comsec: e, condos: e, construction: e, consulting: e, contact: e, contractors: e, cooking: e, cool: [1, { elementor: t, de: t }], corsica: e, country: e, coupon: e, coupons: e, courses: e, cpa: e, credit: e, creditcard: e, creditunion: e, cricket: e, crown: e, crs: e, cruise: e, cruises: e, cuisinella: e, cymru: e, cyou: e, dad: e, dance: e, data: e, date: e, dating: e, datsun: e, day: e, dclk: e, dds: e, deal: e, dealer: e, deals: e, degree: e, delivery: e, dell: e, deloitte: e, delta: e, democrat: e, dental: e, dentist: e, desi: e, design: [1, { graphic: t, bss: t }], dev: [1, { "12chars": t, myaddr: t, panel: t, lcl: s, lclstage: s, stg: s, stgstage: s, pages: t, r2: t, workers: t, deno: t, "deno-staging": t, deta: t, lp: [2, { api: t, objects: t }], evervault: a, fly: t, githubpreview: t, gateway: s, botdash: t, inbrowser: s, "is-a-good": t, iserv: t, leapcell: t, runcontainers: t, localcert: [0, { user: s }], loginline: t, barsy: t, mediatech: t, modx: t, ngrok: t, "ngrok-free": t, "is-a-fullstack": t, "is-cool": t, "is-not-a": t, localplayer: t, xmit: t, "platter-app": t, replit: [2, { archer: t, bones: t, canary: t, global: t, hacker: t, id: t, janeway: t, kim: t, kira: t, kirk: t, odo: t, paris: t, picard: t, pike: t, prerelease: t, reed: t, riker: t, sisko: t, spock: t, staging: t, sulu: t, tarpit: t, teams: t, tucker: t, wesley: t, worf: t }], crm: [0, { d: s, w: s, wa: s, wb: s, wc: s, wd: s, we: s, wf: s }], erp: Se, vercel: t, webhare: s, hrsn: t, "is-a": t }], dhl: e, diamonds: e, diet: e, digital: [1, { cloudapps: [2, { london: t }] }], direct: [1, { libp2p: t }], directory: e, discount: e, discover: e, dish: e, diy: e, dnp: e, docs: e, doctor: e, dog: e, domains: e, dot: e, download: e, drive: e, dtv: e, dubai: e, dunlop: e, dupont: e, durban: e, dvag: e, dvr: e, earth: e, eat: e, eco: e, edeka: e, education: D, email: [1, { crisp: [0, { on: t }], tawk: Za, tawkto: Za }], emerck: e, energy: e, engineer: e, engineering: e, enterprises: e, epson: e, equipment: e, ericsson: e, erni: e, esq: e, estate: [1, { compute: s }], eurovision: e, eus: [1, { party: Ga }], events: [1, { koobin: t, co: t }], exchange: e, expert: e, exposed: e, express: e, extraspace: e, fage: e, fail: e, fairwinds: e, faith: e, family: e, fan: e, fans: e, farm: [1, { storj: t }], farmers: e, fashion: e, fast: e, fedex: e, feedback: e, ferrari: e, ferrero: e, fidelity: e, fido: e, film: e, final: e, finance: e, financial: D, fire: e, firestone: e, firmdale: e, fish: e, fishing: e, fit: e, fitness: e, flickr: e, flights: e, flir: e, florist: e, flowers: e, fly: e, foo: e, food: e, football: e, ford: e, forex: e, forsale: e, forum: e, foundation: e, fox: e, free: e, fresenius: e, frl: e, frogans: e, frontier: e, ftr: e, fujitsu: e, fun: e, fund: e, furniture: e, futbol: e, fyi: e, gal: e, gallery: e, gallo: e, gallup: e, game: e, games: [1, { pley: t, sheezy: t }], gap: e, garden: e, gay: [1, { pages: t }], gbiz: e, gdn: [1, { cnpy: t }], gea: e, gent: e, genting: e, george: e, ggee: e, gift: e, gifts: e, gives: e, giving: e, glass: e, gle: e, global: [1, { appwrite: t }], globo: e, gmail: e, gmbh: e, gmo: e, gmx: e, godaddy: e, gold: e, goldpoint: e, golf: e, goo: e, goodyear: e, goog: [1, { cloud: t, translate: t, usercontent: s }], google: e, gop: e, got: e, grainger: e, graphics: e, gratis: e, green: e, gripe: e, grocery: e, group: [1, { discourse: t }], gucci: e, guge: e, guide: e, guitars: e, guru: e, hair: e, hamburg: e, hangout: e, haus: e, hbo: e, hdfc: e, hdfcbank: e, health: [1, { hra: t }], healthcare: e, help: e, helsinki: e, here: e, hermes: e, hiphop: e, hisamitsu: e, hitachi: e, hiv: e, hkt: e, hockey: e, holdings: e, holiday: e, homedepot: e, homegoods: e, homes: e, homesense: e, honda: e, horse: e, hospital: e, host: [1, { cloudaccess: t, freesite: t, easypanel: t, fastvps: t, myfast: t, tempurl: t, wpmudev: t, iserv: t, jele: t, mircloud: t, bolt: t, wp2: t, half: t }], hosting: [1, { opencraft: t }], hot: e, hotel: e, hotels: e, hotmail: e, house: e, how: e, hsbc: e, hughes: e, hyatt: e, hyundai: e, ibm: e, icbc: e, ice: e, icu: e, ieee: e, ifm: e, ikano: e, imamat: e, imdb: e, immo: e, immobilien: e, inc: e, industries: e, infiniti: e, ing: e, ink: e, institute: e, insurance: e, insure: e, international: e, intuit: e, investments: e, ipiranga: e, irish: e, ismaili: e, ist: e, istanbul: e, itau: e, itv: e, jaguar: e, java: e, jcb: e, jeep: e, jetzt: e, jewelry: e, jio: e, jll: e, jmp: e, jnj: e, joburg: e, jot: e, joy: e, jpmorgan: e, jprs: e, juegos: e, juniper: e, kaufen: e, kddi: e, kerryhotels: e, kerryproperties: e, kfh: e, kia: e, kids: e, kim: e, kindle: e, kitchen: e, kiwi: e, koeln: e, komatsu: e, kosher: e, kpmg: e, kpn: e, krd: [1, { co: t, edu: t }], kred: e, kuokgroup: e, kyoto: e, lacaixa: e, lamborghini: e, lamer: e, land: e, landrover: e, lanxess: e, lasalle: e, lat: e, latino: e, latrobe: e, law: e, lawyer: e, lds: e, lease: e, leclerc: e, lefrak: e, legal: e, lego: e, lexus: e, lgbt: e, lidl: e, life: e, lifeinsurance: e, lifestyle: e, lighting: e, like: e, lilly: e, limited: e, limo: e, lincoln: e, link: [1, { myfritz: t, cyon: t, dweb: s, inbrowser: s, nftstorage: si, mypep: t, storacha: si, w3s: si }], live: [1, { aem: t, hlx: t, ewp: s }], living: e, llc: e, llp: e, loan: e, loans: e, locker: e, locus: e, lol: [1, { omg: t }], london: e, lotte: e, lotto: e, love: e, lpl: e, lplfinancial: e, ltd: e, ltda: e, lundbeck: e, luxe: e, luxury: e, madrid: e, maif: e, maison: e, makeup: e, man: e, management: e, mango: e, map: e, market: e, marketing: e, markets: e, marriott: e, marshalls: e, mattel: e, mba: e, mckinsey: e, med: e, media: Fr, meet: e, melbourne: e, meme: e, memorial: e, men: e, menu: [1, { barsy: t, barsyonline: t }], merck: e, merckmsd: e, miami: e, microsoft: e, mini: e, mint: e, mit: e, mitsubishi: e, mlb: e, mls: e, mma: e, mobile: e, moda: e, moe: e, moi: e, mom: e, monash: e, money: e, monster: e, mormon: e, mortgage: e, moscow: e, moto: e, motorcycles: e, mov: e, movie: e, msd: e, mtn: e, mtr: e, music: e, nab: e, nagoya: e, navy: e, nba: e, nec: e, netbank: e, netflix: e, network: [1, { aem: t, alces: s, co: t, arvo: t, azimuth: t, tlon: t }], neustar: e, new: e, news: [1, { noticeable: t }], next: e, nextdirect: e, nexus: e, nfl: e, ngo: e, nhk: e, nico: e, nike: e, nikon: e, ninja: e, nissan: e, nissay: e, nokia: e, norton: e, now: e, nowruz: e, nowtv: e, nra: e, nrw: e, ntt: e, nyc: e, obi: e, observer: e, office: e, okinawa: e, olayan: e, olayangroup: e, ollo: e, omega: e, one: [1, { kin: s, service: t }], ong: [1, { obl: t }], onl: e, online: [1, { eero: t, "eero-stage": t, websitebuilder: t, leapcell: t, barsy: t }], ooo: e, open: e, oracle: e, orange: [1, { tech: t }], organic: e, origins: e, osaka: e, otsuka: e, ott: e, ovh: [1, { nerdpol: t }], page: [1, { aem: t, hlx: t, translated: t, codeberg: t, heyflow: t, prvcy: t, rocky: t, pdns: t, plesk: t }], panasonic: e, paris: e, pars: e, partners: e, parts: e, party: e, pay: e, pccw: e, pet: e, pfizer: e, pharmacy: e, phd: e, philips: e, phone: e, photo: e, photography: e, photos: Fr, physio: e, pics: e, pictet: e, pictures: [1, { 1337: t }], pid: e, pin: e, ping: e, pink: e, pioneer: e, pizza: [1, { ngrok: t }], place: D, play: e, playstation: e, plumbing: e, plus: e, pnc: e, pohl: e, poker: e, politie: e, porn: e, praxi: e, press: e, prime: e, prod: e, productions: e, prof: e, progressive: e, promo: e, properties: e, property: e, protection: e, pru: e, prudential: e, pub: [1, { id: s, kin: s, barsy: t }], pwc: e, qpon: e, quebec: e, quest: e, racing: e, radio: e, read: e, realestate: e, realtor: e, realty: e, recipes: e, red: e, redumbrella: e, rehab: e, reise: e, reisen: e, reit: e, reliance: e, ren: e, rent: e, rentals: e, repair: e, report: e, republican: e, rest: e, restaurant: e, review: e, reviews: [1, { aem: t }], rexroth: e, rich: e, richardli: e, ricoh: e, ril: e, rio: e, rip: [1, { clan: t }], rocks: [1, { myddns: t, stackit: t, "lima-city": t, webspace: t }], rodeo: e, rogers: e, room: e, rsvp: e, rugby: e, ruhr: e, run: [1, { appwrite: s, canva: t, development: t, ravendb: t, liara: [2, { iran: t }], lovable: t, build: s, code: s, database: s, migration: s, onporter: t, repl: t, stackit: t, val: Se, vercel: t, wix: t }], rwe: e, ryukyu: e, saarland: e, safe: e, safety: e, sakura: e, sale: e, salon: e, samsclub: e, samsung: e, sandvik: e, sandvikcoromant: e, sanofi: e, sap: e, sarl: e, sas: e, save: e, saxo: e, sbi: e, sbs: e, scb: e, schaeffler: e, schmidt: e, scholarships: e, school: e, schule: e, schwarz: e, science: e, scot: [1, { gov: [2, { service: t }] }], search: e, seat: e, secure: e, security: e, seek: e, select: e, sener: e, services: [1, { loginline: t }], seven: e, sew: e, sex: e, sexy: e, sfr: e, shangrila: e, sharp: e, shell: e, shia: e, shiksha: e, shoes: e, shop: [1, { base: t, hoplix: t, barsy: t, barsyonline: t, shopware: t }], shopping: e, shouji: e, show: e, silk: e, sina: e, singles: e, site: [1, { square: t, canva: ue, cloudera: s, convex: t, cyon: t, caffeine: t, fastvps: t, figma: t, preview: t, heyflow: t, jele: t, jouwweb: t, loginline: t, barsy: t, notion: t, omniwe: t, opensocial: t, madethis: t, support: t, platformsh: s, tst: s, byen: t, srht: t, novecore: t, cpanel: t, wpsquared: t, sourcecraft: t }], ski: e, skin: e, sky: e, skype: e, sling: e, smart: e, smile: e, sncf: e, soccer: e, social: e, softbank: e, software: e, sohu: e, solar: e, solutions: e, song: e, sony: e, soy: e, spa: e, space: [1, { myfast: t, heiyu: t, hf: [2, { static: t }], "app-ionos": t, project: t, uber: t, xs4all: t }], sport: e, spot: e, srl: e, stada: e, staples: e, star: e, statebank: e, statefarm: e, stc: e, stcgroup: e, stockholm: e, storage: e, store: [1, { barsy: t, sellfy: t, shopware: t, storebase: t }], stream: e, studio: e, study: e, style: e, sucks: e, supplies: e, supply: e, support: [1, { barsy: t }], surf: e, surgery: e, suzuki: e, swatch: e, swiss: e, sydney: e, systems: [1, { knightpoint: t }], tab: e, taipei: e, talk: e, taobao: e, target: e, tatamotors: e, tatar: e, tattoo: e, tax: e, taxi: e, tci: e, tdk: e, team: [1, { discourse: t, jelastic: t }], tech: [1, { cleverapps: t }], technology: D, temasek: e, tennis: e, teva: e, thd: e, theater: e, theatre: e, tiaa: e, tickets: e, tienda: e, tips: e, tires: e, tirol: e, tjmaxx: e, tjx: e, tkmaxx: e, tmall: e, today: [1, { prequalifyme: t }], tokyo: e, tools: [1, { addr: gn, myaddr: t }], top: [1, { ntdll: t, wadl: s }], toray: e, toshiba: e, total: e, tours: e, town: e, toyota: e, toys: e, trade: e, trading: e, training: e, travel: e, travelers: e, travelersinsurance: e, trust: e, trv: e, tube: e, tui: e, tunes: e, tushu: e, tvs: e, ubank: e, ubs: e, unicom: e, university: e, uno: e, uol: e, ups: e, vacations: e, vana: e, vanguard: e, vegas: e, ventures: e, verisign: e, versicherung: e, vet: e, viajes: e, video: e, vig: e, viking: e, villas: e, vin: e, vip: [1, { hidns: t }], virgin: e, visa: e, vision: e, viva: e, vivo: e, vlaanderen: e, vodka: e, volvo: e, vote: e, voting: e, voto: e, voyage: e, wales: e, walmart: e, walter: e, wang: e, wanggou: e, watch: e, watches: e, weather: e, weatherchannel: e, webcam: e, weber: e, website: Fr, wed: e, wedding: e, weibo: e, weir: e, whoswho: e, wien: e, wiki: Fr, williamhill: e, win: e, windows: e, wine: e, winners: e, wme: e, wolterskluwer: e, woodside: e, work: e, works: e, world: e, wow: e, wtc: e, wtf: e, xbox: e, xerox: e, xihuan: e, xin: e, "xn--11b4c3d": e, कॉम: e, "xn--1ck2e1b": e, セール: e, "xn--1qqw23a": e, 佛山: e, "xn--30rr7y": e, 慈善: e, "xn--3bst00m": e, 集团: e, "xn--3ds443g": e, 在线: e, "xn--3pxu8k": e, 点看: e, "xn--42c2d9a": e, คอม: e, "xn--45q11c": e, 八卦: e, "xn--4gbrim": e, موقع: e, "xn--55qw42g": e, 公益: e, "xn--55qx5d": e, 公司: e, "xn--5su34j936bgsg": e, 香格里拉: e, "xn--5tzm5g": e, 网站: e, "xn--6frz82g": e, 移动: e, "xn--6qq986b3xl": e, 我爱你: e, "xn--80adxhks": e, москва: e, "xn--80aqecdr1a": e, католик: e, "xn--80asehdb": e, онлайн: e, "xn--80aswg": e, сайт: e, "xn--8y0a063a": e, 联通: e, "xn--9dbq2a": e, קום: e, "xn--9et52u": e, 时尚: e, "xn--9krt00a": e, 微博: e, "xn--b4w605ferd": e, 淡马锡: e, "xn--bck1b9a5dre4c": e, ファッション: e, "xn--c1avg": e, орг: e, "xn--c2br7g": e, नेट: e, "xn--cck2b3b": e, ストア: e, "xn--cckwcxetd": e, アマゾン: e, "xn--cg4bki": e, 삼성: e, "xn--czr694b": e, 商标: e, "xn--czrs0t": e, 商店: e, "xn--czru2d": e, 商城: e, "xn--d1acj3b": e, дети: e, "xn--eckvdtc9d": e, ポイント: e, "xn--efvy88h": e, 新闻: e, "xn--fct429k": e, 家電: e, "xn--fhbei": e, كوم: e, "xn--fiq228c5hs": e, 中文网: e, "xn--fiq64b": e, 中信: e, "xn--fjq720a": e, 娱乐: e, "xn--flw351e": e, 谷歌: e, "xn--fzys8d69uvgm": e, 電訊盈科: e, "xn--g2xx48c": e, 购物: e, "xn--gckr3f0f": e, クラウド: e, "xn--gk3at1e": e, 通販: e, "xn--hxt814e": e, 网店: e, "xn--i1b6b1a6a2e": e, संगठन: e, "xn--imr513n": e, 餐厅: e, "xn--io0a7i": e, 网络: e, "xn--j1aef": e, ком: e, "xn--jlq480n2rg": e, 亚马逊: e, "xn--jvr189m": e, 食品: e, "xn--kcrx77d1x4a": e, 飞利浦: e, "xn--kput3i": e, 手机: e, "xn--mgba3a3ejt": e, ارامكو: e, "xn--mgba7c0bbn0a": e, العليان: e, "xn--mgbab2bd": e, بازار: e, "xn--mgbca7dzdo": e, ابوظبي: e, "xn--mgbi4ecexp": e, كاثوليك: e, "xn--mgbt3dhd": e, همراه: e, "xn--mk1bu44c": e, 닷컴: e, "xn--mxtq1m": e, 政府: e, "xn--ngbc5azd": e, شبكة: e, "xn--ngbe9e0a": e, بيتك: e, "xn--ngbrx": e, عرب: e, "xn--nqv7f": e, 机构: e, "xn--nqv7fs00ema": e, 组织机构: e, "xn--nyqy26a": e, 健康: e, "xn--otu796d": e, 招聘: e, "xn--p1acf": [1, { "xn--90amc": t, "xn--j1aef": t, "xn--j1ael8b": t, "xn--h1ahn": t, "xn--j1adp": t, "xn--c1avg": t, "xn--80aaa0cvac": t, "xn--h1aliz": t, "xn--90a1af": t, "xn--41a": t }], рус: [1, { биз: t, ком: t, крым: t, мир: t, мск: t, орг: t, самара: t, сочи: t, спб: t, я: t }], "xn--pssy2u": e, 大拿: e, "xn--q9jyb4c": e, みんな: e, "xn--qcka1pmc": e, グーグル: e, "xn--rhqv96g": e, 世界: e, "xn--rovu88b": e, 書籍: e, "xn--ses554g": e, 网址: e, "xn--t60b56a": e, 닷넷: e, "xn--tckwe": e, コム: e, "xn--tiq49xqyj": e, 天主教: e, "xn--unup4y": e, 游戏: e, "xn--vermgensberater-ctb": e, vermögensberater: e, "xn--vermgensberatung-pwb": e, vermögensberatung: e, "xn--vhquv": e, 企业: e, "xn--vuq861b": e, 信息: e, "xn--w4r85el8fhu5dnra": e, 嘉里大酒店: e, "xn--w4rs40l": e, 嘉里: e, "xn--xhq521b": e, 广东: e, "xn--zfr164b": e, 政务: e, xyz: [1, { botdash: t, telebit: s }], yachts: e, yahoo: e, yamaxun: e, yandex: e, yodobashi: e, yoga: e, yokohama: e, you: e, youtube: e, yun: e, zappos: e, zara: e, zero: e, zip: e, zone: [1, { triton: s, stackit: t, lima: t }], zuerich: e }];
}();
function fo(e, t, n, r) {
  let s = null, i = t;
  for (; i !== void 0 && (i[0] & r && (s = {
    index: n + 1,
    isIcann: i[0] === 1,
    isPrivate: i[0] === 2
  }), n !== -1); ) {
    const a = i[1];
    i = Object.prototype.hasOwnProperty.call(a, e[n]) ? a[e[n]] : a["*"], n -= 1;
  }
  return s;
}
function Rp(e, t, n) {
  var r;
  if (Dp(e, t, n))
    return;
  const s = e.split("."), i = (t.allowPrivateDomains ? 2 : 0) | (t.allowIcannDomains ? 1 : 0), a = fo(s, Ap, s.length - 1, i);
  if (a !== null) {
    n.isIcann = a.isIcann, n.isPrivate = a.isPrivate, n.publicSuffix = s.slice(a.index + 1).join(".");
    return;
  }
  const o = fo(s, Cp, s.length - 1, i);
  if (o !== null) {
    n.isIcann = o.isIcann, n.isPrivate = o.isPrivate, n.publicSuffix = s.slice(o.index).join(".");
    return;
  }
  n.isIcann = !1, n.isPrivate = !1, n.publicSuffix = (r = s[s.length - 1]) !== null && r !== void 0 ? r : null;
}
const po = Np();
function Lp(e, t = {}) {
  return _p(po), Op(e, 3, Rp, t, po).domain;
}
function vu(e, t) {
  return !!(t === e || e.indexOf(t) === 0 && (t[t.length - 1] === "/" || e.startsWith(t) && e[t.length] === "/"));
}
var ho = ["local", "example", "invalid", "localhost", "test"], jp = ["localhost", "invalid"], Pp = {
  allowSpecialUseDomain: !1,
  ignoreError: !1
};
function la(e, t = {}) {
  t = { ...Pp, ...t };
  const n = e.split("."), r = n[n.length - 1], s = !!t.allowSpecialUseDomain, i = !!t.ignoreError;
  if (s && r !== void 0 && ho.includes(r)) {
    if (n.length > 1)
      return `${n[n.length - 2]}.${r}`;
    if (jp.includes(r))
      return r;
  }
  if (!i && r !== void 0 && ho.includes(r))
    throw new Error(
      `Cookie has domain set to the public suffix "${r}" which is a special use domain. To allow this, configure your CookieJar with {allowSpecialUseDomain: true, rejectPublicSuffixes: false}.`
    );
  const a = Lp(e, {
    allowIcannDomains: !0,
    allowPrivateDomains: !0
  });
  if (a) return a;
}
function $p(e, t) {
  const n = la(e, {
    allowSpecialUseDomain: t
  });
  if (!n)
    return;
  if (n == e)
    return [e];
  e.slice(-1) == "." && (e = e.slice(0, -1));
  const s = e.slice(0, -(n.length + 1)).split(".").reverse();
  let i = n;
  const a = [i];
  for (; s.length; )
    i = `${s.shift()}.${i}`, a.push(i);
  return a;
}
var bu = class {
  constructor() {
    this.synchronous = !1;
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  findCookie(e, t, n, r) {
    throw new Error("findCookie is not implemented");
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  findCookies(e, t, n = !1, r) {
    throw new Error("findCookies is not implemented");
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  putCookie(e, t) {
    throw new Error("putCookie is not implemented");
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  updateCookie(e, t, n) {
    throw new Error("updateCookie is not implemented");
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  removeCookie(e, t, n, r) {
    throw new Error("removeCookie is not implemented");
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  removeCookies(e, t, n) {
    throw new Error("removeCookies is not implemented");
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  removeAllCookies(e) {
    throw new Error("removeAllCookies is not implemented");
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  getAllCookies(e) {
    throw new Error(
      "getAllCookies is not implemented (therefore jar cannot be serialized)"
    );
  }
}, da = (e) => Object.prototype.toString.call(e), Mp = (e, t) => typeof e.join != "function" ? da(e) : (t.add(e), e.map(
  (r) => r == null || t.has(r) ? "" : ku(r, t)
).join()), ku = (e, t = /* @__PURE__ */ new WeakSet()) => typeof e != "object" || e === null ? String(e) : typeof e.toString == "function" ? Array.isArray(e) ? (
  // Arrays have a weird custom toString that we need to replicate
  Mp(e, t)
) : (
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  String(e)
) : da(e), Ri = (e) => ku(e);
function Te(e) {
  let t, n, r;
  const s = new Promise((i, a) => {
    n = i, r = a;
  });
  return typeof e == "function" ? t = (i, a) => {
    try {
      i ? e(i) : e(null, a);
    } catch (o) {
      r(o instanceof Error ? o : new Error());
    }
  } : t = (i, a) => {
    try {
      i ? r(i) : n(a);
    } catch (o) {
      r(o instanceof Error ? o : new Error());
    }
  }, {
    promise: s,
    callback: t,
    resolve: (i) => (t(null, i), s),
    reject: (i) => (t(i), s)
  };
}
function dr(e, t) {
  return e in t;
}
var wu = class extends bu {
  /**
   * Create a new {@link MemoryCookieStore}.
   */
  constructor() {
    super(), this.synchronous = !0, this.idx = /* @__PURE__ */ Object.create(null);
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  findCookie(e, t, n, r) {
    var a, o;
    const s = Te(r);
    if (e == null || t == null || n == null)
      return s.resolve(void 0);
    const i = (o = (a = this.idx[e]) == null ? void 0 : a[t]) == null ? void 0 : o[n];
    return s.resolve(i);
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  findCookies(e, t, n = !1, r) {
    typeof n == "function" && (r = n, n = !0);
    const s = [], i = Te(r);
    if (!e)
      return i.resolve([]);
    let a;
    t ? a = function(l) {
      for (const d in l)
        if (vu(t, d)) {
          const p = l[d];
          for (const h in p) {
            const m = p[h];
            m && s.push(m);
          }
        }
    } : a = function(l) {
      for (const d in l) {
        const p = l[d];
        for (const h in p) {
          const m = p[h];
          m && s.push(m);
        }
      }
    };
    const o = $p(e, n) || [e], c = this.idx;
    return o.forEach((u) => {
      const l = c[u];
      l && a(l);
    }), i.resolve(s);
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  putCookie(e, t) {
    const n = Te(t), { domain: r, path: s, key: i } = e;
    if (r == null || s == null || i == null)
      return n.resolve(void 0);
    const a = this.idx[r] ?? /* @__PURE__ */ Object.create(null);
    this.idx[r] = a;
    const o = a[s] ?? /* @__PURE__ */ Object.create(null);
    return a[s] = o, o[i] = e, n.resolve(void 0);
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  updateCookie(e, t, n) {
    if (n) this.putCookie(t, n);
    else return this.putCookie(t);
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  removeCookie(e, t, n, r) {
    var i, a;
    const s = Te(r);
    return (a = (i = this.idx[e]) == null ? void 0 : i[t]) == null || delete a[n], s.resolve(void 0);
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  removeCookies(e, t, n) {
    const r = Te(n), s = this.idx[e];
    return s && (t ? delete s[t] : delete this.idx[e]), r.resolve(void 0);
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  removeAllCookies(e) {
    const t = Te(e);
    return this.idx = /* @__PURE__ */ Object.create(null), t.resolve(void 0);
  }
  /**
   * @internal No doc because this is an overload that supports the implementation
   */
  getAllCookies(e) {
    const t = Te(e), n = [], r = this.idx;
    return Object.keys(r).forEach((i) => {
      const a = r[i] ?? {};
      Object.keys(a).forEach((c) => {
        const u = a[c] ?? {};
        Object.keys(u).forEach((d) => {
          const p = u[d];
          p != null && n.push(p);
        });
      });
    }), n.sort((i, a) => (i.creationIndex || 0) - (a.creationIndex || 0)), t.resolve(n);
  }
};
function ai(e) {
  return Tu(e) && e !== "";
}
function fa(e) {
  return e === "" || e instanceof String && e.toString() === "";
}
function Tu(e) {
  return typeof e == "string" || e instanceof String;
}
function es(e) {
  return da(e) === "[object Object]";
}
function Jn(e, t, n) {
  if (e) return;
  const r = typeof t == "function" ? t : void 0;
  let s = typeof t == "function" ? n : t;
  es(s) || (s = "[object Object]");
  const i = new Eu(Ri(s));
  if (r) r(i);
  else throw i;
}
var Eu = class extends Error {
}, Fp = "6.0.0", nn = {
  SILENT: "silent",
  STRICT: "strict",
  DISABLED: "unsafe-disabled"
};
Object.freeze(nn);
var Up = `
\\[?(?:
(?:[a-fA-F\\d]{1,4}:){7}(?:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,2}|:)|
(?:[a-fA-F\\d]{1,4}:){4}(?:(?::[a-fA-F\\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,3}|:)|
(?:[a-fA-F\\d]{1,4}:){3}(?:(?::[a-fA-F\\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){2}(?:(?::[a-fA-F\\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,5}|:)|
(?:[a-fA-F\\d]{1,4}:){1}(?:(?::[a-fA-F\\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,6}|:)|
(?::(?:(?::[a-fA-F\\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,7}|:))
)(?:%[0-9a-zA-Z]{1,})?\\]?
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim(), pa = new RegExp(`^${Up}$`), zp = "(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])", qp = new RegExp(`^${zp}$`);
function mo(e) {
  return new URL(`http://${e}`).hostname;
}
function ds(e) {
  if (e == null)
    return;
  let t = e.trim().replace(/^\./, "");
  return pa.test(t) ? (t.startsWith("[") || (t = "[" + t), t.endsWith("]") || (t = t + "]"), mo(t).slice(1, -1)) : /[^\u0001-\u007f]/.test(t) ? mo(t) : t.toLowerCase();
}
function Vp(e) {
  return e.toUTCString();
}
var Bp = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/, ze = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11
};
function Li(e, t, n, r) {
  let s = 0;
  for (; s < e.length; ) {
    const i = e.charCodeAt(s);
    if (i <= 47 || i >= 58)
      break;
    s++;
  }
  if (!(s < t || s > n) && !(!r && s != e.length))
    return parseInt(e.slice(0, s), 10);
}
function Hp(e) {
  const t = e.split(":"), n = [0, 0, 0];
  if (t.length === 3) {
    for (let r = 0; r < 3; r++) {
      const s = r == 2, i = t[r];
      if (i === void 0)
        return;
      const a = Li(i, 1, 2, s);
      if (a === void 0)
        return;
      n[r] = a;
    }
    return n;
  }
}
function Zp(e) {
  switch (e = String(e).slice(0, 3).toLowerCase(), e) {
    case "jan":
      return ze.jan;
    case "feb":
      return ze.feb;
    case "mar":
      return ze.mar;
    case "apr":
      return ze.apr;
    case "may":
      return ze.may;
    case "jun":
      return ze.jun;
    case "jul":
      return ze.jul;
    case "aug":
      return ze.aug;
    case "sep":
      return ze.sep;
    case "oct":
      return ze.oct;
    case "nov":
      return ze.nov;
    case "dec":
      return ze.dec;
    default:
      return;
  }
}
function ji(e) {
  if (!e)
    return;
  const t = e.split(Bp);
  let n, r, s, i, a, o;
  for (let c = 0; c < t.length; c++) {
    const u = (t[c] ?? "").trim();
    if (u.length) {
      if (s === void 0) {
        const l = Hp(u);
        if (l) {
          n = l[0], r = l[1], s = l[2];
          continue;
        }
      }
      if (i === void 0) {
        const l = Li(u, 1, 2, !0);
        if (l !== void 0) {
          i = l;
          continue;
        }
      }
      if (a === void 0) {
        const l = Zp(u);
        if (l !== void 0) {
          a = l;
          continue;
        }
      }
      if (o === void 0) {
        const l = Li(u, 2, 4, !0);
        l !== void 0 && (o = l, o >= 70 && o <= 99 ? o += 1900 : o >= 0 && o <= 69 && (o += 2e3));
      }
    }
  }
  if (!(i === void 0 || a === void 0 || o === void 0 || n === void 0 || r === void 0 || s === void 0 || i < 1 || i > 31 || o < 1601 || n > 23 || r > 59 || s > 59))
    return new Date(Date.UTC(o, a, i, n, r, s));
}
var Gp = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/, Wp = /[\x20-\x3A\x3C-\x7E]+/, go = /[\x00-\x1F]/, yo = [`
`, "\r", "\0"];
function Jp(e) {
  if (fa(e)) return e;
  for (let t = 0; t < yo.length; t++) {
    const n = yo[t], r = n ? e.indexOf(n) : -1;
    r !== -1 && (e = e.slice(0, r));
  }
  return e;
}
function Yp(e, t) {
  e = Jp(e);
  let n = e.indexOf("=");
  if (t)
    n === 0 && (e = e.substring(1), n = e.indexOf("="));
  else if (n <= 0)
    return;
  let r, s;
  if (n <= 0 ? (r = "", s = e.trim()) : (r = e.slice(0, n).trim(), s = e.slice(n + 1).trim()), go.test(r) || go.test(s))
    return;
  const i = new Le();
  return i.key = r, i.value = s, i;
}
function Qp(e, t) {
  if (fa(e) || !Tu(e))
    return;
  e = e.trim();
  const n = e.indexOf(";"), r = n === -1 ? e : e.slice(0, n), s = Yp(r, (t == null ? void 0 : t.loose) ?? !1);
  if (!s)
    return;
  if (n === -1)
    return s;
  const i = e.slice(n + 1).trim();
  if (i.length === 0)
    return s;
  const a = i.split(";");
  for (; a.length; ) {
    const o = (a.shift() ?? "").trim();
    if (o.length === 0)
      continue;
    const c = o.indexOf("=");
    let u, l;
    switch (c === -1 ? (u = o, l = null) : (u = o.slice(0, c), l = o.slice(c + 1)), u = u.trim().toLowerCase(), l && (l = l.trim()), u) {
      case "expires":
        if (l) {
          const d = ji(l);
          d && (s.expires = d);
        }
        break;
      case "max-age":
        if (l && /^-?[0-9]+$/.test(l)) {
          const d = parseInt(l, 10);
          s.setMaxAge(d);
        }
        break;
      case "domain":
        if (l) {
          const d = l.trim().replace(/^\./, "");
          d && (s.domain = d.toLowerCase());
        }
        break;
      case "path":
        s.path = l && l[0] === "/" ? l : null;
        break;
      case "secure":
        s.secure = !0;
        break;
      case "httponly":
        s.httpOnly = !0;
        break;
      case "samesite":
        switch (l ? l.toLowerCase() : "") {
          case "strict":
            s.sameSite = "strict";
            break;
          case "lax":
            s.sameSite = "lax";
            break;
          case "none":
            s.sameSite = "none";
            break;
          default:
            s.sameSite = void 0;
            break;
        }
        break;
      default:
        s.extensions = s.extensions || [], s.extensions.push(o);
        break;
    }
  }
  return s;
}
function vo(e) {
  if (!e || fa(e))
    return;
  let t;
  if (typeof e == "string")
    try {
      t = JSON.parse(e);
    } catch {
      return;
    }
  else
    t = e;
  const n = new Le();
  return Le.serializableProperties.forEach((r) => {
    if (t && typeof t == "object" && dr(r, t)) {
      const s = t[r];
      if (s === void 0 || dr(r, ye) && s === ye[r])
        return;
      switch (r) {
        case "key":
        case "value":
        case "sameSite":
          typeof s == "string" && (n[r] = s);
          break;
        case "expires":
        case "creation":
        case "lastAccessed":
          typeof s == "number" || typeof s == "string" || s instanceof Date ? n[r] = t[r] == "Infinity" ? "Infinity" : new Date(s) : s === null && (n[r] = null);
          break;
        case "maxAge":
          (typeof s == "number" || s === "Infinity" || s === "-Infinity") && (n[r] = s);
          break;
        case "domain":
        case "path":
          (typeof s == "string" || s === null) && (n[r] = s);
          break;
        case "secure":
        case "httpOnly":
          typeof s == "boolean" && (n[r] = s);
          break;
        case "extensions":
          Array.isArray(s) && s.every((i) => typeof i == "string") && (n[r] = s);
          break;
        case "hostOnly":
        case "pathIsDefault":
          (typeof s == "boolean" || s === null) && (n[r] = s);
          break;
      }
    }
  }), n;
}
var ye = {
  // the order in which the RFC has them:
  key: "",
  value: "",
  expires: "Infinity",
  maxAge: null,
  domain: null,
  path: null,
  secure: !1,
  httpOnly: !1,
  extensions: null,
  // set by the CookieJar:
  hostOnly: null,
  pathIsDefault: null,
  creation: null,
  lastAccessed: null,
  sameSite: void 0
}, Or = class Pt {
  /**
   * Create a new Cookie instance.
   * @public
   * @param options - The attributes to set on the cookie
   */
  constructor(t = {}) {
    this.key = t.key ?? ye.key, this.value = t.value ?? ye.value, this.expires = t.expires ?? ye.expires, this.maxAge = t.maxAge ?? ye.maxAge, this.domain = t.domain ?? ye.domain, this.path = t.path ?? ye.path, this.secure = t.secure ?? ye.secure, this.httpOnly = t.httpOnly ?? ye.httpOnly, this.extensions = t.extensions ?? ye.extensions, this.creation = t.creation ?? ye.creation, this.hostOnly = t.hostOnly ?? ye.hostOnly, this.pathIsDefault = t.pathIsDefault ?? ye.pathIsDefault, this.lastAccessed = t.lastAccessed ?? ye.lastAccessed, this.sameSite = t.sameSite ?? ye.sameSite, this.creation = t.creation ?? /* @__PURE__ */ new Date(), Object.defineProperty(this, "creationIndex", {
      configurable: !1,
      enumerable: !1,
      // important for assert.deepEqual checks
      writable: !0,
      value: ++Pt.cookiesCreated
    }), this.creationIndex = Pt.cookiesCreated;
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    const t = Date.now(), n = this.hostOnly != null ? this.hostOnly.toString() : "?", r = this.creation && this.creation !== "Infinity" ? `${String(t - this.creation.getTime())}ms` : "?", s = this.lastAccessed && this.lastAccessed !== "Infinity" ? `${String(t - this.lastAccessed.getTime())}ms` : "?";
    return `Cookie="${this.toString()}; hostOnly=${n}; aAge=${s}; cAge=${r}"`;
  }
  /**
   * For convenience in using `JSON.stringify(cookie)`. Returns a plain-old Object that can be JSON-serialized.
   *
   * @remarks
   * - Any `Date` properties (such as {@link Cookie.expires}, {@link Cookie.creation}, and {@link Cookie.lastAccessed}) are exported in ISO format (`Date.toISOString()`).
   *
   *  - Custom Cookie properties are discarded. In tough-cookie 1.x, since there was no {@link Cookie.toJSON} method explicitly defined, all enumerable properties were captured.
   *      If you want a property to be serialized, add the property name to {@link Cookie.serializableProperties}.
   */
  toJSON() {
    const t = {};
    for (const n of Pt.serializableProperties) {
      const r = this[n];
      if (r !== ye[n])
        switch (n) {
          case "key":
          case "value":
          case "sameSite":
            typeof r == "string" && (t[n] = r);
            break;
          case "expires":
          case "creation":
          case "lastAccessed":
            typeof r == "number" || typeof r == "string" || r instanceof Date ? t[n] = r == "Infinity" ? "Infinity" : new Date(r).toISOString() : r === null && (t[n] = null);
            break;
          case "maxAge":
            (typeof r == "number" || r === "Infinity" || r === "-Infinity") && (t[n] = r);
            break;
          case "domain":
          case "path":
            (typeof r == "string" || r === null) && (t[n] = r);
            break;
          case "secure":
          case "httpOnly":
            typeof r == "boolean" && (t[n] = r);
            break;
          case "extensions":
            Array.isArray(r) && (t[n] = r);
            break;
          case "hostOnly":
          case "pathIsDefault":
            (typeof r == "boolean" || r === null) && (t[n] = r);
            break;
        }
    }
    return t;
  }
  /**
   * Does a deep clone of this cookie, implemented exactly as `Cookie.fromJSON(cookie.toJSON())`.
   * @public
   */
  clone() {
    return vo(this.toJSON());
  }
  /**
   * Validates cookie attributes for semantic correctness. Useful for "lint" checking any `Set-Cookie` headers you generate.
   * For now, it returns a boolean, but eventually could return a reason string.
   *
   * @remarks
   * Works for a few things, but is by no means comprehensive.
   *
   * @beta
   */
  validate() {
    if (!this.value || !Gp.test(this.value) || this.expires != "Infinity" && !(this.expires instanceof Date) && !ji(this.expires) || this.maxAge != null && this.maxAge !== "Infinity" && (this.maxAge === "-Infinity" || this.maxAge <= 0) || this.path != null && !Wp.test(this.path))
      return !1;
    const t = this.cdomain();
    return !(t && (t.match(/\.$/) || la(t) == null));
  }
  /**
   * Sets the 'Expires' attribute on a cookie.
   *
   * @remarks
   * When given a `string` value it will be parsed with {@link parseDate}. If the value can't be parsed as a cookie date
   * then the 'Expires' attribute will be set to `"Infinity"`.
   *
   * @param exp - the new value for the 'Expires' attribute of the cookie.
   */
  setExpires(t) {
    t instanceof Date ? this.expires = t : this.expires = ji(t) || "Infinity";
  }
  /**
   * Sets the 'Max-Age' attribute (in seconds) on a cookie.
   *
   * @remarks
   * Coerces `-Infinity` to `"-Infinity"` and `Infinity` to `"Infinity"` so it can be serialized to JSON.
   *
   * @param age - the new value for the 'Max-Age' attribute (in seconds).
   */
  setMaxAge(t) {
    t === 1 / 0 ? this.maxAge = "Infinity" : t === -1 / 0 ? this.maxAge = "-Infinity" : this.maxAge = t;
  }
  /**
   * Encodes to a `Cookie` header value (specifically, the {@link Cookie.key} and {@link Cookie.value} properties joined with "=").
   * @public
   */
  cookieString() {
    const t = this.value || "";
    return this.key ? `${this.key}=${t}` : t;
  }
  /**
   * Encodes to a `Set-Cookie header` value.
   * @public
   */
  toString() {
    let t = this.cookieString();
    return this.expires != "Infinity" && this.expires instanceof Date && (t += `; Expires=${Vp(this.expires)}`), this.maxAge != null && this.maxAge != 1 / 0 && (t += `; Max-Age=${String(this.maxAge)}`), this.domain && !this.hostOnly && (t += `; Domain=${this.domain}`), this.path && (t += `; Path=${this.path}`), this.secure && (t += "; Secure"), this.httpOnly && (t += "; HttpOnly"), this.sameSite && this.sameSite !== "none" && (this.sameSite.toLowerCase() === Pt.sameSiteCanonical.lax.toLowerCase() ? t += `; SameSite=${Pt.sameSiteCanonical.lax}` : this.sameSite.toLowerCase() === Pt.sameSiteCanonical.strict.toLowerCase() ? t += `; SameSite=${Pt.sameSiteCanonical.strict}` : t += `; SameSite=${this.sameSite}`), this.extensions && this.extensions.forEach((n) => {
      t += `; ${n}`;
    }), t;
  }
  /**
   * Computes the TTL relative to now (milliseconds).
   *
   * @remarks
   * - `Infinity` is returned for cookies without an explicit expiry
   *
   * - `0` is returned if the cookie is expired.
   *
   * - Otherwise a time-to-live in milliseconds is returned.
   *
   * @param now - passing an explicit value is mostly used for testing purposes since this defaults to the `Date.now()`
   * @public
   */
  TTL(t = Date.now()) {
    if (this.maxAge != null && typeof this.maxAge == "number")
      return this.maxAge <= 0 ? 0 : this.maxAge * 1e3;
    const n = this.expires;
    return n === "Infinity" ? 1 / 0 : ((n == null ? void 0 : n.getTime()) ?? t) - (t || Date.now());
  }
  /**
   * Computes the absolute unix-epoch milliseconds that this cookie expires.
   *
   * The "Max-Age" attribute takes precedence over "Expires" (as per the RFC). The {@link Cookie.lastAccessed} attribute
   * (or the `now` parameter if given) is used to offset the {@link Cookie.maxAge} attribute.
   *
   * If Expires ({@link Cookie.expires}) is set, that's returned.
   *
   * @param now - can be used to provide a time offset (instead of {@link Cookie.lastAccessed}) to use when calculating the "Max-Age" value
   */
  expiryTime(t) {
    if (this.maxAge != null) {
      const n = t || this.lastAccessed || /* @__PURE__ */ new Date(), r = typeof this.maxAge == "number" ? this.maxAge : -1 / 0, s = r <= 0 ? -1 / 0 : r * 1e3;
      return n === "Infinity" ? 1 / 0 : n.getTime() + s;
    }
    return this.expires == "Infinity" ? 1 / 0 : this.expires ? this.expires.getTime() : void 0;
  }
  /**
   * Similar to {@link Cookie.expiryTime}, computes the absolute unix-epoch milliseconds that this cookie expires and returns it as a Date.
   *
   * The "Max-Age" attribute takes precedence over "Expires" (as per the RFC). The {@link Cookie.lastAccessed} attribute
   * (or the `now` parameter if given) is used to offset the {@link Cookie.maxAge} attribute.
   *
   * If Expires ({@link Cookie.expires}) is set, that's returned.
   *
   * @param now - can be used to provide a time offset (instead of {@link Cookie.lastAccessed}) to use when calculating the "Max-Age" value
   */
  expiryDate(t) {
    const n = this.expiryTime(t);
    return n == 1 / 0 ? /* @__PURE__ */ new Date(2147483647e3) : n == -1 / 0 ? /* @__PURE__ */ new Date(0) : n == null ? void 0 : new Date(n);
  }
  /**
   * Indicates if the cookie has been persisted to a store or not.
   * @public
   */
  isPersistent() {
    return this.maxAge != null || this.expires != "Infinity";
  }
  /**
   * Calls {@link canonicalDomain} with the {@link Cookie.domain} property.
   * @public
   */
  canonicalizedDomain() {
    return ds(this.domain);
  }
  /**
   * Alias for {@link Cookie.canonicalizedDomain}
   * @public
   */
  cdomain() {
    return ds(this.domain);
  }
  /**
   * Parses a string into a Cookie object.
   *
   * @remarks
   * Note: when parsing a `Cookie` header it must be split by ';' before each Cookie string can be parsed.
   *
   * @example
   * ```
   * // parse a `Set-Cookie` header
   * const setCookieHeader = 'a=bcd; Expires=Tue, 18 Oct 2011 07:05:03 GMT'
   * const cookie = Cookie.parse(setCookieHeader)
   * cookie.key === 'a'
   * cookie.value === 'bcd'
   * cookie.expires === new Date(Date.parse('Tue, 18 Oct 2011 07:05:03 GMT'))
   * ```
   *
   * @example
   * ```
   * // parse a `Cookie` header
   * const cookieHeader = 'name=value; name2=value2; name3=value3'
   * const cookies = cookieHeader.split(';').map(Cookie.parse)
   * cookies[0].name === 'name'
   * cookies[0].value === 'value'
   * cookies[1].name === 'name2'
   * cookies[1].value === 'value2'
   * cookies[2].name === 'name3'
   * cookies[2].value === 'value3'
   * ```
   *
   * @param str - The `Set-Cookie` header or a Cookie string to parse.
   * @param options - Configures `strict` or `loose` mode for cookie parsing
   */
  static parse(t, n) {
    return Qp(t, n);
  }
  /**
   * Does the reverse of {@link Cookie.toJSON}.
   *
   * @remarks
   * Any Date properties (such as .expires, .creation, and .lastAccessed) are parsed via Date.parse, not tough-cookie's parseDate, since ISO timestamps are being handled at this layer.
   *
   * @example
   * ```
   * const json = JSON.stringify({
   *   key: 'alpha',
   *   value: 'beta',
   *   domain: 'example.com',
   *   path: '/foo',
   *   expires: '2038-01-19T03:14:07.000Z',
   * })
   * const cookie = Cookie.fromJSON(json)
   * cookie.key === 'alpha'
   * cookie.value === 'beta'
   * cookie.domain === 'example.com'
   * cookie.path === '/foo'
   * cookie.expires === new Date(Date.parse('2038-01-19T03:14:07.000Z'))
   * ```
   *
   * @param str - An unparsed JSON string or a value that has already been parsed as JSON
   */
  static fromJSON(t) {
    return vo(t);
  }
};
Or.cookiesCreated = 0;
Or.sameSiteLevel = {
  strict: 3,
  lax: 2,
  none: 1
};
Or.sameSiteCanonical = {
  strict: "Strict",
  lax: "Lax"
};
Or.serializableProperties = [
  "key",
  "value",
  "expires",
  "maxAge",
  "domain",
  "path",
  "secure",
  "httpOnly",
  "extensions",
  "hostOnly",
  "pathIsDefault",
  "creation",
  "lastAccessed",
  "sameSite"
];
var Le = Or, bo = 2147483647e3;
function ko(e, t) {
  let n;
  const r = e.path ? e.path.length : 0;
  if (n = (t.path ? t.path.length : 0) - r, n !== 0)
    return n;
  const i = e.creation && e.creation instanceof Date ? e.creation.getTime() : bo, a = t.creation && t.creation instanceof Date ? t.creation.getTime() : bo;
  return n = i - a, n !== 0 || (n = (e.creationIndex || 0) - (t.creationIndex || 0)), n;
}
function Xp(e) {
  if (!e || e.slice(0, 1) !== "/")
    return "/";
  if (e === "/")
    return e;
  const t = e.lastIndexOf("/");
  return t === 0 ? "/" : e.slice(0, t);
}
var Kp = /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-f\d]{1,4}:){7}(?:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,2}|:)|(?:[a-f\d]{1,4}:){4}(?:(?::[a-f\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,3}|:)|(?:[a-f\d]{1,4}:){3}(?:(?::[a-f\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,4}|:)|(?:[a-f\d]{1,4}:){2}(?:(?::[a-f\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,5}|:)|(?:[a-f\d]{1,4}:){1}(?:(?::[a-f\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,6}|:)|(?::(?:(?::[a-f\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,7}|:)))$)/;
function wo(e, t, n) {
  if (e == null || t == null)
    return;
  let r, s;
  if (r = e, s = t, r == null || s == null)
    return;
  if (r == s)
    return !0;
  const i = r.lastIndexOf(s);
  return i <= 0 || r.length !== s.length + i || r.substring(i - 1, i) !== "." ? !1 : !Kp.test(r);
}
function eh(e) {
  const t = e.split(".");
  return t.length === 4 && t[0] !== void 0 && parseInt(t[0], 10) === 127;
}
function th(e) {
  return e === "::1";
}
function nh(e) {
  return e.endsWith(".localhost");
}
function rh(e) {
  const t = e.toLowerCase();
  return t === "localhost" || nh(t);
}
function sh(e) {
  return e.length >= 2 && e.startsWith("[") && e.endsWith("]") ? e.substring(1, e.length - 1) : e;
}
function ih(e, t = !0) {
  let n;
  if (typeof e == "string")
    try {
      n = new URL(e);
    } catch {
      return !1;
    }
  else
    n = e;
  const r = n.protocol.replace(":", "").toLowerCase(), s = sh(n.hostname).replace(/\.+$/, "");
  return r === "https" || r === "wss" ? !0 : t ? qp.test(s) ? eh(s) : pa.test(s) ? th(s) : rh(s) : !1;
}
var ah = {
  loose: !1,
  sameSiteContext: void 0,
  ignoreError: !1,
  http: !0
}, To = {
  http: !0,
  expire: !0,
  allPaths: !1,
  sameSiteContext: void 0,
  sort: void 0
}, oi = 'Invalid sameSiteContext option for getCookies(); expected one of "strict", "lax", or "none"';
function Eo(e) {
  if (e && typeof e == "object" && "hostname" in e && typeof e.hostname == "string" && "pathname" in e && typeof e.pathname == "string" && "protocol" in e && typeof e.protocol == "string")
    return {
      hostname: e.hostname,
      pathname: e.pathname,
      protocol: e.protocol
    };
  if (typeof e == "string")
    try {
      return new URL(decodeURI(e));
    } catch {
      return new URL(e);
    }
  else
    throw new Eu("`url` argument is not a string or URL.");
}
function Io(e) {
  const t = String(e).toLowerCase();
  if (t === "none" || t === "lax" || t === "strict")
    return t;
}
function oh(e) {
  return !(typeof e.key == "string" && e.key.startsWith("__Secure-")) || e.secure;
}
function ch(e) {
  return !(typeof e.key == "string" && e.key.startsWith("__Host-")) || !!(e.secure && e.hostOnly && e.path != null && e.path === "/");
}
function zr(e) {
  const t = e.toLowerCase();
  switch (t) {
    case nn.STRICT:
    case nn.SILENT:
    case nn.DISABLED:
      return t;
    default:
      return nn.SILENT;
  }
}
var uh = class sr {
  /**
   * Creates a new `CookieJar` instance.
   *
   * @remarks
   * - If a custom store is not passed to the constructor, an in-memory store ({@link MemoryCookieStore} will be created and used.
   * - If a boolean value is passed as the `options` parameter, this is equivalent to passing `{ rejectPublicSuffixes: <value> }`
   *
   * @param store - a custom {@link Store} implementation (defaults to {@link MemoryCookieStore})
   * @param options - configures how cookies are processed by the cookie jar
   */
  constructor(t, n) {
    typeof n == "boolean" && (n = { rejectPublicSuffixes: n }), this.rejectPublicSuffixes = (n == null ? void 0 : n.rejectPublicSuffixes) ?? !0, this.enableLooseMode = (n == null ? void 0 : n.looseMode) ?? !1, this.allowSpecialUseDomain = (n == null ? void 0 : n.allowSpecialUseDomain) ?? !0, this.allowSecureOnLocal = (n == null ? void 0 : n.allowSecureOnLocal) ?? !0, this.prefixSecurity = zr(
      (n == null ? void 0 : n.prefixSecurity) ?? "silent"
    ), this.store = t ?? new wu();
  }
  callSync(t) {
    if (!this.store.synchronous)
      throw new Error(
        "CookieJar store is not synchronous; use async API instead."
      );
    let n = null, r;
    try {
      t.call(this, (s, i) => {
        n = s, r = i;
      });
    } catch (s) {
      n = s;
    }
    if (n) throw n;
    return r;
  }
  /**
   * @internal No doc because this is the overload implementation
   */
  setCookie(t, n, r, s) {
    typeof r == "function" && (s = r, r = void 0);
    const i = Te(s), a = i.callback;
    let o;
    try {
      if (typeof n == "string" && Jn(
        ai(n),
        s,
        Ri(r)
      ), o = Eo(n), typeof n == "function")
        return i.reject(new Error("No URL was specified"));
      if (typeof r == "function" && (r = ah), Jn(typeof a == "function", a), !ai(t) && !es(t) && t instanceof String && t.length == 0)
        return i.resolve(void 0);
    } catch (k) {
      return i.reject(k);
    }
    const c = ds(o.hostname) ?? null, u = (r == null ? void 0 : r.loose) || this.enableLooseMode;
    let l = null;
    if (r != null && r.sameSiteContext && (l = Io(r.sameSiteContext), !l))
      return i.reject(new Error(oi));
    if (typeof t == "string" || t instanceof String) {
      const k = Le.parse(t.toString(), { loose: u });
      if (!k) {
        const E = new Error("Cookie failed to parse");
        return r != null && r.ignoreError ? i.resolve(void 0) : i.reject(E);
      }
      t = k;
    } else if (!(t instanceof Le)) {
      const k = new Error(
        "First argument to setCookie must be a Cookie object or string"
      );
      return r != null && r.ignoreError ? i.resolve(void 0) : i.reject(k);
    }
    const d = (r == null ? void 0 : r.now) || /* @__PURE__ */ new Date();
    if (this.rejectPublicSuffixes && t.domain)
      try {
        const k = t.cdomain();
        if ((typeof k == "string" ? la(k, {
          allowSpecialUseDomain: this.allowSpecialUseDomain,
          ignoreError: r == null ? void 0 : r.ignoreError
        }) : null) == null && !pa.test(t.domain)) {
          const I = new Error("Cookie has domain set to a public suffix");
          return r != null && r.ignoreError ? i.resolve(void 0) : i.reject(I);
        }
      } catch (k) {
        return r != null && r.ignoreError ? i.resolve(void 0) : (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          i.reject(k)
        );
      }
    if (t.domain) {
      if (!wo(c ?? void 0, t.cdomain() ?? void 0)) {
        const k = new Error(
          `Cookie not in this host's domain. Cookie:${t.cdomain() ?? "null"} Request:${c ?? "null"}`
        );
        return r != null && r.ignoreError ? i.resolve(void 0) : i.reject(k);
      }
      t.hostOnly == null && (t.hostOnly = !1);
    } else
      t.hostOnly = !0, t.domain = c;
    if ((!t.path || t.path[0] !== "/") && (t.path = Xp(o.pathname), t.pathIsDefault = !0), (r == null ? void 0 : r.http) === !1 && t.httpOnly) {
      const k = new Error("Cookie is HttpOnly and this isn't an HTTP API");
      return r.ignoreError ? i.resolve(void 0) : i.reject(k);
    }
    if (t.sameSite !== "none" && t.sameSite !== void 0 && l && l === "none") {
      const k = new Error(
        "Cookie is SameSite but this is a cross-origin request"
      );
      return r != null && r.ignoreError ? i.resolve(void 0) : i.reject(k);
    }
    const p = this.prefixSecurity === nn.SILENT;
    if (!(this.prefixSecurity === nn.DISABLED)) {
      let k = !1, E;
      if (oh(t) ? ch(t) || (k = !0, E = "Cookie has __Host prefix but either Secure or HostOnly attribute is not set or Path is not '/'") : (k = !0, E = "Cookie has __Secure prefix but Secure attribute is not set"), k)
        return r != null && r.ignoreError || p ? i.resolve(void 0) : i.reject(new Error(E));
    }
    const m = this.store;
    m.updateCookie || (m.updateCookie = async function(k, E, I) {
      return this.putCookie(E).then(
        () => I == null ? void 0 : I(null),
        (D) => I == null ? void 0 : I(D)
      );
    });
    const g = function(E, I) {
      if (E) {
        a(E);
        return;
      }
      const D = function(C) {
        C ? a(C) : typeof t == "string" ? a(null, void 0) : a(null, t);
      };
      if (I) {
        if (r && "http" in r && r.http === !1 && I.httpOnly) {
          E = new Error("old Cookie is HttpOnly and this isn't an HTTP API"), r.ignoreError ? a(null, void 0) : a(E);
          return;
        }
        t instanceof Le && (t.creation = I.creation, t.creationIndex = I.creationIndex, t.lastAccessed = d, m.updateCookie(I, t, D));
      } else
        t instanceof Le && (t.creation = t.lastAccessed = d, m.putCookie(t, D));
    };
    return m.findCookie(t.domain, t.path, t.key, g), i.promise;
  }
  /**
   * Synchronously attempt to set the {@link Cookie} in the {@link CookieJar}.
   *
   * <strong>Note:</strong> Only works if the configured {@link Store} is also synchronous.
   *
   * @remarks
   * - If successfully persisted, the {@link Cookie} will have updated
   *     {@link Cookie.creation}, {@link Cookie.lastAccessed} and {@link Cookie.hostOnly}
   *     properties.
   *
   * - As per the RFC, the {@link Cookie.hostOnly} flag is set if there was no `Domain={value}`
   *     attribute on the cookie string. The {@link Cookie.domain} property is set to the
   *     fully-qualified hostname of `currentUrl` in this case. Matching this cookie requires an
   *     exact hostname match (not a {@link domainMatch} as per usual)
   *
   * @param cookie - The cookie object or cookie string to store. A string value will be parsed into a cookie using {@link Cookie.parse}.
   * @param url - The domain to store the cookie with.
   * @param options - Configuration settings to use when storing the cookie.
   * @public
   */
  setCookieSync(t, n, r) {
    const s = r ? this.setCookie.bind(this, t, n, r) : this.setCookie.bind(this, t, n);
    return this.callSync(s);
  }
  /**
   * @internal No doc because this is the overload implementation
   */
  getCookies(t, n, r) {
    typeof n == "function" ? (r = n, n = To) : n === void 0 && (n = To);
    const s = Te(r), i = s.callback;
    let a;
    try {
      typeof t == "string" && Jn(ai(t), i, t), a = Eo(t), Jn(
        es(n),
        i,
        Ri(n)
      ), Jn(typeof i == "function", i);
    } catch (E) {
      return s.reject(E);
    }
    const o = ds(a.hostname), c = a.pathname || "/", u = ih(
      t,
      this.allowSecureOnLocal
    );
    let l = 0;
    if (n.sameSiteContext) {
      const E = Io(n.sameSiteContext);
      if (E == null)
        return s.reject(new Error(oi));
      if (l = Le.sameSiteLevel[E], !l)
        return s.reject(new Error(oi));
    }
    const d = n.http ?? !0, p = Date.now(), h = n.expire ?? !0, m = n.allPaths ?? !1, g = this.store;
    function k(E) {
      if (E.hostOnly) {
        if (E.domain != o)
          return !1;
      } else if (!wo(o ?? void 0, E.domain ?? void 0))
        return !1;
      if (!m && typeof E.path == "string" && !vu(c, E.path) || E.secure && !u || E.httpOnly && !d)
        return !1;
      if (l) {
        let D;
        if (E.sameSite === "lax" ? D = Le.sameSiteLevel.lax : E.sameSite === "strict" ? D = Le.sameSiteLevel.strict : D = Le.sameSiteLevel.none, D > l)
          return !1;
      }
      const I = E.expiryTime();
      return h && I != null && I <= p ? (g.removeCookie(E.domain, E.path, E.key, () => {
      }), !1) : !0;
    }
    return g.findCookies(
      o,
      m ? null : c,
      this.allowSpecialUseDomain,
      (E, I) => {
        if (E) {
          i(E);
          return;
        }
        if (I == null) {
          i(null, []);
          return;
        }
        I = I.filter(k), "sort" in n && n.sort !== !1 && (I = I.sort(ko));
        const D = /* @__PURE__ */ new Date();
        for (const C of I)
          C.lastAccessed = D;
        i(null, I);
      }
    ), s.promise;
  }
  /**
   * Synchronously retrieve the list of cookies that can be sent in a Cookie header for the
   * current URL.
   *
   * <strong>Note</strong>: Only works if the configured Store is also synchronous.
   *
   * @remarks
   * - The array of cookies returned will be sorted according to {@link cookieCompare}.
   *
   * - The {@link Cookie.lastAccessed} property will be updated on all returned cookies.
   *
   * @param url - The domain to store the cookie with.
   * @param options - Configuration settings to use when retrieving the cookies.
   */
  getCookiesSync(t, n) {
    return this.callSync(this.getCookies.bind(this, t, n)) ?? [];
  }
  /**
   * @internal No doc because this is the overload implementation
   */
  getCookieString(t, n, r) {
    typeof n == "function" && (r = n, n = void 0);
    const s = Te(r), i = function(a, o) {
      a ? s.callback(a) : s.callback(
        null,
        o == null ? void 0 : o.sort(ko).map((c) => c.cookieString()).join("; ")
      );
    };
    return this.getCookies(t, n, i), s.promise;
  }
  /**
   * Synchronous version of `.getCookieString()`. Accepts the same options as `.getCookies()` but returns a string suitable for a
   * `Cookie` header rather than an Array.
   *
   * <strong>Note</strong>: Only works if the configured Store is also synchronous.
   *
   * @param url - The domain to store the cookie with.
   * @param options - Configuration settings to use when retrieving the cookies.
   */
  getCookieStringSync(t, n) {
    return this.callSync(
      n ? this.getCookieString.bind(this, t, n) : this.getCookieString.bind(this, t)
    ) ?? "";
  }
  /**
   * @internal No doc because this is the overload implementation
   */
  getSetCookieStrings(t, n, r) {
    typeof n == "function" && (r = n, n = void 0);
    const s = Te(
      r
    ), i = function(a, o) {
      a ? s.callback(a) : s.callback(
        null,
        o == null ? void 0 : o.map((c) => c.toString())
      );
    };
    return this.getCookies(t, n, i), s.promise;
  }
  /**
   * Synchronous version of `.getSetCookieStrings()`. Returns an array of strings suitable for `Set-Cookie` headers.
   * Accepts the same options as `.getCookies()`.
   *
   * <strong>Note</strong>: Only works if the configured Store is also synchronous.
   *
   * @param url - The domain to store the cookie with.
   * @param options - Configuration settings to use when retrieving the cookies.
   */
  getSetCookieStringsSync(t, n = {}) {
    return this.callSync(this.getSetCookieStrings.bind(this, t, n)) ?? [];
  }
  /**
   * @internal No doc because this is the overload implementation
   */
  serialize(t) {
    const n = Te(t);
    let r = this.store.constructor.name;
    es(r) && (r = null);
    const s = {
      // The version of tough-cookie that serialized this jar. Generally a good
      // practice since future versions can make data import decisions based on
      // known past behavior. When/if this matters, use `semver`.
      version: `tough-cookie@${Fp}`,
      // add the store type, to make humans happy:
      storeType: r,
      // CookieJar configuration:
      rejectPublicSuffixes: this.rejectPublicSuffixes,
      enableLooseMode: this.enableLooseMode,
      allowSpecialUseDomain: this.allowSpecialUseDomain,
      prefixSecurity: zr(this.prefixSecurity),
      // this gets filled from getAllCookies:
      cookies: []
    };
    return typeof this.store.getAllCookies != "function" ? n.reject(
      new Error(
        "store does not support getAllCookies and cannot be serialized"
      )
    ) : (this.store.getAllCookies((i, a) => {
      if (i) {
        n.callback(i);
        return;
      }
      if (a == null) {
        n.callback(null, s);
        return;
      }
      s.cookies = a.map((o) => {
        const c = o.toJSON();
        return delete c.creationIndex, c;
      }), n.callback(null, s);
    }), n.promise);
  }
  /**
   * Serialize the CookieJar if the underlying store supports `.getAllCookies`.
   *
   * <strong>Note</strong>: Only works if the configured Store is also synchronous.
   */
  serializeSync() {
    return this.callSync((t) => {
      this.serialize(t);
    });
  }
  /**
   * Alias of {@link CookieJar.serializeSync}. Allows the cookie to be serialized
   * with `JSON.stringify(cookieJar)`.
   */
  toJSON() {
    return this.serializeSync();
  }
  /**
   * Use the class method CookieJar.deserialize instead of calling this directly
   * @internal
   */
  _importCookies(t, n) {
    let r;
    if (t && typeof t == "object" && dr("cookies", t) && Array.isArray(t.cookies) && (r = t.cookies), !r) {
      n(new Error("serialized jar has no cookies array"), void 0);
      return;
    }
    r = r.slice();
    const s = (i) => {
      if (i) {
        n(i, void 0);
        return;
      }
      if (Array.isArray(r)) {
        if (!r.length) {
          n(i, this);
          return;
        }
        let a;
        try {
          a = Le.fromJSON(r.shift());
        } catch (o) {
          n(o instanceof Error ? o : new Error(), void 0);
          return;
        }
        if (a === void 0) {
          s(null);
          return;
        }
        this.store.putCookie(a, s);
      }
    };
    s(null);
  }
  /**
   * @internal
   */
  _importCookiesSync(t) {
    this.callSync(this._importCookies.bind(this, t));
  }
  /**
   * @internal No doc because this is the overload implementation
   */
  clone(t, n) {
    typeof t == "function" && (n = t, t = void 0);
    const r = Te(n), s = r.callback;
    return this.serialize((i, a) => i ? r.reject(i) : sr.deserialize(a ?? "", t, s)), r.promise;
  }
  /**
   * @internal
   */
  _cloneSync(t) {
    const n = t && typeof t != "function" ? this.clone.bind(this, t) : this.clone.bind(this);
    return this.callSync((r) => {
      n(r);
    });
  }
  /**
   * Produces a deep clone of this CookieJar. Modifications to the original do
   * not affect the clone, and vice versa.
   *
   * <strong>Note</strong>: Only works if both the configured Store and destination
   * Store are synchronous.
   *
   * @remarks
   * - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
   *
   * - Transferring between store types is supported so long as the source
   *     implements `.getAllCookies()` and the destination implements `.putCookie()`.
   *
   * @param newStore - The target {@link Store} to clone cookies into.
   */
  cloneSync(t) {
    if (!t)
      return this._cloneSync();
    if (!t.synchronous)
      throw new Error(
        "CookieJar clone destination store is not synchronous; use async API instead."
      );
    return this._cloneSync(t);
  }
  /**
   * @internal No doc because this is the overload implementation
   */
  removeAllCookies(t) {
    const n = Te(t), r = n.callback, s = this.store;
    return typeof s.removeAllCookies == "function" && s.removeAllCookies !== bu.prototype.removeAllCookies ? (s.removeAllCookies(r), n.promise) : (s.getAllCookies((i, a) => {
      if (i) {
        r(i);
        return;
      }
      if (a || (a = []), a.length === 0) {
        r(null, void 0);
        return;
      }
      let o = 0;
      const c = [], u = function(d) {
        if (d && c.push(d), o++, o === a.length) {
          c[0] ? r(c[0]) : r(null, void 0);
          return;
        }
      };
      a.forEach((l) => {
        s.removeCookie(
          l.domain,
          l.path,
          l.key,
          u
        );
      });
    }), n.promise);
  }
  /**
   * Removes all cookies from the CookieJar.
   *
   * <strong>Note</strong>: Only works if the configured Store is also synchronous.
   *
   * @remarks
   * - This is a new backwards-compatible feature of tough-cookie version 2.5,
   *     so not all Stores will implement it efficiently. For Stores that do not
   *     implement `removeAllCookies`, the fallback is to call `removeCookie` after
   *     `getAllCookies`.
   *
   * - If `getAllCookies` fails or isn't implemented in the Store, an error is returned.
   *
   * - If one or more of the `removeCookie` calls fail, only the first error is returned.
   */
  removeAllCookiesSync() {
    this.callSync((t) => {
      this.removeAllCookies(t);
    });
  }
  /**
   * @internal No doc because this is the overload implementation
   */
  static deserialize(t, n, r) {
    typeof n == "function" && (r = n, n = void 0);
    const s = Te(r);
    let i;
    if (typeof t == "string")
      try {
        i = JSON.parse(t);
      } catch (l) {
        return s.reject(l instanceof Error ? l : new Error());
      }
    else
      i = t;
    const a = (l) => i && typeof i == "object" && dr(l, i) ? i[l] : void 0, o = (l) => {
      const d = a(l);
      return typeof d == "boolean" ? d : void 0;
    }, c = (l) => {
      const d = a(l);
      return typeof d == "string" ? d : void 0;
    }, u = new sr(n, {
      rejectPublicSuffixes: o("rejectPublicSuffixes"),
      looseMode: o("enableLooseMode"),
      allowSpecialUseDomain: o("allowSpecialUseDomain"),
      prefixSecurity: zr(
        c("prefixSecurity") ?? "silent"
      )
    });
    return u._importCookies(i, (l) => {
      if (l) {
        s.callback(l);
        return;
      }
      s.callback(null, u);
    }), s.promise;
  }
  /**
   * A new CookieJar is created and the serialized {@link Cookie} values are added to
   * the underlying store. Each {@link Cookie} is added via `store.putCookie(...)` in
   * the order in which they appear in the serialization.
   *
   * <strong>Note</strong>: Only works if the configured Store is also synchronous.
   *
   * @remarks
   * - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
   *
   * - As a convenience, if `strOrObj` is a string, it is passed through `JSON.parse` first.
   *
   * @param strOrObj - A JSON string or object representing the deserialized cookies.
   * @param store - The underlying store to persist the deserialized cookies into.
   */
  static deserializeSync(t, n) {
    const r = typeof t == "string" ? JSON.parse(t) : t, s = (c) => r && typeof r == "object" && dr(c, r) ? r[c] : void 0, i = (c) => {
      const u = s(c);
      return typeof u == "boolean" ? u : void 0;
    }, a = (c) => {
      const u = s(c);
      return typeof u == "string" ? u : void 0;
    }, o = new sr(n, {
      rejectPublicSuffixes: i("rejectPublicSuffixes"),
      looseMode: i("enableLooseMode"),
      allowSpecialUseDomain: i("allowSpecialUseDomain"),
      prefixSecurity: zr(
        a("prefixSecurity") ?? "silent"
      )
    });
    if (!o.store.synchronous)
      throw new Error(
        "CookieJar store is not synchronous; use async API instead."
      );
    return o._importCookiesSync(r), o;
  }
  /**
   * Alias of {@link CookieJar.deserializeSync}.
   *
   * @remarks
   * - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
   *
   * - As a convenience, if `strOrObj` is a string, it is passed through `JSON.parse` first.
   *
   * @param jsonString - A JSON string or object representing the deserialized cookies.
   * @param store - The underlying store to persist the deserialized cookies into.
   */
  static fromJSON(t, n) {
    return sr.deserializeSync(t, n);
  }
};
/*!
 * Copyright (c) 2015-2020, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
function ts(e) {
  try {
    return JSON.parse(e);
  } catch {
    return;
  }
}
var _r, Pn, an;
class lh {
  constructor() {
    Ue(this, _r, "__msw-cookie-store__");
    Ue(this, Pn);
    Ue(this, an);
    lu() || Ke(
      typeof localStorage < "u",
      "Failed to create a CookieStore: `localStorage` is not available in this environment. This is likely an issue with your environment, which has been detected as browser (or browser-like) environment and must implement global browser APIs correctly."
    ), At(this, an, new wu()), W(this, an).idx = this.getCookieStoreIndex(), At(this, Pn, new uh(W(this, an)));
  }
  getCookies(t) {
    return W(this, Pn).getCookiesSync(t);
  }
  async setCookie(t, n) {
    await W(this, Pn).setCookie(t, n), this.persist();
  }
  getCookieStoreIndex() {
    var s, i, a;
    if (typeof localStorage > "u")
      return {};
    const t = localStorage.getItem(W(this, _r));
    if (t == null)
      return {};
    const n = ts(t);
    if (n == null)
      return {};
    const r = {};
    for (const o of n) {
      const c = Le.fromJSON(o);
      c != null && c.domain != null && c.path != null && (r[s = c.domain] || (r[s] = {}), (i = r[c.domain])[a = c.path] || (i[a] = {}), r[c.domain][c.path][c.key] = c);
    }
    return r;
  }
  persist() {
    if (typeof localStorage > "u")
      return;
    const t = [], { idx: n } = W(this, an);
    for (const r in n)
      for (const s in n[r])
        for (const i in n[r][s])
          t.push(n[r][s][i].toJSON());
    localStorage.setItem(W(this, _r), JSON.stringify(t));
  }
}
_r = new WeakMap(), Pn = new WeakMap(), an = new WeakMap();
const Iu = new lh();
function xu(e) {
  const t = yp(e), n = {};
  for (const r in t)
    typeof t[r] < "u" && (n[r] = t[r]);
  return n;
}
function xo() {
  return xu(document.cookie);
}
function dh(e) {
  if (typeof document > "u" || typeof location > "u")
    return {};
  switch (e.credentials) {
    case "same-origin": {
      const t = new URL(e.url);
      return location.origin === t.origin ? xo() : {};
    }
    case "include":
      return xo();
    default:
      return {};
  }
}
function Su(e) {
  const t = e.headers.get("cookie"), n = t ? xu(t) : {}, r = dh(e);
  for (const a in r)
    e.headers.append(
      "cookie",
      vp(a, r[a])
    );
  const s = Iu.getCookies(e.url), i = Object.fromEntries(
    s.map((a) => [a.key, a.value])
  );
  for (const a of s)
    e.headers.append("cookie", a.toString());
  return {
    ...r,
    ...i,
    ...n
  };
}
var $t = /* @__PURE__ */ ((e) => (e.HEAD = "HEAD", e.GET = "GET", e.POST = "POST", e.PUT = "PUT", e.PATCH = "PATCH", e.OPTIONS = "OPTIONS", e.DELETE = "DELETE", e))($t || {});
class fh extends br {
  constructor(t, n, r, s) {
    const i = typeof n == "function" ? "[custom predicate]" : n;
    super({
      info: {
        header: `${t}${i ? ` ${i}` : ""}`,
        path: n,
        method: t
      },
      resolver: r,
      options: s
    }), this.checkRedundantQueryParameters();
  }
  checkRedundantQueryParameters() {
    const { method: t, path: n } = this.info;
    !n || n instanceof RegExp || typeof n == "function" || fu(n) === n || B.warn(
      `Found a redundant usage of query parameters in the request handler URL for "${t} ${n}". Please match against a path instead and access query parameters using "new URL(request.url).searchParams" instead. Learn more: https://mswjs.io/docs/http/intercepting-requests#querysearch-parameters`
    );
  }
  async parse(t) {
    var i;
    const n = new URL(t.request.url), r = Su(t.request);
    if (typeof this.info.path == "function") {
      const a = await this.info.path({
        request: t.request,
        cookies: r
      });
      return {
        match: typeof a == "boolean" ? {
          matches: a,
          params: {}
        } : a,
        cookies: r
      };
    }
    return {
      match: this.info.path ? pu(n, this.info.path, (i = t.resolutionContext) == null ? void 0 : i.baseUrl) : { matches: !1, params: {} },
      cookies: r
    };
  }
  async predicate(t) {
    const n = this.matchMethod(t.request.method), r = t.parsedResult.match.matches;
    return n && r;
  }
  matchMethod(t) {
    return this.info.method instanceof RegExp ? this.info.method.test(t) : If(this.info.method, t);
  }
  extendResolverArgs(t) {
    var n;
    return {
      params: ((n = t.parsedResult.match) == null ? void 0 : n.params) || {},
      cookies: t.parsedResult.cookies
    };
  }
  async log(t) {
    const n = dn(t.request.url), r = await tu(t.request), s = await ou(t.response), i = eu(s.status);
    console.groupCollapsed(
      B.formatMessage(
        `${_t()} ${t.request.method} ${n} (%c${s.status} ${s.statusText}%c)`
      ),
      `color:${i}`,
      "color:inherit"
    ), console.log("Request", r), console.log("Handler:", this), console.log("Response", s), console.groupEnd();
  }
}
function Ct(e) {
  return (t, n, r = {}) => new fh(e, t, n, r);
}
const j = {
  all: Ct(/.+/),
  head: Ct($t.HEAD),
  get: Ct($t.GET),
  post: Ct($t.POST),
  put: Ct($t.PUT),
  delete: Ct($t.DELETE),
  patch: Ct($t.PATCH),
  options: Ct($t.OPTIONS)
};
var ph = Object.create, Nu = Object.defineProperty, hh = Object.getOwnPropertyDescriptor, _u = Object.getOwnPropertyNames, mh = Object.getPrototypeOf, gh = Object.prototype.hasOwnProperty, yh = (e, t) => function() {
  return t || (0, e[_u(e)[0]])((t = { exports: {} }).exports, t), t.exports;
}, vh = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let s of _u(t))
      !gh.call(e, s) && s !== n && Nu(e, s, { get: () => t[s], enumerable: !(r = hh(t, s)) || r.enumerable });
  return e;
}, bh = (e, t, n) => (n = e != null ? ph(mh(e)) : {}, vh(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !e || !e.__esModule ? Nu(n, "default", { value: e, enumerable: !0 }) : n,
  e
)), kh = yh({
  "node_modules/set-cookie-parser/lib/set-cookie.js"(e, t) {
    var n = {
      decodeValues: !0,
      map: !1,
      silent: !1
    };
    function r(c) {
      return typeof c == "string" && !!c.trim();
    }
    function s(c, u) {
      var l = c.split(";").filter(r), d = l.shift(), p = i(d), h = p.name, m = p.value;
      u = u ? Object.assign({}, n, u) : n;
      try {
        m = u.decodeValues ? decodeURIComponent(m) : m;
      } catch (k) {
        console.error(
          "set-cookie-parser encountered an error while decoding a cookie with value '" + m + "'. Set options.decodeValues to false to disable this feature.",
          k
        );
      }
      var g = {
        name: h,
        value: m
      };
      return l.forEach(function(k) {
        var E = k.split("="), I = E.shift().trimLeft().toLowerCase(), D = E.join("=");
        I === "expires" ? g.expires = new Date(D) : I === "max-age" ? g.maxAge = parseInt(D, 10) : I === "secure" ? g.secure = !0 : I === "httponly" ? g.httpOnly = !0 : I === "samesite" ? g.sameSite = D : g[I] = D;
      }), g;
    }
    function i(c) {
      var u = "", l = "", d = c.split("=");
      return d.length > 1 ? (u = d.shift(), l = d.join("=")) : l = c, { name: u, value: l };
    }
    function a(c, u) {
      if (u = u ? Object.assign({}, n, u) : n, !c)
        return u.map ? {} : [];
      if (c.headers)
        if (typeof c.headers.getSetCookie == "function")
          c = c.headers.getSetCookie();
        else if (c.headers["set-cookie"])
          c = c.headers["set-cookie"];
        else {
          var l = c.headers[Object.keys(c.headers).find(function(p) {
            return p.toLowerCase() === "set-cookie";
          })];
          !l && c.headers.cookie && !u.silent && console.warn(
            "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
          ), c = l;
        }
      if (Array.isArray(c) || (c = [c]), u = u ? Object.assign({}, n, u) : n, u.map) {
        var d = {};
        return c.filter(r).reduce(function(p, h) {
          var m = s(h, u);
          return p[m.name] = m, p;
        }, d);
      } else
        return c.filter(r).map(function(p) {
          return s(p, u);
        });
    }
    function o(c) {
      if (Array.isArray(c))
        return c;
      if (typeof c != "string")
        return [];
      var u = [], l = 0, d, p, h, m, g;
      function k() {
        for (; l < c.length && /\s/.test(c.charAt(l)); )
          l += 1;
        return l < c.length;
      }
      function E() {
        return p = c.charAt(l), p !== "=" && p !== ";" && p !== ",";
      }
      for (; l < c.length; ) {
        for (d = l, g = !1; k(); )
          if (p = c.charAt(l), p === ",") {
            for (h = l, l += 1, k(), m = l; l < c.length && E(); )
              l += 1;
            l < c.length && c.charAt(l) === "=" ? (g = !0, l = m, u.push(c.substring(d, h)), d = l) : l = h + 1;
          } else
            l += 1;
        (!g || l >= c.length) && u.push(c.substring(d, c.length));
      }
      return u;
    }
    t.exports = a, t.exports.parse = a, t.exports.parseString = s, t.exports.splitCookiesString = o;
  }
}), wh = bh(kh()), Th = /[^a-z0-9\-#$%&'*+.^_`|~]/i;
function Yn(e) {
  if (Th.test(e) || e.trim() === "")
    throw new TypeError("Invalid character in header field name");
  return e.trim().toLowerCase();
}
var So = [
  `
`,
  "\r",
  "	",
  " "
], Eh = new RegExp(
  `(^[${So.join("")}]|$[${So.join("")}])`,
  "g"
);
function ci(e) {
  return e.replace(Eh, "");
}
function Qn(e) {
  if (typeof e != "string" || e.length === 0)
    return !1;
  for (let t = 0; t < e.length; t++) {
    const n = e.charCodeAt(t);
    if (n > 127 || !Ih(n))
      return !1;
  }
  return !0;
}
function Ih(e) {
  return ![
    127,
    32,
    "(",
    ")",
    "<",
    ">",
    "@",
    ",",
    ";",
    ":",
    "\\",
    '"',
    "/",
    "[",
    "]",
    "?",
    "=",
    "{",
    "}"
  ].includes(e);
}
function No(e) {
  if (typeof e != "string" || e.trim() !== e)
    return !1;
  for (let t = 0; t < e.length; t++) {
    const n = e.charCodeAt(t);
    if (
      // NUL.
      n === 0 || // HTTP newline bytes.
      n === 10 || n === 13
    )
      return !1;
  }
  return !0;
}
var yn = Symbol("normalizedHeaders"), ui = Symbol("rawHeaderNames"), _o = ", ", Oo, Do, Ao, Ou = class Du {
  constructor(t) {
    this[Oo] = {}, this[Do] = /* @__PURE__ */ new Map(), this[Ao] = "Headers", ["Headers", "HeadersPolyfill"].includes(t == null ? void 0 : t.constructor.name) || t instanceof Du || typeof globalThis.Headers < "u" && t instanceof globalThis.Headers ? t.forEach((r, s) => {
      this.append(s, r);
    }, this) : Array.isArray(t) ? t.forEach(([n, r]) => {
      this.append(
        n,
        Array.isArray(r) ? r.join(_o) : r
      );
    }) : t && Object.getOwnPropertyNames(t).forEach((n) => {
      const r = t[n];
      this.append(
        n,
        Array.isArray(r) ? r.join(_o) : r
      );
    });
  }
  [(Oo = yn, Do = ui, Ao = Symbol.toStringTag, Symbol.iterator)]() {
    return this.entries();
  }
  *keys() {
    for (const [t] of this.entries())
      yield t;
  }
  *values() {
    for (const [, t] of this.entries())
      yield t;
  }
  *entries() {
    let t = Object.keys(this[yn]).sort(
      (n, r) => n.localeCompare(r)
    );
    for (const n of t)
      if (n === "set-cookie")
        for (const r of this.getSetCookie())
          yield [n, r];
      else
        yield [n, this.get(n)];
  }
  /**
   * Returns a boolean stating whether a `Headers` object contains a certain header.
   */
  has(t) {
    if (!Qn(t))
      throw new TypeError(`Invalid header name "${t}"`);
    return this[yn].hasOwnProperty(Yn(t));
  }
  /**
   * Returns a `ByteString` sequence of all the values of a header with a given name.
   */
  get(t) {
    if (!Qn(t))
      throw TypeError(`Invalid header name "${t}"`);
    return this[yn][Yn(t)] ?? null;
  }
  /**
   * Sets a new value for an existing header inside a `Headers` object, or adds the header if it does not already exist.
   */
  set(t, n) {
    if (!Qn(t) || !No(n))
      return;
    const r = Yn(t), s = ci(n);
    this[yn][r] = ci(s), this[ui].set(r, t);
  }
  /**
   * Appends a new value onto an existing header inside a `Headers` object, or adds the header if it does not already exist.
   */
  append(t, n) {
    if (!Qn(t) || !No(n))
      return;
    const r = Yn(t), s = ci(n);
    let i = this.has(r) ? `${this.get(r)}, ${s}` : s;
    this.set(t, i);
  }
  /**
   * Deletes a header from the `Headers` object.
   */
  delete(t) {
    if (!Qn(t) || !this.has(t))
      return;
    const n = Yn(t);
    delete this[yn][n], this[ui].delete(n);
  }
  /**
   * Traverses the `Headers` object,
   * calling the given callback for each header.
   */
  forEach(t, n) {
    for (const [r, s] of this.entries())
      t.call(n, s, r, this);
  }
  /**
   * Returns an array containing the values
   * of all Set-Cookie headers associated
   * with a response
   */
  getSetCookie() {
    const t = this.get("set-cookie");
    return t === null ? [] : t === "" ? [""] : (0, wh.splitCookiesString)(t);
  }
};
function xh(e) {
  return e.trim().split(/[\r\n]+/).reduce((n, r) => {
    if (r.trim() === "")
      return n;
    const s = r.split(": "), i = s.shift(), a = s.join(": ");
    return n.append(i, a), n;
  }, new Ou());
}
function Sh(e) {
  var o, c;
  const t = xh(e), n = t.get("content-type") || "text/plain", r = t.get("content-disposition");
  if (!r)
    throw new Error('"Content-Disposition" header is required.');
  const s = r.split(";").reduce((u, l) => {
    const [d, ...p] = l.trim().split("=");
    return u[d] = p.join("="), u;
  }, {}), i = (o = s.name) == null ? void 0 : o.slice(1, -1), a = (c = s.filename) == null ? void 0 : c.slice(1, -1);
  return {
    name: i,
    filename: a,
    contentType: n
  };
}
function Nh(e, t) {
  const n = t == null ? void 0 : t.get("content-type");
  if (!n)
    return;
  const [, ...r] = n.split(/; */), s = r.filter((c) => c.startsWith("boundary=")).map((c) => c.replace(/^boundary=/, ""))[0];
  if (!s)
    return;
  const i = new RegExp(`--+${s}`), a = e.split(i).filter((c) => c.startsWith(`\r
`) && c.endsWith(`\r
`)).map((c) => c.trimStart().replace(/\r\n$/, ""));
  if (!a.length)
    return;
  const o = {};
  try {
    for (const c of a) {
      const [u, ...l] = c.split(`\r
\r
`), d = l.join(`\r
\r
`), { contentType: p, filename: h, name: m } = Sh(u), g = h === void 0 ? d : new File([d], h, { type: p }), k = o[m];
      k === void 0 ? o[m] = g : Array.isArray(k) ? o[m] = [...k, g] : o[m] = [k, g];
    }
    return o;
  } catch {
    return;
  }
}
function Au(e) {
  var n;
  const t = e.definitions.find((r) => r.kind === "OperationDefinition");
  return {
    operationType: t == null ? void 0 : t.operation,
    operationName: (n = t == null ? void 0 : t.name) == null ? void 0 : n.value
  };
}
async function _h(e) {
  const { parse: t } = await import("./index-C11yS13Z.mjs").catch((n) => {
    throw console.error('[MSW] Failed to parse a GraphQL query: cannot import the "graphql" module. Please make sure you install it if you wish to intercept GraphQL requests. See the original import error below.'), n;
  });
  try {
    const n = t(e);
    return Au(n);
  } catch (n) {
    return n;
  }
}
function Oh(e, t, n) {
  const r = { variables: e };
  for (const [s, i] of Object.entries(t)) {
    if (!(s in n))
      throw new Error(`Given files do not have a key '${s}' .`);
    for (const a of i) {
      const [o, ...c] = a.split(".").reverse(), u = c.reverse();
      let l = r;
      for (const d of u) {
        if (!(d in l))
          throw new Error(`Property '${u}' is not in operations.`);
        l = l[d];
      }
      l[o] = n[s];
    }
  }
  return r.variables;
}
async function Dh(e) {
  var t;
  switch (e.method) {
    case "GET": {
      const n = new URL(e.url), r = n.searchParams.get("query"), s = n.searchParams.get("variables") || "";
      return {
        query: r,
        variables: ts(s)
      };
    }
    case "POST": {
      const n = e.clone();
      if ((t = e.headers.get("content-type")) != null && t.includes("multipart/form-data")) {
        const s = Nh(
          await n.text(),
          e.headers
        );
        if (!s)
          return null;
        const { operations: i, map: a, ...o } = s, c = ts(
          i
        ) || {};
        if (!c.query)
          return null;
        const u = ts(a || "") || {}, l = c.variables ? Oh(
          c.variables,
          u,
          o
        ) : {};
        return {
          query: c.query,
          variables: l
        };
      }
      const r = await n.json().catch(() => null);
      if (r != null && r.query) {
        const { query: s, variables: i } = r;
        return {
          query: s,
          variables: i
        };
      }
      return null;
    }
    default:
      return null;
  }
}
async function Ah(e) {
  const t = await Dh(e);
  if (!t || !t.query)
    return;
  const { query: n, variables: r } = t, s = await _h(n);
  if (s instanceof Error) {
    const i = dn(e.url);
    throw new Error(
      B.formatMessage(
        `Failed to intercept a GraphQL request to "%s %s": cannot parse query. See the error message from the parser below.

%s`,
        e.method,
        i,
        s.message
      )
    );
  }
  return {
    query: t.query,
    operationType: s.operationType,
    operationName: s.operationName,
    variables: r
  };
}
function Ch(e) {
  return e == null ? !1 : typeof e == "object" && "kind" in e && "definitions" in e;
}
const On = class On extends br {
  constructor(n, r, s, i, a) {
    let o = r;
    if (Ch(o)) {
      const l = Au(o);
      if (l.operationType !== n)
        throw new Error(
          `Failed to create a GraphQL handler: provided a DocumentNode with a mismatched operation type (expected "${n}", but got "${l.operationType}").`
        );
      if (!l.operationName)
        throw new Error(
          "Failed to create a GraphQL handler: provided a DocumentNode with no operation name."
        );
      o = l.operationName;
    }
    const c = typeof o == "function" ? "[custom predicate]" : o, u = n === "all" ? `${n} (origin: ${s.toString()})` : `${n}${c ? ` ${c}` : ""} (origin: ${s.toString()})`;
    super({
      info: {
        header: u,
        operationType: n,
        operationName: o
      },
      resolver: i,
      options: a
    });
    V(this, "endpoint");
    this.endpoint = s;
  }
  /**
   * Parses the request body, once per request, cached across all
   * GraphQL handlers. This is done to avoid multiple parsing of the
   * request body, which each requires a clone of the request.
   */
  async parseGraphQLRequestOrGetFromCache(n) {
    return On.parsedRequestCache.has(n) || On.parsedRequestCache.set(
      n,
      await Ah(n).catch((r) => {
        console.error(r);
      })
    ), On.parsedRequestCache.get(n);
  }
  async parse(n) {
    const r = pu(new URL(n.request.url), this.endpoint), s = Su(n.request);
    if (!r.matches)
      return {
        match: r,
        cookies: s
      };
    const i = await this.parseGraphQLRequestOrGetFromCache(
      n.request
    );
    return typeof i > "u" ? {
      match: r,
      cookies: s
    } : {
      match: r,
      cookies: s,
      query: i.query,
      operationType: i.operationType,
      operationName: i.operationName,
      variables: i.variables
    };
  }
  async predicate(n) {
    if (n.parsedResult.operationType === void 0)
      return !1;
    if (!n.parsedResult.operationName && this.info.operationType !== "all") {
      const i = dn(n.request.url);
      return B.warn(`Failed to intercept a GraphQL request at "${n.request.method} ${i}": anonymous GraphQL operations are not supported.

Consider naming this operation or using "graphql.operation()" request handler to intercept GraphQL requests regardless of their operation name/type. Read more: https://mswjs.io/docs/api/graphql/#graphqloperationresolver`), !1;
    }
    const r = this.info.operationType === "all" || n.parsedResult.operationType === this.info.operationType, s = await this.matchOperationName({
      request: n.request,
      parsedResult: n.parsedResult
    });
    return n.parsedResult.match.matches && r && s;
  }
  async matchOperationName(n) {
    if (typeof this.info.operationName == "function") {
      const r = await this.info.operationName({
        request: n.request,
        ...this.extendResolverArgs({
          request: n.request,
          parsedResult: n.parsedResult
        })
      });
      return typeof r == "boolean" ? r : r.matches;
    }
    return this.info.operationName instanceof RegExp ? this.info.operationName.test(n.parsedResult.operationName || "") : n.parsedResult.operationName === this.info.operationName;
  }
  extendResolverArgs(n) {
    return {
      query: n.parsedResult.query || "",
      operationType: n.parsedResult.operationType,
      operationName: n.parsedResult.operationName || "",
      variables: n.parsedResult.variables || {},
      cookies: n.parsedResult.cookies
    };
  }
  async log(n) {
    const r = await tu(n.request), s = await ou(n.response), i = eu(s.status), a = n.parsedResult.operationName ? `${n.parsedResult.operationType} ${n.parsedResult.operationName}` : `anonymous ${n.parsedResult.operationType}`;
    console.groupCollapsed(
      B.formatMessage(
        `${_t()} ${a} (%c${s.status} ${s.statusText}%c)`
      ),
      `color:${i}`,
      "color:inherit"
    ), console.log("Request:", r), console.log("Handler:", this), console.log("Response:", s), console.groupEnd();
  }
};
V(On, "parsedRequestCache", /* @__PURE__ */ new WeakMap());
let fs = On;
function ps(e, t) {
  return (n, r, s = {}) => new fs(e, n, t, r, s);
}
function Cu(e) {
  return (t) => new fs("all", new RegExp(".*"), e, t);
}
const Rh = {
  /**
   * Intercepts a GraphQL query by a given name.
   *
   * @example
   * graphql.query('GetUser', () => {
   *   return HttpResponse.json({ data: { user: { name: 'John' } } })
   * })
   *
   * @see {@link https://mswjs.io/docs/api/graphql#graphqlqueryqueryname-resolver `graphql.query()` API reference}
   */
  query: ps("query", "*"),
  /**
   * Intercepts a GraphQL mutation by its name.
   *
   * @example
   * graphql.mutation('SavePost', () => {
   *   return HttpResponse.json({ data: { post: { id: 'abc-123 } } })
   * })
   *
   * @see {@link https://mswjs.io/docs/api/graphql#graphqlmutationmutationname-resolver `graphql.query()` API reference}
   *
   */
  mutation: ps("mutation", "*"),
  /**
   * Intercepts any GraphQL operation, regardless of its type or name.
   *
   * @example
   * graphql.operation(() => {
   *   return HttpResponse.json({ data: { name: 'John' } })
   * })
   *
   * @see {@link https://mswjs.io/docs/api/graphql#graphqloperationresolver `graphql.operation()` API reference}
   */
  operation: Cu("*")
};
function Lh(e) {
  return {
    operation: Cu(e),
    query: ps("query", e),
    mutation: ps("mutation", e)
  };
}
const Ru = {
  ...Rh,
  /**
   * Intercepts GraphQL operations scoped by the given URL.
   *
   * @example
   * const github = graphql.link('https://api.github.com/graphql')
   * github.query('GetRepo', resolver)
   *
   * @see {@link https://mswjs.io/docs/api/graphql#graphqllinkurl `graphql.link()` API reference}
   */
  link: Lh
};
function jh() {
  const e = (t, n) => {
    e.state = "pending", e.resolve = (r) => {
      if (e.state !== "pending")
        return;
      e.result = r;
      const s = (i) => (e.state = "fulfilled", i);
      return t(
        r instanceof Promise ? r : Promise.resolve(r).then(s)
      );
    }, e.reject = (r) => {
      if (e.state === "pending")
        return queueMicrotask(() => {
          e.state = "rejected";
        }), n(e.rejectionReason = r);
    };
  };
  return e;
}
var qt, $n, ns, qc, Ph = (qc = class extends Promise {
  constructor(n = null) {
    const r = jh();
    super((s, i) => {
      r(s, i), n == null || n(r.resolve, r.reject);
    });
    Ue(this, $n);
    Ue(this, qt);
    V(this, "resolve");
    V(this, "reject");
    At(this, qt, r), this.resolve = W(this, qt).resolve, this.reject = W(this, qt).reject;
  }
  get state() {
    return W(this, qt).state;
  }
  get rejectionReason() {
    return W(this, qt).rejectionReason;
  }
  then(n, r) {
    return we(this, $n, ns).call(this, super.then(n, r));
  }
  catch(n) {
    return we(this, $n, ns).call(this, super.catch(n));
  }
  finally(n) {
    return we(this, $n, ns).call(this, super.finally(n));
  }
}, qt = new WeakMap(), $n = new WeakSet(), ns = function(n) {
  return Object.defineProperties(n, {
    resolve: { configurable: !0, value: this.resolve },
    reject: { configurable: !0, value: this.reject }
  });
}, qc);
async function $h(e) {
  try {
    return [null, await e().catch((t) => {
      throw t;
    })];
  } catch (t) {
    return [t, null];
  }
}
const Mh = async ({
  request: e,
  requestId: t,
  handlers: n,
  resolutionContext: r
}) => {
  let s = null, i = null;
  for (const a of n)
    if (i = await a.run({ request: e, requestId: t, resolutionContext: r }), i !== null && (s = a), i != null && i.response)
      break;
  return s ? {
    handler: s,
    parsedResult: i == null ? void 0 : i.parsedResult,
    response: i == null ? void 0 : i.response
  } : null;
};
function Fh(e) {
  const t = new URL(e.url);
  return t.protocol === "file:" || /(fonts\.googleapis\.com)/.test(t.hostname) || /node_modules/.test(t.pathname) || t.pathname.includes("@vite") ? !0 : /\.(s?css|less|m?jsx?|m?tsx?|html|ttf|otf|woff|woff2|eot|gif|jpe?g|png|avif|webp|svg|mp4|webm|ogg|mov|mp3|wav|ogg|flac|aac|pdf|txt|csv|json|xml|md|zip|tar|gz|rar|7z)$/i.test(
    t.pathname
  );
}
async function Lu(e, t = "warn") {
  const n = new URL(e.url), r = dn(n) + n.search, s = e.method === "HEAD" || e.method === "GET" ? null : await e.clone().text(), a = `intercepted a request without a matching request handler:${`

  • ${e.method} ${r}

${s ? `  • Request body: ${s}

` : ""}`}If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/http/intercepting-requests`;
  function o(c) {
    switch (c) {
      case "error":
        throw B.error("Error: %s", a), new to(
          B.formatMessage(
            'Cannot bypass a request when using the "error" strategy for the "onUnhandledRequest" option.'
          )
        );
      case "warn": {
        B.warn("Warning: %s", a);
        break;
      }
      case "bypass":
        break;
      default:
        throw new to(
          B.formatMessage(
            'Failed to react to an unhandled request: unknown strategy "%s". Please provide one of the supported strategies ("bypass", "warn", "error") or a custom callback function as the value of the "onUnhandledRequest" option.',
            c
          )
        );
    }
  }
  if (typeof t == "function") {
    t(e, {
      warning: o.bind(null, "warn"),
      error: o.bind(null, "error")
    });
    return;
  }
  Fh(e) || o(t);
}
const { message: Uh } = au, ju = Symbol("kSetCookie");
function Yt(e = {}) {
  const t = (e == null ? void 0 : e.status) || 200, n = (e == null ? void 0 : e.statusText) || Uh[t] || "", r = new Headers(e == null ? void 0 : e.headers);
  return {
    ...e,
    headers: r,
    status: t,
    statusText: n
  };
}
function zh(e, t) {
  t.type && Object.defineProperty(e, "type", {
    value: t.type,
    enumerable: !0,
    writable: !1
  });
  const n = t.headers.get("set-cookie");
  if (n && (Object.defineProperty(e, ju, {
    value: n,
    enumerable: !1,
    writable: !1
  }), typeof document < "u")) {
    const r = Ou.prototype.getSetCookie.call(
      t.headers
    );
    for (const s of r)
      document.cookie = s;
  }
  return e;
}
async function qh(e, t) {
  const n = Reflect.get(t, ju);
  n && await Iu.setCookie(n, e.url);
}
async function Pu(e, t, n, r, s, i) {
  var l, d, p, h, m, g;
  if (s.emit("request:start", { request: e, requestId: t }), (l = e.headers.get("accept")) != null && l.includes("msw/passthrough")) {
    s.emit("request:end", { request: e, requestId: t }), (d = i == null ? void 0 : i.onPassthroughResponse) == null || d.call(i, e);
    return;
  }
  const [a, o] = await $h(() => Mh({
    request: e,
    requestId: t,
    handlers: n,
    resolutionContext: i == null ? void 0 : i.resolutionContext
  }));
  if (a)
    throw s.emit("unhandledException", {
      error: a,
      request: e,
      requestId: t
    }), a;
  if (!o) {
    await Lu(e, r.onUnhandledRequest), s.emit("request:unhandled", { request: e, requestId: t }), s.emit("request:end", { request: e, requestId: t }), (p = i == null ? void 0 : i.onPassthroughResponse) == null || p.call(i, e);
    return;
  }
  const { response: c } = o;
  if (!c) {
    s.emit("request:end", { request: e, requestId: t }), (h = i == null ? void 0 : i.onPassthroughResponse) == null || h.call(i, e);
    return;
  }
  if (c.status === 302 && c.headers.get("x-msw-intention") === "passthrough") {
    s.emit("request:end", { request: e, requestId: t }), (m = i == null ? void 0 : i.onPassthroughResponse) == null || m.call(i, e);
    return;
  }
  await qh(e, c), s.emit("request:match", { request: e, requestId: t });
  const u = o;
  return (g = i == null ? void 0 : i.onMockedResponse) == null || g.call(i, c, u), s.emit("request:end", { request: e, requestId: t }), c;
}
const Vh = Symbol("bodyType");
var Vc, Bc;
class T extends (Bc = ua, Vc = Vh, Bc) {
  constructor(n, r) {
    const s = Yt(r);
    super(n, s);
    V(this, Vc, null);
    zh(this, s);
  }
  static error() {
    return super.error();
  }
  /**
   * Create a `Response` with a `Content-Type: "text/plain"` body.
   * @example
   * HttpResponse.text('hello world')
   * HttpResponse.text('Error', { status: 500 })
   */
  static text(n, r) {
    const s = Yt(r);
    return s.headers.has("Content-Type") || s.headers.set("Content-Type", "text/plain"), s.headers.has("Content-Length") || s.headers.set(
      "Content-Length",
      n ? new Blob([n]).size.toString() : "0"
    ), new T(n, s);
  }
  /**
   * Create a `Response` with a `Content-Type: "application/json"` body.
   * @example
   * HttpResponse.json({ firstName: 'John' })
   * HttpResponse.json({ error: 'Not Authorized' }, { status: 401 })
   */
  static json(n, r) {
    const s = Yt(r);
    s.headers.has("Content-Type") || s.headers.set("Content-Type", "application/json");
    const i = JSON.stringify(n);
    return s.headers.has("Content-Length") || s.headers.set(
      "Content-Length",
      i ? new Blob([i]).size.toString() : "0"
    ), new T(i, s);
  }
  /**
   * Create a `Response` with a `Content-Type: "application/xml"` body.
   * @example
   * HttpResponse.xml(`<user name="John" />`)
   * HttpResponse.xml(`<article id="abc-123" />`, { status: 201 })
   */
  static xml(n, r) {
    const s = Yt(r);
    return s.headers.has("Content-Type") || s.headers.set("Content-Type", "text/xml"), new T(n, s);
  }
  /**
   * Create a `Response` with a `Content-Type: "text/html"` body.
   * @example
   * HttpResponse.html(`<p class="author">Jane Doe</p>`)
   * HttpResponse.html(`<main id="abc-123">Main text</main>`, { status: 201 })
   */
  static html(n, r) {
    const s = Yt(r);
    return s.headers.has("Content-Type") || s.headers.set("Content-Type", "text/html"), new T(n, s);
  }
  /**
   * Create a `Response` with an `ArrayBuffer` body.
   * @example
   * const buffer = new ArrayBuffer(3)
   * const view = new Uint8Array(buffer)
   * view.set([1, 2, 3])
   *
   * HttpResponse.arrayBuffer(buffer)
   */
  static arrayBuffer(n, r) {
    const s = Yt(r);
    return s.headers.has("Content-Type") || s.headers.set("Content-Type", "application/octet-stream"), n && !s.headers.has("Content-Length") && s.headers.set("Content-Length", n.byteLength.toString()), new T(n, s);
  }
  /**
   * Create a `Response` with a `FormData` body.
   * @example
   * const data = new FormData()
   * data.set('name', 'Alice')
   *
   * HttpResponse.formData(data)
   */
  static formData(n, r) {
    return new T(n, Yt(r));
  }
}
pf();
const js = crypto, $u = (e) => e instanceof CryptoKey, dt = new TextEncoder(), Un = new TextDecoder();
function Mu(...e) {
  const t = e.reduce((s, { length: i }) => s + i, 0), n = new Uint8Array(t);
  let r = 0;
  for (const s of e)
    n.set(s, r), r += s.length;
  return n;
}
const Bh = (e) => {
  let t = e;
  typeof t == "string" && (t = dt.encode(t));
  const n = 32768, r = [];
  for (let s = 0; s < t.length; s += n)
    r.push(String.fromCharCode.apply(null, t.subarray(s, s + n)));
  return btoa(r.join(""));
}, li = (e) => Bh(e).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"), Hh = (e) => {
  const t = atob(e), n = new Uint8Array(t.length);
  for (let r = 0; r < t.length; r++)
    n[r] = t.charCodeAt(r);
  return n;
}, rs = (e) => {
  let t = e;
  t instanceof Uint8Array && (t = Un.decode(t)), t = t.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return Hh(t);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
};
class fn extends Error {
  static get code() {
    return "ERR_JOSE_GENERIC";
  }
  constructor(t) {
    var n;
    super(t), this.code = "ERR_JOSE_GENERIC", this.name = this.constructor.name, (n = Error.captureStackTrace) == null || n.call(Error, this, this.constructor);
  }
}
class it extends fn {
  static get code() {
    return "ERR_JWT_CLAIM_VALIDATION_FAILED";
  }
  constructor(t, n, r = "unspecified", s = "unspecified") {
    super(t), this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED", this.claim = r, this.reason = s, this.payload = n;
  }
}
class Co extends fn {
  static get code() {
    return "ERR_JWT_EXPIRED";
  }
  constructor(t, n, r = "unspecified", s = "unspecified") {
    super(t), this.code = "ERR_JWT_EXPIRED", this.claim = r, this.reason = s, this.payload = n;
  }
}
class Zh extends fn {
  constructor() {
    super(...arguments), this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
  }
  static get code() {
    return "ERR_JOSE_ALG_NOT_ALLOWED";
  }
}
class Nn extends fn {
  constructor() {
    super(...arguments), this.code = "ERR_JOSE_NOT_SUPPORTED";
  }
  static get code() {
    return "ERR_JOSE_NOT_SUPPORTED";
  }
}
class se extends fn {
  constructor() {
    super(...arguments), this.code = "ERR_JWS_INVALID";
  }
  static get code() {
    return "ERR_JWS_INVALID";
  }
}
class ha extends fn {
  constructor() {
    super(...arguments), this.code = "ERR_JWT_INVALID";
  }
  static get code() {
    return "ERR_JWT_INVALID";
  }
}
class Gh extends fn {
  constructor() {
    super(...arguments), this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED", this.message = "signature verification failed";
  }
  static get code() {
    return "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  }
}
function mt(e, t = "algorithm.name") {
  return new TypeError(`CryptoKey does not support this operation, its ${t} must be ${e}`);
}
function qr(e, t) {
  return e.name === t;
}
function di(e) {
  return parseInt(e.name.slice(4), 10);
}
function Wh(e) {
  switch (e) {
    case "ES256":
      return "P-256";
    case "ES384":
      return "P-384";
    case "ES512":
      return "P-521";
    default:
      throw new Error("unreachable");
  }
}
function Jh(e, t) {
  if (t.length && !t.some((n) => e.usages.includes(n))) {
    let n = "CryptoKey does not support this operation, its usages must include ";
    if (t.length > 2) {
      const r = t.pop();
      n += `one of ${t.join(", ")}, or ${r}.`;
    } else t.length === 2 ? n += `one of ${t[0]} or ${t[1]}.` : n += `${t[0]}.`;
    throw new TypeError(n);
  }
}
function Yh(e, t, ...n) {
  switch (t) {
    case "HS256":
    case "HS384":
    case "HS512": {
      if (!qr(e.algorithm, "HMAC"))
        throw mt("HMAC");
      const r = parseInt(t.slice(2), 10);
      if (di(e.algorithm.hash) !== r)
        throw mt(`SHA-${r}`, "algorithm.hash");
      break;
    }
    case "RS256":
    case "RS384":
    case "RS512": {
      if (!qr(e.algorithm, "RSASSA-PKCS1-v1_5"))
        throw mt("RSASSA-PKCS1-v1_5");
      const r = parseInt(t.slice(2), 10);
      if (di(e.algorithm.hash) !== r)
        throw mt(`SHA-${r}`, "algorithm.hash");
      break;
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      if (!qr(e.algorithm, "RSA-PSS"))
        throw mt("RSA-PSS");
      const r = parseInt(t.slice(2), 10);
      if (di(e.algorithm.hash) !== r)
        throw mt(`SHA-${r}`, "algorithm.hash");
      break;
    }
    case "EdDSA": {
      if (e.algorithm.name !== "Ed25519" && e.algorithm.name !== "Ed448")
        throw mt("Ed25519 or Ed448");
      break;
    }
    case "ES256":
    case "ES384":
    case "ES512": {
      if (!qr(e.algorithm, "ECDSA"))
        throw mt("ECDSA");
      const r = Wh(t);
      if (e.algorithm.namedCurve !== r)
        throw mt(r, "algorithm.namedCurve");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  Jh(e, n);
}
function Fu(e, t, ...n) {
  var r;
  if (n.length > 2) {
    const s = n.pop();
    e += `one of type ${n.join(", ")}, or ${s}.`;
  } else n.length === 2 ? e += `one of type ${n[0]} or ${n[1]}.` : e += `of type ${n[0]}.`;
  return t == null ? e += ` Received ${t}` : typeof t == "function" && t.name ? e += ` Received function ${t.name}` : typeof t == "object" && t != null && (r = t.constructor) != null && r.name && (e += ` Received an instance of ${t.constructor.name}`), e;
}
const Ro = (e, ...t) => Fu("Key must be ", e, ...t);
function Uu(e, t, ...n) {
  return Fu(`Key for the ${e} algorithm must be `, t, ...n);
}
const zu = (e) => $u(e) ? !0 : (e == null ? void 0 : e[Symbol.toStringTag]) === "KeyObject", hs = ["CryptoKey"], qu = (...e) => {
  const t = e.filter(Boolean);
  if (t.length === 0 || t.length === 1)
    return !0;
  let n;
  for (const r of t) {
    const s = Object.keys(r);
    if (!n || n.size === 0) {
      n = new Set(s);
      continue;
    }
    for (const i of s) {
      if (n.has(i))
        return !1;
      n.add(i);
    }
  }
  return !0;
};
function Qh(e) {
  return typeof e == "object" && e !== null;
}
function ms(e) {
  if (!Qh(e) || Object.prototype.toString.call(e) !== "[object Object]")
    return !1;
  if (Object.getPrototypeOf(e) === null)
    return !0;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t;
}
const Vu = (e, t) => {
  if (e.startsWith("RS") || e.startsWith("PS")) {
    const { modulusLength: n } = t.algorithm;
    if (typeof n != "number" || n < 2048)
      throw new TypeError(`${e} requires key modulusLength to be 2048 bits or larger`);
  }
};
function Xh(e) {
  let t, n;
  switch (e.kty) {
    case "RSA": {
      switch (e.alg) {
        case "PS256":
        case "PS384":
        case "PS512":
          t = { name: "RSA-PSS", hash: `SHA-${e.alg.slice(-3)}` }, n = e.d ? ["sign"] : ["verify"];
          break;
        case "RS256":
        case "RS384":
        case "RS512":
          t = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${e.alg.slice(-3)}` }, n = e.d ? ["sign"] : ["verify"];
          break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
          t = {
            name: "RSA-OAEP",
            hash: `SHA-${parseInt(e.alg.slice(-3), 10) || 1}`
          }, n = e.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
          break;
        default:
          throw new Nn('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "EC": {
      switch (e.alg) {
        case "ES256":
          t = { name: "ECDSA", namedCurve: "P-256" }, n = e.d ? ["sign"] : ["verify"];
          break;
        case "ES384":
          t = { name: "ECDSA", namedCurve: "P-384" }, n = e.d ? ["sign"] : ["verify"];
          break;
        case "ES512":
          t = { name: "ECDSA", namedCurve: "P-521" }, n = e.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          t = { name: "ECDH", namedCurve: e.crv }, n = e.d ? ["deriveBits"] : [];
          break;
        default:
          throw new Nn('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "OKP": {
      switch (e.alg) {
        case "EdDSA":
          t = { name: e.crv }, n = e.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          t = { name: e.crv }, n = e.d ? ["deriveBits"] : [];
          break;
        default:
          throw new Nn('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    default:
      throw new Nn('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
  }
  return { algorithm: t, keyUsages: n };
}
const Kh = async (e) => {
  if (!e.alg)
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  const { algorithm: t, keyUsages: n } = Xh(e), r = [
    t,
    e.ext ?? !1,
    e.key_ops ?? n
  ], s = { ...e };
  return delete s.alg, delete s.use, js.subtle.importKey("jwk", s, ...r);
}, Bu = (e) => rs(e);
let fi, pi;
const Hu = (e) => (e == null ? void 0 : e[Symbol.toStringTag]) === "KeyObject", Zu = async (e, t, n, r) => {
  let s = e.get(t);
  if (s != null && s[r])
    return s[r];
  const i = await Kh({ ...n, alg: r });
  return s ? s[r] = i : e.set(t, { [r]: i }), i;
}, em = (e, t) => {
  if (Hu(e)) {
    let n = e.export({ format: "jwk" });
    return delete n.d, delete n.dp, delete n.dq, delete n.p, delete n.q, delete n.qi, n.k ? Bu(n.k) : (pi || (pi = /* @__PURE__ */ new WeakMap()), Zu(pi, e, n, t));
  }
  return e;
}, tm = (e, t) => {
  if (Hu(e)) {
    let n = e.export({ format: "jwk" });
    return n.k ? Bu(n.k) : (fi || (fi = /* @__PURE__ */ new WeakMap()), Zu(fi, e, n, t));
  }
  return e;
}, Lo = { normalizePublicKey: em, normalizePrivateKey: tm }, En = (e) => e == null ? void 0 : e[Symbol.toStringTag], nm = (e, t) => {
  if (!(t instanceof Uint8Array)) {
    if (!zu(t))
      throw new TypeError(Uu(e, t, ...hs, "Uint8Array"));
    if (t.type !== "secret")
      throw new TypeError(`${En(t)} instances for symmetric algorithms must be of type "secret"`);
  }
}, rm = (e, t, n) => {
  if (!zu(t))
    throw new TypeError(Uu(e, t, ...hs));
  if (t.type === "secret")
    throw new TypeError(`${En(t)} instances for asymmetric algorithms must not be of type "secret"`);
  if (n === "sign" && t.type === "public")
    throw new TypeError(`${En(t)} instances for asymmetric algorithm signing must be of type "private"`);
  if (n === "decrypt" && t.type === "public")
    throw new TypeError(`${En(t)} instances for asymmetric algorithm decryption must be of type "private"`);
  if (t.algorithm && n === "verify" && t.type === "private")
    throw new TypeError(`${En(t)} instances for asymmetric algorithm verifying must be of type "public"`);
  if (t.algorithm && n === "encrypt" && t.type === "private")
    throw new TypeError(`${En(t)} instances for asymmetric algorithm encryption must be of type "public"`);
}, Gu = (e, t, n) => {
  e.startsWith("HS") || e === "dir" || e.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(e) ? nm(e, t) : rm(e, t, n);
};
function Wu(e, t, n, r, s) {
  if (s.crit !== void 0 && (r == null ? void 0 : r.crit) === void 0)
    throw new e('"crit" (Critical) Header Parameter MUST be integrity protected');
  if (!r || r.crit === void 0)
    return /* @__PURE__ */ new Set();
  if (!Array.isArray(r.crit) || r.crit.length === 0 || r.crit.some((a) => typeof a != "string" || a.length === 0))
    throw new e('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  let i;
  n !== void 0 ? i = new Map([...Object.entries(n), ...t.entries()]) : i = t;
  for (const a of r.crit) {
    if (!i.has(a))
      throw new Nn(`Extension Header Parameter "${a}" is not recognized`);
    if (s[a] === void 0)
      throw new e(`Extension Header Parameter "${a}" is missing`);
    if (i.get(a) && r[a] === void 0)
      throw new e(`Extension Header Parameter "${a}" MUST be integrity protected`);
  }
  return new Set(r.crit);
}
const sm = (e, t) => {
  if (t !== void 0 && (!Array.isArray(t) || t.some((n) => typeof n != "string")))
    throw new TypeError(`"${e}" option must be an array of strings`);
  if (t)
    return new Set(t);
};
function Ju(e, t) {
  const n = `SHA-${e.slice(-3)}`;
  switch (e) {
    case "HS256":
    case "HS384":
    case "HS512":
      return { hash: n, name: "HMAC" };
    case "PS256":
    case "PS384":
    case "PS512":
      return { hash: n, name: "RSA-PSS", saltLength: e.slice(-3) >> 3 };
    case "RS256":
    case "RS384":
    case "RS512":
      return { hash: n, name: "RSASSA-PKCS1-v1_5" };
    case "ES256":
    case "ES384":
    case "ES512":
      return { hash: n, name: "ECDSA", namedCurve: t.namedCurve };
    case "EdDSA":
      return { name: t.name };
    default:
      throw new Nn(`alg ${e} is not supported either by JOSE or your javascript runtime`);
  }
}
async function Yu(e, t, n) {
  if (n === "sign" && (t = await Lo.normalizePrivateKey(t, e)), n === "verify" && (t = await Lo.normalizePublicKey(t, e)), $u(t))
    return Yh(t, e, n), t;
  if (t instanceof Uint8Array) {
    if (!e.startsWith("HS"))
      throw new TypeError(Ro(t, ...hs));
    return js.subtle.importKey("raw", t, { hash: `SHA-${e.slice(-3)}`, name: "HMAC" }, !1, [n]);
  }
  throw new TypeError(Ro(t, ...hs, "Uint8Array"));
}
const im = async (e, t, n, r) => {
  const s = await Yu(e, t, "verify");
  Vu(e, s);
  const i = Ju(e, s.algorithm);
  try {
    return await js.subtle.verify(i, s, n, r);
  } catch {
    return !1;
  }
};
async function am(e, t, n) {
  if (!ms(e))
    throw new se("Flattened JWS must be an object");
  if (e.protected === void 0 && e.header === void 0)
    throw new se('Flattened JWS must have either of the "protected" or "header" members');
  if (e.protected !== void 0 && typeof e.protected != "string")
    throw new se("JWS Protected Header incorrect type");
  if (e.payload === void 0)
    throw new se("JWS Payload missing");
  if (typeof e.signature != "string")
    throw new se("JWS Signature missing or incorrect type");
  if (e.header !== void 0 && !ms(e.header))
    throw new se("JWS Unprotected Header incorrect type");
  let r = {};
  if (e.protected)
    try {
      const g = rs(e.protected);
      r = JSON.parse(Un.decode(g));
    } catch {
      throw new se("JWS Protected Header is invalid");
    }
  if (!qu(r, e.header))
    throw new se("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  const s = {
    ...r,
    ...e.header
  }, i = Wu(se, /* @__PURE__ */ new Map([["b64", !0]]), n == null ? void 0 : n.crit, r, s);
  let a = !0;
  if (i.has("b64") && (a = r.b64, typeof a != "boolean"))
    throw new se('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
  const { alg: o } = s;
  if (typeof o != "string" || !o)
    throw new se('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  const c = n && sm("algorithms", n.algorithms);
  if (c && !c.has(o))
    throw new Zh('"alg" (Algorithm) Header Parameter value not allowed');
  if (a) {
    if (typeof e.payload != "string")
      throw new se("JWS Payload must be a string");
  } else if (typeof e.payload != "string" && !(e.payload instanceof Uint8Array))
    throw new se("JWS Payload must be a string or an Uint8Array instance");
  let u = !1;
  typeof t == "function" && (t = await t(r, e), u = !0), Gu(o, t, "verify");
  const l = Mu(dt.encode(e.protected ?? ""), dt.encode("."), typeof e.payload == "string" ? dt.encode(e.payload) : e.payload);
  let d;
  try {
    d = rs(e.signature);
  } catch {
    throw new se("Failed to base64url decode the signature");
  }
  if (!await im(o, t, d, l))
    throw new Gh();
  let h;
  if (a)
    try {
      h = rs(e.payload);
    } catch {
      throw new se("Failed to base64url decode the payload");
    }
  else typeof e.payload == "string" ? h = dt.encode(e.payload) : h = e.payload;
  const m = { payload: h };
  return e.protected !== void 0 && (m.protectedHeader = r), e.header !== void 0 && (m.unprotectedHeader = e.header), u ? { ...m, key: t } : m;
}
async function om(e, t, n) {
  if (e instanceof Uint8Array && (e = Un.decode(e)), typeof e != "string")
    throw new se("Compact JWS must be a string or Uint8Array");
  const { 0: r, 1: s, 2: i, length: a } = e.split(".");
  if (a !== 3)
    throw new se("Invalid Compact JWS");
  const o = await am({ payload: s, protected: r, signature: i }, t, n), c = { payload: o.payload, protectedHeader: o.protectedHeader };
  return typeof t == "function" ? { ...c, key: o.key } : c;
}
const Mt = (e) => Math.floor(e.getTime() / 1e3), Qu = 60, Xu = Qu * 60, ma = Xu * 24, cm = ma * 7, um = ma * 365.25, lm = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i, fr = (e) => {
  const t = lm.exec(e);
  if (!t || t[4] && t[1])
    throw new TypeError("Invalid time period format");
  const n = parseFloat(t[2]), r = t[3].toLowerCase();
  let s;
  switch (r) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      s = Math.round(n);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      s = Math.round(n * Qu);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      s = Math.round(n * Xu);
      break;
    case "day":
    case "days":
    case "d":
      s = Math.round(n * ma);
      break;
    case "week":
    case "weeks":
    case "w":
      s = Math.round(n * cm);
      break;
    default:
      s = Math.round(n * um);
      break;
  }
  return t[1] === "-" || t[4] === "ago" ? -s : s;
}, jo = (e) => e.toLowerCase().replace(/^application\//, ""), dm = (e, t) => typeof e == "string" ? t.includes(e) : Array.isArray(e) ? t.some(Set.prototype.has.bind(new Set(e))) : !1, fm = (e, t, n = {}) => {
  let r;
  try {
    r = JSON.parse(Un.decode(t));
  } catch {
  }
  if (!ms(r))
    throw new ha("JWT Claims Set must be a top-level JSON object");
  const { typ: s } = n;
  if (s && (typeof e.typ != "string" || jo(e.typ) !== jo(s)))
    throw new it('unexpected "typ" JWT header value', r, "typ", "check_failed");
  const { requiredClaims: i = [], issuer: a, subject: o, audience: c, maxTokenAge: u } = n, l = [...i];
  u !== void 0 && l.push("iat"), c !== void 0 && l.push("aud"), o !== void 0 && l.push("sub"), a !== void 0 && l.push("iss");
  for (const m of new Set(l.reverse()))
    if (!(m in r))
      throw new it(`missing required "${m}" claim`, r, m, "missing");
  if (a && !(Array.isArray(a) ? a : [a]).includes(r.iss))
    throw new it('unexpected "iss" claim value', r, "iss", "check_failed");
  if (o && r.sub !== o)
    throw new it('unexpected "sub" claim value', r, "sub", "check_failed");
  if (c && !dm(r.aud, typeof c == "string" ? [c] : c))
    throw new it('unexpected "aud" claim value', r, "aud", "check_failed");
  let d;
  switch (typeof n.clockTolerance) {
    case "string":
      d = fr(n.clockTolerance);
      break;
    case "number":
      d = n.clockTolerance;
      break;
    case "undefined":
      d = 0;
      break;
    default:
      throw new TypeError("Invalid clockTolerance option type");
  }
  const { currentDate: p } = n, h = Mt(p || /* @__PURE__ */ new Date());
  if ((r.iat !== void 0 || u) && typeof r.iat != "number")
    throw new it('"iat" claim must be a number', r, "iat", "invalid");
  if (r.nbf !== void 0) {
    if (typeof r.nbf != "number")
      throw new it('"nbf" claim must be a number', r, "nbf", "invalid");
    if (r.nbf > h + d)
      throw new it('"nbf" claim timestamp check failed', r, "nbf", "check_failed");
  }
  if (r.exp !== void 0) {
    if (typeof r.exp != "number")
      throw new it('"exp" claim must be a number', r, "exp", "invalid");
    if (r.exp <= h - d)
      throw new Co('"exp" claim timestamp check failed', r, "exp", "check_failed");
  }
  if (u) {
    const m = h - r.iat, g = typeof u == "number" ? u : fr(u);
    if (m - d > g)
      throw new Co('"iat" claim timestamp check failed (too far in the past)', r, "iat", "check_failed");
    if (m < 0 - d)
      throw new it('"iat" claim timestamp check failed (it should be in the past)', r, "iat", "check_failed");
  }
  return r;
};
async function Ku(e, t, n) {
  var a;
  const r = await om(e, t, n);
  if ((a = r.protectedHeader.crit) != null && a.includes("b64") && r.protectedHeader.b64 === !1)
    throw new ha("JWTs MUST NOT use unencoded payload");
  const i = { payload: fm(r.protectedHeader, r.payload, n), protectedHeader: r.protectedHeader };
  return typeof t == "function" ? { ...i, key: r.key } : i;
}
const pm = async (e, t, n) => {
  const r = await Yu(e, t, "sign");
  Vu(e, r);
  const s = await js.subtle.sign(Ju(e, r.algorithm), r, n);
  return new Uint8Array(s);
};
class hm {
  constructor(t) {
    if (!(t instanceof Uint8Array))
      throw new TypeError("payload must be an instance of Uint8Array");
    this._payload = t;
  }
  setProtectedHeader(t) {
    if (this._protectedHeader)
      throw new TypeError("setProtectedHeader can only be called once");
    return this._protectedHeader = t, this;
  }
  setUnprotectedHeader(t) {
    if (this._unprotectedHeader)
      throw new TypeError("setUnprotectedHeader can only be called once");
    return this._unprotectedHeader = t, this;
  }
  async sign(t, n) {
    if (!this._protectedHeader && !this._unprotectedHeader)
      throw new se("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
    if (!qu(this._protectedHeader, this._unprotectedHeader))
      throw new se("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    const r = {
      ...this._protectedHeader,
      ...this._unprotectedHeader
    }, s = Wu(se, /* @__PURE__ */ new Map([["b64", !0]]), n == null ? void 0 : n.crit, this._protectedHeader, r);
    let i = !0;
    if (s.has("b64") && (i = this._protectedHeader.b64, typeof i != "boolean"))
      throw new se('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    const { alg: a } = r;
    if (typeof a != "string" || !a)
      throw new se('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    Gu(a, t, "sign");
    let o = this._payload;
    i && (o = dt.encode(li(o)));
    let c;
    this._protectedHeader ? c = dt.encode(li(JSON.stringify(this._protectedHeader))) : c = dt.encode("");
    const u = Mu(c, dt.encode("."), o), l = await pm(a, t, u), d = {
      signature: li(l),
      payload: ""
    };
    return i && (d.payload = Un.decode(o)), this._unprotectedHeader && (d.header = this._unprotectedHeader), this._protectedHeader && (d.protected = Un.decode(c)), d;
  }
}
class mm {
  constructor(t) {
    this._flattened = new hm(t);
  }
  setProtectedHeader(t) {
    return this._flattened.setProtectedHeader(t), this;
  }
  async sign(t, n) {
    const r = await this._flattened.sign(t, n);
    if (r.payload === void 0)
      throw new TypeError("use the flattened module for creating JWS with b64: false");
    return `${r.protected}.${r.payload}.${r.signature}`;
  }
}
function Qt(e, t) {
  if (!Number.isFinite(t))
    throw new TypeError(`Invalid ${e} input`);
  return t;
}
class gm {
  constructor(t = {}) {
    if (!ms(t))
      throw new TypeError("JWT Claims Set MUST be an object");
    this._payload = t;
  }
  setIssuer(t) {
    return this._payload = { ...this._payload, iss: t }, this;
  }
  setSubject(t) {
    return this._payload = { ...this._payload, sub: t }, this;
  }
  setAudience(t) {
    return this._payload = { ...this._payload, aud: t }, this;
  }
  setJti(t) {
    return this._payload = { ...this._payload, jti: t }, this;
  }
  setNotBefore(t) {
    return typeof t == "number" ? this._payload = { ...this._payload, nbf: Qt("setNotBefore", t) } : t instanceof Date ? this._payload = { ...this._payload, nbf: Qt("setNotBefore", Mt(t)) } : this._payload = { ...this._payload, nbf: Mt(/* @__PURE__ */ new Date()) + fr(t) }, this;
  }
  setExpirationTime(t) {
    return typeof t == "number" ? this._payload = { ...this._payload, exp: Qt("setExpirationTime", t) } : t instanceof Date ? this._payload = { ...this._payload, exp: Qt("setExpirationTime", Mt(t)) } : this._payload = { ...this._payload, exp: Mt(/* @__PURE__ */ new Date()) + fr(t) }, this;
  }
  setIssuedAt(t) {
    return typeof t > "u" ? this._payload = { ...this._payload, iat: Mt(/* @__PURE__ */ new Date()) } : t instanceof Date ? this._payload = { ...this._payload, iat: Qt("setIssuedAt", Mt(t)) } : typeof t == "string" ? this._payload = {
      ...this._payload,
      iat: Qt("setIssuedAt", Mt(/* @__PURE__ */ new Date()) + fr(t))
    } : this._payload = { ...this._payload, iat: Qt("setIssuedAt", t) }, this;
  }
}
class el extends gm {
  setProtectedHeader(t) {
    return this._protectedHeader = t, this;
  }
  async sign(t, n) {
    var s;
    const r = new mm(dt.encode(JSON.stringify(this._payload)));
    if (r.setProtectedHeader(this._protectedHeader), Array.isArray((s = this._protectedHeader) == null ? void 0 : s.crit) && this._protectedHeader.crit.includes("b64") && this._protectedHeader.b64 === !1)
      throw new ha("JWTs MUST NOT use unencoded payload");
    return r.sign(t, n);
  }
}
const Ps = [
  {
    id: 1,
    username: "helenahills",
    email: "helena.hills@social.com",
    profileImage: "/assets/profiles/user-helena.png",
    firstName: "Helena",
    secondName: "Hills",
    description: "Team lead overseeing product development and architecture across multiple platforms.",
    lastLogin: "2025-10-08T07:40:00.000Z",
    creationDate: "2024-05-15T12:00:00.000Z",
    modifiedDate: "2025-10-07T11:22:00.000Z"
  },
  {
    id: 2,
    username: "charles_davis",
    email: "charles@mail.com",
    profileImage: "/assets/profiles/user-charles.png",
    firstName: "Charles",
    secondName: "Davis",
    description: "Senior UX/UI Designer focusing on improving application usability and user experience flow.",
    lastLogin: "2025-10-06T15:30:00.000Z",
    creationDate: "2024-08-20T09:15:00.000Z",
    modifiedDate: "2025-09-01T10:00:00.000Z"
  },
  {
    id: 3,
    username: "mike_pm_global",
    email: "mike.p@example.com",
    profileImage: null,
    firstName: "Mike",
    secondName: "Project",
    description: "Project Manager responsible for resource allocation, scheduling, and high-level client communication.",
    lastLogin: "2025-10-07T09:05:00.000Z",
    creationDate: "2024-01-10T07:00:00.000Z",
    modifiedDate: "2025-10-07T09:05:00.000Z"
  },
  {
    id: 4,
    username: "anna_backend",
    email: "anna.backend@example.com",
    profileImage: "/assets/profiles/user-anna.png",
    firstName: "Anna",
    secondName: "Kowalska",
    description: "Backend engineer working on APIs, database optimization, and microservices.",
    lastLogin: "2025-10-08T10:15:00.000Z",
    creationDate: "2024-06-10T09:00:00.000Z",
    modifiedDate: "2025-10-08T10:15:00.000Z"
  },
  {
    id: 5,
    username: "tom_devops",
    email: "tom.devops@example.com",
    profileImage: "/assets/profiles/user-tom.png",
    firstName: "Tom",
    secondName: "Anderson",
    description: "DevOps engineer handling CI/CD pipelines, infrastructure, and monitoring.",
    lastLogin: "2025-10-08T11:00:00.000Z",
    creationDate: "2024-07-01T08:30:00.000Z",
    modifiedDate: "2025-10-08T11:00:00.000Z"
  }
], P = "/api", ym = "SIDEKICK", tl = new TextEncoder().encode(ym), zn = "helena.hills@social.com", $s = "password789", nl = tl, rl = "HS256", Pi = [], sl = (e) => {
  Pi.includes(e) || Pi.push(e);
}, ga = (e) => {
  const t = e.headers.get("Authorization");
  return t != null && t.startsWith("Bearer ") ? t.substring(7) : null;
}, il = async (e) => new el({ userId: e }).setProtectedHeader({ alg: rl }).setIssuedAt().setExpirationTime("2h").sign(nl), vm = async (e) => {
  if (Pi.includes(e))
    return console.log(`Token ${e} is blacklisted.`), null;
  try {
    return await Ku(e, nl, {
      algorithms: [rl]
    });
  } catch {
    return null;
  }
}, vn = async (e) => {
  const t = ga(e);
  if (!t)
    return null;
  const n = await vm(t);
  return n != null && n.payload.userId ? n.payload.userId : null;
}, bm = [
  j.post(`${P}/login`, async ({ request: e }) => {
    const t = await e.json(), { email: n, password: r } = t;
    if (n === zn && r === $s) {
      const i = Ps.find((a) => a.email === zn);
      if (i) {
        const o = {
          token: await il(i.id),
          user: i
        };
        return T.json(o, { status: 200 });
      }
      return T.json(
        { message: "Test user data inconsistent" },
        { status: 500 }
      );
    }
    return T.json(
      { message: "Incorrect email or password" },
      { status: 401 }
    );
  }),
  j.post(`${P}/signup`, async () => T.json(
    { message: "Registration successful" },
    { status: 201 }
  )),
  j.post(`${P}/logout`, ({ request: e }) => {
    const t = ga(e);
    return t && (sl(t), console.log(`Token blacklisted via REST logout: ${t}`)), T.json({ message: "Successful logout" }, { status: 200 });
  })
], al = tl, ol = "HS256", $i = [], cl = (e) => {
  $i.includes(e) || $i.push(e);
}, km = (e) => {
  const t = e.headers.get("Authorization");
  return t != null && t.startsWith("Bearer ") ? t.substring(7) : null;
}, ul = async (e) => new el({ userId: e }).setProtectedHeader({ alg: ol }).setIssuedAt().setExpirationTime("2h").sign(al), ya = async (e) => {
  if ($i.includes(e))
    return console.log(`Token ${e} is blacklisted.`), null;
  try {
    return await Ku(e, al, {
      algorithms: [ol]
    });
  } catch {
    return null;
  }
}, wm = [
  j.post(`${P}/login`, async ({ request: e }) => {
    const t = await e.json(), { email: n, password: r } = t;
    if (n === zn && r === $s) {
      const i = Ps.find((a) => a.email === zn);
      if (i) {
        const o = {
          token: await ul(i.id),
          user: i
        };
        return T.json(o, { status: 200 });
      }
      return T.json(
        { message: "Test user data inconsistent" },
        { status: 500 }
      );
    }
    return T.json(
      { message: "Incorrect email or password" },
      { status: 401 }
    );
  }),
  j.post(`${P}/signup`, async () => T.json(
    { message: "Registration successful" },
    { status: 201 }
  )),
  j.post(`${P}/logout`, ({ request: e }) => {
    const t = km(e);
    return t && (cl(t), console.log(`Token blacklisted via REST logout: ${t}`)), T.json({ message: "Successful logout" }, { status: 200 });
  })
], fe = async (e) => {
  const t = e.get("Authorization"), n = t == null ? void 0 : t.replace("Bearer ", "");
  if (!n)
    return {
      error: T.json(
        { message: "Missing Authorization token" },
        { status: 401 }
      )
    };
  const r = await ya(n);
  return !r || typeof r.payload.userId != "number" ? {
    error: T.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    )
  } : { userId: r.payload.userId };
}, Dr = [
  {
    id: 1,
    username: "helenahills",
    firstName: "Helena",
    secondName: "Hills",
    email: "helena.hills@social.com",
    description: "Travel and design enthusiast.",
    profileImage: "/assets/user-helena.png",
    lastLogin: "2025-10-02T12:00:00Z",
    creationDate: "2023-11-01T09:00:00Z",
    modifiedDate: "2025-10-02T12:00:00Z"
  },
  {
    id: 2,
    username: "charles",
    firstName: "Charles",
    secondName: "Davis",
    email: "charles@mail.com",
    description: "Just a good dog.",
    profileImage: "/assets/user-charles.png",
    lastLogin: "2025-10-01T15:00:00Z",
    creationDate: "2023-05-20T11:00:00Z",
    modifiedDate: "2025-10-01T15:00:00Z"
  },
  {
    id: 3,
    username: "oscardavis",
    firstName: "Oscar",
    secondName: "Davis",
    email: "oscar.davis@app.net",
    description: "Front-end developer | React Query fan.",
    profileImage: "/assets/user-oscar.png",
    lastLogin: "2025-10-03T09:30:00Z",
    creationDate: "2024-03-10T14:00:00Z",
    modifiedDate: "2025-10-03T09:30:00Z"
  },
  {
    id: 4,
    username: "danielj",
    firstName: "Daniel",
    secondName: "Park",
    email: "daniel.park@net.org",
    description: "Photography and travel blogger.",
    profileImage: "/assets/user-daniel.png",
    lastLogin: "2025-09-29T18:00:00Z",
    creationDate: "2022-12-05T08:00:00Z",
    modifiedDate: "2025-09-29T18:00:00Z"
  },
  {
    id: 5,
    firstName: "Carlo",
    secondName: "Rojas",
    username: "carlorojas",
    email: "carlo.rojas@mail.co",
    description: "Music producer and streamer.",
    profileImage: "/assets/user-carlo.png",
    lastLogin: "2025-10-03T01:00:00Z",
    creationDate: "2024-05-12T16:00:00Z",
    modifiedDate: "2025-10-03T01:00:00Z"
  },
  {
    id: 6,
    username: "nataliesmith",
    firstName: "Natalie",
    secondName: "Smith",
    email: "natalie.smith@social.com",
    description: "Lifestyle blogger and coffee lover.",
    profileImage: "/assets/user-natalie.png",
    lastLogin: "2025-10-03T11:45:00Z",
    creationDate: "2024-07-22T10:30:00Z",
    modifiedDate: "2025-10-03T11:45:00Z"
  },
  {
    id: 7,
    username: "michaelj",
    firstName: "Michael",
    secondName: "Johnson",
    email: "michael.johnson@appmail.com",
    description: "Tech geek | Gamer | Occasional photographer.",
    profileImage: "/assets/user-michael.png",
    lastLogin: "2025-10-02T22:15:00Z",
    creationDate: "2023-08-18T12:45:00Z",
    modifiedDate: "2025-10-02T22:15:00Z"
  }
], Xn = Dr, Po = async (e) => {
  const t = await fe(e.headers);
  return t.error ? t.error : t.userId;
}, Tm = [
  // PUT /api/profile
  j.put(`${P}/profile`, async ({ request: e }) => {
    const t = await Po(e);
    if (typeof t != "number")
      return T.json(t, { status: t.status });
    const n = t, r = await e.json(), s = Xn.findIndex((a) => a.id === n);
    if (s === -1)
      return T.json(
        { message: "User profile not found in mock data." },
        { status: 404 }
      );
    const i = {
      ...Xn[s],
      ...r,
      modifiedDate: (/* @__PURE__ */ new Date()).toISOString()
    };
    return Xn[s] = i, T.json(i, { status: 200 });
  }),
  // GET /api/getSuggested
  j.get(`${P}/getSuggested`, async ({ request: e }) => {
    const t = await Po(e);
    if (typeof t != "number")
      return T.json(t, { status: t.status });
    const n = t, r = Xn.filter((s) => s.id !== n).map((s) => ({
      id: s.id,
      username: s.username,
      firstName: s.firstName,
      secondName: s.secondName,
      description: s.description,
      photo: s.profileImage
    }));
    return T.json(r, { status: 200 });
  }),
  // GET /api/users/:userId/
  j.get(`${P}/users/:userId`, async ({ params: e, request: t }) => {
    const { userId: n } = e, r = Number(n), s = Xn.find((i) => i.id === r);
    return s ? T.json(s, { status: 200 }) : T.json(
      { message: "User not found data." },
      { status: 404 }
    );
  })
], Ms = [
  {
    id: 101,
    authorId: 1,
    title: "I love this flowers",
    content: "Really nice flowers in San Francisco!",
    image: "/assets/post-image-1.png",
    creationDate: "2025-08-20T10:00:00Z",
    modifiedDate: "2025-08-20T10:00:00Z"
  },
  {
    id: 102,
    authorId: 2,
    title: "Never give up!",
    content: "Body text for a post. Since it’s a social app, sometimes it’s a hot take, and sometimes it’s a question.",
    image: "",
    creationDate: "2025-09-01T15:30:00Z",
    modifiedDate: "2025-09-01T15:30:00Z"
  },
  {
    id: 103,
    authorId: 3,
    title: "This is what I understood",
    content: "A watch is more than just a timekeeping tool. It's a true style statement that highlights your individuality!",
    image: "/assets/post-image-2.png",
    creationDate: "2025-09-01T15:30:00Z",
    modifiedDate: "2025-09-01T15:30:00Z"
  },
  {
    id: 104,
    authorId: 4,
    title: "Morning thoughts",
    content: "Sometimes the best ideas come early in the morning with a cup of coffee.",
    image: "",
    creationDate: "2025-08-22T07:45:00Z",
    modifiedDate: "2025-08-22T07:45:00Z"
  },
  {
    id: 105,
    authorId: 1,
    title: "City vibes",
    content: "Walking through the city at night feels completely different.",
    image: "/assets/post-image-3.png",
    creationDate: "2025-08-24T21:10:00Z",
    modifiedDate: "2025-08-24T21:10:00Z"
  },
  {
    id: 106,
    authorId: 5,
    title: "Quick reminder",
    content: "Drink some water and take a deep breath.",
    image: "",
    creationDate: "2025-08-26T11:20:00Z",
    modifiedDate: "2025-08-26T11:20:00Z"
  },
  {
    id: 107,
    authorId: 2,
    title: "Weekend plans",
    content: "Do you prefer staying home or going out on weekends?",
    image: "",
    creationDate: "2025-08-28T16:00:00Z",
    modifiedDate: "2025-08-28T16:00:00Z"
  },
  {
    id: 108,
    authorId: 3,
    title: "Details matter",
    content: "Small details often make the biggest difference.",
    image: "/assets/post-image-4.png",
    creationDate: "2025-08-30T09:35:00Z",
    modifiedDate: "2025-08-30T09:35:00Z"
  },
  {
    id: 109,
    authorId: 6,
    title: "New beginnings",
    content: "Starting something new is scary, but also exciting.",
    image: "",
    creationDate: "2025-09-01T08:00:00Z",
    modifiedDate: "2025-09-01T08:00:00Z"
  },
  {
    id: 110,
    authorId: 1,
    title: "Nature break",
    content: "Spending time in nature really helps to reset the mind.",
    image: "/assets/post-image-5.png",
    creationDate: "2025-09-03T14:50:00Z",
    modifiedDate: "2025-09-03T14:50:00Z"
  },
  {
    id: 111,
    authorId: 7,
    title: "Late night coding",
    content: "Debugging at 2 AM hits differently.",
    image: "",
    creationDate: "2025-09-05T02:15:00Z",
    modifiedDate: "2025-09-05T02:15:00Z"
  },
  {
    id: 112,
    authorId: 4,
    title: "Music on repeat",
    content: "Found a song today that I can’t stop listening to.",
    image: "",
    creationDate: "2025-09-06T18:40:00Z",
    modifiedDate: "2025-09-06T18:40:00Z"
  },
  {
    id: 113,
    authorId: 2,
    title: "Simple happiness",
    content: "Good food, good mood.",
    image: "/assets/post-image-6.png",
    creationDate: "2025-09-08T12:10:00Z",
    modifiedDate: "2025-09-08T12:10:00Z"
  },
  {
    id: 114,
    authorId: 5,
    title: "Learning every day",
    content: "Even small progress is still progress.",
    image: "",
    creationDate: "2025-09-10T10:30:00Z",
    modifiedDate: "2025-09-10T10:30:00Z"
  },
  {
    id: 115,
    authorId: 6,
    title: "Travel thoughts",
    content: "Already thinking about the next trip.",
    image: "/assets/post-image-7.png",
    creationDate: "2025-09-12T19:00:00Z",
    modifiedDate: "2025-09-12T19:00:00Z"
  },
  {
    id: 116,
    authorId: 3,
    title: "Perspective",
    content: "Sometimes you just need to look at things from a different angle.",
    image: "",
    creationDate: "2025-09-14T09:00:00Z",
    modifiedDate: "2025-09-14T09:00:00Z"
  },
  {
    id: 117,
    authorId: 7,
    title: "Focus mode",
    content: "Turning off notifications helps more than you think.",
    image: "",
    creationDate: "2025-09-16T13:25:00Z",
    modifiedDate: "2025-09-16T13:25:00Z"
  },
  {
    id: 118,
    authorId: 1,
    title: "Golden hour",
    content: "The light during sunset is unbeatable.",
    image: "/assets/post-image-8.png",
    creationDate: "2025-09-18T17:55:00Z",
    modifiedDate: "2025-09-18T17:55:00Z"
  },
  {
    id: 119,
    authorId: 4,
    title: "Thought of the day",
    content: "Be patient with yourself.",
    image: "",
    creationDate: "2025-09-20T08:40:00Z",
    modifiedDate: "2025-09-20T08:40:00Z"
  },
  {
    id: 120,
    authorId: 5,
    title: "Coffee break",
    content: "This coffee tastes especially good today.",
    image: "",
    creationDate: "2025-09-22T11:00:00Z",
    modifiedDate: "2025-09-22T11:00:00Z"
  },
  {
    id: 121,
    authorId: 2,
    title: "Motivation check",
    content: "What keeps you motivated when things get hard?",
    image: "",
    creationDate: "2025-09-24T15:45:00Z",
    modifiedDate: "2025-09-24T15:45:00Z"
  },
  {
    id: 122,
    authorId: 6,
    title: "Calm moments",
    content: "Silence can be very powerful.",
    image: "/assets/post-image-9.png",
    creationDate: "2025-09-26T06:30:00Z",
    modifiedDate: "2025-09-26T06:30:00Z"
  },
  {
    id: 123,
    authorId: 7,
    title: "Tiny wins",
    content: "Celebrating small victories today.",
    image: "",
    creationDate: "2025-09-28T20:10:00Z",
    modifiedDate: "2025-09-28T20:10:00Z"
  },
  {
    id: 124,
    authorId: 3,
    title: "Style talk",
    content: "Your style says more than words sometimes.",
    image: "/assets/post-image-10.png",
    creationDate: "2025-09-30T14:00:00Z",
    modifiedDate: "2025-09-30T14:00:00Z"
  },
  {
    id: 125,
    authorId: 1,
    title: "October mood",
    content: "Fall vibes are finally here.",
    image: "",
    creationDate: "2025-10-02T09:20:00Z",
    modifiedDate: "2025-10-02T09:20:00Z"
  },
  {
    id: 126,
    authorId: 4,
    title: "Rainy day",
    content: "Rainy days make me want to slow down.",
    image: "",
    creationDate: "2025-10-04T16:30:00Z",
    modifiedDate: "2025-10-04T16:30:00Z"
  },
  {
    id: 127,
    authorId: 5,
    title: "Consistency",
    content: "Showing up every day matters.",
    image: "",
    creationDate: "2025-10-06T07:50:00Z",
    modifiedDate: "2025-10-06T07:50:00Z"
  },
  {
    id: 128,
    authorId: 2,
    title: "Quick question",
    content: "Do you prefer mornings or evenings?",
    image: "",
    creationDate: "2025-10-08T18:10:00Z",
    modifiedDate: "2025-10-08T18:10:00Z"
  },
  {
    id: 129,
    authorId: 6,
    title: "Almost weekend",
    content: "Counting hours till the weekend starts.",
    image: "",
    creationDate: "2025-10-10T13:00:00Z",
    modifiedDate: "2025-10-10T13:00:00Z"
  },
  {
    id: 130,
    authorId: 7,
    title: "Reflection",
    content: "Looking back at how much has changed lately.",
    image: "",
    creationDate: "2025-10-12T21:40:00Z",
    modifiedDate: "2025-10-12T21:40:00Z"
  },
  {
    id: 131,
    authorId: 3,
    title: "Minimalism",
    content: "Less clutter, more clarity.",
    image: "/assets/post-image-11.png",
    creationDate: "2025-10-14T10:15:00Z",
    modifiedDate: "2025-10-14T10:15:00Z"
  },
  {
    id: 132,
    authorId: 1,
    title: "End of day",
    content: "Grateful for today.",
    image: "",
    creationDate: "2025-10-16T22:00:00Z",
    modifiedDate: "2025-10-16T22:00:00Z"
  },
  {
    id: 133,
    authorId: 5,
    title: "Keep going",
    content: "One step at a time.",
    image: "",
    creationDate: "2025-10-18T08:30:00Z",
    modifiedDate: "2025-10-18T08:30:00Z"
  }
], Fs = [
  {
    id: 1,
    postId: 101,
    authorId: 2,
    text: "Great job!",
    creationDate: "2025-08-20T11:00:00Z",
    modifiedDate: "2025-08-20T11:00:00Z"
  },
  {
    id: 2,
    postId: 101,
    authorId: 3,
    text: "Beautiful flowers, Helena!",
    creationDate: "2025-08-20T12:30:00Z",
    modifiedDate: "2025-08-20T12:30:00Z"
  },
  {
    id: 3,
    postId: 102,
    authorId: 1,
    text: "Nice motivation, Charles!",
    creationDate: "2025-09-01T16:00:00Z",
    modifiedDate: "2025-09-01T16:00:00Z"
  },
  {
    id: 4,
    postId: 102,
    authorId: 5,
    text: "Keep going, really inspiring!",
    creationDate: "2025-09-01T16:30:00Z",
    modifiedDate: "2025-09-01T16:30:00Z"
  },
  {
    id: 5,
    postId: 103,
    authorId: 1,
    text: "Totally agree, Oscar. Style matters!",
    creationDate: "2025-09-01T16:45:00Z",
    modifiedDate: "2025-09-01T16:45:00Z"
  },
  {
    id: 6,
    postId: 103,
    authorId: 2,
    text: "Nice insight on watches.",
    creationDate: "2025-09-01T17:00:00Z",
    modifiedDate: "2025-09-01T17:00:00Z"
  },
  {
    id: 7,
    postId: 104,
    authorId: 1,
    text: "Love your morning thoughts!",
    creationDate: "2025-08-22T08:30:00Z",
    modifiedDate: "2025-08-22T08:30:00Z"
  },
  {
    id: 8,
    postId: 104,
    authorId: 5,
    text: "Agreed! Early mornings are productive.",
    creationDate: "2025-08-22T09:15:00Z",
    modifiedDate: "2025-08-22T09:15:00Z"
  },
  {
    id: 9,
    postId: 105,
    authorId: 6,
    text: "Night city walks are the best!",
    creationDate: "2025-08-24T22:00:00Z",
    modifiedDate: "2025-08-24T22:00:00Z"
  },
  {
    id: 10,
    postId: 106,
    authorId: 2,
    text: "Thanks for the reminder!",
    creationDate: "2025-08-26T12:00:00Z",
    modifiedDate: "2025-08-26T12:00:00Z"
  },
  {
    id: 11,
    postId: 107,
    authorId: 3,
    text: "I usually go out, but staying in is nice too.",
    creationDate: "2025-08-28T16:30:00Z",
    modifiedDate: "2025-08-28T16:30:00Z"
  },
  {
    id: 12,
    postId: 107,
    authorId: 4,
    text: "Depends on the mood, both are great!",
    creationDate: "2025-08-28T17:10:00Z",
    modifiedDate: "2025-08-28T17:10:00Z"
  },
  {
    id: 13,
    postId: 108,
    authorId: 1,
    text: "Absolutely, details make all the difference.",
    creationDate: "2025-08-30T10:30:00Z",
    modifiedDate: "2025-08-30T10:30:00Z"
  },
  {
    id: 14,
    postId: 109,
    authorId: 7,
    text: "New beginnings are exciting indeed!",
    creationDate: "2025-09-01T08:40:00Z",
    modifiedDate: "2025-09-01T08:40:00Z"
  },
  {
    id: 15,
    postId: 110,
    authorId: 6,
    text: "Nature really helps to reset your mind.",
    creationDate: "2025-09-03T15:20:00Z",
    modifiedDate: "2025-09-03T15:20:00Z"
  },
  {
    id: 16,
    postId: 111,
    authorId: 5,
    text: "Late night debugging is a struggle!",
    creationDate: "2025-09-05T03:00:00Z",
    modifiedDate: "2025-09-05T03:00:00Z"
  },
  {
    id: 17,
    postId: 112,
    authorId: 2,
    text: "What song is it? Would love to listen too.",
    creationDate: "2025-09-06T19:10:00Z",
    modifiedDate: "2025-09-06T19:10:00Z"
  },
  {
    id: 18,
    postId: 113,
    authorId: 6,
    text: "Simple pleasures are the best!",
    creationDate: "2025-09-08T12:40:00Z",
    modifiedDate: "2025-09-08T12:40:00Z"
  },
  {
    id: 19,
    postId: 114,
    authorId: 7,
    text: "Yes, even tiny progress counts.",
    creationDate: "2025-09-10T11:10:00Z",
    modifiedDate: "2025-09-10T11:10:00Z"
  },
  {
    id: 20,
    postId: 115,
    authorId: 3,
    text: "Where are you planning to go?",
    creationDate: "2025-09-12T19:40:00Z",
    modifiedDate: "2025-09-12T19:40:00Z"
  },
  {
    id: 21,
    postId: 116,
    authorId: 1,
    text: "Looking at things differently really helps.",
    creationDate: "2025-09-14T09:40:00Z",
    modifiedDate: "2025-09-14T09:40:00Z"
  },
  {
    id: 22,
    postId: 117,
    authorId: 4,
    text: "Turning off notifications is life-changing!",
    creationDate: "2025-09-16T14:00:00Z",
    modifiedDate: "2025-09-16T14:00:00Z"
  },
  {
    id: 23,
    postId: 118,
    authorId: 5,
    text: "Golden hour photos are the best.",
    creationDate: "2025-09-18T18:20:00Z",
    modifiedDate: "2025-09-18T18:20:00Z"
  },
  {
    id: 24,
    postId: 119,
    authorId: 2,
    text: "Patience is key, always.",
    creationDate: "2025-09-20T09:10:00Z",
    modifiedDate: "2025-09-20T09:10:00Z"
  },
  {
    id: 25,
    postId: 120,
    authorId: 3,
    text: "Coffee tastes better with friends.",
    creationDate: "2025-09-22T11:30:00Z",
    modifiedDate: "2025-09-22T11:30:00Z"
  },
  {
    id: 26,
    postId: 121,
    authorId: 6,
    text: "Motivation can be tricky sometimes, true!",
    creationDate: "2025-09-24T16:10:00Z",
    modifiedDate: "2025-09-24T16:10:00Z"
  },
  {
    id: 27,
    postId: 122,
    authorId: 7,
    text: "Silence indeed is powerful.",
    creationDate: "2025-09-26T06:55:00Z",
    modifiedDate: "2025-09-26T06:55:00Z"
  },
  {
    id: 28,
    postId: 123,
    authorId: 1,
    text: "Celebrating the small wins is important!",
    creationDate: "2025-09-28T20:40:00Z",
    modifiedDate: "2025-09-28T20:40:00Z"
  },
  {
    id: 29,
    postId: 124,
    authorId: 2,
    text: "Style really does speak louder than words.",
    creationDate: "2025-09-30T14:30:00Z",
    modifiedDate: "2025-09-30T14:30:00Z"
  },
  {
    id: 30,
    postId: 125,
    authorId: 3,
    text: "Fall vibes are amazing!",
    creationDate: "2025-10-02T09:55:00Z",
    modifiedDate: "2025-10-02T09:55:00Z"
  },
  {
    id: 31,
    postId: 126,
    authorId: 4,
    text: "Rainy days make me want to read a book.",
    creationDate: "2025-10-04T16:55:00Z",
    modifiedDate: "2025-10-04T16:55:00Z"
  },
  {
    id: 32,
    postId: 127,
    authorId: 5,
    text: "Consistency beats talent sometimes.",
    creationDate: "2025-10-06T08:20:00Z",
    modifiedDate: "2025-10-06T08:20:00Z"
  },
  {
    id: 33,
    postId: 128,
    authorId: 6,
    text: "Mornings are my favorite.",
    creationDate: "2025-10-08T18:20:00Z",
    modifiedDate: "2025-10-08T18:20:00Z"
  },
  {
    id: 34,
    postId: 129,
    authorId: 7,
    text: "Weekend, finally!",
    creationDate: "2025-10-10T13:10:00Z",
    modifiedDate: "2025-10-10T13:10:00Z"
  },
  {
    id: 35,
    postId: 130,
    authorId: 3,
    text: "Reflecting is important.",
    creationDate: "2025-10-12T22:00:00Z",
    modifiedDate: "2025-10-12T22:00:00Z"
  },
  {
    id: 36,
    postId: 131,
    authorId: 1,
    text: "Less clutter, more clarity.",
    creationDate: "2025-10-14T10:30:00Z",
    modifiedDate: "2025-10-14T10:30:00Z"
  },
  {
    id: 37,
    postId: 132,
    authorId: 5,
    text: "Grateful for today!",
    creationDate: "2025-10-16T22:10:00Z",
    modifiedDate: "2025-10-16T22:10:00Z"
  },
  {
    id: 38,
    postId: 133,
    authorId: 6,
    text: "One step at a time.",
    creationDate: "2025-10-18T08:40:00Z",
    modifiedDate: "2025-10-18T08:40:00Z"
  }
], Us = [
  {
    id: 1,
    userId: 2,
    postId: 101,
    creationDate: "2025-08-20T11:00:00Z"
  },
  {
    id: 2,
    userId: 3,
    postId: 101,
    creationDate: "2025-08-20T12:00:00Z"
  },
  {
    id: 3,
    userId: 6,
    postId: 101,
    creationDate: "2025-08-20T13:00:00Z"
  },
  {
    id: 4,
    userId: 1,
    postId: 102,
    creationDate: "2025-09-01T16:00:00Z"
  },
  {
    id: 5,
    userId: 4,
    postId: 102,
    creationDate: "2025-09-01T16:30:00Z"
  },
  {
    id: 6,
    userId: 5,
    postId: 102,
    creationDate: "2025-09-01T16:50:00Z"
  },
  {
    id: 7,
    userId: 7,
    postId: 102,
    creationDate: "2025-09-01T17:10:00Z"
  },
  {
    id: 8,
    userId: 1,
    postId: 103,
    creationDate: "2025-09-01T17:00:00Z"
  },
  {
    id: 9,
    userId: 2,
    postId: 103,
    creationDate: "2025-09-01T17:15:00Z"
  },
  {
    id: 10,
    userId: 5,
    postId: 103,
    creationDate: "2025-09-01T17:40:00Z"
  },
  {
    id: 11,
    userId: 1,
    postId: 104,
    creationDate: "2025-08-22T08:30:00Z"
  },
  {
    id: 12,
    userId: 5,
    postId: 104,
    creationDate: "2025-08-22T09:00:00Z"
  },
  {
    id: 13,
    userId: 2,
    postId: 105,
    creationDate: "2025-08-24T22:15:00Z"
  },
  {
    id: 14,
    userId: 6,
    postId: 105,
    creationDate: "2025-08-24T22:30:00Z"
  },
  {
    id: 15,
    userId: 7,
    postId: 105,
    creationDate: "2025-08-24T22:50:00Z"
  },
  {
    id: 16,
    userId: 3,
    postId: 106,
    creationDate: "2025-08-26T12:00:00Z"
  },
  {
    id: 17,
    userId: 4,
    postId: 106,
    creationDate: "2025-08-26T12:15:00Z"
  },
  {
    id: 18,
    userId: 1,
    postId: 107,
    creationDate: "2025-08-28T16:30:00Z"
  },
  {
    id: 19,
    userId: 2,
    postId: 107,
    creationDate: "2025-08-28T16:45:00Z"
  },
  {
    id: 20,
    userId: 6,
    postId: 107,
    creationDate: "2025-08-28T17:00:00Z"
  },
  {
    id: 21,
    userId: 7,
    postId: 107,
    creationDate: "2025-08-28T17:20:00Z"
  },
  {
    id: 24,
    userId: 1,
    postId: 108,
    creationDate: "2025-08-30T10:30:00Z"
  },
  {
    id: 25,
    userId: 3,
    postId: 108,
    creationDate: "2025-08-30T10:50:00Z"
  },
  {
    id: 26,
    userId: 5,
    postId: 108,
    creationDate: "2025-08-30T11:10:00Z"
  },
  {
    id: 27,
    userId: 2,
    postId: 109,
    creationDate: "2025-09-01T09:00:00Z"
  },
  {
    id: 28,
    userId: 4,
    postId: 109,
    creationDate: "2025-09-01T09:20:00Z"
  },
  {
    id: 29,
    userId: 1,
    postId: 110,
    creationDate: "2025-09-03T15:30:00Z"
  },
  {
    id: 30,
    userId: 6,
    postId: 110,
    creationDate: "2025-09-03T15:45:00Z"
  },
  {
    id: 31,
    userId: 7,
    postId: 110,
    creationDate: "2025-09-03T16:00:00Z"
  },
  {
    id: 32,
    userId: 3,
    postId: 111,
    creationDate: "2025-09-05T03:15:00Z"
  },
  {
    id: 33,
    userId: 5,
    postId: 111,
    creationDate: "2025-09-05T03:40:00Z"
  },
  {
    id: 34,
    userId: 7,
    postId: 111,
    creationDate: "2025-09-05T04:00:00Z"
  },
  {
    id: 35,
    userId: 2,
    postId: 112,
    creationDate: "2025-09-06T19:20:00Z"
  },
  {
    id: 36,
    userId: 4,
    postId: 112,
    creationDate: "2025-09-06T19:35:00Z"
  },
  {
    id: 37,
    userId: 6,
    postId: 112,
    creationDate: "2025-09-06T19:50:00Z"
  },
  {
    id: 38,
    userId: 1,
    postId: 112,
    creationDate: "2025-09-06T20:10:00Z"
  },
  {
    id: 39,
    userId: 1,
    postId: 113,
    creationDate: "2025-09-08T12:50:00Z"
  },
  {
    id: 40,
    userId: 7,
    postId: 113,
    creationDate: "2025-09-08T13:10:00Z"
  },
  {
    id: 41,
    userId: 3,
    postId: 113,
    creationDate: "2025-09-08T13:30:00Z"
  },
  {
    id: 42,
    userId: 3,
    postId: 114,
    creationDate: "2025-09-10T11:15:00Z"
  },
  {
    id: 43,
    userId: 4,
    postId: 114,
    creationDate: "2025-09-10T11:40:00Z"
  },
  {
    id: 44,
    userId: 6,
    postId: 114,
    creationDate: "2025-09-10T12:00:00Z"
  },
  {
    id: 45,
    userId: 1,
    postId: 115,
    creationDate: "2025-09-12T19:50:00Z"
  },
  {
    id: 46,
    userId: 2,
    postId: 115,
    creationDate: "2025-09-12T20:10:00Z"
  },
  {
    id: 47,
    userId: 6,
    postId: 115,
    creationDate: "2025-09-12T20:30:00Z"
  },
  {
    id: 48,
    userId: 7,
    postId: 115,
    creationDate: "2025-09-12T20:50:00Z"
  },
  {
    id: 45,
    userId: 1,
    postId: 116,
    creationDate: "2025-09-12T19:50:00Z"
  },
  {
    id: 46,
    userId: 2,
    postId: 116,
    creationDate: "2025-09-12T20:10:00Z"
  },
  {
    id: 47,
    userId: 6,
    postId: 116,
    creationDate: "2025-09-12T20:30:00Z"
  },
  {
    id: 48,
    userId: 7,
    postId: 116,
    creationDate: "2025-09-12T20:50:00Z"
  },
  {
    id: 49,
    userId: 2,
    postId: 117,
    creationDate: "2025-09-16T14:10:00Z"
  },
  {
    id: 50,
    userId: 4,
    postId: 117,
    creationDate: "2025-09-16T14:30:00Z"
  },
  {
    id: 51,
    userId: 6,
    postId: 117,
    creationDate: "2025-09-16T14:50:00Z"
  },
  {
    id: 52,
    userId: 1,
    postId: 118,
    creationDate: "2025-09-18T18:30:00Z"
  },
  {
    id: 53,
    userId: 3,
    postId: 118,
    creationDate: "2025-09-18T18:50:00Z"
  },
  {
    id: 54,
    userId: 5,
    postId: 118,
    creationDate: "2025-09-18T19:10:00Z"
  },
  {
    id: 55,
    userId: 2,
    postId: 119,
    creationDate: "2025-09-20T09:20:00Z"
  },
  {
    id: 56,
    userId: 6,
    postId: 119,
    creationDate: "2025-09-20T09:40:00Z"
  },
  {
    id: 57,
    userId: 3,
    postId: 120,
    creationDate: "2025-09-22T11:40:00Z"
  },
  {
    id: 58,
    userId: 4,
    postId: 120,
    creationDate: "2025-09-22T12:00:00Z"
  },
  {
    id: 59,
    userId: 7,
    postId: 120,
    creationDate: "2025-09-22T12:20:00Z"
  },
  {
    id: 60,
    userId: 1,
    postId: 121,
    creationDate: "2025-09-24T16:20:00Z"
  },
  {
    id: 61,
    userId: 5,
    postId: 121,
    creationDate: "2025-09-24T16:40:00Z"
  },
  {
    id: 62,
    userId: 6,
    postId: 121,
    creationDate: "2025-09-24T17:00:00Z"
  },
  {
    id: 63,
    userId: 2,
    postId: 122,
    creationDate: "2025-09-26T07:00:00Z"
  },
  {
    id: 64,
    userId: 3,
    postId: 122,
    creationDate: "2025-09-26T07:20:00Z"
  },
  {
    id: 65,
    userId: 7,
    postId: 122,
    creationDate: "2025-09-26T07:40:00Z"
  },
  {
    id: 66,
    userId: 1,
    postId: 123,
    creationDate: "2025-09-28T20:50:00Z"
  },
  {
    id: 67,
    userId: 4,
    postId: 123,
    creationDate: "2025-09-28T21:10:00Z"
  },
  {
    id: 68,
    userId: 3,
    postId: 124,
    creationDate: "2025-09-30T14:40:00Z"
  },
  {
    id: 69,
    userId: 5,
    postId: 124,
    creationDate: "2025-09-30T15:00:00Z"
  },
  {
    id: 70,
    userId: 1,
    postId: 125,
    creationDate: "2025-10-02T10:05:00Z"
  },
  {
    id: 71,
    userId: 2,
    postId: 125,
    creationDate: "2025-10-02T10:25:00Z"
  },
  {
    id: 72,
    userId: 6,
    postId: 125,
    creationDate: "2025-10-02T10:45:00Z"
  },
  {
    id: 75,
    userId: 1,
    postId: 126,
    creationDate: "2025-10-04T17:00:00Z"
  },
  {
    id: 76,
    userId: 2,
    postId: 126,
    creationDate: "2025-10-04T17:20:00Z"
  },
  {
    id: 77,
    userId: 4,
    postId: 126,
    creationDate: "2025-10-04T17:40:00Z"
  },
  {
    id: 78,
    userId: 3,
    postId: 127,
    creationDate: "2025-10-06T08:30:00Z"
  },
  {
    id: 79,
    userId: 5,
    postId: 127,
    creationDate: "2025-10-06T08:50:00Z"
  },
  {
    id: 80,
    userId: 6,
    postId: 127,
    creationDate: "2025-10-06T09:10:00Z"
  },
  {
    id: 81,
    userId: 7,
    postId: 127,
    creationDate: "2025-10-06T09:30:00Z"
  },
  {
    id: 82,
    userId: 1,
    postId: 128,
    creationDate: "2025-10-08T18:40:00Z"
  },
  {
    id: 83,
    userId: 3,
    postId: 128,
    creationDate: "2025-10-08T19:00:00Z"
  },
  {
    id: 84,
    userId: 4,
    postId: 128,
    creationDate: "2025-10-08T19:20:00Z"
  },
  {
    id: 85,
    userId: 1,
    postId: 129,
    creationDate: "2025-10-10T13:20:00Z"
  },
  {
    id: 86,
    userId: 2,
    postId: 129,
    creationDate: "2025-10-10T13:40:00Z"
  },
  {
    id: 87,
    userId: 6,
    postId: 129,
    creationDate: "2025-10-10T14:00:00Z"
  },
  {
    id: 88,
    userId: 7,
    postId: 129,
    creationDate: "2025-10-10T14:20:00Z"
  },
  {
    id: 89,
    userId: 2,
    postId: 130,
    creationDate: "2025-10-12T22:10:00Z"
  },
  {
    id: 90,
    userId: 3,
    postId: 130,
    creationDate: "2025-10-12T22:30:00Z"
  },
  {
    id: 91,
    userId: 5,
    postId: 130,
    creationDate: "2025-10-12T22:50:00Z"
  },
  {
    id: 92,
    userId: 1,
    postId: 131,
    creationDate: "2025-10-14T10:40:00Z"
  },
  {
    id: 93,
    userId: 4,
    postId: 131,
    creationDate: "2025-10-14T11:00:00Z"
  },
  {
    id: 94,
    userId: 6,
    postId: 131,
    creationDate: "2025-10-14T11:20:00Z"
  },
  {
    id: 95,
    userId: 2,
    postId: 132,
    creationDate: "2025-10-16T22:20:00Z"
  },
  {
    id: 96,
    userId: 3,
    postId: 132,
    creationDate: "2025-10-16T22:40:00Z"
  },
  {
    id: 97,
    userId: 5,
    postId: 132,
    creationDate: "2025-10-16T23:00:00Z"
  },
  {
    id: 98,
    userId: 1,
    postId: 133,
    creationDate: "2025-10-18T08:50:00Z"
  },
  {
    id: 99,
    userId: 4,
    postId: 133,
    creationDate: "2025-10-18T09:10:00Z"
  },
  {
    id: 100,
    userId: 6,
    postId: 133,
    creationDate: "2025-10-18T09:30:00Z"
  },
  {
    id: 101,
    userId: 7,
    postId: 133,
    creationDate: "2025-10-18T09:50:00Z"
  }
], Ce = Ms, qe = Fs, hi = Dr, Rt = Us, gt = async (e) => {
  const t = await fe(e.headers);
  return t.error ? t.error : t.userId;
}, Em = [
  // GET /api/posts
  j.get(`${P}/posts`, () => {
    var n;
    const e = ((n = hi.find((r) => r.id === 1)) == null ? void 0 : n.profileImage) || "/assets/default-user.png", t = Ce.map((r) => {
      const s = Rt.filter((c) => c.postId === r.id).map((c) => c.userId), i = hi.filter(
        (c) => s.includes(c.id)
      ), a = i.length, o = qe.filter(
        (c) => c.postId === r.id
      ).length;
      return {
        ...r,
        likesCount: a,
        likedByUsers: i,
        commentsCount: o,
        authorPhoto: e
      };
    });
    return T.json(t);
  }),
  // POST /api/upload-image
  j.post(`${P}/upload-image`, async () => T.json(
    {
      url: "/assets/uploaded-image-" + Date.now() + ".jpg"
    },
    { status: 201 }
  )),
  // POST /api/posts
  j.post(`${P}/posts`, async ({ request: e }) => {
    const t = await gt(e);
    if (typeof t != "number")
      return t;
    const n = t, r = await e.json(), i = (Ce.length > 0 ? Math.max(...Ce.map((o) => o.id)) : 100) + 1, a = {
      ...r,
      id: i,
      authorId: n,
      creationDate: (/* @__PURE__ */ new Date()).toISOString(),
      modifiedDate: (/* @__PURE__ */ new Date()).toISOString(),
      likesCount: 0,
      commentsCount: 0,
      likedByUsers: []
    };
    return Ce.push(a), T.json(a, { status: 201 });
  }),
  // PUT /api/posts/:postId
  j.put(`${P}/posts/:postId`, async ({ params: e, request: t }) => {
    const n = await gt(t);
    if (typeof n != "number")
      return n;
    const r = n, { postId: s } = e, i = Number(s), a = await t.json(), o = Ce.findIndex(
      (c) => c.id === i && c.authorId === r
    );
    if (o !== -1) {
      const c = {
        ...Ce[o],
        ...a,
        modifiedDate: (/* @__PURE__ */ new Date()).toISOString()
      };
      Ce[o] = c;
      const u = Rt.filter((p) => p.postId === i).map((p) => p.userId), l = hi.filter(
        (p) => u.includes(p.id)
      ), d = {
        ...c,
        likedByUsers: l
      };
      return T.json(d, { status: 200 });
    }
    return T.json(
      { message: "Post not found or access denied" },
      { status: 404 }
    );
  }),
  // DELETE /api/posts/:postId
  j.delete(`${P}/posts/:postId`, async ({ params: e, request: t }) => {
    const n = await gt(t);
    if (typeof n != "number")
      return n;
    const r = n, { postId: s } = e, i = Number(s), a = Ce.findIndex(
      (o) => o.id === i && o.authorId === r
    );
    return a !== -1 ? (Ce.splice(a, 1), new T(null, { status: 204 })) : T.json(
      { message: "Post not found or access denied" },
      { status: 404 }
    );
  }),
  // POST /api/like
  j.post(`${P}/like`, async ({ request: e }) => {
    const t = await gt(e);
    if (typeof t != "number")
      return t;
    const n = t, r = await e.json(), { postId: s } = r, i = Ce.find((u) => u.id === s);
    if (!i)
      return T.json({ message: "Post not found" }, { status: 404 });
    if (Rt.find(
      (u) => u.userId === n && u.postId === s
    ))
      return T.json(
        { status: "already_liked", postId: s, newLikesCount: i.likesCount },
        { status: 200 }
      );
    i.likesCount += 1;
    const c = {
      id: (Rt.length > 0 ? Math.max(...Rt.map((u) => u.id)) : 0) + 1,
      userId: n,
      postId: s,
      creationDate: (/* @__PURE__ */ new Date()).toISOString()
    };
    return Rt.push(c), T.json(
      { status: "liked", postId: s, newLikesCount: i.likesCount },
      { status: 200 }
    );
  }),
  // POST /api/dislike
  j.post(`${P}/dislike`, async ({ request: e }) => {
    const t = await gt(e);
    if (typeof t != "number")
      return t;
    const n = t, r = await e.json(), { postId: s } = r, i = Ce.find((o) => o.id === s);
    if (!i)
      return T.json({ message: "Post not found" }, { status: 404 });
    const a = Rt.findIndex(
      (o) => o.userId === n && o.postId === s
    );
    return a !== -1 ? (i.likesCount > 0 && (i.likesCount -= 1), Rt.splice(a, 1), T.json(
      { status: "disliked", postId: s, newLikesCount: i.likesCount },
      { status: 200 }
    )) : T.json(
      { status: "not_liked", postId: s, newLikesCount: i.likesCount },
      { status: 200 }
    );
  }),
  // GET /api/comments
  j.get(`${P}/comments`, () => T.json(qe)),
  // GET /api/posts/:postId/comments
  j.get(
    `${P}/posts/:postId/comments`,
    async ({ params: e, request: t }) => {
      const n = await gt(t);
      if (typeof n != "number")
        return n;
      const { postId: r } = e, s = Number(r), i = qe.filter((a) => a.postId === s);
      return T.json(i, { status: 200 });
    }
  ),
  // POST /api/comments
  j.post(`${P}/comments`, async ({ request: e }) => {
    const t = await gt(e);
    if (typeof t != "number")
      return t;
    const n = t, r = await e.json(), { postId: s, text: i } = r, c = {
      id: (qe.length > 0 ? Math.max(...qe.map((l) => l.id)) : 0) + 1,
      postId: s,
      text: i,
      authorId: n,
      creationDate: (/* @__PURE__ */ new Date()).toISOString(),
      modifiedDate: (/* @__PURE__ */ new Date()).toISOString()
    }, u = Ce.find((l) => l.id === s);
    return u && (u.commentsCount += 1), qe.push(c), T.json(c, { status: 201 });
  }),
  // PUT /api/comments/:commentId
  j.put(
    `${P}/comments/:commentId`,
    async ({ params: e, request: t }) => {
      const n = await gt(t);
      if (typeof n != "number")
        return n;
      const r = n, { commentId: s } = e, i = Number(s), { text: a } = await t.json(), o = qe.findIndex(
        (c) => c.id === i && c.authorId === r
      );
      if (o !== -1) {
        const c = {
          ...qe[o],
          text: a,
          modifiedDate: (/* @__PURE__ */ new Date()).toISOString()
        };
        return qe[o] = c, T.json(c, { status: 200 });
      }
      return T.json(
        { message: "Comment not found or access denied" },
        { status: 404 }
      );
    }
  ),
  // DELETE /api/comments/:commentId
  j.delete(
    `${P}/comments/:commentId`,
    async ({ params: e, request: t }) => {
      const n = await gt(t);
      if (typeof n != "number")
        return n;
      const r = n, { commentId: s } = e, i = Number(s), a = qe.findIndex(
        (o) => o.id === i && o.authorId === r
      );
      if (a !== -1) {
        const o = qe[a].postId;
        qe.splice(a, 1);
        const c = Ce.find((u) => u.id === o);
        return c && c.commentsCount > 0 && (c.commentsCount -= 1), new T(null, { status: 204 });
      }
      return T.json(
        { message: "Comment not found or access denied" },
        { status: 404 }
      );
    }
  )
], ll = [
  {
    id: 1,
    title: "Design Enthusiasts",
    photo: "/assets/group-1.jpg",
    membersCount: 13200
  },
  {
    id: 2,
    title: "Photographers of SF",
    photo: "/assets/group-2.jpg",
    membersCount: 2e3
  },
  {
    id: 3,
    title: "Marina crews",
    photo: "/assets/group-3.jpg",
    membersCount: 125
  }
], at = ll, Kn = async (e) => {
  const t = await fe(e.headers);
  return t.error ? t.error : t.userId;
}, Im = [
  // GET /api/groups
  j.get(`${P}/groups`, async ({ request: e }) => {
    const t = await Kn(e);
    return typeof t != "number" ? t : T.json(at, { status: 200 });
  }),
  // GET /api/groups/:groupId
  j.get(`${P}/groups/:groupId`, async ({ params: e, request: t }) => {
    const n = await Kn(t);
    if (typeof n != "number")
      return n;
    const { groupId: r } = e, s = Number(r), i = at.find((a) => a.id === s);
    return i ? T.json(i, { status: 200 }) : T.json({ message: "Group not found" }, { status: 404 });
  }),
  // POST /api/groups
  j.post(`${P}/groups`, async ({ request: e }) => {
    const t = await Kn(e);
    if (typeof t != "number")
      return t;
    const n = await e.json(), s = (at.length > 0 ? Math.max(...at.map((a) => a.id)) : 0) + 1, i = {
      ...n,
      id: s,
      membersCount: 1
    };
    return at.push(i), T.json(i, { status: 201 });
  }),
  // PUT /api/groups/:groupId
  j.put(`${P}/groups/:groupId`, async ({ params: e, request: t }) => {
    const n = await Kn(t);
    if (typeof n != "number")
      return n;
    const { groupId: r } = e, s = Number(r), i = await t.json(), a = at.findIndex((o) => o.id === s);
    if (a !== -1) {
      const o = {
        ...at[a],
        ...i
      };
      return at[a] = o, T.json(o, { status: 200 });
    }
    return T.json({ message: "Group not found" }, { status: 404 });
  }),
  // DELETE /api/groups/:groupId
  j.delete(
    `${P}/groups/:groupId`,
    async ({ params: e, request: t }) => {
      const n = await Kn(t);
      if (typeof n != "number")
        return n;
      const { groupId: r } = e, s = Number(r), i = at.findIndex((a) => a.id === s);
      return i !== -1 ? (at.splice(i, 1), new T(null, { status: 204 })) : T.json({ message: "Group not found" }, { status: 404 });
    }
  )
];
function z(e, t) {
  if (!!!e)
    throw new Error(t);
}
function He(e) {
  return typeof (e == null ? void 0 : e.then) == "function";
}
function tt(e) {
  return typeof e == "object" && e !== null;
}
function Pe(e, t) {
  if (!!!e)
    throw new Error(
      t ?? "Unexpected invariant triggered."
    );
}
const xm = /\r\n|[\n\r]/g;
function Mi(e, t) {
  let n = 0, r = 1;
  for (const s of e.body.matchAll(xm)) {
    if (typeof s.index == "number" || Pe(!1), s.index >= t)
      break;
    n = s.index + s[0].length, r += 1;
  }
  return {
    line: r,
    column: t + 1 - n
  };
}
function Sm(e) {
  return dl(
    e.source,
    Mi(e.source, e.start)
  );
}
function dl(e, t) {
  const n = e.locationOffset.column - 1, r = "".padStart(n) + e.body, s = t.line - 1, i = e.locationOffset.line - 1, a = t.line + i, o = t.line === 1 ? n : 0, c = t.column + o, u = `${e.name}:${a}:${c}
`, l = r.split(/\r\n|[\n\r]/g), d = l[s];
  if (d.length > 120) {
    const p = Math.floor(c / 80), h = c % 80, m = [];
    for (let g = 0; g < d.length; g += 80)
      m.push(d.slice(g, g + 80));
    return u + $o([
      [`${a} |`, m[0]],
      ...m.slice(1, p + 1).map((g) => ["|", g]),
      ["|", "^".padStart(h)],
      ["|", m[p + 1]]
    ]);
  }
  return u + $o([
    // Lines specified like this: ["prefix", "string"],
    [`${a - 1} |`, l[s - 1]],
    [`${a} |`, d],
    ["|", "^".padStart(c)],
    [`${a + 1} |`, l[s + 1]]
  ]);
}
function $o(e) {
  const t = e.filter(([r, s]) => s !== void 0), n = Math.max(...t.map(([r]) => r.length));
  return t.map(([r, s]) => r.padStart(n) + (s ? " " + s : "")).join(`
`);
}
function Nm(e) {
  const t = e[0];
  return t == null || "kind" in t || "length" in t ? {
    nodes: t,
    source: e[1],
    positions: e[2],
    path: e[3],
    originalError: e[4],
    extensions: e[5]
  } : t;
}
class v extends Error {
  /**
   * An array of `{ line, column }` locations within the source GraphQL document
   * which correspond to this error.
   *
   * Errors during validation often contain multiple locations, for example to
   * point out two things with the same name. Errors during execution include a
   * single location, the field which produced the error.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  /**
   * An array describing the JSON-path into the execution response which
   * corresponds to this error. Only included for errors during execution.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  /**
   * An array of GraphQL AST Nodes corresponding to this error.
   */
  /**
   * The source GraphQL document for the first location of this error.
   *
   * Note that if this Error represents more than one node, the source may not
   * represent nodes after the first node.
   */
  /**
   * An array of character offsets within the source GraphQL document
   * which correspond to this error.
   */
  /**
   * The original error thrown from a field resolver during execution.
   */
  /**
   * Extension fields to add to the formatted error.
   */
  /**
   * @deprecated Please use the `GraphQLErrorOptions` constructor overload instead.
   */
  constructor(t, ...n) {
    var r, s, i;
    const { nodes: a, source: o, positions: c, path: u, originalError: l, extensions: d } = Nm(n);
    super(t), this.name = "GraphQLError", this.path = u ?? void 0, this.originalError = l ?? void 0, this.nodes = Mo(
      Array.isArray(a) ? a : a ? [a] : void 0
    );
    const p = Mo(
      (r = this.nodes) === null || r === void 0 ? void 0 : r.map((m) => m.loc).filter((m) => m != null)
    );
    this.source = o ?? (p == null || (s = p[0]) === null || s === void 0 ? void 0 : s.source), this.positions = c ?? (p == null ? void 0 : p.map((m) => m.start)), this.locations = c && o ? c.map((m) => Mi(o, m)) : p == null ? void 0 : p.map((m) => Mi(m.source, m.start));
    const h = tt(
      l == null ? void 0 : l.extensions
    ) ? l == null ? void 0 : l.extensions : void 0;
    this.extensions = (i = d ?? h) !== null && i !== void 0 ? i : /* @__PURE__ */ Object.create(null), Object.defineProperties(this, {
      message: {
        writable: !0,
        enumerable: !0
      },
      name: {
        enumerable: !1
      },
      nodes: {
        enumerable: !1
      },
      source: {
        enumerable: !1
      },
      positions: {
        enumerable: !1
      },
      originalError: {
        enumerable: !1
      }
    }), l != null && l.stack ? Object.defineProperty(this, "stack", {
      value: l.stack,
      writable: !0,
      configurable: !0
    }) : Error.captureStackTrace ? Error.captureStackTrace(this, v) : Object.defineProperty(this, "stack", {
      value: Error().stack,
      writable: !0,
      configurable: !0
    });
  }
  get [Symbol.toStringTag]() {
    return "GraphQLError";
  }
  toString() {
    let t = this.message;
    if (this.nodes)
      for (const n of this.nodes)
        n.loc && (t += `

` + Sm(n.loc));
    else if (this.source && this.locations)
      for (const n of this.locations)
        t += `

` + dl(this.source, n);
    return t;
  }
  toJSON() {
    const t = {
      message: this.message
    };
    return this.locations != null && (t.locations = this.locations), this.path != null && (t.path = this.path), this.extensions != null && Object.keys(this.extensions).length > 0 && (t.extensions = this.extensions), t;
  }
}
function Mo(e) {
  return e === void 0 || e.length === 0 ? void 0 : e;
}
function Fk(e) {
  return e.toString();
}
function Uk(e) {
  return e.toJSON();
}
function he(e, t, n) {
  return new v(`Syntax Error: ${n}`, {
    source: e,
    positions: [t]
  });
}
class _m {
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The Token at which this Node begins.
   */
  /**
   * The Token at which this Node ends.
   */
  /**
   * The Source document the AST represents.
   */
  constructor(t, n, r) {
    this.start = t.start, this.end = n.end, this.startToken = t, this.endToken = n, this.source = r;
  }
  get [Symbol.toStringTag]() {
    return "Location";
  }
  toJSON() {
    return {
      start: this.start,
      end: this.end
    };
  }
}
class fl {
  /**
   * The kind of Token.
   */
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The 1-indexed line number on which this Token appears.
   */
  /**
   * The 1-indexed column number at which this Token begins.
   */
  /**
   * For non-punctuation tokens, represents the interpreted value of the token.
   *
   * Note: is undefined for punctuation tokens, but typed as string for
   * convenience in the parser.
   */
  /**
   * Tokens exist as nodes in a double-linked-list amongst all tokens
   * including ignored tokens. <SOF> is always the first node and <EOF>
   * the last.
   */
  constructor(t, n, r, s, i, a) {
    this.kind = t, this.start = n, this.end = r, this.line = s, this.column = i, this.value = a, this.prev = null, this.next = null;
  }
  get [Symbol.toStringTag]() {
    return "Token";
  }
  toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  }
}
const pl = {
  Name: [],
  Document: ["definitions"],
  OperationDefinition: [
    "name",
    "variableDefinitions",
    "directives",
    "selectionSet"
  ],
  VariableDefinition: ["variable", "type", "defaultValue", "directives"],
  Variable: ["name"],
  SelectionSet: ["selections"],
  Field: ["alias", "name", "arguments", "directives", "selectionSet"],
  Argument: ["name", "value"],
  FragmentSpread: ["name", "directives"],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: [
    "name",
    // Note: fragment variable definitions are deprecated and will removed in v17.0.0
    "variableDefinitions",
    "typeCondition",
    "directives",
    "selectionSet"
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
    "fields"
  ],
  FieldDefinition: ["description", "name", "arguments", "type", "directives"],
  InputValueDefinition: [
    "description",
    "name",
    "type",
    "defaultValue",
    "directives"
  ],
  InterfaceTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  UnionTypeDefinition: ["description", "name", "directives", "types"],
  EnumTypeDefinition: ["description", "name", "directives", "values"],
  EnumValueDefinition: ["description", "name", "directives"],
  InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
  DirectiveDefinition: ["description", "name", "arguments", "locations"],
  SchemaExtension: ["directives", "operationTypes"],
  ScalarTypeExtension: ["name", "directives"],
  ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
  InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
  UnionTypeExtension: ["name", "directives", "types"],
  EnumTypeExtension: ["name", "directives", "values"],
  InputObjectTypeExtension: ["name", "directives", "fields"]
}, Om = new Set(Object.keys(pl));
function Fi(e) {
  const t = e == null ? void 0 : e.kind;
  return typeof t == "string" && Om.has(t);
}
var me;
(function(e) {
  e.QUERY = "query", e.MUTATION = "mutation", e.SUBSCRIPTION = "subscription";
})(me || (me = {}));
var A;
(function(e) {
  e.QUERY = "QUERY", e.MUTATION = "MUTATION", e.SUBSCRIPTION = "SUBSCRIPTION", e.FIELD = "FIELD", e.FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION", e.FRAGMENT_SPREAD = "FRAGMENT_SPREAD", e.INLINE_FRAGMENT = "INLINE_FRAGMENT", e.VARIABLE_DEFINITION = "VARIABLE_DEFINITION", e.SCHEMA = "SCHEMA", e.SCALAR = "SCALAR", e.OBJECT = "OBJECT", e.FIELD_DEFINITION = "FIELD_DEFINITION", e.ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION", e.INTERFACE = "INTERFACE", e.UNION = "UNION", e.ENUM = "ENUM", e.ENUM_VALUE = "ENUM_VALUE", e.INPUT_OBJECT = "INPUT_OBJECT", e.INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION";
})(A || (A = {}));
var f;
(function(e) {
  e.NAME = "Name", e.DOCUMENT = "Document", e.OPERATION_DEFINITION = "OperationDefinition", e.VARIABLE_DEFINITION = "VariableDefinition", e.SELECTION_SET = "SelectionSet", e.FIELD = "Field", e.ARGUMENT = "Argument", e.FRAGMENT_SPREAD = "FragmentSpread", e.INLINE_FRAGMENT = "InlineFragment", e.FRAGMENT_DEFINITION = "FragmentDefinition", e.VARIABLE = "Variable", e.INT = "IntValue", e.FLOAT = "FloatValue", e.STRING = "StringValue", e.BOOLEAN = "BooleanValue", e.NULL = "NullValue", e.ENUM = "EnumValue", e.LIST = "ListValue", e.OBJECT = "ObjectValue", e.OBJECT_FIELD = "ObjectField", e.DIRECTIVE = "Directive", e.NAMED_TYPE = "NamedType", e.LIST_TYPE = "ListType", e.NON_NULL_TYPE = "NonNullType", e.SCHEMA_DEFINITION = "SchemaDefinition", e.OPERATION_TYPE_DEFINITION = "OperationTypeDefinition", e.SCALAR_TYPE_DEFINITION = "ScalarTypeDefinition", e.OBJECT_TYPE_DEFINITION = "ObjectTypeDefinition", e.FIELD_DEFINITION = "FieldDefinition", e.INPUT_VALUE_DEFINITION = "InputValueDefinition", e.INTERFACE_TYPE_DEFINITION = "InterfaceTypeDefinition", e.UNION_TYPE_DEFINITION = "UnionTypeDefinition", e.ENUM_TYPE_DEFINITION = "EnumTypeDefinition", e.ENUM_VALUE_DEFINITION = "EnumValueDefinition", e.INPUT_OBJECT_TYPE_DEFINITION = "InputObjectTypeDefinition", e.DIRECTIVE_DEFINITION = "DirectiveDefinition", e.SCHEMA_EXTENSION = "SchemaExtension", e.SCALAR_TYPE_EXTENSION = "ScalarTypeExtension", e.OBJECT_TYPE_EXTENSION = "ObjectTypeExtension", e.INTERFACE_TYPE_EXTENSION = "InterfaceTypeExtension", e.UNION_TYPE_EXTENSION = "UnionTypeExtension", e.ENUM_TYPE_EXTENSION = "EnumTypeExtension", e.INPUT_OBJECT_TYPE_EXTENSION = "InputObjectTypeExtension";
})(f || (f = {}));
function Ui(e) {
  return e === 9 || e === 32;
}
function kr(e) {
  return e >= 48 && e <= 57;
}
function hl(e) {
  return e >= 97 && e <= 122 || // A-Z
  e >= 65 && e <= 90;
}
function va(e) {
  return hl(e) || e === 95;
}
function ml(e) {
  return hl(e) || kr(e) || e === 95;
}
function Dm(e) {
  var t;
  let n = Number.MAX_SAFE_INTEGER, r = null, s = -1;
  for (let a = 0; a < e.length; ++a) {
    var i;
    const o = e[a], c = Am(o);
    c !== o.length && (r = (i = r) !== null && i !== void 0 ? i : a, s = a, a !== 0 && c < n && (n = c));
  }
  return e.map((a, o) => o === 0 ? a : a.slice(n)).slice(
    (t = r) !== null && t !== void 0 ? t : 0,
    s + 1
  );
}
function Am(e) {
  let t = 0;
  for (; t < e.length && Ui(e.charCodeAt(t)); )
    ++t;
  return t;
}
function zk(e) {
  if (e === "")
    return !0;
  let t = !0, n = !1, r = !0, s = !1;
  for (let i = 0; i < e.length; ++i)
    switch (e.codePointAt(i)) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 11:
      case 12:
      case 14:
      case 15:
        return !1;
      case 13:
        return !1;
      case 10:
        if (t && !s)
          return !1;
        s = !0, t = !0, n = !1;
        break;
      case 9:
      case 32:
        n || (n = t);
        break;
      default:
        r && (r = n), t = !1;
    }
  return !(t || r && s);
}
function Cm(e, t) {
  const n = e.replace(/"""/g, '\\"""'), r = n.split(/\r\n|[\n\r]/g), s = r.length === 1, i = r.length > 1 && r.slice(1).every((h) => h.length === 0 || Ui(h.charCodeAt(0))), a = n.endsWith('\\"""'), o = e.endsWith('"') && !a, c = e.endsWith("\\"), u = o || c, l = !(t != null && t.minimize) && // add leading and trailing new lines only if it improves readability
  (!s || e.length > 70 || u || i || a);
  let d = "";
  const p = s && Ui(e.charCodeAt(0));
  return (l && !p || i) && (d += `
`), d += n, (l || u) && (d += `
`), '"""' + d + '"""';
}
var b;
(function(e) {
  e.SOF = "<SOF>", e.EOF = "<EOF>", e.BANG = "!", e.DOLLAR = "$", e.AMP = "&", e.PAREN_L = "(", e.PAREN_R = ")", e.SPREAD = "...", e.COLON = ":", e.EQUALS = "=", e.AT = "@", e.BRACKET_L = "[", e.BRACKET_R = "]", e.BRACE_L = "{", e.PIPE = "|", e.BRACE_R = "}", e.NAME = "Name", e.INT = "Int", e.FLOAT = "Float", e.STRING = "String", e.BLOCK_STRING = "BlockString", e.COMMENT = "Comment";
})(b || (b = {}));
class Rm {
  /**
   * The previously focused non-ignored token.
   */
  /**
   * The currently focused non-ignored token.
   */
  /**
   * The (1-indexed) line containing the current token.
   */
  /**
   * The character offset at which the current line begins.
   */
  constructor(t) {
    const n = new fl(b.SOF, 0, 0, 0, 0);
    this.source = t, this.lastToken = n, this.token = n, this.line = 1, this.lineStart = 0;
  }
  get [Symbol.toStringTag]() {
    return "Lexer";
  }
  /**
   * Advances the token stream to the next non-ignored token.
   */
  advance() {
    return this.lastToken = this.token, this.token = this.lookahead();
  }
  /**
   * Looks ahead and returns the next non-ignored token, but does not change
   * the state of Lexer.
   */
  lookahead() {
    let t = this.token;
    if (t.kind !== b.EOF)
      do
        if (t.next)
          t = t.next;
        else {
          const n = jm(this, t.end);
          t.next = n, n.prev = t, t = n;
        }
      while (t.kind === b.COMMENT);
    return t;
  }
}
function Lm(e) {
  return e === b.BANG || e === b.DOLLAR || e === b.AMP || e === b.PAREN_L || e === b.PAREN_R || e === b.SPREAD || e === b.COLON || e === b.EQUALS || e === b.AT || e === b.BRACKET_L || e === b.BRACKET_R || e === b.BRACE_L || e === b.PIPE || e === b.BRACE_R;
}
function Vn(e) {
  return e >= 0 && e <= 55295 || e >= 57344 && e <= 1114111;
}
function zs(e, t) {
  return gl(e.charCodeAt(t)) && yl(e.charCodeAt(t + 1));
}
function gl(e) {
  return e >= 55296 && e <= 56319;
}
function yl(e) {
  return e >= 56320 && e <= 57343;
}
function on(e, t) {
  const n = e.source.body.codePointAt(t);
  if (n === void 0)
    return b.EOF;
  if (n >= 32 && n <= 126) {
    const r = String.fromCodePoint(n);
    return r === '"' ? `'"'` : `"${r}"`;
  }
  return "U+" + n.toString(16).toUpperCase().padStart(4, "0");
}
function ce(e, t, n, r, s) {
  const i = e.line, a = 1 + n - e.lineStart;
  return new fl(t, n, r, i, a, s);
}
function jm(e, t) {
  const n = e.source.body, r = n.length;
  let s = t;
  for (; s < r; ) {
    const i = n.charCodeAt(s);
    switch (i) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++s;
        continue;
      case 10:
        ++s, ++e.line, e.lineStart = s;
        continue;
      case 13:
        n.charCodeAt(s + 1) === 10 ? s += 2 : ++s, ++e.line, e.lineStart = s;
        continue;
      case 35:
        return Pm(e, s);
      case 33:
        return ce(e, b.BANG, s, s + 1);
      case 36:
        return ce(e, b.DOLLAR, s, s + 1);
      case 38:
        return ce(e, b.AMP, s, s + 1);
      case 40:
        return ce(e, b.PAREN_L, s, s + 1);
      case 41:
        return ce(e, b.PAREN_R, s, s + 1);
      case 46:
        if (n.charCodeAt(s + 1) === 46 && n.charCodeAt(s + 2) === 46)
          return ce(e, b.SPREAD, s, s + 3);
        break;
      case 58:
        return ce(e, b.COLON, s, s + 1);
      case 61:
        return ce(e, b.EQUALS, s, s + 1);
      case 64:
        return ce(e, b.AT, s, s + 1);
      case 91:
        return ce(e, b.BRACKET_L, s, s + 1);
      case 93:
        return ce(e, b.BRACKET_R, s, s + 1);
      case 123:
        return ce(e, b.BRACE_L, s, s + 1);
      case 124:
        return ce(e, b.PIPE, s, s + 1);
      case 125:
        return ce(e, b.BRACE_R, s, s + 1);
      case 34:
        return n.charCodeAt(s + 1) === 34 && n.charCodeAt(s + 2) === 34 ? qm(e, s) : Mm(e, s);
    }
    if (kr(i) || i === 45)
      return $m(e, s, i);
    if (va(i))
      return Vm(e, s);
    throw he(
      e.source,
      s,
      i === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : Vn(i) || zs(n, s) ? `Unexpected character: ${on(e, s)}.` : `Invalid character: ${on(e, s)}.`
    );
  }
  return ce(e, b.EOF, r, r);
}
function Pm(e, t) {
  const n = e.source.body, r = n.length;
  let s = t + 1;
  for (; s < r; ) {
    const i = n.charCodeAt(s);
    if (i === 10 || i === 13)
      break;
    if (Vn(i))
      ++s;
    else if (zs(n, s))
      s += 2;
    else
      break;
  }
  return ce(
    e,
    b.COMMENT,
    t,
    s,
    n.slice(t + 1, s)
  );
}
function $m(e, t, n) {
  const r = e.source.body;
  let s = t, i = n, a = !1;
  if (i === 45 && (i = r.charCodeAt(++s)), i === 48) {
    if (i = r.charCodeAt(++s), kr(i))
      throw he(
        e.source,
        s,
        `Invalid number, unexpected digit after 0: ${on(
          e,
          s
        )}.`
      );
  } else
    s = mi(e, s, i), i = r.charCodeAt(s);
  if (i === 46 && (a = !0, i = r.charCodeAt(++s), s = mi(e, s, i), i = r.charCodeAt(s)), (i === 69 || i === 101) && (a = !0, i = r.charCodeAt(++s), (i === 43 || i === 45) && (i = r.charCodeAt(++s)), s = mi(e, s, i), i = r.charCodeAt(s)), i === 46 || va(i))
    throw he(
      e.source,
      s,
      `Invalid number, expected digit but got: ${on(
        e,
        s
      )}.`
    );
  return ce(
    e,
    a ? b.FLOAT : b.INT,
    t,
    s,
    r.slice(t, s)
  );
}
function mi(e, t, n) {
  if (!kr(n))
    throw he(
      e.source,
      t,
      `Invalid number, expected digit but got: ${on(
        e,
        t
      )}.`
    );
  const r = e.source.body;
  let s = t + 1;
  for (; kr(r.charCodeAt(s)); )
    ++s;
  return s;
}
function Mm(e, t) {
  const n = e.source.body, r = n.length;
  let s = t + 1, i = s, a = "";
  for (; s < r; ) {
    const o = n.charCodeAt(s);
    if (o === 34)
      return a += n.slice(i, s), ce(e, b.STRING, t, s + 1, a);
    if (o === 92) {
      a += n.slice(i, s);
      const c = n.charCodeAt(s + 1) === 117 ? n.charCodeAt(s + 2) === 123 ? Fm(e, s) : Um(e, s) : zm(e, s);
      a += c.value, s += c.size, i = s;
      continue;
    }
    if (o === 10 || o === 13)
      break;
    if (Vn(o))
      ++s;
    else if (zs(n, s))
      s += 2;
    else
      throw he(
        e.source,
        s,
        `Invalid character within String: ${on(
          e,
          s
        )}.`
      );
  }
  throw he(e.source, s, "Unterminated string.");
}
function Fm(e, t) {
  const n = e.source.body;
  let r = 0, s = 3;
  for (; s < 12; ) {
    const i = n.charCodeAt(t + s++);
    if (i === 125) {
      if (s < 5 || !Vn(r))
        break;
      return {
        value: String.fromCodePoint(r),
        size: s
      };
    }
    if (r = r << 4 | ir(i), r < 0)
      break;
  }
  throw he(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${n.slice(
      t,
      t + s
    )}".`
  );
}
function Um(e, t) {
  const n = e.source.body, r = Fo(n, t + 2);
  if (Vn(r))
    return {
      value: String.fromCodePoint(r),
      size: 6
    };
  if (gl(r) && n.charCodeAt(t + 6) === 92 && n.charCodeAt(t + 7) === 117) {
    const s = Fo(n, t + 8);
    if (yl(s))
      return {
        value: String.fromCodePoint(r, s),
        size: 12
      };
  }
  throw he(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${n.slice(t, t + 6)}".`
  );
}
function Fo(e, t) {
  return ir(e.charCodeAt(t)) << 12 | ir(e.charCodeAt(t + 1)) << 8 | ir(e.charCodeAt(t + 2)) << 4 | ir(e.charCodeAt(t + 3));
}
function ir(e) {
  return e >= 48 && e <= 57 ? e - 48 : e >= 65 && e <= 70 ? e - 55 : e >= 97 && e <= 102 ? e - 87 : -1;
}
function zm(e, t) {
  const n = e.source.body;
  switch (n.charCodeAt(t + 1)) {
    case 34:
      return {
        value: '"',
        size: 2
      };
    case 92:
      return {
        value: "\\",
        size: 2
      };
    case 47:
      return {
        value: "/",
        size: 2
      };
    case 98:
      return {
        value: "\b",
        size: 2
      };
    case 102:
      return {
        value: "\f",
        size: 2
      };
    case 110:
      return {
        value: `
`,
        size: 2
      };
    case 114:
      return {
        value: "\r",
        size: 2
      };
    case 116:
      return {
        value: "	",
        size: 2
      };
  }
  throw he(
    e.source,
    t,
    `Invalid character escape sequence: "${n.slice(
      t,
      t + 2
    )}".`
  );
}
function qm(e, t) {
  const n = e.source.body, r = n.length;
  let s = e.lineStart, i = t + 3, a = i, o = "";
  const c = [];
  for (; i < r; ) {
    const u = n.charCodeAt(i);
    if (u === 34 && n.charCodeAt(i + 1) === 34 && n.charCodeAt(i + 2) === 34) {
      o += n.slice(a, i), c.push(o);
      const l = ce(
        e,
        b.BLOCK_STRING,
        t,
        i + 3,
        // Return a string of the lines joined with U+000A.
        Dm(c).join(`
`)
      );
      return e.line += c.length - 1, e.lineStart = s, l;
    }
    if (u === 92 && n.charCodeAt(i + 1) === 34 && n.charCodeAt(i + 2) === 34 && n.charCodeAt(i + 3) === 34) {
      o += n.slice(a, i), a = i + 1, i += 4;
      continue;
    }
    if (u === 10 || u === 13) {
      o += n.slice(a, i), c.push(o), u === 13 && n.charCodeAt(i + 1) === 10 ? i += 2 : ++i, o = "", a = i, s = i;
      continue;
    }
    if (Vn(u))
      ++i;
    else if (zs(n, i))
      i += 2;
    else
      throw he(
        e.source,
        i,
        `Invalid character within String: ${on(
          e,
          i
        )}.`
      );
  }
  throw he(e.source, i, "Unterminated string.");
}
function Vm(e, t) {
  const n = e.source.body, r = n.length;
  let s = t + 1;
  for (; s < r; ) {
    const i = n.charCodeAt(s);
    if (ml(i))
      ++s;
    else
      break;
  }
  return ce(
    e,
    b.NAME,
    t,
    s,
    n.slice(t, s)
  );
}
const Bm = 10, vl = 2;
function w(e) {
  return qs(e, []);
}
function qs(e, t) {
  switch (typeof e) {
    case "string":
      return JSON.stringify(e);
    case "function":
      return e.name ? `[function ${e.name}]` : "[function]";
    case "object":
      return Hm(e, t);
    default:
      return String(e);
  }
}
function Hm(e, t) {
  if (e === null)
    return "null";
  if (t.includes(e))
    return "[Circular]";
  const n = [...t, e];
  if (Zm(e)) {
    const r = e.toJSON();
    if (r !== e)
      return typeof r == "string" ? r : qs(r, n);
  } else if (Array.isArray(e))
    return Wm(e, n);
  return Gm(e, n);
}
function Zm(e) {
  return typeof e.toJSON == "function";
}
function Gm(e, t) {
  const n = Object.entries(e);
  return n.length === 0 ? "{}" : t.length > vl ? "[" + Jm(e) + "]" : "{ " + n.map(
    ([s, i]) => s + ": " + qs(i, t)
  ).join(", ") + " }";
}
function Wm(e, t) {
  if (e.length === 0)
    return "[]";
  if (t.length > vl)
    return "[Array]";
  const n = Math.min(Bm, e.length), r = e.length - n, s = [];
  for (let i = 0; i < n; ++i)
    s.push(qs(e[i], t));
  return r === 1 ? s.push("... 1 more item") : r > 1 && s.push(`... ${r} more items`), "[" + s.join(", ") + "]";
}
function Jm(e) {
  const t = Object.prototype.toString.call(e).replace(/^\[object /, "").replace(/]$/, "");
  if (t === "Object" && typeof e.constructor == "function") {
    const n = e.constructor.name;
    if (typeof n == "string" && n !== "")
      return n;
  }
  return t;
}
const Ym = globalThis.process && // eslint-disable-next-line no-undef
process.env.NODE_ENV === "production", nt = (
  /* c8 ignore next 6 */
  // FIXME: https://github.com/graphql/graphql-js/issues/2317
  Ym ? function(t, n) {
    return t instanceof n;
  } : function(t, n) {
    if (t instanceof n)
      return !0;
    if (typeof t == "object" && t !== null) {
      var r;
      const s = n.prototype[Symbol.toStringTag], i = (
        // We still need to support constructor's name to detect conflicts with older versions of this library.
        Symbol.toStringTag in t ? t[Symbol.toStringTag] : (r = t.constructor) === null || r === void 0 ? void 0 : r.name
      );
      if (s === i) {
        const a = w(t);
        throw new Error(`Cannot use ${s} "${a}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
      }
    }
    return !1;
  }
);
class ba {
  constructor(t, n = "GraphQL request", r = {
    line: 1,
    column: 1
  }) {
    typeof t == "string" || z(!1, `Body must be a string. Received: ${w(t)}.`), this.body = t, this.name = n, this.locationOffset = r, this.locationOffset.line > 0 || z(
      !1,
      "line in locationOffset is 1-indexed and must be positive."
    ), this.locationOffset.column > 0 || z(
      !1,
      "column in locationOffset is 1-indexed and must be positive."
    );
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
}
function Qm(e) {
  return nt(e, ba);
}
function Vs(e, t) {
  const n = new Bs(e, t), r = n.parseDocument();
  return Object.defineProperty(r, "tokenCount", {
    enumerable: !1,
    value: n.tokenCount
  }), r;
}
function qk(e, t) {
  const n = new Bs(e, t);
  n.expectToken(b.SOF);
  const r = n.parseValueLiteral(!1);
  return n.expectToken(b.EOF), r;
}
function Vk(e, t) {
  const n = new Bs(e, t);
  n.expectToken(b.SOF);
  const r = n.parseConstValueLiteral();
  return n.expectToken(b.EOF), r;
}
function Bk(e, t) {
  const n = new Bs(e, t);
  n.expectToken(b.SOF);
  const r = n.parseTypeReference();
  return n.expectToken(b.EOF), r;
}
class Bs {
  constructor(t, n = {}) {
    const r = Qm(t) ? t : new ba(t);
    this._lexer = new Rm(r), this._options = n, this._tokenCounter = 0;
  }
  get tokenCount() {
    return this._tokenCounter;
  }
  /**
   * Converts a name lex token into a name parse node.
   */
  parseName() {
    const t = this.expectToken(b.NAME);
    return this.node(t, {
      kind: f.NAME,
      value: t.value
    });
  }
  // Implements the parsing rules in the Document section.
  /**
   * Document : Definition+
   */
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: f.DOCUMENT,
      definitions: this.many(
        b.SOF,
        this.parseDefinition,
        b.EOF
      )
    });
  }
  /**
   * Definition :
   *   - ExecutableDefinition
   *   - TypeSystemDefinition
   *   - TypeSystemExtension
   *
   * ExecutableDefinition :
   *   - OperationDefinition
   *   - FragmentDefinition
   *
   * TypeSystemDefinition :
   *   - SchemaDefinition
   *   - TypeDefinition
   *   - DirectiveDefinition
   *
   * TypeDefinition :
   *   - ScalarTypeDefinition
   *   - ObjectTypeDefinition
   *   - InterfaceTypeDefinition
   *   - UnionTypeDefinition
   *   - EnumTypeDefinition
   *   - InputObjectTypeDefinition
   */
  parseDefinition() {
    if (this.peek(b.BRACE_L))
      return this.parseOperationDefinition();
    const t = this.peekDescription(), n = t ? this._lexer.lookahead() : this._lexer.token;
    if (n.kind === b.NAME) {
      switch (n.value) {
        case "schema":
          return this.parseSchemaDefinition();
        case "scalar":
          return this.parseScalarTypeDefinition();
        case "type":
          return this.parseObjectTypeDefinition();
        case "interface":
          return this.parseInterfaceTypeDefinition();
        case "union":
          return this.parseUnionTypeDefinition();
        case "enum":
          return this.parseEnumTypeDefinition();
        case "input":
          return this.parseInputObjectTypeDefinition();
        case "directive":
          return this.parseDirectiveDefinition();
      }
      if (t)
        throw he(
          this._lexer.source,
          this._lexer.token.start,
          "Unexpected description, descriptions are supported only on type definitions."
        );
      switch (n.value) {
        case "query":
        case "mutation":
        case "subscription":
          return this.parseOperationDefinition();
        case "fragment":
          return this.parseFragmentDefinition();
        case "extend":
          return this.parseTypeSystemExtension();
      }
    }
    throw this.unexpected(n);
  }
  // Implements the parsing rules in the Operations section.
  /**
   * OperationDefinition :
   *  - SelectionSet
   *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
   */
  parseOperationDefinition() {
    const t = this._lexer.token;
    if (this.peek(b.BRACE_L))
      return this.node(t, {
        kind: f.OPERATION_DEFINITION,
        operation: me.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet()
      });
    const n = this.parseOperationType();
    let r;
    return this.peek(b.NAME) && (r = this.parseName()), this.node(t, {
      kind: f.OPERATION_DEFINITION,
      operation: n,
      name: r,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * OperationType : one of query mutation subscription
   */
  parseOperationType() {
    const t = this.expectToken(b.NAME);
    switch (t.value) {
      case "query":
        return me.QUERY;
      case "mutation":
        return me.MUTATION;
      case "subscription":
        return me.SUBSCRIPTION;
    }
    throw this.unexpected(t);
  }
  /**
   * VariableDefinitions : ( VariableDefinition+ )
   */
  parseVariableDefinitions() {
    return this.optionalMany(
      b.PAREN_L,
      this.parseVariableDefinition,
      b.PAREN_R
    );
  }
  /**
   * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
   */
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: f.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(b.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(b.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives()
    });
  }
  /**
   * Variable : $ Name
   */
  parseVariable() {
    const t = this._lexer.token;
    return this.expectToken(b.DOLLAR), this.node(t, {
      kind: f.VARIABLE,
      name: this.parseName()
    });
  }
  /**
   * ```
   * SelectionSet : { Selection+ }
   * ```
   */
  parseSelectionSet() {
    return this.node(this._lexer.token, {
      kind: f.SELECTION_SET,
      selections: this.many(
        b.BRACE_L,
        this.parseSelection,
        b.BRACE_R
      )
    });
  }
  /**
   * Selection :
   *   - Field
   *   - FragmentSpread
   *   - InlineFragment
   */
  parseSelection() {
    return this.peek(b.SPREAD) ? this.parseFragment() : this.parseField();
  }
  /**
   * Field : Alias? Name Arguments? Directives? SelectionSet?
   *
   * Alias : Name :
   */
  parseField() {
    const t = this._lexer.token, n = this.parseName();
    let r, s;
    return this.expectOptionalToken(b.COLON) ? (r = n, s = this.parseName()) : s = n, this.node(t, {
      kind: f.FIELD,
      alias: r,
      name: s,
      arguments: this.parseArguments(!1),
      directives: this.parseDirectives(!1),
      selectionSet: this.peek(b.BRACE_L) ? this.parseSelectionSet() : void 0
    });
  }
  /**
   * Arguments[Const] : ( Argument[?Const]+ )
   */
  parseArguments(t) {
    const n = t ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(b.PAREN_L, n, b.PAREN_R);
  }
  /**
   * Argument[Const] : Name : Value[?Const]
   */
  parseArgument(t = !1) {
    const n = this._lexer.token, r = this.parseName();
    return this.expectToken(b.COLON), this.node(n, {
      kind: f.ARGUMENT,
      name: r,
      value: this.parseValueLiteral(t)
    });
  }
  parseConstArgument() {
    return this.parseArgument(!0);
  }
  // Implements the parsing rules in the Fragments section.
  /**
   * Corresponds to both FragmentSpread and InlineFragment in the spec.
   *
   * FragmentSpread : ... FragmentName Directives?
   *
   * InlineFragment : ... TypeCondition? Directives? SelectionSet
   */
  parseFragment() {
    const t = this._lexer.token;
    this.expectToken(b.SPREAD);
    const n = this.expectOptionalKeyword("on");
    return !n && this.peek(b.NAME) ? this.node(t, {
      kind: f.FRAGMENT_SPREAD,
      name: this.parseFragmentName(),
      directives: this.parseDirectives(!1)
    }) : this.node(t, {
      kind: f.INLINE_FRAGMENT,
      typeCondition: n ? this.parseNamedType() : void 0,
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * FragmentDefinition :
   *   - fragment FragmentName on TypeCondition Directives? SelectionSet
   *
   * TypeCondition : NamedType
   */
  parseFragmentDefinition() {
    const t = this._lexer.token;
    return this.expectKeyword("fragment"), this._options.allowLegacyFragmentVariables === !0 ? this.node(t, {
      kind: f.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      variableDefinitions: this.parseVariableDefinitions(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    }) : this.node(t, {
      kind: f.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * FragmentName : Name but not `on`
   */
  parseFragmentName() {
    if (this._lexer.token.value === "on")
      throw this.unexpected();
    return this.parseName();
  }
  // Implements the parsing rules in the Values section.
  /**
   * Value[Const] :
   *   - [~Const] Variable
   *   - IntValue
   *   - FloatValue
   *   - StringValue
   *   - BooleanValue
   *   - NullValue
   *   - EnumValue
   *   - ListValue[?Const]
   *   - ObjectValue[?Const]
   *
   * BooleanValue : one of `true` `false`
   *
   * NullValue : `null`
   *
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseValueLiteral(t) {
    const n = this._lexer.token;
    switch (n.kind) {
      case b.BRACKET_L:
        return this.parseList(t);
      case b.BRACE_L:
        return this.parseObject(t);
      case b.INT:
        return this.advanceLexer(), this.node(n, {
          kind: f.INT,
          value: n.value
        });
      case b.FLOAT:
        return this.advanceLexer(), this.node(n, {
          kind: f.FLOAT,
          value: n.value
        });
      case b.STRING:
      case b.BLOCK_STRING:
        return this.parseStringLiteral();
      case b.NAME:
        switch (this.advanceLexer(), n.value) {
          case "true":
            return this.node(n, {
              kind: f.BOOLEAN,
              value: !0
            });
          case "false":
            return this.node(n, {
              kind: f.BOOLEAN,
              value: !1
            });
          case "null":
            return this.node(n, {
              kind: f.NULL
            });
          default:
            return this.node(n, {
              kind: f.ENUM,
              value: n.value
            });
        }
      case b.DOLLAR:
        if (t)
          if (this.expectToken(b.DOLLAR), this._lexer.token.kind === b.NAME) {
            const r = this._lexer.token.value;
            throw he(
              this._lexer.source,
              n.start,
              `Unexpected variable "$${r}" in constant value.`
            );
          } else
            throw this.unexpected(n);
        return this.parseVariable();
      default:
        throw this.unexpected();
    }
  }
  parseConstValueLiteral() {
    return this.parseValueLiteral(!0);
  }
  parseStringLiteral() {
    const t = this._lexer.token;
    return this.advanceLexer(), this.node(t, {
      kind: f.STRING,
      value: t.value,
      block: t.kind === b.BLOCK_STRING
    });
  }
  /**
   * ListValue[Const] :
   *   - [ ]
   *   - [ Value[?Const]+ ]
   */
  parseList(t) {
    const n = () => this.parseValueLiteral(t);
    return this.node(this._lexer.token, {
      kind: f.LIST,
      values: this.any(b.BRACKET_L, n, b.BRACKET_R)
    });
  }
  /**
   * ```
   * ObjectValue[Const] :
   *   - { }
   *   - { ObjectField[?Const]+ }
   * ```
   */
  parseObject(t) {
    const n = () => this.parseObjectField(t);
    return this.node(this._lexer.token, {
      kind: f.OBJECT,
      fields: this.any(b.BRACE_L, n, b.BRACE_R)
    });
  }
  /**
   * ObjectField[Const] : Name : Value[?Const]
   */
  parseObjectField(t) {
    const n = this._lexer.token, r = this.parseName();
    return this.expectToken(b.COLON), this.node(n, {
      kind: f.OBJECT_FIELD,
      name: r,
      value: this.parseValueLiteral(t)
    });
  }
  // Implements the parsing rules in the Directives section.
  /**
   * Directives[Const] : Directive[?Const]+
   */
  parseDirectives(t) {
    const n = [];
    for (; this.peek(b.AT); )
      n.push(this.parseDirective(t));
    return n;
  }
  parseConstDirectives() {
    return this.parseDirectives(!0);
  }
  /**
   * ```
   * Directive[Const] : @ Name Arguments[?Const]?
   * ```
   */
  parseDirective(t) {
    const n = this._lexer.token;
    return this.expectToken(b.AT), this.node(n, {
      kind: f.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(t)
    });
  }
  // Implements the parsing rules in the Types section.
  /**
   * Type :
   *   - NamedType
   *   - ListType
   *   - NonNullType
   */
  parseTypeReference() {
    const t = this._lexer.token;
    let n;
    if (this.expectOptionalToken(b.BRACKET_L)) {
      const r = this.parseTypeReference();
      this.expectToken(b.BRACKET_R), n = this.node(t, {
        kind: f.LIST_TYPE,
        type: r
      });
    } else
      n = this.parseNamedType();
    return this.expectOptionalToken(b.BANG) ? this.node(t, {
      kind: f.NON_NULL_TYPE,
      type: n
    }) : n;
  }
  /**
   * NamedType : Name
   */
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: f.NAMED_TYPE,
      name: this.parseName()
    });
  }
  // Implements the parsing rules in the Type Definition section.
  peekDescription() {
    return this.peek(b.STRING) || this.peek(b.BLOCK_STRING);
  }
  /**
   * Description : StringValue
   */
  parseDescription() {
    if (this.peekDescription())
      return this.parseStringLiteral();
  }
  /**
   * ```
   * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
   * ```
   */
  parseSchemaDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("schema");
    const r = this.parseConstDirectives(), s = this.many(
      b.BRACE_L,
      this.parseOperationTypeDefinition,
      b.BRACE_R
    );
    return this.node(t, {
      kind: f.SCHEMA_DEFINITION,
      description: n,
      directives: r,
      operationTypes: s
    });
  }
  /**
   * OperationTypeDefinition : OperationType : NamedType
   */
  parseOperationTypeDefinition() {
    const t = this._lexer.token, n = this.parseOperationType();
    this.expectToken(b.COLON);
    const r = this.parseNamedType();
    return this.node(t, {
      kind: f.OPERATION_TYPE_DEFINITION,
      operation: n,
      type: r
    });
  }
  /**
   * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
   */
  parseScalarTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("scalar");
    const r = this.parseName(), s = this.parseConstDirectives();
    return this.node(t, {
      kind: f.SCALAR_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: s
    });
  }
  /**
   * ObjectTypeDefinition :
   *   Description?
   *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
   */
  parseObjectTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("type");
    const r = this.parseName(), s = this.parseImplementsInterfaces(), i = this.parseConstDirectives(), a = this.parseFieldsDefinition();
    return this.node(t, {
      kind: f.OBJECT_TYPE_DEFINITION,
      description: n,
      name: r,
      interfaces: s,
      directives: i,
      fields: a
    });
  }
  /**
   * ImplementsInterfaces :
   *   - implements `&`? NamedType
   *   - ImplementsInterfaces & NamedType
   */
  parseImplementsInterfaces() {
    return this.expectOptionalKeyword("implements") ? this.delimitedMany(b.AMP, this.parseNamedType) : [];
  }
  /**
   * ```
   * FieldsDefinition : { FieldDefinition+ }
   * ```
   */
  parseFieldsDefinition() {
    return this.optionalMany(
      b.BRACE_L,
      this.parseFieldDefinition,
      b.BRACE_R
    );
  }
  /**
   * FieldDefinition :
   *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
   */
  parseFieldDefinition() {
    const t = this._lexer.token, n = this.parseDescription(), r = this.parseName(), s = this.parseArgumentDefs();
    this.expectToken(b.COLON);
    const i = this.parseTypeReference(), a = this.parseConstDirectives();
    return this.node(t, {
      kind: f.FIELD_DEFINITION,
      description: n,
      name: r,
      arguments: s,
      type: i,
      directives: a
    });
  }
  /**
   * ArgumentsDefinition : ( InputValueDefinition+ )
   */
  parseArgumentDefs() {
    return this.optionalMany(
      b.PAREN_L,
      this.parseInputValueDef,
      b.PAREN_R
    );
  }
  /**
   * InputValueDefinition :
   *   - Description? Name : Type DefaultValue? Directives[Const]?
   */
  parseInputValueDef() {
    const t = this._lexer.token, n = this.parseDescription(), r = this.parseName();
    this.expectToken(b.COLON);
    const s = this.parseTypeReference();
    let i;
    this.expectOptionalToken(b.EQUALS) && (i = this.parseConstValueLiteral());
    const a = this.parseConstDirectives();
    return this.node(t, {
      kind: f.INPUT_VALUE_DEFINITION,
      description: n,
      name: r,
      type: s,
      defaultValue: i,
      directives: a
    });
  }
  /**
   * InterfaceTypeDefinition :
   *   - Description? interface Name Directives[Const]? FieldsDefinition?
   */
  parseInterfaceTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("interface");
    const r = this.parseName(), s = this.parseImplementsInterfaces(), i = this.parseConstDirectives(), a = this.parseFieldsDefinition();
    return this.node(t, {
      kind: f.INTERFACE_TYPE_DEFINITION,
      description: n,
      name: r,
      interfaces: s,
      directives: i,
      fields: a
    });
  }
  /**
   * UnionTypeDefinition :
   *   - Description? union Name Directives[Const]? UnionMemberTypes?
   */
  parseUnionTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("union");
    const r = this.parseName(), s = this.parseConstDirectives(), i = this.parseUnionMemberTypes();
    return this.node(t, {
      kind: f.UNION_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: s,
      types: i
    });
  }
  /**
   * UnionMemberTypes :
   *   - = `|`? NamedType
   *   - UnionMemberTypes | NamedType
   */
  parseUnionMemberTypes() {
    return this.expectOptionalToken(b.EQUALS) ? this.delimitedMany(b.PIPE, this.parseNamedType) : [];
  }
  /**
   * EnumTypeDefinition :
   *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
   */
  parseEnumTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("enum");
    const r = this.parseName(), s = this.parseConstDirectives(), i = this.parseEnumValuesDefinition();
    return this.node(t, {
      kind: f.ENUM_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: s,
      values: i
    });
  }
  /**
   * ```
   * EnumValuesDefinition : { EnumValueDefinition+ }
   * ```
   */
  parseEnumValuesDefinition() {
    return this.optionalMany(
      b.BRACE_L,
      this.parseEnumValueDefinition,
      b.BRACE_R
    );
  }
  /**
   * EnumValueDefinition : Description? EnumValue Directives[Const]?
   */
  parseEnumValueDefinition() {
    const t = this._lexer.token, n = this.parseDescription(), r = this.parseEnumValueName(), s = this.parseConstDirectives();
    return this.node(t, {
      kind: f.ENUM_VALUE_DEFINITION,
      description: n,
      name: r,
      directives: s
    });
  }
  /**
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseEnumValueName() {
    if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null")
      throw he(
        this._lexer.source,
        this._lexer.token.start,
        `${Vr(
          this._lexer.token
        )} is reserved and cannot be used for an enum value.`
      );
    return this.parseName();
  }
  /**
   * InputObjectTypeDefinition :
   *   - Description? input Name Directives[Const]? InputFieldsDefinition?
   */
  parseInputObjectTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("input");
    const r = this.parseName(), s = this.parseConstDirectives(), i = this.parseInputFieldsDefinition();
    return this.node(t, {
      kind: f.INPUT_OBJECT_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: s,
      fields: i
    });
  }
  /**
   * ```
   * InputFieldsDefinition : { InputValueDefinition+ }
   * ```
   */
  parseInputFieldsDefinition() {
    return this.optionalMany(
      b.BRACE_L,
      this.parseInputValueDef,
      b.BRACE_R
    );
  }
  /**
   * TypeSystemExtension :
   *   - SchemaExtension
   *   - TypeExtension
   *
   * TypeExtension :
   *   - ScalarTypeExtension
   *   - ObjectTypeExtension
   *   - InterfaceTypeExtension
   *   - UnionTypeExtension
   *   - EnumTypeExtension
   *   - InputObjectTypeDefinition
   */
  parseTypeSystemExtension() {
    const t = this._lexer.lookahead();
    if (t.kind === b.NAME)
      switch (t.value) {
        case "schema":
          return this.parseSchemaExtension();
        case "scalar":
          return this.parseScalarTypeExtension();
        case "type":
          return this.parseObjectTypeExtension();
        case "interface":
          return this.parseInterfaceTypeExtension();
        case "union":
          return this.parseUnionTypeExtension();
        case "enum":
          return this.parseEnumTypeExtension();
        case "input":
          return this.parseInputObjectTypeExtension();
      }
    throw this.unexpected(t);
  }
  /**
   * ```
   * SchemaExtension :
   *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
   *  - extend schema Directives[Const]
   * ```
   */
  parseSchemaExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("schema");
    const n = this.parseConstDirectives(), r = this.optionalMany(
      b.BRACE_L,
      this.parseOperationTypeDefinition,
      b.BRACE_R
    );
    if (n.length === 0 && r.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: f.SCHEMA_EXTENSION,
      directives: n,
      operationTypes: r
    });
  }
  /**
   * ScalarTypeExtension :
   *   - extend scalar Name Directives[Const]
   */
  parseScalarTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("scalar");
    const n = this.parseName(), r = this.parseConstDirectives();
    if (r.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: f.SCALAR_TYPE_EXTENSION,
      name: n,
      directives: r
    });
  }
  /**
   * ObjectTypeExtension :
   *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend type Name ImplementsInterfaces? Directives[Const]
   *  - extend type Name ImplementsInterfaces
   */
  parseObjectTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("type");
    const n = this.parseName(), r = this.parseImplementsInterfaces(), s = this.parseConstDirectives(), i = this.parseFieldsDefinition();
    if (r.length === 0 && s.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: f.OBJECT_TYPE_EXTENSION,
      name: n,
      interfaces: r,
      directives: s,
      fields: i
    });
  }
  /**
   * InterfaceTypeExtension :
   *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend interface Name ImplementsInterfaces? Directives[Const]
   *  - extend interface Name ImplementsInterfaces
   */
  parseInterfaceTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("interface");
    const n = this.parseName(), r = this.parseImplementsInterfaces(), s = this.parseConstDirectives(), i = this.parseFieldsDefinition();
    if (r.length === 0 && s.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: f.INTERFACE_TYPE_EXTENSION,
      name: n,
      interfaces: r,
      directives: s,
      fields: i
    });
  }
  /**
   * UnionTypeExtension :
   *   - extend union Name Directives[Const]? UnionMemberTypes
   *   - extend union Name Directives[Const]
   */
  parseUnionTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("union");
    const n = this.parseName(), r = this.parseConstDirectives(), s = this.parseUnionMemberTypes();
    if (r.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: f.UNION_TYPE_EXTENSION,
      name: n,
      directives: r,
      types: s
    });
  }
  /**
   * EnumTypeExtension :
   *   - extend enum Name Directives[Const]? EnumValuesDefinition
   *   - extend enum Name Directives[Const]
   */
  parseEnumTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("enum");
    const n = this.parseName(), r = this.parseConstDirectives(), s = this.parseEnumValuesDefinition();
    if (r.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: f.ENUM_TYPE_EXTENSION,
      name: n,
      directives: r,
      values: s
    });
  }
  /**
   * InputObjectTypeExtension :
   *   - extend input Name Directives[Const]? InputFieldsDefinition
   *   - extend input Name Directives[Const]
   */
  parseInputObjectTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("input");
    const n = this.parseName(), r = this.parseConstDirectives(), s = this.parseInputFieldsDefinition();
    if (r.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: f.INPUT_OBJECT_TYPE_EXTENSION,
      name: n,
      directives: r,
      fields: s
    });
  }
  /**
   * ```
   * DirectiveDefinition :
   *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
   * ```
   */
  parseDirectiveDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("directive"), this.expectToken(b.AT);
    const r = this.parseName(), s = this.parseArgumentDefs(), i = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const a = this.parseDirectiveLocations();
    return this.node(t, {
      kind: f.DIRECTIVE_DEFINITION,
      description: n,
      name: r,
      arguments: s,
      repeatable: i,
      locations: a
    });
  }
  /**
   * DirectiveLocations :
   *   - `|`? DirectiveLocation
   *   - DirectiveLocations | DirectiveLocation
   */
  parseDirectiveLocations() {
    return this.delimitedMany(b.PIPE, this.parseDirectiveLocation);
  }
  /*
   * DirectiveLocation :
   *   - ExecutableDirectiveLocation
   *   - TypeSystemDirectiveLocation
   *
   * ExecutableDirectiveLocation : one of
   *   `QUERY`
   *   `MUTATION`
   *   `SUBSCRIPTION`
   *   `FIELD`
   *   `FRAGMENT_DEFINITION`
   *   `FRAGMENT_SPREAD`
   *   `INLINE_FRAGMENT`
   *
   * TypeSystemDirectiveLocation : one of
   *   `SCHEMA`
   *   `SCALAR`
   *   `OBJECT`
   *   `FIELD_DEFINITION`
   *   `ARGUMENT_DEFINITION`
   *   `INTERFACE`
   *   `UNION`
   *   `ENUM`
   *   `ENUM_VALUE`
   *   `INPUT_OBJECT`
   *   `INPUT_FIELD_DEFINITION`
   */
  parseDirectiveLocation() {
    const t = this._lexer.token, n = this.parseName();
    if (Object.prototype.hasOwnProperty.call(A, n.value))
      return n;
    throw this.unexpected(t);
  }
  // Core parsing utility functions
  /**
   * Returns a node that, if configured to do so, sets a "loc" field as a
   * location object, used to identify the place in the source that created a
   * given parsed object.
   */
  node(t, n) {
    return this._options.noLocation !== !0 && (n.loc = new _m(
      t,
      this._lexer.lastToken,
      this._lexer.source
    )), n;
  }
  /**
   * Determines if the next token is of a given kind
   */
  peek(t) {
    return this._lexer.token.kind === t;
  }
  /**
   * If the next token is of the given kind, return that token after advancing the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  expectToken(t) {
    const n = this._lexer.token;
    if (n.kind === t)
      return this.advanceLexer(), n;
    throw he(
      this._lexer.source,
      n.start,
      `Expected ${bl(t)}, found ${Vr(n)}.`
    );
  }
  /**
   * If the next token is of the given kind, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalToken(t) {
    return this._lexer.token.kind === t ? (this.advanceLexer(), !0) : !1;
  }
  /**
   * If the next token is a given keyword, advance the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  expectKeyword(t) {
    const n = this._lexer.token;
    if (n.kind === b.NAME && n.value === t)
      this.advanceLexer();
    else
      throw he(
        this._lexer.source,
        n.start,
        `Expected "${t}", found ${Vr(n)}.`
      );
  }
  /**
   * If the next token is a given keyword, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalKeyword(t) {
    const n = this._lexer.token;
    return n.kind === b.NAME && n.value === t ? (this.advanceLexer(), !0) : !1;
  }
  /**
   * Helper function for creating an error when an unexpected lexed token is encountered.
   */
  unexpected(t) {
    const n = t ?? this._lexer.token;
    return he(
      this._lexer.source,
      n.start,
      `Unexpected ${Vr(n)}.`
    );
  }
  /**
   * Returns a possibly empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  any(t, n, r) {
    this.expectToken(t);
    const s = [];
    for (; !this.expectOptionalToken(r); )
      s.push(n.call(this));
    return s;
  }
  /**
   * Returns a list of parse nodes, determined by the parseFn.
   * It can be empty only if open token is missing otherwise it will always return non-empty list
   * that begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  optionalMany(t, n, r) {
    if (this.expectOptionalToken(t)) {
      const s = [];
      do
        s.push(n.call(this));
      while (!this.expectOptionalToken(r));
      return s;
    }
    return [];
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  many(t, n, r) {
    this.expectToken(t);
    const s = [];
    do
      s.push(n.call(this));
    while (!this.expectOptionalToken(r));
    return s;
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
   * Advances the parser to the next lex token after last item in the list.
   */
  delimitedMany(t, n) {
    this.expectOptionalToken(t);
    const r = [];
    do
      r.push(n.call(this));
    while (this.expectOptionalToken(t));
    return r;
  }
  advanceLexer() {
    const { maxTokens: t } = this._options, n = this._lexer.advance();
    if (n.kind !== b.EOF && (++this._tokenCounter, t !== void 0 && this._tokenCounter > t))
      throw he(
        this._lexer.source,
        n.start,
        `Document contains more that ${t} tokens. Parsing aborted.`
      );
  }
}
function Vr(e) {
  const t = e.value;
  return bl(e.kind) + (t != null ? ` "${t}"` : "");
}
function bl(e) {
  return Lm(e) ? `"${e}"` : e;
}
const Xm = 5;
function Et(e, t) {
  const [n, r] = t ? [e, t] : [void 0, e];
  let s = " Did you mean ";
  n && (s += n + " ");
  const i = r.map((c) => `"${c}"`);
  switch (i.length) {
    case 0:
      return "";
    case 1:
      return s + i[0] + "?";
    case 2:
      return s + i[0] + " or " + i[1] + "?";
  }
  const a = i.slice(0, Xm), o = a.pop();
  return s + a.join(", ") + ", or " + o + "?";
}
function Uo(e) {
  return e;
}
function cn(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const r of e)
    n[t(r)] = r;
  return n;
}
function ka(e, t, n) {
  const r = /* @__PURE__ */ Object.create(null);
  for (const s of e)
    r[t(s)] = n(s);
  return r;
}
function kt(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const r of Object.keys(e))
    n[r] = t(e[r], r);
  return n;
}
function wa(e, t) {
  let n = 0, r = 0;
  for (; n < e.length && r < t.length; ) {
    let s = e.charCodeAt(n), i = t.charCodeAt(r);
    if (Br(s) && Br(i)) {
      let a = 0;
      do
        ++n, a = a * 10 + s - zi, s = e.charCodeAt(n);
      while (Br(s) && a > 0);
      let o = 0;
      do
        ++r, o = o * 10 + i - zi, i = t.charCodeAt(r);
      while (Br(i) && o > 0);
      if (a < o)
        return -1;
      if (a > o)
        return 1;
    } else {
      if (s < i)
        return -1;
      if (s > i)
        return 1;
      ++n, ++r;
    }
  }
  return e.length - t.length;
}
const zi = 48, Km = 57;
function Br(e) {
  return !isNaN(e) && zi <= e && e <= Km;
}
function Zt(e, t) {
  const n = /* @__PURE__ */ Object.create(null), r = new eg(e), s = Math.floor(e.length * 0.4) + 1;
  for (const i of t) {
    const a = r.measure(i, s);
    a !== void 0 && (n[i] = a);
  }
  return Object.keys(n).sort((i, a) => {
    const o = n[i] - n[a];
    return o !== 0 ? o : wa(i, a);
  });
}
class eg {
  constructor(t) {
    this._input = t, this._inputLowerCase = t.toLowerCase(), this._inputArray = zo(this._inputLowerCase), this._rows = [
      new Array(t.length + 1).fill(0),
      new Array(t.length + 1).fill(0),
      new Array(t.length + 1).fill(0)
    ];
  }
  measure(t, n) {
    if (this._input === t)
      return 0;
    const r = t.toLowerCase();
    if (this._inputLowerCase === r)
      return 1;
    let s = zo(r), i = this._inputArray;
    if (s.length < i.length) {
      const l = s;
      s = i, i = l;
    }
    const a = s.length, o = i.length;
    if (a - o > n)
      return;
    const c = this._rows;
    for (let l = 0; l <= o; l++)
      c[0][l] = l;
    for (let l = 1; l <= a; l++) {
      const d = c[(l - 1) % 3], p = c[l % 3];
      let h = p[0] = l;
      for (let m = 1; m <= o; m++) {
        const g = s[l - 1] === i[m - 1] ? 0 : 1;
        let k = Math.min(
          d[m] + 1,
          // delete
          p[m - 1] + 1,
          // insert
          d[m - 1] + g
          // substitute
        );
        if (l > 1 && m > 1 && s[l - 1] === i[m - 2] && s[l - 2] === i[m - 1]) {
          const E = c[(l - 2) % 3][m - 2];
          k = Math.min(k, E + 1);
        }
        k < h && (h = k), p[m] = k;
      }
      if (h > n)
        return;
    }
    const u = c[a % 3][o];
    return u <= n ? u : void 0;
  }
}
function zo(e) {
  const t = e.length, n = new Array(t);
  for (let r = 0; r < t; ++r)
    n[r] = e.charCodeAt(r);
  return n;
}
function Ze(e) {
  if (e == null)
    return /* @__PURE__ */ Object.create(null);
  if (Object.getPrototypeOf(e) === null)
    return e;
  const t = /* @__PURE__ */ Object.create(null);
  for (const [n, r] of Object.entries(e))
    t[n] = r;
  return t;
}
function tg(e) {
  return `"${e.replace(ng, rg)}"`;
}
const ng = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function rg(e) {
  return sg[e.charCodeAt(0)];
}
const sg = [
  "\\u0000",
  "\\u0001",
  "\\u0002",
  "\\u0003",
  "\\u0004",
  "\\u0005",
  "\\u0006",
  "\\u0007",
  "\\b",
  "\\t",
  "\\n",
  "\\u000B",
  "\\f",
  "\\r",
  "\\u000E",
  "\\u000F",
  "\\u0010",
  "\\u0011",
  "\\u0012",
  "\\u0013",
  "\\u0014",
  "\\u0015",
  "\\u0016",
  "\\u0017",
  "\\u0018",
  "\\u0019",
  "\\u001A",
  "\\u001B",
  "\\u001C",
  "\\u001D",
  "\\u001E",
  "\\u001F",
  "",
  "",
  '\\"',
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 2F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 3F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 4F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\\\",
  "",
  "",
  "",
  // 5F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 6F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\u007F",
  "\\u0080",
  "\\u0081",
  "\\u0082",
  "\\u0083",
  "\\u0084",
  "\\u0085",
  "\\u0086",
  "\\u0087",
  "\\u0088",
  "\\u0089",
  "\\u008A",
  "\\u008B",
  "\\u008C",
  "\\u008D",
  "\\u008E",
  "\\u008F",
  "\\u0090",
  "\\u0091",
  "\\u0092",
  "\\u0093",
  "\\u0094",
  "\\u0095",
  "\\u0096",
  "\\u0097",
  "\\u0098",
  "\\u0099",
  "\\u009A",
  "\\u009B",
  "\\u009C",
  "\\u009D",
  "\\u009E",
  "\\u009F"
], ar = Object.freeze({});
function Ar(e, t, n = pl) {
  const r = /* @__PURE__ */ new Map();
  for (const E of Object.values(f))
    r.set(E, wr(t, E));
  let s, i = Array.isArray(e), a = [e], o = -1, c = [], u = e, l, d;
  const p = [], h = [];
  do {
    o++;
    const E = o === a.length, I = E && c.length !== 0;
    if (E) {
      if (l = h.length === 0 ? void 0 : p[p.length - 1], u = d, d = h.pop(), I)
        if (i) {
          u = u.slice();
          let C = 0;
          for (const [ne, ue] of c) {
            const oe = ne - C;
            ue === null ? (u.splice(oe, 1), C++) : u[oe] = ue;
          }
        } else {
          u = { ...u };
          for (const [C, ne] of c)
            u[C] = ne;
        }
      o = s.index, a = s.keys, c = s.edits, i = s.inArray, s = s.prev;
    } else if (d) {
      if (l = i ? o : a[o], u = d[l], u == null)
        continue;
      p.push(l);
    }
    let D;
    if (!Array.isArray(u)) {
      var m, g;
      Fi(u) || z(!1, `Invalid AST Node: ${w(u)}.`);
      const C = E ? (m = r.get(u.kind)) === null || m === void 0 ? void 0 : m.leave : (g = r.get(u.kind)) === null || g === void 0 ? void 0 : g.enter;
      if (D = C == null ? void 0 : C.call(t, u, l, d, p, h), D === ar)
        break;
      if (D === !1) {
        if (!E) {
          p.pop();
          continue;
        }
      } else if (D !== void 0 && (c.push([l, D]), !E))
        if (Fi(D))
          u = D;
        else {
          p.pop();
          continue;
        }
    }
    if (D === void 0 && I && c.push([l, u]), E)
      p.pop();
    else {
      var k;
      s = {
        inArray: i,
        index: o,
        keys: a,
        edits: c,
        prev: s
      }, i = Array.isArray(u), a = i ? u : (k = n[u.kind]) !== null && k !== void 0 ? k : [], o = -1, c = [], d && h.push(d), d = u;
    }
  } while (s !== void 0);
  return c.length !== 0 ? c[c.length - 1][1] : e;
}
function kl(e) {
  const t = new Array(e.length).fill(null), n = /* @__PURE__ */ Object.create(null);
  for (const r of Object.values(f)) {
    let s = !1;
    const i = new Array(e.length).fill(void 0), a = new Array(e.length).fill(void 0);
    for (let c = 0; c < e.length; ++c) {
      const { enter: u, leave: l } = wr(e[c], r);
      s || (s = u != null || l != null), i[c] = u, a[c] = l;
    }
    if (!s)
      continue;
    const o = {
      enter(...c) {
        const u = c[0];
        for (let d = 0; d < e.length; d++)
          if (t[d] === null) {
            var l;
            const p = (l = i[d]) === null || l === void 0 ? void 0 : l.apply(e[d], c);
            if (p === !1)
              t[d] = u;
            else if (p === ar)
              t[d] = ar;
            else if (p !== void 0)
              return p;
          }
      },
      leave(...c) {
        const u = c[0];
        for (let d = 0; d < e.length; d++)
          if (t[d] === null) {
            var l;
            const p = (l = a[d]) === null || l === void 0 ? void 0 : l.apply(e[d], c);
            if (p === ar)
              t[d] = ar;
            else if (p !== void 0 && p !== !1)
              return p;
          } else t[d] === u && (t[d] = null);
      }
    };
    n[r] = o;
  }
  return n;
}
function wr(e, t) {
  const n = e[t];
  return typeof n == "object" ? n : typeof n == "function" ? {
    enter: n,
    leave: void 0
  } : {
    enter: e.enter,
    leave: e.leave
  };
}
function Hk(e, t, n) {
  const { enter: r, leave: s } = wr(e, t);
  return n ? s : r;
}
function le(e) {
  return Ar(e, ag);
}
const ig = 80, ag = {
  Name: {
    leave: (e) => e.value
  },
  Variable: {
    leave: (e) => "$" + e.name
  },
  // Document
  Document: {
    leave: (e) => O(e.definitions, `

`)
  },
  OperationDefinition: {
    leave(e) {
      const t = U("(", O(e.variableDefinitions, ", "), ")"), n = O(
        [
          e.operation,
          O([e.name, t]),
          O(e.directives, " ")
        ],
        " "
      );
      return (n === "query" ? "" : n + " ") + e.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: e, type: t, defaultValue: n, directives: r }) => e + ": " + t + U(" = ", n) + U(" ", O(r, " "))
  },
  SelectionSet: {
    leave: ({ selections: e }) => Ye(e)
  },
  Field: {
    leave({ alias: e, name: t, arguments: n, directives: r, selectionSet: s }) {
      const i = U("", e, ": ") + t;
      let a = i + U("(", O(n, ", "), ")");
      return a.length > ig && (a = i + U(`(
`, ss(O(n, `
`)), `
)`)), O([a, O(r, " "), s], " ");
    }
  },
  Argument: {
    leave: ({ name: e, value: t }) => e + ": " + t
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name: e, directives: t }) => "..." + e + U(" ", O(t, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: e, directives: t, selectionSet: n }) => O(
      [
        "...",
        U("on ", e),
        O(t, " "),
        n
      ],
      " "
    )
  },
  FragmentDefinition: {
    leave: ({ name: e, typeCondition: t, variableDefinitions: n, directives: r, selectionSet: s }) => (
      // or removed in the future.
      `fragment ${e}${U("(", O(n, ", "), ")")} on ${t} ${U("", O(r, " "), " ")}` + s
    )
  },
  // Value
  IntValue: {
    leave: ({ value: e }) => e
  },
  FloatValue: {
    leave: ({ value: e }) => e
  },
  StringValue: {
    leave: ({ value: e, block: t }) => t ? Cm(e) : tg(e)
  },
  BooleanValue: {
    leave: ({ value: e }) => e ? "true" : "false"
  },
  NullValue: {
    leave: () => "null"
  },
  EnumValue: {
    leave: ({ value: e }) => e
  },
  ListValue: {
    leave: ({ values: e }) => "[" + O(e, ", ") + "]"
  },
  ObjectValue: {
    leave: ({ fields: e }) => "{" + O(e, ", ") + "}"
  },
  ObjectField: {
    leave: ({ name: e, value: t }) => e + ": " + t
  },
  // Directive
  Directive: {
    leave: ({ name: e, arguments: t }) => "@" + e + U("(", O(t, ", "), ")")
  },
  // Type
  NamedType: {
    leave: ({ name: e }) => e
  },
  ListType: {
    leave: ({ type: e }) => "[" + e + "]"
  },
  NonNullType: {
    leave: ({ type: e }) => e + "!"
  },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ description: e, directives: t, operationTypes: n }) => U("", e, `
`) + O(["schema", O(t, " "), Ye(n)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: e, type: t }) => e + ": " + t
  },
  ScalarTypeDefinition: {
    leave: ({ description: e, name: t, directives: n }) => U("", e, `
`) + O(["scalar", t, O(n, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ description: e, name: t, interfaces: n, directives: r, fields: s }) => U("", e, `
`) + O(
      [
        "type",
        t,
        U("implements ", O(n, " & ")),
        O(r, " "),
        Ye(s)
      ],
      " "
    )
  },
  FieldDefinition: {
    leave: ({ description: e, name: t, arguments: n, type: r, directives: s }) => U("", e, `
`) + t + (qo(n) ? U(`(
`, ss(O(n, `
`)), `
)`) : U("(", O(n, ", "), ")")) + ": " + r + U(" ", O(s, " "))
  },
  InputValueDefinition: {
    leave: ({ description: e, name: t, type: n, defaultValue: r, directives: s }) => U("", e, `
`) + O(
      [t + ": " + n, U("= ", r), O(s, " ")],
      " "
    )
  },
  InterfaceTypeDefinition: {
    leave: ({ description: e, name: t, interfaces: n, directives: r, fields: s }) => U("", e, `
`) + O(
      [
        "interface",
        t,
        U("implements ", O(n, " & ")),
        O(r, " "),
        Ye(s)
      ],
      " "
    )
  },
  UnionTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, types: r }) => U("", e, `
`) + O(
      ["union", t, O(n, " "), U("= ", O(r, " | "))],
      " "
    )
  },
  EnumTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, values: r }) => U("", e, `
`) + O(["enum", t, O(n, " "), Ye(r)], " ")
  },
  EnumValueDefinition: {
    leave: ({ description: e, name: t, directives: n }) => U("", e, `
`) + O([t, O(n, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, fields: r }) => U("", e, `
`) + O(["input", t, O(n, " "), Ye(r)], " ")
  },
  DirectiveDefinition: {
    leave: ({ description: e, name: t, arguments: n, repeatable: r, locations: s }) => U("", e, `
`) + "directive @" + t + (qo(n) ? U(`(
`, ss(O(n, `
`)), `
)`) : U("(", O(n, ", "), ")")) + (r ? " repeatable" : "") + " on " + O(s, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: e, operationTypes: t }) => O(
      ["extend schema", O(e, " "), Ye(t)],
      " "
    )
  },
  ScalarTypeExtension: {
    leave: ({ name: e, directives: t }) => O(["extend scalar", e, O(t, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: r }) => O(
      [
        "extend type",
        e,
        U("implements ", O(t, " & ")),
        O(n, " "),
        Ye(r)
      ],
      " "
    )
  },
  InterfaceTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: r }) => O(
      [
        "extend interface",
        e,
        U("implements ", O(t, " & ")),
        O(n, " "),
        Ye(r)
      ],
      " "
    )
  },
  UnionTypeExtension: {
    leave: ({ name: e, directives: t, types: n }) => O(
      [
        "extend union",
        e,
        O(t, " "),
        U("= ", O(n, " | "))
      ],
      " "
    )
  },
  EnumTypeExtension: {
    leave: ({ name: e, directives: t, values: n }) => O(["extend enum", e, O(t, " "), Ye(n)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: e, directives: t, fields: n }) => O(["extend input", e, O(t, " "), Ye(n)], " ")
  }
};
function O(e, t = "") {
  var n;
  return (n = e == null ? void 0 : e.filter((r) => r).join(t)) !== null && n !== void 0 ? n : "";
}
function Ye(e) {
  return U(`{
`, ss(O(e, `
`)), `
}`);
}
function U(e, t, n = "") {
  return t != null && t !== "" ? e + t + n : "";
}
function ss(e) {
  return U("  ", e.replace(/\n/g, `
  `));
}
function qo(e) {
  var t;
  return (t = e == null ? void 0 : e.some((n) => n.includes(`
`))) !== null && t !== void 0 ? t : !1;
}
function gs(e, t) {
  switch (e.kind) {
    case f.NULL:
      return null;
    case f.INT:
      return parseInt(e.value, 10);
    case f.FLOAT:
      return parseFloat(e.value);
    case f.STRING:
    case f.ENUM:
    case f.BOOLEAN:
      return e.value;
    case f.LIST:
      return e.values.map(
        (n) => gs(n, t)
      );
    case f.OBJECT:
      return ka(
        e.fields,
        (n) => n.name.value,
        (n) => gs(n.value, t)
      );
    case f.VARIABLE:
      return t == null ? void 0 : t[e.name.value];
  }
}
function rt(e) {
  if (e != null || z(!1, "Must provide name."), typeof e == "string" || z(!1, "Expected name to be a string."), e.length === 0)
    throw new v("Expected name to be a non-empty string.");
  for (let t = 1; t < e.length; ++t)
    if (!ml(e.charCodeAt(t)))
      throw new v(
        `Names must only contain [_a-zA-Z0-9] but "${e}" does not.`
      );
  if (!va(e.charCodeAt(0)))
    throw new v(
      `Names must start with [_a-zA-Z] but "${e}" does not.`
    );
  return e;
}
function og(e) {
  if (e === "true" || e === "false" || e === "null")
    throw new v(`Enum values cannot be named: ${e}`);
  return rt(e);
}
function Hs(e) {
  return Ae(e) || $(e) || q(e) || de(e) || ie(e) || G(e) || Q(e) || M(e);
}
function Zk(e) {
  if (!Hs(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL type.`);
  return e;
}
function Ae(e) {
  return nt(e, ft);
}
function Gk(e) {
  if (!Ae(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL Scalar type.`);
  return e;
}
function $(e) {
  return nt(e, De);
}
function Wk(e) {
  if (!$(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL Object type.`);
  return e;
}
function q(e) {
  return nt(e, Ht);
}
function Jk(e) {
  if (!q(e))
    throw new Error(
      `Expected ${w(e)} to be a GraphQL Interface type.`
    );
  return e;
}
function de(e) {
  return nt(e, Tr);
}
function Yk(e) {
  if (!de(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL Union type.`);
  return e;
}
function ie(e) {
  return nt(e, pt);
}
function Qk(e) {
  if (!ie(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL Enum type.`);
  return e;
}
function G(e) {
  return nt(e, un);
}
function Xk(e) {
  if (!G(e))
    throw new Error(
      `Expected ${w(e)} to be a GraphQL Input Object type.`
    );
  return e;
}
function Q(e) {
  return nt(e, ve);
}
function Kk(e) {
  if (!Q(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL List type.`);
  return e;
}
function M(e) {
  return nt(e, F);
}
function ew(e) {
  if (!M(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL Non-Null type.`);
  return e;
}
function Be(e) {
  return Ae(e) || ie(e) || G(e) || Zs(e) && Be(e.ofType);
}
function tw(e) {
  if (!Be(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL input type.`);
  return e;
}
function Dn(e) {
  return Ae(e) || $(e) || q(e) || de(e) || ie(e) || Zs(e) && Dn(e.ofType);
}
function nw(e) {
  if (!Dn(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL output type.`);
  return e;
}
function Oe(e) {
  return Ae(e) || ie(e);
}
function rw(e) {
  if (!Oe(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL leaf type.`);
  return e;
}
function It(e) {
  return $(e) || q(e) || de(e);
}
function sw(e) {
  if (!It(e))
    throw new Error(
      `Expected ${w(e)} to be a GraphQL composite type.`
    );
  return e;
}
function wt(e) {
  return q(e) || de(e);
}
function iw(e) {
  if (!wt(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL abstract type.`);
  return e;
}
class ve {
  constructor(t) {
    Hs(t) || z(!1, `Expected ${w(t)} to be a GraphQL type.`), this.ofType = t;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLList";
  }
  toString() {
    return "[" + String(this.ofType) + "]";
  }
  toJSON() {
    return this.toString();
  }
}
class F {
  constructor(t) {
    Ta(t) || z(
      !1,
      `Expected ${w(t)} to be a GraphQL nullable type.`
    ), this.ofType = t;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLNonNull";
  }
  toString() {
    return String(this.ofType) + "!";
  }
  toJSON() {
    return this.toString();
  }
}
function Zs(e) {
  return Q(e) || M(e);
}
function aw(e) {
  if (!Zs(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL wrapping type.`);
  return e;
}
function Ta(e) {
  return Hs(e) && !M(e);
}
function ow(e) {
  if (!Ta(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL nullable type.`);
  return e;
}
function Ea(e) {
  if (e)
    return M(e) ? e.ofType : e;
}
function Cr(e) {
  return Ae(e) || $(e) || q(e) || de(e) || ie(e) || G(e);
}
function cw(e) {
  if (!Cr(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL named type.`);
  return e;
}
function _e(e) {
  if (e) {
    let t = e;
    for (; Zs(t); )
      t = t.ofType;
    return t;
  }
}
function wl(e) {
  return typeof e == "function" ? e() : e;
}
function Tl(e) {
  return typeof e == "function" ? e() : e;
}
class ft {
  constructor(t) {
    var n, r, s, i;
    const a = (n = t.parseValue) !== null && n !== void 0 ? n : Uo;
    this.name = rt(t.name), this.description = t.description, this.specifiedByURL = t.specifiedByURL, this.serialize = (r = t.serialize) !== null && r !== void 0 ? r : Uo, this.parseValue = a, this.parseLiteral = (s = t.parseLiteral) !== null && s !== void 0 ? s : (o, c) => a(gs(o, c)), this.extensions = Ze(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (i = t.extensionASTNodes) !== null && i !== void 0 ? i : [], t.specifiedByURL == null || typeof t.specifiedByURL == "string" || z(
      !1,
      `${this.name} must provide "specifiedByURL" as a string, but got: ${w(t.specifiedByURL)}.`
    ), t.serialize == null || typeof t.serialize == "function" || z(
      !1,
      `${this.name} must provide "serialize" function. If this custom Scalar is also used as an input type, ensure "parseValue" and "parseLiteral" functions are also provided.`
    ), t.parseLiteral && (typeof t.parseValue == "function" && typeof t.parseLiteral == "function" || z(
      !1,
      `${this.name} must provide both "parseValue" and "parseLiteral" functions.`
    ));
  }
  get [Symbol.toStringTag]() {
    return "GraphQLScalarType";
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      specifiedByURL: this.specifiedByURL,
      serialize: this.serialize,
      parseValue: this.parseValue,
      parseLiteral: this.parseLiteral,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
class De {
  constructor(t) {
    var n;
    this.name = rt(t.name), this.description = t.description, this.isTypeOf = t.isTypeOf, this.extensions = Ze(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._fields = () => Il(t), this._interfaces = () => El(t), t.isTypeOf == null || typeof t.isTypeOf == "function" || z(
      !1,
      `${this.name} must provide "isTypeOf" as a function, but got: ${w(t.isTypeOf)}.`
    );
  }
  get [Symbol.toStringTag]() {
    return "GraphQLObjectType";
  }
  getFields() {
    return typeof this._fields == "function" && (this._fields = this._fields()), this._fields;
  }
  getInterfaces() {
    return typeof this._interfaces == "function" && (this._interfaces = this._interfaces()), this._interfaces;
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: Sl(this.getFields()),
      isTypeOf: this.isTypeOf,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
function El(e) {
  var t;
  const n = wl(
    (t = e.interfaces) !== null && t !== void 0 ? t : []
  );
  return Array.isArray(n) || z(
    !1,
    `${e.name} interfaces must be an Array or a function which returns an Array.`
  ), n;
}
function Il(e) {
  const t = Tl(e.fields);
  return An(t) || z(
    !1,
    `${e.name} fields must be an object with field names as keys or a function which returns such an object.`
  ), kt(t, (n, r) => {
    var s;
    An(n) || z(
      !1,
      `${e.name}.${r} field config must be an object.`
    ), n.resolve == null || typeof n.resolve == "function" || z(
      !1,
      `${e.name}.${r} field resolver must be a function if provided, but got: ${w(n.resolve)}.`
    );
    const i = (s = n.args) !== null && s !== void 0 ? s : {};
    return An(i) || z(
      !1,
      `${e.name}.${r} args must be an object with argument names as keys.`
    ), {
      name: rt(r),
      description: n.description,
      type: n.type,
      args: xl(i),
      resolve: n.resolve,
      subscribe: n.subscribe,
      deprecationReason: n.deprecationReason,
      extensions: Ze(n.extensions),
      astNode: n.astNode
    };
  });
}
function xl(e) {
  return Object.entries(e).map(([t, n]) => ({
    name: rt(t),
    description: n.description,
    type: n.type,
    defaultValue: n.defaultValue,
    deprecationReason: n.deprecationReason,
    extensions: Ze(n.extensions),
    astNode: n.astNode
  }));
}
function An(e) {
  return tt(e) && !Array.isArray(e);
}
function Sl(e) {
  return kt(e, (t) => ({
    description: t.description,
    type: t.type,
    args: Nl(t.args),
    resolve: t.resolve,
    subscribe: t.subscribe,
    deprecationReason: t.deprecationReason,
    extensions: t.extensions,
    astNode: t.astNode
  }));
}
function Nl(e) {
  return ka(
    e,
    (t) => t.name,
    (t) => ({
      description: t.description,
      type: t.type,
      defaultValue: t.defaultValue,
      deprecationReason: t.deprecationReason,
      extensions: t.extensions,
      astNode: t.astNode
    })
  );
}
function Rr(e) {
  return M(e.type) && e.defaultValue === void 0;
}
class Ht {
  constructor(t) {
    var n;
    this.name = rt(t.name), this.description = t.description, this.resolveType = t.resolveType, this.extensions = Ze(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._fields = Il.bind(void 0, t), this._interfaces = El.bind(void 0, t), t.resolveType == null || typeof t.resolveType == "function" || z(
      !1,
      `${this.name} must provide "resolveType" as a function, but got: ${w(t.resolveType)}.`
    );
  }
  get [Symbol.toStringTag]() {
    return "GraphQLInterfaceType";
  }
  getFields() {
    return typeof this._fields == "function" && (this._fields = this._fields()), this._fields;
  }
  getInterfaces() {
    return typeof this._interfaces == "function" && (this._interfaces = this._interfaces()), this._interfaces;
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: Sl(this.getFields()),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
class Tr {
  constructor(t) {
    var n;
    this.name = rt(t.name), this.description = t.description, this.resolveType = t.resolveType, this.extensions = Ze(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._types = cg.bind(void 0, t), t.resolveType == null || typeof t.resolveType == "function" || z(
      !1,
      `${this.name} must provide "resolveType" as a function, but got: ${w(t.resolveType)}.`
    );
  }
  get [Symbol.toStringTag]() {
    return "GraphQLUnionType";
  }
  getTypes() {
    return typeof this._types == "function" && (this._types = this._types()), this._types;
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      types: this.getTypes(),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
function cg(e) {
  const t = wl(e.types);
  return Array.isArray(t) || z(
    !1,
    `Must provide Array of types or a function which returns such an array for Union ${e.name}.`
  ), t;
}
class pt {
  /* <T> */
  constructor(t) {
    var n;
    this.name = rt(t.name), this.description = t.description, this.extensions = Ze(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._values = typeof t.values == "function" ? t.values : Vo(this.name, t.values), this._valueLookup = null, this._nameLookup = null;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLEnumType";
  }
  getValues() {
    return typeof this._values == "function" && (this._values = Vo(this.name, this._values())), this._values;
  }
  getValue(t) {
    return this._nameLookup === null && (this._nameLookup = cn(this.getValues(), (n) => n.name)), this._nameLookup[t];
  }
  serialize(t) {
    this._valueLookup === null && (this._valueLookup = new Map(
      this.getValues().map((r) => [r.value, r])
    ));
    const n = this._valueLookup.get(t);
    if (n === void 0)
      throw new v(
        `Enum "${this.name}" cannot represent value: ${w(t)}`
      );
    return n.name;
  }
  parseValue(t) {
    if (typeof t != "string") {
      const r = w(t);
      throw new v(
        `Enum "${this.name}" cannot represent non-string value: ${r}.` + Hr(this, r)
      );
    }
    const n = this.getValue(t);
    if (n == null)
      throw new v(
        `Value "${t}" does not exist in "${this.name}" enum.` + Hr(this, t)
      );
    return n.value;
  }
  parseLiteral(t, n) {
    if (t.kind !== f.ENUM) {
      const s = le(t);
      throw new v(
        `Enum "${this.name}" cannot represent non-enum value: ${s}.` + Hr(this, s),
        {
          nodes: t
        }
      );
    }
    const r = this.getValue(t.value);
    if (r == null) {
      const s = le(t);
      throw new v(
        `Value "${s}" does not exist in "${this.name}" enum.` + Hr(this, s),
        {
          nodes: t
        }
      );
    }
    return r.value;
  }
  toConfig() {
    const t = ka(
      this.getValues(),
      (n) => n.name,
      (n) => ({
        description: n.description,
        value: n.value,
        deprecationReason: n.deprecationReason,
        extensions: n.extensions,
        astNode: n.astNode
      })
    );
    return {
      name: this.name,
      description: this.description,
      values: t,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
function Hr(e, t) {
  const n = e.getValues().map((s) => s.name), r = Zt(t, n);
  return Et("the enum value", r);
}
function Vo(e, t) {
  return An(t) || z(
    !1,
    `${e} values must be an object with value names as keys.`
  ), Object.entries(t).map(([n, r]) => (An(r) || z(
    !1,
    `${e}.${n} must refer to an object with a "value" key representing an internal value but got: ${w(r)}.`
  ), {
    name: og(n),
    description: r.description,
    value: r.value !== void 0 ? r.value : n,
    deprecationReason: r.deprecationReason,
    extensions: Ze(r.extensions),
    astNode: r.astNode
  }));
}
class un {
  constructor(t) {
    var n, r;
    this.name = rt(t.name), this.description = t.description, this.extensions = Ze(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this.isOneOf = (r = t.isOneOf) !== null && r !== void 0 ? r : !1, this._fields = ug.bind(void 0, t);
  }
  get [Symbol.toStringTag]() {
    return "GraphQLInputObjectType";
  }
  getFields() {
    return typeof this._fields == "function" && (this._fields = this._fields()), this._fields;
  }
  toConfig() {
    const t = kt(this.getFields(), (n) => ({
      description: n.description,
      type: n.type,
      defaultValue: n.defaultValue,
      deprecationReason: n.deprecationReason,
      extensions: n.extensions,
      astNode: n.astNode
    }));
    return {
      name: this.name,
      description: this.description,
      fields: t,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
      isOneOf: this.isOneOf
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
function ug(e) {
  const t = Tl(e.fields);
  return An(t) || z(
    !1,
    `${e.name} fields must be an object with field names as keys or a function which returns such an object.`
  ), kt(t, (n, r) => (!("resolve" in n) || z(
    !1,
    `${e.name}.${r} field has a resolve property, but Input Types cannot define resolvers.`
  ), {
    name: rt(r),
    description: n.description,
    type: n.type,
    defaultValue: n.defaultValue,
    deprecationReason: n.deprecationReason,
    extensions: Ze(n.extensions),
    astNode: n.astNode
  }));
}
function _l(e) {
  return M(e.type) && e.defaultValue === void 0;
}
function qi(e, t) {
  return e === t ? !0 : M(e) && M(t) || Q(e) && Q(t) ? qi(e.ofType, t.ofType) : !1;
}
function Cn(e, t, n) {
  return t === n ? !0 : M(n) ? M(t) ? Cn(e, t.ofType, n.ofType) : !1 : M(t) ? Cn(e, t.ofType, n) : Q(n) ? Q(t) ? Cn(e, t.ofType, n.ofType) : !1 : Q(t) ? !1 : wt(n) && (q(t) || $(t)) && e.isSubType(n, t);
}
function Bo(e, t, n) {
  return t === n ? !0 : wt(t) ? wt(n) ? e.getPossibleTypes(t).some((r) => e.isSubType(n, r)) : e.isSubType(t, n) : wt(n) ? e.isSubType(n, t) : !1;
}
const gi = 2147483647, yi = -2147483648, Vi = new ft({
  name: "Int",
  description: "The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.",
  serialize(e) {
    const t = jr(e);
    if (typeof t == "boolean")
      return t ? 1 : 0;
    let n = t;
    if (typeof t == "string" && t !== "" && (n = Number(t)), typeof n != "number" || !Number.isInteger(n))
      throw new v(
        `Int cannot represent non-integer value: ${w(t)}`
      );
    if (n > gi || n < yi)
      throw new v(
        "Int cannot represent non 32-bit signed integer value: " + w(t)
      );
    return n;
  },
  parseValue(e) {
    if (typeof e != "number" || !Number.isInteger(e))
      throw new v(
        `Int cannot represent non-integer value: ${w(e)}`
      );
    if (e > gi || e < yi)
      throw new v(
        `Int cannot represent non 32-bit signed integer value: ${e}`
      );
    return e;
  },
  parseLiteral(e) {
    if (e.kind !== f.INT)
      throw new v(
        `Int cannot represent non-integer value: ${le(e)}`,
        {
          nodes: e
        }
      );
    const t = parseInt(e.value, 10);
    if (t > gi || t < yi)
      throw new v(
        `Int cannot represent non 32-bit signed integer value: ${e.value}`,
        {
          nodes: e
        }
      );
    return t;
  }
}), Bi = new ft({
  name: "Float",
  description: "The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).",
  serialize(e) {
    const t = jr(e);
    if (typeof t == "boolean")
      return t ? 1 : 0;
    let n = t;
    if (typeof t == "string" && t !== "" && (n = Number(t)), typeof n != "number" || !Number.isFinite(n))
      throw new v(
        `Float cannot represent non numeric value: ${w(t)}`
      );
    return n;
  },
  parseValue(e) {
    if (typeof e != "number" || !Number.isFinite(e))
      throw new v(
        `Float cannot represent non numeric value: ${w(e)}`
      );
    return e;
  },
  parseLiteral(e) {
    if (e.kind !== f.FLOAT && e.kind !== f.INT)
      throw new v(
        `Float cannot represent non numeric value: ${le(e)}`,
        e
      );
    return parseFloat(e.value);
  }
}), te = new ft({
  name: "String",
  description: "The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.",
  serialize(e) {
    const t = jr(e);
    if (typeof t == "string")
      return t;
    if (typeof t == "boolean")
      return t ? "true" : "false";
    if (typeof t == "number" && Number.isFinite(t))
      return t.toString();
    throw new v(
      `String cannot represent value: ${w(e)}`
    );
  },
  parseValue(e) {
    if (typeof e != "string")
      throw new v(
        `String cannot represent a non string value: ${w(e)}`
      );
    return e;
  },
  parseLiteral(e) {
    if (e.kind !== f.STRING)
      throw new v(
        `String cannot represent a non string value: ${le(e)}`,
        {
          nodes: e
        }
      );
    return e.value;
  }
}), Ee = new ft({
  name: "Boolean",
  description: "The `Boolean` scalar type represents `true` or `false`.",
  serialize(e) {
    const t = jr(e);
    if (typeof t == "boolean")
      return t;
    if (Number.isFinite(t))
      return t !== 0;
    throw new v(
      `Boolean cannot represent a non boolean value: ${w(t)}`
    );
  },
  parseValue(e) {
    if (typeof e != "boolean")
      throw new v(
        `Boolean cannot represent a non boolean value: ${w(e)}`
      );
    return e;
  },
  parseLiteral(e) {
    if (e.kind !== f.BOOLEAN)
      throw new v(
        `Boolean cannot represent a non boolean value: ${le(e)}`,
        {
          nodes: e
        }
      );
    return e.value;
  }
}), ys = new ft({
  name: "ID",
  description: 'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',
  serialize(e) {
    const t = jr(e);
    if (typeof t == "string")
      return t;
    if (Number.isInteger(t))
      return String(t);
    throw new v(
      `ID cannot represent value: ${w(e)}`
    );
  },
  parseValue(e) {
    if (typeof e == "string")
      return e;
    if (typeof e == "number" && Number.isInteger(e))
      return e.toString();
    throw new v(`ID cannot represent value: ${w(e)}`);
  },
  parseLiteral(e) {
    if (e.kind !== f.STRING && e.kind !== f.INT)
      throw new v(
        "ID cannot represent a non-string and non-integer value: " + le(e),
        {
          nodes: e
        }
      );
    return e.value;
  }
}), Ia = Object.freeze([
  te,
  Vi,
  Bi,
  Ee,
  ys
]);
function Lr(e) {
  return Ia.some(({ name: t }) => e.name === t);
}
function jr(e) {
  if (tt(e)) {
    if (typeof e.valueOf == "function") {
      const t = e.valueOf();
      if (!tt(t))
        return t;
    }
    if (typeof e.toJSON == "function")
      return e.toJSON();
  }
  return e;
}
function xa(e) {
  return nt(e, xt);
}
function uw(e) {
  if (!xa(e))
    throw new Error(
      `Expected ${w(e)} to be a GraphQL directive.`
    );
  return e;
}
class xt {
  constructor(t) {
    var n, r;
    this.name = rt(t.name), this.description = t.description, this.locations = t.locations, this.isRepeatable = (n = t.isRepeatable) !== null && n !== void 0 ? n : !1, this.extensions = Ze(t.extensions), this.astNode = t.astNode, Array.isArray(t.locations) || z(!1, `@${t.name} locations must be an Array.`);
    const s = (r = t.args) !== null && r !== void 0 ? r : {};
    tt(s) && !Array.isArray(s) || z(
      !1,
      `@${t.name} args must be an object with argument names as keys.`
    ), this.args = xl(s);
  }
  get [Symbol.toStringTag]() {
    return "GraphQLDirective";
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      locations: this.locations,
      args: Nl(this.args),
      isRepeatable: this.isRepeatable,
      extensions: this.extensions,
      astNode: this.astNode
    };
  }
  toString() {
    return "@" + this.name;
  }
  toJSON() {
    return this.toString();
  }
}
const Ol = new xt({
  name: "include",
  description: "Directs the executor to include this field or fragment only when the `if` argument is true.",
  locations: [
    A.FIELD,
    A.FRAGMENT_SPREAD,
    A.INLINE_FRAGMENT
  ],
  args: {
    if: {
      type: new F(Ee),
      description: "Included when true."
    }
  }
}), Dl = new xt({
  name: "skip",
  description: "Directs the executor to skip this field or fragment when the `if` argument is true.",
  locations: [
    A.FIELD,
    A.FRAGMENT_SPREAD,
    A.INLINE_FRAGMENT
  ],
  args: {
    if: {
      type: new F(Ee),
      description: "Skipped when true."
    }
  }
}), lg = "No longer supported", Gs = new xt({
  name: "deprecated",
  description: "Marks an element of a GraphQL schema as no longer supported.",
  locations: [
    A.FIELD_DEFINITION,
    A.ARGUMENT_DEFINITION,
    A.INPUT_FIELD_DEFINITION,
    A.ENUM_VALUE
  ],
  args: {
    reason: {
      type: te,
      description: "Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).",
      defaultValue: lg
    }
  }
}), Al = new xt({
  name: "specifiedBy",
  description: "Exposes a URL that specifies the behavior of this scalar.",
  locations: [A.SCALAR],
  args: {
    url: {
      type: new F(te),
      description: "The URL that specifies the behavior of this scalar."
    }
  }
}), Cl = new xt({
  name: "oneOf",
  description: "Indicates exactly one field must be supplied and this field must not be `null`.",
  locations: [A.INPUT_OBJECT],
  args: {}
}), Gt = Object.freeze([
  Ol,
  Dl,
  Gs,
  Al,
  Cl
]);
function Rl(e) {
  return Gt.some(({ name: t }) => t === e.name);
}
function Sa(e) {
  return typeof e == "object" && typeof (e == null ? void 0 : e[Symbol.iterator]) == "function";
}
function or(e, t) {
  if (M(t)) {
    const n = or(e, t.ofType);
    return (n == null ? void 0 : n.kind) === f.NULL ? null : n;
  }
  if (e === null)
    return {
      kind: f.NULL
    };
  if (e === void 0)
    return null;
  if (Q(t)) {
    const n = t.ofType;
    if (Sa(e)) {
      const r = [];
      for (const s of e) {
        const i = or(s, n);
        i != null && r.push(i);
      }
      return {
        kind: f.LIST,
        values: r
      };
    }
    return or(e, n);
  }
  if (G(t)) {
    if (!tt(e))
      return null;
    const n = [];
    for (const r of Object.values(t.getFields())) {
      const s = or(e[r.name], r.type);
      s && n.push({
        kind: f.OBJECT_FIELD,
        name: {
          kind: f.NAME,
          value: r.name
        },
        value: s
      });
    }
    return {
      kind: f.OBJECT,
      fields: n
    };
  }
  if (Oe(t)) {
    const n = t.serialize(e);
    if (n == null)
      return null;
    if (typeof n == "boolean")
      return {
        kind: f.BOOLEAN,
        value: n
      };
    if (typeof n == "number" && Number.isFinite(n)) {
      const r = String(n);
      return Ho.test(r) ? {
        kind: f.INT,
        value: r
      } : {
        kind: f.FLOAT,
        value: r
      };
    }
    if (typeof n == "string")
      return ie(t) ? {
        kind: f.ENUM,
        value: n
      } : t === ys && Ho.test(n) ? {
        kind: f.INT,
        value: n
      } : {
        kind: f.STRING,
        value: n
      };
    throw new TypeError(`Cannot convert value to AST: ${w(n)}.`);
  }
  Pe(!1, "Unexpected input type: " + w(t));
}
const Ho = /^-?(?:0|[1-9][0-9]*)$/, Na = new De({
  name: "__Schema",
  description: "A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.",
  fields: () => ({
    description: {
      type: te,
      resolve: (e) => e.description
    },
    types: {
      description: "A list of all types supported by this server.",
      type: new F(new ve(new F(et))),
      resolve(e) {
        return Object.values(e.getTypeMap());
      }
    },
    queryType: {
      description: "The type that query operations will be rooted at.",
      type: new F(et),
      resolve: (e) => e.getQueryType()
    },
    mutationType: {
      description: "If this server supports mutation, the type that mutation operations will be rooted at.",
      type: et,
      resolve: (e) => e.getMutationType()
    },
    subscriptionType: {
      description: "If this server support subscription, the type that subscription operations will be rooted at.",
      type: et,
      resolve: (e) => e.getSubscriptionType()
    },
    directives: {
      description: "A list of all directives supported by this server.",
      type: new F(
        new ve(new F(Ll))
      ),
      resolve: (e) => e.getDirectives()
    }
  })
}), Ll = new De({
  name: "__Directive",
  description: `A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.

In some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.`,
  fields: () => ({
    name: {
      type: new F(te),
      resolve: (e) => e.name
    },
    description: {
      type: te,
      resolve: (e) => e.description
    },
    isRepeatable: {
      type: new F(Ee),
      resolve: (e) => e.isRepeatable
    },
    locations: {
      type: new F(
        new ve(new F(jl))
      ),
      resolve: (e) => e.locations
    },
    args: {
      type: new F(
        new ve(new F(Ws))
      ),
      args: {
        includeDeprecated: {
          type: Ee,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        return t ? e.args : e.args.filter((n) => n.deprecationReason == null);
      }
    }
  })
}), jl = new pt({
  name: "__DirectiveLocation",
  description: "A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.",
  values: {
    QUERY: {
      value: A.QUERY,
      description: "Location adjacent to a query operation."
    },
    MUTATION: {
      value: A.MUTATION,
      description: "Location adjacent to a mutation operation."
    },
    SUBSCRIPTION: {
      value: A.SUBSCRIPTION,
      description: "Location adjacent to a subscription operation."
    },
    FIELD: {
      value: A.FIELD,
      description: "Location adjacent to a field."
    },
    FRAGMENT_DEFINITION: {
      value: A.FRAGMENT_DEFINITION,
      description: "Location adjacent to a fragment definition."
    },
    FRAGMENT_SPREAD: {
      value: A.FRAGMENT_SPREAD,
      description: "Location adjacent to a fragment spread."
    },
    INLINE_FRAGMENT: {
      value: A.INLINE_FRAGMENT,
      description: "Location adjacent to an inline fragment."
    },
    VARIABLE_DEFINITION: {
      value: A.VARIABLE_DEFINITION,
      description: "Location adjacent to a variable definition."
    },
    SCHEMA: {
      value: A.SCHEMA,
      description: "Location adjacent to a schema definition."
    },
    SCALAR: {
      value: A.SCALAR,
      description: "Location adjacent to a scalar definition."
    },
    OBJECT: {
      value: A.OBJECT,
      description: "Location adjacent to an object type definition."
    },
    FIELD_DEFINITION: {
      value: A.FIELD_DEFINITION,
      description: "Location adjacent to a field definition."
    },
    ARGUMENT_DEFINITION: {
      value: A.ARGUMENT_DEFINITION,
      description: "Location adjacent to an argument definition."
    },
    INTERFACE: {
      value: A.INTERFACE,
      description: "Location adjacent to an interface definition."
    },
    UNION: {
      value: A.UNION,
      description: "Location adjacent to a union definition."
    },
    ENUM: {
      value: A.ENUM,
      description: "Location adjacent to an enum definition."
    },
    ENUM_VALUE: {
      value: A.ENUM_VALUE,
      description: "Location adjacent to an enum value definition."
    },
    INPUT_OBJECT: {
      value: A.INPUT_OBJECT,
      description: "Location adjacent to an input object type definition."
    },
    INPUT_FIELD_DEFINITION: {
      value: A.INPUT_FIELD_DEFINITION,
      description: "Location adjacent to an input object field definition."
    }
  }
}), et = new De({
  name: "__Type",
  description: "The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.\n\nDepending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByURL`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.",
  fields: () => ({
    kind: {
      type: new F(Ml),
      resolve(e) {
        if (Ae(e))
          return pe.SCALAR;
        if ($(e))
          return pe.OBJECT;
        if (q(e))
          return pe.INTERFACE;
        if (de(e))
          return pe.UNION;
        if (ie(e))
          return pe.ENUM;
        if (G(e))
          return pe.INPUT_OBJECT;
        if (Q(e))
          return pe.LIST;
        if (M(e))
          return pe.NON_NULL;
        Pe(!1, `Unexpected type: "${w(e)}".`);
      }
    },
    name: {
      type: te,
      resolve: (e) => "name" in e ? e.name : void 0
    },
    description: {
      type: te,
      resolve: (e) => (
        /* c8 ignore next */
        "description" in e ? e.description : void 0
      )
    },
    specifiedByURL: {
      type: te,
      resolve: (e) => "specifiedByURL" in e ? e.specifiedByURL : void 0
    },
    fields: {
      type: new ve(new F(Pl)),
      args: {
        includeDeprecated: {
          type: Ee,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        if ($(e) || q(e)) {
          const n = Object.values(e.getFields());
          return t ? n : n.filter((r) => r.deprecationReason == null);
        }
      }
    },
    interfaces: {
      type: new ve(new F(et)),
      resolve(e) {
        if ($(e) || q(e))
          return e.getInterfaces();
      }
    },
    possibleTypes: {
      type: new ve(new F(et)),
      resolve(e, t, n, { schema: r }) {
        if (wt(e))
          return r.getPossibleTypes(e);
      }
    },
    enumValues: {
      type: new ve(new F($l)),
      args: {
        includeDeprecated: {
          type: Ee,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        if (ie(e)) {
          const n = e.getValues();
          return t ? n : n.filter((r) => r.deprecationReason == null);
        }
      }
    },
    inputFields: {
      type: new ve(new F(Ws)),
      args: {
        includeDeprecated: {
          type: Ee,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        if (G(e)) {
          const n = Object.values(e.getFields());
          return t ? n : n.filter((r) => r.deprecationReason == null);
        }
      }
    },
    ofType: {
      type: et,
      resolve: (e) => "ofType" in e ? e.ofType : void 0
    },
    isOneOf: {
      type: Ee,
      resolve: (e) => {
        if (G(e))
          return e.isOneOf;
      }
    }
  })
}), Pl = new De({
  name: "__Field",
  description: "Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.",
  fields: () => ({
    name: {
      type: new F(te),
      resolve: (e) => e.name
    },
    description: {
      type: te,
      resolve: (e) => e.description
    },
    args: {
      type: new F(
        new ve(new F(Ws))
      ),
      args: {
        includeDeprecated: {
          type: Ee,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        return t ? e.args : e.args.filter((n) => n.deprecationReason == null);
      }
    },
    type: {
      type: new F(et),
      resolve: (e) => e.type
    },
    isDeprecated: {
      type: new F(Ee),
      resolve: (e) => e.deprecationReason != null
    },
    deprecationReason: {
      type: te,
      resolve: (e) => e.deprecationReason
    }
  })
}), Ws = new De({
  name: "__InputValue",
  description: "Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.",
  fields: () => ({
    name: {
      type: new F(te),
      resolve: (e) => e.name
    },
    description: {
      type: te,
      resolve: (e) => e.description
    },
    type: {
      type: new F(et),
      resolve: (e) => e.type
    },
    defaultValue: {
      type: te,
      description: "A GraphQL-formatted string representing the default value for this input value.",
      resolve(e) {
        const { type: t, defaultValue: n } = e, r = or(n, t);
        return r ? le(r) : null;
      }
    },
    isDeprecated: {
      type: new F(Ee),
      resolve: (e) => e.deprecationReason != null
    },
    deprecationReason: {
      type: te,
      resolve: (e) => e.deprecationReason
    }
  })
}), $l = new De({
  name: "__EnumValue",
  description: "One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.",
  fields: () => ({
    name: {
      type: new F(te),
      resolve: (e) => e.name
    },
    description: {
      type: te,
      resolve: (e) => e.description
    },
    isDeprecated: {
      type: new F(Ee),
      resolve: (e) => e.deprecationReason != null
    },
    deprecationReason: {
      type: te,
      resolve: (e) => e.deprecationReason
    }
  })
});
var pe;
(function(e) {
  e.SCALAR = "SCALAR", e.OBJECT = "OBJECT", e.INTERFACE = "INTERFACE", e.UNION = "UNION", e.ENUM = "ENUM", e.INPUT_OBJECT = "INPUT_OBJECT", e.LIST = "LIST", e.NON_NULL = "NON_NULL";
})(pe || (pe = {}));
const Ml = new pt({
  name: "__TypeKind",
  description: "An enum describing what kind of type a given `__Type` is.",
  values: {
    SCALAR: {
      value: pe.SCALAR,
      description: "Indicates this type is a scalar."
    },
    OBJECT: {
      value: pe.OBJECT,
      description: "Indicates this type is an object. `fields` and `interfaces` are valid fields."
    },
    INTERFACE: {
      value: pe.INTERFACE,
      description: "Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields."
    },
    UNION: {
      value: pe.UNION,
      description: "Indicates this type is a union. `possibleTypes` is a valid field."
    },
    ENUM: {
      value: pe.ENUM,
      description: "Indicates this type is an enum. `enumValues` is a valid field."
    },
    INPUT_OBJECT: {
      value: pe.INPUT_OBJECT,
      description: "Indicates this type is an input object. `inputFields` is a valid field."
    },
    LIST: {
      value: pe.LIST,
      description: "Indicates this type is a list. `ofType` is a valid field."
    },
    NON_NULL: {
      value: pe.NON_NULL,
      description: "Indicates this type is a non-null. `ofType` is a valid field."
    }
  }
}), vs = {
  name: "__schema",
  type: new F(Na),
  description: "Access the current type schema of this server.",
  args: [],
  resolve: (e, t, n, { schema: r }) => r,
  deprecationReason: void 0,
  extensions: /* @__PURE__ */ Object.create(null),
  astNode: void 0
}, bs = {
  name: "__type",
  type: et,
  description: "Request the type information of a single type.",
  args: [
    {
      name: "name",
      description: void 0,
      type: new F(te),
      defaultValue: void 0,
      deprecationReason: void 0,
      extensions: /* @__PURE__ */ Object.create(null),
      astNode: void 0
    }
  ],
  resolve: (e, { name: t }, n, { schema: r }) => r.getType(t),
  deprecationReason: void 0,
  extensions: /* @__PURE__ */ Object.create(null),
  astNode: void 0
}, ks = {
  name: "__typename",
  type: new F(te),
  description: "The name of the current Object type at runtime.",
  args: [],
  resolve: (e, t, n, { parentType: r }) => r.name,
  deprecationReason: void 0,
  extensions: /* @__PURE__ */ Object.create(null),
  astNode: void 0
}, _a = Object.freeze([
  Na,
  Ll,
  jl,
  et,
  Pl,
  Ws,
  $l,
  Ml
]);
function Oa(e) {
  return _a.some(({ name: t }) => e.name === t);
}
function Da(e) {
  return nt(e, Js);
}
function Fl(e) {
  if (!Da(e))
    throw new Error(`Expected ${w(e)} to be a GraphQL schema.`);
  return e;
}
class Js {
  // Used as a cache for validateSchema().
  constructor(t) {
    var n, r;
    this.__validationErrors = t.assumeValid === !0 ? [] : void 0, tt(t) || z(!1, "Must provide configuration object."), !t.types || Array.isArray(t.types) || z(
      !1,
      `"types" must be Array if provided but got: ${w(t.types)}.`
    ), !t.directives || Array.isArray(t.directives) || z(
      !1,
      `"directives" must be Array if provided but got: ${w(t.directives)}.`
    ), this.description = t.description, this.extensions = Ze(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._queryType = t.query, this._mutationType = t.mutation, this._subscriptionType = t.subscription, this._directives = (r = t.directives) !== null && r !== void 0 ? r : Gt;
    const s = new Set(t.types);
    if (t.types != null)
      for (const i of t.types)
        s.delete(i), Xe(i, s);
    this._queryType != null && Xe(this._queryType, s), this._mutationType != null && Xe(this._mutationType, s), this._subscriptionType != null && Xe(this._subscriptionType, s);
    for (const i of this._directives)
      if (xa(i))
        for (const a of i.args)
          Xe(a.type, s);
    Xe(Na, s), this._typeMap = /* @__PURE__ */ Object.create(null), this._subTypeMap = /* @__PURE__ */ Object.create(null), this._implementationsMap = /* @__PURE__ */ Object.create(null);
    for (const i of s) {
      if (i == null)
        continue;
      const a = i.name;
      if (a || z(
        !1,
        "One of the provided types for building the Schema is missing a name."
      ), this._typeMap[a] !== void 0)
        throw new Error(
          `Schema must contain uniquely named types but contains multiple types named "${a}".`
        );
      if (this._typeMap[a] = i, q(i)) {
        for (const o of i.getInterfaces())
          if (q(o)) {
            let c = this._implementationsMap[o.name];
            c === void 0 && (c = this._implementationsMap[o.name] = {
              objects: [],
              interfaces: []
            }), c.interfaces.push(i);
          }
      } else if ($(i)) {
        for (const o of i.getInterfaces())
          if (q(o)) {
            let c = this._implementationsMap[o.name];
            c === void 0 && (c = this._implementationsMap[o.name] = {
              objects: [],
              interfaces: []
            }), c.objects.push(i);
          }
      }
    }
  }
  get [Symbol.toStringTag]() {
    return "GraphQLSchema";
  }
  getQueryType() {
    return this._queryType;
  }
  getMutationType() {
    return this._mutationType;
  }
  getSubscriptionType() {
    return this._subscriptionType;
  }
  getRootType(t) {
    switch (t) {
      case me.QUERY:
        return this.getQueryType();
      case me.MUTATION:
        return this.getMutationType();
      case me.SUBSCRIPTION:
        return this.getSubscriptionType();
    }
  }
  getTypeMap() {
    return this._typeMap;
  }
  getType(t) {
    return this.getTypeMap()[t];
  }
  getPossibleTypes(t) {
    return de(t) ? t.getTypes() : this.getImplementations(t).objects;
  }
  getImplementations(t) {
    const n = this._implementationsMap[t.name];
    return n ?? {
      objects: [],
      interfaces: []
    };
  }
  isSubType(t, n) {
    let r = this._subTypeMap[t.name];
    if (r === void 0) {
      if (r = /* @__PURE__ */ Object.create(null), de(t))
        for (const s of t.getTypes())
          r[s.name] = !0;
      else {
        const s = this.getImplementations(t);
        for (const i of s.objects)
          r[i.name] = !0;
        for (const i of s.interfaces)
          r[i.name] = !0;
      }
      this._subTypeMap[t.name] = r;
    }
    return r[n.name] !== void 0;
  }
  getDirectives() {
    return this._directives;
  }
  getDirective(t) {
    return this.getDirectives().find((n) => n.name === t);
  }
  toConfig() {
    return {
      description: this.description,
      query: this.getQueryType(),
      mutation: this.getMutationType(),
      subscription: this.getSubscriptionType(),
      types: Object.values(this.getTypeMap()),
      directives: this.getDirectives(),
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
      assumeValid: this.__validationErrors !== void 0
    };
  }
}
function Xe(e, t) {
  const n = _e(e);
  if (!t.has(n)) {
    if (t.add(n), de(n))
      for (const r of n.getTypes())
        Xe(r, t);
    else if ($(n) || q(n)) {
      for (const r of n.getInterfaces())
        Xe(r, t);
      for (const r of Object.values(n.getFields())) {
        Xe(r.type, t);
        for (const s of r.args)
          Xe(s.type, t);
      }
    } else if (G(n))
      for (const r of Object.values(n.getFields()))
        Xe(r.type, t);
  }
  return t;
}
function dg(e) {
  if (Fl(e), e.__validationErrors)
    return e.__validationErrors;
  const t = new fg(e);
  pg(t), hg(t), mg(t);
  const n = t.getErrors();
  return e.__validationErrors = n, n;
}
function Ul(e) {
  const t = dg(e);
  if (t.length !== 0)
    throw new Error(t.map((n) => n.message).join(`

`));
}
class fg {
  constructor(t) {
    this._errors = [], this.schema = t;
  }
  reportError(t, n) {
    const r = Array.isArray(n) ? n.filter(Boolean) : n;
    this._errors.push(
      new v(t, {
        nodes: r
      })
    );
  }
  getErrors() {
    return this._errors;
  }
}
function pg(e) {
  const t = e.schema, n = t.getQueryType();
  if (!n)
    e.reportError("Query root type must be provided.", t.astNode);
  else if (!$(n)) {
    var r;
    e.reportError(
      `Query root type must be Object type, it cannot be ${w(
        n
      )}.`,
      (r = vi(
        t,
        me.QUERY
      )) !== null && r !== void 0 ? r : n.astNode
    );
  }
  const s = t.getMutationType();
  if (s && !$(s)) {
    var i;
    e.reportError(
      `Mutation root type must be Object type if provided, it cannot be ${w(s)}.`,
      (i = vi(
        t,
        me.MUTATION
      )) !== null && i !== void 0 ? i : s.astNode
    );
  }
  const a = t.getSubscriptionType();
  if (a && !$(a)) {
    var o;
    e.reportError(
      `Subscription root type must be Object type if provided, it cannot be ${w(a)}.`,
      (o = vi(
        t,
        me.SUBSCRIPTION
      )) !== null && o !== void 0 ? o : a.astNode
    );
  }
}
function vi(e, t) {
  var n;
  return (n = [e.astNode, ...e.extensionASTNodes].flatMap(
    // FIXME: https://github.com/graphql/graphql-js/issues/2203
    (r) => {
      var s;
      return (
        /* c8 ignore next */
        (s = r == null ? void 0 : r.operationTypes) !== null && s !== void 0 ? s : []
      );
    }
  ).find((r) => r.operation === t)) === null || n === void 0 ? void 0 : n.type;
}
function hg(e) {
  for (const n of e.schema.getDirectives()) {
    if (!xa(n)) {
      e.reportError(
        `Expected directive but got: ${w(n)}.`,
        n == null ? void 0 : n.astNode
      );
      continue;
    }
    ln(e, n), n.locations.length === 0 && e.reportError(
      `Directive @${n.name} must include 1 or more locations.`,
      n.astNode
    );
    for (const r of n.args)
      if (ln(e, r), Be(r.type) || e.reportError(
        `The type of @${n.name}(${r.name}:) must be Input Type but got: ${w(r.type)}.`,
        r.astNode
      ), Rr(r) && r.deprecationReason != null) {
        var t;
        e.reportError(
          `Required argument @${n.name}(${r.name}:) cannot be deprecated.`,
          [
            Aa(r.astNode),
            (t = r.astNode) === null || t === void 0 ? void 0 : t.type
          ]
        );
      }
  }
}
function ln(e, t) {
  t.name.startsWith("__") && e.reportError(
    `Name "${t.name}" must not begin with "__", which is reserved by GraphQL introspection.`,
    t.astNode
  );
}
function mg(e) {
  const t = Tg(e), n = e.schema.getTypeMap();
  for (const r of Object.values(n)) {
    if (!Cr(r)) {
      e.reportError(
        `Expected GraphQL named type but got: ${w(r)}.`,
        r.astNode
      );
      continue;
    }
    Oa(r) || ln(e, r), $(r) || q(r) ? (Zo(e, r), Go(e, r)) : de(r) ? vg(e, r) : ie(r) ? bg(e, r) : G(r) && (kg(e, r), t(r));
  }
}
function Zo(e, t) {
  const n = Object.values(t.getFields());
  n.length === 0 && e.reportError(`Type ${t.name} must define one or more fields.`, [
    t.astNode,
    ...t.extensionASTNodes
  ]);
  for (const a of n) {
    if (ln(e, a), !Dn(a.type)) {
      var r;
      e.reportError(
        `The type of ${t.name}.${a.name} must be Output Type but got: ${w(a.type)}.`,
        (r = a.astNode) === null || r === void 0 ? void 0 : r.type
      );
    }
    for (const o of a.args) {
      const c = o.name;
      if (ln(e, o), !Be(o.type)) {
        var s;
        e.reportError(
          `The type of ${t.name}.${a.name}(${c}:) must be Input Type but got: ${w(o.type)}.`,
          (s = o.astNode) === null || s === void 0 ? void 0 : s.type
        );
      }
      if (Rr(o) && o.deprecationReason != null) {
        var i;
        e.reportError(
          `Required argument ${t.name}.${a.name}(${c}:) cannot be deprecated.`,
          [
            Aa(o.astNode),
            (i = o.astNode) === null || i === void 0 ? void 0 : i.type
          ]
        );
      }
    }
  }
}
function Go(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const r of t.getInterfaces()) {
    if (!q(r)) {
      e.reportError(
        `Type ${w(t)} must only implement Interface types, it cannot implement ${w(r)}.`,
        pr(t, r)
      );
      continue;
    }
    if (t === r) {
      e.reportError(
        `Type ${t.name} cannot implement itself because it would create a circular reference.`,
        pr(t, r)
      );
      continue;
    }
    if (n[r.name]) {
      e.reportError(
        `Type ${t.name} can only implement ${r.name} once.`,
        pr(t, r)
      );
      continue;
    }
    n[r.name] = !0, yg(e, t, r), gg(e, t, r);
  }
}
function gg(e, t, n) {
  const r = t.getFields();
  for (const c of Object.values(n.getFields())) {
    const u = c.name, l = r[u];
    if (!l) {
      e.reportError(
        `Interface field ${n.name}.${u} expected but ${t.name} does not provide it.`,
        [c.astNode, t.astNode, ...t.extensionASTNodes]
      );
      continue;
    }
    if (!Cn(e.schema, l.type, c.type)) {
      var s, i;
      e.reportError(
        `Interface field ${n.name}.${u} expects type ${w(c.type)} but ${t.name}.${u} is type ${w(l.type)}.`,
        [
          (s = c.astNode) === null || s === void 0 ? void 0 : s.type,
          (i = l.astNode) === null || i === void 0 ? void 0 : i.type
        ]
      );
    }
    for (const d of c.args) {
      const p = d.name, h = l.args.find((m) => m.name === p);
      if (!h) {
        e.reportError(
          `Interface field argument ${n.name}.${u}(${p}:) expected but ${t.name}.${u} does not provide it.`,
          [d.astNode, l.astNode]
        );
        continue;
      }
      if (!qi(d.type, h.type)) {
        var a, o;
        e.reportError(
          `Interface field argument ${n.name}.${u}(${p}:) expects type ${w(d.type)} but ${t.name}.${u}(${p}:) is type ${w(h.type)}.`,
          [
            (a = d.astNode) === null || a === void 0 ? void 0 : a.type,
            (o = h.astNode) === null || o === void 0 ? void 0 : o.type
          ]
        );
      }
    }
    for (const d of l.args) {
      const p = d.name;
      !c.args.find((m) => m.name === p) && Rr(d) && e.reportError(
        `Object field ${t.name}.${u} includes required argument ${p} that is missing from the Interface field ${n.name}.${u}.`,
        [d.astNode, c.astNode]
      );
    }
  }
}
function yg(e, t, n) {
  const r = t.getInterfaces();
  for (const s of n.getInterfaces())
    r.includes(s) || e.reportError(
      s === t ? `Type ${t.name} cannot implement ${n.name} because it would create a circular reference.` : `Type ${t.name} must implement ${s.name} because it is implemented by ${n.name}.`,
      [
        ...pr(n, s),
        ...pr(t, n)
      ]
    );
}
function vg(e, t) {
  const n = t.getTypes();
  n.length === 0 && e.reportError(
    `Union type ${t.name} must define one or more member types.`,
    [t.astNode, ...t.extensionASTNodes]
  );
  const r = /* @__PURE__ */ Object.create(null);
  for (const s of n) {
    if (r[s.name]) {
      e.reportError(
        `Union type ${t.name} can only include type ${s.name} once.`,
        Wo(t, s.name)
      );
      continue;
    }
    r[s.name] = !0, $(s) || e.reportError(
      `Union type ${t.name} can only include Object types, it cannot include ${w(s)}.`,
      Wo(t, String(s))
    );
  }
}
function bg(e, t) {
  const n = t.getValues();
  n.length === 0 && e.reportError(
    `Enum type ${t.name} must define one or more values.`,
    [t.astNode, ...t.extensionASTNodes]
  );
  for (const r of n)
    ln(e, r);
}
function kg(e, t) {
  const n = Object.values(t.getFields());
  n.length === 0 && e.reportError(
    `Input Object type ${t.name} must define one or more fields.`,
    [t.astNode, ...t.extensionASTNodes]
  );
  for (const i of n) {
    if (ln(e, i), !Be(i.type)) {
      var r;
      e.reportError(
        `The type of ${t.name}.${i.name} must be Input Type but got: ${w(i.type)}.`,
        (r = i.astNode) === null || r === void 0 ? void 0 : r.type
      );
    }
    if (_l(i) && i.deprecationReason != null) {
      var s;
      e.reportError(
        `Required input field ${t.name}.${i.name} cannot be deprecated.`,
        [
          Aa(i.astNode),
          (s = i.astNode) === null || s === void 0 ? void 0 : s.type
        ]
      );
    }
    t.isOneOf && wg(t, i, e);
  }
}
function wg(e, t, n) {
  if (M(t.type)) {
    var r;
    n.reportError(
      `OneOf input field ${e.name}.${t.name} must be nullable.`,
      (r = t.astNode) === null || r === void 0 ? void 0 : r.type
    );
  }
  t.defaultValue !== void 0 && n.reportError(
    `OneOf input field ${e.name}.${t.name} cannot have a default value.`,
    t.astNode
  );
}
function Tg(e) {
  const t = /* @__PURE__ */ Object.create(null), n = [], r = /* @__PURE__ */ Object.create(null);
  return s;
  function s(i) {
    if (t[i.name])
      return;
    t[i.name] = !0, r[i.name] = n.length;
    const a = Object.values(i.getFields());
    for (const o of a)
      if (M(o.type) && G(o.type.ofType)) {
        const c = o.type.ofType, u = r[c.name];
        if (n.push(o), u === void 0)
          s(c);
        else {
          const l = n.slice(u), d = l.map((p) => p.name).join(".");
          e.reportError(
            `Cannot reference Input Object "${c.name}" within itself through a series of non-null fields: "${d}".`,
            l.map((p) => p.astNode)
          );
        }
        n.pop();
      }
    r[i.name] = void 0;
  }
}
function pr(e, t) {
  const { astNode: n, extensionASTNodes: r } = e;
  return (n != null ? [n, ...r] : r).flatMap((i) => {
    var a;
    return (
      /* c8 ignore next */
      (a = i.interfaces) !== null && a !== void 0 ? a : []
    );
  }).filter((i) => i.name.value === t.name);
}
function Wo(e, t) {
  const { astNode: n, extensionASTNodes: r } = e;
  return (n != null ? [n, ...r] : r).flatMap((i) => {
    var a;
    return (
      /* c8 ignore next */
      (a = i.types) !== null && a !== void 0 ? a : []
    );
  }).filter((i) => i.name.value === t);
}
function Aa(e) {
  var t;
  return e == null || (t = e.directives) === null || t === void 0 ? void 0 : t.find(
    (n) => n.name.value === Gs.name
  );
}
function Me(e, t) {
  switch (t.kind) {
    case f.LIST_TYPE: {
      const n = Me(e, t.type);
      return n && new ve(n);
    }
    case f.NON_NULL_TYPE: {
      const n = Me(e, t.type);
      return n && new F(n);
    }
    case f.NAMED_TYPE:
      return e.getType(t.name.value);
  }
}
class zl {
  constructor(t, n, r) {
    this._schema = t, this._typeStack = [], this._parentTypeStack = [], this._inputTypeStack = [], this._fieldDefStack = [], this._defaultValueStack = [], this._directive = null, this._argument = null, this._enumValue = null, this._getFieldDef = r ?? Eg, n && (Be(n) && this._inputTypeStack.push(n), It(n) && this._parentTypeStack.push(n), Dn(n) && this._typeStack.push(n));
  }
  get [Symbol.toStringTag]() {
    return "TypeInfo";
  }
  getType() {
    if (this._typeStack.length > 0)
      return this._typeStack[this._typeStack.length - 1];
  }
  getParentType() {
    if (this._parentTypeStack.length > 0)
      return this._parentTypeStack[this._parentTypeStack.length - 1];
  }
  getInputType() {
    if (this._inputTypeStack.length > 0)
      return this._inputTypeStack[this._inputTypeStack.length - 1];
  }
  getParentInputType() {
    if (this._inputTypeStack.length > 1)
      return this._inputTypeStack[this._inputTypeStack.length - 2];
  }
  getFieldDef() {
    if (this._fieldDefStack.length > 0)
      return this._fieldDefStack[this._fieldDefStack.length - 1];
  }
  getDefaultValue() {
    if (this._defaultValueStack.length > 0)
      return this._defaultValueStack[this._defaultValueStack.length - 1];
  }
  getDirective() {
    return this._directive;
  }
  getArgument() {
    return this._argument;
  }
  getEnumValue() {
    return this._enumValue;
  }
  enter(t) {
    const n = this._schema;
    switch (t.kind) {
      case f.SELECTION_SET: {
        const s = _e(this.getType());
        this._parentTypeStack.push(
          It(s) ? s : void 0
        );
        break;
      }
      case f.FIELD: {
        const s = this.getParentType();
        let i, a;
        s && (i = this._getFieldDef(n, s, t), i && (a = i.type)), this._fieldDefStack.push(i), this._typeStack.push(Dn(a) ? a : void 0);
        break;
      }
      case f.DIRECTIVE:
        this._directive = n.getDirective(t.name.value);
        break;
      case f.OPERATION_DEFINITION: {
        const s = n.getRootType(t.operation);
        this._typeStack.push($(s) ? s : void 0);
        break;
      }
      case f.INLINE_FRAGMENT:
      case f.FRAGMENT_DEFINITION: {
        const s = t.typeCondition, i = s ? Me(n, s) : _e(this.getType());
        this._typeStack.push(Dn(i) ? i : void 0);
        break;
      }
      case f.VARIABLE_DEFINITION: {
        const s = Me(n, t.type);
        this._inputTypeStack.push(
          Be(s) ? s : void 0
        );
        break;
      }
      case f.ARGUMENT: {
        var r;
        let s, i;
        const a = (r = this.getDirective()) !== null && r !== void 0 ? r : this.getFieldDef();
        a && (s = a.args.find(
          (o) => o.name === t.name.value
        ), s && (i = s.type)), this._argument = s, this._defaultValueStack.push(s ? s.defaultValue : void 0), this._inputTypeStack.push(Be(i) ? i : void 0);
        break;
      }
      case f.LIST: {
        const s = Ea(this.getInputType()), i = Q(s) ? s.ofType : s;
        this._defaultValueStack.push(void 0), this._inputTypeStack.push(Be(i) ? i : void 0);
        break;
      }
      case f.OBJECT_FIELD: {
        const s = _e(this.getInputType());
        let i, a;
        G(s) && (a = s.getFields()[t.name.value], a && (i = a.type)), this._defaultValueStack.push(
          a ? a.defaultValue : void 0
        ), this._inputTypeStack.push(
          Be(i) ? i : void 0
        );
        break;
      }
      case f.ENUM: {
        const s = _e(this.getInputType());
        let i;
        ie(s) && (i = s.getValue(t.value)), this._enumValue = i;
        break;
      }
    }
  }
  leave(t) {
    switch (t.kind) {
      case f.SELECTION_SET:
        this._parentTypeStack.pop();
        break;
      case f.FIELD:
        this._fieldDefStack.pop(), this._typeStack.pop();
        break;
      case f.DIRECTIVE:
        this._directive = null;
        break;
      case f.OPERATION_DEFINITION:
      case f.INLINE_FRAGMENT:
      case f.FRAGMENT_DEFINITION:
        this._typeStack.pop();
        break;
      case f.VARIABLE_DEFINITION:
        this._inputTypeStack.pop();
        break;
      case f.ARGUMENT:
        this._argument = null, this._defaultValueStack.pop(), this._inputTypeStack.pop();
        break;
      case f.LIST:
      case f.OBJECT_FIELD:
        this._defaultValueStack.pop(), this._inputTypeStack.pop();
        break;
      case f.ENUM:
        this._enumValue = null;
        break;
    }
  }
}
function Eg(e, t, n) {
  const r = n.name.value;
  if (r === vs.name && e.getQueryType() === t)
    return vs;
  if (r === bs.name && e.getQueryType() === t)
    return bs;
  if (r === ks.name && It(t))
    return ks;
  if ($(t) || q(t))
    return t.getFields()[r];
}
function ql(e, t) {
  return {
    enter(...n) {
      const r = n[0];
      e.enter(r);
      const s = wr(t, r.kind).enter;
      if (s) {
        const i = s.apply(t, n);
        return i !== void 0 && (e.leave(r), Fi(i) && e.enter(i)), i;
      }
    },
    leave(...n) {
      const r = n[0], s = wr(t, r.kind).leave;
      let i;
      return s && (i = s.apply(t, n)), e.leave(r), i;
    }
  };
}
function Ig(e) {
  return Vl(e) || Bl(e) || Hl(e);
}
function Vl(e) {
  return e.kind === f.OPERATION_DEFINITION || e.kind === f.FRAGMENT_DEFINITION;
}
function lw(e) {
  return e.kind === f.FIELD || e.kind === f.FRAGMENT_SPREAD || e.kind === f.INLINE_FRAGMENT;
}
function xg(e) {
  return e.kind === f.VARIABLE || e.kind === f.INT || e.kind === f.FLOAT || e.kind === f.STRING || e.kind === f.BOOLEAN || e.kind === f.NULL || e.kind === f.ENUM || e.kind === f.LIST || e.kind === f.OBJECT;
}
function Jo(e) {
  return xg(e) && (e.kind === f.LIST ? e.values.some(Jo) : e.kind === f.OBJECT ? e.fields.some((t) => Jo(t.value)) : e.kind !== f.VARIABLE);
}
function dw(e) {
  return e.kind === f.NAMED_TYPE || e.kind === f.LIST_TYPE || e.kind === f.NON_NULL_TYPE;
}
function Bl(e) {
  return e.kind === f.SCHEMA_DEFINITION || Pr(e) || e.kind === f.DIRECTIVE_DEFINITION;
}
function Pr(e) {
  return e.kind === f.SCALAR_TYPE_DEFINITION || e.kind === f.OBJECT_TYPE_DEFINITION || e.kind === f.INTERFACE_TYPE_DEFINITION || e.kind === f.UNION_TYPE_DEFINITION || e.kind === f.ENUM_TYPE_DEFINITION || e.kind === f.INPUT_OBJECT_TYPE_DEFINITION;
}
function Hl(e) {
  return e.kind === f.SCHEMA_EXTENSION || Ca(e);
}
function Ca(e) {
  return e.kind === f.SCALAR_TYPE_EXTENSION || e.kind === f.OBJECT_TYPE_EXTENSION || e.kind === f.INTERFACE_TYPE_EXTENSION || e.kind === f.UNION_TYPE_EXTENSION || e.kind === f.ENUM_TYPE_EXTENSION || e.kind === f.INPUT_OBJECT_TYPE_EXTENSION;
}
function Sg(e) {
  return {
    Document(t) {
      for (const n of t.definitions)
        if (!Vl(n)) {
          const r = n.kind === f.SCHEMA_DEFINITION || n.kind === f.SCHEMA_EXTENSION ? "schema" : '"' + n.name.value + '"';
          e.reportError(
            new v(`The ${r} definition is not executable.`, {
              nodes: n
            })
          );
        }
      return !1;
    }
  };
}
function Ng(e) {
  return {
    Field(t) {
      const n = e.getParentType();
      if (n && !e.getFieldDef()) {
        const s = e.getSchema(), i = t.name.value;
        let a = Et(
          "to use an inline fragment on",
          _g(s, n, i)
        );
        a === "" && (a = Et(Og(n, i))), e.reportError(
          new v(
            `Cannot query field "${i}" on type "${n.name}".` + a,
            {
              nodes: t
            }
          )
        );
      }
    }
  };
}
function _g(e, t, n) {
  if (!wt(t))
    return [];
  const r = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ Object.create(null);
  for (const a of e.getPossibleTypes(t))
    if (a.getFields()[n]) {
      r.add(a), s[a.name] = 1;
      for (const o of a.getInterfaces()) {
        var i;
        o.getFields()[n] && (r.add(o), s[o.name] = ((i = s[o.name]) !== null && i !== void 0 ? i : 0) + 1);
      }
    }
  return [...r].sort((a, o) => {
    const c = s[o.name] - s[a.name];
    return c !== 0 ? c : q(a) && e.isSubType(a, o) ? -1 : q(o) && e.isSubType(o, a) ? 1 : wa(a.name, o.name);
  }).map((a) => a.name);
}
function Og(e, t) {
  if ($(e) || q(e)) {
    const n = Object.keys(e.getFields());
    return Zt(t, n);
  }
  return [];
}
function Dg(e) {
  return {
    InlineFragment(t) {
      const n = t.typeCondition;
      if (n) {
        const r = Me(e.getSchema(), n);
        if (r && !It(r)) {
          const s = le(n);
          e.reportError(
            new v(
              `Fragment cannot condition on non composite type "${s}".`,
              {
                nodes: n
              }
            )
          );
        }
      }
    },
    FragmentDefinition(t) {
      const n = Me(e.getSchema(), t.typeCondition);
      if (n && !It(n)) {
        const r = le(t.typeCondition);
        e.reportError(
          new v(
            `Fragment "${t.name.value}" cannot condition on non composite type "${r}".`,
            {
              nodes: t.typeCondition
            }
          )
        );
      }
    }
  };
}
function Ag(e) {
  return {
    // eslint-disable-next-line new-cap
    ...Zl(e),
    Argument(t) {
      const n = e.getArgument(), r = e.getFieldDef(), s = e.getParentType();
      if (!n && r && s) {
        const i = t.name.value, a = r.args.map((c) => c.name), o = Zt(i, a);
        e.reportError(
          new v(
            `Unknown argument "${i}" on field "${s.name}.${r.name}".` + Et(o),
            {
              nodes: t
            }
          )
        );
      }
    }
  };
}
function Zl(e) {
  const t = /* @__PURE__ */ Object.create(null), n = e.getSchema(), r = n ? n.getDirectives() : Gt;
  for (const a of r)
    t[a.name] = a.args.map((o) => o.name);
  const s = e.getDocument().definitions;
  for (const a of s)
    if (a.kind === f.DIRECTIVE_DEFINITION) {
      var i;
      const o = (i = a.arguments) !== null && i !== void 0 ? i : [];
      t[a.name.value] = o.map((c) => c.name.value);
    }
  return {
    Directive(a) {
      const o = a.name.value, c = t[o];
      if (a.arguments && c)
        for (const u of a.arguments) {
          const l = u.name.value;
          if (!c.includes(l)) {
            const d = Zt(l, c);
            e.reportError(
              new v(
                `Unknown argument "${l}" on directive "@${o}".` + Et(d),
                {
                  nodes: u
                }
              )
            );
          }
        }
      return !1;
    }
  };
}
function Gl(e) {
  const t = /* @__PURE__ */ Object.create(null), n = e.getSchema(), r = n ? n.getDirectives() : Gt;
  for (const i of r)
    t[i.name] = i.locations;
  const s = e.getDocument().definitions;
  for (const i of s)
    i.kind === f.DIRECTIVE_DEFINITION && (t[i.name.value] = i.locations.map((a) => a.value));
  return {
    Directive(i, a, o, c, u) {
      const l = i.name.value, d = t[l];
      if (!d) {
        e.reportError(
          new v(`Unknown directive "@${l}".`, {
            nodes: i
          })
        );
        return;
      }
      const p = Cg(u);
      p && !d.includes(p) && e.reportError(
        new v(
          `Directive "@${l}" may not be used on ${p}.`,
          {
            nodes: i
          }
        )
      );
    }
  };
}
function Cg(e) {
  const t = e[e.length - 1];
  switch ("kind" in t || Pe(!1), t.kind) {
    case f.OPERATION_DEFINITION:
      return Rg(t.operation);
    case f.FIELD:
      return A.FIELD;
    case f.FRAGMENT_SPREAD:
      return A.FRAGMENT_SPREAD;
    case f.INLINE_FRAGMENT:
      return A.INLINE_FRAGMENT;
    case f.FRAGMENT_DEFINITION:
      return A.FRAGMENT_DEFINITION;
    case f.VARIABLE_DEFINITION:
      return A.VARIABLE_DEFINITION;
    case f.SCHEMA_DEFINITION:
    case f.SCHEMA_EXTENSION:
      return A.SCHEMA;
    case f.SCALAR_TYPE_DEFINITION:
    case f.SCALAR_TYPE_EXTENSION:
      return A.SCALAR;
    case f.OBJECT_TYPE_DEFINITION:
    case f.OBJECT_TYPE_EXTENSION:
      return A.OBJECT;
    case f.FIELD_DEFINITION:
      return A.FIELD_DEFINITION;
    case f.INTERFACE_TYPE_DEFINITION:
    case f.INTERFACE_TYPE_EXTENSION:
      return A.INTERFACE;
    case f.UNION_TYPE_DEFINITION:
    case f.UNION_TYPE_EXTENSION:
      return A.UNION;
    case f.ENUM_TYPE_DEFINITION:
    case f.ENUM_TYPE_EXTENSION:
      return A.ENUM;
    case f.ENUM_VALUE_DEFINITION:
      return A.ENUM_VALUE;
    case f.INPUT_OBJECT_TYPE_DEFINITION:
    case f.INPUT_OBJECT_TYPE_EXTENSION:
      return A.INPUT_OBJECT;
    case f.INPUT_VALUE_DEFINITION: {
      const n = e[e.length - 3];
      return "kind" in n || Pe(!1), n.kind === f.INPUT_OBJECT_TYPE_DEFINITION ? A.INPUT_FIELD_DEFINITION : A.ARGUMENT_DEFINITION;
    }
    default:
      Pe(!1, "Unexpected kind: " + w(t.kind));
  }
}
function Rg(e) {
  switch (e) {
    case me.QUERY:
      return A.QUERY;
    case me.MUTATION:
      return A.MUTATION;
    case me.SUBSCRIPTION:
      return A.SUBSCRIPTION;
  }
}
function Lg(e) {
  return {
    FragmentSpread(t) {
      const n = t.name.value;
      e.getFragment(n) || e.reportError(
        new v(`Unknown fragment "${n}".`, {
          nodes: t.name
        })
      );
    }
  };
}
function Wl(e) {
  const t = e.getSchema(), n = t ? t.getTypeMap() : /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  for (const i of e.getDocument().definitions)
    Pr(i) && (r[i.name.value] = !0);
  const s = [
    ...Object.keys(n),
    ...Object.keys(r)
  ];
  return {
    NamedType(i, a, o, c, u) {
      const l = i.name.value;
      if (!n[l] && !r[l]) {
        var d;
        const p = (d = u[2]) !== null && d !== void 0 ? d : o, h = p != null && jg(p);
        if (h && Yo.includes(l))
          return;
        const m = Zt(
          l,
          h ? Yo.concat(s) : s
        );
        e.reportError(
          new v(
            `Unknown type "${l}".` + Et(m),
            {
              nodes: i
            }
          )
        );
      }
    }
  };
}
const Yo = [...Ia, ..._a].map(
  (e) => e.name
);
function jg(e) {
  return "kind" in e && (Bl(e) || Hl(e));
}
function Pg(e) {
  let t = 0;
  return {
    Document(n) {
      t = n.definitions.filter(
        (r) => r.kind === f.OPERATION_DEFINITION
      ).length;
    },
    OperationDefinition(n) {
      !n.name && t > 1 && e.reportError(
        new v(
          "This anonymous operation must be the only defined operation.",
          {
            nodes: n
          }
        )
      );
    }
  };
}
function $g(e) {
  var t, n, r;
  const s = e.getSchema(), i = (t = (n = (r = s == null ? void 0 : s.astNode) !== null && r !== void 0 ? r : s == null ? void 0 : s.getQueryType()) !== null && n !== void 0 ? n : s == null ? void 0 : s.getMutationType()) !== null && t !== void 0 ? t : s == null ? void 0 : s.getSubscriptionType();
  let a = 0;
  return {
    SchemaDefinition(o) {
      if (i) {
        e.reportError(
          new v(
            "Cannot define a new schema within a schema extension.",
            {
              nodes: o
            }
          )
        );
        return;
      }
      a > 0 && e.reportError(
        new v("Must provide only one schema definition.", {
          nodes: o
        })
      ), ++a;
    }
  };
}
const Mg = 3;
function Fg(e) {
  function t(n, r = /* @__PURE__ */ Object.create(null), s = 0) {
    if (n.kind === f.FRAGMENT_SPREAD) {
      const i = n.name.value;
      if (r[i] === !0)
        return !1;
      const a = e.getFragment(i);
      if (!a)
        return !1;
      try {
        return r[i] = !0, t(a, r, s);
      } finally {
        r[i] = void 0;
      }
    }
    if (n.kind === f.FIELD && // check all introspection lists
    (n.name.value === "fields" || n.name.value === "interfaces" || n.name.value === "possibleTypes" || n.name.value === "inputFields") && (s++, s >= Mg))
      return !0;
    if ("selectionSet" in n && n.selectionSet) {
      for (const i of n.selectionSet.selections)
        if (t(i, r, s))
          return !0;
    }
    return !1;
  }
  return {
    Field(n) {
      if ((n.name.value === "__schema" || n.name.value === "__type") && t(n))
        return e.reportError(
          new v("Maximum introspection depth exceeded", {
            nodes: [n]
          })
        ), !1;
    }
  };
}
function Ug(e) {
  const t = /* @__PURE__ */ Object.create(null), n = [], r = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition: () => !1,
    FragmentDefinition(i) {
      return s(i), !1;
    }
  };
  function s(i) {
    if (t[i.name.value])
      return;
    const a = i.name.value;
    t[a] = !0;
    const o = e.getFragmentSpreads(i.selectionSet);
    if (o.length !== 0) {
      r[a] = n.length;
      for (const c of o) {
        const u = c.name.value, l = r[u];
        if (n.push(c), l === void 0) {
          const d = e.getFragment(u);
          d && s(d);
        } else {
          const d = n.slice(l), p = d.slice(0, -1).map((h) => '"' + h.name.value + '"').join(", ");
          e.reportError(
            new v(
              `Cannot spread fragment "${u}" within itself` + (p !== "" ? ` via ${p}.` : "."),
              {
                nodes: d
              }
            )
          );
        }
        n.pop();
      }
      r[a] = void 0;
    }
  }
}
function zg(e) {
  let t = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition: {
      enter() {
        t = /* @__PURE__ */ Object.create(null);
      },
      leave(n) {
        const r = e.getRecursiveVariableUsages(n);
        for (const { node: s } of r) {
          const i = s.name.value;
          t[i] !== !0 && e.reportError(
            new v(
              n.name ? `Variable "$${i}" is not defined by operation "${n.name.value}".` : `Variable "$${i}" is not defined.`,
              {
                nodes: [s, n]
              }
            )
          );
        }
      }
    },
    VariableDefinition(n) {
      t[n.variable.name.value] = !0;
    }
  };
}
function qg(e) {
  const t = [], n = [];
  return {
    OperationDefinition(r) {
      return t.push(r), !1;
    },
    FragmentDefinition(r) {
      return n.push(r), !1;
    },
    Document: {
      leave() {
        const r = /* @__PURE__ */ Object.create(null);
        for (const s of t)
          for (const i of e.getRecursivelyReferencedFragments(
            s
          ))
            r[i.name.value] = !0;
        for (const s of n) {
          const i = s.name.value;
          r[i] !== !0 && e.reportError(
            new v(`Fragment "${i}" is never used.`, {
              nodes: s
            })
          );
        }
      }
    }
  };
}
function Vg(e) {
  let t = [];
  return {
    OperationDefinition: {
      enter() {
        t = [];
      },
      leave(n) {
        const r = /* @__PURE__ */ Object.create(null), s = e.getRecursiveVariableUsages(n);
        for (const { node: i } of s)
          r[i.name.value] = !0;
        for (const i of t) {
          const a = i.variable.name.value;
          r[a] !== !0 && e.reportError(
            new v(
              n.name ? `Variable "$${a}" is never used in operation "${n.name.value}".` : `Variable "$${a}" is never used.`,
              {
                nodes: i
              }
            )
          );
        }
      }
    },
    VariableDefinition(n) {
      t.push(n);
    }
  };
}
function Ra(e) {
  switch (e.kind) {
    case f.OBJECT:
      return { ...e, fields: Bg(e.fields) };
    case f.LIST:
      return { ...e, values: e.values.map(Ra) };
    case f.INT:
    case f.FLOAT:
    case f.STRING:
    case f.BOOLEAN:
    case f.NULL:
    case f.ENUM:
    case f.VARIABLE:
      return e;
  }
}
function Bg(e) {
  return e.map((t) => ({
    ...t,
    value: Ra(t.value)
  })).sort(
    (t, n) => wa(t.name.value, n.name.value)
  );
}
function Jl(e) {
  return Array.isArray(e) ? e.map(
    ([t, n]) => `subfields "${t}" conflict because ` + Jl(n)
  ).join(" and ") : e;
}
function Hg(e) {
  const t = new Xl(), n = new Qg(), r = /* @__PURE__ */ new Map();
  return {
    SelectionSet(s) {
      const i = Zg(
        e,
        r,
        t,
        n,
        e.getParentType(),
        s
      );
      for (const [[a, o], c, u] of i) {
        const l = Jl(o);
        e.reportError(
          new v(
            `Fields "${a}" conflict because ${l}. Use different aliases on the fields to fetch both if this was intentional.`,
            {
              nodes: c.concat(u)
            }
          )
        );
      }
    }
  };
}
function Zg(e, t, n, r, s, i) {
  const a = [], [o, c] = Es(
    e,
    t,
    s,
    i
  );
  if (Wg(
    e,
    a,
    t,
    n,
    r,
    o
  ), c.length !== 0)
    for (let u = 0; u < c.length; u++) {
      ws(
        e,
        a,
        t,
        n,
        r,
        !1,
        o,
        c[u]
      );
      for (let l = u + 1; l < c.length; l++)
        Ts(
          e,
          a,
          t,
          n,
          r,
          !1,
          c[u],
          c[l]
        );
    }
  return a;
}
function ws(e, t, n, r, s, i, a, o) {
  if (r.has(
    a,
    o,
    i
  ))
    return;
  r.add(
    a,
    o,
    i
  );
  const c = e.getFragment(o);
  if (!c)
    return;
  const [u, l] = Zi(
    e,
    n,
    c
  );
  if (a !== u) {
    La(
      e,
      t,
      n,
      r,
      s,
      i,
      a,
      u
    );
    for (const d of l)
      ws(
        e,
        t,
        n,
        r,
        s,
        i,
        a,
        d
      );
  }
}
function Ts(e, t, n, r, s, i, a, o) {
  if (a === o || s.has(
    a,
    o,
    i
  ))
    return;
  s.add(a, o, i);
  const c = e.getFragment(a), u = e.getFragment(o);
  if (!c || !u)
    return;
  const [l, d] = Zi(
    e,
    n,
    c
  ), [p, h] = Zi(
    e,
    n,
    u
  );
  La(
    e,
    t,
    n,
    r,
    s,
    i,
    l,
    p
  );
  for (const m of h)
    Ts(
      e,
      t,
      n,
      r,
      s,
      i,
      a,
      m
    );
  for (const m of d)
    Ts(
      e,
      t,
      n,
      r,
      s,
      i,
      m,
      o
    );
}
function Gg(e, t, n, r, s, i, a, o, c) {
  const u = [], [l, d] = Es(
    e,
    t,
    i,
    a
  ), [p, h] = Es(
    e,
    t,
    o,
    c
  );
  La(
    e,
    u,
    t,
    n,
    r,
    s,
    l,
    p
  );
  for (const m of h)
    ws(
      e,
      u,
      t,
      n,
      r,
      s,
      l,
      m
    );
  for (const m of d)
    ws(
      e,
      u,
      t,
      n,
      r,
      s,
      p,
      m
    );
  for (const m of d)
    for (const g of h)
      Ts(
        e,
        u,
        t,
        n,
        r,
        s,
        m,
        g
      );
  return u;
}
function Wg(e, t, n, r, s, i) {
  for (const [a, o] of Object.entries(i))
    if (o.length > 1)
      for (let c = 0; c < o.length; c++)
        for (let u = c + 1; u < o.length; u++) {
          const l = Yl(
            e,
            n,
            r,
            s,
            !1,
            // within one collection is never mutually exclusive
            a,
            o[c],
            o[u]
          );
          l && t.push(l);
        }
}
function La(e, t, n, r, s, i, a, o) {
  for (const [c, u] of Object.entries(a)) {
    const l = o[c];
    if (l)
      for (const d of u)
        for (const p of l) {
          const h = Yl(
            e,
            n,
            r,
            s,
            i,
            c,
            d,
            p
          );
          h && t.push(h);
        }
  }
}
function Yl(e, t, n, r, s, i, a, o) {
  const [c, u, l] = a, [d, p, h] = o, m = s || c !== d && $(c) && $(d);
  if (!m) {
    const D = u.name.value, C = p.name.value;
    if (D !== C)
      return [
        [i, `"${D}" and "${C}" are different fields`],
        [u],
        [p]
      ];
    if (!Jg(u, p))
      return [
        [i, "they have differing arguments"],
        [u],
        [p]
      ];
  }
  const g = l == null ? void 0 : l.type, k = h == null ? void 0 : h.type;
  if (g && k && Hi(g, k))
    return [
      [
        i,
        `they return conflicting types "${w(g)}" and "${w(
          k
        )}"`
      ],
      [u],
      [p]
    ];
  const E = u.selectionSet, I = p.selectionSet;
  if (E && I) {
    const D = Gg(
      e,
      t,
      n,
      r,
      m,
      _e(g),
      E,
      _e(k),
      I
    );
    return Yg(D, i, u, p);
  }
}
function Jg(e, t) {
  const n = e.arguments, r = t.arguments;
  if (n === void 0 || n.length === 0)
    return r === void 0 || r.length === 0;
  if (r === void 0 || r.length === 0 || n.length !== r.length)
    return !1;
  const s = new Map(r.map(({ name: i, value: a }) => [i.value, a]));
  return n.every((i) => {
    const a = i.value, o = s.get(i.name.value);
    return o === void 0 ? !1 : Qo(a) === Qo(o);
  });
}
function Qo(e) {
  return le(Ra(e));
}
function Hi(e, t) {
  return Q(e) ? Q(t) ? Hi(e.ofType, t.ofType) : !0 : Q(t) ? !0 : M(e) ? M(t) ? Hi(e.ofType, t.ofType) : !0 : M(t) ? !0 : Oe(e) || Oe(t) ? e !== t : !1;
}
function Es(e, t, n, r) {
  const s = t.get(r);
  if (s)
    return s;
  const i = /* @__PURE__ */ Object.create(null), a = /* @__PURE__ */ Object.create(null);
  Ql(
    e,
    n,
    r,
    i,
    a
  );
  const o = [i, Object.keys(a)];
  return t.set(r, o), o;
}
function Zi(e, t, n) {
  const r = t.get(n.selectionSet);
  if (r)
    return r;
  const s = Me(e.getSchema(), n.typeCondition);
  return Es(
    e,
    t,
    s,
    n.selectionSet
  );
}
function Ql(e, t, n, r, s) {
  for (const i of n.selections)
    switch (i.kind) {
      case f.FIELD: {
        const a = i.name.value;
        let o;
        ($(t) || q(t)) && (o = t.getFields()[a]);
        const c = i.alias ? i.alias.value : a;
        r[c] || (r[c] = []), r[c].push([t, i, o]);
        break;
      }
      case f.FRAGMENT_SPREAD:
        s[i.name.value] = !0;
        break;
      case f.INLINE_FRAGMENT: {
        const a = i.typeCondition, o = a ? Me(e.getSchema(), a) : t;
        Ql(
          e,
          o,
          i.selectionSet,
          r,
          s
        );
        break;
      }
    }
}
function Yg(e, t, n, r) {
  if (e.length > 0)
    return [
      [t, e.map(([s]) => s)],
      [n, ...e.map(([, s]) => s).flat()],
      [r, ...e.map(([, , s]) => s).flat()]
    ];
}
class Xl {
  constructor() {
    this._data = /* @__PURE__ */ new Map();
  }
  has(t, n, r) {
    var s;
    const i = (s = this._data.get(t)) === null || s === void 0 ? void 0 : s.get(n);
    return i === void 0 ? !1 : r ? !0 : r === i;
  }
  add(t, n, r) {
    const s = this._data.get(t);
    s === void 0 ? this._data.set(t, /* @__PURE__ */ new Map([[n, r]])) : s.set(n, r);
  }
}
class Qg {
  constructor() {
    this._orderedPairSet = new Xl();
  }
  has(t, n, r) {
    return t < n ? this._orderedPairSet.has(t, n, r) : this._orderedPairSet.has(n, t, r);
  }
  add(t, n, r) {
    t < n ? this._orderedPairSet.add(t, n, r) : this._orderedPairSet.add(n, t, r);
  }
}
function Xg(e) {
  return {
    InlineFragment(t) {
      const n = e.getType(), r = e.getParentType();
      if (It(n) && It(r) && !Bo(e.getSchema(), n, r)) {
        const s = w(r), i = w(n);
        e.reportError(
          new v(
            `Fragment cannot be spread here as objects of type "${s}" can never be of type "${i}".`,
            {
              nodes: t
            }
          )
        );
      }
    },
    FragmentSpread(t) {
      const n = t.name.value, r = Kg(e, n), s = e.getParentType();
      if (r && s && !Bo(e.getSchema(), r, s)) {
        const i = w(s), a = w(r);
        e.reportError(
          new v(
            `Fragment "${n}" cannot be spread here as objects of type "${i}" can never be of type "${a}".`,
            {
              nodes: t
            }
          )
        );
      }
    }
  };
}
function Kg(e, t) {
  const n = e.getFragment(t);
  if (n) {
    const r = Me(e.getSchema(), n.typeCondition);
    if (It(r))
      return r;
  }
}
function e0(e) {
  const t = e.getSchema(), n = /* @__PURE__ */ Object.create(null);
  for (const s of e.getDocument().definitions)
    Pr(s) && (n[s.name.value] = s);
  return {
    ScalarTypeExtension: r,
    ObjectTypeExtension: r,
    InterfaceTypeExtension: r,
    UnionTypeExtension: r,
    EnumTypeExtension: r,
    InputObjectTypeExtension: r
  };
  function r(s) {
    const i = s.name.value, a = n[i], o = t == null ? void 0 : t.getType(i);
    let c;
    if (a ? c = t0[a.kind] : o && (c = n0(o)), c) {
      if (c !== s.kind) {
        const u = r0(s.kind);
        e.reportError(
          new v(`Cannot extend non-${u} type "${i}".`, {
            nodes: a ? [a, s] : s
          })
        );
      }
    } else {
      const u = Object.keys({
        ...n,
        ...t == null ? void 0 : t.getTypeMap()
      }), l = Zt(i, u);
      e.reportError(
        new v(
          `Cannot extend type "${i}" because it is not defined.` + Et(l),
          {
            nodes: s.name
          }
        )
      );
    }
  }
}
const t0 = {
  [f.SCALAR_TYPE_DEFINITION]: f.SCALAR_TYPE_EXTENSION,
  [f.OBJECT_TYPE_DEFINITION]: f.OBJECT_TYPE_EXTENSION,
  [f.INTERFACE_TYPE_DEFINITION]: f.INTERFACE_TYPE_EXTENSION,
  [f.UNION_TYPE_DEFINITION]: f.UNION_TYPE_EXTENSION,
  [f.ENUM_TYPE_DEFINITION]: f.ENUM_TYPE_EXTENSION,
  [f.INPUT_OBJECT_TYPE_DEFINITION]: f.INPUT_OBJECT_TYPE_EXTENSION
};
function n0(e) {
  if (Ae(e))
    return f.SCALAR_TYPE_EXTENSION;
  if ($(e))
    return f.OBJECT_TYPE_EXTENSION;
  if (q(e))
    return f.INTERFACE_TYPE_EXTENSION;
  if (de(e))
    return f.UNION_TYPE_EXTENSION;
  if (ie(e))
    return f.ENUM_TYPE_EXTENSION;
  if (G(e))
    return f.INPUT_OBJECT_TYPE_EXTENSION;
  Pe(!1, "Unexpected type: " + w(e));
}
function r0(e) {
  switch (e) {
    case f.SCALAR_TYPE_EXTENSION:
      return "scalar";
    case f.OBJECT_TYPE_EXTENSION:
      return "object";
    case f.INTERFACE_TYPE_EXTENSION:
      return "interface";
    case f.UNION_TYPE_EXTENSION:
      return "union";
    case f.ENUM_TYPE_EXTENSION:
      return "enum";
    case f.INPUT_OBJECT_TYPE_EXTENSION:
      return "input object";
    default:
      Pe(!1, "Unexpected kind: " + w(e));
  }
}
function s0(e) {
  return {
    // eslint-disable-next-line new-cap
    ...Kl(e),
    Field: {
      // Validate on leave to allow for deeper errors to appear first.
      leave(t) {
        var n;
        const r = e.getFieldDef();
        if (!r)
          return !1;
        const s = new Set(
          // FIXME: https://github.com/graphql/graphql-js/issues/2203
          /* c8 ignore next */
          (n = t.arguments) === null || n === void 0 ? void 0 : n.map((i) => i.name.value)
        );
        for (const i of r.args)
          if (!s.has(i.name) && Rr(i)) {
            const a = w(i.type);
            e.reportError(
              new v(
                `Field "${r.name}" argument "${i.name}" of type "${a}" is required, but it was not provided.`,
                {
                  nodes: t
                }
              )
            );
          }
      }
    }
  };
}
function Kl(e) {
  var t;
  const n = /* @__PURE__ */ Object.create(null), r = e.getSchema(), s = (t = r == null ? void 0 : r.getDirectives()) !== null && t !== void 0 ? t : Gt;
  for (const o of s)
    n[o.name] = cn(
      o.args.filter(Rr),
      (c) => c.name
    );
  const i = e.getDocument().definitions;
  for (const o of i)
    if (o.kind === f.DIRECTIVE_DEFINITION) {
      var a;
      const c = (a = o.arguments) !== null && a !== void 0 ? a : [];
      n[o.name.value] = cn(
        c.filter(i0),
        (u) => u.name.value
      );
    }
  return {
    Directive: {
      // Validate on leave to allow for deeper errors to appear first.
      leave(o) {
        const c = o.name.value, u = n[c];
        if (u) {
          var l;
          const d = (l = o.arguments) !== null && l !== void 0 ? l : [], p = new Set(d.map((h) => h.name.value));
          for (const [h, m] of Object.entries(u))
            if (!p.has(h)) {
              const g = Hs(m.type) ? w(m.type) : le(m.type);
              e.reportError(
                new v(
                  `Directive "@${c}" argument "${h}" of type "${g}" is required, but it was not provided.`,
                  {
                    nodes: o
                  }
                )
              );
            }
        }
      }
    }
  };
}
function i0(e) {
  return e.type.kind === f.NON_NULL_TYPE && e.defaultValue == null;
}
function a0(e) {
  return {
    Field(t) {
      const n = e.getType(), r = t.selectionSet;
      if (n)
        if (Oe(_e(n))) {
          if (r) {
            const s = t.name.value, i = w(n);
            e.reportError(
              new v(
                `Field "${s}" must not have a selection since type "${i}" has no subfields.`,
                {
                  nodes: r
                }
              )
            );
          }
        } else if (r) {
          if (r.selections.length === 0) {
            const s = t.name.value, i = w(n);
            e.reportError(
              new v(
                `Field "${s}" of type "${i}" must have at least one field selected.`,
                {
                  nodes: t
                }
              )
            );
          }
        } else {
          const s = t.name.value, i = w(n);
          e.reportError(
            new v(
              `Field "${s}" of type "${i}" must have a selection of subfields. Did you mean "${s} { ... }"?`,
              {
                nodes: t
              }
            )
          );
        }
    }
  };
}
function ed(e) {
  return e.map(
    (t) => typeof t == "number" ? "[" + t.toString() + "]" : "." + t
  ).join("");
}
function Er(e, t, n) {
  return {
    prev: e,
    key: t,
    typename: n
  };
}
function je(e) {
  const t = [];
  let n = e;
  for (; n; )
    t.push(n.key), n = n.prev;
  return t.reverse();
}
function o0(e, t, n = c0) {
  return cr(e, t, n, void 0);
}
function c0(e, t, n) {
  let r = "Invalid value " + w(t);
  throw e.length > 0 && (r += ` at "value${ed(e)}"`), n.message = r + ": " + n.message, n;
}
function cr(e, t, n, r) {
  if (M(t)) {
    if (e != null)
      return cr(e, t.ofType, n, r);
    n(
      je(r),
      e,
      new v(
        `Expected non-nullable type "${w(t)}" not to be null.`
      )
    );
    return;
  }
  if (e == null)
    return null;
  if (Q(t)) {
    const s = t.ofType;
    return Sa(e) ? Array.from(e, (i, a) => {
      const o = Er(r, a, void 0);
      return cr(i, s, n, o);
    }) : [cr(e, s, n, r)];
  }
  if (G(t)) {
    if (!tt(e) || Array.isArray(e)) {
      n(
        je(r),
        e,
        new v(`Expected type "${t.name}" to be an object.`)
      );
      return;
    }
    const s = {}, i = t.getFields();
    for (const a of Object.values(i)) {
      const o = e[a.name];
      if (o === void 0) {
        if (a.defaultValue !== void 0)
          s[a.name] = a.defaultValue;
        else if (M(a.type)) {
          const c = w(a.type);
          n(
            je(r),
            e,
            new v(
              `Field "${a.name}" of required type "${c}" was not provided.`
            )
          );
        }
        continue;
      }
      s[a.name] = cr(
        o,
        a.type,
        n,
        Er(r, a.name, t.name)
      );
    }
    for (const a of Object.keys(e))
      if (!i[a]) {
        const o = Zt(
          a,
          Object.keys(t.getFields())
        );
        n(
          je(r),
          e,
          new v(
            `Field "${a}" is not defined by type "${t.name}".` + Et(o)
          )
        );
      }
    if (t.isOneOf) {
      const a = Object.keys(s);
      a.length !== 1 && n(
        je(r),
        e,
        new v(
          `Exactly one key must be specified for OneOf type "${t.name}".`
        )
      );
      const o = a[0], c = s[o];
      c === null && n(
        je(r).concat(o),
        c,
        new v(`Field "${o}" must be non-null.`)
      );
    }
    return s;
  }
  if (Oe(t)) {
    let s;
    try {
      s = t.parseValue(e);
    } catch (i) {
      i instanceof v ? n(je(r), e, i) : n(
        je(r),
        e,
        new v(`Expected type "${t.name}". ` + i.message, {
          originalError: i
        })
      );
      return;
    }
    return s === void 0 && n(
      je(r),
      e,
      new v(`Expected type "${t.name}".`)
    ), s;
  }
  Pe(!1, "Unexpected input type: " + w(t));
}
function Bt(e, t, n) {
  if (e) {
    if (e.kind === f.VARIABLE) {
      const r = e.name.value;
      if (n == null || n[r] === void 0)
        return;
      const s = n[r];
      return s === null && M(t) ? void 0 : s;
    }
    if (M(t))
      return e.kind === f.NULL ? void 0 : Bt(e, t.ofType, n);
    if (e.kind === f.NULL)
      return null;
    if (Q(t)) {
      const r = t.ofType;
      if (e.kind === f.LIST) {
        const i = [];
        for (const a of e.values)
          if (Xo(a, n)) {
            if (M(r))
              return;
            i.push(null);
          } else {
            const o = Bt(a, r, n);
            if (o === void 0)
              return;
            i.push(o);
          }
        return i;
      }
      const s = Bt(e, r, n);
      return s === void 0 ? void 0 : [s];
    }
    if (G(t)) {
      if (e.kind !== f.OBJECT)
        return;
      const r = /* @__PURE__ */ Object.create(null), s = cn(e.fields, (i) => i.name.value);
      for (const i of Object.values(t.getFields())) {
        const a = s[i.name];
        if (!a || Xo(a.value, n)) {
          if (i.defaultValue !== void 0)
            r[i.name] = i.defaultValue;
          else if (M(i.type))
            return;
          continue;
        }
        const o = Bt(a.value, i.type, n);
        if (o === void 0)
          return;
        r[i.name] = o;
      }
      if (t.isOneOf) {
        const i = Object.keys(r);
        if (i.length !== 1 || r[i[0]] === null)
          return;
      }
      return r;
    }
    if (Oe(t)) {
      let r;
      try {
        r = t.parseLiteral(e, n);
      } catch {
        return;
      }
      return r === void 0 ? void 0 : r;
    }
    Pe(!1, "Unexpected input type: " + w(t));
  }
}
function Xo(e, t) {
  return e.kind === f.VARIABLE && (t == null || t[e.name.value] === void 0);
}
function u0(e, t, n, r) {
  const s = [], i = r == null ? void 0 : r.maxErrors;
  try {
    const a = l0(
      e,
      t,
      n,
      (o) => {
        if (i != null && s.length >= i)
          throw new v(
            "Too many errors processing variables, error limit reached. Execution aborted."
          );
        s.push(o);
      }
    );
    if (s.length === 0)
      return {
        coerced: a
      };
  } catch (a) {
    s.push(a);
  }
  return {
    errors: s
  };
}
function l0(e, t, n, r) {
  const s = {};
  for (const i of t) {
    const a = i.variable.name.value, o = Me(e, i.type);
    if (!Be(o)) {
      const u = le(i.type);
      r(
        new v(
          `Variable "$${a}" expected value of type "${u}" which cannot be used as an input type.`,
          {
            nodes: i.type
          }
        )
      );
      continue;
    }
    if (!nd(n, a)) {
      if (i.defaultValue)
        s[a] = Bt(i.defaultValue, o);
      else if (M(o)) {
        const u = w(o);
        r(
          new v(
            `Variable "$${a}" of required type "${u}" was not provided.`,
            {
              nodes: i
            }
          )
        );
      }
      continue;
    }
    const c = n[a];
    if (c === null && M(o)) {
      const u = w(o);
      r(
        new v(
          `Variable "$${a}" of non-null type "${u}" must not be null.`,
          {
            nodes: i
          }
        )
      );
      continue;
    }
    s[a] = o0(
      c,
      o,
      (u, l, d) => {
        let p = `Variable "$${a}" got invalid value ` + w(l);
        u.length > 0 && (p += ` at "${a}${ed(u)}"`), r(
          new v(p + "; " + d.message, {
            nodes: i,
            originalError: d
          })
        );
      }
    );
  }
  return s;
}
function td(e, t, n) {
  var r;
  const s = {}, i = (r = t.arguments) !== null && r !== void 0 ? r : [], a = cn(i, (o) => o.name.value);
  for (const o of e.args) {
    const c = o.name, u = o.type, l = a[c];
    if (!l) {
      if (o.defaultValue !== void 0)
        s[c] = o.defaultValue;
      else if (M(u))
        throw new v(
          `Argument "${c}" of required type "${w(u)}" was not provided.`,
          {
            nodes: t
          }
        );
      continue;
    }
    const d = l.value;
    let p = d.kind === f.NULL;
    if (d.kind === f.VARIABLE) {
      const m = d.name.value;
      if (n == null || !nd(n, m)) {
        if (o.defaultValue !== void 0)
          s[c] = o.defaultValue;
        else if (M(u))
          throw new v(
            `Argument "${c}" of required type "${w(u)}" was provided the variable "$${m}" which was not provided a runtime value.`,
            {
              nodes: d
            }
          );
        continue;
      }
      p = n[m] == null;
    }
    if (p && M(u))
      throw new v(
        `Argument "${c}" of non-null type "${w(u)}" must not be null.`,
        {
          nodes: d
        }
      );
    const h = Bt(d, u, n);
    if (h === void 0)
      throw new v(
        `Argument "${c}" has invalid value ${le(d)}.`,
        {
          nodes: d
        }
      );
    s[c] = h;
  }
  return s;
}
function Ir(e, t, n) {
  var r;
  const s = (r = t.directives) === null || r === void 0 ? void 0 : r.find(
    (i) => i.name.value === e.name
  );
  if (s)
    return td(e, s, n);
}
function nd(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
function rd(e, t, n, r, s) {
  const i = /* @__PURE__ */ new Map();
  return Is(
    e,
    t,
    n,
    r,
    s,
    i,
    /* @__PURE__ */ new Set()
  ), i;
}
function d0(e, t, n, r, s) {
  const i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
  for (const o of s)
    o.selectionSet && Is(
      e,
      t,
      n,
      r,
      o.selectionSet,
      i,
      a
    );
  return i;
}
function Is(e, t, n, r, s, i, a) {
  for (const o of s.selections)
    switch (o.kind) {
      case f.FIELD: {
        if (!bi(n, o))
          continue;
        const c = f0(o), u = i.get(c);
        u !== void 0 ? u.push(o) : i.set(c, [o]);
        break;
      }
      case f.INLINE_FRAGMENT: {
        if (!bi(n, o) || !Ko(e, o, r))
          continue;
        Is(
          e,
          t,
          n,
          r,
          o.selectionSet,
          i,
          a
        );
        break;
      }
      case f.FRAGMENT_SPREAD: {
        const c = o.name.value;
        if (a.has(c) || !bi(n, o))
          continue;
        a.add(c);
        const u = t[c];
        if (!u || !Ko(e, u, r))
          continue;
        Is(
          e,
          t,
          n,
          r,
          u.selectionSet,
          i,
          a
        );
        break;
      }
    }
}
function bi(e, t) {
  const n = Ir(Dl, t, e);
  if ((n == null ? void 0 : n.if) === !0)
    return !1;
  const r = Ir(
    Ol,
    t,
    e
  );
  return (r == null ? void 0 : r.if) !== !1;
}
function Ko(e, t, n) {
  const r = t.typeCondition;
  if (!r)
    return !0;
  const s = Me(e, r);
  return s === n ? !0 : wt(s) ? e.isSubType(s, n) : !1;
}
function f0(e) {
  return e.alias ? e.alias.value : e.name.value;
}
function p0(e) {
  return {
    OperationDefinition(t) {
      if (t.operation === "subscription") {
        const n = e.getSchema(), r = n.getSubscriptionType();
        if (r) {
          const s = t.name ? t.name.value : null, i = /* @__PURE__ */ Object.create(null), a = e.getDocument(), o = /* @__PURE__ */ Object.create(null);
          for (const u of a.definitions)
            u.kind === f.FRAGMENT_DEFINITION && (o[u.name.value] = u);
          const c = rd(
            n,
            o,
            i,
            r,
            t.selectionSet
          );
          if (c.size > 1) {
            const d = [...c.values()].slice(1).flat();
            e.reportError(
              new v(
                s != null ? `Subscription "${s}" must select only one top level field.` : "Anonymous Subscription must select only one top level field.",
                {
                  nodes: d
                }
              )
            );
          }
          for (const u of c.values())
            u[0].name.value.startsWith("__") && e.reportError(
              new v(
                s != null ? `Subscription "${s}" must not select an introspection top level field.` : "Anonymous Subscription must not select an introspection top level field.",
                {
                  nodes: u
                }
              )
            );
        }
      }
    }
  };
}
function ja(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e) {
    const s = t(r), i = n.get(s);
    i === void 0 ? n.set(s, [r]) : i.push(r);
  }
  return n;
}
function h0(e) {
  return {
    DirectiveDefinition(r) {
      var s;
      const i = (s = r.arguments) !== null && s !== void 0 ? s : [];
      return n(`@${r.name.value}`, i);
    },
    InterfaceTypeDefinition: t,
    InterfaceTypeExtension: t,
    ObjectTypeDefinition: t,
    ObjectTypeExtension: t
  };
  function t(r) {
    var s;
    const i = r.name.value, a = (s = r.fields) !== null && s !== void 0 ? s : [];
    for (const c of a) {
      var o;
      const u = c.name.value, l = (o = c.arguments) !== null && o !== void 0 ? o : [];
      n(`${i}.${u}`, l);
    }
    return !1;
  }
  function n(r, s) {
    const i = ja(s, (a) => a.name.value);
    for (const [a, o] of i)
      o.length > 1 && e.reportError(
        new v(
          `Argument "${r}(${a}:)" can only be defined once.`,
          {
            nodes: o.map((c) => c.name)
          }
        )
      );
    return !1;
  }
}
function sd(e) {
  return {
    Field: t,
    Directive: t
  };
  function t(n) {
    var r;
    const s = (r = n.arguments) !== null && r !== void 0 ? r : [], i = ja(s, (a) => a.name.value);
    for (const [a, o] of i)
      o.length > 1 && e.reportError(
        new v(
          `There can be only one argument named "${a}".`,
          {
            nodes: o.map((c) => c.name)
          }
        )
      );
  }
}
function m0(e) {
  const t = /* @__PURE__ */ Object.create(null), n = e.getSchema();
  return {
    DirectiveDefinition(r) {
      const s = r.name.value;
      if (n != null && n.getDirective(s)) {
        e.reportError(
          new v(
            `Directive "@${s}" already exists in the schema. It cannot be redefined.`,
            {
              nodes: r.name
            }
          )
        );
        return;
      }
      return t[s] ? e.reportError(
        new v(
          `There can be only one directive named "@${s}".`,
          {
            nodes: [t[s], r.name]
          }
        )
      ) : t[s] = r.name, !1;
    }
  };
}
function id(e) {
  const t = /* @__PURE__ */ Object.create(null), n = e.getSchema(), r = n ? n.getDirectives() : Gt;
  for (const o of r)
    t[o.name] = !o.isRepeatable;
  const s = e.getDocument().definitions;
  for (const o of s)
    o.kind === f.DIRECTIVE_DEFINITION && (t[o.name.value] = !o.repeatable);
  const i = /* @__PURE__ */ Object.create(null), a = /* @__PURE__ */ Object.create(null);
  return {
    // Many different AST nodes may contain directives. Rather than listing
    // them all, just listen for entering any node, and check to see if it
    // defines any directives.
    enter(o) {
      if (!("directives" in o) || !o.directives)
        return;
      let c;
      if (o.kind === f.SCHEMA_DEFINITION || o.kind === f.SCHEMA_EXTENSION)
        c = i;
      else if (Pr(o) || Ca(o)) {
        const u = o.name.value;
        c = a[u], c === void 0 && (a[u] = c = /* @__PURE__ */ Object.create(null));
      } else
        c = /* @__PURE__ */ Object.create(null);
      for (const u of o.directives) {
        const l = u.name.value;
        t[l] && (c[l] ? e.reportError(
          new v(
            `The directive "@${l}" can only be used once at this location.`,
            {
              nodes: [c[l], u]
            }
          )
        ) : c[l] = u);
      }
    }
  };
}
function g0(e) {
  const t = e.getSchema(), n = t ? t.getTypeMap() : /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  return {
    EnumTypeDefinition: s,
    EnumTypeExtension: s
  };
  function s(i) {
    var a;
    const o = i.name.value;
    r[o] || (r[o] = /* @__PURE__ */ Object.create(null));
    const c = (a = i.values) !== null && a !== void 0 ? a : [], u = r[o];
    for (const l of c) {
      const d = l.name.value, p = n[o];
      ie(p) && p.getValue(d) ? e.reportError(
        new v(
          `Enum value "${o}.${d}" already exists in the schema. It cannot also be defined in this type extension.`,
          {
            nodes: l.name
          }
        )
      ) : u[d] ? e.reportError(
        new v(
          `Enum value "${o}.${d}" can only be defined once.`,
          {
            nodes: [u[d], l.name]
          }
        )
      ) : u[d] = l.name;
    }
    return !1;
  }
}
function y0(e) {
  const t = e.getSchema(), n = t ? t.getTypeMap() : /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  return {
    InputObjectTypeDefinition: s,
    InputObjectTypeExtension: s,
    InterfaceTypeDefinition: s,
    InterfaceTypeExtension: s,
    ObjectTypeDefinition: s,
    ObjectTypeExtension: s
  };
  function s(i) {
    var a;
    const o = i.name.value;
    r[o] || (r[o] = /* @__PURE__ */ Object.create(null));
    const c = (a = i.fields) !== null && a !== void 0 ? a : [], u = r[o];
    for (const l of c) {
      const d = l.name.value;
      v0(n[o], d) ? e.reportError(
        new v(
          `Field "${o}.${d}" already exists in the schema. It cannot also be defined in this type extension.`,
          {
            nodes: l.name
          }
        )
      ) : u[d] ? e.reportError(
        new v(
          `Field "${o}.${d}" can only be defined once.`,
          {
            nodes: [u[d], l.name]
          }
        )
      ) : u[d] = l.name;
    }
    return !1;
  }
}
function v0(e, t) {
  return $(e) || q(e) || G(e) ? e.getFields()[t] != null : !1;
}
function b0(e) {
  const t = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition: () => !1,
    FragmentDefinition(n) {
      const r = n.name.value;
      return t[r] ? e.reportError(
        new v(
          `There can be only one fragment named "${r}".`,
          {
            nodes: [t[r], n.name]
          }
        )
      ) : t[r] = n.name, !1;
    }
  };
}
function ad(e) {
  const t = [];
  let n = /* @__PURE__ */ Object.create(null);
  return {
    ObjectValue: {
      enter() {
        t.push(n), n = /* @__PURE__ */ Object.create(null);
      },
      leave() {
        const r = t.pop();
        r || Pe(!1), n = r;
      }
    },
    ObjectField(r) {
      const s = r.name.value;
      n[s] ? e.reportError(
        new v(
          `There can be only one input field named "${s}".`,
          {
            nodes: [n[s], r.name]
          }
        )
      ) : n[s] = r.name;
    }
  };
}
function k0(e) {
  const t = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition(n) {
      const r = n.name;
      return r && (t[r.value] ? e.reportError(
        new v(
          `There can be only one operation named "${r.value}".`,
          {
            nodes: [
              t[r.value],
              r
            ]
          }
        )
      ) : t[r.value] = r), !1;
    },
    FragmentDefinition: () => !1
  };
}
function w0(e) {
  const t = e.getSchema(), n = /* @__PURE__ */ Object.create(null), r = t ? {
    query: t.getQueryType(),
    mutation: t.getMutationType(),
    subscription: t.getSubscriptionType()
  } : {};
  return {
    SchemaDefinition: s,
    SchemaExtension: s
  };
  function s(i) {
    var a;
    const o = (a = i.operationTypes) !== null && a !== void 0 ? a : [];
    for (const c of o) {
      const u = c.operation, l = n[u];
      r[u] ? e.reportError(
        new v(
          `Type for ${u} already defined in the schema. It cannot be redefined.`,
          {
            nodes: c
          }
        )
      ) : l ? e.reportError(
        new v(
          `There can be only one ${u} type in schema.`,
          {
            nodes: [l, c]
          }
        )
      ) : n[u] = c;
    }
    return !1;
  }
}
function T0(e) {
  const t = /* @__PURE__ */ Object.create(null), n = e.getSchema();
  return {
    ScalarTypeDefinition: r,
    ObjectTypeDefinition: r,
    InterfaceTypeDefinition: r,
    UnionTypeDefinition: r,
    EnumTypeDefinition: r,
    InputObjectTypeDefinition: r
  };
  function r(s) {
    const i = s.name.value;
    if (n != null && n.getType(i)) {
      e.reportError(
        new v(
          `Type "${i}" already exists in the schema. It cannot also be defined in this type definition.`,
          {
            nodes: s.name
          }
        )
      );
      return;
    }
    return t[i] ? e.reportError(
      new v(`There can be only one type named "${i}".`, {
        nodes: [t[i], s.name]
      })
    ) : t[i] = s.name, !1;
  }
}
function E0(e) {
  return {
    OperationDefinition(t) {
      var n;
      const r = (n = t.variableDefinitions) !== null && n !== void 0 ? n : [], s = ja(
        r,
        (i) => i.variable.name.value
      );
      for (const [i, a] of s)
        a.length > 1 && e.reportError(
          new v(
            `There can be only one variable named "$${i}".`,
            {
              nodes: a.map((o) => o.variable.name)
            }
          )
        );
    }
  };
}
function I0(e) {
  let t = {};
  return {
    OperationDefinition: {
      enter() {
        t = {};
      }
    },
    VariableDefinition(n) {
      t[n.variable.name.value] = n;
    },
    ListValue(n) {
      const r = Ea(e.getParentInputType());
      if (!Q(r))
        return Xt(e, n), !1;
    },
    ObjectValue(n) {
      const r = _e(e.getInputType());
      if (!G(r))
        return Xt(e, n), !1;
      const s = cn(n.fields, (i) => i.name.value);
      for (const i of Object.values(r.getFields()))
        if (!s[i.name] && _l(i)) {
          const o = w(i.type);
          e.reportError(
            new v(
              `Field "${r.name}.${i.name}" of required type "${o}" was not provided.`,
              {
                nodes: n
              }
            )
          );
        }
      r.isOneOf && x0(
        e,
        n,
        r,
        s,
        t
      );
    },
    ObjectField(n) {
      const r = _e(e.getParentInputType());
      if (!e.getInputType() && G(r)) {
        const i = Zt(
          n.name.value,
          Object.keys(r.getFields())
        );
        e.reportError(
          new v(
            `Field "${n.name.value}" is not defined by type "${r.name}".` + Et(i),
            {
              nodes: n
            }
          )
        );
      }
    },
    NullValue(n) {
      const r = e.getInputType();
      M(r) && e.reportError(
        new v(
          `Expected value of type "${w(r)}", found ${le(n)}.`,
          {
            nodes: n
          }
        )
      );
    },
    EnumValue: (n) => Xt(e, n),
    IntValue: (n) => Xt(e, n),
    FloatValue: (n) => Xt(e, n),
    StringValue: (n) => Xt(e, n),
    BooleanValue: (n) => Xt(e, n)
  };
}
function Xt(e, t) {
  const n = e.getInputType();
  if (!n)
    return;
  const r = _e(n);
  if (!Oe(r)) {
    const s = w(n);
    e.reportError(
      new v(
        `Expected value of type "${s}", found ${le(t)}.`,
        {
          nodes: t
        }
      )
    );
    return;
  }
  try {
    if (r.parseLiteral(
      t,
      void 0
      /* variables */
    ) === void 0) {
      const i = w(n);
      e.reportError(
        new v(
          `Expected value of type "${i}", found ${le(t)}.`,
          {
            nodes: t
          }
        )
      );
    }
  } catch (s) {
    const i = w(n);
    s instanceof v ? e.reportError(s) : e.reportError(
      new v(
        `Expected value of type "${i}", found ${le(t)}; ` + s.message,
        {
          nodes: t,
          originalError: s
        }
      )
    );
  }
}
function x0(e, t, n, r, s) {
  var i;
  const a = Object.keys(r);
  if (a.length !== 1) {
    e.reportError(
      new v(
        `OneOf Input Object "${n.name}" must specify exactly one key.`,
        {
          nodes: [t]
        }
      )
    );
    return;
  }
  const c = (i = r[a[0]]) === null || i === void 0 ? void 0 : i.value, u = !c || c.kind === f.NULL, l = (c == null ? void 0 : c.kind) === f.VARIABLE;
  if (u) {
    e.reportError(
      new v(`Field "${n.name}.${a[0]}" must be non-null.`, {
        nodes: [t]
      })
    );
    return;
  }
  if (l) {
    const d = c.name.value;
    s[d].type.kind !== f.NON_NULL_TYPE && e.reportError(
      new v(
        `Variable "${d}" must be non-nullable to be used for OneOf Input Object "${n.name}".`,
        {
          nodes: [t]
        }
      )
    );
  }
}
function S0(e) {
  return {
    VariableDefinition(t) {
      const n = Me(e.getSchema(), t.type);
      if (n !== void 0 && !Be(n)) {
        const r = t.variable.name.value, s = le(t.type);
        e.reportError(
          new v(
            `Variable "$${r}" cannot be non-input type "${s}".`,
            {
              nodes: t.type
            }
          )
        );
      }
    }
  };
}
function N0(e) {
  let t = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition: {
      enter() {
        t = /* @__PURE__ */ Object.create(null);
      },
      leave(n) {
        const r = e.getRecursiveVariableUsages(n);
        for (const { node: s, type: i, defaultValue: a, parentType: o } of r) {
          const c = s.name.value, u = t[c];
          if (u && i) {
            const l = e.getSchema(), d = Me(l, u.type);
            if (d && !_0(
              l,
              d,
              u.defaultValue,
              i,
              a
            )) {
              const p = w(d), h = w(i);
              e.reportError(
                new v(
                  `Variable "$${c}" of type "${p}" used in position expecting type "${h}".`,
                  {
                    nodes: [u, s]
                  }
                )
              );
            }
            G(o) && o.isOneOf && Ta(d) && e.reportError(
              new v(
                `Variable "$${c}" is of type "${d}" but must be non-nullable to be used for OneOf Input Object "${o}".`,
                {
                  nodes: [u, s]
                }
              )
            );
          }
        }
      }
    },
    VariableDefinition(n) {
      t[n.variable.name.value] = n;
    }
  };
}
function _0(e, t, n, r, s) {
  if (M(r) && !M(t)) {
    if (!(n != null && n.kind !== f.NULL) && !(s !== void 0))
      return !1;
    const o = r.ofType;
    return Cn(e, t, o);
  }
  return Cn(e, t, r);
}
const O0 = Object.freeze([Fg]), D0 = Object.freeze([
  Sg,
  k0,
  Pg,
  p0,
  Wl,
  Dg,
  S0,
  a0,
  Ng,
  b0,
  Lg,
  qg,
  Xg,
  Ug,
  E0,
  zg,
  Vg,
  Gl,
  id,
  Ag,
  sd,
  I0,
  s0,
  N0,
  Hg,
  ad,
  ...O0
]), A0 = Object.freeze([
  $g,
  w0,
  T0,
  g0,
  y0,
  h0,
  m0,
  Wl,
  Gl,
  id,
  e0,
  Zl,
  sd,
  ad,
  Kl
]);
class od {
  constructor(t, n) {
    this._ast = t, this._fragments = void 0, this._fragmentSpreads = /* @__PURE__ */ new Map(), this._recursivelyReferencedFragments = /* @__PURE__ */ new Map(), this._onError = n;
  }
  get [Symbol.toStringTag]() {
    return "ASTValidationContext";
  }
  reportError(t) {
    this._onError(t);
  }
  getDocument() {
    return this._ast;
  }
  getFragment(t) {
    let n;
    if (this._fragments)
      n = this._fragments;
    else {
      n = /* @__PURE__ */ Object.create(null);
      for (const r of this.getDocument().definitions)
        r.kind === f.FRAGMENT_DEFINITION && (n[r.name.value] = r);
      this._fragments = n;
    }
    return n[t];
  }
  getFragmentSpreads(t) {
    let n = this._fragmentSpreads.get(t);
    if (!n) {
      n = [];
      const r = [t];
      let s;
      for (; s = r.pop(); )
        for (const i of s.selections)
          i.kind === f.FRAGMENT_SPREAD ? n.push(i) : i.selectionSet && r.push(i.selectionSet);
      this._fragmentSpreads.set(t, n);
    }
    return n;
  }
  getRecursivelyReferencedFragments(t) {
    let n = this._recursivelyReferencedFragments.get(t);
    if (!n) {
      n = [];
      const r = /* @__PURE__ */ Object.create(null), s = [t.selectionSet];
      let i;
      for (; i = s.pop(); )
        for (const a of this.getFragmentSpreads(i)) {
          const o = a.name.value;
          if (r[o] !== !0) {
            r[o] = !0;
            const c = this.getFragment(o);
            c && (n.push(c), s.push(c.selectionSet));
          }
        }
      this._recursivelyReferencedFragments.set(t, n);
    }
    return n;
  }
}
class C0 extends od {
  constructor(t, n, r) {
    super(t, r), this._schema = n;
  }
  get [Symbol.toStringTag]() {
    return "SDLValidationContext";
  }
  getSchema() {
    return this._schema;
  }
}
class R0 extends od {
  constructor(t, n, r, s) {
    super(n, s), this._schema = t, this._typeInfo = r, this._variableUsages = /* @__PURE__ */ new Map(), this._recursiveVariableUsages = /* @__PURE__ */ new Map();
  }
  get [Symbol.toStringTag]() {
    return "ValidationContext";
  }
  getSchema() {
    return this._schema;
  }
  getVariableUsages(t) {
    let n = this._variableUsages.get(t);
    if (!n) {
      const r = [], s = new zl(this._schema);
      Ar(
        t,
        ql(s, {
          VariableDefinition: () => !1,
          Variable(i) {
            r.push({
              node: i,
              type: s.getInputType(),
              defaultValue: s.getDefaultValue(),
              parentType: s.getParentInputType()
            });
          }
        })
      ), n = r, this._variableUsages.set(t, n);
    }
    return n;
  }
  getRecursiveVariableUsages(t) {
    let n = this._recursiveVariableUsages.get(t);
    if (!n) {
      n = this.getVariableUsages(t);
      for (const r of this.getRecursivelyReferencedFragments(t))
        n = n.concat(this.getVariableUsages(r));
      this._recursiveVariableUsages.set(t, n);
    }
    return n;
  }
  getType() {
    return this._typeInfo.getType();
  }
  getParentType() {
    return this._typeInfo.getParentType();
  }
  getInputType() {
    return this._typeInfo.getInputType();
  }
  getParentInputType() {
    return this._typeInfo.getParentInputType();
  }
  getFieldDef() {
    return this._typeInfo.getFieldDef();
  }
  getDirective() {
    return this._typeInfo.getDirective();
  }
  getArgument() {
    return this._typeInfo.getArgument();
  }
  getEnumValue() {
    return this._typeInfo.getEnumValue();
  }
}
function fw(e, t, n = D0, r, s = new zl(e)) {
  var i;
  const a = (i = r == null ? void 0 : r.maxErrors) !== null && i !== void 0 ? i : 100;
  t || z(!1, "Must provide document."), Ul(e);
  const o = Object.freeze({}), c = [], u = new R0(
    e,
    t,
    s,
    (d) => {
      if (c.length >= a)
        throw c.push(
          new v(
            "Too many validation errors, error limit reached. Validation aborted."
          )
        ), o;
      c.push(d);
    }
  ), l = kl(n.map((d) => d(u)));
  try {
    Ar(t, ql(s, l));
  } catch (d) {
    if (d !== o)
      throw d;
  }
  return c;
}
function cd(e, t, n = A0) {
  const r = [], s = new C0(
    e,
    t,
    (a) => {
      r.push(a);
    }
  ), i = n.map((a) => a(s));
  return Ar(e, kl(i)), r;
}
function L0(e) {
  const t = cd(e);
  if (t.length !== 0)
    throw new Error(t.map((n) => n.message).join(`

`));
}
function j0(e, t) {
  const n = cd(e, t);
  if (n.length !== 0)
    throw new Error(n.map((r) => r.message).join(`

`));
}
function P0(e) {
  let t;
  return function(r, s, i) {
    t === void 0 && (t = /* @__PURE__ */ new WeakMap());
    let a = t.get(r);
    a === void 0 && (a = /* @__PURE__ */ new WeakMap(), t.set(r, a));
    let o = a.get(s);
    o === void 0 && (o = /* @__PURE__ */ new WeakMap(), a.set(s, o));
    let c = o.get(i);
    return c === void 0 && (c = e(r, s, i), o.set(i, c)), c;
  };
}
function ec(e) {
  return Promise.all(Object.values(e)).then((t) => {
    const n = /* @__PURE__ */ Object.create(null);
    for (const [r, s] of Object.keys(e).entries())
      n[s] = t[r];
    return n;
  });
}
function $0(e, t, n) {
  let r = n;
  for (const s of e)
    r = He(r) ? r.then((i) => t(i, s)) : t(r, s);
  return r;
}
function M0(e) {
  return e instanceof Error ? e : new F0(e);
}
class F0 extends Error {
  constructor(t) {
    super("Unexpected error value: " + w(t)), this.name = "NonErrorThrown", this.thrownValue = t;
  }
}
function xs(e, t, n) {
  var r;
  const s = M0(e);
  return U0(s) ? s : new v(s.message, {
    nodes: (r = s.nodes) !== null && r !== void 0 ? r : t,
    source: s.source,
    positions: s.positions,
    path: n,
    originalError: s
  });
}
function U0(e) {
  return Array.isArray(e.path);
}
const z0 = P0(
  (e, t, n) => d0(
    e.schema,
    e.fragments,
    e.variableValues,
    t,
    n
  )
);
function Pa(e) {
  arguments.length < 2 || z(
    !1,
    "graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead."
  );
  const { schema: t, document: n, variableValues: r, rootValue: s } = e;
  q0(t, n, r);
  const i = V0(e);
  if (!("schema" in i))
    return {
      errors: i
    };
  try {
    const { operation: a } = i, o = B0(i, a, s);
    return He(o) ? o.then(
      (c) => Zr(c, i.errors),
      (c) => (i.errors.push(c), Zr(null, i.errors))
    ) : Zr(o, i.errors);
  } catch (a) {
    return i.errors.push(a), Zr(null, i.errors);
  }
}
function pw(e) {
  const t = Pa(e);
  if (He(t))
    throw new Error("GraphQL execution failed to complete synchronously.");
  return t;
}
function Zr(e, t) {
  return t.length === 0 ? {
    data: e
  } : {
    errors: t,
    data: e
  };
}
function q0(e, t, n) {
  t || z(!1, "Must provide document."), Ul(e), n == null || tt(n) || z(
    !1,
    "Variables must be provided as an Object where each property is a variable value. Perhaps look to see if an unparsed JSON string was provided."
  );
}
function V0(e) {
  var t, n, r;
  const {
    schema: s,
    document: i,
    rootValue: a,
    contextValue: o,
    variableValues: c,
    operationName: u,
    fieldResolver: l,
    typeResolver: d,
    subscribeFieldResolver: p,
    options: h
  } = e;
  let m;
  const g = /* @__PURE__ */ Object.create(null);
  for (const I of i.definitions)
    switch (I.kind) {
      case f.OPERATION_DEFINITION:
        if (u == null) {
          if (m !== void 0)
            return [
              new v(
                "Must provide operation name if query contains multiple operations."
              )
            ];
          m = I;
        } else ((t = I.name) === null || t === void 0 ? void 0 : t.value) === u && (m = I);
        break;
      case f.FRAGMENT_DEFINITION:
        g[I.name.value] = I;
        break;
    }
  if (!m)
    return u != null ? [new v(`Unknown operation named "${u}".`)] : [new v("Must provide an operation.")];
  const k = (n = m.variableDefinitions) !== null && n !== void 0 ? n : [], E = u0(
    s,
    k,
    c ?? {},
    {
      maxErrors: (r = h == null ? void 0 : h.maxCoercionErrors) !== null && r !== void 0 ? r : 50
    }
  );
  return E.errors ? E.errors : {
    schema: s,
    fragments: g,
    rootValue: a,
    contextValue: o,
    operation: m,
    variableValues: E.coerced,
    fieldResolver: l ?? rc,
    typeResolver: d ?? Y0,
    subscribeFieldResolver: p ?? rc,
    errors: []
  };
}
function B0(e, t, n) {
  const r = e.schema.getRootType(t.operation);
  if (r == null)
    throw new v(
      `Schema is not configured to execute ${t.operation} operation.`,
      {
        nodes: t
      }
    );
  const s = rd(
    e.schema,
    e.fragments,
    e.variableValues,
    r,
    t.selectionSet
  ), i = void 0;
  switch (t.operation) {
    case me.QUERY:
      return Ss(e, r, n, i, s);
    case me.MUTATION:
      return H0(
        e,
        r,
        n,
        i,
        s
      );
    case me.SUBSCRIPTION:
      return Ss(e, r, n, i, s);
  }
}
function H0(e, t, n, r, s) {
  return $0(
    s.entries(),
    (i, [a, o]) => {
      const c = Er(r, a, t.name), u = ud(
        e,
        t,
        n,
        o,
        c
      );
      return u === void 0 ? i : He(u) ? u.then((l) => (i[a] = l, i)) : (i[a] = u, i);
    },
    /* @__PURE__ */ Object.create(null)
  );
}
function Ss(e, t, n, r, s) {
  const i = /* @__PURE__ */ Object.create(null);
  let a = !1;
  try {
    for (const [o, c] of s.entries()) {
      const u = Er(r, o, t.name), l = ud(
        e,
        t,
        n,
        c,
        u
      );
      l !== void 0 && (i[o] = l, He(l) && (a = !0));
    }
  } catch (o) {
    if (a)
      return ec(i).finally(() => {
        throw o;
      });
    throw o;
  }
  return a ? ec(i) : i;
}
function ud(e, t, n, r, s) {
  var i;
  const a = Q0(e.schema, t, r[0]);
  if (!a)
    return;
  const o = a.type, c = (i = a.resolve) !== null && i !== void 0 ? i : e.fieldResolver, u = Z0(
    e,
    a,
    r,
    t,
    s
  );
  try {
    const l = td(
      a,
      r[0],
      e.variableValues
    ), d = e.contextValue, p = c(n, l, d, u);
    let h;
    return He(p) ? h = p.then(
      (m) => xr(e, o, r, u, s, m)
    ) : h = xr(
      e,
      o,
      r,
      u,
      s,
      p
    ), He(h) ? h.then(void 0, (m) => {
      const g = xs(m, r, je(s));
      return Ns(g, o, e);
    }) : h;
  } catch (l) {
    const d = xs(l, r, je(s));
    return Ns(d, o, e);
  }
}
function Z0(e, t, n, r, s) {
  return {
    fieldName: t.name,
    fieldNodes: n,
    returnType: t.type,
    parentType: r,
    path: s,
    schema: e.schema,
    fragments: e.fragments,
    rootValue: e.rootValue,
    operation: e.operation,
    variableValues: e.variableValues
  };
}
function Ns(e, t, n) {
  if (M(t))
    throw e;
  return n.errors.push(e), null;
}
function xr(e, t, n, r, s, i) {
  if (i instanceof Error)
    throw i;
  if (M(t)) {
    const a = xr(
      e,
      t.ofType,
      n,
      r,
      s,
      i
    );
    if (a === null)
      throw new Error(
        `Cannot return null for non-nullable field ${r.parentType.name}.${r.fieldName}.`
      );
    return a;
  }
  if (i == null)
    return null;
  if (Q(t))
    return G0(
      e,
      t,
      n,
      r,
      s,
      i
    );
  if (Oe(t))
    return W0(t, i);
  if (wt(t))
    return J0(
      e,
      t,
      n,
      r,
      s,
      i
    );
  if ($(t))
    return Gi(
      e,
      t,
      n,
      r,
      s,
      i
    );
  Pe(
    !1,
    "Cannot complete value of unexpected output type: " + w(t)
  );
}
function G0(e, t, n, r, s, i) {
  if (!Sa(i))
    throw new v(
      `Expected Iterable, but did not find one for field "${r.parentType.name}.${r.fieldName}".`
    );
  const a = t.ofType;
  let o = !1;
  const c = Array.from(i, (u, l) => {
    const d = Er(s, l, void 0);
    try {
      let p;
      return He(u) ? p = u.then(
        (h) => xr(
          e,
          a,
          n,
          r,
          d,
          h
        )
      ) : p = xr(
        e,
        a,
        n,
        r,
        d,
        u
      ), He(p) ? (o = !0, p.then(void 0, (h) => {
        const m = xs(
          h,
          n,
          je(d)
        );
        return Ns(m, a, e);
      })) : p;
    } catch (p) {
      const h = xs(p, n, je(d));
      return Ns(h, a, e);
    }
  });
  return o ? Promise.all(c) : c;
}
function W0(e, t) {
  const n = e.serialize(t);
  if (n == null)
    throw new Error(
      `Expected \`${w(e)}.serialize(${w(t)})\` to return non-nullable value, returned: ${w(n)}`
    );
  return n;
}
function J0(e, t, n, r, s, i) {
  var a;
  const o = (a = t.resolveType) !== null && a !== void 0 ? a : e.typeResolver, c = e.contextValue, u = o(i, c, r, t);
  return He(u) ? u.then(
    (l) => Gi(
      e,
      tc(
        l,
        e,
        t,
        n,
        r,
        i
      ),
      n,
      r,
      s,
      i
    )
  ) : Gi(
    e,
    tc(
      u,
      e,
      t,
      n,
      r,
      i
    ),
    n,
    r,
    s,
    i
  );
}
function tc(e, t, n, r, s, i) {
  if (e == null)
    throw new v(
      `Abstract type "${n.name}" must resolve to an Object type at runtime for field "${s.parentType.name}.${s.fieldName}". Either the "${n.name}" type should provide a "resolveType" function or each possible type should provide an "isTypeOf" function.`,
      r
    );
  if ($(e))
    throw new v(
      "Support for returning GraphQLObjectType from resolveType was removed in graphql-js@16.0.0 please return type name instead."
    );
  if (typeof e != "string")
    throw new v(
      `Abstract type "${n.name}" must resolve to an Object type at runtime for field "${s.parentType.name}.${s.fieldName}" with value ${w(i)}, received "${w(e)}".`
    );
  const a = t.schema.getType(e);
  if (a == null)
    throw new v(
      `Abstract type "${n.name}" was resolved to a type "${e}" that does not exist inside the schema.`,
      {
        nodes: r
      }
    );
  if (!$(a))
    throw new v(
      `Abstract type "${n.name}" was resolved to a non-object type "${e}".`,
      {
        nodes: r
      }
    );
  if (!t.schema.isSubType(n, a))
    throw new v(
      `Runtime Object type "${a.name}" is not a possible type for "${n.name}".`,
      {
        nodes: r
      }
    );
  return a;
}
function Gi(e, t, n, r, s, i) {
  const a = z0(e, t, n);
  if (t.isTypeOf) {
    const o = t.isTypeOf(i, e.contextValue, r);
    if (He(o))
      return o.then((c) => {
        if (!c)
          throw nc(t, i, n);
        return Ss(
          e,
          t,
          i,
          s,
          a
        );
      });
    if (!o)
      throw nc(t, i, n);
  }
  return Ss(e, t, i, s, a);
}
function nc(e, t, n) {
  return new v(
    `Expected value of type "${e.name}" but got: ${w(t)}.`,
    {
      nodes: n
    }
  );
}
const Y0 = function(e, t, n, r) {
  if (tt(e) && typeof e.__typename == "string")
    return e.__typename;
  const s = n.schema.getPossibleTypes(r), i = [];
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    if (o.isTypeOf) {
      const c = o.isTypeOf(e, t, n);
      if (He(c))
        i[a] = c;
      else if (c)
        return o.name;
    }
  }
  if (i.length)
    return Promise.all(i).then((a) => {
      for (let o = 0; o < a.length; o++)
        if (a[o])
          return s[o].name;
    });
}, rc = function(e, t, n, r) {
  if (tt(e) || typeof e == "function") {
    const s = e[r.fieldName];
    return typeof s == "function" ? e[r.fieldName](t, n, r) : s;
  }
};
function Q0(e, t, n) {
  const r = n.name.value;
  return r === vs.name && e.getQueryType() === t ? vs : r === bs.name && e.getQueryType() === t ? bs : r === ks.name ? ks : t.getFields()[r];
}
function hw(e, t, n) {
  Fl(e), t != null && t.kind === f.DOCUMENT || z(!1, "Must provide valid Document AST."), (n == null ? void 0 : n.assumeValid) !== !0 && (n == null ? void 0 : n.assumeValidSDL) !== !0 && j0(t, e);
  const r = e.toConfig(), s = ld(r, t, n);
  return r === s ? e : new Js(s);
}
function ld(e, t, n) {
  var r, s, i, a;
  const o = [], c = /* @__PURE__ */ Object.create(null), u = [];
  let l;
  const d = [];
  for (const y of t.definitions)
    if (y.kind === f.SCHEMA_DEFINITION)
      l = y;
    else if (y.kind === f.SCHEMA_EXTENSION)
      d.push(y);
    else if (Pr(y))
      o.push(y);
    else if (Ca(y)) {
      const S = y.name.value, x = c[S];
      c[S] = x ? x.concat([y]) : [y];
    } else y.kind === f.DIRECTIVE_DEFINITION && u.push(y);
  if (Object.keys(c).length === 0 && o.length === 0 && u.length === 0 && d.length === 0 && l == null)
    return e;
  const p = /* @__PURE__ */ Object.create(null);
  for (const y of e.types)
    p[y.name] = I(y);
  for (const y of o) {
    var h;
    const S = y.name.value;
    p[S] = (h = sc[S]) !== null && h !== void 0 ? h : Z(y);
  }
  const m = {
    // Get the extended root operation types.
    query: e.query && k(e.query),
    mutation: e.mutation && k(e.mutation),
    subscription: e.subscription && k(e.subscription),
    // Then, incorporate schema definition and all schema extensions.
    ...l && X([l]),
    ...X(d)
  };
  return {
    description: (r = l) === null || r === void 0 || (s = r.description) === null || s === void 0 ? void 0 : s.value,
    ...m,
    types: Object.values(p),
    directives: [
      ...e.directives.map(E),
      ...u.map(Dt)
    ],
    extensions: /* @__PURE__ */ Object.create(null),
    astNode: (i = l) !== null && i !== void 0 ? i : e.astNode,
    extensionASTNodes: e.extensionASTNodes.concat(d),
    assumeValid: (a = n == null ? void 0 : n.assumeValid) !== null && a !== void 0 ? a : !1
  };
  function g(y) {
    return Q(y) ? new ve(g(y.ofType)) : M(y) ? new F(g(y.ofType)) : k(y);
  }
  function k(y) {
    return p[y.name];
  }
  function E(y) {
    const S = y.toConfig();
    return new xt({
      ...S,
      args: kt(S.args, H)
    });
  }
  function I(y) {
    if (Oa(y) || Lr(y))
      return y;
    if (Ae(y))
      return ne(y);
    if ($(y))
      return ue(y);
    if (q(y))
      return oe(y);
    if (de(y))
      return Ie(y);
    if (ie(y))
      return C(y);
    if (G(y))
      return D(y);
    Pe(!1, "Unexpected type: " + w(y));
  }
  function D(y) {
    var S;
    const x = y.toConfig(), N = (S = c[x.name]) !== null && S !== void 0 ? S : [];
    return new un({
      ...x,
      fields: () => ({
        ...kt(x.fields, (J) => ({
          ...J,
          type: g(J.type)
        })),
        ...Bn(N)
      }),
      extensionASTNodes: x.extensionASTNodes.concat(N)
    });
  }
  function C(y) {
    var S;
    const x = y.toConfig(), N = (S = c[y.name]) !== null && S !== void 0 ? S : [];
    return new pt({
      ...x,
      values: { ...x.values, ...Hn(N) },
      extensionASTNodes: x.extensionASTNodes.concat(N)
    });
  }
  function ne(y) {
    var S;
    const x = y.toConfig(), N = (S = c[x.name]) !== null && S !== void 0 ? S : [];
    let J = x.specifiedByURL;
    for (const Y of N) {
      var K;
      J = (K = ic(Y)) !== null && K !== void 0 ? K : J;
    }
    return new ft({
      ...x,
      specifiedByURL: J,
      extensionASTNodes: x.extensionASTNodes.concat(N)
    });
  }
  function ue(y) {
    var S;
    const x = y.toConfig(), N = (S = c[x.name]) !== null && S !== void 0 ? S : [];
    return new De({
      ...x,
      interfaces: () => [
        ...y.getInterfaces().map(k),
        ...mn(N)
      ],
      fields: () => ({
        ...kt(x.fields, re),
        ...We(N)
      }),
      extensionASTNodes: x.extensionASTNodes.concat(N)
    });
  }
  function oe(y) {
    var S;
    const x = y.toConfig(), N = (S = c[x.name]) !== null && S !== void 0 ? S : [];
    return new Ht({
      ...x,
      interfaces: () => [
        ...y.getInterfaces().map(k),
        ...mn(N)
      ],
      fields: () => ({
        ...kt(x.fields, re),
        ...We(N)
      }),
      extensionASTNodes: x.extensionASTNodes.concat(N)
    });
  }
  function Ie(y) {
    var S;
    const x = y.toConfig(), N = (S = c[x.name]) !== null && S !== void 0 ? S : [];
    return new Tr({
      ...x,
      types: () => [
        ...y.getTypes().map(k),
        ...Zn(N)
      ],
      extensionASTNodes: x.extensionASTNodes.concat(N)
    });
  }
  function re(y) {
    return {
      ...y,
      type: g(y.type),
      args: y.args && kt(y.args, H)
    };
  }
  function H(y) {
    return { ...y, type: g(y.type) };
  }
  function X(y) {
    const S = {};
    for (const N of y) {
      var x;
      const J = (
        /* c8 ignore next */
        (x = N.operationTypes) !== null && x !== void 0 ? x : []
      );
      for (const K of J)
        S[K.operation] = xe(K.type);
    }
    return S;
  }
  function xe(y) {
    var S;
    const x = y.name.value, N = (S = sc[x]) !== null && S !== void 0 ? S : p[x];
    if (N === void 0)
      throw new Error(`Unknown type: "${x}".`);
    return N;
  }
  function Fe(y) {
    return y.kind === f.LIST_TYPE ? new ve(Fe(y.type)) : y.kind === f.NON_NULL_TYPE ? new F(Fe(y.type)) : xe(y);
  }
  function Dt(y) {
    var S;
    return new xt({
      name: y.name.value,
      description: (S = y.description) === null || S === void 0 ? void 0 : S.value,
      // @ts-expect-error
      locations: y.locations.map(({ value: x }) => x),
      isRepeatable: y.repeatable,
      args: Wt(y.arguments),
      astNode: y
    });
  }
  function We(y) {
    const S = /* @__PURE__ */ Object.create(null);
    for (const J of y) {
      var x;
      const K = (
        /* c8 ignore next */
        (x = J.fields) !== null && x !== void 0 ? x : []
      );
      for (const Y of K) {
        var N;
        S[Y.name.value] = {
          // Note: While this could make assertions to get the correctly typed
          // value, that would throw immediately while type system validation
          // with validateSchema() will produce more actionable results.
          type: Fe(Y.type),
          description: (N = Y.description) === null || N === void 0 ? void 0 : N.value,
          args: Wt(Y.arguments),
          deprecationReason: Gr(Y),
          astNode: Y
        };
      }
    }
    return S;
  }
  function Wt(y) {
    const S = (
      /* c8 ignore next */
      y ?? []
    ), x = /* @__PURE__ */ Object.create(null);
    for (const J of S) {
      var N;
      const K = Fe(J.type);
      x[J.name.value] = {
        type: K,
        description: (N = J.description) === null || N === void 0 ? void 0 : N.value,
        defaultValue: Bt(J.defaultValue, K),
        deprecationReason: Gr(J),
        astNode: J
      };
    }
    return x;
  }
  function Bn(y) {
    const S = /* @__PURE__ */ Object.create(null);
    for (const J of y) {
      var x;
      const K = (
        /* c8 ignore next */
        (x = J.fields) !== null && x !== void 0 ? x : []
      );
      for (const Y of K) {
        var N;
        const Je = Fe(Y.type);
        S[Y.name.value] = {
          type: Je,
          description: (N = Y.description) === null || N === void 0 ? void 0 : N.value,
          defaultValue: Bt(Y.defaultValue, Je),
          deprecationReason: Gr(Y),
          astNode: Y
        };
      }
    }
    return S;
  }
  function Hn(y) {
    const S = /* @__PURE__ */ Object.create(null);
    for (const J of y) {
      var x;
      const K = (
        /* c8 ignore next */
        (x = J.values) !== null && x !== void 0 ? x : []
      );
      for (const Y of K) {
        var N;
        S[Y.name.value] = {
          description: (N = Y.description) === null || N === void 0 ? void 0 : N.value,
          deprecationReason: Gr(Y),
          astNode: Y
        };
      }
    }
    return S;
  }
  function mn(y) {
    return y.flatMap(
      // FIXME: https://github.com/graphql/graphql-js/issues/2203
      (S) => {
        var x, N;
        return (
          /* c8 ignore next */
          (x = (N = S.interfaces) === null || N === void 0 ? void 0 : N.map(xe)) !== null && x !== void 0 ? x : []
        );
      }
    );
  }
  function Zn(y) {
    return y.flatMap(
      // FIXME: https://github.com/graphql/graphql-js/issues/2203
      (S) => {
        var x, N;
        return (
          /* c8 ignore next */
          (x = (N = S.types) === null || N === void 0 ? void 0 : N.map(xe)) !== null && x !== void 0 ? x : []
        );
      }
    );
  }
  function Z(y) {
    var S;
    const x = y.name.value, N = (S = c[x]) !== null && S !== void 0 ? S : [];
    switch (y.kind) {
      case f.OBJECT_TYPE_DEFINITION: {
        var J;
        const Se = [y, ...N];
        return new De({
          name: x,
          description: (J = y.description) === null || J === void 0 ? void 0 : J.value,
          interfaces: () => mn(Se),
          fields: () => We(Se),
          astNode: y,
          extensionASTNodes: N
        });
      }
      case f.INTERFACE_TYPE_DEFINITION: {
        var K;
        const Se = [y, ...N];
        return new Ht({
          name: x,
          description: (K = y.description) === null || K === void 0 ? void 0 : K.value,
          interfaces: () => mn(Se),
          fields: () => We(Se),
          astNode: y,
          extensionASTNodes: N
        });
      }
      case f.ENUM_TYPE_DEFINITION: {
        var Y;
        const Se = [y, ...N];
        return new pt({
          name: x,
          description: (Y = y.description) === null || Y === void 0 ? void 0 : Y.value,
          values: Hn(Se),
          astNode: y,
          extensionASTNodes: N
        });
      }
      case f.UNION_TYPE_DEFINITION: {
        var Je;
        const Se = [y, ...N];
        return new Tr({
          name: x,
          description: (Je = y.description) === null || Je === void 0 ? void 0 : Je.value,
          types: () => Zn(Se),
          astNode: y,
          extensionASTNodes: N
        });
      }
      case f.SCALAR_TYPE_DEFINITION: {
        var Jt;
        return new ft({
          name: x,
          description: (Jt = y.description) === null || Jt === void 0 ? void 0 : Jt.value,
          specifiedByURL: ic(y),
          astNode: y,
          extensionASTNodes: N
        });
      }
      case f.INPUT_OBJECT_TYPE_DEFINITION: {
        var gn;
        const Se = [y, ...N];
        return new un({
          name: x,
          description: (gn = y.description) === null || gn === void 0 ? void 0 : gn.value,
          fields: () => Bn(Se),
          astNode: y,
          extensionASTNodes: N,
          isOneOf: X0(y)
        });
      }
    }
  }
}
const sc = cn(
  [...Ia, ..._a],
  (e) => e.name
);
function Gr(e) {
  const t = Ir(Gs, e);
  return t == null ? void 0 : t.reason;
}
function ic(e) {
  const t = Ir(Al, e);
  return t == null ? void 0 : t.url;
}
function X0(e) {
  return !!Ir(Cl, e);
}
function dd(e, t) {
  e != null && e.kind === f.DOCUMENT || z(!1, "Must provide valid Document AST."), (t == null ? void 0 : t.assumeValid) !== !0 && (t == null ? void 0 : t.assumeValidSDL) !== !0 && L0(e);
  const r = ld({
    description: void 0,
    types: [],
    directives: [],
    extensions: /* @__PURE__ */ Object.create(null),
    extensionASTNodes: [],
    assumeValid: !1
  }, e, t);
  if (r.astNode == null)
    for (const i of r.types)
      switch (i.name) {
        case "Query":
          r.query = i;
          break;
        case "Mutation":
          r.mutation = i;
          break;
        case "Subscription":
          r.subscription = i;
          break;
      }
  const s = [
    ...r.directives,
    // If specified directives were not explicitly declared, add them.
    ...Gt.filter(
      (i) => r.directives.every(
        (a) => a.name !== i.name
      )
    )
  ];
  return new Js({ ...r, directives: s });
}
function K0(e, t) {
  const n = Vs(e, {
    noLocation: t == null ? void 0 : t.noLocation,
    allowLegacyFragmentVariables: t == null ? void 0 : t.allowLegacyFragmentVariables
  });
  return dd(n, {
    assumeValidSDL: t == null ? void 0 : t.assumeValidSDL,
    assumeValid: t == null ? void 0 : t.assumeValid
  });
}
const fd = (e) => Array.isArray(e) ? e : e ? [e] : [];
function ey(e, t) {
  return String(e) < String(t) ? -1 : String(e) > String(t) ? 1 : 0;
}
function ac(e) {
  var n, r;
  let t;
  return "alias" in e && (t = (n = e.alias) == null ? void 0 : n.value), t == null && "name" in e && (t = (r = e.name) == null ? void 0 : r.value), t == null && (t = e.kind), t;
}
function Ys(e, t, n) {
  const r = ac(e), s = ac(t);
  return typeof n == "function" ? n(r, s) : ey(r, s);
}
function $a(e) {
  return e != null;
}
const pd = 3;
function hd(e) {
  return Qs(e, []);
}
function Qs(e, t) {
  switch (typeof e) {
    case "string":
      return JSON.stringify(e);
    case "function":
      return e.name ? `[function ${e.name}]` : "[function]";
    case "object":
      return ty(e, t);
    default:
      return String(e);
  }
}
function oc(e) {
  return (e.name = "GraphQLError") ? e.toString() : `${e.name}: ${e.message};
 ${e.stack}`;
}
function ty(e, t) {
  if (e === null)
    return "null";
  if (e instanceof Error)
    return e.name === "AggregateError" ? oc(e) + `
` + cc(e.errors, t) : oc(e);
  if (t.includes(e))
    return "[Circular]";
  const n = [...t, e];
  if (ny(e)) {
    const r = e.toJSON();
    if (r !== e)
      return typeof r == "string" ? r : Qs(r, n);
  } else if (Array.isArray(e))
    return cc(e, n);
  return ry(e, n);
}
function ny(e) {
  return typeof e.toJSON == "function";
}
function ry(e, t) {
  const n = Object.entries(e);
  return n.length === 0 ? "{}" : t.length > pd ? "[" + sy(e) + "]" : "{ " + n.map(([s, i]) => s + ": " + Qs(i, t)).join(", ") + " }";
}
function cc(e, t) {
  if (e.length === 0)
    return "[]";
  if (t.length > pd)
    return "[Array]";
  const n = e.length, r = [];
  for (let s = 0; s < n; ++s)
    r.push(Qs(e[s], t));
  return "[" + r.join(", ") + "]";
}
function sy(e) {
  const t = Object.prototype.toString.call(e).replace(/^\[object /, "").replace(/]$/, "");
  if (t === "Object" && typeof e.constructor == "function") {
    const n = e.constructor.name;
    if (typeof n == "string" && n !== "")
      return n;
  }
  return t;
}
function iy(e) {
  return e != null && typeof e == "object" && Symbol.iterator in e;
}
function ay(e) {
  return typeof e == "object" && e !== null;
}
function md(e) {
  const t = /* @__PURE__ */ new WeakMap();
  return function(r) {
    const s = t.get(r);
    if (s === void 0) {
      const i = e(r);
      return t.set(r, i), i;
    }
    return s;
  };
}
function oy(e, t, n = ["directives"]) {
  var a;
  const r = {};
  if (e.extensions) {
    let o = e.extensions;
    for (const c of n)
      o = o == null ? void 0 : o[c];
    if (o != null)
      for (const c in o) {
        const u = o[c], l = c;
        if (Array.isArray(u))
          for (const d of u) {
            let p = r[l];
            p || (p = [], r[l] = p), p.push(d);
          }
        else {
          let d = r[l];
          d || (d = [], r[l] = d), d.push(u);
        }
      }
  }
  const s = md((o) => JSON.stringify(o)), i = [];
  e.astNode && i.push(e.astNode), e.extensionASTNodes && i.push(...e.extensionASTNodes);
  for (const o of i)
    if ((a = o.directives) != null && a.length)
      for (const c of o.directives) {
        const u = c.name.value;
        let l = r[u];
        l || (l = [], r[u] = l);
        let d = {};
        if (c.arguments)
          for (const p of c.arguments) {
            const h = p.name.value;
            d[h] == null, d[h] == null && (d[h] = gs(p.value));
          }
        if (i.length > 0 && l.length > 0) {
          const p = s(d);
          if (l.some((h) => s(h) === p))
            continue;
        }
        l.push(d);
      }
  return r;
}
function gd(e, t = ["directives"]) {
  const n = oy(e, void 0, t);
  return Object.entries(n).map(([r, s]) => s == null ? void 0 : s.map((i) => ({
    name: r,
    args: i
  }))).flat(1 / 0).filter(Boolean);
}
function St(e) {
  if (M(e)) {
    const t = St(e.ofType);
    if (t.kind === f.NON_NULL_TYPE)
      throw new Error(`Invalid type node ${hd(e)}. Inner type of non-null type cannot be a non-null type.`);
    return {
      kind: f.NON_NULL_TYPE,
      type: t
    };
  } else if (Q(e))
    return {
      kind: f.LIST_TYPE,
      type: St(e.ofType)
    };
  return {
    kind: f.NAMED_TYPE,
    name: {
      kind: f.NAME,
      value: e.name
    }
  };
}
function hr(e) {
  if (e === null)
    return { kind: f.NULL };
  if (e === void 0)
    return null;
  if (Array.isArray(e)) {
    const t = [];
    for (const n of e) {
      const r = hr(n);
      r != null && t.push(r);
    }
    return { kind: f.LIST, values: t };
  }
  if (typeof e == "object") {
    if (e != null && e.toJSON)
      return hr(e.toJSON());
    const t = [];
    for (const n in e) {
      const r = e[n], s = hr(r);
      s && t.push({
        kind: f.OBJECT_FIELD,
        name: { kind: f.NAME, value: n },
        value: s
      });
    }
    return { kind: f.OBJECT, fields: t };
  }
  if (typeof e == "boolean")
    return { kind: f.BOOLEAN, value: e };
  if (typeof e == "bigint")
    return { kind: f.INT, value: String(e) };
  if (typeof e == "number" && isFinite(e)) {
    const t = String(e);
    return cy.test(t) ? { kind: f.INT, value: t } : { kind: f.FLOAT, value: t };
  }
  if (typeof e == "string")
    return { kind: f.STRING, value: e };
  throw new TypeError(`Cannot convert value to AST: ${e}.`);
}
const cy = /^-?(?:0|[1-9][0-9]*)$/;
function rn(e, t) {
  if (M(t)) {
    const n = rn(e, t.ofType);
    return (n == null ? void 0 : n.kind) === f.NULL ? null : n;
  }
  if (e === null)
    return { kind: f.NULL };
  if (e === void 0)
    return null;
  if (Q(t)) {
    const n = t.ofType;
    if (iy(e)) {
      const r = [];
      for (const s of e) {
        const i = rn(s, n);
        i != null && r.push(i);
      }
      return { kind: f.LIST, values: r };
    }
    return rn(e, n);
  }
  if (G(t)) {
    if (!ay(e))
      return null;
    const n = [];
    for (const r of Object.values(t.getFields())) {
      const s = rn(e[r.name], r.type);
      s && n.push({
        kind: f.OBJECT_FIELD,
        name: { kind: f.NAME, value: r.name },
        value: s
      });
    }
    return { kind: f.OBJECT, fields: n };
  }
  if (Oe(t)) {
    const n = t.serialize(e);
    return n == null ? null : ie(t) ? { kind: f.ENUM, value: n } : t.name === "ID" && typeof n == "string" && uy.test(n) ? { kind: f.INT, value: n } : hr(n);
  }
  console.assert(!1, "Unexpected input type: " + hd(t));
}
const uy = /^-?(?:0|[1-9][0-9]*)$/;
function Ge(e) {
  var t;
  if ((t = e.astNode) != null && t.description)
    return {
      ...e.astNode.description,
      block: !0
    };
  if (e.description)
    return {
      kind: f.STRING,
      value: e.description,
      block: !0
    };
}
const ly = md(function(t) {
  const n = /* @__PURE__ */ new Map(), r = t.getQueryType();
  r && n.set("query", r);
  const s = t.getMutationType();
  s && n.set("mutation", s);
  const i = t.getSubscriptionType();
  return i && n.set("subscription", i), n;
});
function dy(e, t = {}) {
  const n = t.pathToDirectivesInExtensions, r = e.getTypeMap(), s = fy(e, n), i = s != null ? [s] : [], a = e.getDirectives();
  for (const o of a)
    Rl(o) || i.push(py(o, e, n));
  for (const o in r) {
    const c = r[o], u = Lr(c), l = Oa(c);
    if (!(u || l))
      if ($(c))
        i.push(hy(c, e, n));
      else if (q(c))
        i.push(my(c, e, n));
      else if (de(c))
        i.push(gy(c, e, n));
      else if (G(c))
        i.push(yy(c, e, n));
      else if (ie(c))
        i.push(vy(c, e, n));
      else if (Ae(c))
        i.push(by(c, e, n));
      else
        throw new Error(`Unknown type ${c}.`);
  }
  return {
    kind: f.DOCUMENT,
    definitions: i
  };
}
function fy(e, t) {
  const n = /* @__PURE__ */ new Map([
    ["query", void 0],
    ["mutation", void 0],
    ["subscription", void 0]
  ]), r = [];
  if (e.astNode != null && r.push(e.astNode), e.extensionASTNodes != null)
    for (const u of e.extensionASTNodes)
      r.push(u);
  for (const u of r)
    if (u.operationTypes)
      for (const l of u.operationTypes)
        n.set(l.operation, l);
  const s = ly(e);
  for (const [u, l] of n) {
    const d = s.get(u);
    if (d != null) {
      const p = St(d);
      l != null ? l.type = p : n.set(u, {
        kind: f.OPERATION_TYPE_DEFINITION,
        operation: u,
        type: p
      });
    }
  }
  const i = [...n.values()].filter($a), a = ht(e, e, t);
  if (!i.length && !a.length)
    return null;
  const o = {
    kind: i != null ? f.SCHEMA_DEFINITION : f.SCHEMA_EXTENSION,
    operationTypes: i,
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: a
  }, c = Ge(e);
  return c && (o.description = c), o;
}
function py(e, t, n) {
  var r, s;
  return {
    kind: f.DIRECTIVE_DEFINITION,
    description: Ge(e),
    name: {
      kind: f.NAME,
      value: e.name
    },
    arguments: (r = e.args) == null ? void 0 : r.map((i) => yd(i, t, n)),
    repeatable: e.isRepeatable,
    locations: ((s = e.locations) == null ? void 0 : s.map((i) => ({
      kind: f.NAME,
      value: i
    }))) || []
  };
}
function ht(e, t, n) {
  let r = [];
  const s = gd(e, n);
  let i;
  s != null && (i = bd(t, s));
  let a = null, o = null, c = null;
  if (i != null && (r = i.filter((u) => Gt.every((l) => l.name !== u.name.value)), a = i.find((u) => u.name.value === "deprecated"), o = i.find((u) => u.name.value === "specifiedBy"), c = i.find((u) => u.name.value === "oneOf")), e.deprecationReason != null && a == null && (a = Ty(e.deprecationReason)), e.specifiedByUrl != null || e.specifiedByURL != null && o == null) {
    const l = {
      url: e.specifiedByUrl || e.specifiedByURL
    };
    o = Sr("specifiedBy", l);
  }
  return e.isOneOf && c == null && (c = Sr("oneOf")), a != null && r.push(a), o != null && r.push(o), c != null && r.push(c), r;
}
function yd(e, t, n) {
  return {
    kind: f.INPUT_VALUE_DEFINITION,
    description: Ge(e),
    name: {
      kind: f.NAME,
      value: e.name
    },
    type: St(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    defaultValue: e.defaultValue !== void 0 ? rn(e.defaultValue, e.type) ?? void 0 : void 0,
    directives: ht(e, t, n)
  };
}
function hy(e, t, n) {
  return {
    kind: f.OBJECT_TYPE_DEFINITION,
    description: Ge(e),
    name: {
      kind: f.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((r) => vd(r, t, n)),
    interfaces: Object.values(e.getInterfaces()).map((r) => St(r)),
    directives: ht(e, t, n)
  };
}
function my(e, t, n) {
  const r = {
    kind: f.INTERFACE_TYPE_DEFINITION,
    description: Ge(e),
    name: {
      kind: f.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((s) => vd(s, t, n)),
    directives: ht(e, t, n)
  };
  return "getInterfaces" in e && (r.interfaces = Object.values(e.getInterfaces()).map((s) => St(s))), r;
}
function gy(e, t, n) {
  return {
    kind: f.UNION_TYPE_DEFINITION,
    description: Ge(e),
    name: {
      kind: f.NAME,
      value: e.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: ht(e, t, n),
    types: e.getTypes().map((r) => St(r))
  };
}
function yy(e, t, n) {
  return {
    kind: f.INPUT_OBJECT_TYPE_DEFINITION,
    description: Ge(e),
    name: {
      kind: f.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((r) => ky(r, t, n)),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: ht(e, t, n)
  };
}
function vy(e, t, n) {
  return {
    kind: f.ENUM_TYPE_DEFINITION,
    description: Ge(e),
    name: {
      kind: f.NAME,
      value: e.name
    },
    values: Object.values(e.getValues()).map((r) => wy(r, t, n)),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: ht(e, t, n)
  };
}
function by(e, t, n) {
  const r = gd(e, n), s = bd(t, r), i = e.specifiedByUrl || e.specifiedByURL;
  if (i && !s.some((a) => a.name.value === "specifiedBy")) {
    const a = {
      url: i
    };
    s.push(Sr("specifiedBy", a));
  }
  return {
    kind: f.SCALAR_TYPE_DEFINITION,
    description: Ge(e),
    name: {
      kind: f.NAME,
      value: e.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: s
  };
}
function vd(e, t, n) {
  return {
    kind: f.FIELD_DEFINITION,
    description: Ge(e),
    name: {
      kind: f.NAME,
      value: e.name
    },
    arguments: e.args.map((r) => yd(r, t, n)),
    type: St(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: ht(e, t, n)
  };
}
function ky(e, t, n) {
  return {
    kind: f.INPUT_VALUE_DEFINITION,
    description: Ge(e),
    name: {
      kind: f.NAME,
      value: e.name
    },
    type: St(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: ht(e, t, n),
    defaultValue: rn(e.defaultValue, e.type) ?? void 0
  };
}
function wy(e, t, n) {
  return {
    kind: f.ENUM_VALUE_DEFINITION,
    description: Ge(e),
    name: {
      kind: f.NAME,
      value: e.name
    },
    directives: ht(e, t, n)
  };
}
function Ty(e) {
  return Sr("deprecated", { reason: e }, Gs);
}
function Sr(e, t, n) {
  const r = [];
  for (const s in t) {
    const i = t[s];
    let a;
    if (n != null) {
      const o = n.args.find((c) => c.name === s);
      o && (a = rn(i, o.type));
    }
    a == null && (a = hr(i)), a != null && r.push({
      kind: f.ARGUMENT,
      name: {
        kind: f.NAME,
        value: s
      },
      value: a
    });
  }
  return {
    kind: f.DIRECTIVE,
    name: {
      kind: f.NAME,
      value: e
    },
    arguments: r
  };
}
function bd(e, t) {
  const n = [];
  for (const { name: r, args: s } of t) {
    const i = e == null ? void 0 : e.getDirective(r);
    n.push(Sr(r, s, i));
  }
  return n;
}
const Ey = 80;
let Rn = {};
function Wi() {
  Rn = {};
}
function Iy(e) {
  var n;
  const t = (n = e.name) == null ? void 0 : n.value;
  if (t != null)
    switch (Wr(e, t), e.kind) {
      case "EnumTypeDefinition":
        if (e.values)
          for (const r of e.values)
            Wr(r, t, r.name.value);
        break;
      case "ObjectTypeDefinition":
      case "InputObjectTypeDefinition":
      case "InterfaceTypeDefinition":
        if (e.fields) {
          for (const r of e.fields)
            if (Wr(r, t, r.name.value), Dy(r) && r.arguments)
              for (const s of r.arguments)
                Wr(s, t, r.name.value, s.name.value);
        }
        break;
    }
}
function Wr(e, t, n, r) {
  const s = Ay(e);
  if (typeof s != "string" || s.length === 0)
    return;
  const i = [t];
  n && (i.push(n), r && i.push(r));
  const a = i.join(".");
  Rn[a] || (Rn[a] = []), Rn[a].push(s);
}
function xy(e) {
  return `
# ` + e.replace(/\n/g, `
# `);
}
function _(e, t) {
  return e ? e.filter((n) => n).join(t || "") : "";
}
function uc(e) {
  return (e == null ? void 0 : e.some((t) => t.includes(`
`))) ?? !1;
}
function Sy(e) {
  return (t, n, r, s, i) => {
    var l;
    const a = [], o = s.reduce((d, p) => (["fields", "arguments", "values"].includes(p) && d.name && a.push(d.name.value), d[p]), i[0]), c = [...a, (l = o == null ? void 0 : o.name) == null ? void 0 : l.value].filter(Boolean).join("."), u = [];
    return t.kind.includes("Definition") && Rn[c] && u.push(...Rn[c]), _([...u.map(xy), t.description, e(t, n, r, s, i)], `
`);
  };
}
function mr(e) {
  return e && `  ${e.replace(/\n/g, `
  `)}`;
}
function Qe(e) {
  return e && e.length !== 0 ? `{
${mr(_(e, `
`))}
}` : "";
}
function ee(e, t, n) {
  return t ? e + t + (n || "") : "";
}
function Ny(e, t = !1) {
  const n = e.replace(/\\/g, "\\\\").replace(/"""/g, '\\"""');
  return (e[0] === " " || e[0] === "	") && e.indexOf(`
`) === -1 ? `"""${n.replace(/"$/, `"
`)}"""` : `"""
${t ? n : mr(n)}
"""`;
}
const lc = {
  Name: { leave: (e) => e.value },
  Variable: { leave: (e) => "$" + e.name },
  // Document
  Document: {
    leave: (e) => _(e.definitions, `

`)
  },
  OperationDefinition: {
    leave: (e) => {
      const t = ee("(", _(e.variableDefinitions, ", "), ")");
      return _([e.operation, _([e.name, t]), _(e.directives, " ")], " ") + " " + e.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: e, type: t, defaultValue: n, directives: r }) => e + ": " + t + ee(" = ", n) + ee(" ", _(r, " "))
  },
  SelectionSet: { leave: ({ selections: e }) => Qe(e) },
  Field: {
    leave({ alias: e, name: t, arguments: n, directives: r, selectionSet: s }) {
      const i = ee("", e, ": ") + t;
      let a = i + ee("(", _(n, ", "), ")");
      return a.length > Ey && (a = i + ee(`(
`, mr(_(n, `
`)), `
)`)), _([a, _(r, " "), s], " ");
    }
  },
  Argument: { leave: ({ name: e, value: t }) => e + ": " + t },
  // Fragments
  FragmentSpread: {
    leave: ({ name: e, directives: t }) => "..." + e + ee(" ", _(t, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: e, directives: t, selectionSet: n }) => _(["...", ee("on ", e), _(t, " "), n], " ")
  },
  FragmentDefinition: {
    leave: ({ name: e, typeCondition: t, variableDefinitions: n, directives: r, selectionSet: s }) => (
      // Note: fragment variable definitions are experimental and may be changed
      // or removed in the future.
      `fragment ${e}${ee("(", _(n, ", "), ")")} on ${t} ${ee("", _(r, " "), " ")}` + s
    )
  },
  // Value
  IntValue: { leave: ({ value: e }) => e },
  FloatValue: { leave: ({ value: e }) => e },
  StringValue: {
    leave: ({ value: e, block: t }) => t ? Ny(e) : JSON.stringify(e)
  },
  BooleanValue: { leave: ({ value: e }) => e ? "true" : "false" },
  NullValue: { leave: () => "null" },
  EnumValue: { leave: ({ value: e }) => e },
  ListValue: { leave: ({ values: e }) => "[" + _(e, ", ") + "]" },
  ObjectValue: { leave: ({ fields: e }) => "{" + _(e, ", ") + "}" },
  ObjectField: { leave: ({ name: e, value: t }) => e + ": " + t },
  // Directive
  Directive: {
    leave: ({ name: e, arguments: t }) => "@" + e + ee("(", _(t, ", "), ")")
  },
  // Type
  NamedType: { leave: ({ name: e }) => e },
  ListType: { leave: ({ type: e }) => "[" + e + "]" },
  NonNullType: { leave: ({ type: e }) => e + "!" },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ directives: e, operationTypes: t }) => _(["schema", _(e, " "), Qe(t)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: e, type: t }) => e + ": " + t
  },
  ScalarTypeDefinition: {
    leave: ({ name: e, directives: t }) => _(["scalar", e, _(t, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ name: e, interfaces: t, directives: n, fields: r }) => _([
      "type",
      e,
      ee("implements ", _(t, " & ")),
      _(n, " "),
      Qe(r)
    ], " ")
  },
  FieldDefinition: {
    leave: ({ name: e, arguments: t, type: n, directives: r }) => e + (uc(t) ? ee(`(
`, mr(_(t, `
`)), `
)`) : ee("(", _(t, ", "), ")")) + ": " + n + ee(" ", _(r, " "))
  },
  InputValueDefinition: {
    leave: ({ name: e, type: t, defaultValue: n, directives: r }) => _([e + ": " + t, ee("= ", n), _(r, " ")], " ")
  },
  InterfaceTypeDefinition: {
    leave: ({ name: e, interfaces: t, directives: n, fields: r }) => _([
      "interface",
      e,
      ee("implements ", _(t, " & ")),
      _(n, " "),
      Qe(r)
    ], " ")
  },
  UnionTypeDefinition: {
    leave: ({ name: e, directives: t, types: n }) => _(["union", e, _(t, " "), ee("= ", _(n, " | "))], " ")
  },
  EnumTypeDefinition: {
    leave: ({ name: e, directives: t, values: n }) => _(["enum", e, _(t, " "), Qe(n)], " ")
  },
  EnumValueDefinition: {
    leave: ({ name: e, directives: t }) => _([e, _(t, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ name: e, directives: t, fields: n }) => _(["input", e, _(t, " "), Qe(n)], " ")
  },
  DirectiveDefinition: {
    leave: ({ name: e, arguments: t, repeatable: n, locations: r }) => "directive @" + e + (uc(t) ? ee(`(
`, mr(_(t, `
`)), `
)`) : ee("(", _(t, ", "), ")")) + (n ? " repeatable" : "") + " on " + _(r, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: e, operationTypes: t }) => _(["extend schema", _(e, " "), Qe(t)], " ")
  },
  ScalarTypeExtension: {
    leave: ({ name: e, directives: t }) => _(["extend scalar", e, _(t, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: r }) => _([
      "extend type",
      e,
      ee("implements ", _(t, " & ")),
      _(n, " "),
      Qe(r)
    ], " ")
  },
  InterfaceTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: r }) => _([
      "extend interface",
      e,
      ee("implements ", _(t, " & ")),
      _(n, " "),
      Qe(r)
    ], " ")
  },
  UnionTypeExtension: {
    leave: ({ name: e, directives: t, types: n }) => _(["extend union", e, _(t, " "), ee("= ", _(n, " | "))], " ")
  },
  EnumTypeExtension: {
    leave: ({ name: e, directives: t, values: n }) => _(["extend enum", e, _(t, " "), Qe(n)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: e, directives: t, fields: n }) => _(["extend input", e, _(t, " "), Qe(n)], " ")
  }
}, _y = Object.keys(lc).reduce((e, t) => ({
  ...e,
  [t]: {
    leave: Sy(lc[t].leave)
  }
}), {});
function Oy(e) {
  return Ar(e, _y);
}
function Dy(e) {
  return e.kind === "FieldDefinition";
}
function Ay(e) {
  const t = Cy(e);
  if (t !== void 0)
    return Ry(`
${t}`);
}
function Cy(e) {
  const t = e.loc;
  if (!t)
    return;
  const n = [];
  let r = t.startToken.prev;
  for (; r != null && r.kind === b.COMMENT && r.next != null && r.prev != null && r.line + 1 === r.next.line && r.line !== r.prev.line; ) {
    const s = String(r.value);
    n.push(s), r = r.prev;
  }
  return n.length > 0 ? n.reverse().join(`
`) : void 0;
}
function Ry(e) {
  const t = e.split(/\r\n|[\n\r]/g), n = Ly(t);
  if (n !== 0)
    for (let r = 1; r < t.length; r++)
      t[r] = t[r].slice(n);
  for (; t.length > 0 && dc(t[0]); )
    t.shift();
  for (; t.length > 0 && dc(t[t.length - 1]); )
    t.pop();
  return t.join(`
`);
}
function Ly(e) {
  let t = null;
  for (let n = 1; n < e.length; n++) {
    const r = e[n], s = kd(r);
    if (s !== r.length && (t === null || s < t) && (t = s, t === 0))
      break;
  }
  return t === null ? 0 : t;
}
function kd(e) {
  let t = 0;
  for (; t < e.length && (e[t] === " " || e[t] === "	"); )
    t++;
  return t;
}
function dc(e) {
  return kd(e) === e.length;
}
var L;
(function(e) {
  e.TYPE = "MapperKind.TYPE", e.SCALAR_TYPE = "MapperKind.SCALAR_TYPE", e.ENUM_TYPE = "MapperKind.ENUM_TYPE", e.COMPOSITE_TYPE = "MapperKind.COMPOSITE_TYPE", e.OBJECT_TYPE = "MapperKind.OBJECT_TYPE", e.INPUT_OBJECT_TYPE = "MapperKind.INPUT_OBJECT_TYPE", e.ABSTRACT_TYPE = "MapperKind.ABSTRACT_TYPE", e.UNION_TYPE = "MapperKind.UNION_TYPE", e.INTERFACE_TYPE = "MapperKind.INTERFACE_TYPE", e.ROOT_OBJECT = "MapperKind.ROOT_OBJECT", e.QUERY = "MapperKind.QUERY", e.MUTATION = "MapperKind.MUTATION", e.SUBSCRIPTION = "MapperKind.SUBSCRIPTION", e.DIRECTIVE = "MapperKind.DIRECTIVE", e.FIELD = "MapperKind.FIELD", e.COMPOSITE_FIELD = "MapperKind.COMPOSITE_FIELD", e.OBJECT_FIELD = "MapperKind.OBJECT_FIELD", e.ROOT_FIELD = "MapperKind.ROOT_FIELD", e.QUERY_ROOT_FIELD = "MapperKind.QUERY_ROOT_FIELD", e.MUTATION_ROOT_FIELD = "MapperKind.MUTATION_ROOT_FIELD", e.SUBSCRIPTION_ROOT_FIELD = "MapperKind.SUBSCRIPTION_ROOT_FIELD", e.INTERFACE_FIELD = "MapperKind.INTERFACE_FIELD", e.INPUT_OBJECT_FIELD = "MapperKind.INPUT_OBJECT_FIELD", e.ARGUMENT = "MapperKind.ARGUMENT", e.ENUM_VALUE = "MapperKind.ENUM_VALUE";
})(L || (L = {}));
function bn(e, t) {
  if (t) {
    const n = e[t.name];
    if ($(n))
      return n;
  }
}
function jy(e) {
  if ("getFields" in e) {
    const t = e.getFields();
    for (const n in t)
      return t[n].name === "_fake";
  }
  return !1;
}
function Py(e) {
  switch (e.name) {
    case Vi.name:
      return Vi;
    case Bi.name:
      return Bi;
    case te.name:
      return te;
    case Ee.name:
      return Ee;
    case ys.name:
      return ys;
    default:
      return e;
  }
}
function $y(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const p in e)
    n[p] = e[p];
  const r = /* @__PURE__ */ Object.create(null);
  for (const p in n) {
    const h = n[p];
    if (h == null || p.startsWith("__"))
      continue;
    const m = h.name;
    if (!m.startsWith("__")) {
      if (r[m] != null) {
        console.warn(`Duplicate schema type name ${m} found; keeping the existing one found in the schema`);
        continue;
      }
      r[m] = h;
    }
  }
  for (const p in r)
    r[p] = o(r[p]);
  const s = t.map((p) => i(p));
  return {
    typeMap: r,
    directives: s
  };
  function i(p) {
    if (Rl(p))
      return p;
    const h = p.toConfig();
    return h.args = a(h.args), new xt(h);
  }
  function a(p) {
    const h = {};
    for (const m in p) {
      const g = p[m], k = d(g.type);
      k != null && (g.type = k, h[m] = g);
    }
    return h;
  }
  function o(p) {
    if ($(p)) {
      const h = p.toConfig(), m = {
        ...h,
        fields: () => c(h.fields),
        interfaces: () => l(h.interfaces)
      };
      return new De(m);
    } else if (q(p)) {
      const h = p.toConfig(), m = {
        ...h,
        fields: () => c(h.fields)
      };
      return "interfaces" in m && (m.interfaces = () => l(h.interfaces)), new Ht(m);
    } else if (de(p)) {
      const h = p.toConfig(), m = {
        ...h,
        types: () => l(h.types)
      };
      return new Tr(m);
    } else if (G(p)) {
      const h = p.toConfig(), m = {
        ...h,
        fields: () => u(h.fields)
      };
      return new un(m);
    } else if (ie(p)) {
      const h = p.toConfig();
      return new pt(h);
    } else if (Ae(p)) {
      if (Lr(p))
        return p;
      const h = p.toConfig();
      return new ft(h);
    }
    throw new Error(`Unexpected schema type: ${p}`);
  }
  function c(p) {
    const h = {};
    for (const m in p) {
      const g = p[m], k = d(g.type);
      k != null && g.args && (g.type = k, g.args = a(g.args), h[m] = g);
    }
    return h;
  }
  function u(p) {
    const h = {};
    for (const m in p) {
      const g = p[m], k = d(g.type);
      k != null && (g.type = k, h[m] = g);
    }
    return h;
  }
  function l(p) {
    const h = [];
    for (const m of p) {
      const g = d(m);
      g != null && h.push(g);
    }
    return h;
  }
  function d(p) {
    if (Q(p)) {
      const h = d(p.ofType);
      return h != null ? new ve(h) : null;
    } else if (M(p)) {
      const h = d(p.ofType);
      return h != null ? new F(h) : null;
    } else if (Cr(p)) {
      let h = n[p.name];
      return h === void 0 && (h = jy(p) ? Py(p) : o(p), r[h.name] = n[p.name] = h), h != null ? r[h.name] : null;
    }
    return null;
  }
}
function _s(e, t, n = null, r = null) {
  if (t == null)
    return t;
  const s = Ea(e);
  if (Oe(s))
    return n != null ? n(s, t) : t;
  if (Q(s))
    return fd(t).map((i) => _s(s.ofType, i, n, r));
  if (G(s)) {
    const i = s.getFields(), a = {};
    for (const o in t) {
      const c = i[o];
      c != null && (a[o] = _s(c.type, t[o], n, r));
    }
    return r != null ? r(s, a) : a;
  }
}
function wd(e, t) {
  return _s(e, t, (n, r) => {
    try {
      return n.serialize(r);
    } catch {
      return r;
    }
  });
}
function Td(e, t) {
  return _s(e, t, (n, r) => {
    try {
      return n.parseValue(r);
    } catch {
      return r;
    }
  });
}
function Ji(e, t = {}) {
  const n = Id(Ed(Yi(fc(My(Yi(fc(e.getTypeMap(), e, wd), e, t, (o) => Oe(o)), e, t), e, Td), e, t, (o) => !Oe(o)), e, t), e, t), r = e.getDirectives(), s = Fy(r, e, t), { typeMap: i, directives: a } = $y(n, s);
  return new Js({
    ...e.toConfig(),
    query: bn(i, bn(n, e.getQueryType())),
    mutation: bn(i, bn(n, e.getMutationType())),
    subscription: bn(i, bn(n, e.getSubscriptionType())),
    types: Object.values(i),
    directives: a
  });
}
function Yi(e, t, n, r = () => !0) {
  const s = {};
  for (const i in e)
    if (!i.startsWith("__")) {
      const a = e[i];
      if (a == null || !r(a)) {
        s[i] = a;
        continue;
      }
      const o = zy(t, n, i);
      if (o == null) {
        s[i] = a;
        continue;
      }
      const c = o(a, t);
      if (c === void 0) {
        s[i] = a;
        continue;
      }
      s[i] = c;
    }
  return s;
}
function My(e, t, n) {
  const r = Zy(n);
  return r ? Yi(e, t, {
    [L.ENUM_TYPE]: (s) => {
      const i = s.toConfig(), a = i.values, o = {};
      for (const c in a) {
        const u = a[c], l = r(u, s.name, t, c);
        if (l === void 0)
          o[c] = u;
        else if (Array.isArray(l)) {
          const [d, p] = l;
          o[d] = p === void 0 ? u : p;
        } else l !== null && (o[c] = l);
      }
      return is(new pt({
        ...i,
        values: o
      }));
    }
  }, (s) => ie(s)) : e;
}
function fc(e, t, n) {
  const r = Id(e, t, {
    [L.ARGUMENT]: (s) => {
      if (s.defaultValue === void 0)
        return s;
      const i = Os(e, s.type);
      if (i != null)
        return {
          ...s,
          defaultValue: n(i, s.defaultValue)
        };
    }
  });
  return Ed(r, t, {
    [L.INPUT_OBJECT_FIELD]: (s) => {
      if (s.defaultValue === void 0)
        return s;
      const i = Os(r, s.type);
      if (i != null)
        return {
          ...s,
          defaultValue: n(i, s.defaultValue)
        };
    }
  });
}
function Os(e, t) {
  if (Q(t)) {
    const n = Os(e, t.ofType);
    return n != null ? new ve(n) : null;
  } else if (M(t)) {
    const n = Os(e, t.ofType);
    return n != null ? new F(n) : null;
  } else if (Cr(t)) {
    const n = e[t.name];
    return n ?? null;
  }
  return null;
}
function Ed(e, t, n) {
  const r = {};
  for (const s in e)
    if (!s.startsWith("__")) {
      const i = e[s];
      if (!$(i) && !q(i) && !G(i)) {
        r[s] = i;
        continue;
      }
      const a = Vy(t, n, s);
      if (a == null) {
        r[s] = i;
        continue;
      }
      const o = i.toConfig(), c = o.fields, u = {};
      for (const l in c) {
        const d = c[l], p = a(d, l, s, t);
        if (p === void 0)
          u[l] = d;
        else if (Array.isArray(p)) {
          const [h, m] = p;
          m.astNode != null && (m.astNode = {
            ...m.astNode,
            name: {
              ...m.astNode.name,
              value: h
            }
          }), u[h] = m === void 0 ? d : m;
        } else p !== null && (u[l] = p);
      }
      $(i) ? r[s] = is(new De({
        ...o,
        fields: u
      })) : q(i) ? r[s] = is(new Ht({
        ...o,
        fields: u
      })) : r[s] = is(new un({
        ...o,
        fields: u
      }));
    }
  return r;
}
function Id(e, t, n) {
  const r = {};
  for (const s in e)
    if (!s.startsWith("__")) {
      const i = e[s];
      if (!$(i) && !q(i)) {
        r[s] = i;
        continue;
      }
      const a = By(n);
      if (a == null) {
        r[s] = i;
        continue;
      }
      const o = i.toConfig(), c = o.fields, u = {};
      for (const l in c) {
        const d = c[l], p = d.args;
        if (p == null) {
          u[l] = d;
          continue;
        }
        const h = Object.keys(p);
        if (!h.length) {
          u[l] = d;
          continue;
        }
        const m = {};
        for (const g of h) {
          const k = p[g], E = a(k, l, s, t);
          if (E === void 0)
            m[g] = k;
          else if (Array.isArray(E)) {
            const [I, D] = E;
            m[I] = D;
          } else E !== null && (m[g] = E);
        }
        u[l] = {
          ...d,
          args: m
        };
      }
      $(i) ? r[s] = new De({
        ...o,
        fields: u
      }) : q(i) ? r[s] = new Ht({
        ...o,
        fields: u
      }) : r[s] = new un({
        ...o,
        fields: u
      });
    }
  return r;
}
function Fy(e, t, n) {
  const r = Hy(n);
  if (r == null)
    return e.slice();
  const s = [];
  for (const i of e) {
    const a = r(i, t);
    a === void 0 ? s.push(i) : a !== null && s.push(a);
  }
  return s;
}
function Uy(e, t) {
  var s, i, a;
  const n = e.getType(t), r = [L.TYPE];
  return $(n) ? (r.push(L.COMPOSITE_TYPE, L.OBJECT_TYPE), t === ((s = e.getQueryType()) == null ? void 0 : s.name) ? r.push(L.ROOT_OBJECT, L.QUERY) : t === ((i = e.getMutationType()) == null ? void 0 : i.name) ? r.push(L.ROOT_OBJECT, L.MUTATION) : t === ((a = e.getSubscriptionType()) == null ? void 0 : a.name) && r.push(L.ROOT_OBJECT, L.SUBSCRIPTION)) : G(n) ? r.push(L.INPUT_OBJECT_TYPE) : q(n) ? r.push(L.COMPOSITE_TYPE, L.ABSTRACT_TYPE, L.INTERFACE_TYPE) : de(n) ? r.push(L.COMPOSITE_TYPE, L.ABSTRACT_TYPE, L.UNION_TYPE) : ie(n) ? r.push(L.ENUM_TYPE) : Ae(n) && r.push(L.SCALAR_TYPE), r;
}
function zy(e, t, n) {
  const r = Uy(e, n);
  let s;
  const i = [...r];
  for (; !s && i.length > 0; ) {
    const a = i.pop();
    s = t[a];
  }
  return s ?? null;
}
function qy(e, t) {
  var s, i, a;
  const n = e.getType(t), r = [L.FIELD];
  return $(n) ? (r.push(L.COMPOSITE_FIELD, L.OBJECT_FIELD), t === ((s = e.getQueryType()) == null ? void 0 : s.name) ? r.push(L.ROOT_FIELD, L.QUERY_ROOT_FIELD) : t === ((i = e.getMutationType()) == null ? void 0 : i.name) ? r.push(L.ROOT_FIELD, L.MUTATION_ROOT_FIELD) : t === ((a = e.getSubscriptionType()) == null ? void 0 : a.name) && r.push(L.ROOT_FIELD, L.SUBSCRIPTION_ROOT_FIELD)) : q(n) ? r.push(L.COMPOSITE_FIELD, L.INTERFACE_FIELD) : G(n) && r.push(L.INPUT_OBJECT_FIELD), r;
}
function Vy(e, t, n) {
  const r = qy(e, n);
  let s;
  const i = [...r];
  for (; !s && i.length > 0; ) {
    const a = i.pop();
    s = t[a];
  }
  return s ?? null;
}
function By(e) {
  const t = e[L.ARGUMENT];
  return t ?? null;
}
function Hy(e) {
  const t = e[L.DIRECTIVE];
  return t ?? null;
}
function Zy(e) {
  const t = e[L.ENUM_VALUE];
  return t ?? null;
}
function is(e) {
  if ($(e)) {
    const t = e.toConfig();
    if (t.astNode != null) {
      const n = [];
      for (const r in t.fields) {
        const s = t.fields[r];
        s.astNode != null && n.push(s.astNode);
      }
      t.astNode = {
        ...t.astNode,
        kind: f.OBJECT_TYPE_DEFINITION,
        fields: n
      };
    }
    return t.extensionASTNodes != null && (t.extensionASTNodes = t.extensionASTNodes.map((n) => ({
      ...n,
      kind: f.OBJECT_TYPE_EXTENSION,
      fields: void 0
    }))), new De(t);
  } else if (q(e)) {
    const t = e.toConfig();
    if (t.astNode != null) {
      const n = [];
      for (const r in t.fields) {
        const s = t.fields[r];
        s.astNode != null && n.push(s.astNode);
      }
      t.astNode = {
        ...t.astNode,
        kind: f.INTERFACE_TYPE_DEFINITION,
        fields: n
      };
    }
    return t.extensionASTNodes != null && (t.extensionASTNodes = t.extensionASTNodes.map((n) => ({
      ...n,
      kind: f.INTERFACE_TYPE_EXTENSION,
      fields: void 0
    }))), new Ht(t);
  } else if (G(e)) {
    const t = e.toConfig();
    if (t.astNode != null) {
      const n = [];
      for (const r in t.fields) {
        const s = t.fields[r];
        s.astNode != null && n.push(s.astNode);
      }
      t.astNode = {
        ...t.astNode,
        kind: f.INPUT_OBJECT_TYPE_DEFINITION,
        fields: n
      };
    }
    return t.extensionASTNodes != null && (t.extensionASTNodes = t.extensionASTNodes.map((n) => ({
      ...n,
      kind: f.INPUT_OBJECT_TYPE_EXTENSION,
      fields: void 0
    }))), new un(t);
  } else if (ie(e)) {
    const t = e.toConfig();
    if (t.astNode != null) {
      const n = [];
      for (const r in t.values) {
        const s = t.values[r];
        s.astNode != null && n.push(s.astNode);
      }
      t.astNode = {
        ...t.astNode,
        values: n
      };
    }
    return t.extensionASTNodes != null && (t.extensionASTNodes = t.extensionASTNodes.map((n) => ({
      ...n,
      values: void 0
    }))), new pt(t);
  } else
    return e;
}
function Gy(e) {
  return Wy(e.getTypeMap(), e.getDirectives()), e;
}
function Wy(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const u in e) {
    const l = e[u];
    if (l == null || u.startsWith("__"))
      continue;
    const d = l.name;
    if (!d.startsWith("__")) {
      if (n[d] != null) {
        console.warn(`Duplicate schema type name ${d} found; keeping the existing one found in the schema`);
        continue;
      }
      n[d] = l;
    }
  }
  for (const u in n) {
    const l = n[u];
    e[u] = l;
  }
  for (const u of t)
    u.args = u.args.filter((l) => (l.type = c(l.type), l.type !== null));
  for (const u in e) {
    const l = e[u];
    !u.startsWith("__") && u in n && l != null && r(l);
  }
  for (const u in e)
    !u.startsWith("__") && !(u in n) && delete e[u];
  function r(u) {
    if ($(u)) {
      s(u), i(u);
      return;
    } else if (q(u)) {
      s(u), "getInterfaces" in u && i(u);
      return;
    } else if (de(u)) {
      o(u);
      return;
    } else if (G(u)) {
      a(u);
      return;
    } else if (Oe(u))
      return;
    throw new Error(`Unexpected schema type: ${u}`);
  }
  function s(u) {
    const l = u.getFields();
    for (const [d, p] of Object.entries(l))
      p.args.map((h) => (h.type = c(h.type), h.type === null ? null : h)).filter(Boolean), p.type = c(p.type), p.type === null && delete l[d];
  }
  function i(u) {
    if ("getInterfaces" in u) {
      const l = u.getInterfaces();
      l.push(...l.splice(0).map((d) => c(d)).filter(Boolean));
    }
  }
  function a(u) {
    const l = u.getFields();
    for (const [d, p] of Object.entries(l))
      p.type = c(p.type), p.type === null && delete l[d];
  }
  function o(u) {
    const l = u.getTypes();
    l.push(...l.splice(0).map((d) => c(d)).filter(Boolean));
  }
  function c(u) {
    if (Q(u)) {
      const l = c(u.ofType);
      return l != null ? new ve(l) : null;
    } else if (M(u)) {
      const l = c(u.ofType);
      return l != null ? new F(l) : null;
    } else if (Cr(u)) {
      const l = e[u.name];
      if (l && u !== l)
        return l;
    }
    return u;
  }
}
function xd(e, t) {
  const n = e.getTypeMap();
  for (const r in n) {
    const s = n[r];
    if (!_e(s).name.startsWith("__") && $(s)) {
      const i = s.getFields();
      for (const a in i) {
        const o = i[a];
        t(o, r, a);
      }
    }
  }
}
function pc(e, t) {
  const n = e.getTypeMap();
  for (const r in n) {
    const s = n[r];
    if (!_e(s).name.startsWith("__")) {
      if ($(s)) {
        const i = s.getFields();
        for (const a in i) {
          const o = i[a];
          for (const c of o.args)
            c.defaultValue = t(c.type, c.defaultValue);
        }
      } else if (G(s)) {
        const i = s.getFields();
        for (const a in i) {
          const o = i[a];
          o.defaultValue = t(o.type, o.defaultValue);
        }
      }
    }
  }
}
function gr(e, t = !1, n = !1, r = !1) {
  let s, i = !0;
  const a = e.every((u) => {
    if (Array.isArray(u)) {
      if (s === void 0)
        return s = u.length, !0;
      if (s === u.length)
        return !0;
    } else
      i = !1;
    return !1;
  });
  if (r && a)
    return new Array(s).fill(null).map((u, l) => gr(e.map((d) => d[l]), t, n, r));
  if (i)
    return e.flat(1);
  let o, c;
  t && (c = e.find((u) => hc(u)), o == null && (o = {}), c && Object.setPrototypeOf(o, Object.create(Object.getPrototypeOf(c))));
  for (const u of e)
    if (hc(u)) {
      if (c) {
        const l = Object.getPrototypeOf(o), d = Object.getPrototypeOf(u);
        if (d)
          for (const p of Object.getOwnPropertyNames(d)) {
            const h = Object.getOwnPropertyDescriptor(d, p);
            $a(h) && Object.defineProperty(l, p, h);
          }
      }
      for (const l in u)
        o == null && (o = {}), l in o ? o[l] = gr([o[l], u[l]], t, n, r) : o[l] = u[l];
    } else Array.isArray(u) && Array.isArray(o) ? o = gr([o, u], t, n, r) : o = u;
  return o;
}
function hc(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
function Jy(e) {
  return e && typeof e == "object" && "kind" in e && e.kind === f.DOCUMENT;
}
function Yy(e, t = {}) {
  const { requireResolversForArgs: n, requireResolversForNonScalar: r, requireResolversForAllFields: s } = t;
  if (s && (n || r))
    throw new TypeError("requireResolversForAllFields takes precedence over the more specific assertions. Please configure either requireResolversForAllFields or requireResolversForArgs / requireResolversForNonScalar, but not a combination of them.");
  xd(e, (i, a, o) => {
    s && ki("requireResolversForAllFields", s, i, a, o), n && i.args.length > 0 && ki("requireResolversForArgs", n, i, a, o), r !== "ignore" && !Ae(_e(i.type)) && ki("requireResolversForNonScalar", r, i, a, o);
  });
}
function ki(e, t, n, r, s) {
  if (!n.resolve) {
    const i = `Resolver missing for "${r}.${s}".
To disable this validator, use:
  resolverValidationOptions: {
    ${e}: 'ignore'
  }`;
    if (t === "error")
      throw new Error(i);
    t === "warn" && console.warn(i);
    return;
  }
  if (typeof n.resolve != "function")
    throw new Error(`Resolver "${r}.${s}" must be a function`);
}
function Qy(e, t) {
  Ji(e, {
    [L.ABSTRACT_TYPE]: (n) => {
      if (!n.resolveType) {
        const r = `Type "${n.name}" is missing a "__resolveType" resolver. Pass 'ignore' into "resolverValidationOptions.requireResolversForResolveType" to disable this error.`;
        if (t === "error")
          throw new Error(r);
        t === "warn" && console.warn(r);
      }
    }
  });
}
function Xy(e, t) {
  const n = {}, r = e.getTypeMap();
  for (const s in r) {
    const i = r[s];
    if ("getInterfaces" in i) {
      n[s] = {};
      for (const o of i.getInterfaces())
        if (t[o.name])
          for (const c in t[o.name])
            (c === "__isTypeOf" || !c.startsWith("__")) && (n[s][c] = t[o.name][c]);
      const a = t[s];
      n[s] = {
        ...n[s],
        ...a
      };
    } else {
      const a = t[s];
      a != null && (n[s] = a);
    }
  }
  return n;
}
function Ky({ schema: e, resolvers: t, defaultFieldResolver: n, resolverValidationOptions: r = {}, inheritResolversFromInterfaces: s = !1, updateResolversInPlace: i = !1 }) {
  const { requireResolversToMatchSchema: a = "error", requireResolversForResolveType: o } = r, c = s ? Xy(e, t) : t;
  for (const u in c) {
    const l = c[u];
    if (typeof l !== "object")
      throw new Error(`"${u}" defined in resolvers, but has invalid value "${l}". The resolver's value must be of type object.`);
    const p = e.getType(u);
    if (p == null) {
      const h = `"${u}" defined in resolvers, but not in schema`;
      if (a && a !== "error") {
        a === "warn" && console.warn(h);
        continue;
      }
      throw new Error(h);
    } else if (Lr(p))
      for (const h in l)
        h.startsWith("__") ? p[h.substring(2)] = l[h] : p[h] = l[h];
    else if (ie(p)) {
      const h = p.getValues();
      for (const m in l)
        if (!m.startsWith("__") && !h.some((g) => g.name === m) && a && a !== "ignore") {
          const g = `${p.name}.${m} was defined in resolvers, but not present within ${p.name}`;
          if (a === "error")
            throw new Error(g);
          console.warn(g);
        }
    } else if (de(p)) {
      for (const h in l)
        if (!h.startsWith("__") && a && a !== "ignore") {
          const m = `${p.name}.${h} was defined in resolvers, but ${p.name} is not an object or interface type`;
          if (a === "error")
            throw new Error(m);
          console.warn(m);
        }
    } else if ($(p) || q(p)) {
      for (const h in l)
        if (!h.startsWith("__"))
          if (p.getFields()[h] == null) {
            if (a && a !== "ignore") {
              const k = `${u}.${h} defined in resolvers, but not in schema`;
              if (a === "error")
                throw new Error(k);
              console.error(k);
            }
          } else {
            const k = l[h];
            if (typeof k != "function" && typeof k != "object")
              throw new Error(`Resolver ${u}.${h} must be object or function`);
          }
    }
  }
  return e = i ? ev(e, c, n) : tv(e, c, n), o && o !== "ignore" && Qy(e, o), e;
}
function ev(e, t, n) {
  var s, i, a, o;
  const r = e.getTypeMap();
  for (const c in t) {
    const u = e.getType(c), l = t[c];
    if (Ae(u))
      for (const d in l)
        d.startsWith("__") ? u[d.substring(2)] = l[d] : d === "astNode" && u.astNode != null ? u.astNode = {
          ...u.astNode,
          description: ((s = l == null ? void 0 : l.astNode) == null ? void 0 : s.description) ?? u.astNode.description,
          directives: (u.astNode.directives ?? []).concat(((i = l == null ? void 0 : l.astNode) == null ? void 0 : i.directives) ?? [])
        } : d === "extensionASTNodes" && u.extensionASTNodes != null ? u.extensionASTNodes = u.extensionASTNodes.concat((l == null ? void 0 : l.extensionASTNodes) ?? []) : d === "extensions" && u.extensions != null && l.extensions != null ? u.extensions = Object.assign(/* @__PURE__ */ Object.create(null), u.extensions, l.extensions) : u[d] = l[d];
    else if (ie(u)) {
      const d = u.toConfig(), p = d.values;
      for (const h in l)
        h.startsWith("__") ? d[h.substring(2)] = l[h] : h === "astNode" && d.astNode != null ? d.astNode = {
          ...d.astNode,
          description: ((a = l == null ? void 0 : l.astNode) == null ? void 0 : a.description) ?? d.astNode.description,
          directives: (d.astNode.directives ?? []).concat(((o = l == null ? void 0 : l.astNode) == null ? void 0 : o.directives) ?? [])
        } : h === "extensionASTNodes" && d.extensionASTNodes != null ? d.extensionASTNodes = d.extensionASTNodes.concat((l == null ? void 0 : l.extensionASTNodes) ?? []) : h === "extensions" && u.extensions != null && l.extensions != null ? u.extensions = Object.assign(/* @__PURE__ */ Object.create(null), u.extensions, l.extensions) : p[h] && (p[h].value = l[h]);
      r[c] = new pt(d);
    } else if (de(u))
      for (const d in l)
        d.startsWith("__") && (u[d.substring(2)] = l[d]);
    else if ($(u) || q(u))
      for (const d in l) {
        if (d.startsWith("__")) {
          u[d.substring(2)] = l[d];
          continue;
        }
        const h = u.getFields()[d];
        if (h != null) {
          const m = l[d];
          typeof m == "function" ? h.resolve = m.bind(l) : Sd(h, m);
        }
      }
  }
  return pc(e, wd), Gy(e), pc(e, Td), n != null && xd(e, (c) => {
    c.resolve || (c.resolve = n);
  }), e;
}
function tv(e, t, n) {
  return e = Ji(e, {
    [L.SCALAR_TYPE]: (r) => {
      var a, o;
      const s = r.toConfig(), i = t[r.name];
      if (!Lr(r) && i != null) {
        for (const c in i)
          c.startsWith("__") ? s[c.substring(2)] = i[c] : c === "astNode" && s.astNode != null ? s.astNode = {
            ...s.astNode,
            description: ((a = i == null ? void 0 : i.astNode) == null ? void 0 : a.description) ?? s.astNode.description,
            directives: (s.astNode.directives ?? []).concat(((o = i == null ? void 0 : i.astNode) == null ? void 0 : o.directives) ?? [])
          } : c === "extensionASTNodes" && s.extensionASTNodes != null ? s.extensionASTNodes = s.extensionASTNodes.concat((i == null ? void 0 : i.extensionASTNodes) ?? []) : c === "extensions" && s.extensions != null && i.extensions != null ? s.extensions = Object.assign(/* @__PURE__ */ Object.create(null), r.extensions, i.extensions) : s[c] = i[c];
        return new ft(s);
      }
    },
    [L.ENUM_TYPE]: (r) => {
      var o, c;
      const s = t[r.name], i = r.toConfig(), a = i.values;
      if (s != null) {
        for (const u in s)
          u.startsWith("__") ? i[u.substring(2)] = s[u] : u === "astNode" && i.astNode != null ? i.astNode = {
            ...i.astNode,
            description: ((o = s == null ? void 0 : s.astNode) == null ? void 0 : o.description) ?? i.astNode.description,
            directives: (i.astNode.directives ?? []).concat(((c = s == null ? void 0 : s.astNode) == null ? void 0 : c.directives) ?? [])
          } : u === "extensionASTNodes" && i.extensionASTNodes != null ? i.extensionASTNodes = i.extensionASTNodes.concat((s == null ? void 0 : s.extensionASTNodes) ?? []) : u === "extensions" && i.extensions != null && s.extensions != null ? i.extensions = Object.assign(/* @__PURE__ */ Object.create(null), r.extensions, s.extensions) : a[u] && (a[u].value = s[u]);
        return new pt(i);
      }
    },
    [L.UNION_TYPE]: (r) => {
      const s = t[r.name];
      if (s != null) {
        const i = r.toConfig();
        return s.__resolveType && (i.resolveType = s.__resolveType), new Tr(i);
      }
    },
    [L.OBJECT_TYPE]: (r) => {
      const s = t[r.name];
      if (s != null) {
        const i = r.toConfig();
        return s.__isTypeOf && (i.isTypeOf = s.__isTypeOf), new De(i);
      }
    },
    [L.INTERFACE_TYPE]: (r) => {
      const s = t[r.name];
      if (s != null) {
        const i = r.toConfig();
        return s.__resolveType && (i.resolveType = s.__resolveType), new Ht(i);
      }
    },
    [L.COMPOSITE_FIELD]: (r, s, i) => {
      const a = t[i];
      if (a != null) {
        const o = a[s];
        if (o != null) {
          const c = { ...r };
          return typeof o == "function" ? c.resolve = o.bind(a) : Sd(c, o), c;
        }
      }
    }
  }), n != null && (e = Ji(e, {
    [L.OBJECT_FIELD]: (r) => ({
      ...r,
      resolve: r.resolve != null ? r.resolve : n
    })
  })), e;
}
function Sd(e, t) {
  for (const n in t)
    e[n] = t[n];
}
function Nd(e, t) {
  if (!e || Array.isArray(e) && e.length === 0)
    return {};
  if (!Array.isArray(e))
    return e;
  if (e.length === 1)
    return e[0] || {};
  const n = new Array();
  for (let s of e)
    Array.isArray(s) && (s = Nd(s)), typeof s == "object" && s && n.push(s);
  return gr(n, !0);
}
function nv(e, t, n) {
  const r = rv([...t, ...e].filter($a), n);
  return n && n.sort && r.sort(Ys), r;
}
function rv(e, t) {
  return e.reduce((n, r) => {
    const s = n.findIndex((i) => i.name.value === r.name.value);
    return s === -1 ? n.concat([r]) : (t != null && t.reverseArguments || (n[s] = r), n);
  }, []);
}
function sv(e, t, n) {
  var r;
  return !!(((r = t == null ? void 0 : t[e.name.value]) == null ? void 0 : r.repeatable) ?? (n == null ? void 0 : n.has(e.name.value)));
}
function mc(e, t) {
  return t.some(({ value: n }) => n === e.value);
}
function iv(e, t) {
  const n = [];
  for (const r of [...t, ...e]) {
    const s = n.findIndex((i) => i.name.value === r.name.value);
    if (s === -1)
      n.push(r);
    else {
      const i = n[s];
      if (i.value.kind === "ListValue") {
        const a = i.value.values, o = r.value.values;
        i.value = {
          ...i.value,
          values: _d(a, o, (c, u) => {
            const l = c.value;
            return !l || !u.some((d) => d.value === l);
          })
        };
      } else
        i.value = r.value;
    }
  }
  return n;
}
const Qi = (e, t) => {
  if (e.kind === t.kind)
    switch (e.kind) {
      case f.LIST:
        return e.values.length === t.values.length && e.values.every((n) => t.values.find((r) => Qi(n, r)));
      case f.VARIABLE:
      case f.NULL:
        return !0;
      case f.OBJECT:
        return e.fields.length === t.fields.length && e.fields.every((n) => t.fields.find((r) => n.name.value === r.name.value && Qi(n.value, r.value)));
      default:
        return e.value === t.value;
    }
  return !1;
}, av = (e, t) => e.name.value === t.name.value && e.value.kind === t.value.kind && Qi(e.value, t.value), ov = (e, t) => {
  var r, s, i;
  return !!(e.name.value === t.name.value && (e.arguments === t.arguments || ((r = e.arguments) == null ? void 0 : r.length) === ((s = t.arguments) == null ? void 0 : s.length) && ((i = e.arguments) == null ? void 0 : i.every((a) => {
    var o;
    return (o = t.arguments) == null ? void 0 : o.find((c) => av(a, c));
  }))));
};
function Ot(e = [], t = [], n, r) {
  const s = n && n.reverseDirectives, i = s ? e : t, a = s ? t : e, o = [];
  for (const c of [...i, ...a])
    if (sv(c, r, n == null ? void 0 : n.repeatableLinkImports))
      o.find((l) => ov(c, l)) || o.push(c);
    else {
      const u = o.findIndex((l) => l.name.value === c.name.value);
      if (u === -1)
        o.push(c);
      else {
        const l = iv(c.arguments ?? [], o[u].arguments ?? []);
        o[u] = {
          ...o[u],
          arguments: l.length === 0 ? void 0 : l
        };
      }
    }
  return o;
}
function cv(e, t) {
  return t ? {
    ...e,
    arguments: _d(t.arguments || [], e.arguments || [], (n, r) => !mc(n.name, r.map((s) => s.name))),
    locations: [
      ...t.locations,
      ...e.locations.filter((n) => !mc(n, t.locations))
    ]
  } : e;
}
function _d(e, t, n) {
  return e.concat(t.filter((r) => n(r, e)));
}
function uv(e, t, n, r) {
  if (n != null && n.consistentEnumMerge) {
    const a = [];
    e && a.push(...e), e = t, t = a;
  }
  const s = /* @__PURE__ */ new Map();
  if (e)
    for (const a of e)
      s.set(a.name.value, a);
  if (t)
    for (const a of t) {
      const o = a.name.value;
      if (s.has(o)) {
        const c = s.get(o);
        c.description = a.description || c.description, c.directives = Ot(a.directives, c.directives, r);
      } else
        s.set(o, a);
    }
  const i = [...s.values()];
  return n && n.sort && i.sort(Ys), i;
}
function lv(e, t, n, r) {
  return t ? {
    name: e.name,
    description: e.description || t.description,
    kind: n != null && n.convertExtensions || e.kind === "EnumTypeDefinition" || t.kind === "EnumTypeDefinition" ? "EnumTypeDefinition" : "EnumTypeExtension",
    loc: e.loc,
    directives: Ot(e.directives, t.directives, n, r),
    values: uv(e.values, t.values, n)
  } : n != null && n.convertExtensions ? {
    ...e,
    kind: f.ENUM_TYPE_DEFINITION
  } : e;
}
function dv(e) {
  return typeof e == "string";
}
function fv(e) {
  return e instanceof ba;
}
function gc(e) {
  let t = e;
  for (; t.kind === f.LIST_TYPE || t.kind === "NonNullType"; )
    t = t.type;
  return t;
}
function yc(e) {
  return e.kind !== f.NAMED_TYPE;
}
function Xi(e) {
  return e.kind === f.LIST_TYPE;
}
function sn(e) {
  return e.kind === f.NON_NULL_TYPE;
}
function Ds(e) {
  return Xi(e) ? `[${Ds(e.type)}]` : sn(e) ? `${Ds(e.type)}!` : e.name.value;
}
var Ut;
(function(e) {
  e[e.A_SMALLER_THAN_B = -1] = "A_SMALLER_THAN_B", e[e.A_EQUALS_B = 0] = "A_EQUALS_B", e[e.A_GREATER_THAN_B = 1] = "A_GREATER_THAN_B";
})(Ut || (Ut = {}));
function pv(e, t) {
  return e == null && t == null ? Ut.A_EQUALS_B : e == null ? Ut.A_SMALLER_THAN_B : t == null ? Ut.A_GREATER_THAN_B : e < t ? Ut.A_SMALLER_THAN_B : e > t ? Ut.A_GREATER_THAN_B : Ut.A_EQUALS_B;
}
function hv(e, t) {
  const n = e.findIndex((r) => r.name.value === t.name.value);
  return [n > -1 ? e[n] : null, n];
}
function Ma(e, t, n, r, s) {
  const i = [];
  if (n != null && i.push(...n), t != null)
    for (const a of t) {
      const [o, c] = hv(i, a);
      if (o && !(r != null && r.ignoreFieldConflicts)) {
        const u = (r == null ? void 0 : r.onFieldTypeConflict) && r.onFieldTypeConflict(o, a, e, r == null ? void 0 : r.throwOnConflict) || mv(e, o, a, r == null ? void 0 : r.throwOnConflict);
        u.arguments = nv(a.arguments || [], o.arguments || [], r), u.directives = Ot(a.directives, o.directives, r, s), u.description = a.description || o.description, i[c] = u;
      } else
        i.push(a);
    }
  if (r && r.sort && i.sort(Ys), r && r.exclusions) {
    const a = r.exclusions;
    return i.filter((o) => !a.includes(`${e.name.value}.${o.name.value}`));
  }
  return i;
}
function mv(e, t, n, r = !1) {
  const s = Ds(t.type), i = Ds(n.type);
  if (s !== i) {
    const a = gc(t.type), o = gc(n.type);
    if (a.name.value !== o.name.value)
      throw new Error(`Field "${n.name.value}" already defined with a different type. Declared as "${a.name.value}", but you tried to override with "${o.name.value}"`);
    if (!ur(t.type, n.type, !r))
      throw new Error(`Field '${e.name.value}.${t.name.value}' changed type from '${s}' to '${i}'`);
  }
  return sn(n.type) && !sn(t.type) && (t.type = n.type), t;
}
function ur(e, t, n = !1) {
  if (!yc(e) && !yc(t))
    return e.toString() === t.toString();
  if (sn(t)) {
    const r = sn(e) ? e.type : e;
    return ur(r, t.type);
  }
  return sn(e) ? ur(t, e, n) : Xi(e) ? Xi(t) && ur(e.type, t.type) || sn(t) && ur(e, t.type) : !1;
}
function gv(e, t, n, r) {
  if (t)
    try {
      return {
        name: e.name,
        description: e.description || t.description,
        kind: n != null && n.convertExtensions || e.kind === "InputObjectTypeDefinition" || t.kind === "InputObjectTypeDefinition" ? "InputObjectTypeDefinition" : "InputObjectTypeExtension",
        loc: e.loc,
        fields: Ma(e, e.fields, t.fields, n),
        directives: Ot(e.directives, t.directives, n, r)
      };
    } catch (s) {
      throw new Error(`Unable to merge GraphQL input type "${e.name.value}": ${s.message}`);
    }
  return n != null && n.convertExtensions ? {
    ...e,
    kind: f.INPUT_OBJECT_TYPE_DEFINITION
  } : e;
}
function yv(e, t) {
  return !!e.find((n) => n.name.value === t.name.value);
}
function Fa(e = [], t = [], n = {}) {
  const r = [...t, ...e.filter((s) => !yv(t, s))];
  return n && n.sort && r.sort(Ys), r;
}
function vv(e, t, n, r) {
  if (t)
    try {
      return {
        name: e.name,
        description: e.description || t.description,
        kind: n != null && n.convertExtensions || e.kind === "InterfaceTypeDefinition" || t.kind === "InterfaceTypeDefinition" ? "InterfaceTypeDefinition" : "InterfaceTypeExtension",
        loc: e.loc,
        fields: Ma(e, e.fields, t.fields, n, r),
        directives: Ot(e.directives, t.directives, n, r),
        interfaces: e.interfaces ? Fa(e.interfaces, t.interfaces, n) : void 0
      };
    } catch (s) {
      throw new Error(`Unable to merge GraphQL interface "${e.name.value}": ${s.message}`);
    }
  return n != null && n.convertExtensions ? {
    ...e,
    kind: f.INTERFACE_TYPE_DEFINITION
  } : e;
}
function bv(e, t, n, r) {
  return t ? {
    name: e.name,
    description: e.description || t.description,
    kind: n != null && n.convertExtensions || e.kind === "ScalarTypeDefinition" || t.kind === "ScalarTypeDefinition" ? "ScalarTypeDefinition" : "ScalarTypeExtension",
    loc: e.loc,
    directives: Ot(e.directives, t.directives, n, r)
  } : n != null && n.convertExtensions ? {
    ...e,
    kind: f.SCALAR_TYPE_DEFINITION
  } : e;
}
const Ki = {
  query: "Query",
  mutation: "Mutation",
  subscription: "Subscription"
};
function kv(e = [], t = []) {
  const n = [];
  for (const r in Ki) {
    const s = e.find((i) => i.operation === r) || t.find((i) => i.operation === r);
    s && n.push(s);
  }
  return n;
}
function wv(e, t, n, r) {
  return t ? {
    kind: e.kind === f.SCHEMA_DEFINITION || t.kind === f.SCHEMA_DEFINITION ? f.SCHEMA_DEFINITION : f.SCHEMA_EXTENSION,
    description: e.description || t.description,
    directives: Ot(e.directives, t.directives, n, r),
    operationTypes: kv(e.operationTypes, t.operationTypes)
  } : n != null && n.convertExtensions ? {
    ...e,
    kind: f.SCHEMA_DEFINITION
  } : e;
}
function Tv(e, t, n, r) {
  if (t)
    try {
      return {
        name: e.name,
        description: e.description || t.description,
        kind: n != null && n.convertExtensions || e.kind === "ObjectTypeDefinition" || t.kind === "ObjectTypeDefinition" ? "ObjectTypeDefinition" : "ObjectTypeExtension",
        loc: e.loc,
        fields: Ma(e, e.fields, t.fields, n, r),
        directives: Ot(e.directives, t.directives, n, r),
        interfaces: Fa(e.interfaces, t.interfaces, n)
      };
    } catch (s) {
      throw new Error(`Unable to merge GraphQL type "${e.name.value}": ${s.message}`);
    }
  return n != null && n.convertExtensions ? {
    ...e,
    kind: f.OBJECT_TYPE_DEFINITION
  } : e;
}
function Ev(e, t, n, r) {
  return t ? {
    name: e.name,
    description: e.description || t.description,
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: Ot(e.directives, t.directives, n, r),
    kind: n != null && n.convertExtensions || e.kind === "UnionTypeDefinition" || t.kind === "UnionTypeDefinition" ? f.UNION_TYPE_DEFINITION : f.UNION_TYPE_EXTENSION,
    loc: e.loc,
    types: Fa(e.types, t.types, n)
  } : n != null && n.convertExtensions ? {
    ...e,
    kind: f.UNION_TYPE_DEFINITION
  } : e;
}
const _n = "SCHEMA_DEF_SYMBOL";
function Iv(e) {
  return "name" in e;
}
function vc(e, t, n = {}) {
  var s, i, a;
  const r = n;
  for (const o of e)
    if (Iv(o)) {
      const c = (s = o.name) == null ? void 0 : s.value;
      if (t != null && t.commentDescriptions && Iy(o), c == null)
        continue;
      if ((i = t == null ? void 0 : t.exclusions) != null && i.includes(c + ".*") || (a = t == null ? void 0 : t.exclusions) != null && a.includes(c))
        delete r[c];
      else
        switch (o.kind) {
          case f.OBJECT_TYPE_DEFINITION:
          case f.OBJECT_TYPE_EXTENSION:
            r[c] = Tv(o, r[c], t, n);
            break;
          case f.ENUM_TYPE_DEFINITION:
          case f.ENUM_TYPE_EXTENSION:
            r[c] = lv(o, r[c], t, n);
            break;
          case f.UNION_TYPE_DEFINITION:
          case f.UNION_TYPE_EXTENSION:
            r[c] = Ev(o, r[c], t, n);
            break;
          case f.SCALAR_TYPE_DEFINITION:
          case f.SCALAR_TYPE_EXTENSION:
            r[c] = bv(o, r[c], t, n);
            break;
          case f.INPUT_OBJECT_TYPE_DEFINITION:
          case f.INPUT_OBJECT_TYPE_EXTENSION:
            r[c] = gv(o, r[c], t, n);
            break;
          case f.INTERFACE_TYPE_DEFINITION:
          case f.INTERFACE_TYPE_EXTENSION:
            r[c] = vv(o, r[c], t, n);
            break;
          case f.DIRECTIVE_DEFINITION:
            r[c] && c in {} && (xv(r[c]) || (r[c] = void 0)), r[c] = cv(o, r[c]);
            break;
        }
    } else (o.kind === f.SCHEMA_DEFINITION || o.kind === f.SCHEMA_EXTENSION) && (r[_n] = wv(o, r[_n], t));
  return r;
}
function xv(e) {
  return e != null && typeof e == "object" && "kind" in e && typeof e.kind == "string";
}
function Od(e) {
  return e.as ?? e.url.name;
}
function Sv(e) {
  const t = Od(e);
  return t && `@${t}`;
}
function wi(e, t) {
  if (e.url.name && t === `@${e.url.name}`)
    return Sv(e).substring(1);
  const n = e.imports.find((s) => s.name === t), r = (n == null ? void 0 : n.as) ?? (n == null ? void 0 : n.name) ?? Nv(Od(e), t);
  return r.startsWith("@") ? r.substring(1) : r;
}
function Nv(e, t) {
  return e != null && e.length ? t.startsWith("@") ? `@${e}__${t.substring(1)}` : `${e}__${t}` : t;
}
function _v(e) {
  var n, r;
  let t = [];
  for (const s of e.definitions)
    if (s.kind === f.SCHEMA_EXTENSION || s.kind === f.SCHEMA_DEFINITION) {
      const i = (n = s.directives) == null ? void 0 : n.filter((u) => u.name.value === "link"), a = (i == null ? void 0 : i.map((u) => Ov(u.arguments ?? [])).filter((u) => u !== void 0)) ?? [];
      t = t.concat(a);
      const o = (r = s.directives) == null ? void 0 : r.filter(({ name: u }) => u.value === "core"), c = o == null ? void 0 : o.map((u) => Dv(u.arguments ?? [])).filter((u) => u !== void 0);
      c && (t = t.concat(...c));
    }
  return t;
}
function Ov(e) {
  let t, n = [], r;
  for (const s of e)
    switch (s.name.value) {
      case "url": {
        s.value.kind === f.STRING && (t = Dd(s.value.value));
        break;
      }
      case "import": {
        n = Av(s.value);
        break;
      }
      case "as": {
        s.value.kind === f.STRING && (r = s.value.value ?? void 0);
        break;
      }
    }
  if (t !== void 0)
    return {
      url: t,
      as: r,
      imports: n
    };
}
function Dv(e) {
  const t = e.find(({ name: n, value: r }) => n.value === "feature" && r.kind === f.STRING);
  if (t)
    return {
      url: Dd(t.value.value),
      imports: []
    };
}
function Av(e) {
  return e.kind === f.LIST ? e.values.map((n) => {
    let r;
    if (n.kind === f.STRING)
      r = { name: n.value };
    else if (n.kind === f.OBJECT) {
      let s = "", i;
      for (const a of n.fields)
        a.name.value === "name" ? a.value.kind === f.STRING && (s = a.value.value) : a.name.value === "as" && a.value.kind === f.STRING && (i = a.value.value);
      r = { name: s, as: i };
    }
    return r;
  }).filter((n) => n !== void 0) : [];
}
const Cv = /v(\d{1,3})\.(\d{1,4})/i;
function Dd(e) {
  const t = new URL(e), n = t.pathname.split("/").filter(Boolean), r = n[n.length - 1];
  if (r) {
    if (Cv.test(r)) {
      const s = n[n.length - 2];
      return {
        identity: t.origin + (s ? `/${n.slice(0, n.length - 1).join("/")}` : ""),
        name: s ?? null,
        version: r
      };
    }
    return {
      identity: `${t.origin}/${n.join("/")}`,
      name: r,
      version: null
    };
  }
  return {
    identity: t.origin,
    name: null,
    version: null
  };
}
function bc(e, t) {
  Wi();
  const n = {
    kind: f.DOCUMENT,
    definitions: Rv(e, {
      useSchemaDefinition: !0,
      forceSchemaDefinition: !1,
      throwOnConflict: !1,
      commentDescriptions: !1,
      ...t
    })
  };
  let r;
  return t != null && t.commentDescriptions ? r = Oy(n) : r = n, Wi(), r;
}
function In(e, t, n = [], r = [], s = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set()) {
  const a = (o) => {
    i.add(o);
  };
  if (e && !s.has(e))
    if (s.add(e), typeof e == "function")
      In(e(), t, n, r, s, i);
    else if (Array.isArray(e))
      for (const o of e)
        In(o, t, n, r, s, i);
    else if (Da(e)) {
      const o = dy(e, t);
      In(o.definitions, t, n, r, s, i);
    } else if (dv(e) || fv(e)) {
      const o = Vs(e, t);
      In(o.definitions, t, n, r, s, i);
    } else if (typeof e == "object" && Ig(e)) {
      const o = _v({
        definitions: [e],
        kind: f.DOCUMENT
      }), c = "https://specs.apollo.dev/federation", u = "https://specs.apollo.dev/link", l = o.find((p) => p.url.identity === c);
      l && (a(wi(l, "@composeDirective")), a(wi(l, "@key")));
      const d = o.find((p) => p.url.identity === u);
      d && a(wi(d, "@link")), e.kind === f.DIRECTIVE_DEFINITION ? n.push(e) : r.push(e);
    } else if (Jy(e))
      In(e.definitions, t, n, r, s, i);
    else
      throw new Error(`typeDefs must contain only strings, documents, schemas, or functions, got ${typeof e}`);
  return { allDirectives: n, allNodes: r, repeatableLinkImports: i };
}
function Rv(e, t) {
  var c, u, l;
  Wi();
  const { allDirectives: n, allNodes: r, repeatableLinkImports: s } = In(e, t), i = vc(n, t);
  t.repeatableLinkImports = s;
  const a = vc(r, t, i);
  if (t != null && t.useSchemaDefinition) {
    const d = a[_n] || {
      kind: f.SCHEMA_DEFINITION,
      operationTypes: []
    }, p = d.operationTypes;
    for (const h in Ki)
      if (!p.find((g) => g.operation === h)) {
        const g = Ki[h], k = a[g];
        k != null && k.name != null && p.push({
          kind: f.OPERATION_TYPE_DEFINITION,
          type: {
            kind: f.NAMED_TYPE,
            name: k.name
          },
          operation: h
        });
      }
    ((c = d == null ? void 0 : d.operationTypes) == null ? void 0 : c.length) != null && d.operationTypes.length > 0 && (a[_n] = d);
  }
  t != null && t.forceSchemaDefinition && !((l = (u = a[_n]) == null ? void 0 : u.operationTypes) != null && l.length) && (a[_n] = {
    kind: f.SCHEMA_DEFINITION,
    operationTypes: [
      {
        kind: f.OPERATION_TYPE_DEFINITION,
        operation: "query",
        type: {
          kind: f.NAMED_TYPE,
          name: {
            kind: f.NAME,
            value: "Query"
          }
        }
      }
    ]
  });
  const o = Object.values(a);
  if (t != null && t.sort) {
    const d = typeof t.sort == "function" ? t.sort : pv;
    o.sort((p, h) => {
      var m, g;
      return d((m = p.name) == null ? void 0 : m.value, (g = h.name) == null ? void 0 : g.value);
    });
  }
  return o;
}
function kn(e, t) {
  if (!(!e || !t || t === e.extensions)) {
    if (!e.extensions) {
      e.extensions = t;
      return;
    }
    e.extensions = gr([e.extensions, t], !1, !0);
  }
}
function Lv(e, t) {
  kn(e, t.schemaExtensions);
  for (const [n, r] of Object.entries(t.types || {})) {
    const s = e.getType(n);
    if (s) {
      if (kn(s, r.extensions), r.type === "object" || r.type === "interface")
        for (const [i, a] of Object.entries(r.fields)) {
          const o = s.getFields()[i];
          if (o) {
            kn(o, a.extensions);
            for (const [c, u] of Object.entries(a.arguments))
              kn(o.args.find((l) => l.name === c), u);
          }
        }
      else if (r.type === "input")
        for (const [i, a] of Object.entries(r.fields)) {
          const o = s.getFields()[i];
          kn(o, a.extensions);
        }
      else if (r.type === "enum")
        for (const [i, a] of Object.entries(r.values)) {
          const o = s.getValue(i);
          kn(o, a);
        }
    }
  }
  return e;
}
function Ad({ typeDefs: e, resolvers: t = {}, resolverValidationOptions: n = {}, inheritResolversFromInterfaces: r = !1, updateResolversInPlace: s = !1, schemaExtensions: i, defaultFieldResolver: a, ...o }) {
  if (typeof n != "object")
    throw new Error("Expected `resolverValidationOptions` to be an object");
  if (!e)
    throw new Error("Must provide typeDefs");
  let c;
  if (Da(e))
    c = e;
  else if (o != null && o.commentDescriptions) {
    const u = bc(e, {
      ...o,
      commentDescriptions: !0
    });
    c = K0(u, o);
  } else {
    const u = bc(e, o);
    c = dd(u, o);
  }
  if (c = Ky({
    schema: c,
    resolvers: Nd(t),
    resolverValidationOptions: n,
    inheritResolversFromInterfaces: r,
    updateResolversInPlace: s,
    defaultFieldResolver: a
  }), Object.keys(n).length > 0 && Yy(c, n), i)
    for (const u of fd(i))
      Lv(c, u);
  return c;
}
const jv = `
    type User {
        id: Int!
        username: String!
        email: String!
        firstName: String
        secondName: String
        description: String
        profileImage: String
        creationDate: String
        modifiedDate: String
    }

    type SuggestedUser {
        id: Int!
        username: String!
        description: String
        photo: String
    }

    type Group {
        id: Int!
        title: String!
        photo: String
        membersCount: Int!
    }

    type Post {
        id: Int!
        authorId: Int!
        author: User!
        title: String!
        content: String!
        image: String
        creationDate: String!
        modifiedDate: String!
        likesCount: Int!
        commentsCount: Int!
        likedByUsers: [User]
    }

    type Comment {
        id: Int!
        postId: Int!
        authorId: Int!
        text: String!
        creationDate: String!
        modifiedDate: String!
    }

    type Like {
        id: Int!
        userId: Int!
        postId: Int!
        creationDate: String!
    }

    type LoginResponse {
        token: String!
        user: User!
    }

    input UpdateProfileInput {
        username: String
        email: String
        firstName: String
        secondName: String
        description: String
        profileImage: String
    }

    input CreatePostInput {
        title: String!
        content: String!
        image: String
    }

    input CreateGroupInput {
        title: String!
        photo: String
    }

    type Query {
        me: User
        suggestedUsers: [SuggestedUser]

        allGroups: [Group]
        group(id: Int!): Group

        allPosts: [Post]
        post(id: Int!): Post
        postComments(postId: Int!): [Comment]
        allComments: [Comment]

        # /me/*
        mePosts: [Post]
        meComments: [Comment]
        meCommentsCount: Int!
        meLikes: [Like]
        meLikesCount: Int!
    }

    type Mutation {
        # Auth
        login(email: String!, password: String!): LoginResponse
        signup(email: String!, password: String!): Boolean!
        logout: Boolean!

        # User
        updateProfile(input: UpdateProfileInput!): User

        # Posts
        createPost(input: CreatePostInput!): Post
        updatePost(id: Int!, input: CreatePostInput!): Post
        deletePost(id: Int!): Boolean!
        likePost(postId: Int!): Post
        dislikePost(postId: Int!): Post

        # Comments
        createComment(postId: Int!, text: String!): Comment
        updateComment(id: Int!, text: String!): Comment
        deleteComment(id: Int!): Boolean!

        # Groups
        createGroup(input: CreateGroupInput!): Group
        updateGroup(id: Int!, input: CreateGroupInput!): Group
        deleteGroup(id: Int!): Boolean!
    }
`, xn = Dr, Pv = Ms, kc = Fs, wc = Us, Lt = async (e) => {
  const t = await fe(e.headers);
  if (t.error)
    throw new Error("AUTH_ERROR_CODE_401");
  const n = t.userId, r = xn.find((s) => Number(s.id) === Number(n));
  if (!r)
    throw new Error("User not found in mock data.");
  return r;
}, Tc = {
  Query: {
    me: async (e, t, { request: n }) => await Lt(n),
    mePosts: async (e, t, { request: n }) => {
      const r = await Lt(n);
      return Pv.filter(
        (i) => Number(i.authorId) === Number(r.id)
      );
    },
    meComments: async (e, t, { request: n }) => {
      const r = await Lt(n);
      return kc.filter(
        (i) => Number(i.authorId) === Number(r.id)
      );
    },
    meCommentsCount: async (e, t, { request: n }) => {
      const r = await Lt(n);
      return kc.filter(
        (i) => Number(i.authorId) === Number(r.id)
      ).length;
    },
    meLikes: async (e, t, { request: n }) => {
      const r = await Lt(n);
      return wc.filter(
        (i) => Number(i.userId) === Number(r.id)
      );
    },
    meLikesCount: async (e, t, { request: n }) => {
      const r = await Lt(n);
      return wc.filter(
        (i) => Number(i.userId) === Number(r.id)
      ).length;
    },
    suggestedUsers: async (e, t, { request: n }) => {
      const r = await Lt(n);
      return xn.filter((i) => Number(i.id) !== Number(r.id)).map((i) => ({
        id: i.id,
        username: i.username,
        description: i.description,
        photo: i.profileImage
      }));
    }
  },
  Mutation: {
    login: async (e, { email: t, password: n }) => {
      const r = xn.find((s) => s.email === t);
      if (r && n === $s)
        return {
          token: await il(r.id),
          user: r
        };
      throw new Error("Incorrect email or password");
    },
    signup: () => !0,
    logout: (e, t, { request: n }) => {
      const r = ga(n);
      return r && sl(r), !0;
    },
    updateProfile: async (e, { input: t }, { request: n }) => {
      const r = await Lt(n), s = xn.findIndex(
        (a) => Number(a.id) === Number(r.id)
      );
      if (s === -1)
        throw new Error("User profile not found in mock data.");
      const i = {
        ...xn[s],
        ...t,
        modifiedDate: (/* @__PURE__ */ new Date()).toISOString()
      };
      return xn[s] = i, i;
    }
  }
}, Ne = Ms, Ve = Fs, Ti = Dr, yt = Us, vt = async (e) => {
  const t = await fe(e.headers);
  if (t.error)
    throw new Error("UNAUTHENTICATED");
  return t.userId;
}, Ei = {
  Post: {
    author: (e) => {
      const t = Number(e.authorId);
      return Ti.find(
        (r) => Number(r.id) === t
      );
    },
    likedByUsers: (e) => {
      if (!Array.isArray(yt) || !Array.isArray(Ti))
        return [];
      const t = yt.filter((r) => Number(r.postId) === Number(e.id)).map((r) => r.userId);
      return Ti.filter(
        (r) => t.some((s) => Number(s) === Number(r.id))
      );
    },
    likesCount: (e) => yt.filter((t) => Number(t.postId) === Number(e.id)).length,
    commentsCount: (e) => Ve.filter((t) => Number(t.postId) === Number(e.id)).length
  },
  Query: {
    allPosts: () => Ne,
    post: (e, { id: t }) => Ne.find((n) => Number(n.id) === Number(t)),
    allComments: () => Ve,
    postComments: async (e, { postId: t }, { request: n }) => (await vt(n), Ve.filter((r) => Number(r.postId) === Number(t)))
  },
  Mutation: {
    createPost: async (e, { input: t }, { request: n }) => {
      const r = await vt(n), i = (Ne.length > 0 ? Math.max(...Ne.map((o) => o.id)) : 100) + 1, a = {
        ...t,
        id: i,
        authorId: Number(r),
        creationDate: (/* @__PURE__ */ new Date()).toISOString(),
        modifiedDate: (/* @__PURE__ */ new Date()).toISOString(),
        likesCount: 0,
        commentsCount: 0
      };
      return Ne.push(a), a;
    },
    updatePost: async (e, { id: t, input: n }, { request: r }) => {
      const s = await vt(r), i = Ne.findIndex(
        (o) => Number(o.id) === Number(t) && Number(o.authorId) === Number(s)
      );
      if (i === -1)
        throw new Error("Post not found or access denied");
      const a = {
        ...Ne[i],
        ...n,
        modifiedDate: (/* @__PURE__ */ new Date()).toISOString()
      };
      return Ne[i] = a, a;
    },
    deletePost: async (e, { id: t }, { request: n }) => {
      const r = await vt(n), s = Ne.findIndex(
        (i) => Number(i.id) === Number(t) && Number(i.authorId) === Number(r)
      );
      return s === -1 ? !1 : (Ne.splice(s, 1), !0);
    },
    likePost: async (e, { postId: t }, { request: n }) => {
      const r = await vt(n), s = Ne.find((a) => Number(a.id) === Number(t));
      if (!s)
        throw new Error("Post not found");
      if (!yt.find(
        (a) => Number(a.userId) === Number(r) && Number(a.postId) === Number(t)
      )) {
        s.likesCount += 1;
        const o = {
          id: (yt.length > 0 ? Math.max(...yt.map((c) => c.id)) : 0) + 1,
          userId: Number(r),
          postId: t,
          creationDate: (/* @__PURE__ */ new Date()).toISOString()
        };
        yt.push(o);
      }
      return s;
    },
    dislikePost: async (e, { postId: t }, { request: n }) => {
      const r = await vt(n), s = Ne.find((a) => Number(a.id) === Number(t));
      if (!s)
        throw new Error("Post not found");
      const i = yt.findIndex(
        (a) => Number(a.userId) === Number(r) && Number(a.postId) === Number(t)
      );
      return i !== -1 && (s.likesCount > 0 && (s.likesCount -= 1), yt.splice(i, 1)), s;
    },
    createComment: async (e, { postId: t, text: n }, { request: r }) => {
      const s = await vt(r), o = {
        id: (Ve.length > 0 ? Math.max(...Ve.map((u) => u.id)) : 0) + 1,
        postId: t,
        text: n,
        authorId: Number(s),
        creationDate: (/* @__PURE__ */ new Date()).toISOString(),
        modifiedDate: (/* @__PURE__ */ new Date()).toISOString()
      }, c = Ne.find((u) => Number(u.id) === Number(t));
      return c && (c.commentsCount += 1), Ve.push(o), o;
    },
    updateComment: async (e, { id: t, text: n }, { request: r }) => {
      const s = await vt(r), i = Ve.findIndex(
        (o) => Number(o.id) === Number(t) && Number(o.authorId) === Number(s)
      );
      if (i === -1)
        throw new Error("Comment not found or access denied");
      const a = {
        ...Ve[i],
        text: n,
        modifiedDate: (/* @__PURE__ */ new Date()).toISOString()
      };
      return Ve[i] = a, a;
    },
    deleteComment: async (e, { id: t }, { request: n }) => {
      const r = await vt(n), s = Ve.findIndex(
        (o) => Number(o.id) === Number(t) && Number(o.authorId) === Number(r)
      );
      if (s === -1)
        return !1;
      const i = Ve[s].postId;
      Ve.splice(s, 1);
      const a = Ne.find((o) => Number(o.id) === Number(i));
      return a && a.commentsCount > 0 && (a.commentsCount -= 1), !0;
    }
  }
}, ot = ll, Jr = async (e) => {
  if ((await fe(e.headers)).error)
    throw new Error("UNAUTHENTICATED");
  return !0;
}, Ec = {
  Query: {
    allGroups: async (e, t, { request: n }) => (await Jr(n), ot),
    group: (e, { id: t }) => ot.find((n) => n.id === t)
  },
  Mutation: {
    createGroup: async (e, { input: t }, { request: n }) => {
      await Jr(n);
      const s = (ot.length > 0 ? Math.max(...ot.map((a) => a.id)) : 0) + 1, i = {
        ...t,
        id: s,
        membersCount: 1
      };
      return ot.push(i), i;
    },
    updateGroup: async (e, { id: t, input: n }, { request: r }) => {
      await Jr(r);
      const s = ot.findIndex((a) => a.id === t);
      if (s === -1)
        throw new Error("Group not found");
      const i = {
        ...ot[s],
        ...n
      };
      return ot[s] = i, i;
    },
    deleteGroup: async (e, { id: t }, { request: n }) => {
      await Jr(n);
      const r = ot.findIndex((s) => s.id === t);
      return r === -1 ? !1 : (ot.splice(r, 1), !0);
    }
  }
}, $v = "/api/graphql", Mv = {
  Query: {
    ...Tc.Query,
    ...Ei.Query,
    ...Ec.Query
  },
  Mutation: {
    ...Tc.Mutation,
    ...Ei.Mutation,
    ...Ec.Mutation
  },
  Post: Ei.Post
}, Fv = Ad({
  typeDefs: jv,
  resolvers: Mv
}), Uv = [
  Ru.link($v).operation(async ({ query: e, variables: t, request: n }) => {
    if (!e)
      return T.json(
        { errors: [{ message: "No GraphQL query provided" }] },
        { status: 400 }
      );
    let r;
    try {
      r = Vs(e);
    } catch (i) {
      return T.json(
        { errors: [{ message: `GraphQL parsing error: ${i.message}` }] },
        { status: 400 }
      );
    }
    const s = await Pa({
      schema: Fv,
      document: r,
      variableValues: t,
      contextValue: { request: n }
    });
    return s.errors && s.errors.length > 0 ? s.errors.some(
      (a) => a.message === "UNAUTHENTICATED"
    ) ? T.json(s, { status: 401 }) : T.json(s, { status: 200 }) : T.json(s, { status: 200 });
  })
];
function ea(e) {
  return e != null && typeof e == "object" && !Array.isArray(e);
}
function Cd(e, t) {
  return Object.entries(t).reduce(
    (n, [r, s]) => {
      const i = n[r];
      return Array.isArray(i) && Array.isArray(s) ? (n[r] = i.concat(s), n) : ea(i) && ea(s) ? (n[r] = Cd(i, s), n) : (n[r] = s, n);
    },
    Object.assign({}, e)
  );
}
function zv(e) {
  return {
    status: e.status,
    statusText: e.statusText,
    headers: Object.fromEntries(e.headers.entries())
  };
}
function Ua(e) {
  return (t) => t != null && typeof t == "object" && "__kind" in t && t.__kind === e;
}
function qv(e) {
  const t = Object.getOwnPropertyDescriptor(globalThis, e);
  return typeof t > "u" || typeof t.get == "function" && typeof t.get() > "u" || typeof t.get > "u" && t.value == null ? !1 : typeof t.set > "u" && !t.configurable ? (console.error(
    `[MSW] Failed to apply interceptor: the global \`${e}\` property is non-configurable. This is likely an issue with your environment. If you are using a framework, please open an issue about this in their repository.`
  ), !1) : !0;
}
function ke(e, t) {
  return Object.defineProperties(t, {
    target: {
      value: e,
      enumerable: !0,
      writable: !0
    },
    currentTarget: {
      value: e,
      enumerable: !0,
      writable: !0
    }
  }), t;
}
var Ln = Symbol("kCancelable"), lt = Symbol("kDefaultPrevented"), za = class extends MessageEvent {
  constructor(e, t) {
    super(e, t), this[Ln] = !!t.cancelable, this[lt] = !1;
  }
  get cancelable() {
    return this[Ln];
  }
  set cancelable(e) {
    this[Ln] = e;
  }
  get defaultPrevented() {
    return this[lt];
  }
  set defaultPrevented(e) {
    this[lt] = e;
  }
  preventDefault() {
    this.cancelable && !this[lt] && (this[lt] = !0);
  }
}, Xs = class extends Event {
  constructor(e, t = {}) {
    super(e, t), this.code = t.code === void 0 ? 0 : t.code, this.reason = t.reason === void 0 ? "" : t.reason, this.wasClean = t.wasClean === void 0 ? !1 : t.wasClean;
  }
}, Ic = class extends Xs {
  constructor(e, t = {}) {
    super(e, t), this[Ln] = !!t.cancelable, this[lt] = !1;
  }
  get cancelable() {
    return this[Ln];
  }
  set cancelable(e) {
    this[Ln] = e;
  }
  get defaultPrevented() {
    return this[lt];
  }
  set defaultPrevented(e) {
    this[lt] = e;
  }
  preventDefault() {
    this.cancelable && !this[lt] && (this[lt] = !0);
  }
}, er = Symbol("kEmitter"), Yr = Symbol("kBoundListener"), Vv = class {
  constructor(e, t) {
    this.socket = e, this.transport = t, this.id = np(), this.url = new URL(e.url), this[er] = new EventTarget(), this.transport.addEventListener("outgoing", (n) => {
      const r = ke(
        this.socket,
        new za("message", {
          data: n.data,
          origin: n.origin,
          cancelable: !0
        })
      );
      this[er].dispatchEvent(r), r.defaultPrevented && n.preventDefault();
    }), this.transport.addEventListener("close", (n) => {
      this[er].dispatchEvent(
        ke(this.socket, new Xs("close", n))
      );
    });
  }
  /**
   * Listen for the outgoing events from the connected WebSocket client.
   */
  addEventListener(e, t, n) {
    if (!Reflect.has(t, Yr)) {
      const r = t.bind(this.socket);
      Object.defineProperty(t, Yr, {
        value: r,
        enumerable: !1,
        configurable: !1
      });
    }
    this[er].addEventListener(
      e,
      Reflect.get(t, Yr),
      n
    );
  }
  /**
   * Removes the listener for the given event.
   */
  removeEventListener(e, t, n) {
    this[er].removeEventListener(
      e,
      Reflect.get(t, Yr),
      n
    );
  }
  /**
   * Send data to the connected client.
   */
  send(e) {
    this.transport.send(e);
  }
  /**
   * Close the WebSocket connection.
   * @param {number} code A status code (see https://www.rfc-editor.org/rfc/rfc6455#section-7.4.1).
   * @param {string} reason A custom connection close reason.
   */
  close(e, t) {
    this.transport.close(e, t);
  }
}, xc = "InvalidAccessError: close code out of user configurable range", As = Symbol("kPassthroughPromise"), Rd = Symbol("kOnSend"), Nr = Symbol("kClose"), $r = class extends EventTarget {
  constructor(e, t) {
    super(), this.CONNECTING = 0, this.OPEN = 1, this.CLOSING = 2, this.CLOSED = 3, this._onopen = null, this._onmessage = null, this._onerror = null, this._onclose = null, this.url = e.toString(), this.protocol = "", this.extensions = "", this.binaryType = "blob", this.readyState = this.CONNECTING, this.bufferedAmount = 0, this[As] = new Ph(), queueMicrotask(async () => {
      await this[As] || (this.protocol = typeof t == "string" ? t : Array.isArray(t) && t.length > 0 ? t[0] : "", this.readyState === this.CONNECTING && (this.readyState = this.OPEN, this.dispatchEvent(ke(this, new Event("open")))));
    });
  }
  set onopen(e) {
    this.removeEventListener("open", this._onopen), this._onopen = e, e !== null && this.addEventListener("open", e);
  }
  get onopen() {
    return this._onopen;
  }
  set onmessage(e) {
    this.removeEventListener(
      "message",
      this._onmessage
    ), this._onmessage = e, e !== null && this.addEventListener("message", e);
  }
  get onmessage() {
    return this._onmessage;
  }
  set onerror(e) {
    this.removeEventListener("error", this._onerror), this._onerror = e, e !== null && this.addEventListener("error", e);
  }
  get onerror() {
    return this._onerror;
  }
  set onclose(e) {
    this.removeEventListener("close", this._onclose), this._onclose = e, e !== null && this.addEventListener("close", e);
  }
  get onclose() {
    return this._onclose;
  }
  /**
   * @see https://websockets.spec.whatwg.org/#ref-for-dom-websocket-send%E2%91%A0
   */
  send(e) {
    if (this.readyState === this.CONNECTING)
      throw this.close(), new DOMException("InvalidStateError");
    this.readyState === this.CLOSING || this.readyState === this.CLOSED || (this.bufferedAmount += Bv(e), queueMicrotask(() => {
      var t;
      this.bufferedAmount = 0, (t = this[Rd]) == null || t.call(this, e);
    }));
  }
  close(e = 1e3, t) {
    Ke(e, xc), Ke(
      e === 1e3 || e >= 3e3 && e <= 4999,
      xc
    ), this[Nr](e, t);
  }
  [Nr](e = 1e3, t, n = !0) {
    this.readyState === this.CLOSING || this.readyState === this.CLOSED || (this.readyState = this.CLOSING, queueMicrotask(() => {
      this.readyState = this.CLOSED, this.dispatchEvent(
        ke(
          this,
          new Xs("close", {
            code: e,
            reason: t,
            wasClean: n
          })
        )
      ), this._onopen = null, this._onmessage = null, this._onerror = null, this._onclose = null;
    }));
  }
  addEventListener(e, t, n) {
    return super.addEventListener(
      e,
      t,
      n
    );
  }
  removeEventListener(e, t, n) {
    return super.removeEventListener(e, t, n);
  }
};
$r.CONNECTING = 0;
$r.OPEN = 1;
$r.CLOSING = 2;
$r.CLOSED = 3;
function Bv(e) {
  return typeof e == "string" ? e.length : e instanceof Blob ? e.size : e.byteLength;
}
var jt = Symbol("kEmitter"), Qr = Symbol("kBoundListener"), Ii = Symbol("kSend"), Hv = class {
  constructor(e, t, n) {
    this.client = e, this.transport = t, this.createConnection = n, this[jt] = new EventTarget(), this.mockCloseController = new AbortController(), this.realCloseController = new AbortController(), this.transport.addEventListener("outgoing", (r) => {
      typeof this.realWebSocket > "u" || queueMicrotask(() => {
        r.defaultPrevented || this[Ii](r.data);
      });
    }), this.transport.addEventListener(
      "incoming",
      this.handleIncomingMessage.bind(this)
    );
  }
  /**
   * The `WebSocket` instance connected to the original server.
   * Accessing this before calling `server.connect()` will throw.
   */
  get socket() {
    return Ke(
      this.realWebSocket,
      'Cannot access "socket" on the original WebSocket server object: the connection is not open. Did you forget to call `server.connect()`?'
    ), this.realWebSocket;
  }
  /**
   * Open connection to the original WebSocket server.
   */
  connect() {
    Ke(
      !this.realWebSocket || this.realWebSocket.readyState !== WebSocket.OPEN,
      'Failed to call "connect()" on the original WebSocket instance: the connection already open'
    );
    const e = this.createConnection();
    e.binaryType = this.client.binaryType, e.addEventListener(
      "open",
      (t) => {
        this[jt].dispatchEvent(
          ke(this.realWebSocket, new Event("open", t))
        );
      },
      { once: !0 }
    ), e.addEventListener("message", (t) => {
      this.transport.dispatchEvent(
        ke(
          this.realWebSocket,
          new MessageEvent("incoming", {
            data: t.data,
            origin: t.origin
          })
        )
      );
    }), this.client.addEventListener(
      "close",
      (t) => {
        this.handleMockClose(t);
      },
      {
        signal: this.mockCloseController.signal
      }
    ), e.addEventListener(
      "close",
      (t) => {
        this.handleRealClose(t);
      },
      {
        signal: this.realCloseController.signal
      }
    ), e.addEventListener("error", () => {
      const t = ke(
        e,
        new Event("error", { cancelable: !0 })
      );
      this[jt].dispatchEvent(t), t.defaultPrevented || this.client.dispatchEvent(ke(this.client, new Event("error")));
    }), this.realWebSocket = e;
  }
  /**
   * Listen for the incoming events from the original WebSocket server.
   */
  addEventListener(e, t, n) {
    if (!Reflect.has(t, Qr)) {
      const r = t.bind(this.client);
      Object.defineProperty(t, Qr, {
        value: r,
        enumerable: !1
      });
    }
    this[jt].addEventListener(
      e,
      Reflect.get(t, Qr),
      n
    );
  }
  /**
   * Remove the listener for the given event.
   */
  removeEventListener(e, t, n) {
    this[jt].removeEventListener(
      e,
      Reflect.get(t, Qr),
      n
    );
  }
  /**
   * Send data to the original WebSocket server.
   * @example
   * server.send('hello')
   * server.send(new Blob(['hello']))
   * server.send(new TextEncoder().encode('hello'))
   */
  send(e) {
    this[Ii](e);
  }
  [Ii](e) {
    const { realWebSocket: t } = this;
    if (Ke(
      t,
      'Failed to call "server.send()" for "%s": the connection is not open. Did you forget to call "server.connect()"?',
      this.client.url
    ), !(t.readyState === WebSocket.CLOSING || t.readyState === WebSocket.CLOSED)) {
      if (t.readyState === WebSocket.CONNECTING) {
        t.addEventListener(
          "open",
          () => {
            t.send(e);
          },
          { once: !0 }
        );
        return;
      }
      t.send(e);
    }
  }
  /**
   * Close the actual server connection.
   */
  close() {
    const { realWebSocket: e } = this;
    Ke(
      e,
      'Failed to close server connection for "%s": the connection is not open. Did you forget to call "server.connect()"?',
      this.client.url
    ), this.realCloseController.abort(), !(e.readyState === WebSocket.CLOSING || e.readyState === WebSocket.CLOSED) && (e.close(), queueMicrotask(() => {
      this[jt].dispatchEvent(
        ke(
          this.realWebSocket,
          new Ic("close", {
            /**
             * @note `server.close()` in the interceptor
             * always results in clean closures.
             */
            code: 1e3,
            cancelable: !0
          })
        )
      );
    }));
  }
  handleIncomingMessage(e) {
    const t = ke(
      e.target,
      new za("message", {
        data: e.data,
        origin: e.origin,
        cancelable: !0
      })
    );
    this[jt].dispatchEvent(t), t.defaultPrevented || this.client.dispatchEvent(
      ke(
        /**
         * @note Bind the forwarded original server events
         * to the mock WebSocket instance so it would
         * dispatch them straight away.
         */
        this.client,
        // Clone the message event again to prevent
        // the "already being dispatched" exception.
        new MessageEvent("message", {
          data: e.data,
          origin: e.origin
        })
      )
    );
  }
  handleMockClose(e) {
    this.realWebSocket && this.realWebSocket.close();
  }
  handleRealClose(e) {
    this.mockCloseController.abort();
    const t = ke(
      this.realWebSocket,
      new Ic("close", {
        code: e.code,
        reason: e.reason,
        wasClean: e.wasClean,
        cancelable: !0
      })
    );
    this[jt].dispatchEvent(t), t.defaultPrevented || this.client[Nr](e.code, e.reason);
  }
}, Zv = class extends EventTarget {
  constructor(e) {
    super(), this.socket = e, this.socket.addEventListener("close", (t) => {
      this.dispatchEvent(ke(this.socket, new Xs("close", t)));
    }), this.socket[Rd] = (t) => {
      this.dispatchEvent(
        ke(
          this.socket,
          // Dispatch this as cancelable because "client" connection
          // re-creates this message event (cannot dispatch the same event).
          new za("outgoing", {
            data: t,
            origin: this.socket.url,
            cancelable: !0
          })
        )
      );
    };
  }
  addEventListener(e, t, n) {
    return super.addEventListener(e, t, n);
  }
  dispatchEvent(e) {
    return super.dispatchEvent(e);
  }
  send(e) {
    queueMicrotask(() => {
      if (this.socket.readyState === this.socket.CLOSING || this.socket.readyState === this.socket.CLOSED)
        return;
      const t = () => {
        this.socket.dispatchEvent(
          ke(
            /**
             * @note Setting this event's "target" to the
             * WebSocket override instance is important.
             * This way it can tell apart original incoming events
             * (must be forwarded to the transport) from the
             * mocked message events like the one below
             * (must be dispatched on the client instance).
             */
            this.socket,
            new MessageEvent("message", {
              data: e,
              origin: this.socket.url
            })
          )
        );
      };
      this.socket.readyState === this.socket.CONNECTING ? this.socket.addEventListener(
        "open",
        () => {
          t();
        },
        { once: !0 }
      ) : t();
    });
  }
  close(e, t) {
    this.socket[Nr](e, t);
  }
}, Ld = class extends tp {
  constructor() {
    super(Ld.symbol);
  }
  checkEnvironment() {
    return qv("WebSocket");
  }
  setup() {
    const e = Object.getOwnPropertyDescriptor(
      globalThis,
      "WebSocket"
    ), t = new Proxy(globalThis.WebSocket, {
      construct: (n, r, s) => {
        const [i, a] = r, o = () => Reflect.construct(n, r, s), c = new $r(i, a), u = new Zv(c);
        return queueMicrotask(() => {
          try {
            const l = new Hv(
              c,
              u,
              o
            );
            this.emitter.emit("connection", {
              client: new Vv(c, u),
              server: l,
              info: {
                protocols: a
              }
            }) ? c[As].resolve(!1) : (c[As].resolve(!0), l.connect(), l.addEventListener("open", () => {
              c.dispatchEvent(ke(c, new Event("open"))), l.realWebSocket && (c.protocol = l.realWebSocket.protocol);
            }));
          } catch (l) {
            l instanceof Error && (c.dispatchEvent(new Event("error")), c.readyState !== WebSocket.CLOSING && c.readyState !== WebSocket.CLOSED && c[Nr](1011, l.message, !1), console.error(l));
          }
        }), c;
      }
    });
    Object.defineProperty(globalThis, "WebSocket", {
      value: t,
      configurable: !0
    }), this.subscriptions.push(() => {
      Object.defineProperty(
        globalThis,
        "WebSocket",
        e
      );
    });
  }
}, jd = Ld;
jd.symbol = Symbol("websocket");
const ta = new jd();
function Gv(e) {
  ta.on("connection", async (t) => {
    const n = e.getHandlers().filter(Ua("EventHandler"));
    if (n.length > 0) {
      e == null || e.onMockedConnection(t), await Promise.all(
        n.map((s) => s.run(t))
      );
      return;
    }
    const r = new Request(t.client.url, {
      headers: {
        upgrade: "websocket",
        connection: "upgrade"
      }
    });
    await Lu(
      r,
      e.getUnhandledRequestStrategy()
    ).catch((s) => {
      const i = new Event("error");
      Object.defineProperty(i, "cause", {
        enumerable: !0,
        configurable: !1,
        value: s
      }), t.client.socket.dispatchEvent(i);
    }), e == null || e.onPassthroughConnection(t), t.server.connect();
  });
}
function Ks(e) {
  return e instanceof Blob ? e.size : e instanceof ArrayBuffer ? e.byteLength : new Blob([e]).size;
}
const Sc = 24;
function xi(e) {
  return e.length <= Sc ? e : `${e.slice(0, Sc)}…`;
}
async function ei(e) {
  if (e instanceof Blob) {
    const t = await e.text();
    return `Blob(${xi(t)})`;
  }
  if (typeof e == "object" && "byteLength" in e) {
    const t = new TextDecoder().decode(e);
    return `ArrayBuffer(${xi(t)})`;
  }
  return xi(e);
}
const pn = {
  system: "#3b82f6",
  outgoing: "#22c55e",
  incoming: "#ef4444",
  mocked: "#ff6a33"
};
function Wv(e) {
  const { client: t, server: n } = e;
  Jv(t), t.addEventListener("message", (r) => {
    Xv(r);
  }), t.addEventListener("close", (r) => {
    Yv(r);
  }), t.socket.addEventListener("error", (r) => {
    Qv(r);
  }), t.send = new Proxy(t.send, {
    apply(r, s, i) {
      const [a] = i, o = new MessageEvent("message", { data: a });
      return Object.defineProperties(o, {
        currentTarget: {
          enumerable: !0,
          writable: !1,
          value: t.socket
        },
        target: {
          enumerable: !0,
          writable: !1,
          value: t.socket
        }
      }), queueMicrotask(() => {
        eb(o);
      }), Reflect.apply(r, s, i);
    }
  }), n.addEventListener(
    "open",
    () => {
      n.addEventListener("message", (r) => {
        tb(r);
      });
    },
    { once: !0 }
  ), n.send = new Proxy(n.send, {
    apply(r, s, i) {
      const [a] = i, o = new MessageEvent("message", { data: a });
      return Object.defineProperties(o, {
        currentTarget: {
          enumerable: !0,
          writable: !1,
          value: n.socket
        },
        target: {
          enumerable: !0,
          writable: !1,
          value: n.socket
        }
      }), Kv(o), Reflect.apply(r, s, i);
    }
  });
}
function Jv(e) {
  const t = dn(e.url);
  console.groupCollapsed(
    B.formatMessage(`${_t()} %c▶%c ${t}`),
    `color:${pn.system}`,
    "color:inherit"
  ), console.log("Client:", e.socket), console.groupEnd();
}
function Yv(e) {
  const t = e.target, n = dn(t.url);
  console.groupCollapsed(
    B.formatMessage(
      `${_t({ milliseconds: !0 })} %c■%c ${n}`
    ),
    `color:${pn.system}`,
    "color:inherit"
  ), console.log(e), console.groupEnd();
}
function Qv(e) {
  const t = e.target, n = dn(t.url);
  console.groupCollapsed(
    B.formatMessage(
      `${_t({ milliseconds: !0 })} %c×%c ${n}`
    ),
    `color:${pn.system}`,
    "color:inherit"
  ), console.log(e), console.groupEnd();
}
async function Xv(e) {
  const t = Ks(e.data), n = await ei(e.data), r = e.defaultPrevented ? "⇡" : "⬆";
  console.groupCollapsed(
    B.formatMessage(
      `${_t({ milliseconds: !0 })} %c${r}%c ${n} %c${t}%c`
    ),
    `color:${pn.outgoing}`,
    "color:inherit",
    "color:gray;font-weight:normal",
    "color:inherit;font-weight:inherit"
  ), console.log(e), console.groupEnd();
}
async function Kv(e) {
  const t = Ks(e.data), n = await ei(e.data);
  console.groupCollapsed(
    B.formatMessage(
      `${_t({ milliseconds: !0 })} %c⬆%c ${n} %c${t}%c`
    ),
    `color:${pn.mocked}`,
    "color:inherit",
    "color:gray;font-weight:normal",
    "color:inherit;font-weight:inherit"
  ), console.log(e), console.groupEnd();
}
async function eb(e) {
  const t = Ks(e.data), n = await ei(e.data);
  console.groupCollapsed(
    B.formatMessage(
      `${_t({ milliseconds: !0 })} %c⬇%c ${n} %c${t}%c`
    ),
    `color:${pn.mocked}`,
    "color:inherit",
    "color:gray;font-weight:normal",
    "color:inherit;font-weight:inherit"
  ), console.log(e), console.groupEnd();
}
async function tb(e) {
  const t = Ks(e.data), n = await ei(e.data), r = e.defaultPrevented ? "⇣" : "⬇";
  console.groupCollapsed(
    B.formatMessage(
      `${_t({ milliseconds: !0 })} %c${r}%c ${n} %c${t}%c`
    ),
    `color:${pn.incoming}`,
    "color:inherit",
    "color:gray;font-weight:normal",
    "color:inherit;font-weight:inherit"
  ), console.log(e), console.groupEnd();
}
var nb = /(%?)(%([sdijo]))/g;
function rb(e, t) {
  switch (t) {
    case "s":
      return e;
    case "d":
    case "i":
      return Number(e);
    case "j":
      return JSON.stringify(e);
    case "o": {
      if (typeof e == "string")
        return e;
      const n = JSON.stringify(e);
      return n === "{}" || n === "[]" || /^\[object .+?\]$/.test(n) ? e : n;
    }
  }
}
function Mr(e, ...t) {
  if (t.length === 0)
    return e;
  let n = 0, r = e.replace(
    nb,
    (s, i, a, o) => {
      const c = t[n], u = rb(c, o);
      return i ? s : (n++, u);
    }
  );
  return n < t.length && (r += ` ${t.slice(n).join(" ")}`), r = r.replace(/%{2,2}/g, "%"), r;
}
var sb = 2;
function ib(e) {
  if (!e.stack)
    return;
  const t = e.stack.split(`
`);
  t.splice(1, sb), e.stack = t.join(`
`);
}
var ab = class extends Error {
  constructor(e, ...t) {
    super(e), this.message = e, this.name = "Invariant Violation", this.message = Mr(e, ...t), ib(this);
  }
}, Nt = (e, t, ...n) => {
  if (!e)
    throw new ab(t, ...n);
};
Nt.as = (e, t, n, ...r) => {
  if (!t) {
    const s = r.length === 0 ? n : Mr(n, ...r);
    let i;
    try {
      i = Reflect.construct(e, [
        s
      ]);
    } catch {
      i = e(s);
    }
    throw i;
  }
};
function qa() {
  if (typeof navigator < "u" && navigator.product === "ReactNative")
    return !0;
  if (typeof process < "u") {
    const e = process.type;
    return e === "renderer" || e === "worker" ? !1 : !!(process.versions && process.versions.node);
  }
  return !1;
}
function ob() {
  const e = (t, n) => {
    e.state = "pending", e.resolve = (r) => {
      if (e.state !== "pending")
        return;
      e.result = r;
      const s = (i) => (e.state = "fulfilled", i);
      return t(
        r instanceof Promise ? r : Promise.resolve(r).then(s)
      );
    }, e.reject = (r) => {
      if (e.state === "pending")
        return queueMicrotask(() => {
          e.state = "rejected";
        }), n(e.rejectionReason = r);
    };
  };
  return e;
}
var Vt, Mn, as, Hc, hn = (Hc = class extends Promise {
  constructor(t = null) {
    const n = ob();
    super((r, s) => {
      n(r, s), t == null || t(n.resolve, n.reject);
    });
    Ue(this, Mn);
    Ue(this, Vt);
    V(this, "resolve");
    V(this, "reject");
    At(this, Vt, n), this.resolve = W(this, Vt).resolve, this.reject = W(this, Vt).reject;
  }
  get state() {
    return W(this, Vt).state;
  }
  get rejectionReason() {
    return W(this, Vt).rejectionReason;
  }
  then(t, n) {
    return we(this, Mn, as).call(this, super.then(t, n));
  }
  catch(t) {
    return we(this, Mn, as).call(this, super.catch(t));
  }
  finally(t) {
    return we(this, Mn, as).call(this, super.finally(t));
  }
}, Vt = new WeakMap(), Mn = new WeakSet(), as = function(t) {
  return Object.defineProperties(t, {
    resolve: { configurable: !0, value: this.resolve },
    reject: { configurable: !0, value: this.reject }
  });
}, Hc), cb = {
  serviceWorker: {
    url: "/mockServiceWorker.js",
    options: null
  },
  quiet: !1,
  waitUntilReady: !0,
  onUnhandledRequest: "warn",
  findWorker(e, t) {
    return e === t;
  }
};
async function ub(e) {
  try {
    return [null, await e().catch((t) => {
      throw t;
    })];
  } catch (t) {
    return [t, null];
  }
}
function lb(e) {
  return new URL(e, location.href).href;
}
function Si(e, t, n) {
  return [
    e.active,
    e.installing,
    e.waiting
  ].filter((a) => a != null).find((a) => n(a.scriptURL, t)) || null;
}
var db = async (e, t = {}, n) => {
  const r = lb(e), s = await navigator.serviceWorker.getRegistrations().then(
    (c) => c.filter(
      (u) => Si(u, r, n)
    )
  );
  !navigator.serviceWorker.controller && s.length > 0 && location.reload();
  const [i] = s;
  if (i)
    return i.update(), [
      Si(
        i,
        r,
        n
      ),
      i
    ];
  const [a, o] = await ub(async () => {
    const c = await navigator.serviceWorker.register(e, t);
    return [
      // Compare existing worker registration by its worker URL,
      // to prevent irrelevant workers to resolve here (such as Codesandbox worker).
      Si(c, r, n),
      c
    ];
  });
  if (a) {
    if (a.message.includes("(404)")) {
      const u = new URL((t == null ? void 0 : t.scope) || "/", location.href);
      throw new Error(
        B.formatMessage(`Failed to register a Service Worker for scope ('${u.href}') with script ('${r}'): Service Worker script does not exist at the given path.

Did you forget to run "npx msw init <PUBLIC_DIR>"?

Learn more about creating the Service Worker script: https://mswjs.io/docs/cli/init`)
      );
    }
    throw new Error(
      B.formatMessage(
        `Failed to register the Service Worker:

%s`,
        a.message
      )
    );
  }
  return o;
};
function Pd(e = {}) {
  if (e.quiet)
    return;
  const t = e.message || "Mocking enabled.";
  console.groupCollapsed(
    `%c${B.formatMessage(t)}`,
    "color:orangered;font-weight:bold;"
  ), console.log(
    "%cDocumentation: %chttps://mswjs.io/docs",
    "font-weight:bold",
    "font-weight:normal"
  ), console.log("Found an issue? https://github.com/mswjs/msw/issues"), e.workerUrl && console.log("Worker script URL:", e.workerUrl), e.workerScope && console.log("Worker scope:", e.workerScope), e.client && console.log("Client ID: %s (%s)", e.client.id, e.client.frameType), console.groupEnd();
}
function fb(e, t) {
  const n = new hn();
  return e.workerChannel.postMessage("MOCK_ACTIVATE"), e.workerChannel.once("MOCKING_ENABLED", async (r) => {
    var i;
    e.isMockingEnabled = !0;
    const s = await e.workerPromise;
    Pd({
      quiet: t.quiet,
      workerScope: (i = e.registration) == null ? void 0 : i.scope,
      workerUrl: s.scriptURL,
      client: r.data.client
    }), n.resolve(!0);
  }), n;
}
function pb(e) {
  if (!["HEAD", "GET"].includes(e.method))
    return e.body;
}
function $d(e) {
  return new Request(e.url, {
    ...e,
    body: pb(e)
  });
}
function na() {
  return typeof navigator < "u" && "serviceWorker" in navigator && typeof location < "u" && location.protocol !== "file:";
}
function hb() {
  try {
    const e = new ReadableStream({
      start: (n) => n.close()
    });
    return new MessageChannel().port1.postMessage(e, [e]), !0;
  } catch {
    return !1;
  }
}
var mb = hb(), gb = (e, t) => async (n) => {
  if (!e.isMockingEnabled && e.workerStoppedAt && n.data.interceptedAt > e.workerStoppedAt) {
    n.postMessage("PASSTHROUGH");
    return;
  }
  const r = n.data.id, s = $d(n.data), i = s.clone(), a = s.clone();
  br.cache.set(s, a);
  try {
    await Pu(
      s,
      r,
      e.getRequestHandlers().filter(Ua("RequestHandler")),
      t,
      e.emitter,
      {
        onPassthroughResponse() {
          n.postMessage("PASSTHROUGH");
        },
        async onMockedResponse(o, { handler: c, parsedResult: u }) {
          const l = o.clone(), d = o.clone(), p = zv(o);
          if (mb) {
            const h = o.body;
            n.postMessage(
              "MOCK_RESPONSE",
              {
                ...p,
                body: h
              },
              h ? [h] : void 0
            );
          } else {
            const h = o.body === null ? null : await l.arrayBuffer();
            n.postMessage("MOCK_RESPONSE", {
              ...p,
              body: h
            });
          }
          t.quiet || e.emitter.once("response:mocked", () => {
            c.log({
              request: i,
              response: d,
              parsedResult: u
            });
          });
        }
      }
    );
  } catch (o) {
    o instanceof Error && (B.error(
      `Uncaught exception in the request handler for "%s %s":

%s

This exception has been gracefully handled as a 500 response, however, it's strongly recommended to resolve this error, as it indicates a mistake in your code. If you wish to mock an error response, please see this guide: https://mswjs.io/docs/http/mocking-responses/error-responses`,
      s.method,
      s.url,
      o.stack ?? o
    ), n.postMessage("MOCK_RESPONSE", {
      status: 500,
      statusText: "Request Handler Error",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: o.name,
        message: o.message,
        stack: o.stack
      })
    }));
  }
};
function yb(e) {
  const t = new hn();
  return e.workerChannel.postMessage("INTEGRITY_CHECK_REQUEST"), e.workerChannel.once("INTEGRITY_CHECK_RESPONSE", (n) => {
    const { checksum: r, packageVersion: s } = n.data;
    r !== "4db4a41e972cec1b64cc569c66952d82" && B.warn(
      `The currently registered Service Worker has been generated by a different version of MSW (${s}) and may not be fully compatible with the installed version.

It's recommended you update your worker script by running this command:

  • npx msw init <PUBLIC_DIR>

You can also automate this process and make the worker script update automatically upon the library installations. Read more: https://mswjs.io/docs/cli/init.`
    ), t.resolve();
  }), t;
}
var vb = new TextEncoder();
function bb(e) {
  return vb.encode(e);
}
function kb(e, t) {
  return new TextDecoder(t).decode(e);
}
function wb(e) {
  return e.buffer.slice(
    e.byteOffset,
    e.byteOffset + e.byteLength
  );
}
var jn = Symbol("isPatchedModule");
function Md(e) {
  try {
    return new URL(e), !0;
  } catch {
    return !1;
  }
}
function Nc(e, t) {
  const r = Object.getOwnPropertySymbols(t).find((s) => s.description === e);
  if (r)
    return Reflect.get(t, r);
}
var Sn = class extends Response {
  static isConfigurableStatusCode(e) {
    return e >= 200 && e <= 599;
  }
  static isRedirectResponse(e) {
    return Sn.STATUS_CODES_WITH_REDIRECT.includes(e);
  }
  /**
   * Returns a boolean indicating whether the given response status
   * code represents a response that can have a body.
   */
  static isResponseWithBody(e) {
    return !Sn.STATUS_CODES_WITHOUT_BODY.includes(e);
  }
  static setUrl(e, t) {
    if (!e || e === "about:" || !Md(e))
      return;
    const n = Nc("state", t);
    n ? n.urlList.push(new URL(e)) : Object.defineProperty(t, "url", {
      value: e,
      enumerable: !0,
      configurable: !0,
      writable: !1
    });
  }
  /**
   * Parses the given raw HTTP headers into a Fetch API `Headers` instance.
   */
  static parseRawHeaders(e) {
    const t = new Headers();
    for (let n = 0; n < e.length; n += 2)
      t.append(e[n], e[n + 1]);
    return t;
  }
  constructor(e, t = {}) {
    var n;
    const r = (n = t.status) != null ? n : 200, s = Sn.isConfigurableStatusCode(r) ? r : 200, i = Sn.isResponseWithBody(r) ? e : null;
    if (super(i, {
      status: s,
      statusText: t.statusText,
      headers: t.headers
    }), r !== s) {
      const a = Nc("state", this);
      a ? a.status = r : Object.defineProperty(this, "status", {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !1
      });
    }
    Sn.setUrl(t.url, this);
  }
}, Tt = Sn;
Tt.STATUS_CODES_WITHOUT_BODY = [101, 103, 204, 205, 304];
Tt.STATUS_CODES_WITH_REDIRECT = [301, 302, 303, 307, 308];
var Tb = Symbol("kRawRequest");
function Fd(e, t) {
  Reflect.set(e, Tb, t);
}
var Eb = Object.defineProperty, Ib = (e, t) => {
  for (var n in t)
    Eb(e, n, { get: t[n], enumerable: !0 });
}, ra = {};
Ib(ra, {
  blue: () => Sb,
  gray: () => sa,
  green: () => _b,
  red: () => Nb,
  yellow: () => xb
});
function xb(e) {
  return `\x1B[33m${e}\x1B[0m`;
}
function Sb(e) {
  return `\x1B[34m${e}\x1B[0m`;
}
function sa(e) {
  return `\x1B[90m${e}\x1B[0m`;
}
function Nb(e) {
  return `\x1B[31m${e}\x1B[0m`;
}
function _b(e) {
  return `\x1B[32m${e}\x1B[0m`;
}
var ti = qa(), Ud = class {
  constructor(e) {
    V(this, "prefix");
    this.name = e, this.prefix = `[${this.name}]`;
    const t = _c("DEBUG"), n = _c("LOG_LEVEL");
    t === "1" || t === "true" || typeof t < "u" && this.name.startsWith(t) ? (this.debug = tr(n, "debug") ? ct : this.debug, this.info = tr(n, "info") ? ct : this.info, this.success = tr(n, "success") ? ct : this.success, this.warning = tr(n, "warning") ? ct : this.warning, this.error = tr(n, "error") ? ct : this.error) : (this.info = ct, this.success = ct, this.warning = ct, this.error = ct, this.only = ct);
  }
  extend(e) {
    return new Ud(`${this.name}:${e}`);
  }
  /**
   * Print a debug message.
   * @example
   * logger.debug('no duplicates found, creating a document...')
   */
  debug(e, ...t) {
    this.logEntry({
      level: "debug",
      message: sa(e),
      positionals: t,
      prefix: this.prefix,
      colors: {
        prefix: "gray"
      }
    });
  }
  /**
   * Print an info message.
   * @example
   * logger.info('start parsing...')
   */
  info(e, ...t) {
    this.logEntry({
      level: "info",
      message: e,
      positionals: t,
      prefix: this.prefix,
      colors: {
        prefix: "blue"
      }
    });
    const n = new Ob();
    return (r, ...s) => {
      n.measure(), this.logEntry({
        level: "info",
        message: `${r} ${sa(`${n.deltaTime}ms`)}`,
        positionals: s,
        prefix: this.prefix,
        colors: {
          prefix: "blue"
        }
      });
    };
  }
  /**
   * Print a success message.
   * @example
   * logger.success('successfully created document')
   */
  success(e, ...t) {
    this.logEntry({
      level: "info",
      message: e,
      positionals: t,
      prefix: `✔ ${this.prefix}`,
      colors: {
        timestamp: "green",
        prefix: "green"
      }
    });
  }
  /**
   * Print a warning.
   * @example
   * logger.warning('found legacy document format')
   */
  warning(e, ...t) {
    this.logEntry({
      level: "warning",
      message: e,
      positionals: t,
      prefix: `⚠ ${this.prefix}`,
      colors: {
        timestamp: "yellow",
        prefix: "yellow"
      }
    });
  }
  /**
   * Print an error message.
   * @example
   * logger.error('something went wrong')
   */
  error(e, ...t) {
    this.logEntry({
      level: "error",
      message: e,
      positionals: t,
      prefix: `✖ ${this.prefix}`,
      colors: {
        timestamp: "red",
        prefix: "red"
      }
    });
  }
  /**
   * Execute the given callback only when the logging is enabled.
   * This is skipped in its entirety and has no runtime cost otherwise.
   * This executes regardless of the log level.
   * @example
   * logger.only(() => {
   *   logger.info('additional info')
   * })
   */
  only(e) {
    e();
  }
  createEntry(e, t) {
    return {
      timestamp: /* @__PURE__ */ new Date(),
      level: e,
      message: t
    };
  }
  logEntry(e) {
    const {
      level: t,
      message: n,
      prefix: r,
      colors: s,
      positionals: i = []
    } = e, a = this.createEntry(t, n), o = (s == null ? void 0 : s.timestamp) || "gray", c = (s == null ? void 0 : s.prefix) || "gray", u = {
      timestamp: ra[o],
      prefix: ra[c]
    };
    this.getWriter(t)(
      [u.timestamp(this.formatTimestamp(a.timestamp))].concat(r != null ? u.prefix(r) : []).concat(Oc(n)).join(" "),
      ...i.map(Oc)
    );
  }
  formatTimestamp(e) {
    return `${e.toLocaleTimeString(
      "en-GB"
    )}:${e.getMilliseconds()}`;
  }
  getWriter(e) {
    switch (e) {
      case "debug":
      case "success":
      case "info":
        return Db;
      case "warning":
        return Ab;
      case "error":
        return Cb;
    }
  }
}, Ob = class {
  constructor() {
    V(this, "startTime");
    V(this, "endTime");
    V(this, "deltaTime");
    this.startTime = performance.now();
  }
  measure() {
    this.endTime = performance.now();
    const e = this.endTime - this.startTime;
    this.deltaTime = e.toFixed(2);
  }
}, ct = () => {
};
function Db(e, ...t) {
  if (ti) {
    process.stdout.write(Mr(e, ...t) + `
`);
    return;
  }
  console.log(e, ...t);
}
function Ab(e, ...t) {
  if (ti) {
    process.stderr.write(Mr(e, ...t) + `
`);
    return;
  }
  console.warn(e, ...t);
}
function Cb(e, ...t) {
  if (ti) {
    process.stderr.write(Mr(e, ...t) + `
`);
    return;
  }
  console.error(e, ...t);
}
function _c(e) {
  var t;
  return ti ? process.env[e] : (t = globalThis[e]) == null ? void 0 : t.toString();
}
function tr(e, t) {
  return e !== void 0 && e !== t;
}
function Oc(e) {
  return typeof e > "u" ? "undefined" : e === null ? "null" : typeof e == "string" ? e : typeof e == "object" ? JSON.stringify(e) : e.toString();
}
var Rb = class extends Error {
  constructor(e, t, n) {
    super(
      `Possible EventEmitter memory leak detected. ${n} ${t.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`
    ), this.emitter = e, this.type = t, this.count = n, this.name = "MaxListenersExceededWarning";
  }
}, zd = class {
  static listenerCount(e, t) {
    return e.listenerCount(t);
  }
  constructor() {
    this.events = /* @__PURE__ */ new Map(), this.maxListeners = zd.defaultMaxListeners, this.hasWarnedAboutPotentialMemoryLeak = !1;
  }
  _emitInternalEvent(e, t, n) {
    this.emit(
      e,
      t,
      n
    );
  }
  _getListeners(e) {
    return Array.prototype.concat.apply([], this.events.get(e)) || [];
  }
  _removeListener(e, t) {
    const n = e.indexOf(t);
    return n > -1 && e.splice(n, 1), [];
  }
  _wrapOnceListener(e, t) {
    const n = (...r) => (this.removeListener(e, n), t.apply(this, r));
    return Object.defineProperty(n, "name", { value: t.name }), n;
  }
  setMaxListeners(e) {
    return this.maxListeners = e, this;
  }
  /**
   * Returns the current max listener value for the `Emitter` which is
   * either set by `emitter.setMaxListeners(n)` or defaults to
   * `Emitter.defaultMaxListeners`.
   */
  getMaxListeners() {
    return this.maxListeners;
  }
  /**
   * Returns an array listing the events for which the emitter has registered listeners.
   * The values in the array will be strings or Symbols.
   */
  eventNames() {
    return Array.from(this.events.keys());
  }
  /**
   * Synchronously calls each of the listeners registered for the event named `eventName`,
   * in the order they were registered, passing the supplied arguments to each.
   * Returns `true` if the event has listeners, `false` otherwise.
   *
   * @example
   * const emitter = new Emitter<{ hello: [string] }>()
   * emitter.emit('hello', 'John')
   */
  emit(e, ...t) {
    const n = this._getListeners(e);
    return n.forEach((r) => {
      r.apply(this, t);
    }), n.length > 0;
  }
  addListener(e, t) {
    this._emitInternalEvent("newListener", e, t);
    const n = this._getListeners(e).concat(t);
    if (this.events.set(e, n), this.maxListeners > 0 && this.listenerCount(e) > this.maxListeners && !this.hasWarnedAboutPotentialMemoryLeak) {
      this.hasWarnedAboutPotentialMemoryLeak = !0;
      const r = new Rb(
        this,
        e,
        this.listenerCount(e)
      );
      console.warn(r);
    }
    return this;
  }
  on(e, t) {
    return this.addListener(e, t);
  }
  once(e, t) {
    return this.addListener(
      e,
      this._wrapOnceListener(e, t)
    );
  }
  prependListener(e, t) {
    const n = this._getListeners(e);
    if (n.length > 0) {
      const r = [t].concat(n);
      this.events.set(e, r);
    } else
      this.events.set(e, n.concat(t));
    return this;
  }
  prependOnceListener(e, t) {
    return this.prependListener(
      e,
      this._wrapOnceListener(e, t)
    );
  }
  removeListener(e, t) {
    const n = this._getListeners(e);
    return n.length > 0 && (this._removeListener(n, t), this.events.set(e, n), this._emitInternalEvent("removeListener", e, t)), this;
  }
  /**
   * Alias for `emitter.removeListener()`.
   *
   * @example
   * emitter.off('hello', listener)
   */
  off(e, t) {
    return this.removeListener(e, t);
  }
  removeAllListeners(e) {
    return e ? this.events.delete(e) : this.events.clear(), this;
  }
  /**
   * Returns a copy of the array of listeners for the event named `eventName`.
   */
  listeners(e) {
    return Array.from(this._getListeners(e));
  }
  /**
   * Returns the number of listeners listening to the event named `eventName`.
   */
  listenerCount(e) {
    return this._getListeners(e).length;
  }
  rawListeners(e) {
    return this.listeners(e);
  }
}, qd = zd;
qd.defaultMaxListeners = 10;
var Lb = "x-interceptors-internal-request-id";
function Dc(e) {
  return (
    // @ts-ignore https://github.com/Microsoft/TypeScript/issues/24587
    globalThis[e] || void 0
  );
}
function jb(e, t) {
  globalThis[e] = t;
}
function Pb(e) {
  delete globalThis[e];
}
var Va = class {
  constructor(e) {
    this.symbol = e, this.readyState = "INACTIVE", this.emitter = new qd(), this.subscriptions = [], this.logger = new Ud(e.description), this.emitter.setMaxListeners(0), this.logger.info("constructing the interceptor...");
  }
  /**
   * Determine if this interceptor can be applied
   * in the current environment.
   */
  checkEnvironment() {
    return !0;
  }
  /**
   * Apply this interceptor to the current process.
   * Returns an already running interceptor instance if it's present.
   */
  apply() {
    const e = this.logger.extend("apply");
    if (e.info("applying the interceptor..."), this.readyState === "APPLIED") {
      e.info("intercepted already applied!");
      return;
    }
    if (!this.checkEnvironment()) {
      e.info("the interceptor cannot be applied in this environment!");
      return;
    }
    this.readyState = "APPLYING";
    const n = this.getInstance();
    if (n) {
      e.info("found a running instance, reusing..."), this.on = (r, s) => (e.info('proxying the "%s" listener', r), n.emitter.addListener(r, s), this.subscriptions.push(() => {
        n.emitter.removeListener(r, s), e.info('removed proxied "%s" listener!', r);
      }), this), this.readyState = "APPLIED";
      return;
    }
    e.info("no running instance found, setting up a new instance..."), this.setup(), this.setInstance(), this.readyState = "APPLIED";
  }
  /**
   * Setup the module augments and stubs necessary for this interceptor.
   * This method is not run if there's a running interceptor instance
   * to prevent instantiating an interceptor multiple times.
   */
  setup() {
  }
  /**
   * Listen to the interceptor's public events.
   */
  on(e, t) {
    const n = this.logger.extend("on");
    return this.readyState === "DISPOSING" || this.readyState === "DISPOSED" ? (n.info("cannot listen to events, already disposed!"), this) : (n.info('adding "%s" event listener:', e, t), this.emitter.on(e, t), this);
  }
  once(e, t) {
    return this.emitter.once(e, t), this;
  }
  off(e, t) {
    return this.emitter.off(e, t), this;
  }
  removeAllListeners(e) {
    return this.emitter.removeAllListeners(e), this;
  }
  /**
   * Disposes of any side-effects this interceptor has introduced.
   */
  dispose() {
    const e = this.logger.extend("dispose");
    if (this.readyState === "DISPOSED") {
      e.info("cannot dispose, already disposed!");
      return;
    }
    if (e.info("disposing the interceptor..."), this.readyState = "DISPOSING", !this.getInstance()) {
      e.info("no interceptors running, skipping dispose...");
      return;
    }
    if (this.clearInstance(), e.info("global symbol deleted:", Dc(this.symbol)), this.subscriptions.length > 0) {
      e.info("disposing of %d subscriptions...", this.subscriptions.length);
      for (const t of this.subscriptions)
        t();
      this.subscriptions = [], e.info("disposed of all subscriptions!", this.subscriptions.length);
    }
    this.emitter.removeAllListeners(), e.info("destroyed the listener!"), this.readyState = "DISPOSED";
  }
  getInstance() {
    var e;
    const t = Dc(this.symbol);
    return this.logger.info("retrieved global instance:", (e = t == null ? void 0 : t.constructor) == null ? void 0 : e.name), t;
  }
  setInstance() {
    jb(this.symbol, this), this.logger.info("set global instance!", this.symbol.description);
  }
  clearInstance() {
    Pb(this.symbol), this.logger.info("cleared global instance!", this.symbol.description);
  }
};
function Vd() {
  return Math.random().toString(16).slice(2);
}
var ia = class extends Va {
  constructor(e) {
    ia.symbol = Symbol(e.name), super(ia.symbol), this.interceptors = e.interceptors;
  }
  setup() {
    const e = this.logger.extend("setup");
    e.info("applying all %d interceptors...", this.interceptors.length);
    for (const t of this.interceptors)
      e.info('applying "%s" interceptor...', t.constructor.name), t.apply(), e.info("adding interceptor dispose subscription"), this.subscriptions.push(() => t.dispose());
  }
  on(e, t) {
    for (const n of this.interceptors)
      n.on(e, t);
    return this;
  }
  once(e, t) {
    for (const n of this.interceptors)
      n.once(e, t);
    return this;
  }
  off(e, t) {
    for (const n of this.interceptors)
      n.off(e, t);
    return this;
  }
  removeAllListeners(e) {
    for (const t of this.interceptors)
      t.removeAllListeners(e);
    return this;
  }
};
function $b(e) {
  return (t) => {
    var i;
    const n = t.data, r = $d(n.request);
    if ((i = n.response.type) != null && i.includes("opaque"))
      return;
    const s = n.response.status === 0 ? Response.error() : new Tt(
      /**
       * Responses may be streams here, but when we create a response object
       * with null-body status codes, like 204, 205, 304 Response will
       * throw when passed a non-null body, so ensure it's null here
       * for those codes
       */
      Tt.isResponseWithBody(n.response.status) ? n.response.body : null,
      {
        ...n,
        /**
         * Set response URL if it's not set already.
         * @see https://github.com/mswjs/msw/issues/2030
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/url
         */
        url: r.url
      }
    );
    e.emitter.emit(
      n.isMockedResponse ? "response:mocked" : "response:bypass",
      {
        requestId: n.request.id,
        request: r,
        response: s
      }
    );
  };
}
function Mb(e, t) {
  !(t != null && t.quiet) && !location.href.startsWith(e.scope) && B.warn(
    `Cannot intercept requests on this page because it's outside of the worker's scope ("${e.scope}"). If you wish to mock API requests on this page, you must resolve this scope issue.

- (Recommended) Register the worker at the root level ("/") of your application.
- Set the "Service-Worker-Allowed" response header to allow out-of-scope workers.`
  );
}
var Fb = (e) => function(n, r) {
  return (async () => {
    e.workerChannel.removeAllListeners(), e.workerChannel.on(
      "REQUEST",
      gb(e, n)
    ), e.workerChannel.on("RESPONSE", $b(e));
    const a = await db(
      n.serviceWorker.url,
      n.serviceWorker.options,
      n.findWorker
    ), [o, c] = a;
    if (!o) {
      const u = r != null && r.findWorker ? B.formatMessage(
        `Failed to locate the Service Worker registration using a custom "findWorker" predicate.

Please ensure that the custom predicate properly locates the Service Worker registration at "%s".
More details: https://mswjs.io/docs/api/setup-worker/start#findworker
`,
        n.serviceWorker.url
      ) : B.formatMessage(
        `Failed to locate the Service Worker registration.

This most likely means that the worker script URL "%s" cannot resolve against the actual public hostname (%s). This may happen if your application runs behind a proxy, or has a dynamic hostname.

Please consider using a custom "serviceWorker.url" option to point to the actual worker script location, or a custom "findWorker" option to resolve the Service Worker registration manually. More details: https://mswjs.io/docs/api/setup-worker/start`,
        n.serviceWorker.url,
        location.host
      );
      throw new Error(u);
    }
    return e.workerPromise.resolve(o), e.registration = c, window.addEventListener("beforeunload", () => {
      o.state !== "redundant" && e.workerChannel.postMessage("CLIENT_CLOSED"), window.clearInterval(e.keepAliveInterval), window.postMessage({ type: "msw/worker:stop" });
    }), await yb(e).catch((u) => {
      B.error(
        "Error while checking the worker script integrity. Please report this on GitHub (https://github.com/mswjs/msw/issues) and include the original error below."
      ), console.error(u);
    }), e.keepAliveInterval = window.setInterval(
      () => e.workerChannel.postMessage("KEEPALIVE_REQUEST"),
      5e3
    ), Mb(c, e.startOptions), c;
  })().then(
    async (a) => {
      const o = a.installing || a.waiting;
      if (o) {
        const c = new hn();
        o.addEventListener("statechange", () => {
          o.state === "activated" && c.resolve();
        }), await c;
      }
      return await fb(e, n).catch((c) => {
        throw B.error(
          "Failed to enable mocking. Please report this on GitHub (https://github.com/mswjs/msw/issues) and include the original error below."
        ), c;
      }), a;
    }
  );
}, Xr = Symbol("kDefaultPrevented"), Ft = Symbol("kPropagationStopped"), yr = Symbol("kImmediatePropagationStopped"), Zc, Gc, Wc, Jc, oa, Yc, Ub = (Yc = class extends (Jc = MessageEvent, Wc = Xr, Gc = Ft, Zc = yr, Jc) {
  constructor(...t) {
    super(t[0], t[1]);
    /**
     * @note Keep a placeholder property with the return type
     * because the type must be set somewhere in order to be
     * correctly associated and inferred from the event.
     */
    Ue(this, oa);
    V(this, Wc);
    V(this, Gc);
    V(this, Zc);
    this[Xr] = !1;
  }
  get defaultPrevented() {
    return this[Xr];
  }
  preventDefault() {
    super.preventDefault(), this[Xr] = !0;
  }
  stopImmediatePropagation() {
    super.stopImmediatePropagation(), this[yr] = !0;
  }
}, oa = new WeakMap(), Yc), Ac = Symbol("kListenerOptions"), be, $e, aa, os, cs, Qc, zb = (Qc = class {
  constructor() {
    Ue(this, $e);
    Ue(this, be);
    At(this, be, {});
  }
  /**
   * Adds a listener for the given event type.
   *
   * @returns {AbortController} An `AbortController` that can be used to remove the listener.
   */
  on(e, t, n) {
    return we(this, $e, aa).call(this, e, t, n);
  }
  /**
   * Adds a one-time listener for the given event type.
   *
   * @returns {AbortController} An `AbortController` that can be used to remove the listener.
   */
  once(e, t, n) {
    return this.on(e, t, { ...n || {}, once: !0 });
  }
  /**
   * Prepends a listener for the given event type.
   *
   * @returns {AbortController} An `AbortController` that can be used to remove the listener.
   */
  earlyOn(e, t, n) {
    return we(this, $e, aa).call(this, e, t, n, "prepend");
  }
  /**
   * Prepends a one-time listener for the given event type.
   */
  earlyOnce(e, t, n) {
    return this.earlyOn(e, t, { ...n || {}, once: !0 });
  }
  /**
   * Emits the given typed event.
   *
   * @returns {boolean} Returns `true` if the event had any listeners, `false` otherwise.
   */
  emit(e) {
    if (this.listenerCount(e.type) === 0)
      return !1;
    const t = we(this, $e, os).call(this, e);
    for (const n of W(this, be)[e.type]) {
      if (t.event[Ft] != null && t.event[Ft] !== this)
        return !1;
      if (t.event[yr])
        break;
      we(this, $e, cs).call(this, t.event, n);
    }
    return t.revoke(), !0;
  }
  /**
   * Emits the given typed event and returns a promise that resolves
   * when all the listeners for that event have settled.
   *
   * @returns {Promise<Array<Emitter.ListenerReturnType>>} A promise that resolves
   * with the return values of all listeners.
   */
  async emitAsPromise(e) {
    if (this.listenerCount(e.type) === 0)
      return [];
    const t = [], n = we(this, $e, os).call(this, e);
    for (const r of W(this, be)[e.type]) {
      if (n.event[Ft] != null && n.event[Ft] !== this)
        return [];
      if (n.event[yr])
        break;
      t.push(
        // Awaiting individual listeners guarantees their call order.
        await Promise.resolve(we(this, $e, cs).call(this, n.event, r))
      );
    }
    return n.revoke(), Promise.allSettled(t).then((r) => r.map(
      (s) => s.status === "fulfilled" ? s.value : s.reason
    ));
  }
  /**
   * Emits the given event and returns a generator that yields
   * the result of each listener in the order of their registration.
   * This way, you stop exhausting the listeners once you get the expected value.
   */
  *emitAsGenerator(e) {
    if (this.listenerCount(e.type) === 0)
      return;
    const t = we(this, $e, os).call(this, e);
    for (const n of W(this, be)[e.type]) {
      if (t.event[Ft] != null && t.event[Ft] !== this)
        return;
      if (t.event[yr])
        break;
      yield we(this, $e, cs).call(this, t.event, n);
    }
    t.revoke();
  }
  /**
   * Removes a listener for the given event type.
   */
  removeListener(e, t) {
    if (this.listenerCount(e) === 0)
      return;
    const n = [];
    for (const r of W(this, be)[e])
      r !== t && n.push(r);
    W(this, be)[e] = n;
  }
  /**
   * Removes all listeners for the given event type.
   * If no event type is provided, removes all existing listeners.
   */
  removeAllListeners(e) {
    if (e == null) {
      At(this, be, {});
      return;
    }
    W(this, be)[e] = [];
  }
  /**
   * Returns the list of listeners for the given event type.
   * If no even type is provided, returns all listeners.
   */
  listeners(e) {
    return e == null ? Object.values(W(this, be)).flat() : W(this, be)[e] || [];
  }
  /**
   * Returns the number of listeners for the given event type.
   * If no even type is provided, returns the total number of listeners.
   */
  listenerCount(e) {
    return this.listeners(e).length;
  }
}, be = new WeakMap(), $e = new WeakSet(), aa = function(e, t, n, r = "append") {
  var s;
  return (s = W(this, be))[e] ?? (s[e] = []), r === "prepend" ? W(this, be)[e].unshift(t) : W(this, be)[e].push(t), n && (Object.defineProperty(t, Ac, {
    value: n,
    enumerable: !1,
    writable: !1
  }), n.signal && n.signal.addEventListener(
    "abort",
    () => {
      this.removeListener(e, t);
    },
    { once: !0 }
  )), this;
}, os = function(e) {
  const { stopPropagation: t } = e;
  return e.stopPropagation = new Proxy(e.stopPropagation, {
    apply: (n, r, s) => (e[Ft] = this, Reflect.apply(n, r, s))
  }), {
    event: e,
    revoke() {
      e.stopPropagation = t;
    }
  };
}, cs = function(e, t) {
  var r;
  const n = t.call(this, e);
  return (r = t[Ac]) != null && r.once && this.removeListener(e.type, t), n;
}, Qc), Cc = na(), Fn, Xc, qb = (Xc = class extends Ub {
  constructor(t) {
    const n = t.data.type, r = t.data.payload;
    super(
      // @ts-expect-error Troublesome `TypedEvent` extension.
      n,
      { data: r }
    );
    Ue(this, Fn);
    At(this, Fn, t);
  }
  get ports() {
    return W(this, Fn).ports;
  }
  /**
   * Reply directly to this event using its `MessagePort`.
   */
  postMessage(t, ...n) {
    W(this, Fn).ports[0].postMessage(
      { type: t, data: n[0] },
      { transfer: n[1] }
    );
  }
}, Fn = new WeakMap(), Xc), Vb = class extends zb {
  constructor(e) {
    super(), this.options = e, Cc && navigator.serviceWorker.addEventListener("message", async (t) => {
      const n = await this.options.worker;
      t.source != null && t.source !== n || t.data && ea(t.data) && "type" in t.data && this.emit(new qb(t));
    });
  }
  /**
   * Send data to the Service Worker controlling this client.
   * This triggers the `message` event listener on ServiceWorkerGlobalScope.
   */
  postMessage(e) {
    Nt(
      Cc,
      "Failed to post message on a WorkerChannel: the Service Worker API is unavailable in this context. This is likely an issue with MSW. Please report it on GitHub: https://github.com/mswjs/msw/issues"
    ), this.options.worker.then((t) => {
      t.postMessage(e);
    });
  }
}, Rc = async (e) => {
  try {
    return { error: null, data: await e().catch((n) => {
      throw n;
    }) };
  } catch (t) {
    return { error: t, data: null };
  }
}, Cs = class extends Error {
  constructor(e) {
    super(e), this.name = "InterceptorError", Object.setPrototypeOf(this, Cs.prototype);
  }
}, nr = Symbol("kRequestHandled"), ut = Symbol("kResponsePromise"), Ba = class {
  constructor(e) {
    this.request = e, this[nr] = !1, this[ut] = new hn();
  }
  /**
   * Respond to this request with the given `Response` instance.
   * @example
   * controller.respondWith(new Response())
   * controller.respondWith(Response.json({ id }))
   * controller.respondWith(Response.error())
   */
  respondWith(e) {
    Nt.as(
      Cs,
      !this[nr],
      'Failed to respond to the "%s %s" request: the "request" event has already been handled.',
      this.request.method,
      this.request.url
    ), this[nr] = !0, this[ut].resolve(e);
  }
  /**
   * Error this request with the given reason.
   *
   * @example
   * controller.errorWith()
   * controller.errorWith(new Error('Oops!'))
   * controller.errorWith({ message: 'Oops!'})
   */
  errorWith(e) {
    Nt.as(
      Cs,
      !this[nr],
      'Failed to error the "%s %s" request: the "request" event has already been handled.',
      this.request.method,
      this.request.url
    ), this[nr] = !0, this[ut].resolve(e);
  }
};
async function Rs(e, t, ...n) {
  const r = e.listeners(t);
  if (r.length !== 0)
    for (const s of r)
      await s.apply(e, n);
}
function Bd(e, t = !1) {
  return t ? Object.prototype.toString.call(e).startsWith("[object ") : Object.prototype.toString.call(e) === "[object Object]";
}
function us(e, t) {
  try {
    return e[t], !0;
  } catch {
    return !1;
  }
}
function Bb(e) {
  return new Response(
    JSON.stringify(
      e instanceof Error ? {
        name: e.name,
        message: e.message,
        stack: e.stack
      } : e
    ),
    {
      status: 500,
      statusText: "Unhandled Exception",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
function Hb(e) {
  return e != null && e instanceof Response && us(e, "type") && e.type === "error";
}
function Zb(e) {
  return Bd(e, !0) && us(e, "status") && us(e, "statusText") && us(e, "bodyUsed");
}
function Gb(e) {
  return e == null || !(e instanceof Error) ? !1 : "code" in e && "errno" in e;
}
async function Hd(e) {
  const t = async (i) => i instanceof Error ? (e.onError(i), !0) : Hb(i) ? (e.onRequestError(i), !0) : Zb(i) ? (await e.onResponse(i), !0) : Bd(i) ? (e.onError(i), !0) : !1, n = async (i) => {
    if (i instanceof Cs)
      throw s.error;
    return Gb(i) ? (e.onError(i), !0) : i instanceof Response ? await t(i) : !1;
  };
  e.emitter.once("request", ({ requestId: i }) => {
    i === e.requestId && e.controller[ut].state === "pending" && e.controller[ut].resolve(void 0);
  });
  const r = new hn();
  e.request.signal && (e.request.signal.aborted ? r.reject(e.request.signal.reason) : e.request.signal.addEventListener(
    "abort",
    () => {
      r.reject(e.request.signal.reason);
    },
    { once: !0 }
  ));
  const s = await Rc(async () => {
    const i = Rs(e.emitter, "request", {
      requestId: e.requestId,
      request: e.request,
      controller: e.controller
    });
    return await Promise.race([
      // Short-circuit the request handling promise if the request gets aborted.
      r,
      i,
      e.controller[ut]
    ]), await e.controller[ut];
  });
  if (r.state === "rejected")
    return e.onError(r.rejectionReason), !0;
  if (s.error) {
    if (await n(s.error))
      return !0;
    if (e.emitter.listenerCount("unhandledException") > 0) {
      const i = new Ba(
        e.request
      );
      await Rs(e.emitter, "unhandledException", {
        error: s.error,
        request: e.request,
        requestId: e.requestId,
        controller: i
      }).then(() => {
        i[ut].state === "pending" && i[ut].resolve(void 0);
      });
      const a = await Rc(
        () => i[ut]
      );
      if (a.error)
        return n(a.error);
      if (a.data)
        return t(a.data);
    }
    return e.onResponse(Bb(s.error)), !0;
  }
  return s.data ? t(s.data) : !1;
}
function Zd(e) {
  const t = Object.getOwnPropertyDescriptor(globalThis, e);
  return typeof t > "u" || typeof t.get == "function" && typeof t.get() > "u" || typeof t.get > "u" && t.value == null ? !1 : typeof t.set > "u" && !t.configurable ? (console.error(
    `[MSW] Failed to apply interceptor: the global \`${e}\` property is non-configurable. This is likely an issue with your environment. If you are using a framework, please open an issue about this in their repository.`
  ), !1) : !0;
}
function tn(e) {
  return Object.assign(new TypeError("Failed to fetch"), {
    cause: e
  });
}
var Wb = [
  "content-encoding",
  "content-language",
  "content-location",
  "content-type",
  "content-length"
], Ni = Symbol("kRedirectCount");
async function Jb(e, t) {
  if (t.status !== 303 && e.body != null)
    return Promise.reject(tn());
  const n = new URL(e.url);
  let r;
  try {
    r = new URL(t.headers.get("location"), e.url);
  } catch (i) {
    return Promise.reject(tn(i));
  }
  if (!(r.protocol === "http:" || r.protocol === "https:"))
    return Promise.reject(
      tn("URL scheme must be a HTTP(S) scheme")
    );
  if (Reflect.get(e, Ni) > 20)
    return Promise.reject(tn("redirect count exceeded"));
  if (Object.defineProperty(e, Ni, {
    value: (Reflect.get(e, Ni) || 0) + 1
  }), e.mode === "cors" && (r.username || r.password) && !Lc(n, r))
    return Promise.reject(
      tn('cross origin not allowed for request mode "cors"')
    );
  const s = {};
  return ([301, 302].includes(t.status) && e.method === "POST" || t.status === 303 && !["HEAD", "GET"].includes(e.method)) && (s.method = "GET", s.body = null, Wb.forEach((i) => {
    e.headers.delete(i);
  })), Lc(n, r) || (e.headers.delete("authorization"), e.headers.delete("proxy-authorization"), e.headers.delete("cookie"), e.headers.delete("host")), s.headers = e.headers, fetch(new Request(r, s));
}
function Lc(e, t) {
  return e.origin === t.origin && e.origin === "null" || e.protocol === t.protocol && e.hostname === t.hostname && e.port === t.port;
}
var Yb = class extends TransformStream {
  constructor() {
    console.warn(
      "[Interceptors]: Brotli decompression of response streams is not supported in the browser"
    ), super({
      transform(e, t) {
        t.enqueue(e);
      }
    });
  }
}, Qb = class extends TransformStream {
  constructor(e, ...t) {
    super({}, ...t);
    const n = [super.readable, ...e].reduce(
      (r, s) => r.pipeThrough(s)
    );
    Object.defineProperty(this, "readable", {
      get() {
        return n;
      }
    });
  }
};
function Xb(e) {
  return e.toLowerCase().split(",").map((t) => t.trim());
}
function Kb(e) {
  if (e === "")
    return null;
  const t = Xb(e);
  if (t.length === 0)
    return null;
  const n = t.reduceRight(
    (r, s) => s === "gzip" || s === "x-gzip" ? r.concat(new DecompressionStream("gzip")) : s === "deflate" ? r.concat(new DecompressionStream("deflate")) : s === "br" ? r.concat(new Yb()) : (r.length = 0, r),
    []
  );
  return new Qb(n);
}
function ek(e) {
  if (e.body === null)
    return null;
  const t = Kb(
    e.headers.get("content-encoding") || ""
  );
  return t ? (e.body.pipeTo(t.writable), t.readable) : null;
}
var Gd = class extends Va {
  constructor() {
    super(Gd.symbol);
  }
  checkEnvironment() {
    return Zd("fetch");
  }
  async setup() {
    const e = globalThis.fetch;
    Nt(
      !e[jn],
      'Failed to patch the "fetch" module: already patched.'
    ), globalThis.fetch = async (t, n) => {
      const r = Vd(), s = typeof t == "string" && typeof location < "u" && !Md(t) ? new URL(t, location.href) : t, i = new Request(s, n);
      t instanceof Request && Fd(i, t);
      const a = new hn(), o = new Ba(i);
      if (this.logger.info("[%s] %s", i.method, i.url), this.logger.info("awaiting for the mocked response..."), this.logger.info(
        'emitting the "request" event for %s listener(s)...',
        this.emitter.listenerCount("request")
      ), await Hd({
        request: i,
        requestId: r,
        emitter: this.emitter,
        controller: o,
        onResponse: async (l) => {
          this.logger.info("received mocked response!", {
            rawResponse: l
          });
          const d = ek(l), p = d === null ? l : new Tt(d, l);
          if (Tt.setUrl(i.url, p), Tt.isRedirectResponse(p.status)) {
            if (i.redirect === "error") {
              a.reject(tn("unexpected redirect"));
              return;
            }
            if (i.redirect === "follow") {
              Jb(i, p).then(
                (h) => {
                  a.resolve(h);
                },
                (h) => {
                  a.reject(h);
                }
              );
              return;
            }
          }
          this.emitter.listenerCount("response") > 0 && (this.logger.info('emitting the "response" event...'), await Rs(this.emitter, "response", {
            // Clone the mocked response for the "response" event listener.
            // This way, the listener can read the response and not lock its body
            // for the actual fetch consumer.
            response: p.clone(),
            isMockedResponse: !0,
            request: i,
            requestId: r
          })), a.resolve(p);
        },
        onRequestError: (l) => {
          this.logger.info("request has errored!", { response: l }), a.reject(tn(l));
        },
        onError: (l) => {
          this.logger.info("request has been aborted!", { error: l }), a.reject(l);
        }
      }))
        return this.logger.info("request has been handled, returning mock promise..."), a;
      this.logger.info(
        "no mocked response received, performing request as-is..."
      );
      const u = i.clone();
      return e(i).then(async (l) => {
        if (this.logger.info("original fetch performed", l), this.emitter.listenerCount("response") > 0) {
          this.logger.info('emitting the "response" event...');
          const d = l.clone();
          await Rs(this.emitter, "response", {
            response: d,
            isMockedResponse: !1,
            request: u,
            requestId: r
          });
        }
        return l;
      });
    }, Object.defineProperty(globalThis.fetch, jn, {
      enumerable: !0,
      configurable: !0,
      value: !0
    }), this.subscriptions.push(() => {
      Object.defineProperty(globalThis.fetch, jn, {
        value: void 0
      }), globalThis.fetch = e, this.logger.info(
        'restored native "globalThis.fetch"!',
        globalThis.fetch.name
      );
    });
  }
}, Wd = Gd;
Wd.symbol = Symbol("fetch");
function tk(e, t) {
  const n = new Uint8Array(e.byteLength + t.byteLength);
  return n.set(e, 0), n.set(t, e.byteLength), n;
}
var Jd = class {
  constructor(e, t) {
    this.NONE = 0, this.CAPTURING_PHASE = 1, this.AT_TARGET = 2, this.BUBBLING_PHASE = 3, this.type = "", this.srcElement = null, this.currentTarget = null, this.eventPhase = 0, this.isTrusted = !0, this.composed = !1, this.cancelable = !0, this.defaultPrevented = !1, this.bubbles = !0, this.lengthComputable = !0, this.loaded = 0, this.total = 0, this.cancelBubble = !1, this.returnValue = !0, this.type = e, this.target = (t == null ? void 0 : t.target) || null, this.currentTarget = (t == null ? void 0 : t.currentTarget) || null, this.timeStamp = Date.now();
  }
  composedPath() {
    return [];
  }
  initEvent(e, t, n) {
    this.type = e, this.bubbles = !!t, this.cancelable = !!n;
  }
  preventDefault() {
    this.defaultPrevented = !0;
  }
  stopPropagation() {
  }
  stopImmediatePropagation() {
  }
}, nk = class extends Jd {
  constructor(e, t) {
    super(e), this.lengthComputable = (t == null ? void 0 : t.lengthComputable) || !1, this.composed = (t == null ? void 0 : t.composed) || !1, this.loaded = (t == null ? void 0 : t.loaded) || 0, this.total = (t == null ? void 0 : t.total) || 0;
  }
}, rk = typeof ProgressEvent < "u";
function sk(e, t, n) {
  const r = [
    "error",
    "progress",
    "loadstart",
    "loadend",
    "load",
    "timeout",
    "abort"
  ], s = rk ? ProgressEvent : nk;
  return r.includes(t) ? new s(t, {
    lengthComputable: !0,
    loaded: (n == null ? void 0 : n.loaded) || 0,
    total: (n == null ? void 0 : n.total) || 0
  }) : new Jd(t, {
    target: e,
    currentTarget: e
  });
}
function Yd(e, t) {
  if (!(t in e))
    return null;
  if (Object.prototype.hasOwnProperty.call(e, t))
    return e;
  const r = Reflect.getPrototypeOf(e);
  return r ? Yd(r, t) : null;
}
function _i(e, t) {
  return new Proxy(e, ik(t));
}
function ik(e) {
  const { constructorCall: t, methodCall: n, getProperty: r, setProperty: s } = e, i = {};
  return typeof t < "u" && (i.construct = function(a, o, c) {
    const u = Reflect.construct.bind(null, a, o, c);
    return t.call(c, o, u);
  }), i.set = function(a, o, c) {
    const u = () => {
      const l = Yd(a, o) || a, d = Reflect.getOwnPropertyDescriptor(
        l,
        o
      );
      return typeof (d == null ? void 0 : d.set) < "u" ? (d.set.apply(a, [c]), !0) : Reflect.defineProperty(l, o, {
        writable: !0,
        enumerable: !0,
        configurable: !0,
        value: c
      });
    };
    return typeof s < "u" ? s.call(a, [o, c], u) : u();
  }, i.get = function(a, o, c) {
    const u = () => a[o], l = typeof r < "u" ? r.call(a, [o, c], u) : u();
    return typeof l == "function" ? (...d) => {
      const p = l.bind(a, ...d);
      return typeof n < "u" ? n.call(a, [o, d], p) : p();
    } : l;
  }, i;
}
function ak(e) {
  return [
    "application/xhtml+xml",
    "application/xml",
    "image/svg+xml",
    "text/html",
    "text/xml"
  ].some((n) => e.startsWith(n));
}
function ok(e) {
  try {
    return JSON.parse(e);
  } catch {
    return null;
  }
}
function ck(e, t) {
  const n = Tt.isResponseWithBody(e.status) ? t : null;
  return new Tt(n, {
    url: e.responseURL,
    status: e.status,
    statusText: e.statusText,
    headers: uk(
      e.getAllResponseHeaders()
    )
  });
}
function uk(e) {
  const t = new Headers(), n = e.split(/[\r\n]+/);
  for (const r of n) {
    if (r.trim() === "")
      continue;
    const [s, ...i] = r.split(": "), a = i.join(": ");
    t.append(s, a);
  }
  return t;
}
async function jc(e) {
  const t = e.headers.get("content-length");
  return t != null && t !== "" ? Number(t) : (await e.arrayBuffer()).byteLength;
}
var rr = Symbol("kIsRequestHandled"), lk = qa(), Oi = Symbol("kFetchRequest"), dk = class {
  constructor(e, t) {
    this.initialRequest = e, this.logger = t, this.method = "GET", this.url = null, this[rr] = !1, this.events = /* @__PURE__ */ new Map(), this.uploadEvents = /* @__PURE__ */ new Map(), this.requestId = Vd(), this.requestHeaders = new Headers(), this.responseBuffer = new Uint8Array(), this.request = _i(e, {
      setProperty: ([n, r], s) => {
        switch (n) {
          case "ontimeout": {
            const i = n.slice(
              2
            );
            return this.request.addEventListener(i, r), s();
          }
          default:
            return s();
        }
      },
      methodCall: ([n, r], s) => {
        var i;
        switch (n) {
          case "open": {
            const [a, o] = r;
            return typeof o > "u" ? (this.method = "GET", this.url = Pc(a)) : (this.method = a, this.url = Pc(o)), this.logger = this.logger.extend(`${this.method} ${this.url.href}`), this.logger.info("open", this.method, this.url.href), s();
          }
          case "addEventListener": {
            const [a, o] = r;
            return this.registerEvent(a, o), this.logger.info("addEventListener", a, o), s();
          }
          case "setRequestHeader": {
            const [a, o] = r;
            return this.requestHeaders.set(a, o), this.logger.info("setRequestHeader", a, o), s();
          }
          case "send": {
            const [a] = r;
            this.request.addEventListener("load", () => {
              if (typeof this.onResponse < "u") {
                const l = ck(
                  this.request,
                  /**
                   * The `response` property is the right way to read
                   * the ambiguous response body, as the request's "responseType" may differ.
                   * @see https://xhr.spec.whatwg.org/#the-response-attribute
                   */
                  this.request.response
                );
                this.onResponse.call(this, {
                  response: l,
                  isMockedResponse: this[rr],
                  request: c,
                  requestId: this.requestId
                });
              }
            });
            const o = typeof a == "string" ? bb(a) : a, c = this.toFetchApiRequest(o);
            this[Oi] = c.clone(), (((i = this.onRequest) == null ? void 0 : i.call(this, {
              request: c,
              requestId: this.requestId
            })) || Promise.resolve()).finally(() => {
              if (!this[rr])
                return this.logger.info(
                  "request callback settled but request has not been handled (readystate %d), performing as-is...",
                  this.request.readyState
                ), lk && this.request.setRequestHeader(
                  Lb,
                  this.requestId
                ), s();
            });
            break;
          }
          default:
            return s();
        }
      }
    }), wn(
      this.request,
      "upload",
      _i(this.request.upload, {
        setProperty: ([n, r], s) => {
          switch (n) {
            case "onloadstart":
            case "onprogress":
            case "onaboart":
            case "onerror":
            case "onload":
            case "ontimeout":
            case "onloadend": {
              const i = n.slice(
                2
              );
              this.registerUploadEvent(i, r);
            }
          }
          return s();
        },
        methodCall: ([n, r], s) => {
          switch (n) {
            case "addEventListener": {
              const [i, a] = r;
              return this.registerUploadEvent(i, a), this.logger.info("upload.addEventListener", i, a), s();
            }
          }
        }
      })
    );
  }
  registerEvent(e, t) {
    const r = (this.events.get(e) || []).concat(t);
    this.events.set(e, r), this.logger.info('registered event "%s"', e, t);
  }
  registerUploadEvent(e, t) {
    const r = (this.uploadEvents.get(e) || []).concat(t);
    this.uploadEvents.set(e, r), this.logger.info('registered upload event "%s"', e, t);
  }
  /**
   * Responds to the current request with the given
   * Fetch API `Response` instance.
   */
  async respondWith(e) {
    if (this[rr] = !0, this[Oi]) {
      const r = await jc(
        this[Oi]
      );
      this.trigger("loadstart", this.request.upload, {
        loaded: 0,
        total: r
      }), this.trigger("progress", this.request.upload, {
        loaded: r,
        total: r
      }), this.trigger("load", this.request.upload, {
        loaded: r,
        total: r
      }), this.trigger("loadend", this.request.upload, {
        loaded: r,
        total: r
      });
    }
    this.logger.info(
      "responding with a mocked response: %d %s",
      e.status,
      e.statusText
    ), wn(this.request, "status", e.status), wn(this.request, "statusText", e.statusText), wn(this.request, "responseURL", this.url.href), this.request.getResponseHeader = new Proxy(this.request.getResponseHeader, {
      apply: (r, s, i) => {
        if (this.logger.info("getResponseHeader", i[0]), this.request.readyState < this.request.HEADERS_RECEIVED)
          return this.logger.info("headers not received yet, returning null"), null;
        const a = e.headers.get(i[0]);
        return this.logger.info(
          'resolved response header "%s" to',
          i[0],
          a
        ), a;
      }
    }), this.request.getAllResponseHeaders = new Proxy(
      this.request.getAllResponseHeaders,
      {
        apply: () => {
          if (this.logger.info("getAllResponseHeaders"), this.request.readyState < this.request.HEADERS_RECEIVED)
            return this.logger.info("headers not received yet, returning empty string"), "";
          const s = Array.from(e.headers.entries()).map(([i, a]) => `${i}: ${a}`).join(`\r
`);
          return this.logger.info("resolved all response headers to", s), s;
        }
      }
    ), Object.defineProperties(this.request, {
      response: {
        enumerable: !0,
        configurable: !1,
        get: () => this.response
      },
      responseText: {
        enumerable: !0,
        configurable: !1,
        get: () => this.responseText
      },
      responseXML: {
        enumerable: !0,
        configurable: !1,
        get: () => this.responseXML
      }
    });
    const t = await jc(e.clone());
    this.logger.info("calculated response body length", t), this.trigger("loadstart", this.request, {
      loaded: 0,
      total: t
    }), this.setReadyState(this.request.HEADERS_RECEIVED), this.setReadyState(this.request.LOADING);
    const n = () => {
      this.logger.info("finalizing the mocked response..."), this.setReadyState(this.request.DONE), this.trigger("load", this.request, {
        loaded: this.responseBuffer.byteLength,
        total: t
      }), this.trigger("loadend", this.request, {
        loaded: this.responseBuffer.byteLength,
        total: t
      });
    };
    if (e.body) {
      this.logger.info("mocked response has body, streaming...");
      const r = e.body.getReader(), s = async () => {
        const { value: i, done: a } = await r.read();
        if (a) {
          this.logger.info("response body stream done!"), n();
          return;
        }
        i && (this.logger.info("read response body chunk:", i), this.responseBuffer = tk(this.responseBuffer, i), this.trigger("progress", this.request, {
          loaded: this.responseBuffer.byteLength,
          total: t
        })), s();
      };
      s();
    } else
      n();
  }
  responseBufferToText() {
    return kb(this.responseBuffer);
  }
  get response() {
    if (this.logger.info(
      "getResponse (responseType: %s)",
      this.request.responseType
    ), this.request.readyState !== this.request.DONE)
      return null;
    switch (this.request.responseType) {
      case "json": {
        const e = ok(this.responseBufferToText());
        return this.logger.info("resolved response JSON", e), e;
      }
      case "arraybuffer": {
        const e = wb(this.responseBuffer);
        return this.logger.info("resolved response ArrayBuffer", e), e;
      }
      case "blob": {
        const e = this.request.getResponseHeader("Content-Type") || "text/plain", t = new Blob([this.responseBufferToText()], {
          type: e
        });
        return this.logger.info(
          "resolved response Blob (mime type: %s)",
          t,
          e
        ), t;
      }
      default: {
        const e = this.responseBufferToText();
        return this.logger.info(
          'resolving "%s" response type as text',
          this.request.responseType,
          e
        ), e;
      }
    }
  }
  get responseText() {
    if (Nt(
      this.request.responseType === "" || this.request.responseType === "text",
      "InvalidStateError: The object is in invalid state."
    ), this.request.readyState !== this.request.LOADING && this.request.readyState !== this.request.DONE)
      return "";
    const e = this.responseBufferToText();
    return this.logger.info('getResponseText: "%s"', e), e;
  }
  get responseXML() {
    if (Nt(
      this.request.responseType === "" || this.request.responseType === "document",
      "InvalidStateError: The object is in invalid state."
    ), this.request.readyState !== this.request.DONE)
      return null;
    const e = this.request.getResponseHeader("Content-Type") || "";
    return typeof DOMParser > "u" ? (console.warn(
      "Cannot retrieve XMLHttpRequest response body as XML: DOMParser is not defined. You are likely using an environment that is not browser or does not polyfill browser globals correctly."
    ), null) : ak(e) ? new DOMParser().parseFromString(
      this.responseBufferToText(),
      e
    ) : null;
  }
  errorWith(e) {
    this[rr] = !0, this.logger.info("responding with an error"), this.setReadyState(this.request.DONE), this.trigger("error", this.request), this.trigger("loadend", this.request);
  }
  /**
   * Transitions this request's `readyState` to the given one.
   */
  setReadyState(e) {
    if (this.logger.info(
      "setReadyState: %d -> %d",
      this.request.readyState,
      e
    ), this.request.readyState === e) {
      this.logger.info("ready state identical, skipping transition...");
      return;
    }
    wn(this.request, "readyState", e), this.logger.info("set readyState to: %d", e), e !== this.request.UNSENT && (this.logger.info('triggerring "readystatechange" event...'), this.trigger("readystatechange", this.request));
  }
  /**
   * Triggers given event on the `XMLHttpRequest` instance.
   */
  trigger(e, t, n) {
    const r = t[`on${e}`], s = sk(t, e, n);
    this.logger.info('trigger "%s"', e, n || ""), typeof r == "function" && (this.logger.info('found a direct "%s" callback, calling...', e), r.call(t, s));
    const i = t instanceof XMLHttpRequestUpload ? this.uploadEvents : this.events;
    for (const [a, o] of i)
      a === e && (this.logger.info(
        'found %d listener(s) for "%s" event, calling...',
        o.length,
        e
      ), o.forEach((c) => c.call(t, s)));
  }
  /**
   * Converts this `XMLHttpRequest` instance into a Fetch API `Request` instance.
   */
  toFetchApiRequest(e) {
    this.logger.info("converting request to a Fetch API Request...");
    const t = e instanceof Document ? e.documentElement.innerText : e, n = new Request(this.url.href, {
      method: this.method,
      headers: this.requestHeaders,
      /**
       * @see https://xhr.spec.whatwg.org/#cross-origin-credentials
       */
      credentials: this.request.withCredentials ? "include" : "same-origin",
      body: ["GET", "HEAD"].includes(this.method.toUpperCase()) ? null : t
    }), r = _i(n.headers, {
      methodCall: ([s, i], a) => {
        switch (s) {
          case "append":
          case "set": {
            const [o, c] = i;
            this.request.setRequestHeader(o, c);
            break;
          }
          case "delete": {
            const [o] = i;
            console.warn(
              `XMLHttpRequest: Cannot remove a "${o}" header from the Fetch API representation of the "${n.method} ${n.url}" request. XMLHttpRequest headers cannot be removed.`
            );
            break;
          }
        }
        return a();
      }
    });
    return wn(n, "headers", r), Fd(n, this.request), this.logger.info("converted request to a Fetch API Request!", n), n;
  }
};
function Pc(e) {
  return typeof location > "u" ? new URL(e) : new URL(e.toString(), location.href);
}
function wn(e, t, n) {
  Reflect.defineProperty(e, t, {
    // Ensure writable properties to allow redefining readonly properties.
    writable: !0,
    enumerable: !0,
    value: n
  });
}
function fk({
  emitter: e,
  logger: t
}) {
  return new Proxy(globalThis.XMLHttpRequest, {
    construct(r, s, i) {
      t.info("constructed new XMLHttpRequest");
      const a = Reflect.construct(
        r,
        s,
        i
      ), o = Object.getOwnPropertyDescriptors(
        r.prototype
      );
      for (const u in o)
        Reflect.defineProperty(
          a,
          u,
          o[u]
        );
      const c = new dk(
        a,
        t
      );
      return c.onRequest = async function({ request: u, requestId: l }) {
        const d = new Ba(u);
        this.logger.info("awaiting mocked response..."), this.logger.info(
          'emitting the "request" event for %s listener(s)...',
          e.listenerCount("request")
        ), await Hd({
          request: u,
          requestId: l,
          controller: d,
          emitter: e,
          onResponse: async (h) => {
            await this.respondWith(h);
          },
          onRequestError: () => {
            this.errorWith(new TypeError("Network error"));
          },
          onError: (h) => {
            this.logger.info("request errored!", { error: h }), h instanceof Error && this.errorWith(h);
          }
        }) || this.logger.info(
          "no mocked response received, performing request as-is..."
        );
      }, c.onResponse = async function({
        response: u,
        isMockedResponse: l,
        request: d,
        requestId: p
      }) {
        this.logger.info(
          'emitting the "response" event for %s listener(s)...',
          e.listenerCount("response")
        ), e.emit("response", {
          response: u,
          isMockedResponse: l,
          request: d,
          requestId: p
        });
      }, c.request;
    }
  });
}
var Qd = class extends Va {
  constructor() {
    super(Qd.interceptorSymbol);
  }
  checkEnvironment() {
    return Zd("XMLHttpRequest");
  }
  setup() {
    const e = this.logger.extend("setup");
    e.info('patching "XMLHttpRequest" module...');
    const t = globalThis.XMLHttpRequest;
    Nt(
      !t[jn],
      'Failed to patch the "XMLHttpRequest" module: already patched.'
    ), globalThis.XMLHttpRequest = fk({
      emitter: this.emitter,
      logger: this.logger
    }), e.info(
      'native "XMLHttpRequest" module patched!',
      globalThis.XMLHttpRequest.name
    ), Object.defineProperty(globalThis.XMLHttpRequest, jn, {
      enumerable: !0,
      configurable: !0,
      value: !0
    }), this.subscriptions.push(() => {
      Object.defineProperty(globalThis.XMLHttpRequest, jn, {
        value: void 0
      }), globalThis.XMLHttpRequest = t, e.info(
        'native "XMLHttpRequest" module restored!',
        globalThis.XMLHttpRequest.name
      );
    });
  }
}, Xd = Qd;
Xd.interceptorSymbol = Symbol("xhr");
function pk(e, t) {
  const n = new ia({
    name: "fallback",
    interceptors: [new Wd(), new Xd()]
  });
  return n.on("request", async ({ request: r, requestId: s, controller: i }) => {
    const a = r.clone(), o = await Pu(
      r,
      s,
      e.getRequestHandlers().filter(Ua("RequestHandler")),
      t,
      e.emitter,
      {
        onMockedResponse(c, { handler: u, parsedResult: l }) {
          t.quiet || e.emitter.once("response:mocked", ({ response: d }) => {
            u.log({
              request: a,
              response: d,
              parsedResult: l
            });
          });
        }
      }
    );
    o && i.respondWith(o);
  }), n.on(
    "response",
    ({ response: r, isMockedResponse: s, request: i, requestId: a }) => {
      e.emitter.emit(
        s ? "response:mocked" : "response:bypass",
        {
          response: r,
          request: i,
          requestId: a
        }
      );
    }
  ), n.apply(), n;
}
function hk(e = {}) {
  e.quiet || console.log(
    `%c${B.formatMessage("Mocking disabled.")}`,
    "color:orangered;font-weight:bold;"
  );
}
var mk = class extends bf {
  constructor(...t) {
    super(...t);
    V(this, "context");
    Nt(
      !qa(),
      B.formatMessage(
        "Failed to execute `setupWorker` in a non-browser environment. Consider using `setupServer` for Node.js environment instead."
      )
    ), this.context = this.createWorkerContext();
  }
  createWorkerContext() {
    const t = new hn();
    return {
      // Mocking is not considered enabled until the worker
      // signals back the successful activation event.
      isMockingEnabled: !1,
      startOptions: null,
      workerPromise: t,
      registration: void 0,
      getRequestHandlers: () => this.handlersController.currentHandlers(),
      emitter: this.emitter,
      workerChannel: new Vb({
        worker: t
      })
    };
  }
  async start(t = {}) {
    if ("waitUntilReady" in t && B.warn(
      'The "waitUntilReady" option has been deprecated. Please remove it from this "worker.start()" call. Follow the recommended Browser integration (https://mswjs.io/docs/integrations/browser) to eliminate any race conditions between the Service Worker registration and any requests made by your application on initial render.'
    ), this.context.isMockingEnabled)
      return B.warn(
        'Found a redundant "worker.start()" call. Note that starting the worker while mocking is already enabled will have no effect. Consider removing this "worker.start()" call.'
      ), this.context.registration;
    if (this.context.workerStoppedAt = void 0, this.context.startOptions = Cd(
      cb,
      t
    ), Gv({
      getUnhandledRequestStrategy: () => this.context.startOptions.onUnhandledRequest,
      getHandlers: () => this.handlersController.currentHandlers(),
      onMockedConnection: (s) => {
        this.context.startOptions.quiet || Wv(s);
      },
      onPassthroughConnection() {
      }
    }), ta.apply(), this.subscriptions.push(() => {
      ta.dispose();
    }), !na()) {
      const s = pk(
        this.context,
        this.context.startOptions
      );
      this.subscriptions.push(() => {
        s.dispose();
      }), this.context.isMockingEnabled = !0, Pd({
        message: "Mocking enabled (fallback mode).",
        quiet: this.context.startOptions.quiet
      });
      return;
    }
    const r = await Fb(this.context)(this.context.startOptions, t);
    return this.context.isMockingEnabled = !0, r;
  }
  stop() {
    var t;
    if (super.dispose(), !this.context.isMockingEnabled) {
      B.warn(
        'Found a redundant "worker.stop()" call. Notice that stopping the worker after it has already been stopped has no effect. Consider removing this "worker.stop()" call.'
      );
      return;
    }
    this.context.isMockingEnabled = !1, this.context.workerStoppedAt = Date.now(), this.context.emitter.removeAllListeners(), na() && (this.context.workerChannel.removeAllListeners("RESPONSE"), window.clearInterval(this.context.keepAliveInterval)), window.postMessage({ type: "msw/worker:stop" }), hk({
      quiet: (t = this.context.startOptions) == null ? void 0 : t.quiet
    });
  }
};
function Kd(...e) {
  return new mk(...e);
}
const $c = Dr, gk = Ms, Mc = Fs, Di = Us, yk = [
  // GET /api/me
  j.get(`${P}/me`, async ({ request: e }) => {
    const t = await vn(e);
    if (!t)
      return T.json({ message: "Unauthorized" }, { status: 401 });
    const n = $c.find((r) => r.id === t);
    return n ? T.json(n, { status: 200 }) : T.json({ message: "User not found" }, { status: 404 });
  }),
  // GET /api/me/posts
  j.get(`${P}/me/posts`, async ({ request: e }) => {
    const t = await vn(e);
    if (!t)
      return T.json({ message: "Unauthorized" }, { status: 401 });
    const r = gk.filter(
      (s) => s.authorId === t
    ).map((s) => {
      const i = Di.filter((o) => o.postId === s.id).map((o) => o.userId), a = $c.filter(
        (o) => i.includes(o.id)
      );
      return {
        ...s,
        likedByUsers: a
      };
    });
    return T.json(r, { status: 200 });
  }),
  // GET /api/me/comments
  j.get(`${P}/me/comments`, async ({ request: e }) => {
    const t = await vn(e);
    if (!t)
      return T.json({ message: "Unauthorized" }, { status: 401 });
    const n = Mc.filter(
      (r) => r.authorId === t
    );
    return T.json(n, { status: 200 });
  }),
  // GET /api/me/comments/count
  j.get(`${P}/me/comments/count`, async ({ request: e }) => {
    const t = await vn(e);
    if (!t)
      return T.json({ message: "Unauthorized" }, { status: 401 });
    const n = Mc.filter(
      (r) => r.authorId === t
    ).length;
    return T.json({ count: n }, { status: 200 });
  }),
  // GET /api/me/likes
  j.get(`${P}/me/likes`, async ({ request: e }) => {
    const t = await vn(e);
    if (!t)
      return T.json({ message: "Unauthorized" }, { status: 401 });
    const n = Di.filter((r) => r.userId === t);
    return T.json(n, { status: 200 });
  }),
  // GET /api/me/likes/count
  j.get(`${P}/me/likes/count`, async ({ request: e }) => {
    const t = await vn(e);
    if (!t)
      return T.json({ message: "Unauthorized" }, { status: 401 });
    const n = Di.filter(
      (r) => r.userId === t
    ).length;
    return T.json({ count: n }, { status: 200 });
  })
], vk = [
  ...Tm,
  ...bm,
  ...Em,
  ...Im,
  ...yk,
  ...Uv
], bk = Kd(...vk);
async function mw(e = "") {
  if (!(typeof window > "u"))
    return bk.start({
      onUnhandledRequest: "bypass",
      quiet: !1,
      serviceWorker: { url: `/${e}/mockServiceWorker.js` }
    });
}
const Kr = Ps, kk = [
  // GET /api/me
  j.get(`${P}/me`, async ({ request: e }) => {
    const t = await fe(e.headers);
    if (t.error)
      return t.error;
    const n = t.userId, r = Kr.find((s) => s.id === n);
    return r ? T.json(r, { status: 200 }) : T.json(
      { message: "User profile not found in mock data for token ID." },
      { status: 404 }
    );
  }),
  // PUT /api/me
  j.put(`${P}/me`, async ({ request: e }) => {
    const t = await fe(e.headers);
    if (t.error)
      return t.error;
    const n = t.userId, r = await e.json(), s = Kr.findIndex((a) => a.id === n);
    if (s === -1)
      return T.json(
        { message: "User profile not found in mock data." },
        { status: 404 }
      );
    const i = {
      ...Kr[s],
      ...r,
      modifiedDate: (/* @__PURE__ */ new Date()).toISOString()
    };
    return Kr[s] = i, T.json(i, { status: 200 });
  })
], ef = [
  {
    id: 1,
    title: "Weekly Project Report",
    content: "Prepare a summary of weekly progress for the team meeting on Friday. Focus on the integration of new components and the database structure.",
    items: [
      {
        id: 1,
        text: "Finalize work on the user authentication module",
        isCompleted: !0
      },
      {
        id: 2,
        text: "Develop a test plan for the mobile version",
        isCompleted: !1
      },
      {
        id: 3,
        text: "Review and approve pull requests from Helena",
        isCompleted: !1
      }
    ],
    status: "NOTES",
    createdAt: "2025-10-01T10:00:00.000Z",
    updatedAt: "2025-10-07T15:30:00.000Z",
    userId: 1
  },
  {
    id: 2,
    title: "Grocery Shopping List",
    content: null,
    items: [
      {
        id: 1,
        text: "Milk (Lactose-free)",
        isCompleted: !0
      },
      {
        id: 2,
        text: "Bread (Whole grain)",
        isCompleted: !0
      },
      {
        id: 3,
        text: "Eggs (Dozen)",
        isCompleted: !1
      }
    ],
    status: "NOTES",
    createdAt: "2025-10-06T12:00:00.000Z",
    updatedAt: "2025-10-07T09:15:00.000Z",
    userId: 1
  },
  {
    id: 3,
    title: "Ideas for Next Sprint",
    content: "Potential features for the next development cycle include user profile customization and adding social media buttons. Need to prioritize based on user feedback.",
    items: null,
    status: "NOTES",
    createdAt: "2025-09-28T18:45:00.000Z",
    updatedAt: "2025-09-28T18:45:00.000Z",
    userId: 1
  },
  {
    id: 4,
    title: "Old Q4 Planning Draft",
    content: "This document contains preliminary budget estimates and team capacity projections from last year. Should be kept for reference but is no longer actively used.",
    items: null,
    status: "ARCHIVED",
    createdAt: "2024-11-15T08:00:00.000Z",
    updatedAt: "2025-01-20T11:00:00.000Z",
    userId: 1
  },
  {
    id: 5,
    title: "Client Meeting Notes (Draft)",
    content: "Meeting with Client X on 2025-08-10. Main points were contract renewal and scope creep concerns. Delete this after transferring key details to the task tracking system.",
    items: [
      {
        id: 1,
        text: "Created a task in the system for scope change.",
        isCompleted: !0
      }
    ],
    status: "TRASH",
    createdAt: "2025-08-10T14:20:00.000Z",
    updatedAt: "2025-10-05T10:00:00.000Z",
    userId: 1
  },
  {
    id: 6,
    title: "Learning Design System Basics",
    content: "Dedicate two hours to watch the introductory course on atomic design principles and apply them to a small component in the local environment.",
    items: [
      {
        id: 1,
        text: "Complete the 'Typography and Color Palette Basics' module.",
        isCompleted: !1
      },
      {
        id: 2,
        text: "Rebuild the primary navigation bar using the new design system principles.",
        isCompleted: !1
      }
    ],
    status: "NOTES",
    createdAt: "2025-10-07T18:00:00.000Z",
    updatedAt: "2025-10-07T18:00:00.000Z",
    userId: 1
  },
  {
    id: 7,
    title: "Schedule a Dentist Appointment",
    content: "It's been over six months since the last check-up. Need to call the clinic before 5 PM.",
    items: null,
    status: "NOTES",
    createdAt: "2025-10-08T08:30:00.000Z",
    updatedAt: "2025-10-08T08:30:00.000Z",
    userId: 1
  },
  {
    id: 8,
    title: "Pay Monthly Bills",
    content: null,
    items: [
      {
        id: 1,
        text: "Electricity bill (Due 15th)",
        isCompleted: !1
      },
      {
        id: 2,
        text: "Internet subscription fee",
        isCompleted: !0
      },
      {
        id: 3,
        text: "Rent payment",
        isCompleted: !1
      }
    ],
    status: "NOTES",
    createdAt: "2025-10-05T14:00:00.000Z",
    updatedAt: "2025-10-05T14:00:00.000Z",
    userId: 1
  },
  {
    id: 9,
    title: "Full API Refactoring Plan",
    content: "Conduct a full review of the current API architecture. Identify inconsistencies, performance bottlenecks, and define a versioning strategy. The goal is to improve maintainability while ensuring backward compatibility.",
    items: [
      {
        id: 1,
        text: "Audit endpoints",
        isCompleted: !0
      },
      {
        id: 2,
        text: "Define versioning",
        isCompleted: !1
      },
      {
        id: 3,
        text: "Write migration plan",
        isCompleted: !1
      }
    ],
    status: "NOTES",
    createdAt: "2025-10-08T12:00:00.000Z",
    updatedAt: "2025-10-08T12:00:00.000Z",
    userId: 4
  },
  {
    id: 10,
    title: "Old Authentication Flow",
    content: "Legacy session-based authentication system replaced by JWT. Kept only for historical reference.",
    items: null,
    status: "ARCHIVED",
    createdAt: "2024-12-01T09:00:00.000Z",
    updatedAt: "2025-02-01T09:00:00.000Z",
    userId: 4
  },
  {
    id: 11,
    title: "Temporary Debug Logs Cleanup",
    content: "Remove temporary debug logs that were added during production issue investigation.",
    items: null,
    status: "TRASH",
    createdAt: "2025-10-01T10:00:00.000Z",
    updatedAt: "2025-10-02T10:00:00.000Z",
    userId: 5
  },
  {
    id: 12,
    title: "Mobile UX Improvements",
    content: "Analyze mobile usage patterns and improve usability. Focus on touch interactions, scroll performance, and layout responsiveness.",
    items: [
      {
        id: 1,
        text: "Fix tap targets",
        isCompleted: !1
      },
      {
        id: 2,
        text: "Improve spacing",
        isCompleted: !1
      }
    ],
    status: "NOTES",
    createdAt: "2025-10-07T11:00:00.000Z",
    updatedAt: "2025-10-07T11:00:00.000Z",
    userId: 2
  },
  {
    id: 13,
    title: "Unused Dashboard Design Draft",
    content: "Initial dashboard redesign proposal that was rejected after stakeholder review.",
    items: null,
    status: "ARCHIVED",
    createdAt: "2025-08-01T08:00:00.000Z",
    updatedAt: "2025-08-10T08:00:00.000Z",
    userId: 2
  },
  {
    id: 14,
    title: "Sprint Planning Summary",
    content: "Detailed summary of sprint planning including story point estimates, identified risks, and cross-team dependencies.",
    items: [
      {
        id: 1,
        text: "Document risks",
        isCompleted: !1
      },
      {
        id: 2,
        text: "Finalize backlog",
        isCompleted: !0
      }
    ],
    status: "NOTES",
    createdAt: "2025-10-06T10:00:00.000Z",
    updatedAt: "2025-10-06T10:00:00.000Z",
    userId: 3
  },
  {
    id: 15,
    title: "Outdated Product Roadmap",
    content: "Roadmap created before major product pivot. No longer relevant.",
    items: null,
    status: "ARCHIVED",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-03-01T00:00:00.000Z",
    userId: 3
  },
  {
    id: 16,
    title: "Broken CI Experiment",
    content: "Failed CI/CD pipeline experiment. Do not reuse.",
    items: null,
    status: "TRASH",
    createdAt: "2025-09-20T10:00:00.000Z",
    updatedAt: "2025-09-21T10:00:00.000Z",
    userId: 5
  },
  {
    id: 17,
    title: "Performance Optimization Research",
    content: "Investigate system performance under load. Compare caching strategies, DB indexing, and query optimization techniques. Provide benchmark results and recommendations.",
    items: [
      {
        id: 1,
        text: "Benchmark queries",
        isCompleted: !1
      },
      {
        id: 2,
        text: "Test caching layer",
        isCompleted: !1
      }
    ],
    status: "NOTES",
    createdAt: "2025-10-05T14:00:00.000Z",
    updatedAt: "2025-10-05T14:00:00.000Z",
    userId: 4
  },
  {
    id: 18,
    title: "Duplicate Task Entry",
    content: "Duplicate created by mistake during import.",
    items: null,
    status: "TRASH",
    createdAt: "2025-10-04T09:00:00.000Z",
    updatedAt: "2025-10-04T09:00:00.000Z",
    userId: 1
  },
  {
    id: 19,
    title: "Frontend Architecture Notes",
    content: "Define frontend architecture guidelines including state management, folder structure, and component design patterns.",
    items: [
      {
        id: 1,
        text: "Choose state library",
        isCompleted: !1
      },
      {
        id: 2,
        text: "Define folder structure",
        isCompleted: !0
      }
    ],
    status: "NOTES",
    createdAt: "2025-10-03T12:00:00.000Z",
    updatedAt: "2025-10-03T12:00:00.000Z",
    userId: 2
  },
  {
    id: 20,
    title: "Legacy CSS Cleanup",
    content: "Remove old styles after migration to design system.",
    items: null,
    status: "ARCHIVED",
    createdAt: "2025-06-01T10:00:00.000Z",
    updatedAt: "2025-07-01T10:00:00.000Z",
    userId: 2
  },
  {
    id: 21,
    title: "Unstructured Call Notes",
    content: "Messy notes from client call, replaced with structured documentation.",
    items: null,
    status: "TRASH",
    createdAt: "2025-10-02T15:00:00.000Z",
    updatedAt: "2025-10-02T15:00:00.000Z",
    userId: 3
  },
  {
    id: 22,
    title: "Monitoring & Alerting Strategy",
    content: "Define system monitoring including metrics, logging, alert thresholds, escalation paths, and ownership responsibilities.",
    items: [
      {
        id: 1,
        text: "Define metrics",
        isCompleted: !1
      },
      {
        id: 2,
        text: "Configure alerts",
        isCompleted: !1
      }
    ],
    status: "NOTES",
    createdAt: "2025-10-01T13:00:00.000Z",
    updatedAt: "2025-10-01T13:00:00.000Z",
    userId: 5
  },
  {
    id: 23,
    title: "Old Monitoring Setup",
    content: "Deprecated monitoring stack replaced with new observability tools.",
    items: null,
    status: "ARCHIVED",
    createdAt: "2025-03-01T10:00:00.000Z",
    updatedAt: "2025-05-01T10:00:00.000Z",
    userId: 5
  },
  {
    id: 24,
    title: "Invalid Test Data",
    content: "Generated incorrectly during QA testing.",
    items: null,
    status: "TRASH",
    createdAt: "2025-09-25T09:00:00.000Z",
    updatedAt: "2025-09-25T09:00:00.000Z",
    userId: 4
  },
  {
    id: 25,
    title: "Design System Expansion",
    content: "Extend design system with new reusable components and document their usage.",
    items: [
      {
        id: 1,
        text: "Add modal component",
        isCompleted: !1
      },
      {
        id: 2,
        text: "Write docs",
        isCompleted: !1
      }
    ],
    status: "NOTES",
    createdAt: "2025-10-08T09:30:00.000Z",
    updatedAt: "2025-10-08T09:30:00.000Z",
    userId: 2
  },
  {
    id: 26,
    title: "Deprecated Component Library",
    content: "Old UI components no longer used after redesign.",
    items: null,
    status: "ARCHIVED",
    createdAt: "2025-02-10T10:00:00.000Z",
    updatedAt: "2025-04-10T10:00:00.000Z",
    userId: 2
  },
  {
    id: 27,
    title: "Experiment Branch Notes",
    content: "Temporary notes from development experiment.",
    items: null,
    status: "TRASH",
    createdAt: "2025-09-10T10:00:00.000Z",
    updatedAt: "2025-09-10T10:00:00.000Z",
    userId: 1
  },
  {
    id: 28,
    title: "Release Checklist",
    content: "Pre-release checklist including QA, documentation, deployment validation, and rollback planning.",
    items: [
      {
        id: 1,
        text: "Run regression tests",
        isCompleted: !1
      },
      {
        id: 2,
        text: "Verify deployment",
        isCompleted: !1
      }
    ],
    status: "NOTES",
    createdAt: "2025-10-08T12:30:00.000Z",
    updatedAt: "2025-10-08T12:30:00.000Z",
    userId: 5
  }
], ge = ef, Kt = (e, t) => ge.findIndex((n) => n.id === e && n.userId === t), wk = [
  // GET /api/todos
  j.get(`${P}/todos`, async ({ request: e }) => {
    const t = await fe(e.headers);
    if (t.error)
      return t.error;
    const n = t.userId, s = new URL(e.url).searchParams.get("status");
    let i = ge.filter((a) => a.userId === n);
    if (s && ["NOTES", "ARCHIVED", "TRASH"].includes(s))
      i = i.filter((a) => a.status === s);
    else if (!s)
      i = i.filter((a) => a.status === "NOTES");
    else
      return T.json(
        { message: "Invalid status filter." },
        { status: 400 }
      );
    return T.json(i, { status: 200 });
  }),
  // POST /api/todos
  j.post(`${P}/todos`, async ({ request: e }) => {
    const t = await fe(e.headers);
    if (t.error)
      return t.error;
    const n = t.userId, r = await e.json(), s = (/* @__PURE__ */ new Date()).toISOString(), a = (ge.length > 0 ? Math.max(...ge.map((u) => u.id)) : 100) + 1, o = r.items ? r.items.map((u, l) => ({
      id: l + 1,
      text: u.text,
      isCompleted: !1
    })) : void 0, c = {
      id: a,
      title: r.title,
      content: r.content,
      items: o,
      status: "NOTES",
      createdAt: s,
      updatedAt: s,
      userId: n,
      backgroundImage: void 0
    };
    return ge.push(c), T.json(c, { status: 201 });
  }),
  // PUT /api/todos/:todoId
  j.put(`${P}/todos/:todoId`, async ({ params: e, request: t }) => {
    const n = await fe(t.headers);
    if (n.error)
      return n.error;
    const r = n.userId, { todoId: s } = e, i = Number(s), a = await t.json(), o = (/* @__PURE__ */ new Date()).toISOString(), c = Kt(i, r);
    if (c !== -1) {
      const { items: u, ...l } = a, p = {
        ...ge[c],
        ...l,
        ...u !== void 0 && { items: u },
        updatedAt: o
      };
      return ge[c] = p, T.json(p, { status: 200 });
    }
    return T.json(
      { message: "Todo not found or access denied." },
      { status: 404 }
    );
  }),
  // PUT /api/background
  j.put(
    `${P}/background`,
    async ({ request: e }) => {
      const t = await fe(e.headers);
      if (t.error)
        return t.error;
      const n = t.userId, r = (/* @__PURE__ */ new Date()).toISOString(), s = ge.filter((a) => a.userId === n);
      if (s.length === 0)
        return T.json(
          { message: "No todos found for user." },
          { status: 404 }
        );
      const i = await e.json();
      if (!i.backgroundImage)
        return T.json(
          { message: "backgroundImage field is required." },
          { status: 400 }
        );
      for (const a of s) {
        const o = Kt(a.id, n), c = ge[o];
        c.backgroundImage = i.backgroundImage, c.updatedAt = r;
      }
      return T.json(ge, { status: 200 });
    }
  ),
  // PUT /api/todos/:todoId/uncheckAll
  j.put(
    `${P}/todos/:todoId/uncheckAll`,
    async ({ params: e, request: t }) => {
      const n = await fe(t.headers);
      if (n.error)
        return n.error;
      const r = n.userId, { todoId: s } = e, i = Number(s), a = (/* @__PURE__ */ new Date()).toISOString(), o = Kt(i, r);
      if (o === -1)
        return T.json(
          { message: "Todo not found or access denied." },
          { status: 404 }
        );
      const c = ge[o];
      return !c.items || c.items.length === 0 ? T.json(
        { message: "Todo does not contain any checklist items to uncheck." },
        { status: 400 }
      ) : (c.items.forEach((u) => {
        u.isCompleted = !1;
      }), c.updatedAt = a, T.json(c, { status: 200 }));
    }
  ),
  // PUT /api/todos/:todoId/item/:itemId/toggle
  j.put(
    `${P}/todos/:todoId/item/:itemId/toggle`,
    async ({ params: e, request: t }) => {
      const n = await fe(t.headers);
      if (n.error)
        return n.error;
      const r = n.userId, { todoId: s, itemId: i } = e, a = Kt(Number(s), r), o = (/* @__PURE__ */ new Date()).toISOString();
      if (a !== -1) {
        const c = ge[a];
        if (!c.items)
          return T.json(
            { message: "Todo does not contain checklist items." },
            { status: 400 }
          );
        const u = c.items.find((l) => l.id === Number(i));
        return u ? (u.isCompleted = !u.isCompleted, c.updatedAt = o, T.json(c, { status: 200 })) : T.json(
          { message: "Item not found." },
          { status: 404 }
        );
      }
      return T.json(
        { message: "Todo not found or access denied." },
        { status: 404 }
      );
    }
  ),
  // POST /api/todos/:todoId/status
  j.post(
    `${P}/todos/:todoId/status`,
    async ({ params: e, request: t }) => {
      const n = await fe(t.headers);
      if (n.error)
        return n.error;
      const r = n.userId, { todoId: s } = e, i = Number(s), { newStatus: a } = await t.json(), o = (/* @__PURE__ */ new Date()).toISOString();
      if (!["NOTES", "ARCHIVED", "TRASH"].includes(a))
        return T.json(
          { message: "Invalid status value." },
          { status: 400 }
        );
      const c = Kt(i, r);
      if (c !== -1) {
        const u = ge[c];
        return u.status = a, u.updatedAt = o, T.json(u, { status: 200 });
      }
      return T.json(
        { message: "Todo not found or access denied." },
        { status: 404 }
      );
    }
  ),
  // DELETE /api/todos/:todoId
  j.delete(`${P}/todos/:todoId`, async ({ params: e, request: t }) => {
    const n = await fe(t.headers);
    if (n.error)
      return n.error;
    const r = n.userId, { todoId: s } = e, i = Number(s), a = Kt(i, r);
    return a !== -1 ? (ge.splice(a, 1), new T(null, { status: 204 })) : T.json(
      { message: "Todo not found or access denied." },
      { status: 404 }
    );
  }),
  // DELETE /api/todos/deleteAll
  j.delete(`${P}/todos/deleteAll`, async ({ request: e }) => {
    const t = await fe(e.headers);
    if (t.error)
      return t.error;
    const n = t.userId, r = ge.filter((s) => s.userId === n && s.status === "TRASH");
    if (r.length === 0)
      return T.json(
        { message: "No deleted todos found." },
        { status: 404 }
      );
    for (const s of r) {
      const i = Kt(s.id, n);
      i !== -1 && ge.splice(i, 1);
    }
    return T.json(null, { status: 204 });
  }),
  // PUT /api/todos/unarchiveAll
  j.put(
    `${P}/todos/unarchiveAll`,
    async ({ request: e }) => {
      const t = await fe(e.headers);
      if (t.error)
        return t.error;
      const n = t.userId, r = ge.filter((i) => i.userId === n && i.status === "ARCHIVED");
      if (r.length === 0)
        return T.json(
          { message: "No archived todos found." },
          { status: 404 }
        );
      const s = (/* @__PURE__ */ new Date()).toISOString();
      return r.map((i) => T.json({
        ...i,
        status: "NOTES",
        updatedAt: s
      }, { status: 200 }));
    }
  ),
  // POST /api/upload-image
  j.post(`${P}/upload-image`, async () => T.json(
    {
      url: "/assets/uploaded-image-" + Date.now() + ".jpg"
    },
    { status: 201 }
  ))
], Tk = `
    enum NoteStatus {
        NOTES
        ARCHIVED
        TRASH
    }

    type User {
        id: Int!
        username: String!
        email: String
        profileImage: String
        firstName: String
        secondName: String
        description: String!
        lastLogin: String!
        creationDate: String!
        modifiedDate: String!
    }

    type ChecklistItem {
        id: Int!
        text: String!
        isCompleted: Boolean!
    }

    type Todo {
        id: Int!
        title: String!
        content: String
        items: [ChecklistItem]
        backgroundImage: String
        status: NoteStatus!
        createdAt: String!
        updatedAt: String!
        userId: Int!
    }

    type LoginResponse {
        token: String!
        user: User!
    }

    type SuccessMessage {
        message: String!
    }

    type DeleteResponse {
        id: Int!
        success: Boolean!
    }

    input CreateTodoItemInput {
        text: String!
    }

    input UpdateChecklistItemInput {
        id: Int!
        text: String!
        isCompleted: Boolean!
    }

    input CreateTodoInput {
        title: String!
        content: String
        items: [CreateTodoItemInput]
    }

    input UpdateTodoInput {
        title: String
        content: String
        items: [UpdateChecklistItemInput]
    }

    input UpdateProfileInput {
        username: String
        email: String
        profileImage: String
        firstName: String
        secondName: String
        description: String
    }

    # --- Query ---

    type Query {
        me: User
        todos(status: NoteStatus): [Todo!]!
    }

    # --- Mutation ---

    type Mutation {
        # Auth
        login(email: String!, password: String!): LoginResponse!
        signup(email: String!, password: String!): SuccessMessage!
        logout: SuccessMessage!

        # Profile
        updateProfile(input: UpdateProfileInput!): User!

        # Todos
        createTodo(input: CreateTodoInput!): Todo!
        updateTodo(id: Int!, input: UpdateTodoInput!): Todo!
        changeTodoStatus(id: Int!, newStatus: NoteStatus!): Todo!
        deleteTodo(id: Int!): DeleteResponse!

        # Checklist Actions
        toggleChecklistItem(todoId: Int!, itemId: Int!): Todo!
        updateChecklistItemText(todoId: Int!, itemId: Int!, text: String!): Todo!
        uncheckAllItems(id: Int!): Todo!

        # Background
        updateTodoBackground(id: Int!, backgroundImage: String!): Todo!
    }
`, lr = Ps, tf = (e) => lr.find((t) => t.id === e), Ek = (e) => {
  const t = e.headers.get("Authorization");
  return t != null && t.startsWith("Bearer ") ? t.replace("Bearer ", "") : null;
}, Fc = async (e) => {
  const t = e.headers.get("Authorization"), n = t == null ? void 0 : t.replace("Bearer ", "");
  if (!n)
    throw new Error("UNAUTHENTICATED");
  const r = await ya(n);
  if (!r || typeof r.payload.userId != "number")
    throw new Error("UNAUTHENTICATED");
  const s = r.payload.userId, i = tf(s);
  if (!i)
    throw new Error("User not found in mock data for token ID.");
  return { user: i, userId: s };
}, Uc = {
  Query: {
    me: async (e, t, { request: n }) => {
      const { user: r } = await Fc(n);
      return r;
    }
  },
  Mutation: {
    login: async (e, { email: t, password: n }) => {
      var r;
      if (t === zn && n === $s) {
        const s = (r = lr.find(
          (i) => i.email === zn
        )) == null ? void 0 : r.id;
        if (s) {
          const i = tf(s);
          if (i)
            return { token: await ul(i.id), user: i };
        }
      }
      throw new Error("Incorrect email or password");
    },
    signup: (e, { email: t, password: n }) => {
      if (!t || !n)
        throw new Error("Email and password are required for registration");
      return { message: "Registration successful" };
    },
    logout: (e, t, { request: n }) => {
      const r = Ek(n);
      return r && (cl(r), console.log(`Token blacklisted via GQL logout: ${r}`)), { message: "Successful logout" };
    },
    updateProfile: async (e, { input: t }, { request: n }) => {
      const { userId: r } = await Fc(n), s = lr.findIndex((a) => a.id === r);
      if (s === -1)
        throw new Error("User profile not found in mock data.");
      const i = {
        ...lr[s],
        ...t,
        modifiedDate: (/* @__PURE__ */ new Date()).toISOString()
      };
      return lr[s] = i, i;
    }
  }
}, Re = ef, bt = async (e) => {
  const t = e.headers.get("Authorization"), n = t == null ? void 0 : t.replace("Bearer ", "");
  if (!n)
    throw new Error("UNAUTHENTICATED");
  const r = await ya(n);
  if (!r)
    throw new Error("UNAUTHENTICATED");
  const s = r.payload.userId;
  if (typeof s != "number")
    throw new Error("UNAUTHENTICATED");
  return s;
}, en = (e, t) => Re.findIndex((n) => n.id === e && n.userId === t), zc = {
  Query: {
    todos: async (e, { status: t }, { request: n }) => {
      const r = await bt(n);
      let s = Re.filter((a) => a.userId === r);
      const i = t || "NOTES";
      if (!["NOTES", "ARCHIVED", "TRASH"].includes(i))
        throw new Error("Invalid status filter.");
      return s = s.filter((a) => a.status === i), s;
    }
  },
  Mutation: {
    createTodo: async (e, { input: t }, { request: n }) => {
      const r = await bt(n), s = (/* @__PURE__ */ new Date()).toISOString(), a = (Re.length > 0 ? Math.max(...Re.map((u) => u.id)) : 100) + 1, o = t.items ? t.items.map((u, l) => ({
        id: l + 1,
        text: u.text,
        isCompleted: !1
      })) : void 0, c = {
        id: a,
        title: t.title,
        content: t.content,
        items: o,
        status: "NOTES",
        createdAt: s,
        updatedAt: s,
        userId: r,
        backgroundImage: void 0
      };
      return Re.push(c), c;
    },
    updateTodo: async (e, { id: t, input: n }, { request: r }) => {
      const s = await bt(r), i = en(Number(t), s), a = (/* @__PURE__ */ new Date()).toISOString();
      if (i === -1)
        throw new Error("Todo not found or access denied.");
      const { items: o, ...c } = n, l = {
        ...Re[i],
        ...c,
        ...o !== void 0 && { items: o },
        updatedAt: a
      };
      return Re[i] = l, l;
    },
    changeTodoStatus: async (e, { id: t, newStatus: n }, { request: r }) => {
      const s = await bt(r), i = en(Number(t), s), a = (/* @__PURE__ */ new Date()).toISOString();
      if (!["NOTES", "ARCHIVED", "TRASH"].includes(n))
        throw new Error("Invalid status value.");
      if (i === -1)
        throw new Error("Todo not found or access denied.");
      const o = Re[i];
      return o.status = n, o.updatedAt = a, o;
    },
    deleteTodo: async (e, { id: t }, { request: n }) => {
      const r = await bt(n), s = en(Number(t), r);
      if (s === -1)
        throw new Error("Todo not found or access denied.");
      return Re.splice(s, 1), { id: Number(t), success: !0 };
    },
    toggleChecklistItem: async (e, { todoId: t, itemId: n }, { request: r }) => {
      const s = await bt(r), i = en(Number(t), s), a = (/* @__PURE__ */ new Date()).toISOString();
      if (i === -1)
        throw new Error("Todo not found or access denied.");
      const o = Re[i];
      if (!o.items)
        throw new Error("Todo does not contain checklist items.");
      const c = o.items.find((u) => u.id === Number(n));
      if (c)
        return c.isCompleted = !c.isCompleted, o.updatedAt = a, o;
      throw new Error("Item not found.");
    },
    updateChecklistItemText: async (e, { todoId: t, itemId: n, text: r }, { request: s }) => {
      const i = await bt(s), a = en(Number(t), i), o = (/* @__PURE__ */ new Date()).toISOString();
      if (a === -1)
        throw new Error("Todo not found or access denied.");
      const c = Re[a];
      if (!c.items)
        throw new Error("Todo does not contain checklist items.");
      const u = c.items.find((l) => l.id === Number(n));
      if (u)
        return u.text = r, c.updatedAt = o, c;
      throw new Error("Item not found.");
    },
    uncheckAllItems: async (e, { id: t }, { request: n }) => {
      const r = await bt(n), s = en(Number(t), r), i = (/* @__PURE__ */ new Date()).toISOString();
      if (s === -1)
        throw new Error("Todo not found or access denied.");
      const a = Re[s];
      if (!a.items || a.items.length === 0)
        throw new Error(
          "Todo does not contain any checklist items to uncheck."
        );
      return a.items.forEach((o) => {
        o.isCompleted = !1;
      }), a.updatedAt = i, a;
    },
    updateTodoBackground: async (e, { id: t, backgroundImage: n }, { request: r }) => {
      const s = await bt(r), i = en(Number(t), s), a = (/* @__PURE__ */ new Date()).toISOString();
      if (i === -1)
        throw new Error("Todo not found or access denied.");
      if (!n)
        throw new Error("backgroundImage field is required.");
      const o = Re[i];
      return o.backgroundImage = n, o.updatedAt = a, o;
    }
  }
}, Ik = {
  Query: {
    ...Uc.Query,
    ...zc.Query
  },
  Mutation: {
    ...Uc.Mutation,
    ...zc.Mutation
  }
}, xk = Ad({
  typeDefs: Tk,
  resolvers: Ik
}), Sk = [
  Ru.operation(async ({ operationName: e, query: t, variables: n, request: r }) => {
    const s = await Pa({
      schema: xk,
      document: Vs(t),
      variableValues: n,
      contextValue: { request: r },
      operationName: e
    });
    return s.errors && s.errors.length > 0 ? s.errors.some(
      (a) => a.message.includes("UNAUTHENTICATED") || a.message.includes("Incorrect email or password")
    ) ? T.json(s, { status: 401 }) : T.json(s, { status: 400 }) : T.json(s, { status: 200 });
  })
], Nk = [
  ...wm,
  ...kk,
  ...wk,
  ...Sk
], _k = Kd(...Nk);
async function gw(e = "") {
  if (!(typeof window > "u"))
    return _k.start({
      onUnhandledRequest: "bypass",
      quiet: !1,
      serviceWorker: { url: `/${e}/mockServiceWorker.js` }
    });
}
export {
  or as $,
  Wk as A,
  ft as B,
  De as C,
  Ht as D,
  Tr as E,
  pt as F,
  v as G,
  un as H,
  Dn as I,
  Be as J,
  f as K,
  Bt as L,
  qk as M,
  xt as N,
  ve as O,
  F as P,
  ow as Q,
  Jk as R,
  Ae as S,
  pe as T,
  $ as U,
  q as V,
  de as W,
  ie as X,
  wa as Y,
  Q as Z,
  M as _,
  fw as a,
  rw as a$,
  le as a0,
  lg as a1,
  zk as a2,
  Rl as a3,
  Lr as a4,
  Ar as a5,
  Qm as a6,
  ba as a7,
  Rm as a8,
  b as a9,
  et as aA,
  Pl as aB,
  Ws as aC,
  $l as aD,
  Ml as aE,
  vs as aF,
  bs as aG,
  ks as aH,
  Da as aI,
  xa as aJ,
  Hs as aK,
  Oe as aL,
  It as aM,
  wt as aN,
  Zs as aO,
  Ta as aP,
  Fl as aQ,
  uw as aR,
  Zk as aS,
  Gk as aT,
  Yk as aU,
  Qk as aV,
  Xk as aW,
  Kk as aX,
  ew as aY,
  tw as aZ,
  nw as a_,
  Lm as aa,
  Cm as ab,
  rt as ac,
  Rr as ad,
  _l as ae,
  Cr as af,
  Ra as ag,
  cn as ah,
  Tl as ai,
  wl as aj,
  Vi as ak,
  Bi as al,
  te as am,
  Ee as an,
  ys as ao,
  gi as ap,
  yi as aq,
  Gt as ar,
  Ol as as,
  Dl as at,
  Gs as au,
  Al as av,
  Cl as aw,
  Na as ax,
  Ll as ay,
  jl as az,
  q0 as b,
  Fg as b$,
  sw as b0,
  iw as b1,
  aw as b2,
  cw as b3,
  Ea as b4,
  Ul as b5,
  og as b6,
  fl as b7,
  _m as b8,
  me as b9,
  O0 as bA,
  Sg as bB,
  Ng as bC,
  Dg as bD,
  Ag as bE,
  Gl as bF,
  Lg as bG,
  Wl as bH,
  Pg as bI,
  Ug as bJ,
  zg as bK,
  qg as bL,
  Vg as bM,
  Hg as bN,
  Xg as bO,
  s0 as bP,
  a0 as bQ,
  p0 as bR,
  sd as bS,
  id as bT,
  b0 as bU,
  ad as bV,
  k0 as bW,
  E0 as bX,
  I0 as bY,
  S0 as bZ,
  N0 as b_,
  Mi as ba,
  Sm as bb,
  dl as bc,
  Vk as bd,
  Bk as be,
  kl as bf,
  Hk as bg,
  wr as bh,
  ar as bi,
  A as bj,
  Ig as bk,
  Vl as bl,
  lw as bm,
  xg as bn,
  Jo as bo,
  dw as bp,
  Bl as bq,
  Pr as br,
  Hl as bs,
  Ca as bt,
  rc as bu,
  Y0 as bv,
  u0 as bw,
  Ir as bx,
  R0 as by,
  D0 as bz,
  V0 as c,
  $g as c0,
  w0 as c1,
  T0 as c2,
  g0 as c3,
  y0 as c4,
  h0 as c5,
  m0 as c6,
  e0 as c7,
  he as c8,
  Fk as c9,
  Uk as ca,
  dd as cb,
  K0 as cc,
  hw as cd,
  Me as ce,
  gs as cf,
  zl as cg,
  ql as ch,
  o0 as ci,
  qi as cj,
  Cn as ck,
  Bo as cl,
  mw as cm,
  gw as cn,
  z as d,
  Pa as e,
  w as f,
  rd as g,
  Q0 as h,
  He as i,
  Er as j,
  Z0 as k,
  td as l,
  xs as m,
  je as n,
  Pe as o,
  Vs as p,
  _e as q,
  G as r,
  Oa as s,
  pw as t,
  tt as u,
  dg as v,
  ka as w,
  Ia as x,
  _a as y,
  Js as z
};
