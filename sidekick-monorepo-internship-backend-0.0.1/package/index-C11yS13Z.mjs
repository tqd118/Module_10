import { i as Ge, d as k, v as Pe, p as ie, a as ke, e as oe, b as qe, c as je, f as D, G as y, g as Qe, h as Ke, j as xe, k as Be, l as He, m as Ye, n as We, o as v, q as B, r as O, s as q, K as I, t as ze, u as Z, w, x as Je, y as Xe, z as ue, A as Ze, T as g, B as en, C as ce, D as pe, E as fe, F as le, H as de, I as nn, J as tn, L as sn, M as rn, N as me, O as Ee, P as De, Q as an, R as on, S as Y, U as F, V as L, W as M, X as U, Y as ye, Z as C, _ as A, $ as Te, a0 as G, a1 as un, a2 as cn, a3 as Re, a4 as be, a5 as pn, a6 as fn, a7 as ln, a8 as dn, a9 as K, aa as mn, ab as En, ac as Dn, ad as he, ae as yn, af as _e, ag as Tn, ah as ee } from "./index-CcrCprA4.mjs";
import { bi as lt, bj as dt, bB as mt, bC as Et, bD as Dt, ap as yt, aq as Tt, an as Rt, au as bt, al as ht, ao as _t, as as gt, ak as It, aw as Nt, at as At, av as vt, am as Ot, bE as Vt, bF as wt, bG as St, bH as $t, b8 as Ft, bI as Lt, c0 as Mt, b$ as Ut, bJ as Ct, bK as Gt, bL as Pt, bM as kt, b9 as qt, bN as jt, bO as Qt, c7 as Kt, bP as xt, bQ as Bt, aF as Ht, bR as Yt, b7 as Wt, cg as zt, aG as Jt, aH as Xt, c5 as Zt, bS as es, c6 as ns, bT as ts, c3 as ss, c4 as rs, bU as as, bV as is, bW as os, c1 as us, c2 as cs, bX as ps, by as fs, bY as ls, bZ as ds, b_ as ms, ay as Es, az as Ds, aD as ys, aB as Ts, aC as Rs, ax as bs, aA as hs, aE as _s, b1 as gs, b0 as Is, aR as Ns, aV as As, b6 as vs, aW as Os, aZ as Vs, a$ as ws, aX as Ss, b3 as $s, aY as Fs, a_ as Ls, aT as Ms, aQ as Us, aS as Cs, aU as Gs, b5 as Ps, b2 as ks, cb as qs, cc as js, ci as Qs, bu as Ks, bv as xs, cl as Bs, cd as Hs, ca as Ys, bx as Ws, bh as zs, ba as Js, b4 as Xs, bw as Zs, bg as er, aN as nr, aM as tr, bo as sr, bk as rr, aJ as ar, cj as ir, bl as or, aL as ur, aP as cr, aI as pr, bm as fr, aK as lr, br as dr, bt as mr, bp as Er, ck as Dr, bq as yr, bs as Tr, bn as Rr, aO as br, bd as hr, be as _r, c9 as gr, bb as Ir, bc as Nr, bA as Ar, ai as vr, aj as Or, ar as Vr, bz as wr, c8 as Sr, ce as $r, cf as Fr, bf as Lr, ch as Mr } from "./index-CcrCprA4.mjs";
const Kn = "16.11.0", xn = Object.freeze({
  major: 16,
  minor: 11,
  patch: 0,
  preReleaseTag: null
});
function Bn(e) {
  return new Promise((n) => n(ge(e)));
}
function Hn(e) {
  const n = ge(e);
  if (Ge(n))
    throw new Error("GraphQL execution failed to complete synchronously.");
  return n;
}
function ge(e) {
  arguments.length < 2 || k(
    !1,
    "graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead."
  );
  const {
    schema: n,
    source: t,
    rootValue: r,
    contextValue: s,
    variableValues: i,
    operationName: o,
    fieldResolver: p,
    typeResolver: l
  } = e, m = Pe(n);
  if (m.length > 0)
    return {
      errors: m
    };
  let E;
  try {
    E = ie(t);
  } catch (u) {
    return {
      errors: [u]
    };
  }
  const _ = ke(n, E);
  return _.length > 0 ? {
    errors: _
  } : oe({
    schema: n,
    document: E,
    rootValue: r,
    contextValue: s,
    variableValues: i,
    operationName: o,
    fieldResolver: p,
    typeResolver: l
  });
}
function Ie(e) {
  return typeof (e == null ? void 0 : e[Symbol.asyncIterator]) == "function";
}
function Rn(e, n) {
  const t = e[Symbol.asyncIterator]();
  async function r(s) {
    if (s.done)
      return s;
    try {
      return {
        value: await n(s.value),
        done: !1
      };
    } catch (i) {
      if (typeof t.return == "function")
        try {
          await t.return();
        } catch {
        }
      throw i;
    }
  }
  return {
    async next() {
      return r(await t.next());
    },
    async return() {
      return typeof t.return == "function" ? r(await t.return()) : {
        value: void 0,
        done: !0
      };
    },
    async throw(s) {
      if (typeof t.throw == "function")
        return r(await t.throw(s));
      throw s;
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
async function Yn(e) {
  arguments.length < 2 || k(
    !1,
    "graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead."
  );
  const n = await hn(e);
  return Ie(n) ? Rn(n, (r) => oe({ ...e, rootValue: r })) : n;
}
function bn(e) {
  const n = e[0];
  return n && "document" in n ? n : {
    schema: n,
    // FIXME: when underlying TS bug fixed, see https://github.com/microsoft/TypeScript/issues/31613
    document: e[1],
    rootValue: e[2],
    contextValue: e[3],
    variableValues: e[4],
    operationName: e[5],
    subscribeFieldResolver: e[6]
  };
}
async function hn(...e) {
  const n = bn(e), { schema: t, document: r, variableValues: s } = n;
  qe(t, r, s);
  const i = je(n);
  if (!("schema" in i))
    return {
      errors: i
    };
  try {
    const o = await _n(i);
    if (!Ie(o))
      throw new Error(
        `Subscription field must return Async Iterable. Received: ${D(o)}.`
      );
    return o;
  } catch (o) {
    if (o instanceof y)
      return {
        errors: [o]
      };
    throw o;
  }
}
async function _n(e) {
  const { schema: n, fragments: t, operation: r, variableValues: s, rootValue: i } = e, o = n.getSubscriptionType();
  if (o == null)
    throw new y(
      "Schema is not configured to execute subscription operation.",
      {
        nodes: r
      }
    );
  const p = Qe(
    n,
    t,
    s,
    o,
    r.selectionSet
  ), [l, m] = [...p.entries()][0], E = Ke(n, o, m[0]);
  if (!E) {
    const T = m[0].name.value;
    throw new y(
      `The subscription field "${T}" is not defined.`,
      {
        nodes: m
      }
    );
  }
  const _ = xe(void 0, l, o.name), u = Be(
    e,
    E,
    m,
    o,
    _
  );
  try {
    var f;
    const T = He(E, m[0], s), j = e.contextValue, V = await ((f = E.subscribe) !== null && f !== void 0 ? f : e.subscribeFieldResolver)(i, T, j, u);
    if (V instanceof Error)
      throw V;
    return V;
  } catch (T) {
    throw Ye(T, m, We(_));
  }
}
function Wn(e) {
  return {
    Field(n) {
      const t = e.getFieldDef(), r = t == null ? void 0 : t.deprecationReason;
      if (t && r != null) {
        const s = e.getParentType();
        s != null || v(!1), e.reportError(
          new y(
            `The field ${s.name}.${t.name} is deprecated. ${r}`,
            {
              nodes: n
            }
          )
        );
      }
    },
    Argument(n) {
      const t = e.getArgument(), r = t == null ? void 0 : t.deprecationReason;
      if (t && r != null) {
        const s = e.getDirective();
        if (s != null)
          e.reportError(
            new y(
              `Directive "@${s.name}" argument "${t.name}" is deprecated. ${r}`,
              {
                nodes: n
              }
            )
          );
        else {
          const i = e.getParentType(), o = e.getFieldDef();
          i != null && o != null || v(!1), e.reportError(
            new y(
              `Field "${i.name}.${o.name}" argument "${t.name}" is deprecated. ${r}`,
              {
                nodes: n
              }
            )
          );
        }
      }
    },
    ObjectField(n) {
      const t = B(e.getParentInputType());
      if (O(t)) {
        const r = t.getFields()[n.name.value], s = r == null ? void 0 : r.deprecationReason;
        s != null && e.reportError(
          new y(
            `The input field ${t.name}.${r.name} is deprecated. ${s}`,
            {
              nodes: n
            }
          )
        );
      }
    },
    EnumValue(n) {
      const t = e.getEnumValue(), r = t == null ? void 0 : t.deprecationReason;
      if (t && r != null) {
        const s = B(e.getInputType());
        s != null || v(!1), e.reportError(
          new y(
            `The enum value "${s.name}.${t.name}" is deprecated. ${r}`,
            {
              nodes: n
            }
          )
        );
      }
    }
  };
}
function zn(e) {
  return {
    Field(n) {
      const t = B(e.getType());
      t && q(t) && e.reportError(
        new y(
          `GraphQL introspection has been disabled, but the requested query contained the field "${n.name.value}".`,
          {
            nodes: n
          }
        )
      );
    }
  };
}
function gn(e) {
  const n = {
    descriptions: !0,
    specifiedByUrl: !1,
    directiveIsRepeatable: !1,
    schemaDescription: !1,
    inputValueDeprecation: !1,
    oneOf: !1,
    ...e
  }, t = n.descriptions ? "description" : "", r = n.specifiedByUrl ? "specifiedByURL" : "", s = n.directiveIsRepeatable ? "isRepeatable" : "", i = n.schemaDescription ? t : "";
  function o(l) {
    return n.inputValueDeprecation ? l : "";
  }
  const p = n.oneOf ? "isOneOf" : "";
  return `
    query IntrospectionQuery {
      __schema {
        ${i}
        queryType { name kind }
        mutationType { name kind }
        subscriptionType { name kind }
        types {
          ...FullType
        }
        directives {
          name
          ${t}
          ${s}
          locations
          args${o("(includeDeprecated: true)")} {
            ...InputValue
          }
        }
      }
    }

    fragment FullType on __Type {
      kind
      name
      ${t}
      ${r}
      ${p}
      fields(includeDeprecated: true) {
        name
        ${t}
        args${o("(includeDeprecated: true)")} {
          ...InputValue
        }
        type {
          ...TypeRef
        }
        isDeprecated
        deprecationReason
      }
      inputFields${o("(includeDeprecated: true)")} {
        ...InputValue
      }
      interfaces {
        ...TypeRef
      }
      enumValues(includeDeprecated: true) {
        name
        ${t}
        isDeprecated
        deprecationReason
      }
      possibleTypes {
        ...TypeRef
      }
    }

    fragment InputValue on __InputValue {
      name
      ${t}
      type { ...TypeRef }
      defaultValue
      ${o("isDeprecated")}
      ${o("deprecationReason")}
    }

    fragment TypeRef on __Type {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
}
function Jn(e, n) {
  let t = null;
  for (const s of e.definitions)
    if (s.kind === I.OPERATION_DEFINITION) {
      var r;
      if (n == null) {
        if (t)
          return null;
        t = s;
      } else if (((r = s.name) === null || r === void 0 ? void 0 : r.value) === n)
        return s;
    }
  return t;
}
function Xn(e, n) {
  if (n.operation === "query") {
    const t = e.getQueryType();
    if (!t)
      throw new y(
        "Schema does not define the required query root type.",
        {
          nodes: n
        }
      );
    return t;
  }
  if (n.operation === "mutation") {
    const t = e.getMutationType();
    if (!t)
      throw new y("Schema is not configured for mutations.", {
        nodes: n
      });
    return t;
  }
  if (n.operation === "subscription") {
    const t = e.getSubscriptionType();
    if (!t)
      throw new y("Schema is not configured for subscriptions.", {
        nodes: n
      });
    return t;
  }
  throw new y(
    "Can only have query, mutation and subscription operations.",
    {
      nodes: n
    }
  );
}
function Zn(e, n) {
  const t = {
    specifiedByUrl: !0,
    directiveIsRepeatable: !0,
    schemaDescription: !0,
    inputValueDeprecation: !0,
    oneOf: !0,
    ...n
  }, r = ie(gn(t)), s = ze({
    schema: e,
    document: r
  });
  return !s.errors && s.data || v(!1), s.data;
}
function et(e, n) {
  Z(e) && Z(e.__schema) || k(
    !1,
    `Invalid or incomplete introspection result. Ensure that you are passing "data" property of introspection response and no "errors" was returned alongside: ${D(
      e
    )}.`
  );
  const t = e.__schema, r = w(
    t.types,
    (a) => a.name,
    (a) => u(a)
  );
  for (const a of [...Je, ...Xe])
    r[a.name] && (r[a.name] = a);
  const s = t.queryType ? E(t.queryType) : null, i = t.mutationType ? E(t.mutationType) : null, o = t.subscriptionType ? E(t.subscriptionType) : null, p = t.directives ? t.directives.map(Ue) : [];
  return new ue({
    description: t.description,
    query: s,
    mutation: i,
    subscription: o,
    types: Object.values(r),
    directives: p,
    assumeValid: n == null ? void 0 : n.assumeValid
  });
  function l(a) {
    if (a.kind === g.LIST) {
      const c = a.ofType;
      if (!c)
        throw new Error("Decorated type deeper than introspection query.");
      return new Ee(l(c));
    }
    if (a.kind === g.NON_NULL) {
      const c = a.ofType;
      if (!c)
        throw new Error("Decorated type deeper than introspection query.");
      const b = l(c);
      return new De(an(b));
    }
    return m(a);
  }
  function m(a) {
    const c = a.name;
    if (!c)
      throw new Error(`Unknown type reference: ${D(a)}.`);
    const b = r[c];
    if (!b)
      throw new Error(
        `Invalid or incomplete schema, unknown type: ${c}. Ensure that a full introspection query is used in order to build a client schema.`
      );
    return b;
  }
  function E(a) {
    return Ze(m(a));
  }
  function _(a) {
    return on(m(a));
  }
  function u(a) {
    if (a != null && a.name != null && a.kind != null)
      switch (a.kind) {
        case g.SCALAR:
          return f(a);
        case g.OBJECT:
          return j(a);
        case g.INTERFACE:
          return J(a);
        case g.UNION:
          return V(a);
        case g.ENUM:
          return $e(a);
        case g.INPUT_OBJECT:
          return Fe(a);
      }
    const c = D(a);
    throw new Error(
      `Invalid or incomplete introspection result. Ensure that a full introspection query is used in order to build a client schema: ${c}.`
    );
  }
  function f(a) {
    return new en({
      name: a.name,
      description: a.description,
      specifiedByURL: a.specifiedByURL
    });
  }
  function T(a) {
    if (a.interfaces === null && a.kind === g.INTERFACE)
      return [];
    if (!a.interfaces) {
      const c = D(a);
      throw new Error(
        `Introspection result missing interfaces: ${c}.`
      );
    }
    return a.interfaces.map(_);
  }
  function j(a) {
    return new ce({
      name: a.name,
      description: a.description,
      interfaces: () => T(a),
      fields: () => X(a)
    });
  }
  function J(a) {
    return new pe({
      name: a.name,
      description: a.description,
      interfaces: () => T(a),
      fields: () => X(a)
    });
  }
  function V(a) {
    if (!a.possibleTypes) {
      const c = D(a);
      throw new Error(
        `Introspection result missing possibleTypes: ${c}.`
      );
    }
    return new fe({
      name: a.name,
      description: a.description,
      types: () => a.possibleTypes.map(E)
    });
  }
  function $e(a) {
    if (!a.enumValues) {
      const c = D(a);
      throw new Error(
        `Introspection result missing enumValues: ${c}.`
      );
    }
    return new le({
      name: a.name,
      description: a.description,
      values: w(
        a.enumValues,
        (c) => c.name,
        (c) => ({
          description: c.description,
          deprecationReason: c.deprecationReason
        })
      )
    });
  }
  function Fe(a) {
    if (!a.inputFields) {
      const c = D(a);
      throw new Error(
        `Introspection result missing inputFields: ${c}.`
      );
    }
    return new de({
      name: a.name,
      description: a.description,
      fields: () => Q(a.inputFields),
      isOneOf: a.isOneOf
    });
  }
  function X(a) {
    if (!a.fields)
      throw new Error(
        `Introspection result missing fields: ${D(a)}.`
      );
    return w(
      a.fields,
      (c) => c.name,
      Le
    );
  }
  function Le(a) {
    const c = l(a.type);
    if (!nn(c)) {
      const b = D(c);
      throw new Error(
        `Introspection must provide output type for fields, but received: ${b}.`
      );
    }
    if (!a.args) {
      const b = D(a);
      throw new Error(
        `Introspection result missing field args: ${b}.`
      );
    }
    return {
      description: a.description,
      deprecationReason: a.deprecationReason,
      type: c,
      args: Q(a.args)
    };
  }
  function Q(a) {
    return w(
      a,
      (c) => c.name,
      Me
    );
  }
  function Me(a) {
    const c = l(a.type);
    if (!tn(c)) {
      const Ce = D(c);
      throw new Error(
        `Introspection must provide input type for arguments, but received: ${Ce}.`
      );
    }
    const b = a.defaultValue != null ? sn(rn(a.defaultValue), c) : void 0;
    return {
      description: a.description,
      type: c,
      defaultValue: b,
      deprecationReason: a.deprecationReason
    };
  }
  function Ue(a) {
    if (!a.args) {
      const c = D(a);
      throw new Error(
        `Introspection result missing directive args: ${c}.`
      );
    }
    if (!a.locations) {
      const c = D(a);
      throw new Error(
        `Introspection result missing directive locations: ${c}.`
      );
    }
    return new me({
      name: a.name,
      description: a.description,
      isRepeatable: a.isRepeatable,
      locations: a.locations.slice(),
      args: Q(a.args)
    });
  }
}
function nt(e) {
  const n = e.toConfig(), t = w(
    x(n.types),
    (u) => u.name,
    _
  );
  return new ue({
    ...n,
    types: Object.values(t),
    directives: x(n.directives).map(o),
    query: i(n.query),
    mutation: i(n.mutation),
    subscription: i(n.subscription)
  });
  function r(u) {
    return C(u) ? new Ee(r(u.ofType)) : A(u) ? new De(r(u.ofType)) : s(u);
  }
  function s(u) {
    return t[u.name];
  }
  function i(u) {
    return u && s(u);
  }
  function o(u) {
    const f = u.toConfig();
    return new me({
      ...f,
      locations: Ne(f.locations, (T) => T),
      args: p(f.args)
    });
  }
  function p(u) {
    return P(u, (f) => ({ ...f, type: r(f.type) }));
  }
  function l(u) {
    return P(u, (f) => ({
      ...f,
      type: r(f.type),
      args: f.args && p(f.args)
    }));
  }
  function m(u) {
    return P(u, (f) => ({
      ...f,
      type: r(f.type)
    }));
  }
  function E(u) {
    return x(u).map(s);
  }
  function _(u) {
    if (Y(u) || q(u))
      return u;
    if (F(u)) {
      const f = u.toConfig();
      return new ce({
        ...f,
        interfaces: () => E(f.interfaces),
        fields: () => l(f.fields)
      });
    }
    if (L(u)) {
      const f = u.toConfig();
      return new pe({
        ...f,
        interfaces: () => E(f.interfaces),
        fields: () => l(f.fields)
      });
    }
    if (M(u)) {
      const f = u.toConfig();
      return new fe({
        ...f,
        types: () => E(f.types)
      });
    }
    if (U(u)) {
      const f = u.toConfig();
      return new le({
        ...f,
        values: P(f.values, (T) => T)
      });
    }
    if (O(u)) {
      const f = u.toConfig();
      return new de({
        ...f,
        fields: () => m(f.fields)
      });
    }
    v(!1, "Unexpected type: " + D(u));
  }
}
function P(e, n) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const r of Object.keys(e).sort(ye))
    t[r] = n(e[r]);
  return t;
}
function x(e) {
  return Ne(e, (n) => n.name);
}
function Ne(e, n) {
  return e.slice().sort((t, r) => {
    const s = n(t), i = n(r);
    return ye(s, i);
  });
}
function tt(e) {
  return Ae(
    e,
    (n) => !Re(n),
    In
  );
}
function st(e) {
  return Ae(e, Re, q);
}
function In(e) {
  return !be(e) && !q(e);
}
function Ae(e, n, t) {
  const r = e.getDirectives().filter(n), s = Object.values(e.getTypeMap()).filter(t);
  return [
    Nn(e),
    ...r.map((i) => Ln(i)),
    ...s.map((i) => vn(i))
  ].filter(Boolean).join(`

`);
}
function Nn(e) {
  if (e.description == null && An(e))
    return;
  const n = [], t = e.getQueryType();
  t && n.push(`  query: ${t.name}`);
  const r = e.getMutationType();
  r && n.push(`  mutation: ${r.name}`);
  const s = e.getSubscriptionType();
  return s && n.push(`  subscription: ${s.name}`), R(e) + `schema {
${n.join(`
`)}
}`;
}
function An(e) {
  const n = e.getQueryType();
  if (n && n.name !== "Query")
    return !1;
  const t = e.getMutationType();
  if (t && t.name !== "Mutation")
    return !1;
  const r = e.getSubscriptionType();
  return !(r && r.name !== "Subscription");
}
function vn(e) {
  if (Y(e))
    return On(e);
  if (F(e))
    return Vn(e);
  if (L(e))
    return wn(e);
  if (M(e))
    return Sn(e);
  if (U(e))
    return $n(e);
  if (O(e))
    return Fn(e);
  v(!1, "Unexpected type: " + D(e));
}
function On(e) {
  return R(e) + `scalar ${e.name}` + Mn(e);
}
function ve(e) {
  const n = e.getInterfaces();
  return n.length ? " implements " + n.map((t) => t.name).join(" & ") : "";
}
function Vn(e) {
  return R(e) + `type ${e.name}` + ve(e) + Oe(e);
}
function wn(e) {
  return R(e) + `interface ${e.name}` + ve(e) + Oe(e);
}
function Sn(e) {
  const n = e.getTypes(), t = n.length ? " = " + n.join(" | ") : "";
  return R(e) + "union " + e.name + t;
}
function $n(e) {
  const n = e.getValues().map(
    (t, r) => R(t, "  ", !r) + "  " + t.name + z(t.deprecationReason)
  );
  return R(e) + `enum ${e.name}` + W(n);
}
function Fn(e) {
  const n = Object.values(e.getFields()).map(
    (t, r) => R(t, "  ", !r) + "  " + H(t)
  );
  return R(e) + `input ${e.name}` + (e.isOneOf ? " @oneOf" : "") + W(n);
}
function Oe(e) {
  const n = Object.values(e.getFields()).map(
    (t, r) => R(t, "  ", !r) + "  " + t.name + Ve(t.args, "  ") + ": " + String(t.type) + z(t.deprecationReason)
  );
  return W(n);
}
function W(e) {
  return e.length !== 0 ? ` {
` + e.join(`
`) + `
}` : "";
}
function Ve(e, n = "") {
  return e.length === 0 ? "" : e.every((t) => !t.description) ? "(" + e.map(H).join(", ") + ")" : `(
` + e.map(
    (t, r) => R(t, "  " + n, !r) + "  " + n + H(t)
  ).join(`
`) + `
` + n + ")";
}
function H(e) {
  const n = Te(e.defaultValue, e.type);
  let t = e.name + ": " + String(e.type);
  return n && (t += ` = ${G(n)}`), t + z(e.deprecationReason);
}
function Ln(e) {
  return R(e) + "directive @" + e.name + Ve(e.args) + (e.isRepeatable ? " repeatable" : "") + " on " + e.locations.join(" | ");
}
function z(e) {
  return e == null ? "" : e !== un ? ` @deprecated(reason: ${G({
    kind: I.STRING,
    value: e
  })})` : " @deprecated";
}
function Mn(e) {
  return e.specifiedByURL == null ? "" : ` @specifiedBy(url: ${G({
    kind: I.STRING,
    value: e.specifiedByURL
  })})`;
}
function R(e, n = "", t = !0) {
  const { description: r } = e;
  if (r == null)
    return "";
  const s = G({
    kind: I.STRING,
    value: r,
    block: cn(r)
  });
  return (n && !t ? `
` + n : n) + s.replace(/\n/g, `
` + n) + `
`;
}
function rt(e) {
  const n = [];
  for (const t of e)
    n.push(...t.definitions);
  return {
    kind: I.DOCUMENT,
    definitions: n
  };
}
function at(e) {
  const n = [], t = /* @__PURE__ */ Object.create(null);
  for (const s of e.definitions)
    switch (s.kind) {
      case I.OPERATION_DEFINITION:
        n.push(s);
        break;
      case I.FRAGMENT_DEFINITION:
        t[s.name.value] = ne(
          s.selectionSet
        );
        break;
    }
  const r = /* @__PURE__ */ Object.create(null);
  for (const s of n) {
    const i = /* @__PURE__ */ new Set();
    for (const p of ne(s.selectionSet))
      we(i, t, p);
    const o = s.name ? s.name.value : "";
    r[o] = {
      kind: I.DOCUMENT,
      definitions: e.definitions.filter(
        (p) => p === s || p.kind === I.FRAGMENT_DEFINITION && i.has(p.name.value)
      )
    };
  }
  return r;
}
function we(e, n, t) {
  if (!e.has(t)) {
    e.add(t);
    const r = n[t];
    if (r !== void 0)
      for (const s of r)
        we(e, n, s);
  }
}
function ne(e) {
  const n = [];
  return pn(e, {
    FragmentSpread(t) {
      n.push(t.name.value);
    }
  }), n;
}
function it(e) {
  const n = fn(e) ? e : new ln(e), t = n.body, r = new dn(n);
  let s = "", i = !1;
  for (; r.advance().kind !== K.EOF; ) {
    const o = r.token, p = o.kind, l = !mn(o.kind);
    i && (l || o.kind === K.SPREAD) && (s += " ");
    const m = t.slice(o.start, o.end);
    p === K.BLOCK_STRING ? s += En(o.value, {
      minimize: !0
    }) : s += m, i = l;
  }
  return s;
}
function ot(e) {
  const n = Un(e);
  if (n)
    throw n;
  return e;
}
function Un(e) {
  if (typeof e == "string" || k(!1, "Expected name to be a string."), e.startsWith("__"))
    return new y(
      `Name "${e}" must not begin with "__", which is reserved by GraphQL introspection.`
    );
  try {
    Dn(e);
  } catch (n) {
    return n;
  }
}
var d;
(function(e) {
  e.TYPE_REMOVED = "TYPE_REMOVED", e.TYPE_CHANGED_KIND = "TYPE_CHANGED_KIND", e.TYPE_REMOVED_FROM_UNION = "TYPE_REMOVED_FROM_UNION", e.VALUE_REMOVED_FROM_ENUM = "VALUE_REMOVED_FROM_ENUM", e.REQUIRED_INPUT_FIELD_ADDED = "REQUIRED_INPUT_FIELD_ADDED", e.IMPLEMENTED_INTERFACE_REMOVED = "IMPLEMENTED_INTERFACE_REMOVED", e.FIELD_REMOVED = "FIELD_REMOVED", e.FIELD_CHANGED_KIND = "FIELD_CHANGED_KIND", e.REQUIRED_ARG_ADDED = "REQUIRED_ARG_ADDED", e.ARG_REMOVED = "ARG_REMOVED", e.ARG_CHANGED_KIND = "ARG_CHANGED_KIND", e.DIRECTIVE_REMOVED = "DIRECTIVE_REMOVED", e.DIRECTIVE_ARG_REMOVED = "DIRECTIVE_ARG_REMOVED", e.REQUIRED_DIRECTIVE_ARG_ADDED = "REQUIRED_DIRECTIVE_ARG_ADDED", e.DIRECTIVE_REPEATABLE_REMOVED = "DIRECTIVE_REPEATABLE_REMOVED", e.DIRECTIVE_LOCATION_REMOVED = "DIRECTIVE_LOCATION_REMOVED";
})(d || (d = {}));
var h;
(function(e) {
  e.VALUE_ADDED_TO_ENUM = "VALUE_ADDED_TO_ENUM", e.TYPE_ADDED_TO_UNION = "TYPE_ADDED_TO_UNION", e.OPTIONAL_INPUT_FIELD_ADDED = "OPTIONAL_INPUT_FIELD_ADDED", e.OPTIONAL_ARG_ADDED = "OPTIONAL_ARG_ADDED", e.IMPLEMENTED_INTERFACE_ADDED = "IMPLEMENTED_INTERFACE_ADDED", e.ARG_DEFAULT_VALUE_CHANGE = "ARG_DEFAULT_VALUE_CHANGE";
})(h || (h = {}));
function ut(e, n) {
  return Se(e, n).filter(
    (t) => t.type in d
  );
}
function ct(e, n) {
  return Se(e, n).filter(
    (t) => t.type in h
  );
}
function Se(e, n) {
  return [
    ...Gn(e, n),
    ...Cn(e, n)
  ];
}
function Cn(e, n) {
  const t = [], r = N(
    e.getDirectives(),
    n.getDirectives()
  );
  for (const s of r.removed)
    t.push({
      type: d.DIRECTIVE_REMOVED,
      description: `${s.name} was removed.`
    });
  for (const [s, i] of r.persisted) {
    const o = N(s.args, i.args);
    for (const p of o.added)
      he(p) && t.push({
        type: d.REQUIRED_DIRECTIVE_ARG_ADDED,
        description: `A required arg ${p.name} on directive ${s.name} was added.`
      });
    for (const p of o.removed)
      t.push({
        type: d.DIRECTIVE_ARG_REMOVED,
        description: `${p.name} was removed from ${s.name}.`
      });
    s.isRepeatable && !i.isRepeatable && t.push({
      type: d.DIRECTIVE_REPEATABLE_REMOVED,
      description: `Repeatable flag was removed from ${s.name}.`
    });
    for (const p of s.locations)
      i.locations.includes(p) || t.push({
        type: d.DIRECTIVE_LOCATION_REMOVED,
        description: `${p} was removed from ${s.name}.`
      });
  }
  return t;
}
function Gn(e, n) {
  const t = [], r = N(
    Object.values(e.getTypeMap()),
    Object.values(n.getTypeMap())
  );
  for (const s of r.removed)
    t.push({
      type: d.TYPE_REMOVED,
      description: be(s) ? `Standard scalar ${s.name} was removed because it is not referenced anymore.` : `${s.name} was removed.`
    });
  for (const [s, i] of r.persisted)
    U(s) && U(i) ? t.push(...qn(s, i)) : M(s) && M(i) ? t.push(...kn(s, i)) : O(s) && O(i) ? t.push(...Pn(s, i)) : F(s) && F(i) ? t.push(
      ...se(s, i),
      ...te(s, i)
    ) : L(s) && L(i) ? t.push(
      ...se(s, i),
      ...te(s, i)
    ) : s.constructor !== i.constructor && t.push({
      type: d.TYPE_CHANGED_KIND,
      description: `${s.name} changed from ${re(s)} to ${re(i)}.`
    });
  return t;
}
function Pn(e, n) {
  const t = [], r = N(
    Object.values(e.getFields()),
    Object.values(n.getFields())
  );
  for (const s of r.added)
    yn(s) ? t.push({
      type: d.REQUIRED_INPUT_FIELD_ADDED,
      description: `A required field ${s.name} on input type ${e.name} was added.`
    }) : t.push({
      type: h.OPTIONAL_INPUT_FIELD_ADDED,
      description: `An optional field ${s.name} on input type ${e.name} was added.`
    });
  for (const s of r.removed)
    t.push({
      type: d.FIELD_REMOVED,
      description: `${e.name}.${s.name} was removed.`
    });
  for (const [s, i] of r.persisted)
    $(
      s.type,
      i.type
    ) || t.push({
      type: d.FIELD_CHANGED_KIND,
      description: `${e.name}.${s.name} changed type from ${String(s.type)} to ${String(i.type)}.`
    });
  return t;
}
function kn(e, n) {
  const t = [], r = N(e.getTypes(), n.getTypes());
  for (const s of r.added)
    t.push({
      type: h.TYPE_ADDED_TO_UNION,
      description: `${s.name} was added to union type ${e.name}.`
    });
  for (const s of r.removed)
    t.push({
      type: d.TYPE_REMOVED_FROM_UNION,
      description: `${s.name} was removed from union type ${e.name}.`
    });
  return t;
}
function qn(e, n) {
  const t = [], r = N(e.getValues(), n.getValues());
  for (const s of r.added)
    t.push({
      type: h.VALUE_ADDED_TO_ENUM,
      description: `${s.name} was added to enum type ${e.name}.`
    });
  for (const s of r.removed)
    t.push({
      type: d.VALUE_REMOVED_FROM_ENUM,
      description: `${s.name} was removed from enum type ${e.name}.`
    });
  return t;
}
function te(e, n) {
  const t = [], r = N(e.getInterfaces(), n.getInterfaces());
  for (const s of r.added)
    t.push({
      type: h.IMPLEMENTED_INTERFACE_ADDED,
      description: `${s.name} added to interfaces implemented by ${e.name}.`
    });
  for (const s of r.removed)
    t.push({
      type: d.IMPLEMENTED_INTERFACE_REMOVED,
      description: `${e.name} no longer implements interface ${s.name}.`
    });
  return t;
}
function se(e, n) {
  const t = [], r = N(
    Object.values(e.getFields()),
    Object.values(n.getFields())
  );
  for (const s of r.removed)
    t.push({
      type: d.FIELD_REMOVED,
      description: `${e.name}.${s.name} was removed.`
    });
  for (const [s, i] of r.persisted)
    t.push(...jn(e, s, i)), S(
      s.type,
      i.type
    ) || t.push({
      type: d.FIELD_CHANGED_KIND,
      description: `${e.name}.${s.name} changed type from ${String(s.type)} to ${String(i.type)}.`
    });
  return t;
}
function jn(e, n, t) {
  const r = [], s = N(n.args, t.args);
  for (const i of s.removed)
    r.push({
      type: d.ARG_REMOVED,
      description: `${e.name}.${n.name} arg ${i.name} was removed.`
    });
  for (const [i, o] of s.persisted)
    if (!$(
      i.type,
      o.type
    ))
      r.push({
        type: d.ARG_CHANGED_KIND,
        description: `${e.name}.${n.name} arg ${i.name} has changed type from ${String(i.type)} to ${String(o.type)}.`
      });
    else if (i.defaultValue !== void 0)
      if (o.defaultValue === void 0)
        r.push({
          type: h.ARG_DEFAULT_VALUE_CHANGE,
          description: `${e.name}.${n.name} arg ${i.name} defaultValue was removed.`
        });
      else {
        const l = ae(i.defaultValue, i.type), m = ae(o.defaultValue, o.type);
        l !== m && r.push({
          type: h.ARG_DEFAULT_VALUE_CHANGE,
          description: `${e.name}.${n.name} arg ${i.name} has changed defaultValue from ${l} to ${m}.`
        });
      }
  for (const i of s.added)
    he(i) ? r.push({
      type: d.REQUIRED_ARG_ADDED,
      description: `A required arg ${i.name} on ${e.name}.${n.name} was added.`
    }) : r.push({
      type: h.OPTIONAL_ARG_ADDED,
      description: `An optional arg ${i.name} on ${e.name}.${n.name} was added.`
    });
  return r;
}
function S(e, n) {
  return C(e) ? (
    // if they're both lists, make sure the underlying types are compatible
    C(n) && S(
      e.ofType,
      n.ofType
    ) || // moving from nullable to non-null of the same underlying type is safe
    A(n) && S(e, n.ofType)
  ) : A(e) ? A(n) && S(e.ofType, n.ofType) : (
    // if they're both named types, see if their names are equivalent
    _e(n) && e.name === n.name || // moving from nullable to non-null of the same underlying type is safe
    A(n) && S(e, n.ofType)
  );
}
function $(e, n) {
  return C(e) ? C(n) && $(e.ofType, n.ofType) : A(e) ? (
    // if they're both non-null, make sure the underlying types are
    // compatible
    A(n) && $(
      e.ofType,
      n.ofType
    ) || // moving from non-null to nullable of the same underlying type is safe
    !A(n) && $(e.ofType, n)
  ) : _e(n) && e.name === n.name;
}
function re(e) {
  if (Y(e))
    return "a Scalar type";
  if (F(e))
    return "an Object type";
  if (L(e))
    return "an Interface type";
  if (M(e))
    return "a Union type";
  if (U(e))
    return "an Enum type";
  if (O(e))
    return "an Input type";
  v(!1, "Unexpected type: " + D(e));
}
function ae(e, n) {
  const t = Te(e, n);
  return t != null || v(!1), G(Tn(t));
}
function N(e, n) {
  const t = [], r = [], s = [], i = ee(e, ({ name: p }) => p), o = ee(n, ({ name: p }) => p);
  for (const p of e) {
    const l = o[p.name];
    l === void 0 ? r.push(p) : s.push([p, l]);
  }
  for (const p of n)
    i[p.name] === void 0 && t.push(p);
  return {
    added: t,
    persisted: s,
    removed: r
  };
}
export {
  lt as BREAK,
  d as BreakingChangeType,
  un as DEFAULT_DEPRECATION_REASON,
  h as DangerousChangeType,
  dt as DirectiveLocation,
  mt as ExecutableDefinitionsRule,
  Et as FieldsOnCorrectTypeRule,
  Dt as FragmentsOnCompositeTypesRule,
  yt as GRAPHQL_MAX_INT,
  Tt as GRAPHQL_MIN_INT,
  Rt as GraphQLBoolean,
  bt as GraphQLDeprecatedDirective,
  me as GraphQLDirective,
  le as GraphQLEnumType,
  y as GraphQLError,
  ht as GraphQLFloat,
  _t as GraphQLID,
  gt as GraphQLIncludeDirective,
  de as GraphQLInputObjectType,
  It as GraphQLInt,
  pe as GraphQLInterfaceType,
  Ee as GraphQLList,
  De as GraphQLNonNull,
  ce as GraphQLObjectType,
  Nt as GraphQLOneOfDirective,
  en as GraphQLScalarType,
  ue as GraphQLSchema,
  At as GraphQLSkipDirective,
  vt as GraphQLSpecifiedByDirective,
  Ot as GraphQLString,
  fe as GraphQLUnionType,
  I as Kind,
  Vt as KnownArgumentNamesRule,
  wt as KnownDirectivesRule,
  St as KnownFragmentNamesRule,
  $t as KnownTypeNamesRule,
  dn as Lexer,
  Ft as Location,
  Lt as LoneAnonymousOperationRule,
  Mt as LoneSchemaDefinitionRule,
  Ut as MaxIntrospectionDepthRule,
  Wn as NoDeprecatedCustomRule,
  Ct as NoFragmentCyclesRule,
  zn as NoSchemaIntrospectionCustomRule,
  Gt as NoUndefinedVariablesRule,
  Pt as NoUnusedFragmentsRule,
  kt as NoUnusedVariablesRule,
  qt as OperationTypeNode,
  jt as OverlappingFieldsCanBeMergedRule,
  Qt as PossibleFragmentSpreadsRule,
  Kt as PossibleTypeExtensionsRule,
  xt as ProvidedRequiredArgumentsRule,
  Bt as ScalarLeafsRule,
  Ht as SchemaMetaFieldDef,
  Yt as SingleFieldSubscriptionsRule,
  ln as Source,
  Wt as Token,
  K as TokenKind,
  zt as TypeInfo,
  g as TypeKind,
  Jt as TypeMetaFieldDef,
  Xt as TypeNameMetaFieldDef,
  Zt as UniqueArgumentDefinitionNamesRule,
  es as UniqueArgumentNamesRule,
  ns as UniqueDirectiveNamesRule,
  ts as UniqueDirectivesPerLocationRule,
  ss as UniqueEnumValueNamesRule,
  rs as UniqueFieldDefinitionNamesRule,
  as as UniqueFragmentNamesRule,
  is as UniqueInputFieldNamesRule,
  os as UniqueOperationNamesRule,
  us as UniqueOperationTypesRule,
  cs as UniqueTypeNamesRule,
  ps as UniqueVariableNamesRule,
  fs as ValidationContext,
  ls as ValuesOfCorrectTypeRule,
  ds as VariablesAreInputTypesRule,
  ms as VariablesInAllowedPositionRule,
  Es as __Directive,
  Ds as __DirectiveLocation,
  ys as __EnumValue,
  Ts as __Field,
  Rs as __InputValue,
  bs as __Schema,
  hs as __Type,
  _s as __TypeKind,
  gs as assertAbstractType,
  Is as assertCompositeType,
  Ns as assertDirective,
  As as assertEnumType,
  vs as assertEnumValueName,
  Os as assertInputObjectType,
  Vs as assertInputType,
  on as assertInterfaceType,
  ws as assertLeafType,
  Ss as assertListType,
  Dn as assertName,
  $s as assertNamedType,
  Fs as assertNonNullType,
  an as assertNullableType,
  Ze as assertObjectType,
  Ls as assertOutputType,
  Ms as assertScalarType,
  Us as assertSchema,
  Cs as assertType,
  Gs as assertUnionType,
  ot as assertValidName,
  Ps as assertValidSchema,
  ks as assertWrappingType,
  Te as astFromValue,
  qs as buildASTSchema,
  et as buildClientSchema,
  js as buildSchema,
  Qs as coerceInputValue,
  rt as concatAST,
  hn as createSourceEventStream,
  Ks as defaultFieldResolver,
  xs as defaultTypeResolver,
  Bs as doTypesOverlap,
  oe as execute,
  ze as executeSync,
  Hs as extendSchema,
  ut as findBreakingChanges,
  ct as findDangerousChanges,
  Ys as formatError,
  He as getArgumentValues,
  Ws as getDirectiveValues,
  zs as getEnterLeaveForKind,
  gn as getIntrospectionQuery,
  Js as getLocation,
  B as getNamedType,
  Xs as getNullableType,
  Jn as getOperationAST,
  Xn as getOperationRootType,
  Zs as getVariableValues,
  er as getVisitFn,
  Bn as graphql,
  Hn as graphqlSync,
  Zn as introspectionFromSchema,
  Xe as introspectionTypes,
  nr as isAbstractType,
  tr as isCompositeType,
  sr as isConstValueNode,
  rr as isDefinitionNode,
  ar as isDirective,
  U as isEnumType,
  ir as isEqualType,
  or as isExecutableDefinitionNode,
  O as isInputObjectType,
  tn as isInputType,
  L as isInterfaceType,
  q as isIntrospectionType,
  ur as isLeafType,
  C as isListType,
  _e as isNamedType,
  A as isNonNullType,
  cr as isNullableType,
  F as isObjectType,
  nn as isOutputType,
  he as isRequiredArgument,
  yn as isRequiredInputField,
  Y as isScalarType,
  pr as isSchema,
  fr as isSelectionNode,
  Re as isSpecifiedDirective,
  be as isSpecifiedScalarType,
  lr as isType,
  dr as isTypeDefinitionNode,
  mr as isTypeExtensionNode,
  Er as isTypeNode,
  Dr as isTypeSubTypeOf,
  yr as isTypeSystemDefinitionNode,
  Tr as isTypeSystemExtensionNode,
  M as isUnionType,
  Un as isValidNameError,
  Rr as isValueNode,
  br as isWrappingType,
  nt as lexicographicSortSchema,
  Ye as locatedError,
  ie as parse,
  hr as parseConstValue,
  _r as parseType,
  rn as parseValue,
  G as print,
  gr as printError,
  st as printIntrospectionSchema,
  Ir as printLocation,
  tt as printSchema,
  Nr as printSourceLocation,
  vn as printType,
  Ar as recommendedRules,
  vr as resolveObjMapThunk,
  Or as resolveReadonlyArrayThunk,
  We as responsePathAsArray,
  at as separateOperations,
  Vr as specifiedDirectives,
  wr as specifiedRules,
  Je as specifiedScalarTypes,
  it as stripIgnoredCharacters,
  Yn as subscribe,
  Sr as syntaxError,
  $r as typeFromAST,
  ke as validate,
  Pe as validateSchema,
  sn as valueFromAST,
  Fr as valueFromASTUntyped,
  Kn as version,
  xn as versionInfo,
  pn as visit,
  Lr as visitInParallel,
  Mr as visitWithTypeInfo
};
