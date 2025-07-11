/*!
  Highlight.js v11.4.0 (git: 2d0e7c1094)
  (c) 2006-2022 Ivan Sagalaev and other contributors
  License: BSD-3-Clause
 */
var hljs = (function () {
  "use strict"
  var e = { exports: {} }
  function n(e) {
    return (
      e instanceof Map
        ? (e.clear =
            e.delete =
            e.set =
              () => {
                throw Error("map is read-only")
              })
        : e instanceof Set &&
          (e.add =
            e.clear =
            e.delete =
              () => {
                throw Error("set is read-only")
              }),
      Object.freeze(e),
      Object.getOwnPropertyNames(e).forEach((t) => {
        var a = e[t]
        "object" != typeof a || Object.isFrozen(a) || n(a)
      }),
      e
    )
  }
  ;((e.exports = n), (e.exports.default = n))
  var t = e.exports
  class a {
    constructor(e) {
      ;(void 0 === e.data && (e.data = {}),
        (this.data = e.data),
        (this.isMatchIgnored = !1))
    }
    ignoreMatch() {
      this.isMatchIgnored = !0
    }
  }
  function i(e) {
    return e
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
  }
  function r(e, ...n) {
    const t = Object.create(null)
    for (const n in e) t[n] = e[n]
    return (
      n.forEach((e) => {
        for (const n in e) t[n] = e[n]
      }),
      t
    )
  }
  const s = (e) => !!e.kind
  class o {
    constructor(e, n) {
      ;((this.buffer = ""), (this.classPrefix = n.classPrefix), e.walk(this))
    }
    addText(e) {
      this.buffer += i(e)
    }
    openNode(e) {
      if (!s(e)) return
      let n = e.kind
      ;((n = e.sublanguage
        ? "language-" + n
        : ((e, { prefix: n }) => {
            if (e.includes(".")) {
              const t = e.split(".")
              return [
                `${n}${t.shift()}`,
                ...t.map((e, n) => `${e}${"_".repeat(n + 1)}`),
              ].join(" ")
            }
            return `${n}${e}`
          })(n, { prefix: this.classPrefix })),
        this.span(n))
    }
    closeNode(e) {
      s(e) && (this.buffer += "</span>")
    }
    value() {
      return this.buffer
    }
    span(e) {
      this.buffer += `<span class="${e}">`
    }
  }
  class l {
    constructor() {
      ;((this.rootNode = {
        children: [],
      }),
        (this.stack = [this.rootNode]))
    }
    get top() {
      return this.stack[this.stack.length - 1]
    }
    get root() {
      return this.rootNode
    }
    add(e) {
      this.top.children.push(e)
    }
    openNode(e) {
      const n = { kind: e, children: [] }
      ;(this.add(n), this.stack.push(n))
    }
    closeNode() {
      if (this.stack.length > 1) return this.stack.pop()
    }
    closeAllNodes() {
      for (; this.closeNode(); );
    }
    toJSON() {
      return JSON.stringify(this.rootNode, null, 4)
    }
    walk(e) {
      return this.constructor._walk(e, this.rootNode)
    }
    static _walk(e, n) {
      return (
        "string" == typeof n
          ? e.addText(n)
          : n.children &&
            (e.openNode(n),
            n.children.forEach((n) => this._walk(e, n)),
            e.closeNode(n)),
        e
      )
    }
    static _collapse(e) {
      "string" != typeof e &&
        e.children &&
        (e.children.every((e) => "string" == typeof e)
          ? (e.children = [e.children.join("")])
          : e.children.forEach((e) => {
              l._collapse(e)
            }))
    }
  }
  class c extends l {
    constructor(e) {
      ;(super(), (this.options = e))
    }
    addKeyword(e, n) {
      "" !== e && (this.openNode(n), this.addText(e), this.closeNode())
    }
    addText(e) {
      "" !== e && this.add(e)
    }
    addSublanguage(e, n) {
      const t = e.root
      ;((t.kind = n), (t.sublanguage = !0), this.add(t))
    }
    toHTML() {
      return new o(this, this.options).value()
    }
    finalize() {
      return !0
    }
  }
  function d(e) {
    return e ? ("string" == typeof e ? e : e.source) : null
  }
  function g(e) {
    return m("(?=", e, ")")
  }
  function u(e) {
    return m("(?:", e, ")*")
  }
  function b(e) {
    return m("(?:", e, ")?")
  }
  function m(...e) {
    return e.map((e) => d(e)).join("")
  }
  function p(...e) {
    const n = ((e) => {
      const n = e[e.length - 1]
      return "object" == typeof n && n.constructor === Object
        ? (e.splice(e.length - 1, 1), n)
        : {}
    })(e)
    return "(" + (n.capture ? "" : "?:") + e.map((e) => d(e)).join("|") + ")"
  }
  function _(e) {
    return RegExp(e.toString() + "|").exec("").length - 1
  }
  const h = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./
  function f(e, { joinWith: n }) {
    let t = 0
    return e
      .map((e) => {
        t += 1
        const n = t
        let a = d(e),
          i = ""
        for (; a.length > 0; ) {
          const e = h.exec(a)
          if (!e) {
            i += a
            break
          }
          ;((i += a.substring(0, e.index)),
            (a = a.substring(e.index + e[0].length)),
            "\\" === e[0][0] && e[1]
              ? (i += "\\" + (Number(e[1]) + n))
              : ((i += e[0]), "(" === e[0] && t++))
        }
        return i
      })
      .map((e) => `(${e})`)
      .join(n)
  }
  const E = "[a-zA-Z]\\w*",
    y = "[a-zA-Z_]\\w*",
    N = "\\b\\d+(\\.\\d+)?",
    w =
      "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
    v = "\\b(0b[01]+)",
    O = {
      begin: "\\\\[\\s\\S]",
      relevance: 0,
    },
    x = {
      scope: "string",
      begin: "'",
      end: "'",
      illegal: "\\n",
      contains: [O],
    },
    M = {
      scope: "string",
      begin: '"',
      end: '"',
      illegal: "\\n",
      contains: [O],
    },
    k = (e, n, t = {}) => {
      const a = r({ scope: "comment", begin: e, end: n, contains: [] }, t)
      a.contains.push({
        scope: "doctag",
        begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
        end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
        excludeBegin: !0,
        relevance: 0,
      })
      const i = p(
        "I",
        "a",
        "is",
        "so",
        "us",
        "to",
        "at",
        "if",
        "in",
        "it",
        "on",
        /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
        /[A-Za-z]+[-][a-z]+/,
        /[A-Za-z][a-z]{2,}/,
      )
      return (
        a.contains.push({
          begin: m(/[ ]+/, "(", i, /[.]?[:]?([.][ ]|[ ])/, "){3}"),
        }),
        a
      )
    },
    S = k("//", "$"),
    A = k("/\\*", "\\*/"),
    C = k("#", "$")
  var T = Object.freeze({
    __proto__: null,
    MATCH_NOTHING_RE: /\b\B/,
    IDENT_RE: E,
    UNDERSCORE_IDENT_RE: y,
    NUMBER_RE: N,
    C_NUMBER_RE: w,
    BINARY_NUMBER_RE: v,
    RE_STARTERS_RE:
      "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
    SHEBANG: (e = {}) => {
      const n = /^#![ ]*\//
      return (
        e.binary && (e.begin = m(n, /.*\b/, e.binary, /\b.*/)),
        r(
          {
            scope: "meta",
            begin: n,
            end: /$/,
            relevance: 0,
            "on:begin": (e, n) => {
              0 !== e.index && n.ignoreMatch()
            },
          },
          e,
        )
      )
    },
    BACKSLASH_ESCAPE: O,
    APOS_STRING_MODE: x,
    QUOTE_STRING_MODE: M,
    PHRASAL_WORDS_MODE: {
      begin:
        /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/,
    },
    COMMENT: k,
    C_LINE_COMMENT_MODE: S,
    C_BLOCK_COMMENT_MODE: A,
    HASH_COMMENT_MODE: C,
    NUMBER_MODE: { scope: "number", begin: N, relevance: 0 },
    C_NUMBER_MODE: { scope: "number", begin: w, relevance: 0 },
    BINARY_NUMBER_MODE: { scope: "number", begin: v, relevance: 0 },
    REGEXP_MODE: {
      begin: /(?=\/[^/\n]*\/)/,
      contains: [
        {
          scope: "regexp",
          begin: /\//,
          end: /\/[gimuy]*/,
          illegal: /\n/,
          contains: [
            O,
            { begin: /\[/, end: /\]/, relevance: 0, contains: [O] },
          ],
        },
      ],
    },
    TITLE_MODE: { scope: "title", begin: E, relevance: 0 },
    UNDERSCORE_TITLE_MODE: { scope: "title", begin: y, relevance: 0 },
    METHOD_GUARD: {
      begin: "\\.\\s*[a-zA-Z_]\\w*",
      relevance: 0,
    },
    END_SAME_AS_BEGIN: (e) =>
      Object.assign(e, {
        "on:begin": (e, n) => {
          n.data._beginMatch = e[1]
        },
        "on:end": (e, n) => {
          n.data._beginMatch !== e[1] && n.ignoreMatch()
        },
      }),
  })
  function R(e, n) {
    "." === e.input[e.index - 1] && n.ignoreMatch()
  }
  function D(e, n) {
    void 0 !== e.className && ((e.scope = e.className), delete e.className)
  }
  function I(e, n) {
    n &&
      e.beginKeywords &&
      ((e.begin =
        "\\b(" + e.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)"),
      (e.__beforeBegin = R),
      (e.keywords = e.keywords || e.beginKeywords),
      delete e.beginKeywords,
      void 0 === e.relevance && (e.relevance = 0))
  }
  function L(e, n) {
    Array.isArray(e.illegal) && (e.illegal = p(...e.illegal))
  }
  function B(e, n) {
    if (e.match) {
      if (e.begin || e.end)
        throw Error("begin & end are not supported with match")
      ;((e.begin = e.match), delete e.match)
    }
  }
  function $(e, n) {
    void 0 === e.relevance && (e.relevance = 1)
  }
  const F = (e, n) => {
      if (!e.beforeMatch) return
      if (e.starts) throw Error("beforeMatch cannot be used with starts")
      const t = Object.assign({}, e)
      ;(Object.keys(e).forEach((n) => {
        delete e[n]
      }),
        (e.keywords = t.keywords),
        (e.begin = m(t.beforeMatch, g(t.begin))),
        (e.starts = {
          relevance: 0,
          contains: [Object.assign(t, { endsParent: !0 })],
        }),
        (e.relevance = 0),
        delete t.beforeMatch)
    },
    z = [
      "of",
      "and",
      "for",
      "in",
      "not",
      "or",
      "if",
      "then",
      "parent",
      "list",
      "value",
    ]
  function U(e, n, t = "keyword") {
    const a = Object.create(null)
    return (
      "string" == typeof e
        ? i(t, e.split(" "))
        : Array.isArray(e)
          ? i(t, e)
          : Object.keys(e).forEach((t) => {
              Object.assign(a, U(e[t], n, t))
            }),
      a
    )
    function i(e, t) {
      ;(n && (t = t.map((e) => e.toLowerCase())),
        t.forEach((n) => {
          const t = n.split("|")
          a[t[0]] = [e, j(t[0], t[1])]
        }))
    }
  }
  function j(e, n) {
    return n ? Number(n) : ((e) => z.includes(e.toLowerCase()))(e) ? 0 : 1
  }
  const P = {},
    K = (e) => {
      console.error(e)
    },
    q = (e, ...n) => {
      console.log("WARN: " + e, ...n)
    },
    H = (e, n) => {
      P[`${e}/${n}`] ||
        (console.log(`Deprecated as of ${e}. ${n}`), (P[`${e}/${n}`] = !0))
    },
    Z = Error()
  function G(e, n, { key: t }) {
    let a = 0
    const i = e[t],
      r = {},
      s = {}
    for (let e = 1; e <= n.length; e++)
      ((s[e + a] = i[e]), (r[e + a] = !0), (a += _(n[e - 1])))
    ;((e[t] = s), (e[t]._emit = r), (e[t]._multi = !0))
  }
  function W(e) {
    ;(((e) => {
      e.scope &&
        "object" == typeof e.scope &&
        null !== e.scope &&
        ((e.beginScope = e.scope), delete e.scope)
    })(e),
      "string" == typeof e.beginScope &&
        (e.beginScope = {
          _wrap: e.beginScope,
        }),
      "string" == typeof e.endScope && (e.endScope = { _wrap: e.endScope }),
      ((e) => {
        if (Array.isArray(e.begin)) {
          if (e.skip || e.excludeBegin || e.returnBegin)
            throw (
              K(
                "skip, excludeBegin, returnBegin not compatible with beginScope: {}",
              ),
              Z
            )
          if ("object" != typeof e.beginScope || null === e.beginScope)
            throw (K("beginScope must be object"), Z)
          ;(G(e, e.begin, { key: "beginScope" }),
            (e.begin = f(e.begin, { joinWith: "" })))
        }
      })(e),
      ((e) => {
        if (Array.isArray(e.end)) {
          if (e.skip || e.excludeEnd || e.returnEnd)
            throw (
              K("skip, excludeEnd, returnEnd not compatible with endScope: {}"),
              Z
            )
          if ("object" != typeof e.endScope || null === e.endScope)
            throw (K("endScope must be object"), Z)
          ;(G(e, e.end, { key: "endScope" }),
            (e.end = f(e.end, { joinWith: "" })))
        }
      })(e))
  }
  function Q(e) {
    function n(n, t) {
      return RegExp(
        d(n),
        "m" +
          (e.case_insensitive ? "i" : "") +
          (e.unicodeRegex ? "u" : "") +
          (t ? "g" : ""),
      )
    }
    class t {
      constructor() {
        ;((this.matchIndexes = {}),
          (this.regexes = []),
          (this.matchAt = 1),
          (this.position = 0))
      }
      addRule(e, n) {
        ;((n.position = this.position++),
          (this.matchIndexes[this.matchAt] = n),
          this.regexes.push([n, e]),
          (this.matchAt += _(e) + 1))
      }
      compile() {
        0 === this.regexes.length && (this.exec = () => null)
        const e = this.regexes.map((e) => e[1])
        ;((this.matcherRe = n(f(e, { joinWith: "|" }), !0)),
          (this.lastIndex = 0))
      }
      exec(e) {
        this.matcherRe.lastIndex = this.lastIndex
        const n = this.matcherRe.exec(e)
        if (!n) return null
        const t = n.findIndex((e, n) => n > 0 && void 0 !== e),
          a = this.matchIndexes[t]
        return (n.splice(0, t), Object.assign(n, a))
      }
    }
    class a {
      constructor() {
        ;((this.rules = []),
          (this.multiRegexes = []),
          (this.count = 0),
          (this.lastIndex = 0),
          (this.regexIndex = 0))
      }
      getMatcher(e) {
        if (this.multiRegexes[e]) return this.multiRegexes[e]
        const n = new t()
        return (
          this.rules.slice(e).forEach(([e, t]) => n.addRule(e, t)),
          n.compile(),
          (this.multiRegexes[e] = n),
          n
        )
      }
      resumingScanAtSamePosition() {
        return 0 !== this.regexIndex
      }
      considerAll() {
        this.regexIndex = 0
      }
      addRule(e, n) {
        ;(this.rules.push([e, n]), "begin" === n.type && this.count++)
      }
      exec(e) {
        const n = this.getMatcher(this.regexIndex)
        n.lastIndex = this.lastIndex
        let t = n.exec(e)
        if (this.resumingScanAtSamePosition())
          if (t && t.index === this.lastIndex);
          else {
            const n = this.getMatcher(0)
            ;((n.lastIndex = this.lastIndex + 1), (t = n.exec(e)))
          }
        return (
          t &&
            ((this.regexIndex += t.position + 1),
            this.regexIndex === this.count && this.considerAll()),
          t
        )
      }
    }
    if (
      (e.compilerExtensions || (e.compilerExtensions = []),
      e.contains && e.contains.includes("self"))
    )
      throw Error(
        "ERR: contains `self` is not supported at the top-level of a language.  See documentation.",
      )
    return (
      (e.classNameAliases = r(e.classNameAliases || {})),
      (function t(i, s) {
        const o = i
        if (i.isCompiled) return o
        ;([D, B, W, F].forEach((e) => e(i, s)),
          e.compilerExtensions.forEach((e) => e(i, s)),
          (i.__beforeBegin = null),
          [I, L, $].forEach((e) => e(i, s)),
          (i.isCompiled = !0))
        let l = null
        return (
          "object" == typeof i.keywords &&
            i.keywords.$pattern &&
            ((i.keywords = Object.assign({}, i.keywords)),
            (l = i.keywords.$pattern),
            delete i.keywords.$pattern),
          (l = l || /\w+/),
          i.keywords && (i.keywords = U(i.keywords, e.case_insensitive)),
          (o.keywordPatternRe = n(l, !0)),
          s &&
            (i.begin || (i.begin = /\B|\b/),
            (o.beginRe = n(o.begin)),
            i.end || i.endsWithParent || (i.end = /\B|\b/),
            i.end && (o.endRe = n(o.end)),
            (o.terminatorEnd = d(o.end) || ""),
            i.endsWithParent &&
              s.terminatorEnd &&
              (o.terminatorEnd += (i.end ? "|" : "") + s.terminatorEnd)),
          i.illegal && (o.illegalRe = n(i.illegal)),
          i.contains || (i.contains = []),
          (i.contains = [].concat(
            ...i.contains.map((e) =>
              ((e) => (
                e.variants &&
                  !e.cachedVariants &&
                  (e.cachedVariants = e.variants.map((n) =>
                    r(
                      e,
                      {
                        variants: null,
                      },
                      n,
                    ),
                  )),
                e.cachedVariants
                  ? e.cachedVariants
                  : X(e)
                    ? r(e, {
                        starts: e.starts ? r(e.starts) : null,
                      })
                    : Object.isFrozen(e)
                      ? r(e)
                      : e
              ))("self" === e ? i : e),
            ),
          )),
          i.contains.forEach((e) => {
            t(e, o)
          }),
          i.starts && t(i.starts, s),
          (o.matcher = ((e) => {
            const n = new a()
            return (
              e.contains.forEach((e) =>
                n.addRule(e.begin, { rule: e, type: "begin" }),
              ),
              e.terminatorEnd && n.addRule(e.terminatorEnd, { type: "end" }),
              e.illegal && n.addRule(e.illegal, { type: "illegal" }),
              n
            )
          })(o)),
          o
        )
      })(e)
    )
  }
  function X(e) {
    return !!e && (e.endsWithParent || X(e.starts))
  }
  class V extends Error {
    constructor(e, n) {
      ;(super(e), (this.name = "HTMLInjectionError"), (this.html = n))
    }
  }
  const J = i,
    Y = r,
    ee = Symbol("nomatch")
  var ne = ((e) => {
    const n = Object.create(null),
      i = Object.create(null),
      r = []
    let s = !0
    const o =
        "Could not find the language '{}', did you forget to load/include a language module?",
      l = {
        disableAutodetect: !0,
        name: "Plain text",
        contains: [],
      }
    let d = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      __emitter: c,
    }
    function _(e) {
      return d.noHighlightRe.test(e)
    }
    function h(e, n, t) {
      let a = "",
        i = ""
      ;("object" == typeof n
        ? ((a = e), (t = n.ignoreIllegals), (i = n.language))
        : (H("10.7.0", "highlight(lang, code, ...args) has been deprecated."),
          H(
            "10.7.0",
            "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277",
          ),
          (i = e),
          (a = n)),
        void 0 === t && (t = !0))
      const r = { code: a, language: i }
      M("before:highlight", r)
      const s = r.result ? r.result : f(r.language, r.code, t)
      return ((s.code = r.code), M("after:highlight", s), s)
    }
    function f(e, t, i, r) {
      const l = Object.create(null)
      function c() {
        if (!x.keywords) return void k.addText(S)
        let e = 0
        x.keywordPatternRe.lastIndex = 0
        let n = x.keywordPatternRe.exec(S),
          t = ""
        for (; n; ) {
          t += S.substring(e, n.index)
          const i = N.case_insensitive ? n[0].toLowerCase() : n[0],
            r = ((a = i), x.keywords[a])
          if (r) {
            const [e, a] = r
            if (
              (k.addText(t),
              (t = ""),
              (l[i] = (l[i] || 0) + 1),
              l[i] <= 7 && (A += a),
              e.startsWith("_"))
            )
              t += n[0]
            else {
              const t = N.classNameAliases[e] || e
              k.addKeyword(n[0], t)
            }
          } else t += n[0]
          ;((e = x.keywordPatternRe.lastIndex),
            (n = x.keywordPatternRe.exec(S)))
        }
        var a
        ;((t += S.substr(e)), k.addText(t))
      }
      function g() {
        ;(null != x.subLanguage
          ? (() => {
              if ("" === S) return
              let e = null
              if ("string" == typeof x.subLanguage) {
                if (!n[x.subLanguage]) return void k.addText(S)
                ;((e = f(x.subLanguage, S, !0, M[x.subLanguage])),
                  (M[x.subLanguage] = e._top))
              } else e = E(S, x.subLanguage.length ? x.subLanguage : null)
              ;(x.relevance > 0 && (A += e.relevance),
                k.addSublanguage(e._emitter, e.language))
            })()
          : c(),
          (S = ""))
      }
      function u(e, n) {
        let t = 1
        for (; void 0 !== n[t]; ) {
          if (!e._emit[t]) {
            t++
            continue
          }
          const a = N.classNameAliases[e[t]] || e[t],
            i = n[t]
          ;(a ? k.addKeyword(i, a) : ((S = i), c(), (S = "")), t++)
        }
      }
      function b(e, n) {
        return (
          e.scope &&
            "string" == typeof e.scope &&
            k.openNode(N.classNameAliases[e.scope] || e.scope),
          e.beginScope &&
            (e.beginScope._wrap
              ? (k.addKeyword(
                  S,
                  N.classNameAliases[e.beginScope._wrap] || e.beginScope._wrap,
                ),
                (S = ""))
              : e.beginScope._multi && (u(e.beginScope, n), (S = ""))),
          (x = Object.create(e, {
            parent: {
              value: x,
            },
          })),
          x
        )
      }
      function m(e, n, t) {
        let i = ((e, n) => {
          const t = e && e.exec(n)
          return t && 0 === t.index
        })(e.endRe, t)
        if (i) {
          if (e["on:end"]) {
            const t = new a(e)
            ;(e["on:end"](n, t), t.isMatchIgnored && (i = !1))
          }
          if (i) {
            for (; e.endsParent && e.parent; ) e = e.parent
            return e
          }
        }
        if (e.endsWithParent) return m(e.parent, n, t)
      }
      function p(e) {
        return 0 === x.matcher.regexIndex ? ((S += e[0]), 1) : ((R = !0), 0)
      }
      function _(e) {
        const n = e[0],
          a = t.substr(e.index),
          i = m(x, e, a)
        if (!i) return ee
        const r = x
        x.endScope && x.endScope._wrap
          ? (g(), k.addKeyword(n, x.endScope._wrap))
          : x.endScope && x.endScope._multi
            ? (g(), u(x.endScope, e))
            : r.skip
              ? (S += n)
              : (r.returnEnd || r.excludeEnd || (S += n),
                g(),
                r.excludeEnd && (S = n))
        do {
          ;(x.scope && k.closeNode(),
            x.skip || x.subLanguage || (A += x.relevance),
            (x = x.parent))
        } while (x !== i.parent)
        return (i.starts && b(i.starts, e), r.returnEnd ? 0 : n.length)
      }
      let h = {}
      function y(n, r) {
        const o = r && r[0]
        if (((S += n), null == o)) return (g(), 0)
        if (
          "begin" === h.type &&
          "end" === r.type &&
          h.index === r.index &&
          "" === o
        ) {
          if (((S += t.slice(r.index, r.index + 1)), !s)) {
            const n = Error(`0 width match regex (${e})`)
            throw ((n.languageName = e), (n.badRule = h.rule), n)
          }
          return 1
        }
        if (((h = r), "begin" === r.type))
          return ((e) => {
            const n = e[0],
              t = e.rule,
              i = new a(t),
              r = [t.__beforeBegin, t["on:begin"]]
            for (const t of r) if (t && (t(e, i), i.isMatchIgnored)) return p(n)
            return (
              t.skip
                ? (S += n)
                : (t.excludeBegin && (S += n),
                  g(),
                  t.returnBegin || t.excludeBegin || (S = n)),
              b(t, e),
              t.returnBegin ? 0 : n.length
            )
          })(r)
        if ("illegal" === r.type && !i) {
          const e = Error(
            'Illegal lexeme "' +
              o +
              '" for mode "' +
              (x.scope || "<unnamed>") +
              '"',
          )
          throw ((e.mode = x), e)
        }
        if ("end" === r.type) {
          const e = _(r)
          if (e !== ee) return e
        }
        if ("illegal" === r.type && "" === o) return 1
        if (T > 1e5 && T > 3 * r.index)
          throw Error(
            "potential infinite loop, way more iterations than matches",
          )
        return ((S += o), o.length)
      }
      const N = v(e)
      if (!N)
        throw (K(o.replace("{}", e)), Error('Unknown language: "' + e + '"'))
      const w = Q(N)
      let O = "",
        x = r || w
      const M = {},
        k = new d.__emitter(d)
      ;(() => {
        const e = []
        for (let n = x; n !== N; n = n.parent) n.scope && e.unshift(n.scope)
        e.forEach((e) => k.openNode(e))
      })()
      let S = "",
        A = 0,
        C = 0,
        T = 0,
        R = !1
      try {
        for (x.matcher.considerAll(); ; ) {
          ;(T++,
            R ? (R = !1) : x.matcher.considerAll(),
            (x.matcher.lastIndex = C))
          const e = x.matcher.exec(t)
          if (!e) break
          const n = y(t.substring(C, e.index), e)
          C = e.index + n
        }
        return (
          y(t.substr(C)),
          k.closeAllNodes(),
          k.finalize(),
          (O = k.toHTML()),
          {
            language: e,
            value: O,
            relevance: A,
            illegal: !1,
            _emitter: k,
            _top: x,
          }
        )
      } catch (n) {
        if (n.message && n.message.includes("Illegal"))
          return {
            language: e,
            value: J(t),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: n.message,
              index: C,
              context: t.slice(C - 100, C + 100),
              mode: n.mode,
              resultSoFar: O,
            },
            _emitter: k,
          }
        if (s)
          return {
            language: e,
            value: J(t),
            illegal: !1,
            relevance: 0,
            errorRaised: n,
            _emitter: k,
            _top: x,
          }
        throw n
      }
    }
    function E(e, t) {
      t = t || d.languages || Object.keys(n)
      const a = ((e) => {
          const n = {
            value: J(e),
            illegal: !1,
            relevance: 0,
            _top: l,
            _emitter: new d.__emitter(d),
          }
          return (n._emitter.addText(e), n)
        })(e),
        i = t
          .filter(v)
          .filter(x)
          .map((n) => f(n, e, !1))
      i.unshift(a)
      const r = i.sort((e, n) => {
          if (e.relevance !== n.relevance) return n.relevance - e.relevance
          if (e.language && n.language) {
            if (v(e.language).supersetOf === n.language) return 1
            if (v(n.language).supersetOf === e.language) return -1
          }
          return 0
        }),
        [s, o] = r,
        c = s
      return ((c.secondBest = o), c)
    }
    function y(e) {
      let n = null
      const t = ((e) => {
        let n = e.className + " "
        n += e.parentNode ? e.parentNode.className : ""
        const t = d.languageDetectRe.exec(n)
        if (t) {
          const n = v(t[1])
          return (
            n ||
              (q(o.replace("{}", t[1])),
              q("Falling back to no-highlight mode for this block.", e)),
            n ? t[1] : "no-highlight"
          )
        }
        return n.split(/\s+/).find((e) => _(e) || v(e))
      })(e)
      if (_(t)) return
      if (
        (M("before:highlightElement", { el: e, language: t }),
        e.children.length > 0 &&
          (d.ignoreUnescapedHTML ||
            (console.warn(
              "One of your code blocks includes unescaped HTML. This is a potentially serious security risk.",
            ),
            console.warn(
              "https://github.com/highlightjs/highlight.js/wiki/security",
            ),
            console.warn("The element with unescaped HTML:"),
            console.warn(e)),
          d.throwUnescapedHTML))
      )
        throw new V(
          "One of your code blocks includes unescaped HTML.",
          e.innerHTML,
        )
      n = e
      const a = n.textContent,
        r = t ? h(a, { language: t, ignoreIllegals: !0 }) : E(a)
      ;((e.innerHTML = r.value),
        ((e, n, t) => {
          const a = (n && i[n]) || t
          ;(e.classList.add("hljs"), e.classList.add("language-" + a))
        })(e, t, r.language),
        (e.result = {
          language: r.language,
          re: r.relevance,
          relevance: r.relevance,
        }),
        r.secondBest &&
          (e.secondBest = {
            language: r.secondBest.language,
            relevance: r.secondBest.relevance,
          }),
        M("after:highlightElement", { el: e, result: r, text: a }))
    }
    let N = !1
    function w() {
      "loading" !== document.readyState
        ? document.querySelectorAll(d.cssSelector).forEach(y)
        : (N = !0)
    }
    function v(e) {
      return ((e = (e || "").toLowerCase()), n[e] || n[i[e]])
    }
    function O(e, { languageName: n }) {
      ;("string" == typeof e && (e = [e]),
        e.forEach((e) => {
          i[e.toLowerCase()] = n
        }))
    }
    function x(e) {
      const n = v(e)
      return n && !n.disableAutodetect
    }
    function M(e, n) {
      const t = e
      r.forEach((e) => {
        e[t] && e[t](n)
      })
    }
    ;("undefined" != typeof window &&
      window.addEventListener &&
      window.addEventListener(
        "DOMContentLoaded",
        () => {
          N && w()
        },
        !1,
      ),
      Object.assign(e, {
        highlight: h,
        highlightAuto: E,
        highlightAll: w,
        highlightElement: y,
        highlightBlock: (e) => (
          H("10.7.0", "highlightBlock will be removed entirely in v12.0"),
          H("10.7.0", "Please use highlightElement now."),
          y(e)
        ),
        configure: (e) => {
          d = Y(d, e)
        },
        initHighlighting: () => {
          ;(w(),
            H(
              "10.6.0",
              "initHighlighting() deprecated.  Use highlightAll() now.",
            ))
        },
        initHighlightingOnLoad: () => {
          ;(w(),
            H(
              "10.6.0",
              "initHighlightingOnLoad() deprecated.  Use highlightAll() now.",
            ))
        },
        registerLanguage: (t, a) => {
          let i = null
          try {
            i = a(e)
          } catch (e) {
            if (
              (K(
                "Language definition for '{}' could not be registered.".replace(
                  "{}",
                  t,
                ),
              ),
              !s)
            )
              throw e
            ;(K(e), (i = l))
          }
          ;(i.name || (i.name = t),
            (n[t] = i),
            (i.rawDefinition = a.bind(null, e)),
            i.aliases &&
              O(i.aliases, {
                languageName: t,
              }))
        },
        unregisterLanguage: (e) => {
          delete n[e]
          for (const n of Object.keys(i)) i[n] === e && delete i[n]
        },
        listLanguages: () => Object.keys(n),
        getLanguage: v,
        registerAliases: O,
        autoDetection: x,
        inherit: Y,
        addPlugin: (e) => {
          ;(((e) => {
            ;(e["before:highlightBlock"] &&
              !e["before:highlightElement"] &&
              (e["before:highlightElement"] = (n) => {
                e["before:highlightBlock"](Object.assign({ block: n.el }, n))
              }),
              e["after:highlightBlock"] &&
                !e["after:highlightElement"] &&
                (e["after:highlightElement"] = (n) => {
                  e["after:highlightBlock"](Object.assign({ block: n.el }, n))
                }))
          })(e),
            r.push(e))
        },
      }),
      (e.debugMode = () => {
        s = !1
      }),
      (e.safeMode = () => {
        s = !0
      }),
      (e.versionString = "11.4.0"),
      (e.regex = {
        concat: m,
        lookahead: g,
        either: p,
        optional: b,
        anyNumberOfTimes: u,
      }))
    for (const e in T) "object" == typeof T[e] && t(T[e])
    return (Object.assign(e, T), e)
  })({})
  const te = (e) => ({
      IMPORTANT: { scope: "meta", begin: "!important" },
      BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
      HEXCOLOR: {
        scope: "number",
        begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/,
      },
      FUNCTION_DISPATCH: { className: "built_in", begin: /[\w-]+(?=\()/ },
      ATTRIBUTE_SELECTOR_MODE: {
        scope: "selector-attr",
        begin: /\[/,
        end: /\]/,
        illegal: "$",
        contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE],
      },
      CSS_NUMBER_MODE: {
        scope: "number",
        begin:
          e.NUMBER_RE +
          "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
        relevance: 0,
      },
      CSS_VARIABLE: { className: "attr", begin: /--[A-Za-z][A-Za-z0-9_-]*/ },
    }),
    ae = [
      "a",
      "abbr",
      "address",
      "article",
      "aside",
      "audio",
      "b",
      "blockquote",
      "body",
      "button",
      "canvas",
      "caption",
      "cite",
      "code",
      "dd",
      "del",
      "details",
      "dfn",
      "div",
      "dl",
      "dt",
      "em",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "header",
      "hgroup",
      "html",
      "i",
      "iframe",
      "img",
      "input",
      "ins",
      "kbd",
      "label",
      "legend",
      "li",
      "main",
      "mark",
      "menu",
      "nav",
      "object",
      "ol",
      "p",
      "q",
      "quote",
      "samp",
      "section",
      "span",
      "strong",
      "summary",
      "sup",
      "table",
      "tbody",
      "td",
      "textarea",
      "tfoot",
      "th",
      "thead",
      "time",
      "tr",
      "ul",
      "var",
      "video",
    ],
    ie = [
      "any-hover",
      "any-pointer",
      "aspect-ratio",
      "color",
      "color-gamut",
      "color-index",
      "device-aspect-ratio",
      "device-height",
      "device-width",
      "display-mode",
      "forced-colors",
      "grid",
      "height",
      "hover",
      "inverted-colors",
      "monochrome",
      "orientation",
      "overflow-block",
      "overflow-inline",
      "pointer",
      "prefers-color-scheme",
      "prefers-contrast",
      "prefers-reduced-motion",
      "prefers-reduced-transparency",
      "resolution",
      "scan",
      "scripting",
      "update",
      "width",
      "min-width",
      "max-width",
      "min-height",
      "max-height",
    ],
    re = [
      "active",
      "any-link",
      "blank",
      "checked",
      "current",
      "default",
      "defined",
      "dir",
      "disabled",
      "drop",
      "empty",
      "enabled",
      "first",
      "first-child",
      "first-of-type",
      "fullscreen",
      "future",
      "focus",
      "focus-visible",
      "focus-within",
      "has",
      "host",
      "host-context",
      "hover",
      "indeterminate",
      "in-range",
      "invalid",
      "is",
      "lang",
      "last-child",
      "last-of-type",
      "left",
      "link",
      "local-link",
      "not",
      "nth-child",
      "nth-col",
      "nth-last-child",
      "nth-last-col",
      "nth-last-of-type",
      "nth-of-type",
      "only-child",
      "only-of-type",
      "optional",
      "out-of-range",
      "past",
      "placeholder-shown",
      "read-only",
      "read-write",
      "required",
      "right",
      "root",
      "scope",
      "target",
      "target-within",
      "user-invalid",
      "valid",
      "visited",
      "where",
    ],
    se = [
      "after",
      "backdrop",
      "before",
      "cue",
      "cue-region",
      "first-letter",
      "first-line",
      "grammar-error",
      "marker",
      "part",
      "placeholder",
      "selection",
      "slotted",
      "spelling-error",
    ],
    oe = [
      "align-content",
      "align-items",
      "align-self",
      "all",
      "animation",
      "animation-delay",
      "animation-direction",
      "animation-duration",
      "animation-fill-mode",
      "animation-iteration-count",
      "animation-name",
      "animation-play-state",
      "animation-timing-function",
      "backface-visibility",
      "background",
      "background-attachment",
      "background-clip",
      "background-color",
      "background-image",
      "background-origin",
      "background-position",
      "background-repeat",
      "background-size",
      "border",
      "border-bottom",
      "border-bottom-color",
      "border-bottom-left-radius",
      "border-bottom-right-radius",
      "border-bottom-style",
      "border-bottom-width",
      "border-collapse",
      "border-color",
      "border-image",
      "border-image-outset",
      "border-image-repeat",
      "border-image-slice",
      "border-image-source",
      "border-image-width",
      "border-left",
      "border-left-color",
      "border-left-style",
      "border-left-width",
      "border-radius",
      "border-right",
      "border-right-color",
      "border-right-style",
      "border-right-width",
      "border-spacing",
      "border-style",
      "border-top",
      "border-top-color",
      "border-top-left-radius",
      "border-top-right-radius",
      "border-top-style",
      "border-top-width",
      "border-width",
      "bottom",
      "box-decoration-break",
      "box-shadow",
      "box-sizing",
      "break-after",
      "break-before",
      "break-inside",
      "caption-side",
      "caret-color",
      "clear",
      "clip",
      "clip-path",
      "clip-rule",
      "color",
      "column-count",
      "column-fill",
      "column-gap",
      "column-rule",
      "column-rule-color",
      "column-rule-style",
      "column-rule-width",
      "column-span",
      "column-width",
      "columns",
      "contain",
      "content",
      "content-visibility",
      "counter-increment",
      "counter-reset",
      "cue",
      "cue-after",
      "cue-before",
      "cursor",
      "direction",
      "display",
      "empty-cells",
      "filter",
      "flex",
      "flex-basis",
      "flex-direction",
      "flex-flow",
      "flex-grow",
      "flex-shrink",
      "flex-wrap",
      "float",
      "flow",
      "font",
      "font-display",
      "font-family",
      "font-feature-settings",
      "font-kerning",
      "font-language-override",
      "font-size",
      "font-size-adjust",
      "font-smoothing",
      "font-stretch",
      "font-style",
      "font-synthesis",
      "font-variant",
      "font-variant-caps",
      "font-variant-east-asian",
      "font-variant-ligatures",
      "font-variant-numeric",
      "font-variant-position",
      "font-variation-settings",
      "font-weight",
      "gap",
      "glyph-orientation-vertical",
      "grid",
      "grid-area",
      "grid-auto-columns",
      "grid-auto-flow",
      "grid-auto-rows",
      "grid-column",
      "grid-column-end",
      "grid-column-start",
      "grid-gap",
      "grid-row",
      "grid-row-end",
      "grid-row-start",
      "grid-template",
      "grid-template-areas",
      "grid-template-columns",
      "grid-template-rows",
      "hanging-punctuation",
      "height",
      "hyphens",
      "icon",
      "image-orientation",
      "image-rendering",
      "image-resolution",
      "ime-mode",
      "isolation",
      "justify-content",
      "left",
      "letter-spacing",
      "line-break",
      "line-height",
      "list-style",
      "list-style-image",
      "list-style-position",
      "list-style-type",
      "margin",
      "margin-bottom",
      "margin-left",
      "margin-right",
      "margin-top",
      "marks",
      "mask",
      "mask-border",
      "mask-border-mode",
      "mask-border-outset",
      "mask-border-repeat",
      "mask-border-slice",
      "mask-border-source",
      "mask-border-width",
      "mask-clip",
      "mask-composite",
      "mask-image",
      "mask-mode",
      "mask-origin",
      "mask-position",
      "mask-repeat",
      "mask-size",
      "mask-type",
      "max-height",
      "max-width",
      "min-height",
      "min-width",
      "mix-blend-mode",
      "nav-down",
      "nav-index",
      "nav-left",
      "nav-right",
      "nav-up",
      "none",
      "normal",
      "object-fit",
      "object-position",
      "opacity",
      "order",
      "orphans",
      "outline",
      "outline-color",
      "outline-offset",
      "outline-style",
      "outline-width",
      "overflow",
      "overflow-wrap",
      "overflow-x",
      "overflow-y",
      "padding",
      "padding-bottom",
      "padding-left",
      "padding-right",
      "padding-top",
      "page-break-after",
      "page-break-before",
      "page-break-inside",
      "pause",
      "pause-after",
      "pause-before",
      "perspective",
      "perspective-origin",
      "pointer-events",
      "position",
      "quotes",
      "resize",
      "rest",
      "rest-after",
      "rest-before",
      "right",
      "row-gap",
      "scroll-margin",
      "scroll-margin-block",
      "scroll-margin-block-end",
      "scroll-margin-block-start",
      "scroll-margin-bottom",
      "scroll-margin-inline",
      "scroll-margin-inline-end",
      "scroll-margin-inline-start",
      "scroll-margin-left",
      "scroll-margin-right",
      "scroll-margin-top",
      "scroll-padding",
      "scroll-padding-block",
      "scroll-padding-block-end",
      "scroll-padding-block-start",
      "scroll-padding-bottom",
      "scroll-padding-inline",
      "scroll-padding-inline-end",
      "scroll-padding-inline-start",
      "scroll-padding-left",
      "scroll-padding-right",
      "scroll-padding-top",
      "scroll-snap-align",
      "scroll-snap-stop",
      "scroll-snap-type",
      "shape-image-threshold",
      "shape-margin",
      "shape-outside",
      "speak",
      "speak-as",
      "src",
      "tab-size",
      "table-layout",
      "text-align",
      "text-align-all",
      "text-align-last",
      "text-combine-upright",
      "text-decoration",
      "text-decoration-color",
      "text-decoration-line",
      "text-decoration-style",
      "text-emphasis",
      "text-emphasis-color",
      "text-emphasis-position",
      "text-emphasis-style",
      "text-indent",
      "text-justify",
      "text-orientation",
      "text-overflow",
      "text-rendering",
      "text-shadow",
      "text-transform",
      "text-underline-position",
      "top",
      "transform",
      "transform-box",
      "transform-origin",
      "transform-style",
      "transition",
      "transition-delay",
      "transition-duration",
      "transition-property",
      "transition-timing-function",
      "unicode-bidi",
      "vertical-align",
      "visibility",
      "voice-balance",
      "voice-duration",
      "voice-family",
      "voice-pitch",
      "voice-range",
      "voice-rate",
      "voice-stress",
      "voice-volume",
      "white-space",
      "widows",
      "width",
      "will-change",
      "word-break",
      "word-spacing",
      "word-wrap",
      "writing-mode",
      "z-index",
    ].reverse(),
    le = re.concat(se)
  var ce = "\\.([0-9](_*[0-9])*)",
    de = "[0-9a-fA-F](_*[0-9a-fA-F])*",
    ge = {
      className: "number",
      variants: [
        {
          begin: `(\\b([0-9](_*[0-9])*)((${ce})|\\.)?|(${ce}))[eE][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`,
        },
        { begin: `\\b([0-9](_*[0-9])*)((${ce})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
        {
          begin: `(${ce})[fFdD]?\\b`,
        },
        { begin: "\\b([0-9](_*[0-9])*)[fFdD]\\b" },
        {
          begin: `\\b0[xX]((${de})\\.?|(${de})?\\.(${de}))[pP][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`,
        },
        { begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b" },
        { begin: `\\b0[xX](${de})[lL]?\\b` },
        {
          begin: "\\b0(_*[0-7])*[lL]?\\b",
        },
        { begin: "\\b0[bB][01](_*[01])*[lL]?\\b" },
      ],
      relevance: 0,
    }
  function ue(e, n, t) {
    return -1 === t ? "" : e.replace(n, (a) => ue(e, n, t - 1))
  }
  const be = "[A-Za-z$_][0-9A-Za-z$_]*",
    me = [
      "as",
      "in",
      "of",
      "if",
      "for",
      "while",
      "finally",
      "var",
      "new",
      "function",
      "do",
      "return",
      "void",
      "else",
      "break",
      "catch",
      "instanceof",
      "with",
      "throw",
      "case",
      "default",
      "try",
      "switch",
      "continue",
      "typeof",
      "delete",
      "let",
      "yield",
      "const",
      "class",
      "debugger",
      "async",
      "await",
      "static",
      "import",
      "from",
      "export",
      "extends",
    ],
    pe = ["true", "false", "null", "undefined", "NaN", "Infinity"],
    _e = [
      "Object",
      "Function",
      "Boolean",
      "Symbol",
      "Math",
      "Date",
      "Number",
      "BigInt",
      "String",
      "RegExp",
      "Array",
      "Float32Array",
      "Float64Array",
      "Int8Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "Int16Array",
      "Int32Array",
      "Uint16Array",
      "Uint32Array",
      "BigInt64Array",
      "BigUint64Array",
      "Set",
      "Map",
      "WeakSet",
      "WeakMap",
      "ArrayBuffer",
      "SharedArrayBuffer",
      "Atomics",
      "DataView",
      "JSON",
      "Promise",
      "Generator",
      "GeneratorFunction",
      "AsyncFunction",
      "Reflect",
      "Proxy",
      "Intl",
      "WebAssembly",
    ],
    he = [
      "Error",
      "EvalError",
      "InternalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError",
    ],
    fe = [
      "setInterval",
      "setTimeout",
      "clearInterval",
      "clearTimeout",
      "require",
      "exports",
      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "escape",
      "unescape",
    ],
    Ee = [
      "arguments",
      "this",
      "super",
      "console",
      "window",
      "document",
      "localStorage",
      "module",
      "global",
    ],
    ye = [].concat(fe, _e, he)
  function Ne(e) {
    const n = e.regex,
      t = be,
      a = {
        begin: /<[A-Za-z0-9\\._:-]+/,
        end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
        isTrulyOpeningTag: (e, n) => {
          const t = e[0].length + e.index,
            a = e.input[t]
          if ("<" === a || "," === a) return void n.ignoreMatch()
          let i
          ;(">" === a &&
            (((e, { after: n }) => {
              const t = "</" + e[0].slice(1)
              return -1 !== e.input.indexOf(t, n)
            })(e, { after: t }) ||
              n.ignoreMatch()),
            (i = e.input.substr(t).match(/^\s+extends\s+/)) &&
              0 === i.index &&
              n.ignoreMatch())
        },
      },
      i = {
        $pattern: be,
        keyword: me,
        literal: pe,
        built_in: ye,
        "variable.language": Ee,
      },
      r = "\\.([0-9](_?[0-9])*)",
      s = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",
      o = {
        className: "number",
        variants: [
          {
            begin: `(\\b(${s})((${r})|\\.)?|(${r}))[eE][+-]?([0-9](_?[0-9])*)\\b`,
          },
          {
            begin: `\\b(${s})\\b((${r})\\b|\\.)?|(${r})\\b`,
          },
          {
            begin: "\\b(0|[1-9](_?[0-9])*)n\\b",
          },
          {
            begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b",
          },
          {
            begin: "\\b0[bB][0-1](_?[0-1])*n?\\b",
          },
          { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
          {
            begin: "\\b0[0-7]+n?\\b",
          },
        ],
        relevance: 0,
      },
      l = {
        className: "subst",
        begin: "\\$\\{",
        end: "\\}",
        keywords: i,
        contains: [],
      },
      c = {
        begin: "html`",
        end: "",
        starts: {
          end: "`",
          returnEnd: !1,
          contains: [e.BACKSLASH_ESCAPE, l],
          subLanguage: "xml",
        },
      },
      d = {
        begin: "css`",
        end: "",
        starts: {
          end: "`",
          returnEnd: !1,
          contains: [e.BACKSLASH_ESCAPE, l],
          subLanguage: "css",
        },
      },
      g = {
        className: "string",
        begin: "`",
        end: "`",
        contains: [e.BACKSLASH_ESCAPE, l],
      },
      u = {
        className: "comment",
        variants: [
          e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
            relevance: 0,
            contains: [
              {
                begin: "(?=@[A-Za-z]+)",
                relevance: 0,
                contains: [
                  { className: "doctag", begin: "@[A-Za-z]+" },
                  {
                    className: "type",
                    begin: "\\{",
                    end: "\\}",
                    excludeEnd: !0,
                    excludeBegin: !0,
                    relevance: 0,
                  },
                  {
                    className: "variable",
                    begin: t + "(?=\\s*(-)|$)",
                    endsParent: !0,
                    relevance: 0,
                  },
                  { begin: /(?=[^\n])\s/, relevance: 0 },
                ],
              },
            ],
          }),
          e.C_BLOCK_COMMENT_MODE,
          e.C_LINE_COMMENT_MODE,
        ],
      },
      b = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, c, d, g, o]
    l.contains = b.concat({
      begin: /\{/,
      end: /\}/,
      keywords: i,
      contains: ["self"].concat(b),
    })
    const m = [].concat(u, l.contains),
      p = m.concat([
        { begin: /\(/, end: /\)/, keywords: i, contains: ["self"].concat(m) },
      ]),
      _ = {
        className: "params",
        begin: /\(/,
        end: /\)/,
        excludeBegin: !0,
        excludeEnd: !0,
        keywords: i,
        contains: p,
      },
      h = {
        variants: [
          {
            match: [
              /class/,
              /\s+/,
              t,
              /\s+/,
              /extends/,
              /\s+/,
              n.concat(t, "(", n.concat(/\./, t), ")*"),
            ],
            scope: {
              1: "keyword",
              3: "title.class",
              5: "keyword",
              7: "title.class.inherited",
            },
          },
          {
            match: [/class/, /\s+/, t],
            scope: { 1: "keyword", 3: "title.class" },
          },
        ],
      },
      f = {
        relevance: 0,
        match: n.either(
          /\bJSON/,
          /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
          /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
          /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/,
        ),
        className: "title.class",
        keywords: { _: [..._e, ...he] },
      },
      E = {
        variants: [
          {
            match: [/function/, /\s+/, t, /(?=\s*\()/],
          },
          { match: [/function/, /\s*(?=\()/] },
        ],
        className: { 1: "keyword", 3: "title.function" },
        label: "func.def",
        contains: [_],
        illegal: /%/,
      },
      y = {
        match: n.concat(
          /\b/,
          ((N = [...fe, "super"]), n.concat("(?!", N.join("|"), ")")),
          t,
          n.lookahead(/\(/),
        ),
        className: "title.function",
        relevance: 0,
      }
    var N
    const w = {
        begin: n.concat(/\./, n.lookahead(n.concat(t, /(?![0-9A-Za-z$_(])/))),
        end: t,
        excludeBegin: !0,
        keywords: "prototype",
        className: "property",
        relevance: 0,
      },
      v = {
        match: [/get|set/, /\s+/, t, /(?=\()/],
        className: { 1: "keyword", 3: "title.function" },
        contains: [{ begin: /\(\)/ }, _],
      },
      O =
        "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" +
        e.UNDERSCORE_IDENT_RE +
        ")\\s*=>",
      x = {
        match: [
          /const|var|let/,
          /\s+/,
          t,
          /\s*/,
          /=\s*/,
          /(async\s*)?/,
          n.lookahead(O),
        ],
        keywords: "async",
        className: { 1: "keyword", 3: "title.function" },
        contains: [_],
      }
    return {
      name: "Javascript",
      aliases: ["js", "jsx", "mjs", "cjs"],
      keywords: i,
      exports: {
        PARAMS_CONTAINS: p,
        CLASS_REFERENCE: f,
      },
      illegal: /#(?![$_A-z])/,
      contains: [
        e.SHEBANG({ label: "shebang", binary: "node", relevance: 5 }),
        {
          label: "use_strict",
          className: "meta",
          relevance: 10,
          begin: /^\s*['"]use (strict|asm)['"]/,
        },
        e.APOS_STRING_MODE,
        e.QUOTE_STRING_MODE,
        c,
        d,
        g,
        u,
        o,
        f,
        { className: "attr", begin: t + n.lookahead(":"), relevance: 0 },
        x,
        {
          begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
          keywords: "return throw case",
          relevance: 0,
          contains: [
            u,
            e.REGEXP_MODE,
            {
              className: "function",
              begin: O,
              returnBegin: !0,
              end: "\\s*=>",
              contains: [
                {
                  className: "params",
                  variants: [
                    { begin: e.UNDERSCORE_IDENT_RE, relevance: 0 },
                    {
                      className: null,
                      begin: /\(\s*\)/,
                      skip: !0,
                    },
                    {
                      begin: /\(/,
                      end: /\)/,
                      excludeBegin: !0,
                      excludeEnd: !0,
                      keywords: i,
                      contains: p,
                    },
                  ],
                },
              ],
            },
            { begin: /,/, relevance: 0 },
            { match: /\s+/, relevance: 0 },
            {
              variants: [
                { begin: "<>", end: "</>" },
                {
                  match: /<[A-Za-z0-9\\._:-]+\s*\/>/,
                },
                { begin: a.begin, "on:begin": a.isTrulyOpeningTag, end: a.end },
              ],
              subLanguage: "xml",
              contains: [
                {
                  begin: a.begin,
                  end: a.end,
                  skip: !0,
                  contains: ["self"],
                },
              ],
            },
          ],
        },
        E,
        {
          beginKeywords: "while if switch catch for",
        },
        {
          begin:
            "\\b(?!function)" +
            e.UNDERSCORE_IDENT_RE +
            "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
          returnBegin: !0,
          label: "func.def",
          contains: [
            _,
            e.inherit(e.TITLE_MODE, { begin: t, className: "title.function" }),
          ],
        },
        { match: /\.\.\./, relevance: 0 },
        w,
        { match: "\\$" + t, relevance: 0 },
        {
          match: [/\bconstructor(?=\s*\()/],
          className: { 1: "title.function" },
          contains: [_],
        },
        y,
        {
          relevance: 0,
          match: /\b[A-Z][A-Z_0-9]+\b/,
          className: "variable.constant",
        },
        h,
        v,
        { match: /\$[(.]/ },
      ],
    }
  }
  const we = (e) => m(/\b/, e, /\w$/.test(e) ? /\b/ : /\B/),
    ve = ["Protocol", "Type"].map(we),
    Oe = ["init", "self"].map(we),
    xe = ["Any", "Self"],
    Me = [
      "actor",
      "associatedtype",
      "async",
      "await",
      /as\?/,
      /as!/,
      "as",
      "break",
      "case",
      "catch",
      "class",
      "continue",
      "convenience",
      "default",
      "defer",
      "deinit",
      "didSet",
      "do",
      "dynamic",
      "else",
      "enum",
      "extension",
      "fallthrough",
      /fileprivate\(set\)/,
      "fileprivate",
      "final",
      "for",
      "func",
      "get",
      "guard",
      "if",
      "import",
      "indirect",
      "infix",
      /init\?/,
      /init!/,
      "inout",
      /internal\(set\)/,
      "internal",
      "in",
      "is",
      "isolated",
      "nonisolated",
      "lazy",
      "let",
      "mutating",
      "nonmutating",
      /open\(set\)/,
      "open",
      "operator",
      "optional",
      "override",
      "postfix",
      "precedencegroup",
      "prefix",
      /private\(set\)/,
      "private",
      "protocol",
      /public\(set\)/,
      "public",
      "repeat",
      "required",
      "rethrows",
      "return",
      "set",
      "some",
      "static",
      "struct",
      "subscript",
      "super",
      "switch",
      "throws",
      "throw",
      /try\?/,
      /try!/,
      "try",
      "typealias",
      /unowned\(safe\)/,
      /unowned\(unsafe\)/,
      "unowned",
      "var",
      "weak",
      "where",
      "while",
      "willSet",
    ],
    ke = ["false", "nil", "true"],
    Se = [
      "assignment",
      "associativity",
      "higherThan",
      "left",
      "lowerThan",
      "none",
      "right",
    ],
    Ae = [
      "#colorLiteral",
      "#column",
      "#dsohandle",
      "#else",
      "#elseif",
      "#endif",
      "#error",
      "#file",
      "#fileID",
      "#fileLiteral",
      "#filePath",
      "#function",
      "#if",
      "#imageLiteral",
      "#keyPath",
      "#line",
      "#selector",
      "#sourceLocation",
      "#warn_unqualified_access",
      "#warning",
    ],
    Ce = [
      "abs",
      "all",
      "any",
      "assert",
      "assertionFailure",
      "debugPrint",
      "dump",
      "fatalError",
      "getVaList",
      "isKnownUniquelyReferenced",
      "max",
      "min",
      "numericCast",
      "pointwiseMax",
      "pointwiseMin",
      "precondition",
      "preconditionFailure",
      "print",
      "readLine",
      "repeatElement",
      "sequence",
      "stride",
      "swap",
      "swift_unboxFromSwiftValueWithType",
      "transcode",
      "type",
      "unsafeBitCast",
      "unsafeDowncast",
      "withExtendedLifetime",
      "withUnsafeMutablePointer",
      "withUnsafePointer",
      "withVaList",
      "withoutActuallyEscaping",
      "zip",
    ],
    Te = p(
      /[/=\-+!*%<>&|^~?]/,
      /[\u00A1-\u00A7]/,
      /[\u00A9\u00AB]/,
      /[\u00AC\u00AE]/,
      /[\u00B0\u00B1]/,
      /[\u00B6\u00BB\u00BF\u00D7\u00F7]/,
      /[\u2016-\u2017]/,
      /[\u2020-\u2027]/,
      /[\u2030-\u203E]/,
      /[\u2041-\u2053]/,
      /[\u2055-\u205E]/,
      /[\u2190-\u23FF]/,
      /[\u2500-\u2775]/,
      /[\u2794-\u2BFF]/,
      /[\u2E00-\u2E7F]/,
      /[\u3001-\u3003]/,
      /[\u3008-\u3020]/,
      /[\u3030]/,
    ),
    Re = p(
      Te,
      /[\u0300-\u036F]/,
      /[\u1DC0-\u1DFF]/,
      /[\u20D0-\u20FF]/,
      /[\uFE00-\uFE0F]/,
      /[\uFE20-\uFE2F]/,
    ),
    De = m(Te, Re, "*"),
    Ie = p(
      /[a-zA-Z_]/,
      /[\u00A8\u00AA\u00AD\u00AF\u00B2-\u00B5\u00B7-\u00BA]/,
      /[\u00BC-\u00BE\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/,
      /[\u0100-\u02FF\u0370-\u167F\u1681-\u180D\u180F-\u1DBF]/,
      /[\u1E00-\u1FFF]/,
      /[\u200B-\u200D\u202A-\u202E\u203F-\u2040\u2054\u2060-\u206F]/,
      /[\u2070-\u20CF\u2100-\u218F\u2460-\u24FF\u2776-\u2793]/,
      /[\u2C00-\u2DFF\u2E80-\u2FFF]/,
      /[\u3004-\u3007\u3021-\u302F\u3031-\u303F\u3040-\uD7FF]/,
      /[\uF900-\uFD3D\uFD40-\uFDCF\uFDF0-\uFE1F\uFE30-\uFE44]/,
      /[\uFE47-\uFEFE\uFF00-\uFFFD]/,
    ),
    Le = p(Ie, /\d/, /[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/),
    Be = m(Ie, Le, "*"),
    $e = m(/[A-Z]/, Le, "*"),
    Fe = [
      "autoclosure",
      m(/convention\(/, p("swift", "block", "c"), /\)/),
      "discardableResult",
      "dynamicCallable",
      "dynamicMemberLookup",
      "escaping",
      "frozen",
      "GKInspectable",
      "IBAction",
      "IBDesignable",
      "IBInspectable",
      "IBOutlet",
      "IBSegueAction",
      "inlinable",
      "main",
      "nonobjc",
      "NSApplicationMain",
      "NSCopying",
      "NSManaged",
      m(/objc\(/, Be, /\)/),
      "objc",
      "objcMembers",
      "propertyWrapper",
      "requires_stored_property_inits",
      "resultBuilder",
      "testable",
      "UIApplicationMain",
      "unknown",
      "usableFromInline",
    ],
    ze = [
      "iOS",
      "iOSApplicationExtension",
      "macOS",
      "macOSApplicationExtension",
      "macCatalyst",
      "macCatalystApplicationExtension",
      "watchOS",
      "watchOSApplicationExtension",
      "tvOS",
      "tvOSApplicationExtension",
      "swift",
    ]
  var Ue = Object.freeze({
    __proto__: null,
    grmr_bash: (e) => {
      const n = e.regex,
        t = {},
        a = {
          begin: /\$\{/,
          end: /\}/,
          contains: ["self", { begin: /:-/, contains: [t] }],
        }
      Object.assign(t, {
        className: "variable",
        variants: [
          {
            begin: n.concat(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])"),
          },
          a,
        ],
      })
      const i = {
          className: "subst",
          begin: /\$\(/,
          end: /\)/,
          contains: [e.BACKSLASH_ESCAPE],
        },
        r = {
          begin: /<<-?\s*(?=\w+)/,
          starts: {
            contains: [
              e.END_SAME_AS_BEGIN({
                begin: /(\w+)/,
                end: /(\w+)/,
                className: "string",
              }),
            ],
          },
        },
        s = {
          className: "string",
          begin: /"/,
          end: /"/,
          contains: [e.BACKSLASH_ESCAPE, t, i],
        }
      i.contains.push(s)
      const o = {
          begin: /\$\(\(/,
          end: /\)\)/,
          contains: [
            { begin: /\d+#[0-9a-f]+/, className: "number" },
            e.NUMBER_MODE,
            t,
          ],
        },
        l = e.SHEBANG({
          binary: "(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",
          relevance: 10,
        }),
        c = {
          className: "function",
          begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
          returnBegin: !0,
          contains: [e.inherit(e.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
          relevance: 0,
        }
      return {
        name: "Bash",
        aliases: ["sh"],
        keywords: {
          $pattern: /\b[a-z._-]+\b/,
          keyword: [
            "if",
            "then",
            "else",
            "elif",
            "fi",
            "for",
            "while",
            "in",
            "do",
            "done",
            "case",
            "esac",
            "function",
          ],
          literal: ["true", "false"],
          built_in: [
            "break",
            "cd",
            "continue",
            "eval",
            "exec",
            "exit",
            "export",
            "getopts",
            "hash",
            "pwd",
            "readonly",
            "return",
            "shift",
            "test",
            "times",
            "trap",
            "umask",
            "unset",
            "alias",
            "bind",
            "builtin",
            "caller",
            "command",
            "declare",
            "echo",
            "enable",
            "help",
            "let",
            "local",
            "logout",
            "mapfile",
            "printf",
            "read",
            "readarray",
            "source",
            "type",
            "typeset",
            "ulimit",
            "unalias",
            "set",
            "shopt",
            "autoload",
            "bg",
            "bindkey",
            "bye",
            "cap",
            "chdir",
            "clone",
            "comparguments",
            "compcall",
            "compctl",
            "compdescribe",
            "compfiles",
            "compgroups",
            "compquote",
            "comptags",
            "comptry",
            "compvalues",
            "dirs",
            "disable",
            "disown",
            "echotc",
            "echoti",
            "emulate",
            "fc",
            "fg",
            "float",
            "functions",
            "getcap",
            "getln",
            "history",
            "integer",
            "jobs",
            "kill",
            "limit",
            "log",
            "noglob",
            "popd",
            "print",
            "pushd",
            "pushln",
            "rehash",
            "sched",
            "setcap",
            "setopt",
            "stat",
            "suspend",
            "ttyctl",
            "unfunction",
            "unhash",
            "unlimit",
            "unsetopt",
            "vared",
            "wait",
            "whence",
            "where",
            "which",
            "zcompile",
            "zformat",
            "zftp",
            "zle",
            "zmodload",
            "zparseopts",
            "zprof",
            "zpty",
            "zregexparse",
            "zsocket",
            "zstyle",
            "ztcp",
            "chcon",
            "chgrp",
            "chown",
            "chmod",
            "cp",
            "dd",
            "df",
            "dir",
            "dircolors",
            "ln",
            "ls",
            "mkdir",
            "mkfifo",
            "mknod",
            "mktemp",
            "mv",
            "realpath",
            "rm",
            "rmdir",
            "shred",
            "sync",
            "touch",
            "truncate",
            "vdir",
            "b2sum",
            "base32",
            "base64",
            "cat",
            "cksum",
            "comm",
            "csplit",
            "cut",
            "expand",
            "fmt",
            "fold",
            "head",
            "join",
            "md5sum",
            "nl",
            "numfmt",
            "od",
            "paste",
            "ptx",
            "pr",
            "sha1sum",
            "sha224sum",
            "sha256sum",
            "sha384sum",
            "sha512sum",
            "shuf",
            "sort",
            "split",
            "sum",
            "tac",
            "tail",
            "tr",
            "tsort",
            "unexpand",
            "uniq",
            "wc",
            "arch",
            "basename",
            "chroot",
            "date",
            "dirname",
            "du",
            "echo",
            "env",
            "expr",
            "factor",
            "groups",
            "hostid",
            "id",
            "link",
            "logname",
            "nice",
            "nohup",
            "nproc",
            "pathchk",
            "pinky",
            "printenv",
            "printf",
            "pwd",
            "readlink",
            "runcon",
            "seq",
            "sleep",
            "stat",
            "stdbuf",
            "stty",
            "tee",
            "test",
            "timeout",
            "tty",
            "uname",
            "unlink",
            "uptime",
            "users",
            "who",
            "whoami",
            "yes",
          ],
        },
        contains: [
          l,
          e.SHEBANG(),
          c,
          o,
          e.HASH_COMMENT_MODE,
          r,
          { match: /(\/[a-z._-]+)+/ },
          s,
          {
            className: "",
            begin: /\\"/,
          },
          { className: "string", begin: /'/, end: /'/ },
          t,
        ],
      }
    },
    grmr_c: (e) => {
      const n = e.regex,
        t = e.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] }),
        a = "[a-zA-Z_]\\w*::",
        i =
          "(decltype\\(auto\\)|" +
          n.optional(a) +
          "[a-zA-Z_]\\w*" +
          n.optional("<[^<>]+>") +
          ")",
        r = {
          className: "type",
          variants: [
            { begin: "\\b[a-z\\d_]*_t\\b" },
            {
              match: /\batomic_[a-z]{3,6}\b/,
            },
          ],
        },
        s = {
          className: "string",
          variants: [
            {
              begin: '(u8?|U|L)?"',
              end: '"',
              illegal: "\\n",
              contains: [e.BACKSLASH_ESCAPE],
            },
            {
              begin:
                "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
              end: "'",
              illegal: ".",
            },
            e.END_SAME_AS_BEGIN({
              begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
              end: /\)([^()\\ ]{0,16})"/,
            }),
          ],
        },
        o = {
          className: "number",
          variants: [
            { begin: "\\b(0b[01']+)" },
            {
              begin:
                "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)",
            },
            {
              begin:
                "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)",
            },
          ],
          relevance: 0,
        },
        l = {
          className: "meta",
          begin: /#\s*[a-z]+\b/,
          end: /$/,
          keywords: {
            keyword:
              "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include",
          },
          contains: [
            { begin: /\\\n/, relevance: 0 },
            e.inherit(s, { className: "string" }),
            {
              className: "string",
              begin: /<.*?>/,
            },
            t,
            e.C_BLOCK_COMMENT_MODE,
          ],
        },
        c = {
          className: "title",
          begin: n.optional(a) + e.IDENT_RE,
          relevance: 0,
        },
        d = n.optional(a) + e.IDENT_RE + "\\s*\\(",
        g = {
          keyword: [
            "asm",
            "auto",
            "break",
            "case",
            "continue",
            "default",
            "do",
            "else",
            "enum",
            "extern",
            "for",
            "fortran",
            "goto",
            "if",
            "inline",
            "register",
            "restrict",
            "return",
            "sizeof",
            "struct",
            "switch",
            "typedef",
            "union",
            "volatile",
            "while",
            "_Alignas",
            "_Alignof",
            "_Atomic",
            "_Generic",
            "_Noreturn",
            "_Static_assert",
            "_Thread_local",
            "alignas",
            "alignof",
            "noreturn",
            "static_assert",
            "thread_local",
            "_Pragma",
          ],
          type: [
            "float",
            "double",
            "signed",
            "unsigned",
            "int",
            "short",
            "long",
            "char",
            "void",
            "_Bool",
            "_Complex",
            "_Imaginary",
            "_Decimal32",
            "_Decimal64",
            "_Decimal128",
            "const",
            "static",
            "complex",
            "bool",
            "imaginary",
          ],
          literal: "true false NULL",
          built_in:
            "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr",
        },
        u = [l, r, t, e.C_BLOCK_COMMENT_MODE, o, s],
        b = {
          variants: [
            { begin: /=/, end: /;/ },
            {
              begin: /\(/,
              end: /\)/,
            },
            { beginKeywords: "new throw return else", end: /;/ },
          ],
          keywords: g,
          contains: u.concat([
            {
              begin: /\(/,
              end: /\)/,
              keywords: g,
              contains: u.concat(["self"]),
              relevance: 0,
            },
          ]),
          relevance: 0,
        },
        m = {
          begin: "(" + i + "[\\*&\\s]+)+" + d,
          returnBegin: !0,
          end: /[{;=]/,
          excludeEnd: !0,
          keywords: g,
          illegal: /[^\w\s\*&:<>.]/,
          contains: [
            { begin: "decltype\\(auto\\)", keywords: g, relevance: 0 },
            {
              begin: d,
              returnBegin: !0,
              contains: [
                e.inherit(c, {
                  className: "title.function",
                }),
              ],
              relevance: 0,
            },
            { relevance: 0, match: /,/ },
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              keywords: g,
              relevance: 0,
              contains: [
                t,
                e.C_BLOCK_COMMENT_MODE,
                s,
                o,
                r,
                {
                  begin: /\(/,
                  end: /\)/,
                  keywords: g,
                  relevance: 0,
                  contains: ["self", t, e.C_BLOCK_COMMENT_MODE, s, o, r],
                },
              ],
            },
            r,
            t,
            e.C_BLOCK_COMMENT_MODE,
            l,
          ],
        }
      return {
        name: "C",
        aliases: ["h"],
        keywords: g,
        disableAutodetect: !0,
        illegal: "</",
        contains: [].concat(b, m, u, [
          l,
          {
            begin: e.IDENT_RE + "::",
            keywords: g,
          },
          {
            className: "class",
            beginKeywords: "enum class struct union",
            end: /[{;:<>=]/,
            contains: [
              {
                beginKeywords: "final class struct",
              },
              e.TITLE_MODE,
            ],
          },
        ]),
        exports: { preprocessor: l, strings: s, keywords: g },
      }
    },
    grmr_cpp: (e) => {
      const n = e.regex,
        t = e.COMMENT("//", "$", {
          contains: [{ begin: /\\\n/ }],
        }),
        a = "[a-zA-Z_]\\w*::",
        i =
          "(?!struct)(decltype\\(auto\\)|" +
          n.optional(a) +
          "[a-zA-Z_]\\w*" +
          n.optional("<[^<>]+>") +
          ")",
        r = {
          className: "type",
          begin: "\\b[a-z\\d_]*_t\\b",
        },
        s = {
          className: "string",
          variants: [
            {
              begin: '(u8?|U|L)?"',
              end: '"',
              illegal: "\\n",
              contains: [e.BACKSLASH_ESCAPE],
            },
            {
              begin:
                "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
              end: "'",
              illegal: ".",
            },
            e.END_SAME_AS_BEGIN({
              begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
              end: /\)([^()\\ ]{0,16})"/,
            }),
          ],
        },
        o = {
          className: "number",
          variants: [
            { begin: "\\b(0b[01']+)" },
            {
              begin:
                "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)",
            },
            {
              begin:
                "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)",
            },
          ],
          relevance: 0,
        },
        l = {
          className: "meta",
          begin: /#\s*[a-z]+\b/,
          end: /$/,
          keywords: {
            keyword:
              "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include",
          },
          contains: [
            { begin: /\\\n/, relevance: 0 },
            e.inherit(s, { className: "string" }),
            {
              className: "string",
              begin: /<.*?>/,
            },
            t,
            e.C_BLOCK_COMMENT_MODE,
          ],
        },
        c = {
          className: "title",
          begin: n.optional(a) + e.IDENT_RE,
          relevance: 0,
        },
        d = n.optional(a) + e.IDENT_RE + "\\s*\\(",
        g = {
          type: [
            "bool",
            "char",
            "char16_t",
            "char32_t",
            "char8_t",
            "double",
            "float",
            "int",
            "long",
            "short",
            "void",
            "wchar_t",
            "unsigned",
            "signed",
            "const",
            "static",
          ],
          keyword: [
            "alignas",
            "alignof",
            "and",
            "and_eq",
            "asm",
            "atomic_cancel",
            "atomic_commit",
            "atomic_noexcept",
            "auto",
            "bitand",
            "bitor",
            "break",
            "case",
            "catch",
            "class",
            "co_await",
            "co_return",
            "co_yield",
            "compl",
            "concept",
            "const_cast|10",
            "consteval",
            "constexpr",
            "constinit",
            "continue",
            "decltype",
            "default",
            "delete",
            "do",
            "dynamic_cast|10",
            "else",
            "enum",
            "explicit",
            "export",
            "extern",
            "false",
            "final",
            "for",
            "friend",
            "goto",
            "if",
            "import",
            "inline",
            "module",
            "mutable",
            "namespace",
            "new",
            "noexcept",
            "not",
            "not_eq",
            "nullptr",
            "operator",
            "or",
            "or_eq",
            "override",
            "private",
            "protected",
            "public",
            "reflexpr",
            "register",
            "reinterpret_cast|10",
            "requires",
            "return",
            "sizeof",
            "static_assert",
            "static_cast|10",
            "struct",
            "switch",
            "synchronized",
            "template",
            "this",
            "thread_local",
            "throw",
            "transaction_safe",
            "transaction_safe_dynamic",
            "true",
            "try",
            "typedef",
            "typeid",
            "typename",
            "union",
            "using",
            "virtual",
            "volatile",
            "while",
            "xor",
            "xor_eq",
          ],
          literal: ["NULL", "false", "nullopt", "nullptr", "true"],
          built_in: ["_Pragma"],
          _type_hints: [
            "any",
            "auto_ptr",
            "barrier",
            "binary_semaphore",
            "bitset",
            "complex",
            "condition_variable",
            "condition_variable_any",
            "counting_semaphore",
            "deque",
            "false_type",
            "future",
            "imaginary",
            "initializer_list",
            "istringstream",
            "jthread",
            "latch",
            "lock_guard",
            "multimap",
            "multiset",
            "mutex",
            "optional",
            "ostringstream",
            "packaged_task",
            "pair",
            "promise",
            "priority_queue",
            "queue",
            "recursive_mutex",
            "recursive_timed_mutex",
            "scoped_lock",
            "set",
            "shared_future",
            "shared_lock",
            "shared_mutex",
            "shared_timed_mutex",
            "shared_ptr",
            "stack",
            "string_view",
            "stringstream",
            "timed_mutex",
            "thread",
            "true_type",
            "tuple",
            "unique_lock",
            "unique_ptr",
            "unordered_map",
            "unordered_multimap",
            "unordered_multiset",
            "unordered_set",
            "variant",
            "vector",
            "weak_ptr",
            "wstring",
            "wstring_view",
          ],
        },
        u = {
          className: "function.dispatch",
          relevance: 0,
          keywords: {
            _hint: [
              "abort",
              "abs",
              "acos",
              "apply",
              "as_const",
              "asin",
              "atan",
              "atan2",
              "calloc",
              "ceil",
              "cerr",
              "cin",
              "clog",
              "cos",
              "cosh",
              "cout",
              "declval",
              "endl",
              "exchange",
              "exit",
              "exp",
              "fabs",
              "floor",
              "fmod",
              "forward",
              "fprintf",
              "fputs",
              "free",
              "frexp",
              "fscanf",
              "future",
              "invoke",
              "isalnum",
              "isalpha",
              "iscntrl",
              "isdigit",
              "isgraph",
              "islower",
              "isprint",
              "ispunct",
              "isspace",
              "isupper",
              "isxdigit",
              "labs",
              "launder",
              "ldexp",
              "log",
              "log10",
              "make_pair",
              "make_shared",
              "make_shared_for_overwrite",
              "make_tuple",
              "make_unique",
              "malloc",
              "memchr",
              "memcmp",
              "memcpy",
              "memset",
              "modf",
              "move",
              "pow",
              "printf",
              "putchar",
              "puts",
              "realloc",
              "scanf",
              "sin",
              "sinh",
              "snprintf",
              "sprintf",
              "sqrt",
              "sscanf",
              "std",
              "stderr",
              "stdin",
              "stdout",
              "strcat",
              "strchr",
              "strcmp",
              "strcpy",
              "strcspn",
              "strlen",
              "strncat",
              "strncmp",
              "strncpy",
              "strpbrk",
              "strrchr",
              "strspn",
              "strstr",
              "swap",
              "tan",
              "tanh",
              "terminate",
              "to_underlying",
              "tolower",
              "toupper",
              "vfprintf",
              "visit",
              "vprintf",
              "vsprintf",
            ],
          },
          begin: n.concat(
            /\b/,
            /(?!decltype)/,
            /(?!if)/,
            /(?!for)/,
            /(?!switch)/,
            /(?!while)/,
            e.IDENT_RE,
            n.lookahead(/(<[^<>]+>|)\s*\(/),
          ),
        },
        b = [u, l, r, t, e.C_BLOCK_COMMENT_MODE, o, s],
        m = {
          variants: [
            { begin: /=/, end: /;/ },
            {
              begin: /\(/,
              end: /\)/,
            },
            { beginKeywords: "new throw return else", end: /;/ },
          ],
          keywords: g,
          contains: b.concat([
            {
              begin: /\(/,
              end: /\)/,
              keywords: g,
              contains: b.concat(["self"]),
              relevance: 0,
            },
          ]),
          relevance: 0,
        },
        p = {
          className: "function",
          begin: "(" + i + "[\\*&\\s]+)+" + d,
          returnBegin: !0,
          end: /[{;=]/,
          excludeEnd: !0,
          keywords: g,
          illegal: /[^\w\s\*&:<>.]/,
          contains: [
            { begin: "decltype\\(auto\\)", keywords: g, relevance: 0 },
            { begin: d, returnBegin: !0, contains: [c], relevance: 0 },
            {
              begin: /::/,
              relevance: 0,
            },
            { begin: /:/, endsWithParent: !0, contains: [s, o] },
            {
              relevance: 0,
              match: /,/,
            },
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              keywords: g,
              relevance: 0,
              contains: [
                t,
                e.C_BLOCK_COMMENT_MODE,
                s,
                o,
                r,
                {
                  begin: /\(/,
                  end: /\)/,
                  keywords: g,
                  relevance: 0,
                  contains: ["self", t, e.C_BLOCK_COMMENT_MODE, s, o, r],
                },
              ],
            },
            r,
            t,
            e.C_BLOCK_COMMENT_MODE,
            l,
          ],
        }
      return {
        name: "C++",
        aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
        keywords: g,
        illegal: "</",
        classNameAliases: { "function.dispatch": "built_in" },
        contains: [].concat(m, p, u, b, [
          l,
          {
            begin:
              "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function)\\s*<(?!<)",
            end: ">",
            keywords: g,
            contains: ["self", r],
          },
          { begin: e.IDENT_RE + "::", keywords: g },
          {
            match: [
              /\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,
              /\s+/,
              /\w+/,
            ],
            className: { 1: "keyword", 3: "title.class" },
          },
        ]),
      }
    },
    grmr_csharp: (e) => {
      const n = {
          keyword: [
            "abstract",
            "as",
            "base",
            "break",
            "case",
            "catch",
            "class",
            "const",
            "continue",
            "do",
            "else",
            "event",
            "explicit",
            "extern",
            "finally",
            "fixed",
            "for",
            "foreach",
            "goto",
            "if",
            "implicit",
            "in",
            "interface",
            "internal",
            "is",
            "lock",
            "namespace",
            "new",
            "operator",
            "out",
            "override",
            "params",
            "private",
            "protected",
            "public",
            "readonly",
            "record",
            "ref",
            "return",
            "sealed",
            "sizeof",
            "stackalloc",
            "static",
            "struct",
            "switch",
            "this",
            "throw",
            "try",
            "typeof",
            "unchecked",
            "unsafe",
            "using",
            "virtual",
            "void",
            "volatile",
            "while",
          ].concat([
            "add",
            "alias",
            "and",
            "ascending",
            "async",
            "await",
            "by",
            "descending",
            "equals",
            "from",
            "get",
            "global",
            "group",
            "init",
            "into",
            "join",
            "let",
            "nameof",
            "not",
            "notnull",
            "on",
            "or",
            "orderby",
            "partial",
            "remove",
            "select",
            "set",
            "unmanaged",
            "value|0",
            "var",
            "when",
            "where",
            "with",
            "yield",
          ]),
          built_in: [
            "bool",
            "byte",
            "char",
            "decimal",
            "delegate",
            "double",
            "dynamic",
            "enum",
            "float",
            "int",
            "long",
            "nint",
            "nuint",
            "object",
            "sbyte",
            "short",
            "string",
            "ulong",
            "uint",
            "ushort",
          ],
          literal: ["default", "false", "null", "true"],
        },
        t = e.inherit(e.TITLE_MODE, {
          begin: "[a-zA-Z](\\.?\\w)*",
        }),
        a = {
          className: "number",
          variants: [
            {
              begin: "\\b(0b[01']+)",
            },
            {
              begin:
                "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)",
            },
            {
              begin:
                "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)",
            },
          ],
          relevance: 0,
        },
        i = {
          className: "string",
          begin: '@"',
          end: '"',
          contains: [{ begin: '""' }],
        },
        r = e.inherit(i, { illegal: /\n/ }),
        s = { className: "subst", begin: /\{/, end: /\}/, keywords: n },
        o = e.inherit(s, { illegal: /\n/ }),
        l = {
          className: "string",
          begin: /\$"/,
          end: '"',
          illegal: /\n/,
          contains: [
            { begin: /\{\{/ },
            { begin: /\}\}/ },
            e.BACKSLASH_ESCAPE,
            o,
          ],
        },
        c = {
          className: "string",
          begin: /\$@"/,
          end: '"',
          contains: [
            {
              begin: /\{\{/,
            },
            { begin: /\}\}/ },
            { begin: '""' },
            s,
          ],
        },
        d = e.inherit(c, {
          illegal: /\n/,
          contains: [{ begin: /\{\{/ }, { begin: /\}\}/ }, { begin: '""' }, o],
        })
      ;((s.contains = [
        c,
        l,
        i,
        e.APOS_STRING_MODE,
        e.QUOTE_STRING_MODE,
        a,
        e.C_BLOCK_COMMENT_MODE,
      ]),
        (o.contains = [
          d,
          l,
          r,
          e.APOS_STRING_MODE,
          e.QUOTE_STRING_MODE,
          a,
          e.inherit(e.C_BLOCK_COMMENT_MODE, {
            illegal: /\n/,
          }),
        ]))
      const g = {
          variants: [c, l, i, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE],
        },
        u = {
          begin: "<",
          end: ">",
          contains: [{ beginKeywords: "in out" }, t],
        },
        b =
          e.IDENT_RE +
          "(<" +
          e.IDENT_RE +
          "(\\s*,\\s*" +
          e.IDENT_RE +
          ")*>)?(\\[\\])?",
        m = {
          begin: "@" + e.IDENT_RE,
          relevance: 0,
        }
      return {
        name: "C#",
        aliases: ["cs", "c#"],
        keywords: n,
        illegal: /::/,
        contains: [
          e.COMMENT("///", "$", {
            returnBegin: !0,
            contains: [
              {
                className: "doctag",
                variants: [
                  { begin: "///", relevance: 0 },
                  {
                    begin: "\x3c!--|--\x3e",
                  },
                  { begin: "</?", end: ">" },
                ],
              },
            ],
          }),
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          {
            className: "meta",
            begin: "#",
            end: "$",
            keywords: {
              keyword:
                "if else elif endif define undef warning error line region endregion pragma checksum",
            },
          },
          g,
          a,
          {
            beginKeywords: "class interface",
            relevance: 0,
            end: /[{;=]/,
            illegal: /[^\s:,]/,
            contains: [
              { beginKeywords: "where class" },
              t,
              u,
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          {
            beginKeywords: "namespace",
            relevance: 0,
            end: /[{;=]/,
            illegal: /[^\s:]/,
            contains: [t, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
          },
          {
            beginKeywords: "record",
            relevance: 0,
            end: /[{;=]/,
            illegal: /[^\s:]/,
            contains: [t, u, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
          },
          {
            className: "meta",
            begin: "^\\s*\\[(?=[\\w])",
            excludeBegin: !0,
            end: "\\]",
            excludeEnd: !0,
            contains: [
              {
                className: "string",
                begin: /"/,
                end: /"/,
              },
            ],
          },
          {
            beginKeywords: "new return throw await else",
            relevance: 0,
          },
          {
            className: "function",
            begin: "(" + b + "\\s+)+" + e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
            returnBegin: !0,
            end: /\s*[{;=]/,
            excludeEnd: !0,
            keywords: n,
            contains: [
              {
                beginKeywords:
                  "public private protected static internal protected abstract async extern override unsafe virtual new sealed partial",
                relevance: 0,
              },
              {
                begin: e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
                returnBegin: !0,
                contains: [e.TITLE_MODE, u],
                relevance: 0,
              },
              { match: /\(\)/ },
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                excludeBegin: !0,
                excludeEnd: !0,
                keywords: n,
                relevance: 0,
                contains: [g, a, e.C_BLOCK_COMMENT_MODE],
              },
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          m,
        ],
      }
    },
    grmr_css: (e) => {
      const n = e.regex,
        t = te(e),
        a = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
      return {
        name: "CSS",
        case_insensitive: !0,
        illegal: /[=|'\$]/,
        keywords: {
          keyframePosition: "from to",
        },
        classNameAliases: { keyframePosition: "selector-tag" },
        contains: [
          t.BLOCK_COMMENT,
          { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ },
          t.CSS_NUMBER_MODE,
          { className: "selector-id", begin: /#[A-Za-z0-9_-]+/, relevance: 0 },
          {
            className: "selector-class",
            begin: "\\.[a-zA-Z-][a-zA-Z0-9_-]*",
            relevance: 0,
          },
          t.ATTRIBUTE_SELECTOR_MODE,
          {
            className: "selector-pseudo",
            variants: [
              {
                begin: ":(" + re.join("|") + ")",
              },
              { begin: ":(:)?(" + se.join("|") + ")" },
            ],
          },
          t.CSS_VARIABLE,
          { className: "attribute", begin: "\\b(" + oe.join("|") + ")\\b" },
          {
            begin: /:/,
            end: /[;}{]/,
            contains: [
              t.BLOCK_COMMENT,
              t.HEXCOLOR,
              t.IMPORTANT,
              t.CSS_NUMBER_MODE,
              ...a,
              {
                begin: /(url|data-uri)\(/,
                end: /\)/,
                relevance: 0,
                keywords: { built_in: "url data-uri" },
                contains: [
                  {
                    className: "string",
                    begin: /[^)]/,
                    endsWithParent: !0,
                    excludeEnd: !0,
                  },
                ],
              },
              t.FUNCTION_DISPATCH,
            ],
          },
          {
            begin: n.lookahead(/@/),
            end: "[{;]",
            relevance: 0,
            illegal: /:/,
            contains: [
              { className: "keyword", begin: /@-?\w[\w]*(-\w+)*/ },
              {
                begin: /\s/,
                endsWithParent: !0,
                excludeEnd: !0,
                relevance: 0,
                keywords: {
                  $pattern: /[a-z-]+/,
                  keyword: "and or not only",
                  attribute: ie.join(" "),
                },
                contains: [
                  {
                    begin: /[a-z-]+(?=:)/,
                    className: "attribute",
                  },
                  ...a,
                  t.CSS_NUMBER_MODE,
                ],
              },
            ],
          },
          {
            className: "selector-tag",
            begin: "\\b(" + ae.join("|") + ")\\b",
          },
        ],
      }
    },
    grmr_diff: (e) => {
      const n = e.regex
      return {
        name: "Diff",
        aliases: ["patch"],
        contains: [
          {
            className: "meta",
            relevance: 10,
            match: n.either(
              /^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,
              /^\*\*\* +\d+,\d+ +\*\*\*\*$/,
              /^--- +\d+,\d+ +----$/,
            ),
          },
          {
            className: "comment",
            variants: [
              {
                begin: n.either(
                  /Index: /,
                  /^index/,
                  /={3,}/,
                  /^-{3}/,
                  /^\*{3} /,
                  /^\+{3}/,
                  /^diff --git/,
                ),
                end: /$/,
              },
              { match: /^\*{15}$/ },
            ],
          },
          { className: "addition", begin: /^\+/, end: /$/ },
          {
            className: "deletion",
            begin: /^-/,
            end: /$/,
          },
          { className: "addition", begin: /^!/, end: /$/ },
        ],
      }
    },
    grmr_go: (e) => {
      const n = {
        keyword: [
          "break",
          "case",
          "chan",
          "const",
          "continue",
          "default",
          "defer",
          "else",
          "fallthrough",
          "for",
          "func",
          "go",
          "goto",
          "if",
          "import",
          "interface",
          "map",
          "package",
          "range",
          "return",
          "select",
          "struct",
          "switch",
          "type",
          "var",
        ],
        type: [
          "bool",
          "byte",
          "complex64",
          "complex128",
          "error",
          "float32",
          "float64",
          "int8",
          "int16",
          "int32",
          "int64",
          "string",
          "uint8",
          "uint16",
          "uint32",
          "uint64",
          "int",
          "uint",
          "uintptr",
          "rune",
        ],
        literal: ["true", "false", "iota", "nil"],
        built_in: [
          "append",
          "cap",
          "close",
          "complex",
          "copy",
          "imag",
          "len",
          "make",
          "new",
          "panic",
          "print",
          "println",
          "real",
          "recover",
          "delete",
        ],
      }
      return {
        name: "Go",
        aliases: ["golang"],
        keywords: n,
        illegal: "</",
        contains: [
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          {
            className: "string",
            variants: [
              e.QUOTE_STRING_MODE,
              e.APOS_STRING_MODE,
              { begin: "`", end: "`" },
            ],
          },
          {
            className: "number",
            variants: [
              { begin: e.C_NUMBER_RE + "[i]", relevance: 1 },
              e.C_NUMBER_MODE,
            ],
          },
          { begin: /:=/ },
          {
            className: "function",
            beginKeywords: "func",
            end: "\\s*(\\{|$)",
            excludeEnd: !0,
            contains: [
              e.TITLE_MODE,
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                endsParent: !0,
                keywords: n,
                illegal: /["']/,
              },
            ],
          },
        ],
      }
    },
    grmr_ini: (e) => {
      const n = e.regex,
        t = {
          className: "number",
          relevance: 0,
          variants: [
            {
              begin: /([+-]+)?[\d]+_[\d_]+/,
            },
            { begin: e.NUMBER_RE },
          ],
        },
        a = e.COMMENT()
      a.variants = [
        {
          begin: /;/,
          end: /$/,
        },
        { begin: /#/, end: /$/ },
      ]
      const i = {
          className: "variable",
          variants: [{ begin: /\$[\w\d"][\w\d_]*/ }, { begin: /\$\{(.*?)\}/ }],
        },
        r = {
          className: "literal",
          begin: /\bon|off|true|false|yes|no\b/,
        },
        s = {
          className: "string",
          contains: [e.BACKSLASH_ESCAPE],
          variants: [
            { begin: "'''", end: "'''", relevance: 10 },
            {
              begin: '"""',
              end: '"""',
              relevance: 10,
            },
            { begin: '"', end: '"' },
            { begin: "'", end: "'" },
          ],
        },
        o = {
          begin: /\[/,
          end: /\]/,
          contains: [a, r, i, s, t, "self"],
          relevance: 0,
        },
        l = n.either(/[A-Za-z0-9_-]+/, /"(\\"|[^"])*"/, /'[^']*'/)
      return {
        name: "TOML, also INI",
        aliases: ["toml"],
        case_insensitive: !0,
        illegal: /\S/,
        contains: [
          a,
          { className: "section", begin: /\[+/, end: /\]+/ },
          {
            begin: n.concat(
              l,
              "(\\s*\\.\\s*",
              l,
              ")*",
              n.lookahead(/\s*=\s*[^#\s]/),
            ),
            className: "attr",
            starts: { end: /$/, contains: [a, o, r, i, s, t] },
          },
        ],
      }
    },
    grmr_java: (e) => {
      e.regex
      const n = "[\xc0-\u02b8a-zA-Z_$][\xc0-\u02b8a-zA-Z_$0-9]*",
        t = n + ue("(?:<" + n + "~~~(?:\\s*,\\s*" + n + "~~~)*>)?", /~~~/g, 2),
        a = {
          keyword: [
            "synchronized",
            "abstract",
            "private",
            "var",
            "static",
            "if",
            "const ",
            "for",
            "while",
            "strictfp",
            "finally",
            "protected",
            "import",
            "native",
            "final",
            "void",
            "enum",
            "else",
            "break",
            "transient",
            "catch",
            "instanceof",
            "volatile",
            "case",
            "assert",
            "package",
            "default",
            "public",
            "try",
            "switch",
            "continue",
            "throws",
            "protected",
            "public",
            "private",
            "module",
            "requires",
            "exports",
            "do",
            "sealed",
          ],
          literal: ["false", "true", "null"],
          type: [
            "char",
            "boolean",
            "long",
            "float",
            "int",
            "byte",
            "short",
            "double",
          ],
          built_in: ["super", "this"],
        },
        i = {
          className: "meta",
          begin: "@" + n,
          contains: [
            {
              begin: /\(/,
              end: /\)/,
              contains: ["self"],
            },
          ],
        },
        r = {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: a,
          relevance: 0,
          contains: [e.C_BLOCK_COMMENT_MODE],
          endsParent: !0,
        }
      return {
        name: "Java",
        aliases: ["jsp"],
        keywords: a,
        illegal: /<\/|#/,
        contains: [
          e.COMMENT("/\\*\\*", "\\*/", {
            relevance: 0,
            contains: [
              { begin: /\w+@/, relevance: 0 },
              { className: "doctag", begin: "@[A-Za-z]+" },
            ],
          }),
          {
            begin: /import java\.[a-z]+\./,
            keywords: "import",
            relevance: 2,
          },
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          {
            begin: /"""/,
            end: /"""/,
            className: "string",
            contains: [e.BACKSLASH_ESCAPE],
          },
          e.APOS_STRING_MODE,
          e.QUOTE_STRING_MODE,
          {
            match: [
              /\b(?:class|interface|enum|extends|implements|new)/,
              /\s+/,
              n,
            ],
            className: {
              1: "keyword",
              3: "title.class",
            },
          },
          { match: /non-sealed/, scope: "keyword" },
          {
            begin: [n, /\s+/, n, /\s+/, /=/],
            className: { 1: "type", 3: "variable", 5: "operator" },
          },
          {
            begin: [/record/, /\s+/, n],
            className: { 1: "keyword", 3: "title.class" },
            contains: [r, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
          },
          {
            beginKeywords: "new throw return else",
            relevance: 0,
          },
          {
            begin: ["(?:" + t + "\\s+)", e.UNDERSCORE_IDENT_RE, /\s*(?=\()/],
            className: {
              2: "title.function",
            },
            keywords: a,
            contains: [
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                keywords: a,
                relevance: 0,
                contains: [
                  i,
                  e.APOS_STRING_MODE,
                  e.QUOTE_STRING_MODE,
                  ge,
                  e.C_BLOCK_COMMENT_MODE,
                ],
              },
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          ge,
          i,
        ],
      }
    },
    grmr_javascript: Ne,
    grmr_json: (e) => ({
      name: "JSON",
      contains: [
        {
          className: "attr",
          begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
          relevance: 1.01,
        },
        { match: /[{}[\],:]/, className: "punctuation", relevance: 0 },
        e.QUOTE_STRING_MODE,
        {
          beginKeywords: "true false null",
        },
        e.C_NUMBER_MODE,
        e.C_LINE_COMMENT_MODE,
        e.C_BLOCK_COMMENT_MODE,
      ],
      illegal: "\\S",
    }),
    grmr_kotlin: (e) => {
      const n = {
          keyword:
            "abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",
          built_in:
            "Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
          literal: "true false null",
        },
        t = { className: "symbol", begin: e.UNDERSCORE_IDENT_RE + "@" },
        a = {
          className: "subst",
          begin: /\$\{/,
          end: /\}/,
          contains: [e.C_NUMBER_MODE],
        },
        i = {
          className: "variable",
          begin: "\\$" + e.UNDERSCORE_IDENT_RE,
        },
        r = {
          className: "string",
          variants: [
            { begin: '"""', end: '"""(?=[^"])', contains: [i, a] },
            {
              begin: "'",
              end: "'",
              illegal: /\n/,
              contains: [e.BACKSLASH_ESCAPE],
            },
            {
              begin: '"',
              end: '"',
              illegal: /\n/,
              contains: [e.BACKSLASH_ESCAPE, i, a],
            },
          ],
        }
      a.contains.push(r)
      const s = {
          className: "meta",
          begin:
            "@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*" +
            e.UNDERSCORE_IDENT_RE +
            ")?",
        },
        o = {
          className: "meta",
          begin: "@" + e.UNDERSCORE_IDENT_RE,
          contains: [
            {
              begin: /\(/,
              end: /\)/,
              contains: [e.inherit(r, { className: "string" })],
            },
          ],
        },
        l = ge,
        c = e.COMMENT("/\\*", "\\*/", { contains: [e.C_BLOCK_COMMENT_MODE] }),
        d = {
          variants: [
            { className: "type", begin: e.UNDERSCORE_IDENT_RE },
            { begin: /\(/, end: /\)/, contains: [] },
          ],
        },
        g = d
      return (
        (g.variants[1].contains = [d]),
        (d.variants[1].contains = [g]),
        {
          name: "Kotlin",
          aliases: ["kt", "kts"],
          keywords: n,
          contains: [
            e.COMMENT("/\\*\\*", "\\*/", {
              relevance: 0,
              contains: [{ className: "doctag", begin: "@[A-Za-z]+" }],
            }),
            e.C_LINE_COMMENT_MODE,
            c,
            {
              className: "keyword",
              begin: /\b(break|continue|return|this)\b/,
              starts: { contains: [{ className: "symbol", begin: /@\w+/ }] },
            },
            t,
            s,
            o,
            {
              className: "function",
              beginKeywords: "fun",
              end: "[(]|$",
              returnBegin: !0,
              excludeEnd: !0,
              keywords: n,
              relevance: 5,
              contains: [
                {
                  begin: e.UNDERSCORE_IDENT_RE + "\\s*\\(",
                  returnBegin: !0,
                  relevance: 0,
                  contains: [e.UNDERSCORE_TITLE_MODE],
                },
                {
                  className: "type",
                  begin: /</,
                  end: />/,
                  keywords: "reified",
                  relevance: 0,
                },
                {
                  className: "params",
                  begin: /\(/,
                  end: /\)/,
                  endsParent: !0,
                  keywords: n,
                  relevance: 0,
                  contains: [
                    {
                      begin: /:/,
                      end: /[=,\/]/,
                      endsWithParent: !0,
                      contains: [d, e.C_LINE_COMMENT_MODE, c],
                      relevance: 0,
                    },
                    e.C_LINE_COMMENT_MODE,
                    c,
                    s,
                    o,
                    r,
                    e.C_NUMBER_MODE,
                  ],
                },
                c,
              ],
            },
            {
              className: "class",
              beginKeywords: "class interface trait",
              end: /[:\{(]|$/,
              excludeEnd: !0,
              illegal: "extends implements",
              contains: [
                {
                  beginKeywords:
                    "public protected internal private constructor",
                },
                e.UNDERSCORE_TITLE_MODE,
                {
                  className: "type",
                  begin: /</,
                  end: />/,
                  excludeBegin: !0,
                  excludeEnd: !0,
                  relevance: 0,
                },
                {
                  className: "type",
                  begin: /[,:]\s*/,
                  end: /[<\(,]|$/,
                  excludeBegin: !0,
                  returnEnd: !0,
                },
                s,
                o,
              ],
            },
            r,
            {
              className: "meta",
              begin: "^#!/usr/bin/env",
              end: "$",
              illegal: "\n",
            },
            l,
          ],
        }
      )
    },
    grmr_less: (e) => {
      const n = te(e),
        t = le,
        a = "([\\w-]+|@\\{[\\w-]+\\})",
        i = [],
        r = [],
        s = (e) => ({
          className: "string",
          begin: "~?" + e + ".*?" + e,
        }),
        o = (e, n, t) => ({ className: e, begin: n, relevance: t }),
        l = {
          $pattern: /[a-z-]+/,
          keyword: "and or not only",
          attribute: ie.join(" "),
        },
        c = { begin: "\\(", end: "\\)", contains: r, keywords: l, relevance: 0 }
      r.push(
        e.C_LINE_COMMENT_MODE,
        e.C_BLOCK_COMMENT_MODE,
        s("'"),
        s('"'),
        n.CSS_NUMBER_MODE,
        {
          begin: "(url|data-uri)\\(",
          starts: { className: "string", end: "[\\)\\n]", excludeEnd: !0 },
        },
        n.HEXCOLOR,
        c,
        o("variable", "@@?[\\w-]+", 10),
        o("variable", "@\\{[\\w-]+\\}"),
        o("built_in", "~?`[^`]*?`"),
        {
          className: "attribute",
          begin: "[\\w-]+\\s*:",
          end: ":",
          returnBegin: !0,
          excludeEnd: !0,
        },
        n.IMPORTANT,
      )
      const d = r.concat({ begin: /\{/, end: /\}/, contains: i }),
        g = {
          beginKeywords: "when",
          endsWithParent: !0,
          contains: [{ beginKeywords: "and not" }].concat(r),
        },
        u = {
          begin: a + "\\s*:",
          returnBegin: !0,
          end: /[;}]/,
          relevance: 0,
          contains: [
            { begin: /-(webkit|moz|ms|o)-/ },
            n.CSS_VARIABLE,
            {
              className: "attribute",
              begin: "\\b(" + oe.join("|") + ")\\b",
              end: /(?=:)/,
              starts: {
                endsWithParent: !0,
                illegal: "[<=$]",
                relevance: 0,
                contains: r,
              },
            },
          ],
        },
        b = {
          className: "keyword",
          begin:
            "@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",
          starts: {
            end: "[;{}]",
            keywords: l,
            returnEnd: !0,
            contains: r,
            relevance: 0,
          },
        },
        m = {
          className: "variable",
          variants: [
            { begin: "@[\\w-]+\\s*:", relevance: 15 },
            {
              begin: "@[\\w-]+",
            },
          ],
          starts: { end: "[;}]", returnEnd: !0, contains: d },
        },
        p = {
          variants: [
            {
              begin: "[\\.#:&\\[>]",
              end: "[;{}]",
            },
            { begin: a, end: /\{/ },
          ],
          returnBegin: !0,
          returnEnd: !0,
          illegal: "[<='$\"]",
          relevance: 0,
          contains: [
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            g,
            o("keyword", "all\\b"),
            o("variable", "@\\{[\\w-]+\\}"),
            {
              begin: "\\b(" + ae.join("|") + ")\\b",
              className: "selector-tag",
            },
            n.CSS_NUMBER_MODE,
            o("selector-tag", a, 0),
            o("selector-id", "#" + a),
            o("selector-class", "\\." + a, 0),
            o("selector-tag", "&", 0),
            n.ATTRIBUTE_SELECTOR_MODE,
            {
              className: "selector-pseudo",
              begin: ":(" + re.join("|") + ")",
            },
            {
              className: "selector-pseudo",
              begin: ":(:)?(" + se.join("|") + ")",
            },
            { begin: /\(/, end: /\)/, relevance: 0, contains: d },
            { begin: "!important" },
            n.FUNCTION_DISPATCH,
          ],
        },
        _ = {
          begin: `[\\w-]+:(:)?(${t.join("|")})`,
          returnBegin: !0,
          contains: [p],
        }
      return (
        i.push(e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, b, m, _, u, p),
        {
          name: "Less",
          case_insensitive: !0,
          illegal: "[=>'/<($\"]",
          contains: i,
        }
      )
    },
    grmr_lua: (e) => {
      const n = "\\[=*\\[",
        t = "\\]=*\\]",
        a = { begin: n, end: t, contains: ["self"] },
        i = [
          e.COMMENT("--(?!\\[=*\\[)", "$"),
          e.COMMENT("--\\[=*\\[", t, { contains: [a], relevance: 10 }),
        ]
      return {
        name: "Lua",
        keywords: {
          $pattern: e.UNDERSCORE_IDENT_RE,
          literal: "true false nil",
          keyword:
            "and break do else elseif end for goto if in local not or repeat return then until while",
          built_in:
            "_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove",
        },
        contains: i.concat([
          {
            className: "function",
            beginKeywords: "function",
            end: "\\)",
            contains: [
              e.inherit(e.TITLE_MODE, {
                begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*",
              }),
              {
                className: "params",
                begin: "\\(",
                endsWithParent: !0,
                contains: i,
              },
            ].concat(i),
          },
          e.C_NUMBER_MODE,
          e.APOS_STRING_MODE,
          e.QUOTE_STRING_MODE,
          {
            className: "string",
            begin: n,
            end: t,
            contains: [a],
            relevance: 5,
          },
        ]),
      }
    },
    grmr_makefile: (e) => {
      const n = {
          className: "variable",
          variants: [
            {
              begin: "\\$\\(" + e.UNDERSCORE_IDENT_RE + "\\)",
              contains: [e.BACKSLASH_ESCAPE],
            },
            { begin: /\$[@%<?\^\+\*]/ },
          ],
        },
        t = {
          className: "string",
          begin: /"/,
          end: /"/,
          contains: [e.BACKSLASH_ESCAPE, n],
        },
        a = {
          className: "variable",
          begin: /\$\([\w-]+\s/,
          end: /\)/,
          keywords: {
            built_in:
              "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value",
          },
          contains: [n],
        },
        i = { begin: "^" + e.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)" },
        r = {
          className: "section",
          begin: /^[^\s]+:/,
          end: /$/,
          contains: [n],
        }
      return {
        name: "Makefile",
        aliases: ["mk", "mak", "make"],
        keywords: {
          $pattern: /[\w-]+/,
          keyword:
            "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath",
        },
        contains: [
          e.HASH_COMMENT_MODE,
          n,
          t,
          a,
          i,
          {
            className: "meta",
            begin: /^\.PHONY:/,
            end: /$/,
            keywords: { $pattern: /[\.\w]+/, keyword: ".PHONY" },
          },
          r,
        ],
      }
    },
    grmr_xml: (e) => {
      const n = e.regex,
        t = n.concat(/[A-Z_]/, n.optional(/[A-Z0-9_.-]*:/), /[A-Z0-9_.-]*/),
        a = {
          className: "symbol",
          begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/,
        },
        i = {
          begin: /\s/,
          contains: [
            {
              className: "keyword",
              begin: /#?[a-z_][a-z1-9_-]+/,
              illegal: /\n/,
            },
          ],
        },
        r = e.inherit(i, { begin: /\(/, end: /\)/ }),
        s = e.inherit(e.APOS_STRING_MODE, {
          className: "string",
        }),
        o = e.inherit(e.QUOTE_STRING_MODE, { className: "string" }),
        l = {
          endsWithParent: !0,
          illegal: /</,
          relevance: 0,
          contains: [
            { className: "attr", begin: /[A-Za-z0-9._:-]+/, relevance: 0 },
            {
              begin: /=\s*/,
              relevance: 0,
              contains: [
                {
                  className: "string",
                  endsParent: !0,
                  variants: [
                    { begin: /"/, end: /"/, contains: [a] },
                    {
                      begin: /'/,
                      end: /'/,
                      contains: [a],
                    },
                    { begin: /[^\s"'=<>`]+/ },
                  ],
                },
              ],
            },
          ],
        }
      return {
        name: "HTML, XML",
        aliases: [
          "html",
          "xhtml",
          "rss",
          "atom",
          "xjb",
          "xsd",
          "xsl",
          "plist",
          "wsf",
          "svg",
        ],
        case_insensitive: !0,
        contains: [
          {
            className: "meta",
            begin: /<![a-z]/,
            end: />/,
            relevance: 10,
            contains: [
              i,
              o,
              s,
              r,
              {
                begin: /\[/,
                end: /\]/,
                contains: [
                  {
                    className: "meta",
                    begin: /<![a-z]/,
                    end: />/,
                    contains: [i, r, o, s],
                  },
                ],
              },
            ],
          },
          e.COMMENT(/<!--/, /-->/, {
            relevance: 10,
          }),
          { begin: /<!\[CDATA\[/, end: /\]\]>/, relevance: 10 },
          a,
          {
            className: "meta",
            begin: /<\?xml/,
            end: /\?>/,
            relevance: 10,
          },
          {
            className: "tag",
            begin: /<style(?=\s|>)/,
            end: />/,
            keywords: { name: "style" },
            contains: [l],
            starts: {
              end: /<\/style>/,
              returnEnd: !0,
              subLanguage: ["css", "xml"],
            },
          },
          {
            className: "tag",
            begin: /<script(?=\s|>)/,
            end: />/,
            keywords: { name: "script" },
            contains: [l],
            starts: {
              end: /<\/script>/,
              returnEnd: !0,
              subLanguage: ["javascript", "handlebars", "xml"],
            },
          },
          {
            className: "tag",
            begin: /<>|<\/>/,
          },
          {
            className: "tag",
            begin: n.concat(
              /</,
              n.lookahead(n.concat(t, n.either(/\/>/, />/, /\s/))),
            ),
            end: /\/?>/,
            contains: [
              { className: "name", begin: t, relevance: 0, starts: l },
            ],
          },
          {
            className: "tag",
            begin: n.concat(/<\//, n.lookahead(n.concat(t, />/))),
            contains: [
              {
                className: "name",
                begin: t,
                relevance: 0,
              },
              { begin: />/, relevance: 0, endsParent: !0 },
            ],
          },
        ],
      }
    },
    grmr_markdown: (e) => {
      const n = {
          begin: /<\/?[A-Za-z_]/,
          end: ">",
          subLanguage: "xml",
          relevance: 0,
        },
        t = {
          variants: [
            { begin: /\[.+?\]\[.*?\]/, relevance: 0 },
            {
              begin:
                /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
              relevance: 2,
            },
            {
              begin: e.regex.concat(
                /\[.+?\]\(/,
                /[A-Za-z][A-Za-z0-9+.-]*/,
                /:\/\/.*?\)/,
              ),
              relevance: 2,
            },
            { begin: /\[.+?\]\([./?&#].*?\)/, relevance: 1 },
            {
              begin: /\[.*?\]\(.*?\)/,
              relevance: 0,
            },
          ],
          returnBegin: !0,
          contains: [
            { match: /\[(?=\])/ },
            {
              className: "string",
              relevance: 0,
              begin: "\\[",
              end: "\\]",
              excludeBegin: !0,
              returnEnd: !0,
            },
            {
              className: "link",
              relevance: 0,
              begin: "\\]\\(",
              end: "\\)",
              excludeBegin: !0,
              excludeEnd: !0,
            },
            {
              className: "symbol",
              relevance: 0,
              begin: "\\]\\[",
              end: "\\]",
              excludeBegin: !0,
              excludeEnd: !0,
            },
          ],
        },
        a = {
          className: "strong",
          contains: [],
          variants: [
            { begin: /_{2}/, end: /_{2}/ },
            { begin: /\*{2}/, end: /\*{2}/ },
          ],
        },
        i = {
          className: "emphasis",
          contains: [],
          variants: [
            { begin: /\*(?!\*)/, end: /\*/ },
            {
              begin: /_(?!_)/,
              end: /_/,
              relevance: 0,
            },
          ],
        }
      ;(a.contains.push(i), i.contains.push(a))
      let r = [n, t]
      return (
        (a.contains = a.contains.concat(r)),
        (i.contains = i.contains.concat(r)),
        (r = r.concat(a, i)),
        {
          name: "Markdown",
          aliases: ["md", "mkdown", "mkd"],
          contains: [
            {
              className: "section",
              variants: [
                { begin: "^#{1,6}", end: "$", contains: r },
                {
                  begin: "(?=^.+?\\n[=-]{2,}$)",
                  contains: [
                    { begin: "^[=-]*$" },
                    { begin: "^", end: "\\n", contains: r },
                  ],
                },
              ],
            },
            n,
            {
              className: "bullet",
              begin: "^[ \t]*([*+-]|(\\d+\\.))(?=\\s+)",
              end: "\\s+",
              excludeEnd: !0,
            },
            a,
            i,
            { className: "quote", begin: "^>\\s+", contains: r, end: "$" },
            {
              className: "code",
              variants: [
                { begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" },
                {
                  begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*",
                },
                { begin: "```", end: "```+[ ]*$" },
                {
                  begin: "~~~",
                  end: "~~~+[ ]*$",
                },
                { begin: "`.+?`" },
                {
                  begin: "(?=^( {4}|\\t))",
                  contains: [{ begin: "^( {4}|\\t)", end: "(\\n)$" }],
                  relevance: 0,
                },
              ],
            },
            {
              begin: "^[-\\*]{3,}",
              end: "$",
            },
            t,
            {
              begin: /^\[[^\n]+\]:/,
              returnBegin: !0,
              contains: [
                {
                  className: "symbol",
                  begin: /\[/,
                  end: /\]/,
                  excludeBegin: !0,
                  excludeEnd: !0,
                },
                {
                  className: "link",
                  begin: /:\s*/,
                  end: /$/,
                  excludeBegin: !0,
                },
              ],
            },
          ],
        }
      )
    },
    grmr_objectivec: (e) => {
      const n = /[a-zA-Z@][a-zA-Z0-9_]*/,
        t = {
          $pattern: n,
          keyword: ["@interface", "@class", "@protocol", "@implementation"],
        }
      return {
        name: "Objective-C",
        aliases: ["mm", "objc", "obj-c", "obj-c++", "objective-c++"],
        keywords: {
          $pattern: n,
          keyword: [
            "int",
            "float",
            "while",
            "char",
            "export",
            "sizeof",
            "typedef",
            "const",
            "struct",
            "for",
            "union",
            "unsigned",
            "long",
            "volatile",
            "static",
            "bool",
            "mutable",
            "if",
            "do",
            "return",
            "goto",
            "void",
            "enum",
            "else",
            "break",
            "extern",
            "asm",
            "case",
            "short",
            "default",
            "double",
            "register",
            "explicit",
            "signed",
            "typename",
            "this",
            "switch",
            "continue",
            "wchar_t",
            "inline",
            "readonly",
            "assign",
            "readwrite",
            "self",
            "@synchronized",
            "id",
            "typeof",
            "nonatomic",
            "super",
            "unichar",
            "IBOutlet",
            "IBAction",
            "strong",
            "weak",
            "copy",
            "in",
            "out",
            "inout",
            "bycopy",
            "byref",
            "oneway",
            "__strong",
            "__weak",
            "__block",
            "__autoreleasing",
            "@private",
            "@protected",
            "@public",
            "@try",
            "@property",
            "@end",
            "@throw",
            "@catch",
            "@finally",
            "@autoreleasepool",
            "@synthesize",
            "@dynamic",
            "@selector",
            "@optional",
            "@required",
            "@encode",
            "@package",
            "@import",
            "@defs",
            "@compatibility_alias",
            "__bridge",
            "__bridge_transfer",
            "__bridge_retained",
            "__bridge_retain",
            "__covariant",
            "__contravariant",
            "__kindof",
            "_Nonnull",
            "_Nullable",
            "_Null_unspecified",
            "__FUNCTION__",
            "__PRETTY_FUNCTION__",
            "__attribute__",
            "getter",
            "setter",
            "retain",
            "unsafe_unretained",
            "nonnull",
            "nullable",
            "null_unspecified",
            "null_resettable",
            "class",
            "instancetype",
            "NS_DESIGNATED_INITIALIZER",
            "NS_UNAVAILABLE",
            "NS_REQUIRES_SUPER",
            "NS_RETURNS_INNER_POINTER",
            "NS_INLINE",
            "NS_AVAILABLE",
            "NS_DEPRECATED",
            "NS_ENUM",
            "NS_OPTIONS",
            "NS_SWIFT_UNAVAILABLE",
            "NS_ASSUME_NONNULL_BEGIN",
            "NS_ASSUME_NONNULL_END",
            "NS_REFINED_FOR_SWIFT",
            "NS_SWIFT_NAME",
            "NS_SWIFT_NOTHROW",
            "NS_DURING",
            "NS_HANDLER",
            "NS_ENDHANDLER",
            "NS_VALUERETURN",
            "NS_VOIDRETURN",
          ],
          literal: [
            "false",
            "true",
            "FALSE",
            "TRUE",
            "nil",
            "YES",
            "NO",
            "NULL",
          ],
          built_in: [
            "BOOL",
            "dispatch_once_t",
            "dispatch_queue_t",
            "dispatch_sync",
            "dispatch_async",
            "dispatch_once",
          ],
        },
        illegal: "</",
        contains: [
          {
            className: "built_in",
            begin:
              "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+",
          },
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          e.C_NUMBER_MODE,
          e.QUOTE_STRING_MODE,
          e.APOS_STRING_MODE,
          {
            className: "string",
            variants: [
              {
                begin: '@"',
                end: '"',
                illegal: "\\n",
                contains: [e.BACKSLASH_ESCAPE],
              },
            ],
          },
          {
            className: "meta",
            begin: /#\s*[a-z]+\b/,
            end: /$/,
            keywords: {
              keyword:
                "if else elif endif define undef warning error line pragma ifdef ifndef include",
            },
            contains: [
              { begin: /\\\n/, relevance: 0 },
              e.inherit(e.QUOTE_STRING_MODE, {
                className: "string",
              }),
              { className: "string", begin: /<.*?>/, end: /$/, illegal: "\\n" },
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          {
            className: "class",
            begin: "(" + t.keyword.join("|") + ")\\b",
            end: /(\{|$)/,
            excludeEnd: !0,
            keywords: t,
            contains: [e.UNDERSCORE_TITLE_MODE],
          },
          { begin: "\\." + e.UNDERSCORE_IDENT_RE, relevance: 0 },
        ],
      }
    },
    grmr_perl: (e) => {
      const n = e.regex,
        t = /[dualxmsipngr]{0,12}/,
        a = {
          $pattern: /[\w.]+/,
          keyword:
            "abs accept alarm and atan2 bind binmode bless break caller chdir chmod chomp chop chown chr chroot close closedir connect continue cos crypt dbmclose dbmopen defined delete die do dump each else elsif endgrent endhostent endnetent endprotoent endpwent endservent eof eval exec exists exit exp fcntl fileno flock for foreach fork format formline getc getgrent getgrgid getgrnam gethostbyaddr gethostbyname gethostent getlogin getnetbyaddr getnetbyname getnetent getpeername getpgrp getpriority getprotobyname getprotobynumber getprotoent getpwent getpwnam getpwuid getservbyname getservbyport getservent getsockname getsockopt given glob gmtime goto grep gt hex if index int ioctl join keys kill last lc lcfirst length link listen local localtime log lstat lt ma map mkdir msgctl msgget msgrcv msgsnd my ne next no not oct open opendir or ord our pack package pipe pop pos print printf prototype push q|0 qq quotemeta qw qx rand read readdir readline readlink readpipe recv redo ref rename require reset return reverse rewinddir rindex rmdir say scalar seek seekdir select semctl semget semop send setgrent sethostent setnetent setpgrp setpriority setprotoent setpwent setservent setsockopt shift shmctl shmget shmread shmwrite shutdown sin sleep socket socketpair sort splice split sprintf sqrt srand stat state study sub substr symlink syscall sysopen sysread sysseek system syswrite tell telldir tie tied time times tr truncate uc ucfirst umask undef unless unlink unpack unshift untie until use utime values vec wait waitpid wantarray warn when while write x|0 xor y|0",
        },
        i = { className: "subst", begin: "[$@]\\{", end: "\\}", keywords: a },
        r = { begin: /->\{/, end: /\}/ },
        s = {
          variants: [
            { begin: /\$\d/ },
            {
              begin: n.concat(
                /[$%@](\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/,
                "(?![A-Za-z])(?![@$%])",
              ),
            },
            { begin: /[$%@][^\s\w{]/, relevance: 0 },
          ],
        },
        o = [e.BACKSLASH_ESCAPE, i, s],
        l = [/!/, /\//, /\|/, /\?/, /'/, /"/, /#/],
        c = (e, a, i = "\\1") => {
          const r = "\\1" === i ? i : n.concat(i, a)
          return n.concat(
            n.concat("(?:", e, ")"),
            a,
            /(?:\\.|[^\\\/])*?/,
            r,
            /(?:\\.|[^\\\/])*?/,
            i,
            t,
          )
        },
        d = (e, a, i) =>
          n.concat(n.concat("(?:", e, ")"), a, /(?:\\.|[^\\\/])*?/, i, t),
        g = [
          s,
          e.HASH_COMMENT_MODE,
          e.COMMENT(/^=\w/, /=cut/, {
            endsWithParent: !0,
          }),
          r,
          {
            className: "string",
            contains: o,
            variants: [
              {
                begin: "q[qwxr]?\\s*\\(",
                end: "\\)",
                relevance: 5,
              },
              { begin: "q[qwxr]?\\s*\\[", end: "\\]", relevance: 5 },
              { begin: "q[qwxr]?\\s*\\{", end: "\\}", relevance: 5 },
              {
                begin: "q[qwxr]?\\s*\\|",
                end: "\\|",
                relevance: 5,
              },
              { begin: "q[qwxr]?\\s*<", end: ">", relevance: 5 },
              { begin: "qw\\s+q", end: "q", relevance: 5 },
              { begin: "'", end: "'", contains: [e.BACKSLASH_ESCAPE] },
              { begin: '"', end: '"' },
              { begin: "`", end: "`", contains: [e.BACKSLASH_ESCAPE] },
              { begin: /\{\w+\}/, relevance: 0 },
              {
                begin: "-?\\w+\\s*=>",
                relevance: 0,
              },
            ],
          },
          {
            className: "number",
            begin:
              "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
            relevance: 0,
          },
          {
            begin:
              "(\\/\\/|" +
              e.RE_STARTERS_RE +
              "|\\b(split|return|print|reverse|grep)\\b)\\s*",
            keywords: "split return print reverse grep",
            relevance: 0,
            contains: [
              e.HASH_COMMENT_MODE,
              {
                className: "regexp",
                variants: [
                  {
                    begin: c("s|tr|y", n.either(...l, { capture: !0 })),
                  },
                  { begin: c("s|tr|y", "\\(", "\\)") },
                  {
                    begin: c("s|tr|y", "\\[", "\\]"),
                  },
                  { begin: c("s|tr|y", "\\{", "\\}") },
                ],
                relevance: 2,
              },
              {
                className: "regexp",
                variants: [
                  { begin: /(m|qr)\/\//, relevance: 0 },
                  {
                    begin: d("(?:m|qr)?", /\//, /\//),
                  },
                  { begin: d("m|qr", n.either(...l, { capture: !0 }), /\1/) },
                  { begin: d("m|qr", /\(/, /\)/) },
                  { begin: d("m|qr", /\[/, /\]/) },
                  {
                    begin: d("m|qr", /\{/, /\}/),
                  },
                ],
              },
            ],
          },
          {
            className: "function",
            beginKeywords: "sub",
            end: "(\\s*\\(.*?\\))?[;{]",
            excludeEnd: !0,
            relevance: 5,
            contains: [e.TITLE_MODE],
          },
          {
            begin: "-\\w\\b",
            relevance: 0,
          },
          {
            begin: "^__DATA__$",
            end: "^__END__$",
            subLanguage: "mojolicious",
            contains: [{ begin: "^@@.*", end: "$", className: "comment" }],
          },
        ]
      return (
        (i.contains = g),
        (r.contains = g),
        { name: "Perl", aliases: ["pl", "pm"], keywords: a, contains: g }
      )
    },
    grmr_php: (e) => {
      const n = e.regex,
        t = "[a-zA-Z0-9_\x7f-\xff]*(?![A-Za-z0-9])(?![$]))",
        a = n.concat("([a-zA-Z_\\x7f-\\xff]", t),
        i = n.concat("([A-Z]", t),
        r = {
          scope: "variable",
          match: "\\$+" + a,
        },
        s = {
          scope: "subst",
          variants: [
            { begin: /\$\w+/ },
            {
              begin: /\{\$/,
              end: /\}/,
            },
          ],
        },
        o = e.inherit(e.APOS_STRING_MODE, { illegal: null }),
        l = "[ \t\n]",
        c = {
          scope: "string",
          variants: [
            e.inherit(e.QUOTE_STRING_MODE, {
              illegal: null,
              contains: e.QUOTE_STRING_MODE.contains.concat(s),
            }),
            o,
            e.END_SAME_AS_BEGIN({
              begin: /<<<[ \t]*(\w+)\n/,
              end: /[ \t]*(\w+)\b/,
              contains: e.QUOTE_STRING_MODE.contains.concat(s),
            }),
          ],
        },
        d = {
          scope: "number",
          variants: [
            { begin: "\\b0[bB][01]+(?:_[01]+)*\\b" },
            {
              begin: "\\b0[oO][0-7]+(?:_[0-7]+)*\\b",
            },
            {
              begin: "\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b",
            },
            {
              begin:
                "(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?",
            },
          ],
          relevance: 0,
        },
        g = [
          "__CLASS__",
          "__DIR__",
          "__FILE__",
          "__FUNCTION__",
          "__COMPILER_HALT_OFFSET__",
          "__LINE__",
          "__METHOD__",
          "__NAMESPACE__",
          "__TRAIT__",
          "die",
          "echo",
          "exit",
          "include",
          "include_once",
          "print",
          "require",
          "require_once",
          "array",
          "abstract",
          "and",
          "as",
          "binary",
          "bool",
          "boolean",
          "break",
          "callable",
          "case",
          "catch",
          "class",
          "clone",
          "const",
          "continue",
          "declare",
          "default",
          "do",
          "double",
          "else",
          "elseif",
          "empty",
          "enddeclare",
          "endfor",
          "endforeach",
          "endif",
          "endswitch",
          "endwhile",
          "enum",
          "eval",
          "extends",
          "final",
          "finally",
          "float",
          "for",
          "foreach",
          "from",
          "global",
          "goto",
          "if",
          "implements",
          "instanceof",
          "insteadof",
          "int",
          "integer",
          "interface",
          "isset",
          "iterable",
          "list",
          "match|0",
          "mixed",
          "new",
          "never",
          "object",
          "or",
          "private",
          "protected",
          "public",
          "readonly",
          "real",
          "return",
          "string",
          "switch",
          "throw",
          "trait",
          "try",
          "unset",
          "use",
          "var",
          "void",
          "while",
          "xor",
          "yield",
        ],
        u = [
          "Error|0",
          "AppendIterator",
          "ArgumentCountError",
          "ArithmeticError",
          "ArrayIterator",
          "ArrayObject",
          "AssertionError",
          "BadFunctionCallException",
          "BadMethodCallException",
          "CachingIterator",
          "CallbackFilterIterator",
          "CompileError",
          "Countable",
          "DirectoryIterator",
          "DivisionByZeroError",
          "DomainException",
          "EmptyIterator",
          "ErrorException",
          "Exception",
          "FilesystemIterator",
          "FilterIterator",
          "GlobIterator",
          "InfiniteIterator",
          "InvalidArgumentException",
          "IteratorIterator",
          "LengthException",
          "LimitIterator",
          "LogicException",
          "MultipleIterator",
          "NoRewindIterator",
          "OutOfBoundsException",
          "OutOfRangeException",
          "OuterIterator",
          "OverflowException",
          "ParentIterator",
          "ParseError",
          "RangeException",
          "RecursiveArrayIterator",
          "RecursiveCachingIterator",
          "RecursiveCallbackFilterIterator",
          "RecursiveDirectoryIterator",
          "RecursiveFilterIterator",
          "RecursiveIterator",
          "RecursiveIteratorIterator",
          "RecursiveRegexIterator",
          "RecursiveTreeIterator",
          "RegexIterator",
          "RuntimeException",
          "SeekableIterator",
          "SplDoublyLinkedList",
          "SplFileInfo",
          "SplFileObject",
          "SplFixedArray",
          "SplHeap",
          "SplMaxHeap",
          "SplMinHeap",
          "SplObjectStorage",
          "SplObserver",
          "SplPriorityQueue",
          "SplQueue",
          "SplStack",
          "SplSubject",
          "SplTempFileObject",
          "TypeError",
          "UnderflowException",
          "UnexpectedValueException",
          "UnhandledMatchError",
          "ArrayAccess",
          "BackedEnum",
          "Closure",
          "Fiber",
          "Generator",
          "Iterator",
          "IteratorAggregate",
          "Serializable",
          "Stringable",
          "Throwable",
          "Traversable",
          "UnitEnum",
          "WeakReference",
          "WeakMap",
          "Directory",
          "__PHP_Incomplete_Class",
          "parent",
          "php_user_filter",
          "self",
          "static",
          "stdClass",
        ],
        b = {
          keyword: g,
          literal: ((e) => {
            const n = []
            return (
              ["false", "null", "true"].forEach((e) => {
                ;(n.push(e),
                  e.toLowerCase() === e
                    ? n.push(e.toUpperCase())
                    : n.push(e.toLowerCase()))
              }),
              n
            )
          })(),
          built_in: u,
        },
        m = (e) => e.map((e) => e.replace(/\|\d+$/, "")),
        p = {
          variants: [
            {
              match: [
                /new/,
                n.concat(l, "+"),
                n.concat("(?!", m(u).join("\\b|"), "\\b)"),
                n.concat(/\\?/, a),
                n.concat(l, "*", /\(/),
              ],
              scope: { 1: "keyword", 4: "title.class" },
            },
          ],
        },
        _ = {
          relevance: 0,
          match: [
            /\b/,
            n.concat(
              "(?!fn\\b|function\\b|",
              m(g).join("\\b|"),
              "|",
              m(u).join("\\b|"),
              "\\b)",
            ),
            a,
            n.concat(l, "*"),
            n.lookahead(/(?=\()/),
          ],
          scope: { 3: "title.function.invoke" },
        },
        h = n.concat(a, "\\b(?!\\()"),
        f = {
          variants: [
            {
              match: [n.concat(/::/, n.lookahead(/(?!class\b)/)), h],
              scope: { 2: "variable.constant" },
            },
            { match: [/::/, /class/], scope: { 2: "variable.language" } },
            {
              match: [i, n.concat("::", n.lookahead(/(?!class\b)/))],
              scope: { 1: "title.class" },
            },
            {
              match: [i, /::/, /class/],
              scope: { 1: "title.class", 3: "variable.language" },
            },
          ],
        }
      return {
        case_insensitive: !1,
        keywords: b,
        contains: [
          e.HASH_COMMENT_MODE,
          e.COMMENT("//", "$"),
          e.COMMENT("/\\*", "\\*/", {
            contains: [{ scope: "doctag", match: "@[A-Za-z]+" }],
          }),
          {
            match: /__halt_compiler\(\);/,
            keywords: "__halt_compiler",
            starts: {
              scope: "comment",
              end: e.MATCH_NOTHING_RE,
              contains: [{ match: /\?>/, scope: "meta", endsParent: !0 }],
            },
          },
          {
            scope: "meta",
            variants: [
              {
                begin: /<\?php/,
                relevance: 10,
              },
              { begin: /<\?[=]?/ },
              { begin: /\?>/ },
            ],
          },
          {
            scope: "variable.language",
            match: /\$this\b/,
          },
          r,
          _,
          f,
          {
            match: [/const/, /\s/, a, /\s*=/],
            scope: { 1: "keyword", 3: "variable.constant" },
          },
          p,
          {
            scope: "function",
            relevance: 0,
            beginKeywords: "fn function",
            end: /[;{]/,
            excludeEnd: !0,
            illegal: "[$%\\[]",
            contains: [
              { beginKeywords: "use" },
              e.UNDERSCORE_TITLE_MODE,
              { begin: "=>", endsParent: !0 },
              {
                scope: "params",
                begin: "\\(",
                end: "\\)",
                excludeBegin: !0,
                excludeEnd: !0,
                keywords: b,
                contains: ["self", r, f, e.C_BLOCK_COMMENT_MODE, c, d],
              },
            ],
          },
          {
            scope: "class",
            variants: [
              {
                beginKeywords: "enum",
                illegal: /[($"]/,
              },
              { beginKeywords: "class interface trait", illegal: /[:($"]/ },
            ],
            relevance: 0,
            end: /\{/,
            excludeEnd: !0,
            contains: [
              {
                beginKeywords: "extends implements",
              },
              e.UNDERSCORE_TITLE_MODE,
            ],
          },
          {
            beginKeywords: "namespace",
            relevance: 0,
            end: ";",
            illegal: /[.']/,
            contains: [
              e.inherit(e.UNDERSCORE_TITLE_MODE, { scope: "title.class" }),
            ],
          },
          {
            beginKeywords: "use",
            relevance: 0,
            end: ";",
            contains: [
              {
                match: /\b(as|const|function)\b/,
                scope: "keyword",
              },
              e.UNDERSCORE_TITLE_MODE,
            ],
          },
          c,
          d,
        ],
      }
    },
    grmr_php_template: (e) => ({
      name: "PHP template",
      subLanguage: "xml",
      contains: [
        {
          begin: /<\?(php|=)?/,
          end: /\?>/,
          subLanguage: "php",
          contains: [
            { begin: "/\\*", end: "\\*/", skip: !0 },
            { begin: 'b"', end: '"', skip: !0 },
            { begin: "b'", end: "'", skip: !0 },
            e.inherit(e.APOS_STRING_MODE, {
              illegal: null,
              className: null,
              contains: null,
              skip: !0,
            }),
            e.inherit(e.QUOTE_STRING_MODE, {
              illegal: null,
              className: null,
              contains: null,
              skip: !0,
            }),
          ],
        },
      ],
    }),
    grmr_plaintext: (e) => ({
      name: "Plain text",
      aliases: ["text", "txt"],
      disableAutodetect: !0,
    }),
    grmr_python: (e) => {
      const n = e.regex,
        t = /[\p{XID_Start}_]\p{XID_Continue}*/u,
        a = [
          "and",
          "as",
          "assert",
          "async",
          "await",
          "break",
          "class",
          "continue",
          "def",
          "del",
          "elif",
          "else",
          "except",
          "finally",
          "for",
          "from",
          "global",
          "if",
          "import",
          "in",
          "is",
          "lambda",
          "nonlocal|10",
          "not",
          "or",
          "pass",
          "raise",
          "return",
          "try",
          "while",
          "with",
          "yield",
        ],
        i = {
          $pattern: /[A-Za-z]\w+|__\w+__/,
          keyword: a,
          built_in: [
            "__import__",
            "abs",
            "all",
            "any",
            "ascii",
            "bin",
            "bool",
            "breakpoint",
            "bytearray",
            "bytes",
            "callable",
            "chr",
            "classmethod",
            "compile",
            "complex",
            "delattr",
            "dict",
            "dir",
            "divmod",
            "enumerate",
            "eval",
            "exec",
            "filter",
            "float",
            "format",
            "frozenset",
            "getattr",
            "globals",
            "hasattr",
            "hash",
            "help",
            "hex",
            "id",
            "input",
            "int",
            "isinstance",
            "issubclass",
            "iter",
            "len",
            "list",
            "locals",
            "map",
            "max",
            "memoryview",
            "min",
            "next",
            "object",
            "oct",
            "open",
            "ord",
            "pow",
            "print",
            "property",
            "range",
            "repr",
            "reversed",
            "round",
            "set",
            "setattr",
            "slice",
            "sorted",
            "staticmethod",
            "str",
            "sum",
            "super",
            "tuple",
            "type",
            "vars",
            "zip",
          ],
          literal: [
            "__debug__",
            "Ellipsis",
            "False",
            "None",
            "NotImplemented",
            "True",
          ],
          type: [
            "Any",
            "Callable",
            "Coroutine",
            "Dict",
            "List",
            "Literal",
            "Generic",
            "Optional",
            "Sequence",
            "Set",
            "Tuple",
            "Type",
            "Union",
          ],
        },
        r = { className: "meta", begin: /^(>>>|\.\.\.) / },
        s = {
          className: "subst",
          begin: /\{/,
          end: /\}/,
          keywords: i,
          illegal: /#/,
        },
        o = { begin: /\{\{/, relevance: 0 },
        l = {
          className: "string",
          contains: [e.BACKSLASH_ESCAPE],
          variants: [
            {
              begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
              end: /'''/,
              contains: [e.BACKSLASH_ESCAPE, r],
              relevance: 10,
            },
            {
              begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
              end: /"""/,
              contains: [e.BACKSLASH_ESCAPE, r],
              relevance: 10,
            },
            {
              begin: /([fF][rR]|[rR][fF]|[fF])'''/,
              end: /'''/,
              contains: [e.BACKSLASH_ESCAPE, r, o, s],
            },
            {
              begin: /([fF][rR]|[rR][fF]|[fF])"""/,
              end: /"""/,
              contains: [e.BACKSLASH_ESCAPE, r, o, s],
            },
            { begin: /([uU]|[rR])'/, end: /'/, relevance: 10 },
            { begin: /([uU]|[rR])"/, end: /"/, relevance: 10 },
            {
              begin: /([bB]|[bB][rR]|[rR][bB])'/,
              end: /'/,
            },
            { begin: /([bB]|[bB][rR]|[rR][bB])"/, end: /"/ },
            {
              begin: /([fF][rR]|[rR][fF]|[fF])'/,
              end: /'/,
              contains: [e.BACKSLASH_ESCAPE, o, s],
            },
            {
              begin: /([fF][rR]|[rR][fF]|[fF])"/,
              end: /"/,
              contains: [e.BACKSLASH_ESCAPE, o, s],
            },
            e.APOS_STRING_MODE,
            e.QUOTE_STRING_MODE,
          ],
        },
        c = "[0-9](_?[0-9])*",
        d = `(\\b(${c}))?\\.(${c})|\\b(${c})\\.`,
        g = "\\b|" + a.join("|"),
        u = {
          className: "number",
          relevance: 0,
          variants: [
            {
              begin: `(\\b(${c})|(${d}))[eE][+-]?(${c})[jJ]?(?=${g})`,
            },
            { begin: `(${d})[jJ]?` },
            {
              begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${g})`,
            },
            {
              begin: `\\b0[bB](_?[01])+[lL]?(?=${g})`,
            },
            { begin: `\\b0[oO](_?[0-7])+[lL]?(?=${g})` },
            { begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${g})` },
            { begin: `\\b(${c})[jJ](?=${g})` },
          ],
        },
        b = {
          className: "comment",
          begin: n.lookahead(/# type:/),
          end: /$/,
          keywords: i,
          contains: [
            { begin: /# type:/ },
            { begin: /#/, end: /\b\B/, endsWithParent: !0 },
          ],
        },
        m = {
          className: "params",
          variants: [
            { className: "", begin: /\(\s*\)/, skip: !0 },
            {
              begin: /\(/,
              end: /\)/,
              excludeBegin: !0,
              excludeEnd: !0,
              keywords: i,
              contains: ["self", r, u, l, e.HASH_COMMENT_MODE],
            },
          ],
        }
      return (
        (s.contains = [l, u, r]),
        {
          name: "Python",
          aliases: ["py", "gyp", "ipython"],
          unicodeRegex: !0,
          keywords: i,
          illegal: /(<\/|->|\?)|=>/,
          contains: [
            r,
            u,
            { begin: /\bself\b/ },
            { beginKeywords: "if", relevance: 0 },
            l,
            b,
            e.HASH_COMMENT_MODE,
            {
              match: [/\bdef/, /\s+/, t],
              scope: {
                1: "keyword",
                3: "title.function",
              },
              contains: [m],
            },
            {
              variants: [
                {
                  match: [/\bclass/, /\s+/, t, /\s*/, /\(\s*/, t, /\s*\)/],
                },
                { match: [/\bclass/, /\s+/, t] },
              ],
              scope: {
                1: "keyword",
                3: "title.class",
                6: "title.class.inherited",
              },
            },
            {
              className: "meta",
              begin: /^[\t ]*@/,
              end: /(?=#)|$/,
              contains: [u, m, l],
            },
          ],
        }
      )
    },
    grmr_python_repl: (e) => ({
      aliases: ["pycon"],
      contains: [
        {
          className: "meta",
          starts: {
            end: / |$/,
            starts: { end: "$", subLanguage: "python" },
          },
          variants: [
            {
              begin: /^>>>(?=[ ]|$)/,
            },
            { begin: /^\.\.\.(?=[ ]|$)/ },
          ],
        },
      ],
    }),
    grmr_r: (e) => {
      const n = e.regex,
        t = /(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/,
        a = n.either(
          /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/,
          /0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/,
          /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/,
        ),
        i = /[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/,
        r = n.either(/[()]/, /[{}]/, /\[\[/, /[[\]]/, /\\/, /,/)
      return {
        name: "R",
        keywords: {
          $pattern: t,
          keyword: "function if in break next repeat else for while",
          literal:
            "NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
          built_in:
            "LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm",
        },
        contains: [
          e.COMMENT(/#'/, /$/, {
            contains: [
              {
                scope: "doctag",
                match: /@examples/,
                starts: {
                  end: n.lookahead(
                    n.either(/\n^#'\s*(?=@[a-zA-Z]+)/, /\n^(?!#')/),
                  ),
                  endsParent: !0,
                },
              },
              {
                scope: "doctag",
                begin: "@param",
                end: /$/,
                contains: [
                  {
                    scope: "variable",
                    variants: [{ match: t }, { match: /`(?:\\.|[^`\\])+`/ }],
                    endsParent: !0,
                  },
                ],
              },
              { scope: "doctag", match: /@[a-zA-Z]+/ },
              { scope: "keyword", match: /\\[a-zA-Z]+/ },
            ],
          }),
          e.HASH_COMMENT_MODE,
          {
            scope: "string",
            contains: [e.BACKSLASH_ESCAPE],
            variants: [
              e.END_SAME_AS_BEGIN({ begin: /[rR]"(-*)\(/, end: /\)(-*)"/ }),
              e.END_SAME_AS_BEGIN({ begin: /[rR]"(-*)\{/, end: /\}(-*)"/ }),
              e.END_SAME_AS_BEGIN({ begin: /[rR]"(-*)\[/, end: /\](-*)"/ }),
              e.END_SAME_AS_BEGIN({ begin: /[rR]'(-*)\(/, end: /\)(-*)'/ }),
              e.END_SAME_AS_BEGIN({ begin: /[rR]'(-*)\{/, end: /\}(-*)'/ }),
              e.END_SAME_AS_BEGIN({ begin: /[rR]'(-*)\[/, end: /\](-*)'/ }),
              { begin: '"', end: '"', relevance: 0 },
              { begin: "'", end: "'", relevance: 0 },
            ],
          },
          {
            relevance: 0,
            variants: [
              {
                scope: {
                  1: "operator",
                  2: "number",
                },
                match: [i, a],
              },
              { scope: { 1: "operator", 2: "number" }, match: [/%[^%]*%/, a] },
              { scope: { 1: "punctuation", 2: "number" }, match: [r, a] },
              {
                scope: {
                  2: "number",
                },
                match: [/[^a-zA-Z0-9._]|^/, a],
              },
            ],
          },
          { scope: { 3: "operator" }, match: [t, /\s+/, /<-/, /\s+/] },
          {
            scope: "operator",
            relevance: 0,
            variants: [
              { match: i },
              {
                match: /%[^%]*%/,
              },
            ],
          },
          { scope: "punctuation", relevance: 0, match: r },
          { begin: "`", end: "`", contains: [{ begin: /\\./ }] },
        ],
      }
    },
    grmr_ruby: (e) => {
      const n = e.regex,
        t =
          "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)",
        a = {
          keyword:
            "and then defined module in return redo if BEGIN retry end for self when next until do begin unless END rescue else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor __FILE__",
          built_in: "proc lambda",
          literal: "true false nil",
        },
        i = { className: "doctag", begin: "@[A-Za-z]+" },
        r = { begin: "#<", end: ">" },
        s = [
          e.COMMENT("#", "$", { contains: [i] }),
          e.COMMENT("^=begin", "^=end", { contains: [i], relevance: 10 }),
          e.COMMENT("^__END__", "\\n$"),
        ],
        o = { className: "subst", begin: /#\{/, end: /\}/, keywords: a },
        l = {
          className: "string",
          contains: [e.BACKSLASH_ESCAPE, o],
          variants: [
            {
              begin: /'/,
              end: /'/,
            },
            { begin: /"/, end: /"/ },
            { begin: /`/, end: /`/ },
            { begin: /%[qQwWx]?\(/, end: /\)/ },
            { begin: /%[qQwWx]?\[/, end: /\]/ },
            { begin: /%[qQwWx]?\{/, end: /\}/ },
            {
              begin: /%[qQwWx]?</,
              end: />/,
            },
            { begin: /%[qQwWx]?\//, end: /\// },
            { begin: /%[qQwWx]?%/, end: /%/ },
            { begin: /%[qQwWx]?-/, end: /-/ },
            { begin: /%[qQwWx]?\|/, end: /\|/ },
            {
              begin: /\B\?(\\\d{1,3})/,
            },
            { begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/ },
            {
              begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/,
            },
            {
              begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/,
            },
            {
              begin: /\B\?\\(c|C-)[\x20-\x7e]/,
            },
            { begin: /\B\?\\?\S/ },
            {
              begin: n.concat(
                /<<[-~]?'?/,
                n.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/),
              ),
              contains: [
                e.END_SAME_AS_BEGIN({
                  begin: /(\w+)/,
                  end: /(\w+)/,
                  contains: [e.BACKSLASH_ESCAPE, o],
                }),
              ],
            },
          ],
        },
        c = "[0-9](_?[0-9])*",
        d = {
          className: "number",
          relevance: 0,
          variants: [
            {
              begin: `\\b([1-9](_?[0-9])*|0)(\\.(${c}))?([eE][+-]?(${c})|r)?i?\\b`,
            },
            {
              begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b",
            },
            { begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b" },
            { begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b" },
            {
              begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b",
            },
            {
              begin: "\\b0(_?[0-7])+r?i?\\b",
            },
          ],
        },
        g = {
          className: "params",
          begin: "\\(",
          end: "\\)",
          endsParent: !0,
          keywords: a,
        },
        u = [
          l,
          {
            className: "class",
            beginKeywords: "class module",
            end: "$|;",
            illegal: /=/,
            contains: [
              e.inherit(e.TITLE_MODE, {
                begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|!)?",
              }),
              {
                begin: "<\\s*",
                contains: [
                  {
                    begin: "(" + e.IDENT_RE + "::)?" + e.IDENT_RE,
                    relevance: 0,
                  },
                ],
              },
            ].concat(s),
          },
          {
            className: "function",
            begin: n.concat(/def\s+/, n.lookahead(t + "\\s*(\\(|;|$)")),
            relevance: 0,
            keywords: "def",
            end: "$|;",
            contains: [e.inherit(e.TITLE_MODE, { begin: t }), g].concat(s),
          },
          { begin: e.IDENT_RE + "::" },
          {
            className: "symbol",
            begin: e.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
            relevance: 0,
          },
          {
            className: "symbol",
            begin: ":(?!\\s)",
            contains: [l, { begin: t }],
            relevance: 0,
          },
          d,
          {
            className: "variable",
            begin: "(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])",
          },
          {
            className: "params",
            begin: /\|/,
            end: /\|/,
            relevance: 0,
            keywords: a,
          },
          {
            begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
            keywords: "unless",
            contains: [
              {
                className: "regexp",
                contains: [e.BACKSLASH_ESCAPE, o],
                illegal: /\n/,
                variants: [
                  {
                    begin: "/",
                    end: "/[a-z]*",
                  },
                  { begin: /%r\{/, end: /\}[a-z]*/ },
                  { begin: "%r\\(", end: "\\)[a-z]*" },
                  { begin: "%r!", end: "![a-z]*" },
                  { begin: "%r\\[", end: "\\][a-z]*" },
                ],
              },
            ].concat(r, s),
            relevance: 0,
          },
        ].concat(r, s)
      ;((o.contains = u), (g.contains = u))
      const b = [
        {
          begin: /^\s*=>/,
          starts: { end: "$", contains: u },
        },
        {
          className: "meta",
          begin:
            "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+>|(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>)(?=[ ])",
          starts: { end: "$", contains: u },
        },
      ]
      return (
        s.unshift(r),
        {
          name: "Ruby",
          aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
          keywords: a,
          illegal: /\/\*/,
          contains: [e.SHEBANG({ binary: "ruby" })]
            .concat(b)
            .concat(s)
            .concat(u),
        }
      )
    },
    grmr_rust: (e) => {
      const n = e.regex,
        t = {
          className: "title.function.invoke",
          relevance: 0,
          begin: n.concat(/\b/, /(?!let\b)/, e.IDENT_RE, n.lookahead(/\s*\(/)),
        },
        a = "([ui](8|16|32|64|128|size)|f(32|64))?",
        i = [
          "drop ",
          "Copy",
          "Send",
          "Sized",
          "Sync",
          "Drop",
          "Fn",
          "FnMut",
          "FnOnce",
          "ToOwned",
          "Clone",
          "Debug",
          "PartialEq",
          "PartialOrd",
          "Eq",
          "Ord",
          "AsRef",
          "AsMut",
          "Into",
          "From",
          "Default",
          "Iterator",
          "Extend",
          "IntoIterator",
          "DoubleEndedIterator",
          "ExactSizeIterator",
          "SliceConcatExt",
          "ToString",
          "assert!",
          "assert_eq!",
          "bitflags!",
          "bytes!",
          "cfg!",
          "col!",
          "concat!",
          "concat_idents!",
          "debug_assert!",
          "debug_assert_eq!",
          "env!",
          "panic!",
          "file!",
          "format!",
          "format_args!",
          "include_bin!",
          "include_str!",
          "line!",
          "local_data_key!",
          "module_path!",
          "option_env!",
          "print!",
          "println!",
          "select!",
          "stringify!",
          "try!",
          "unimplemented!",
          "unreachable!",
          "vec!",
          "write!",
          "writeln!",
          "macro_rules!",
          "assert_ne!",
          "debug_assert_ne!",
        ]
      return {
        name: "Rust",
        aliases: ["rs"],
        keywords: {
          $pattern: e.IDENT_RE + "!?",
          type: [
            "i8",
            "i16",
            "i32",
            "i64",
            "i128",
            "isize",
            "u8",
            "u16",
            "u32",
            "u64",
            "u128",
            "usize",
            "f32",
            "f64",
            "str",
            "char",
            "bool",
            "Box",
            "Option",
            "Result",
            "String",
            "Vec",
          ],
          keyword: [
            "abstract",
            "as",
            "async",
            "await",
            "become",
            "box",
            "break",
            "const",
            "continue",
            "crate",
            "do",
            "dyn",
            "else",
            "enum",
            "extern",
            "false",
            "final",
            "fn",
            "for",
            "if",
            "impl",
            "in",
            "let",
            "loop",
            "macro",
            "match",
            "mod",
            "move",
            "mut",
            "override",
            "priv",
            "pub",
            "ref",
            "return",
            "self",
            "Self",
            "static",
            "struct",
            "super",
            "trait",
            "true",
            "try",
            "type",
            "typeof",
            "unsafe",
            "unsized",
            "use",
            "virtual",
            "where",
            "while",
            "yield",
          ],
          literal: ["true", "false", "Some", "None", "Ok", "Err"],
          built_in: i,
        },
        illegal: "</",
        contains: [
          e.C_LINE_COMMENT_MODE,
          e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
          e.inherit(e.QUOTE_STRING_MODE, { begin: /b?"/, illegal: null }),
          {
            className: "string",
            variants: [
              { begin: /b?r(#*)"(.|\n)*?"\1(?!#)/ },
              {
                begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/,
              },
            ],
          },
          { className: "symbol", begin: /'[a-zA-Z_][a-zA-Z0-9_]*/ },
          {
            className: "number",
            variants: [
              {
                begin: "\\b0b([01_]+)" + a,
              },
              { begin: "\\b0o([0-7_]+)" + a },
              {
                begin: "\\b0x([A-Fa-f0-9_]+)" + a,
              },
              {
                begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + a,
              },
            ],
            relevance: 0,
          },
          {
            begin: [/fn/, /\s+/, e.UNDERSCORE_IDENT_RE],
            className: { 1: "keyword", 3: "title.function" },
          },
          {
            className: "meta",
            begin: "#!?\\[",
            end: "\\]",
            contains: [
              {
                className: "string",
                begin: /"/,
                end: /"/,
              },
            ],
          },
          {
            begin: [/let/, /\s+/, /(?:mut\s+)?/, e.UNDERSCORE_IDENT_RE],
            className: { 1: "keyword", 3: "keyword", 4: "variable" },
          },
          {
            begin: [/for/, /\s+/, e.UNDERSCORE_IDENT_RE, /\s+/, /in/],
            className: { 1: "keyword", 3: "variable", 5: "keyword" },
          },
          {
            begin: [/type/, /\s+/, e.UNDERSCORE_IDENT_RE],
            className: { 1: "keyword", 3: "title.class" },
          },
          {
            begin: [
              /(?:trait|enum|struct|union|impl|for)/,
              /\s+/,
              e.UNDERSCORE_IDENT_RE,
            ],
            className: { 1: "keyword", 3: "title.class" },
          },
          {
            begin: e.IDENT_RE + "::",
            keywords: {
              keyword: "Self",
              built_in: i,
            },
          },
          { className: "punctuation", begin: "->" },
          t,
        ],
      }
    },
    grmr_scss: (e) => {
      const n = te(e),
        t = se,
        a = re,
        i = "@[a-z-]+",
        r = { className: "variable", begin: "(\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\b" }
      return {
        name: "SCSS",
        case_insensitive: !0,
        illegal: "[=/|']",
        contains: [
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          n.CSS_NUMBER_MODE,
          {
            className: "selector-id",
            begin: "#[A-Za-z0-9_-]+",
            relevance: 0,
          },
          {
            className: "selector-class",
            begin: "\\.[A-Za-z0-9_-]+",
            relevance: 0,
          },
          n.ATTRIBUTE_SELECTOR_MODE,
          {
            className: "selector-tag",
            begin: "\\b(" + ae.join("|") + ")\\b",
            relevance: 0,
          },
          { className: "selector-pseudo", begin: ":(" + a.join("|") + ")" },
          { className: "selector-pseudo", begin: ":(:)?(" + t.join("|") + ")" },
          r,
          { begin: /\(/, end: /\)/, contains: [n.CSS_NUMBER_MODE] },
          n.CSS_VARIABLE,
          { className: "attribute", begin: "\\b(" + oe.join("|") + ")\\b" },
          {
            begin:
              "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b",
          },
          {
            begin: /:/,
            end: /[;}{]/,
            contains: [
              n.BLOCK_COMMENT,
              r,
              n.HEXCOLOR,
              n.CSS_NUMBER_MODE,
              e.QUOTE_STRING_MODE,
              e.APOS_STRING_MODE,
              n.IMPORTANT,
            ],
          },
          {
            begin: "@(page|font-face)",
            keywords: { $pattern: i, keyword: "@page @font-face" },
          },
          {
            begin: "@",
            end: "[{;]",
            returnBegin: !0,
            keywords: {
              $pattern: /[a-z-]+/,
              keyword: "and or not only",
              attribute: ie.join(" "),
            },
            contains: [
              { begin: i, className: "keyword" },
              { begin: /[a-z-]+(?=:)/, className: "attribute" },
              r,
              e.QUOTE_STRING_MODE,
              e.APOS_STRING_MODE,
              n.HEXCOLOR,
              n.CSS_NUMBER_MODE,
            ],
          },
          n.FUNCTION_DISPATCH,
        ],
      }
    },
    grmr_shell: (e) => ({
      name: "Shell Session",
      aliases: ["console", "shellsession"],
      contains: [
        {
          className: "meta",
          begin: /^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,
          starts: { end: /[^\\](?=\s*$)/, subLanguage: "bash" },
        },
      ],
    }),
    grmr_sql: (e) => {
      const n = e.regex,
        t = e.COMMENT("--", "$"),
        a = ["true", "false", "unknown"],
        i = [
          "bigint",
          "binary",
          "blob",
          "boolean",
          "char",
          "character",
          "clob",
          "date",
          "dec",
          "decfloat",
          "decimal",
          "float",
          "int",
          "integer",
          "interval",
          "nchar",
          "nclob",
          "national",
          "numeric",
          "real",
          "row",
          "smallint",
          "time",
          "timestamp",
          "varchar",
          "varying",
          "varbinary",
        ],
        r = [
          "abs",
          "acos",
          "array_agg",
          "asin",
          "atan",
          "avg",
          "cast",
          "ceil",
          "ceiling",
          "coalesce",
          "corr",
          "cos",
          "cosh",
          "count",
          "covar_pop",
          "covar_samp",
          "cume_dist",
          "dense_rank",
          "deref",
          "element",
          "exp",
          "extract",
          "first_value",
          "floor",
          "json_array",
          "json_arrayagg",
          "json_exists",
          "json_object",
          "json_objectagg",
          "json_query",
          "json_table",
          "json_table_primitive",
          "json_value",
          "lag",
          "last_value",
          "lead",
          "listagg",
          "ln",
          "log",
          "log10",
          "lower",
          "max",
          "min",
          "mod",
          "nth_value",
          "ntile",
          "nullif",
          "percent_rank",
          "percentile_cont",
          "percentile_disc",
          "position",
          "position_regex",
          "power",
          "rank",
          "regr_avgx",
          "regr_avgy",
          "regr_count",
          "regr_intercept",
          "regr_r2",
          "regr_slope",
          "regr_sxx",
          "regr_sxy",
          "regr_syy",
          "row_number",
          "sin",
          "sinh",
          "sqrt",
          "stddev_pop",
          "stddev_samp",
          "substring",
          "substring_regex",
          "sum",
          "tan",
          "tanh",
          "translate",
          "translate_regex",
          "treat",
          "trim",
          "trim_array",
          "unnest",
          "upper",
          "value_of",
          "var_pop",
          "var_samp",
          "width_bucket",
        ],
        s = [
          "create table",
          "insert into",
          "primary key",
          "foreign key",
          "not null",
          "alter table",
          "add constraint",
          "grouping sets",
          "on overflow",
          "character set",
          "respect nulls",
          "ignore nulls",
          "nulls first",
          "nulls last",
          "depth first",
          "breadth first",
        ],
        o = r,
        l = [
          "abs",
          "acos",
          "all",
          "allocate",
          "alter",
          "and",
          "any",
          "are",
          "array",
          "array_agg",
          "array_max_cardinality",
          "as",
          "asensitive",
          "asin",
          "asymmetric",
          "at",
          "atan",
          "atomic",
          "authorization",
          "avg",
          "begin",
          "begin_frame",
          "begin_partition",
          "between",
          "bigint",
          "binary",
          "blob",
          "boolean",
          "both",
          "by",
          "call",
          "called",
          "cardinality",
          "cascaded",
          "case",
          "cast",
          "ceil",
          "ceiling",
          "char",
          "char_length",
          "character",
          "character_length",
          "check",
          "classifier",
          "clob",
          "close",
          "coalesce",
          "collate",
          "collect",
          "column",
          "commit",
          "condition",
          "connect",
          "constraint",
          "contains",
          "convert",
          "copy",
          "corr",
          "corresponding",
          "cos",
          "cosh",
          "count",
          "covar_pop",
          "covar_samp",
          "create",
          "cross",
          "cube",
          "cume_dist",
          "current",
          "current_catalog",
          "current_date",
          "current_default_transform_group",
          "current_path",
          "current_role",
          "current_row",
          "current_schema",
          "current_time",
          "current_timestamp",
          "current_path",
          "current_role",
          "current_transform_group_for_type",
          "current_user",
          "cursor",
          "cycle",
          "date",
          "day",
          "deallocate",
          "dec",
          "decimal",
          "decfloat",
          "declare",
          "default",
          "define",
          "delete",
          "dense_rank",
          "deref",
          "describe",
          "deterministic",
          "disconnect",
          "distinct",
          "double",
          "drop",
          "dynamic",
          "each",
          "element",
          "else",
          "empty",
          "end",
          "end_frame",
          "end_partition",
          "end-exec",
          "equals",
          "escape",
          "every",
          "except",
          "exec",
          "execute",
          "exists",
          "exp",
          "external",
          "extract",
          "false",
          "fetch",
          "filter",
          "first_value",
          "float",
          "floor",
          "for",
          "foreign",
          "frame_row",
          "free",
          "from",
          "full",
          "function",
          "fusion",
          "get",
          "global",
          "grant",
          "group",
          "grouping",
          "groups",
          "having",
          "hold",
          "hour",
          "identity",
          "in",
          "indicator",
          "initial",
          "inner",
          "inout",
          "insensitive",
          "insert",
          "int",
          "integer",
          "intersect",
          "intersection",
          "interval",
          "into",
          "is",
          "join",
          "json_array",
          "json_arrayagg",
          "json_exists",
          "json_object",
          "json_objectagg",
          "json_query",
          "json_table",
          "json_table_primitive",
          "json_value",
          "lag",
          "language",
          "large",
          "last_value",
          "lateral",
          "lead",
          "leading",
          "left",
          "like",
          "like_regex",
          "listagg",
          "ln",
          "local",
          "localtime",
          "localtimestamp",
          "log",
          "log10",
          "lower",
          "match",
          "match_number",
          "match_recognize",
          "matches",
          "max",
          "member",
          "merge",
          "method",
          "min",
          "minute",
          "mod",
          "modifies",
          "module",
          "month",
          "multiset",
          "national",
          "natural",
          "nchar",
          "nclob",
          "new",
          "no",
          "none",
          "normalize",
          "not",
          "nth_value",
          "ntile",
          "null",
          "nullif",
          "numeric",
          "octet_length",
          "occurrences_regex",
          "of",
          "offset",
          "old",
          "omit",
          "on",
          "one",
          "only",
          "open",
          "or",
          "order",
          "out",
          "outer",
          "over",
          "overlaps",
          "overlay",
          "parameter",
          "partition",
          "pattern",
          "per",
          "percent",
          "percent_rank",
          "percentile_cont",
          "percentile_disc",
          "period",
          "portion",
          "position",
          "position_regex",
          "power",
          "precedes",
          "precision",
          "prepare",
          "primary",
          "procedure",
          "ptf",
          "range",
          "rank",
          "reads",
          "real",
          "recursive",
          "ref",
          "references",
          "referencing",
          "regr_avgx",
          "regr_avgy",
          "regr_count",
          "regr_intercept",
          "regr_r2",
          "regr_slope",
          "regr_sxx",
          "regr_sxy",
          "regr_syy",
          "release",
          "result",
          "return",
          "returns",
          "revoke",
          "right",
          "rollback",
          "rollup",
          "row",
          "row_number",
          "rows",
          "running",
          "savepoint",
          "scope",
          "scroll",
          "search",
          "second",
          "seek",
          "select",
          "sensitive",
          "session_user",
          "set",
          "show",
          "similar",
          "sin",
          "sinh",
          "skip",
          "smallint",
          "some",
          "specific",
          "specifictype",
          "sql",
          "sqlexception",
          "sqlstate",
          "sqlwarning",
          "sqrt",
          "start",
          "static",
          "stddev_pop",
          "stddev_samp",
          "submultiset",
          "subset",
          "substring",
          "substring_regex",
          "succeeds",
          "sum",
          "symmetric",
          "system",
          "system_time",
          "system_user",
          "table",
          "tablesample",
          "tan",
          "tanh",
          "then",
          "time",
          "timestamp",
          "timezone_hour",
          "timezone_minute",
          "to",
          "trailing",
          "translate",
          "translate_regex",
          "translation",
          "treat",
          "trigger",
          "trim",
          "trim_array",
          "true",
          "truncate",
          "uescape",
          "union",
          "unique",
          "unknown",
          "unnest",
          "update",
          "upper",
          "user",
          "using",
          "value",
          "values",
          "value_of",
          "var_pop",
          "var_samp",
          "varbinary",
          "varchar",
          "varying",
          "versioning",
          "when",
          "whenever",
          "where",
          "width_bucket",
          "window",
          "with",
          "within",
          "without",
          "year",
          "add",
          "asc",
          "collation",
          "desc",
          "final",
          "first",
          "last",
          "view",
        ].filter((e) => !r.includes(e)),
        c = {
          begin: n.concat(/\b/, n.either(...o), /\s*\(/),
          relevance: 0,
          keywords: { built_in: o },
        }
      return {
        name: "SQL",
        case_insensitive: !0,
        illegal: /[{}]|<\//,
        keywords: {
          $pattern: /\b[\w\.]+/,
          keyword: ((e, { exceptions: n, when: t } = {}) => {
            const a = t
            return (
              (n = n || []),
              e.map((e) =>
                e.match(/\|\d+$/) || n.includes(e) ? e : a(e) ? e + "|0" : e,
              )
            )
          })(l, { when: (e) => e.length < 3 }),
          literal: a,
          type: i,
          built_in: [
            "current_catalog",
            "current_date",
            "current_default_transform_group",
            "current_path",
            "current_role",
            "current_schema",
            "current_transform_group_for_type",
            "current_user",
            "session_user",
            "system_time",
            "system_user",
            "current_time",
            "localtime",
            "current_timestamp",
            "localtimestamp",
          ],
        },
        contains: [
          {
            begin: n.either(...s),
            relevance: 0,
            keywords: {
              $pattern: /[\w\.]+/,
              keyword: l.concat(s),
              literal: a,
              type: i,
            },
          },
          {
            className: "type",
            begin: n.either(
              "double precision",
              "large object",
              "with timezone",
              "without timezone",
            ),
          },
          c,
          { className: "variable", begin: /@[a-z0-9]+/ },
          {
            className: "string",
            variants: [
              {
                begin: /'/,
                end: /'/,
                contains: [{ begin: /''/ }],
              },
            ],
          },
          {
            begin: /"/,
            end: /"/,
            contains: [
              {
                begin: /""/,
              },
            ],
          },
          e.C_NUMBER_MODE,
          e.C_BLOCK_COMMENT_MODE,
          t,
          {
            className: "operator",
            begin: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
            relevance: 0,
          },
        ],
      }
    },
    grmr_swift: (e) => {
      const n = { match: /\s+/, relevance: 0 },
        t = e.COMMENT("/\\*", "\\*/", {
          contains: ["self"],
        }),
        a = [e.C_LINE_COMMENT_MODE, t],
        i = { match: [/\./, p(...ve, ...Oe)], className: { 2: "keyword" } },
        r = { match: m(/\./, p(...Me)), relevance: 0 },
        s = Me.filter((e) => "string" == typeof e).concat(["_|0"]),
        o = {
          variants: [
            {
              className: "keyword",
              match: p(
                ...Me.filter((e) => "string" != typeof e)
                  .concat(xe)
                  .map(we),
                ...Oe,
              ),
            },
          ],
        },
        l = {
          $pattern: p(/\b\w+/, /#\w+/),
          keyword: s.concat(Ae),
          literal: ke,
        },
        c = [i, r, o],
        d = [
          {
            match: m(/\./, p(...Ce)),
            relevance: 0,
          },
          { className: "built_in", match: m(/\b/, p(...Ce), /(?=\()/) },
        ],
        u = { match: /->/, relevance: 0 },
        b = [
          u,
          {
            className: "operator",
            relevance: 0,
            variants: [{ match: De }, { match: `\\.(\\.|${Re})+` }],
          },
        ],
        _ = "([0-9a-fA-F]_*)+",
        h = {
          className: "number",
          relevance: 0,
          variants: [
            {
              match:
                "\\b(([0-9]_*)+)(\\.(([0-9]_*)+))?([eE][+-]?(([0-9]_*)+))?\\b",
            },
            {
              match: `\\b0x(${_})(\\.(${_}))?([pP][+-]?(([0-9]_*)+))?\\b`,
            },
            {
              match: /\b0o([0-7]_*)+\b/,
            },
            { match: /\b0b([01]_*)+\b/ },
          ],
        },
        f = (e = "") => ({
          className: "subst",
          variants: [
            { match: m(/\\/, e, /[0\\tnr"']/) },
            {
              match: m(/\\/, e, /u\{[0-9a-fA-F]{1,8}\}/),
            },
          ],
        }),
        E = (e = "") => ({
          className: "subst",
          match: m(/\\/, e, /[\t ]*(?:[\r\n]|\r\n)/),
        }),
        y = (e = "") => ({
          className: "subst",
          label: "interpol",
          begin: m(/\\/, e, /\(/),
          end: /\)/,
        }),
        N = (e = "") => ({
          begin: m(e, /"""/),
          end: m(/"""/, e),
          contains: [f(e), E(e), y(e)],
        }),
        w = (e = "") => ({
          begin: m(e, /"/),
          end: m(/"/, e),
          contains: [f(e), y(e)],
        }),
        v = {
          className: "string",
          variants: [
            N(),
            N("#"),
            N("##"),
            N("###"),
            w(),
            w("#"),
            w("##"),
            w("###"),
          ],
        },
        O = {
          match: m(/`/, Be, /`/),
        },
        x = [
          O,
          { className: "variable", match: /\$\d+/ },
          {
            className: "variable",
            match: `\\$${Le}+`,
          },
        ],
        M = [
          {
            match: /(@|#(un)?)available/,
            className: "keyword",
            starts: {
              contains: [
                {
                  begin: /\(/,
                  end: /\)/,
                  keywords: ze,
                  contains: [...b, h, v],
                },
              ],
            },
          },
          { className: "keyword", match: m(/@/, p(...Fe)) },
          {
            className: "meta",
            match: m(/@/, Be),
          },
        ],
        k = {
          match: g(/\b[A-Z]/),
          relevance: 0,
          contains: [
            {
              className: "type",
              match: m(
                /(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/,
                Le,
                "+",
              ),
            },
            { className: "type", match: $e, relevance: 0 },
            { match: /[?!]+/, relevance: 0 },
            {
              match: /\.\.\./,
              relevance: 0,
            },
            { match: m(/\s+&\s+/, g($e)), relevance: 0 },
          ],
        },
        S = {
          begin: /</,
          end: />/,
          keywords: l,
          contains: [...a, ...c, ...M, u, k],
        }
      k.contains.push(S)
      const A = {
          begin: /\(/,
          end: /\)/,
          relevance: 0,
          keywords: l,
          contains: [
            "self",
            {
              match: m(Be, /\s*:/),
              keywords: "_|0",
              relevance: 0,
            },
            ...a,
            ...c,
            ...d,
            ...b,
            h,
            v,
            ...x,
            ...M,
            k,
          ],
        },
        C = { begin: /</, end: />/, contains: [...a, k] },
        T = {
          begin: /\(/,
          end: /\)/,
          keywords: l,
          contains: [
            {
              begin: p(g(m(Be, /\s*:/)), g(m(Be, /\s+/, Be, /\s*:/))),
              end: /:/,
              relevance: 0,
              contains: [
                { className: "keyword", match: /\b_\b/ },
                { className: "params", match: Be },
              ],
            },
            ...a,
            ...c,
            ...b,
            h,
            v,
            ...M,
            k,
            A,
          ],
          endsParent: !0,
          illegal: /["']/,
        },
        R = {
          match: [/func/, /\s+/, p(O.match, Be, De)],
          className: { 1: "keyword", 3: "title.function" },
          contains: [C, T, n],
          illegal: [/\[/, /%/],
        },
        D = {
          match: [/\b(?:subscript|init[?!]?)/, /\s*(?=[<(])/],
          className: { 1: "keyword" },
          contains: [C, T, n],
          illegal: /\[|%/,
        },
        I = {
          match: [/operator/, /\s+/, De],
          className: {
            1: "keyword",
            3: "title",
          },
        },
        L = {
          begin: [/precedencegroup/, /\s+/, $e],
          className: {
            1: "keyword",
            3: "title",
          },
          contains: [k],
          keywords: [...Se, ...ke],
          end: /}/,
        }
      for (const e of v.variants) {
        const n = e.contains.find((e) => "interpol" === e.label)
        n.keywords = l
        const t = [...c, ...d, ...b, h, v, ...x]
        n.contains = [
          ...t,
          { begin: /\(/, end: /\)/, contains: ["self", ...t] },
        ]
      }
      return {
        name: "Swift",
        keywords: l,
        contains: [
          ...a,
          R,
          D,
          {
            beginKeywords: "struct protocol class extension enum actor",
            end: "\\{",
            excludeEnd: !0,
            keywords: l,
            contains: [
              e.inherit(e.TITLE_MODE, {
                className: "title.class",
                begin: /[A-Za-z$_][\u00C0-\u02B80-9A-Za-z$_]*/,
              }),
              ...c,
            ],
          },
          I,
          L,
          { beginKeywords: "import", end: /$/, contains: [...a], relevance: 0 },
          ...c,
          ...d,
          ...b,
          h,
          v,
          ...x,
          ...M,
          k,
          A,
        ],
      }
    },
    grmr_typescript: (e) => {
      const n = Ne(e),
        t = [
          "any",
          "void",
          "number",
          "boolean",
          "string",
          "object",
          "never",
          "enum",
        ],
        a = {
          beginKeywords: "namespace",
          end: /\{/,
          excludeEnd: !0,
          contains: [n.exports.CLASS_REFERENCE],
        },
        i = {
          beginKeywords: "interface",
          end: /\{/,
          excludeEnd: !0,
          keywords: { keyword: "interface extends", built_in: t },
          contains: [n.exports.CLASS_REFERENCE],
        },
        r = {
          $pattern: be,
          keyword: me.concat([
            "type",
            "namespace",
            "typedef",
            "interface",
            "public",
            "private",
            "protected",
            "implements",
            "declare",
            "abstract",
            "readonly",
          ]),
          literal: pe,
          built_in: ye.concat(t),
          "variable.language": Ee,
        },
        s = { className: "meta", begin: "@[A-Za-z$_][0-9A-Za-z$_]*" },
        o = (e, n, t) => {
          const a = e.contains.findIndex((e) => e.label === n)
          if (-1 === a) throw Error("can not find mode to replace")
          e.contains.splice(a, 1, t)
        }
      return (
        Object.assign(n.keywords, r),
        n.exports.PARAMS_CONTAINS.push(s),
        (n.contains = n.contains.concat([s, a, i])),
        o(n, "shebang", e.SHEBANG()),
        o(n, "use_strict", {
          className: "meta",
          relevance: 10,
          begin: /^\s*['"]use strict['"]/,
        }),
        (n.contains.find((e) => "func.def" === e.label).relevance = 0),
        Object.assign(n, {
          name: "TypeScript",
          aliases: ["ts", "tsx"],
        }),
        n
      )
    },
    grmr_vbnet: (e) => {
      const n = e.regex,
        t = /\d{1,2}\/\d{1,2}\/\d{4}/,
        a = /\d{4}-\d{1,2}-\d{1,2}/,
        i = /(\d|1[012])(:\d+){0,2} *(AM|PM)/,
        r = /\d{1,2}(:\d{1,2}){1,2}/,
        s = {
          className: "literal",
          variants: [
            { begin: n.concat(/# */, n.either(a, t), / *#/) },
            {
              begin: n.concat(/# */, r, / *#/),
            },
            { begin: n.concat(/# */, i, / *#/) },
            {
              begin: n.concat(
                /# */,
                n.either(a, t),
                / +/,
                n.either(i, r),
                / *#/,
              ),
            },
          ],
        },
        o = e.COMMENT(/'''/, /$/, {
          contains: [{ className: "doctag", begin: /<\/?/, end: />/ }],
        }),
        l = e.COMMENT(null, /$/, {
          variants: [{ begin: /'/ }, { begin: /([\t ]|^)REM(?=\s)/ }],
        })
      return {
        name: "Visual Basic .NET",
        aliases: ["vb"],
        case_insensitive: !0,
        classNameAliases: { label: "symbol" },
        keywords: {
          keyword:
            "addhandler alias aggregate ansi as async assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into iterator join key let lib loop me mid module mustinherit mustoverride mybase myclass namespace narrowing new next notinheritable notoverridable of off on operator option optional order overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly yield",
          built_in:
            "addressof and andalso await directcast gettype getxmlnamespace is isfalse isnot istrue like mod nameof new not or orelse trycast typeof xor cbool cbyte cchar cdate cdbl cdec cint clng cobj csbyte cshort csng cstr cuint culng cushort",
          type: "boolean byte char date decimal double integer long object sbyte short single string uinteger ulong ushort",
          literal: "true false nothing",
        },
        illegal: "//|\\{|\\}|endif|gosub|variant|wend|^\\$ ",
        contains: [
          {
            className: "string",
            begin: /"(""|[^/n])"C\b/,
          },
          {
            className: "string",
            begin: /"/,
            end: /"/,
            illegal: /\n/,
            contains: [{ begin: /""/ }],
          },
          s,
          {
            className: "number",
            relevance: 0,
            variants: [
              {
                begin:
                  /\b\d[\d_]*((\.[\d_]+(E[+-]?[\d_]+)?)|(E[+-]?[\d_]+))[RFD@!#]?/,
              },
              { begin: /\b\d[\d_]*((U?[SIL])|[%&])?/ },
              { begin: /&H[\dA-F_]+((U?[SIL])|[%&])?/ },
              {
                begin: /&O[0-7_]+((U?[SIL])|[%&])?/,
              },
              { begin: /&B[01_]+((U?[SIL])|[%&])?/ },
            ],
          },
          {
            className: "label",
            begin: /^\w+:/,
          },
          o,
          l,
          {
            className: "meta",
            begin:
              /[\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\b/,
            end: /$/,
            keywords: {
              keyword:
                "const disable else elseif enable end externalsource if region then",
            },
            contains: [l],
          },
        ],
      }
    },
    grmr_yaml: (e) => {
      const n = "true false yes no null",
        t = "[\\w#;/?:@&=+$,.~*'()[\\]]+",
        a = {
          className: "string",
          relevance: 0,
          variants: [
            { begin: /'/, end: /'/ },
            { begin: /"/, end: /"/ },
            { begin: /\S+/ },
          ],
          contains: [
            e.BACKSLASH_ESCAPE,
            {
              className: "template-variable",
              variants: [
                { begin: /\{\{/, end: /\}\}/ },
                { begin: /%\{/, end: /\}/ },
              ],
            },
          ],
        },
        i = e.inherit(a, {
          variants: [
            { begin: /'/, end: /'/ },
            { begin: /"/, end: /"/ },
            { begin: /[^\s,{}[\]]+/ },
          ],
        }),
        r = {
          end: ",",
          endsWithParent: !0,
          excludeEnd: !0,
          keywords: n,
          relevance: 0,
        },
        s = {
          begin: /\{/,
          end: /\}/,
          contains: [r],
          illegal: "\\n",
          relevance: 0,
        },
        o = {
          begin: "\\[",
          end: "\\]",
          contains: [r],
          illegal: "\\n",
          relevance: 0,
        },
        l = [
          {
            className: "attr",
            variants: [
              {
                begin: "\\w[\\w :\\/.-]*:(?=[ \t]|$)",
              },
              { begin: '"\\w[\\w :\\/.-]*":(?=[ \t]|$)' },
              {
                begin: "'\\w[\\w :\\/.-]*':(?=[ \t]|$)",
              },
            ],
          },
          { className: "meta", begin: "^---\\s*$", relevance: 10 },
          {
            className: "string",
            begin:
              "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*",
          },
          {
            begin: "<%[%=-]?",
            end: "[%-]?%>",
            subLanguage: "ruby",
            excludeBegin: !0,
            excludeEnd: !0,
            relevance: 0,
          },
          { className: "type", begin: "!\\w+!" + t },
          { className: "type", begin: "!<" + t + ">" },
          { className: "type", begin: "!" + t },
          { className: "type", begin: "!!" + t },
          { className: "meta", begin: "&" + e.UNDERSCORE_IDENT_RE + "$" },
          { className: "meta", begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$" },
          { className: "bullet", begin: "-(?=[ ]|$)", relevance: 0 },
          e.HASH_COMMENT_MODE,
          { beginKeywords: n, keywords: { literal: n } },
          {
            className: "number",
            begin:
              "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b",
          },
          { className: "number", begin: e.C_NUMBER_RE + "\\b", relevance: 0 },
          s,
          o,
          a,
        ],
        c = [...l]
      return (
        c.pop(),
        c.push(i),
        (r.contains = c),
        { name: "YAML", case_insensitive: !0, aliases: ["yml"], contains: l }
      )
    },
  })
  const je = ne
  for (const e of Object.keys(Ue)) {
    const n = e.replace("grmr_", "").replace("_", "-")
    je.registerLanguage(n, Ue[e])
  }
  return je
})()
"object" == typeof exports &&
  "undefined" != typeof module &&
  (module.exports = hljs)

export { hljs }
