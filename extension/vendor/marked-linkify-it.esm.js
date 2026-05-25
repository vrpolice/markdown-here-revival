var Any = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;

var Cc = /[\0-\x1F\x7F-\x9F]/;

var P = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;

var Z = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;

function reFactory (opts) {
  const re = {};
  opts = opts || {};

  re.src_Any = Any.source;
  re.src_Cc = Cc.source;
  re.src_Z = Z.source;
  re.src_P = P.source;

  // \p{\Z\P\Cc\CF} (white spaces + control + format + punctuation)
  re.src_ZPCc = [re.src_Z, re.src_P, re.src_Cc].join('|');

  // \p{\Z\Cc} (white spaces + control)
  re.src_ZCc = [re.src_Z, re.src_Cc].join('|');

  // Experimental. List of chars, completely prohibited in links
  // because can separate it from other part of text
  const text_separators = '[><\uff5c]';

  // All possible word characters (everything without punctuation, spaces & controls)
  // Defined via punctuation & spaces to save space
  // Should be something like \p{\L\N\S\M} (\w but without `_`)
  re.src_pseudo_letter = '(?:(?!' + text_separators + '|' + re.src_ZPCc + ')' + re.src_Any + ')';
  // The same as abothe but without [0-9]
  // var src_pseudo_letter_non_d = '(?:(?![0-9]|' + src_ZPCc + ')' + src_Any + ')';

  re.src_ip4 =

    '(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

  // Prohibit any of "@/[]()" in user/pass to avoid wrong domain fetch.
  re.src_auth = '(?:(?:(?!' + re.src_ZCc + '|[@/\\[\\]()]).)+@)?';

  re.src_port =

    '(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?';

  re.src_host_terminator =

    '(?=$|' + text_separators + '|' + re.src_ZPCc + ')' +
    '(?!' + (opts['---'] ? '-(?!--)|' : '-|') + '_|:\\d|\\.-|\\.(?!$|' + re.src_ZPCc + '))';

  re.src_path =

    '(?:' +
      '[/?#]' +
        '(?:' +
          '(?!' + re.src_ZCc + '|' + text_separators + '|[()[\\]{}.,"\'?!\\-;]).|' +
          '\\[(?:(?!' + re.src_ZCc + '|\\]).)*\\]|' +
          '\\((?:(?!' + re.src_ZCc + '|[)]).)*\\)|' +
          '\\{(?:(?!' + re.src_ZCc + '|[}]).)*\\}|' +
          '\\"(?:(?!' + re.src_ZCc + '|["]).)+\\"|' +
          "\\'(?:(?!" + re.src_ZCc + "|[']).)+\\'|" +

          // allow `I'm_king` if no pair found
          "\\'(?=" + re.src_pseudo_letter + '|[-])|' +

          // google has many dots in "google search" links (#66, #81).
          // github has ... in commit range links,
          // Restrict to
          // - english
          // - percent-encoded
          // - parts of file path
          // - params separator
          // until more examples found.
          '\\.{2,}[a-zA-Z0-9%/&]|' +

          '\\.(?!' + re.src_ZCc + '|[.]|$)|' +
          (opts['---']
            ? '\\-(?!--(?:[^-]|$))(?:-*)|' // `---` => long dash, terminate
            : '\\-+|'
          ) +
          // allow `,,,` in paths
          ',(?!' + re.src_ZCc + '|$)|' +

          // allow `;` if not followed by space-like char
          ';(?!' + re.src_ZCc + '|$)|' +

          // allow `!!!` in paths, but not at the end
          '\\!+(?!' + re.src_ZCc + '|[!]|$)|' +

          '\\?(?!' + re.src_ZCc + '|[?]|$)' +
        ')+' +
      '|\\/' +
    ')?';

  // Allow anything in markdown spec, forbid quote (") at the first position
  // because emails enclosed in quotes are far more common
  re.src_email_name =

    '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*';

  re.src_xn =

    'xn--[a-z0-9\\-]{1,59}';

  // More to read about domain names
  // http://serverfault.com/questions/638260/

  re.src_domain_root =

    // Allow letters & digits (http://test1)
    '(?:' +
      re.src_xn +
      '|' +
      re.src_pseudo_letter + '{1,63}' +
    ')';

  re.src_domain =

    '(?:' +
      re.src_xn +
      '|' +
      '(?:' + re.src_pseudo_letter + ')' +
      '|' +
      '(?:' + re.src_pseudo_letter + '(?:-|' + re.src_pseudo_letter + '){0,61}' + re.src_pseudo_letter + ')' +
    ')';

  re.src_host =

    '(?:' +
    // Don't need IP check, because digits are already allowed in normal domain names
    //   src_ip4 +
    // '|' +
      '(?:(?:(?:' + re.src_domain + ')\\.)*' + re.src_domain/* _root */ + ')' +
    ')';

  re.tpl_host_fuzzy =

    '(?:' +
      re.src_ip4 +
    '|' +
      '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))' +
    ')';

  re.tpl_host_no_ip_fuzzy =

    '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))';

  re.src_host_strict =

    re.src_host + re.src_host_terminator;

  re.tpl_host_fuzzy_strict =

    re.tpl_host_fuzzy + re.src_host_terminator;

  re.src_host_port_strict =

    re.src_host + re.src_port + re.src_host_terminator;

  re.tpl_host_port_fuzzy_strict =

    re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;

  re.tpl_host_port_no_ip_fuzzy_strict =

    re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;

  //
  // Main rules
  //

  // Rude test fuzzy links by host, for quick deny
  re.tpl_host_fuzzy_test =

    'localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:' + re.src_ZPCc + '|>|$))';

  re.tpl_email_fuzzy =

      '(^|' + text_separators + '|"|\\(|' + re.src_ZCc + ')' +
      '(' + re.src_email_name + '@' + re.tpl_host_fuzzy_strict + ')';

  re.tpl_link_fuzzy =
      // Fuzzy link can't be prepended with .:/\- and non punctuation.
      // but can start with > (markdown blockquote)
      '(^|(?![.:/\\-_@])(?:[$+<=>^`|\uff5c]|' + re.src_ZPCc + '))' +
      '((?![$+<=>^`|\uff5c])' + re.tpl_host_port_fuzzy_strict + re.src_path + ')';

  re.tpl_link_no_ip_fuzzy =
      // Fuzzy link can't be prepended with .:/\- and non punctuation.
      // but can start with > (markdown blockquote)
      '(^|(?![.:/\\-_@])(?:[$+<=>^`|\uff5c]|' + re.src_ZPCc + '))' +
      '((?![$+<=>^`|\uff5c])' + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ')';

  return re
}

//
// Helpers
//

// Merge objects
//
function assign (obj /* from1, from2, from3, ... */) {
  const sources = Array.prototype.slice.call(arguments, 1);

  sources.forEach(function (source) {
    if (!source) { return }

    Object.keys(source).forEach(function (key) {
      obj[key] = source[key];
    });
  });

  return obj
}

function _class (obj) { return Object.prototype.toString.call(obj) }
function isString (obj) { return _class(obj) === '[object String]' }
function isObject (obj) { return _class(obj) === '[object Object]' }
function isRegExp (obj) { return _class(obj) === '[object RegExp]' }
function isFunction (obj) { return _class(obj) === '[object Function]' }

function escapeRE (str) { return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&') }

//

const defaultOptions = {
  fuzzyLink: true,
  fuzzyEmail: true,
  fuzzyIP: false
};

function isOptionsObj (obj) {
  return Object.keys(obj || {}).reduce(function (acc, k) {
    /* eslint-disable-next-line no-prototype-builtins */
    return acc || defaultOptions.hasOwnProperty(k)
  }, false)
}

const defaultSchemas = {
  'http:': {
    validate: function (text, pos, self) {
      const tail = text.slice(pos);

      if (!self.re.http) {
        // compile lazily, because "host"-containing variables can change on tlds update.
        self.re.http = new RegExp(
          '^\\/\\/' + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path, 'i'
        );
      }
      if (self.re.http.test(tail)) {
        return tail.match(self.re.http)[0].length
      }
      return 0
    }
  },
  'https:': 'http:',
  'ftp:': 'http:',
  '//': {
    validate: function (text, pos, self) {
      const tail = text.slice(pos);

      if (!self.re.no_http) {
      // compile lazily, because "host"-containing variables can change on tlds update.
        self.re.no_http = new RegExp(
          '^' +
          self.re.src_auth +
          // Don't allow single-level domains, because of false positives like '//test'
          // with code comments
          '(?:localhost|(?:(?:' + self.re.src_domain + ')\\.)+' + self.re.src_domain_root + ')' +
          self.re.src_port +
          self.re.src_host_terminator +
          self.re.src_path,

          'i'
        );
      }

      if (self.re.no_http.test(tail)) {
        // should not be `://` & `///`, that protects from errors in protocol name
        if (pos >= 3 && text[pos - 3] === ':') { return 0 }
        if (pos >= 3 && text[pos - 3] === '/') { return 0 }
        return tail.match(self.re.no_http)[0].length
      }
      return 0
    }
  },
  'mailto:': {
    validate: function (text, pos, self) {
      const tail = text.slice(pos);

      if (!self.re.mailto) {
        self.re.mailto = new RegExp(
          '^' + self.re.src_email_name + '@' + self.re.src_host_strict, 'i'
        );
      }
      if (self.re.mailto.test(tail)) {
        return tail.match(self.re.mailto)[0].length
      }
      return 0
    }
  }
};

// RE pattern for 2-character tlds (autogenerated by ./support/tlds_2char_gen.js)
/* eslint-disable-next-line max-len */
const tlds_2ch_src_re = 'a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]';

// DON'T try to make PRs with changes. Extend TLDs with LinkifyIt.tlds() instead
const tlds_default = 'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split('|');

function resetScanCache (self) {
  self.__index__ = -1;
  self.__text_cache__ = '';
}

function createValidator (re) {
  return function (text, pos) {
    const tail = text.slice(pos);

    if (re.test(tail)) {
      return tail.match(re)[0].length
    }
    return 0
  }
}

function createNormalizer () {
  return function (match, self) {
    self.normalize(match);
  }
}

// Schemas compiler. Build regexps.
//
function compile (self) {
  // Load & clone RE patterns.
  const re = self.re = reFactory(self.__opts__);

  // Define dynamic patterns
  const tlds = self.__tlds__.slice();

  self.onCompile();

  if (!self.__tlds_replaced__) {
    tlds.push(tlds_2ch_src_re);
  }
  tlds.push(re.src_xn);

  re.src_tlds = tlds.join('|');

  function untpl (tpl) { return tpl.replace('%TLDS%', re.src_tlds) }

  re.email_fuzzy = RegExp(untpl(re.tpl_email_fuzzy), 'i');
  re.link_fuzzy = RegExp(untpl(re.tpl_link_fuzzy), 'i');
  re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), 'i');
  re.host_fuzzy_test = RegExp(untpl(re.tpl_host_fuzzy_test), 'i');

  //
  // Compile each schema
  //

  const aliases = [];

  self.__compiled__ = {}; // Reset compiled data

  function schemaError (name, val) {
    throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val)
  }

  Object.keys(self.__schemas__).forEach(function (name) {
    const val = self.__schemas__[name];

    // skip disabled methods
    if (val === null) { return }

    const compiled = { validate: null, link: null };

    self.__compiled__[name] = compiled;

    if (isObject(val)) {
      if (isRegExp(val.validate)) {
        compiled.validate = createValidator(val.validate);
      } else if (isFunction(val.validate)) {
        compiled.validate = val.validate;
      } else {
        schemaError(name, val);
      }

      if (isFunction(val.normalize)) {
        compiled.normalize = val.normalize;
      } else if (!val.normalize) {
        compiled.normalize = createNormalizer();
      } else {
        schemaError(name, val);
      }

      return
    }

    if (isString(val)) {
      aliases.push(name);
      return
    }

    schemaError(name, val);
  });

  //
  // Compile postponed aliases
  //

  aliases.forEach(function (alias) {
    if (!self.__compiled__[self.__schemas__[alias]]) {
      // Silently fail on missed schemas to avoid errons on disable.
      // schemaError(alias, self.__schemas__[alias]);
      return
    }

    self.__compiled__[alias].validate =
      self.__compiled__[self.__schemas__[alias]].validate;
    self.__compiled__[alias].normalize =
      self.__compiled__[self.__schemas__[alias]].normalize;
  });

  //
  // Fake record for guessed links
  //
  self.__compiled__[''] = { validate: null, normalize: createNormalizer() };

  //
  // Build schema condition
  //
  const slist = Object.keys(self.__compiled__)
    .filter(function (name) {
      // Filter disabled & fake schemas
      return name.length > 0 && self.__compiled__[name]
    })
    .map(escapeRE)
    .join('|');
  // (?!_) cause 1.5x slowdown
  self.re.schema_test = RegExp('(^|(?!_)(?:[><\uff5c]|' + re.src_ZPCc + '))(' + slist + ')', 'i');
  self.re.schema_search = RegExp('(^|(?!_)(?:[><\uff5c]|' + re.src_ZPCc + '))(' + slist + ')', 'ig');
  self.re.schema_at_start = RegExp('^' + self.re.schema_search.source, 'i');

  self.re.pretest = RegExp(
    '(' + self.re.schema_test.source + ')|(' + self.re.host_fuzzy_test.source + ')|@',
    'i'
  );

  //
  // Cleanup
  //

  resetScanCache(self);
}

/**
 * class Match
 *
 * Match result. Single element of array, returned by [[LinkifyIt#match]]
 **/
function Match (self, shift) {
  const start = self.__index__;
  const end = self.__last_index__;
  const text = self.__text_cache__.slice(start, end);

  /**
   * Match#schema -> String
   *
   * Prefix (protocol) for matched string.
   **/
  this.schema = self.__schema__.toLowerCase();
  /**
   * Match#index -> Number
   *
   * First position of matched string.
   **/
  this.index = start + shift;
  /**
   * Match#lastIndex -> Number
   *
   * Next position after matched string.
   **/
  this.lastIndex = end + shift;
  /**
   * Match#raw -> String
   *
   * Matched string.
   **/
  this.raw = text;
  /**
   * Match#text -> String
   *
   * Notmalized text of matched string.
   **/
  this.text = text;
  /**
   * Match#url -> String
   *
   * Normalized url of matched string.
   **/
  this.url = text;
}

function createMatch (self, shift) {
  const match = new Match(self, shift);

  self.__compiled__[match.schema].normalize(match, self);

  return match
}

/**
 * class LinkifyIt
 **/

/**
 * new LinkifyIt(schemas, options)
 * - schemas (Object): Optional. Additional schemas to validate (prefix/validator)
 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
 *
 * Creates new linkifier instance with optional additional schemas.
 * Can be called without `new` keyword for convenience.
 *
 * By default understands:
 *
 * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
 * - "fuzzy" links and emails (example.com, foo@bar.com).
 *
 * `schemas` is an object, where each key/value describes protocol/rule:
 *
 * - __key__ - link prefix (usually, protocol name with `:` at the end, `skype:`
 *   for example). `linkify-it` makes shure that prefix is not preceeded with
 *   alphanumeric char and symbols. Only whitespaces and punctuation allowed.
 * - __value__ - rule to check tail after link prefix
 *   - _String_ - just alias to existing rule
 *   - _Object_
 *     - _validate_ - validator function (should return matched length on success),
 *       or `RegExp`.
 *     - _normalize_ - optional function to normalize text & url of matched result
 *       (for example, for @twitter mentions).
 *
 * `options`:
 *
 * - __fuzzyLink__ - recognige URL-s without `http(s):` prefix. Default `true`.
 * - __fuzzyIP__ - allow IPs in fuzzy links above. Can conflict with some texts
 *   like version numbers. Default `false`.
 * - __fuzzyEmail__ - recognize emails without `mailto:` prefix.
 *
 **/
function LinkifyIt (schemas, options) {
  if (!(this instanceof LinkifyIt)) {
    return new LinkifyIt(schemas, options)
  }

  if (!options) {
    if (isOptionsObj(schemas)) {
      options = schemas;
      schemas = {};
    }
  }

  this.__opts__ = assign({}, defaultOptions, options);

  // Cache last tested result. Used to skip repeating steps on next `match` call.
  this.__index__ = -1;
  this.__last_index__ = -1; // Next scan position
  this.__schema__ = '';
  this.__text_cache__ = '';

  this.__schemas__ = assign({}, defaultSchemas, schemas);
  this.__compiled__ = {};

  this.__tlds__ = tlds_default;
  this.__tlds_replaced__ = false;

  this.re = {};

  compile(this);
}

/** chainable
 * LinkifyIt#add(schema, definition)
 * - schema (String): rule name (fixed pattern prefix)
 * - definition (String|RegExp|Object): schema definition
 *
 * Add new rule definition. See constructor description for details.
 **/
LinkifyIt.prototype.add = function add (schema, definition) {
  this.__schemas__[schema] = definition;
  compile(this);
  return this
};

/** chainable
 * LinkifyIt#set(options)
 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
 *
 * Set recognition options for links without schema.
 **/
LinkifyIt.prototype.set = function set (options) {
  this.__opts__ = assign(this.__opts__, options);
  return this
};

/**
 * LinkifyIt#test(text) -> Boolean
 *
 * Searches linkifiable pattern and returns `true` on success or `false` on fail.
 **/
LinkifyIt.prototype.test = function test (text) {
  // Reset scan cache
  this.__text_cache__ = text;
  this.__index__ = -1;

  if (!text.length) { return false }

  let m, ml, me, len, shift, next, re, tld_pos, at_pos;

  // try to scan for link with schema - that's the most simple rule
  if (this.re.schema_test.test(text)) {
    re = this.re.schema_search;
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      len = this.testSchemaAt(text, m[2], re.lastIndex);
      if (len) {
        this.__schema__ = m[2];
        this.__index__ = m.index + m[1].length;
        this.__last_index__ = m.index + m[0].length + len;
        break
      }
    }
  }

  if (this.__opts__.fuzzyLink && this.__compiled__['http:']) {
    // guess schemaless links
    tld_pos = text.search(this.re.host_fuzzy_test);
    if (tld_pos >= 0) {
      // if tld is located after found link - no need to check fuzzy pattern
      if (this.__index__ < 0 || tld_pos < this.__index__) {
        if ((ml = text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {
          shift = ml.index + ml[1].length;

          if (this.__index__ < 0 || shift < this.__index__) {
            this.__schema__ = '';
            this.__index__ = shift;
            this.__last_index__ = ml.index + ml[0].length;
          }
        }
      }
    }
  }

  if (this.__opts__.fuzzyEmail && this.__compiled__['mailto:']) {
    // guess schemaless emails
    at_pos = text.indexOf('@');
    if (at_pos >= 0) {
      // We can't skip this check, because this cases are possible:
      // 192.168.1.1@gmail.com, my.in@example.com
      if ((me = text.match(this.re.email_fuzzy)) !== null) {
        shift = me.index + me[1].length;
        next = me.index + me[0].length;

        if (this.__index__ < 0 || shift < this.__index__ ||
            (shift === this.__index__ && next > this.__last_index__)) {
          this.__schema__ = 'mailto:';
          this.__index__ = shift;
          this.__last_index__ = next;
        }
      }
    }
  }

  return this.__index__ >= 0
};

/**
 * LinkifyIt#pretest(text) -> Boolean
 *
 * Very quick check, that can give false positives. Returns true if link MAY BE
 * can exists. Can be used for speed optimization, when you need to check that
 * link NOT exists.
 **/
LinkifyIt.prototype.pretest = function pretest (text) {
  return this.re.pretest.test(text)
};

/**
 * LinkifyIt#testSchemaAt(text, name, position) -> Number
 * - text (String): text to scan
 * - name (String): rule (schema) name
 * - position (Number): text offset to check from
 *
 * Similar to [[LinkifyIt#test]] but checks only specific protocol tail exactly
 * at given position. Returns length of found pattern (0 on fail).
 **/
LinkifyIt.prototype.testSchemaAt = function testSchemaAt (text, schema, pos) {
  // If not supported schema check requested - terminate
  if (!this.__compiled__[schema.toLowerCase()]) {
    return 0
  }
  return this.__compiled__[schema.toLowerCase()].validate(text, pos, this)
};

/**
 * LinkifyIt#match(text) -> Array|null
 *
 * Returns array of found link descriptions or `null` on fail. We strongly
 * recommend to use [[LinkifyIt#test]] first, for best speed.
 *
 * ##### Result match description
 *
 * - __schema__ - link schema, can be empty for fuzzy links, or `//` for
 *   protocol-neutral  links.
 * - __index__ - offset of matched text
 * - __lastIndex__ - index of next char after mathch end
 * - __raw__ - matched text
 * - __text__ - normalized text
 * - __url__ - link, generated from matched text
 **/
LinkifyIt.prototype.match = function match (text) {
  const result = [];
  let shift = 0;

  // Try to take previous element from cache, if .test() called before
  if (this.__index__ >= 0 && this.__text_cache__ === text) {
    result.push(createMatch(this, shift));
    shift = this.__last_index__;
  }

  // Cut head if cache was used
  let tail = shift ? text.slice(shift) : text;

  // Scan string until end reached
  while (this.test(tail)) {
    result.push(createMatch(this, shift));

    tail = tail.slice(this.__last_index__);
    shift += this.__last_index__;
  }

  if (result.length) {
    return result
  }

  return null
};

/**
 * LinkifyIt#matchAtStart(text) -> Match|null
 *
 * Returns fully-formed (not fuzzy) link if it starts at the beginning
 * of the string, and null otherwise.
 **/
LinkifyIt.prototype.matchAtStart = function matchAtStart (text) {
  // Reset scan cache
  this.__text_cache__ = text;
  this.__index__ = -1;

  if (!text.length) return null

  const m = this.re.schema_at_start.exec(text);
  if (!m) return null

  const len = this.testSchemaAt(text, m[2], m[0].length);
  if (!len) return null

  this.__schema__ = m[2];
  this.__index__ = m.index + m[1].length;
  this.__last_index__ = m.index + m[0].length + len;

  return createMatch(this, 0)
};

/** chainable
 * LinkifyIt#tlds(list [, keepOld]) -> this
 * - list (Array): list of tlds
 * - keepOld (Boolean): merge with current list if `true` (`false` by default)
 *
 * Load (or merge) new tlds list. Those are user for fuzzy links (without prefix)
 * to avoid false positives. By default this algorythm used:
 *
 * - hostname with any 2-letter root zones are ok.
 * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
 *   are ok.
 * - encoded (`xn--...`) root zones are ok.
 *
 * If list is replaced, then exact match for 2-chars root zones will be checked.
 **/
LinkifyIt.prototype.tlds = function tlds (list, keepOld) {
  list = Array.isArray(list) ? list : [list];

  if (!keepOld) {
    this.__tlds__ = list.slice();
    this.__tlds_replaced__ = true;
    compile(this);
    return this
  }

  this.__tlds__ = this.__tlds__.concat(list)
    .sort()
    .filter(function (el, idx, arr) {
      return el !== arr[idx - 1]
    })
    .reverse();

  compile(this);
  return this
};

/**
 * LinkifyIt#normalize(match)
 *
 * Default normalizer (if schema does not define it's own).
 **/
LinkifyIt.prototype.normalize = function normalize (match) {
  // Do minimal possible changes by default. Need to collect feedback prior
  // to move forward https://github.com/markdown-it/linkify-it/issues/1

  if (!match.schema) { match.url = 'http://' + match.url; }

  if (match.schema === 'mailto:' && !/^mailto:/i.test(match.url)) {
    match.url = 'mailto:' + match.url;
  }
};

/**
 * LinkifyIt#onCompile()
 *
 * Override to modify basic RegExp-s.
 **/
LinkifyIt.prototype.onCompile = function onCompile () {
};

function markedLinkifyIt(schemas = {}, options = {}) {
  const linkify = new LinkifyIt(schemas, options);
  addTlds(linkify, options);

  return {
    extensions: [{
      name: 'autolink',
      level: 'inline',
      start: (src) => {
        const link = getNextLink(linkify, src);

        if (!link) {
          return;
        }

        return link.index;
      },
      tokenizer(src) {
        if (this.lexer.state.inLink) {
          return;
        }

        const link = getNextLink(linkify, src);

        if (!link) {
          return;
        }

        let raw;
        if (link.index === 0) {
          raw = link.raw;
        } else if (link.index === 1 && src.charAt(0) === '<' && src.charAt(link.lastIndex) === '>') {
          raw = `<${link.raw}>`;
        }

        if (!raw) {
          return;
        }

        return {
          type: 'link',
          raw,
          text: link.text,
          href: link.url,
          tokens: [
            {
              type: 'text',
              raw: link.text,
              text: link.text,
            },
          ],
        };
      },
    }],
  };
}

function getNextLink(linkify, src) {
  const match = linkify.match(src);

  if (!match || !match.length) {
    return;
  }

  return match[0];
}

function addTlds(linkify, options) {
  const tlds = options.tlds;
  delete options.tlds;
  const tldsKeepOld = options.tldsKeepOld;
  delete options.tldsKeepOld;

  if (tlds) {
    linkify.tlds(tlds, tldsKeepOld);
  }
}

export { markedLinkifyIt as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2VkLWxpbmtpZnktaXQuZXNtLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvdWMubWljcm8vcHJvcGVydGllcy9BbnkvcmVnZXgubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3VjLm1pY3JvL2NhdGVnb3JpZXMvQ2MvcmVnZXgubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3VjLm1pY3JvL2NhdGVnb3JpZXMvUC9yZWdleC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvdWMubWljcm8vY2F0ZWdvcmllcy9aL3JlZ2V4Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9saW5raWZ5LWl0L2xpYi9yZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbGlua2lmeS1pdC9pbmRleC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbWFya2VkLWxpbmtpZnktaXQvc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IC9bXFwwLVxcdUQ3RkZcXHVFMDAwLVxcdUZGRkZdfFtcXHVEODAwLVxcdURCRkZdW1xcdURDMDAtXFx1REZGRl18W1xcdUQ4MDAtXFx1REJGRl0oPyFbXFx1REMwMC1cXHVERkZGXSl8KD86W15cXHVEODAwLVxcdURCRkZdfF4pW1xcdURDMDAtXFx1REZGRl0vIiwiZXhwb3J0IGRlZmF1bHQgL1tcXDAtXFx4MUZcXHg3Ri1cXHg5Rl0vIiwiZXhwb3J0IGRlZmF1bHQgL1shLSMlLVxcKiwtXFwvOjtcXD9AXFxbLVxcXV9cXHtcXH1cXHhBMVxceEE3XFx4QUJcXHhCNlxceEI3XFx4QkJcXHhCRlxcdTAzN0VcXHUwMzg3XFx1MDU1QS1cXHUwNTVGXFx1MDU4OVxcdTA1OEFcXHUwNUJFXFx1MDVDMFxcdTA1QzNcXHUwNUM2XFx1MDVGM1xcdTA1RjRcXHUwNjA5XFx1MDYwQVxcdTA2MENcXHUwNjBEXFx1MDYxQlxcdTA2MUQtXFx1MDYxRlxcdTA2NkEtXFx1MDY2RFxcdTA2RDRcXHUwNzAwLVxcdTA3MERcXHUwN0Y3LVxcdTA3RjlcXHUwODMwLVxcdTA4M0VcXHUwODVFXFx1MDk2NFxcdTA5NjVcXHUwOTcwXFx1MDlGRFxcdTBBNzZcXHUwQUYwXFx1MEM3N1xcdTBDODRcXHUwREY0XFx1MEU0RlxcdTBFNUFcXHUwRTVCXFx1MEYwNC1cXHUwRjEyXFx1MEYxNFxcdTBGM0EtXFx1MEYzRFxcdTBGODVcXHUwRkQwLVxcdTBGRDRcXHUwRkQ5XFx1MEZEQVxcdTEwNEEtXFx1MTA0RlxcdTEwRkJcXHUxMzYwLVxcdTEzNjhcXHUxNDAwXFx1MTY2RVxcdTE2OUJcXHUxNjlDXFx1MTZFQi1cXHUxNkVEXFx1MTczNVxcdTE3MzZcXHUxN0Q0LVxcdTE3RDZcXHUxN0Q4LVxcdTE3REFcXHUxODAwLVxcdTE4MEFcXHUxOTQ0XFx1MTk0NVxcdTFBMUVcXHUxQTFGXFx1MUFBMC1cXHUxQUE2XFx1MUFBOC1cXHUxQUFEXFx1MUI1QS1cXHUxQjYwXFx1MUI3RFxcdTFCN0VcXHUxQkZDLVxcdTFCRkZcXHUxQzNCLVxcdTFDM0ZcXHUxQzdFXFx1MUM3RlxcdTFDQzAtXFx1MUNDN1xcdTFDRDNcXHUyMDEwLVxcdTIwMjdcXHUyMDMwLVxcdTIwNDNcXHUyMDQ1LVxcdTIwNTFcXHUyMDUzLVxcdTIwNUVcXHUyMDdEXFx1MjA3RVxcdTIwOERcXHUyMDhFXFx1MjMwOC1cXHUyMzBCXFx1MjMyOVxcdTIzMkFcXHUyNzY4LVxcdTI3NzVcXHUyN0M1XFx1MjdDNlxcdTI3RTYtXFx1MjdFRlxcdTI5ODMtXFx1Mjk5OFxcdTI5RDgtXFx1MjlEQlxcdTI5RkNcXHUyOUZEXFx1MkNGOS1cXHUyQ0ZDXFx1MkNGRVxcdTJDRkZcXHUyRDcwXFx1MkUwMC1cXHUyRTJFXFx1MkUzMC1cXHUyRTRGXFx1MkU1Mi1cXHUyRTVEXFx1MzAwMS1cXHUzMDAzXFx1MzAwOC1cXHUzMDExXFx1MzAxNC1cXHUzMDFGXFx1MzAzMFxcdTMwM0RcXHUzMEEwXFx1MzBGQlxcdUE0RkVcXHVBNEZGXFx1QTYwRC1cXHVBNjBGXFx1QTY3M1xcdUE2N0VcXHVBNkYyLVxcdUE2RjdcXHVBODc0LVxcdUE4NzdcXHVBOENFXFx1QThDRlxcdUE4RjgtXFx1QThGQVxcdUE4RkNcXHVBOTJFXFx1QTkyRlxcdUE5NUZcXHVBOUMxLVxcdUE5Q0RcXHVBOURFXFx1QTlERlxcdUFBNUMtXFx1QUE1RlxcdUFBREVcXHVBQURGXFx1QUFGMFxcdUFBRjFcXHVBQkVCXFx1RkQzRVxcdUZEM0ZcXHVGRTEwLVxcdUZFMTlcXHVGRTMwLVxcdUZFNTJcXHVGRTU0LVxcdUZFNjFcXHVGRTYzXFx1RkU2OFxcdUZFNkFcXHVGRTZCXFx1RkYwMS1cXHVGRjAzXFx1RkYwNS1cXHVGRjBBXFx1RkYwQy1cXHVGRjBGXFx1RkYxQVxcdUZGMUJcXHVGRjFGXFx1RkYyMFxcdUZGM0ItXFx1RkYzRFxcdUZGM0ZcXHVGRjVCXFx1RkY1RFxcdUZGNUYtXFx1RkY2NV18XFx1RDgwMFtcXHVERDAwLVxcdUREMDJcXHVERjlGXFx1REZEMF18XFx1RDgwMVxcdURENkZ8XFx1RDgwMltcXHVEQzU3XFx1REQxRlxcdUREM0ZcXHVERTUwLVxcdURFNThcXHVERTdGXFx1REVGMC1cXHVERUY2XFx1REYzOS1cXHVERjNGXFx1REY5OS1cXHVERjlDXXxcXHVEODAzW1xcdURFQURcXHVERjU1LVxcdURGNTlcXHVERjg2LVxcdURGODldfFxcdUQ4MDRbXFx1REM0Ny1cXHVEQzREXFx1RENCQlxcdURDQkNcXHVEQ0JFLVxcdURDQzFcXHVERDQwLVxcdURENDNcXHVERDc0XFx1REQ3NVxcdUREQzUtXFx1RERDOFxcdUREQ0RcXHVERERCXFx1RERERC1cXHVERERGXFx1REUzOC1cXHVERTNEXFx1REVBOV18XFx1RDgwNVtcXHVEQzRCLVxcdURDNEZcXHVEQzVBXFx1REM1QlxcdURDNURcXHVEQ0M2XFx1RERDMS1cXHVEREQ3XFx1REU0MS1cXHVERTQzXFx1REU2MC1cXHVERTZDXFx1REVCOVxcdURGM0MtXFx1REYzRV18XFx1RDgwNltcXHVEQzNCXFx1REQ0NC1cXHVERDQ2XFx1RERFMlxcdURFM0YtXFx1REU0NlxcdURFOUEtXFx1REU5Q1xcdURFOUUtXFx1REVBMlxcdURGMDAtXFx1REYwOV18XFx1RDgwN1tcXHVEQzQxLVxcdURDNDVcXHVEQzcwXFx1REM3MVxcdURFRjdcXHVERUY4XFx1REY0My1cXHVERjRGXFx1REZGRl18XFx1RDgwOVtcXHVEQzcwLVxcdURDNzRdfFxcdUQ4MEJbXFx1REZGMVxcdURGRjJdfFxcdUQ4MUFbXFx1REU2RVxcdURFNkZcXHVERUY1XFx1REYzNy1cXHVERjNCXFx1REY0NF18XFx1RDgxQltcXHVERTk3LVxcdURFOUFcXHVERkUyXXxcXHVEODJGXFx1REM5RnxcXHVEODM2W1xcdURFODctXFx1REU4Ql18XFx1RDgzQVtcXHVERDVFXFx1REQ1Rl0vIiwiZXhwb3J0IGRlZmF1bHQgL1sgXFx4QTBcXHUxNjgwXFx1MjAwMC1cXHUyMDBBXFx1MjAyOFxcdTIwMjlcXHUyMDJGXFx1MjA1RlxcdTMwMDBdLyIsImltcG9ydCB7IEFueSwgQ2MsIFosIFAgfSBmcm9tICd1Yy5taWNybydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdHMpIHtcbiAgY29uc3QgcmUgPSB7fVxuICBvcHRzID0gb3B0cyB8fCB7fVxuXG4gIHJlLnNyY19BbnkgPSBBbnkuc291cmNlXG4gIHJlLnNyY19DYyA9IENjLnNvdXJjZVxuICByZS5zcmNfWiA9IFouc291cmNlXG4gIHJlLnNyY19QID0gUC5zb3VyY2VcblxuICAvLyBcXHB7XFxaXFxQXFxDY1xcQ0Z9ICh3aGl0ZSBzcGFjZXMgKyBjb250cm9sICsgZm9ybWF0ICsgcHVuY3R1YXRpb24pXG4gIHJlLnNyY19aUENjID0gW3JlLnNyY19aLCByZS5zcmNfUCwgcmUuc3JjX0NjXS5qb2luKCd8JylcblxuICAvLyBcXHB7XFxaXFxDY30gKHdoaXRlIHNwYWNlcyArIGNvbnRyb2wpXG4gIHJlLnNyY19aQ2MgPSBbcmUuc3JjX1osIHJlLnNyY19DY10uam9pbignfCcpXG5cbiAgLy8gRXhwZXJpbWVudGFsLiBMaXN0IG9mIGNoYXJzLCBjb21wbGV0ZWx5IHByb2hpYml0ZWQgaW4gbGlua3NcbiAgLy8gYmVjYXVzZSBjYW4gc2VwYXJhdGUgaXQgZnJvbSBvdGhlciBwYXJ0IG9mIHRleHRcbiAgY29uc3QgdGV4dF9zZXBhcmF0b3JzID0gJ1s+PFxcdWZmNWNdJ1xuXG4gIC8vIEFsbCBwb3NzaWJsZSB3b3JkIGNoYXJhY3RlcnMgKGV2ZXJ5dGhpbmcgd2l0aG91dCBwdW5jdHVhdGlvbiwgc3BhY2VzICYgY29udHJvbHMpXG4gIC8vIERlZmluZWQgdmlhIHB1bmN0dWF0aW9uICYgc3BhY2VzIHRvIHNhdmUgc3BhY2VcbiAgLy8gU2hvdWxkIGJlIHNvbWV0aGluZyBsaWtlIFxccHtcXExcXE5cXFNcXE19IChcXHcgYnV0IHdpdGhvdXQgYF9gKVxuICByZS5zcmNfcHNldWRvX2xldHRlciA9ICcoPzooPyEnICsgdGV4dF9zZXBhcmF0b3JzICsgJ3wnICsgcmUuc3JjX1pQQ2MgKyAnKScgKyByZS5zcmNfQW55ICsgJyknXG4gIC8vIFRoZSBzYW1lIGFzIGFib3RoZSBidXQgd2l0aG91dCBbMC05XVxuICAvLyB2YXIgc3JjX3BzZXVkb19sZXR0ZXJfbm9uX2QgPSAnKD86KD8hWzAtOV18JyArIHNyY19aUENjICsgJyknICsgc3JjX0FueSArICcpJztcblxuICByZS5zcmNfaXA0ID1cblxuICAgICcoPzooMjVbMC01XXwyWzAtNF1bMC05XXxbMDFdP1swLTldWzAtOV0/KVxcXFwuKXszfSgyNVswLTVdfDJbMC00XVswLTldfFswMV0/WzAtOV1bMC05XT8pJ1xuXG4gIC8vIFByb2hpYml0IGFueSBvZiBcIkAvW10oKVwiIGluIHVzZXIvcGFzcyB0byBhdm9pZCB3cm9uZyBkb21haW4gZmV0Y2guXG4gIHJlLnNyY19hdXRoID0gJyg/Oig/Oig/IScgKyByZS5zcmNfWkNjICsgJ3xbQC9cXFxcW1xcXFxdKCldKS4pK0ApPydcblxuICByZS5zcmNfcG9ydCA9XG5cbiAgICAnKD86Oig/OjYoPzpbMC00XVxcXFxkezN9fDUoPzpbMC00XVxcXFxkezJ9fDUoPzpbMC0yXVxcXFxkfDNbMC01XSkpKXxbMS01XT9cXFxcZHsxLDR9KSk/J1xuXG4gIHJlLnNyY19ob3N0X3Rlcm1pbmF0b3IgPVxuXG4gICAgJyg/PSR8JyArIHRleHRfc2VwYXJhdG9ycyArICd8JyArIHJlLnNyY19aUENjICsgJyknICtcbiAgICAnKD8hJyArIChvcHRzWyctLS0nXSA/ICctKD8hLS0pfCcgOiAnLXwnKSArICdffDpcXFxcZHxcXFxcLi18XFxcXC4oPyEkfCcgKyByZS5zcmNfWlBDYyArICcpKSdcblxuICByZS5zcmNfcGF0aCA9XG5cbiAgICAnKD86JyArXG4gICAgICAnWy8/I10nICtcbiAgICAgICAgJyg/OicgK1xuICAgICAgICAgICcoPyEnICsgcmUuc3JjX1pDYyArICd8JyArIHRleHRfc2VwYXJhdG9ycyArICd8WygpW1xcXFxde30uLFwiXFwnPyFcXFxcLTtdKS58JyArXG4gICAgICAgICAgJ1xcXFxbKD86KD8hJyArIHJlLnNyY19aQ2MgKyAnfFxcXFxdKS4pKlxcXFxdfCcgK1xuICAgICAgICAgICdcXFxcKCg/Oig/IScgKyByZS5zcmNfWkNjICsgJ3xbKV0pLikqXFxcXCl8JyArXG4gICAgICAgICAgJ1xcXFx7KD86KD8hJyArIHJlLnNyY19aQ2MgKyAnfFt9XSkuKSpcXFxcfXwnICtcbiAgICAgICAgICAnXFxcXFwiKD86KD8hJyArIHJlLnNyY19aQ2MgKyAnfFtcIl0pLikrXFxcXFwifCcgK1xuICAgICAgICAgIFwiXFxcXCcoPzooPyFcIiArIHJlLnNyY19aQ2MgKyBcInxbJ10pLikrXFxcXCd8XCIgK1xuXG4gICAgICAgICAgLy8gYWxsb3cgYEknbV9raW5nYCBpZiBubyBwYWlyIGZvdW5kXG4gICAgICAgICAgXCJcXFxcJyg/PVwiICsgcmUuc3JjX3BzZXVkb19sZXR0ZXIgKyAnfFstXSl8JyArXG5cbiAgICAgICAgICAvLyBnb29nbGUgaGFzIG1hbnkgZG90cyBpbiBcImdvb2dsZSBzZWFyY2hcIiBsaW5rcyAoIzY2LCAjODEpLlxuICAgICAgICAgIC8vIGdpdGh1YiBoYXMgLi4uIGluIGNvbW1pdCByYW5nZSBsaW5rcyxcbiAgICAgICAgICAvLyBSZXN0cmljdCB0b1xuICAgICAgICAgIC8vIC0gZW5nbGlzaFxuICAgICAgICAgIC8vIC0gcGVyY2VudC1lbmNvZGVkXG4gICAgICAgICAgLy8gLSBwYXJ0cyBvZiBmaWxlIHBhdGhcbiAgICAgICAgICAvLyAtIHBhcmFtcyBzZXBhcmF0b3JcbiAgICAgICAgICAvLyB1bnRpbCBtb3JlIGV4YW1wbGVzIGZvdW5kLlxuICAgICAgICAgICdcXFxcLnsyLH1bYS16QS1aMC05JS8mXXwnICtcblxuICAgICAgICAgICdcXFxcLig/IScgKyByZS5zcmNfWkNjICsgJ3xbLl18JCl8JyArXG4gICAgICAgICAgKG9wdHNbJy0tLSddXG4gICAgICAgICAgICA/ICdcXFxcLSg/IS0tKD86W14tXXwkKSkoPzotKil8JyAvLyBgLS0tYCA9PiBsb25nIGRhc2gsIHRlcm1pbmF0ZVxuICAgICAgICAgICAgOiAnXFxcXC0rfCdcbiAgICAgICAgICApICtcbiAgICAgICAgICAvLyBhbGxvdyBgLCwsYCBpbiBwYXRoc1xuICAgICAgICAgICcsKD8hJyArIHJlLnNyY19aQ2MgKyAnfCQpfCcgK1xuXG4gICAgICAgICAgLy8gYWxsb3cgYDtgIGlmIG5vdCBmb2xsb3dlZCBieSBzcGFjZS1saWtlIGNoYXJcbiAgICAgICAgICAnOyg/IScgKyByZS5zcmNfWkNjICsgJ3wkKXwnICtcblxuICAgICAgICAgIC8vIGFsbG93IGAhISFgIGluIHBhdGhzLCBidXQgbm90IGF0IHRoZSBlbmRcbiAgICAgICAgICAnXFxcXCErKD8hJyArIHJlLnNyY19aQ2MgKyAnfFshXXwkKXwnICtcblxuICAgICAgICAgICdcXFxcPyg/IScgKyByZS5zcmNfWkNjICsgJ3xbP118JCknICtcbiAgICAgICAgJykrJyArXG4gICAgICAnfFxcXFwvJyArXG4gICAgJyk/J1xuXG4gIC8vIEFsbG93IGFueXRoaW5nIGluIG1hcmtkb3duIHNwZWMsIGZvcmJpZCBxdW90ZSAoXCIpIGF0IHRoZSBmaXJzdCBwb3NpdGlvblxuICAvLyBiZWNhdXNlIGVtYWlscyBlbmNsb3NlZCBpbiBxdW90ZXMgYXJlIGZhciBtb3JlIGNvbW1vblxuICByZS5zcmNfZW1haWxfbmFtZSA9XG5cbiAgICAnW1xcXFwtOzomPVxcXFwrXFxcXCQsXFxcXC5hLXpBLVowLTlfXVtcXFxcLTs6Jj1cXFxcK1xcXFwkLFxcXFxcIlxcXFwuYS16QS1aMC05X10qJ1xuXG4gIHJlLnNyY194biA9XG5cbiAgICAneG4tLVthLXowLTlcXFxcLV17MSw1OX0nXG5cbiAgLy8gTW9yZSB0byByZWFkIGFib3V0IGRvbWFpbiBuYW1lc1xuICAvLyBodHRwOi8vc2VydmVyZmF1bHQuY29tL3F1ZXN0aW9ucy82MzgyNjAvXG5cbiAgcmUuc3JjX2RvbWFpbl9yb290ID1cblxuICAgIC8vIEFsbG93IGxldHRlcnMgJiBkaWdpdHMgKGh0dHA6Ly90ZXN0MSlcbiAgICAnKD86JyArXG4gICAgICByZS5zcmNfeG4gK1xuICAgICAgJ3wnICtcbiAgICAgIHJlLnNyY19wc2V1ZG9fbGV0dGVyICsgJ3sxLDYzfScgK1xuICAgICcpJ1xuXG4gIHJlLnNyY19kb21haW4gPVxuXG4gICAgJyg/OicgK1xuICAgICAgcmUuc3JjX3huICtcbiAgICAgICd8JyArXG4gICAgICAnKD86JyArIHJlLnNyY19wc2V1ZG9fbGV0dGVyICsgJyknICtcbiAgICAgICd8JyArXG4gICAgICAnKD86JyArIHJlLnNyY19wc2V1ZG9fbGV0dGVyICsgJyg/Oi18JyArIHJlLnNyY19wc2V1ZG9fbGV0dGVyICsgJyl7MCw2MX0nICsgcmUuc3JjX3BzZXVkb19sZXR0ZXIgKyAnKScgK1xuICAgICcpJ1xuXG4gIHJlLnNyY19ob3N0ID1cblxuICAgICcoPzonICtcbiAgICAvLyBEb24ndCBuZWVkIElQIGNoZWNrLCBiZWNhdXNlIGRpZ2l0cyBhcmUgYWxyZWFkeSBhbGxvd2VkIGluIG5vcm1hbCBkb21haW4gbmFtZXNcbiAgICAvLyAgIHNyY19pcDQgK1xuICAgIC8vICd8JyArXG4gICAgICAnKD86KD86KD86JyArIHJlLnNyY19kb21haW4gKyAnKVxcXFwuKSonICsgcmUuc3JjX2RvbWFpbi8qIF9yb290ICovICsgJyknICtcbiAgICAnKSdcblxuICByZS50cGxfaG9zdF9mdXp6eSA9XG5cbiAgICAnKD86JyArXG4gICAgICByZS5zcmNfaXA0ICtcbiAgICAnfCcgK1xuICAgICAgJyg/Oig/Oig/OicgKyByZS5zcmNfZG9tYWluICsgJylcXFxcLikrKD86JVRMRFMlKSknICtcbiAgICAnKSdcblxuICByZS50cGxfaG9zdF9ub19pcF9mdXp6eSA9XG5cbiAgICAnKD86KD86KD86JyArIHJlLnNyY19kb21haW4gKyAnKVxcXFwuKSsoPzolVExEUyUpKSdcblxuICByZS5zcmNfaG9zdF9zdHJpY3QgPVxuXG4gICAgcmUuc3JjX2hvc3QgKyByZS5zcmNfaG9zdF90ZXJtaW5hdG9yXG5cbiAgcmUudHBsX2hvc3RfZnV6enlfc3RyaWN0ID1cblxuICAgIHJlLnRwbF9ob3N0X2Z1enp5ICsgcmUuc3JjX2hvc3RfdGVybWluYXRvclxuXG4gIHJlLnNyY19ob3N0X3BvcnRfc3RyaWN0ID1cblxuICAgIHJlLnNyY19ob3N0ICsgcmUuc3JjX3BvcnQgKyByZS5zcmNfaG9zdF90ZXJtaW5hdG9yXG5cbiAgcmUudHBsX2hvc3RfcG9ydF9mdXp6eV9zdHJpY3QgPVxuXG4gICAgcmUudHBsX2hvc3RfZnV6enkgKyByZS5zcmNfcG9ydCArIHJlLnNyY19ob3N0X3Rlcm1pbmF0b3JcblxuICByZS50cGxfaG9zdF9wb3J0X25vX2lwX2Z1enp5X3N0cmljdCA9XG5cbiAgICByZS50cGxfaG9zdF9ub19pcF9mdXp6eSArIHJlLnNyY19wb3J0ICsgcmUuc3JjX2hvc3RfdGVybWluYXRvclxuXG4gIC8vXG4gIC8vIE1haW4gcnVsZXNcbiAgLy9cblxuICAvLyBSdWRlIHRlc3QgZnV6enkgbGlua3MgYnkgaG9zdCwgZm9yIHF1aWNrIGRlbnlcbiAgcmUudHBsX2hvc3RfZnV6enlfdGVzdCA9XG5cbiAgICAnbG9jYWxob3N0fHd3d1xcXFwufFxcXFwuXFxcXGR7MSwzfVxcXFwufCg/OlxcXFwuKD86JVRMRFMlKSg/OicgKyByZS5zcmNfWlBDYyArICd8PnwkKSknXG5cbiAgcmUudHBsX2VtYWlsX2Z1enp5ID1cblxuICAgICAgJyhefCcgKyB0ZXh0X3NlcGFyYXRvcnMgKyAnfFwifFxcXFwofCcgKyByZS5zcmNfWkNjICsgJyknICtcbiAgICAgICcoJyArIHJlLnNyY19lbWFpbF9uYW1lICsgJ0AnICsgcmUudHBsX2hvc3RfZnV6enlfc3RyaWN0ICsgJyknXG5cbiAgcmUudHBsX2xpbmtfZnV6enkgPVxuICAgICAgLy8gRnV6enkgbGluayBjYW4ndCBiZSBwcmVwZW5kZWQgd2l0aCAuOi9cXC0gYW5kIG5vbiBwdW5jdHVhdGlvbi5cbiAgICAgIC8vIGJ1dCBjYW4gc3RhcnQgd2l0aCA+IChtYXJrZG93biBibG9ja3F1b3RlKVxuICAgICAgJyhefCg/IVsuOi9cXFxcLV9AXSkoPzpbJCs8PT5eYHxcXHVmZjVjXXwnICsgcmUuc3JjX1pQQ2MgKyAnKSknICtcbiAgICAgICcoKD8hWyQrPD0+XmB8XFx1ZmY1Y10pJyArIHJlLnRwbF9ob3N0X3BvcnRfZnV6enlfc3RyaWN0ICsgcmUuc3JjX3BhdGggKyAnKSdcblxuICByZS50cGxfbGlua19ub19pcF9mdXp6eSA9XG4gICAgICAvLyBGdXp6eSBsaW5rIGNhbid0IGJlIHByZXBlbmRlZCB3aXRoIC46L1xcLSBhbmQgbm9uIHB1bmN0dWF0aW9uLlxuICAgICAgLy8gYnV0IGNhbiBzdGFydCB3aXRoID4gKG1hcmtkb3duIGJsb2NrcXVvdGUpXG4gICAgICAnKF58KD8hWy46L1xcXFwtX0BdKSg/OlskKzw9Pl5gfFxcdWZmNWNdfCcgKyByZS5zcmNfWlBDYyArICcpKScgK1xuICAgICAgJygoPyFbJCs8PT5eYHxcXHVmZjVjXSknICsgcmUudHBsX2hvc3RfcG9ydF9ub19pcF9mdXp6eV9zdHJpY3QgKyByZS5zcmNfcGF0aCArICcpJ1xuXG4gIHJldHVybiByZVxufVxuIiwiaW1wb3J0IHJlRmFjdG9yeSBmcm9tICcuL2xpYi9yZS5tanMnXG5cbi8vXG4vLyBIZWxwZXJzXG4vL1xuXG4vLyBNZXJnZSBvYmplY3RzXG4vL1xuZnVuY3Rpb24gYXNzaWduIChvYmogLyogZnJvbTEsIGZyb20yLCBmcm9tMywgLi4uICovKSB7XG4gIGNvbnN0IHNvdXJjZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG5cbiAgc291cmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICBpZiAoIXNvdXJjZSkgeyByZXR1cm4gfVxuXG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIG9ialtrZXldID0gc291cmNlW2tleV1cbiAgICB9KVxuICB9KVxuXG4gIHJldHVybiBvYmpcbn1cblxuZnVuY3Rpb24gX2NsYXNzIChvYmopIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopIH1cbmZ1bmN0aW9uIGlzU3RyaW5nIChvYmopIHsgcmV0dXJuIF9jbGFzcyhvYmopID09PSAnW29iamVjdCBTdHJpbmddJyB9XG5mdW5jdGlvbiBpc09iamVjdCAob2JqKSB7IHJldHVybiBfY2xhc3Mob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgfVxuZnVuY3Rpb24gaXNSZWdFeHAgKG9iaikgeyByZXR1cm4gX2NsYXNzKG9iaikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nIH1cbmZ1bmN0aW9uIGlzRnVuY3Rpb24gKG9iaikgeyByZXR1cm4gX2NsYXNzKG9iaikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScgfVxuXG5mdW5jdGlvbiBlc2NhcGVSRSAoc3RyKSB7IHJldHVybiBzdHIucmVwbGFjZSgvWy4/KiteJFtcXF1cXFxcKCl7fXwtXS9nLCAnXFxcXCQmJykgfVxuXG4vL1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgZnV6enlMaW5rOiB0cnVlLFxuICBmdXp6eUVtYWlsOiB0cnVlLFxuICBmdXp6eUlQOiBmYWxzZVxufVxuXG5mdW5jdGlvbiBpc09wdGlvbnNPYmogKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqIHx8IHt9KS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgaykge1xuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnMgKi9cbiAgICByZXR1cm4gYWNjIHx8IGRlZmF1bHRPcHRpb25zLmhhc093blByb3BlcnR5KGspXG4gIH0sIGZhbHNlKVxufVxuXG5jb25zdCBkZWZhdWx0U2NoZW1hcyA9IHtcbiAgJ2h0dHA6Jzoge1xuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAodGV4dCwgcG9zLCBzZWxmKSB7XG4gICAgICBjb25zdCB0YWlsID0gdGV4dC5zbGljZShwb3MpXG5cbiAgICAgIGlmICghc2VsZi5yZS5odHRwKSB7XG4gICAgICAgIC8vIGNvbXBpbGUgbGF6aWx5LCBiZWNhdXNlIFwiaG9zdFwiLWNvbnRhaW5pbmcgdmFyaWFibGVzIGNhbiBjaGFuZ2Ugb24gdGxkcyB1cGRhdGUuXG4gICAgICAgIHNlbGYucmUuaHR0cCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgJ15cXFxcL1xcXFwvJyArIHNlbGYucmUuc3JjX2F1dGggKyBzZWxmLnJlLnNyY19ob3N0X3BvcnRfc3RyaWN0ICsgc2VsZi5yZS5zcmNfcGF0aCwgJ2knXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGlmIChzZWxmLnJlLmh0dHAudGVzdCh0YWlsKSkge1xuICAgICAgICByZXR1cm4gdGFpbC5tYXRjaChzZWxmLnJlLmh0dHApWzBdLmxlbmd0aFxuICAgICAgfVxuICAgICAgcmV0dXJuIDBcbiAgICB9XG4gIH0sXG4gICdodHRwczonOiAnaHR0cDonLFxuICAnZnRwOic6ICdodHRwOicsXG4gICcvLyc6IHtcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKHRleHQsIHBvcywgc2VsZikge1xuICAgICAgY29uc3QgdGFpbCA9IHRleHQuc2xpY2UocG9zKVxuXG4gICAgICBpZiAoIXNlbGYucmUubm9faHR0cCkge1xuICAgICAgLy8gY29tcGlsZSBsYXppbHksIGJlY2F1c2UgXCJob3N0XCItY29udGFpbmluZyB2YXJpYWJsZXMgY2FuIGNoYW5nZSBvbiB0bGRzIHVwZGF0ZS5cbiAgICAgICAgc2VsZi5yZS5ub19odHRwID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAnXicgK1xuICAgICAgICAgIHNlbGYucmUuc3JjX2F1dGggK1xuICAgICAgICAgIC8vIERvbid0IGFsbG93IHNpbmdsZS1sZXZlbCBkb21haW5zLCBiZWNhdXNlIG9mIGZhbHNlIHBvc2l0aXZlcyBsaWtlICcvL3Rlc3QnXG4gICAgICAgICAgLy8gd2l0aCBjb2RlIGNvbW1lbnRzXG4gICAgICAgICAgJyg/OmxvY2FsaG9zdHwoPzooPzonICsgc2VsZi5yZS5zcmNfZG9tYWluICsgJylcXFxcLikrJyArIHNlbGYucmUuc3JjX2RvbWFpbl9yb290ICsgJyknICtcbiAgICAgICAgICBzZWxmLnJlLnNyY19wb3J0ICtcbiAgICAgICAgICBzZWxmLnJlLnNyY19ob3N0X3Rlcm1pbmF0b3IgK1xuICAgICAgICAgIHNlbGYucmUuc3JjX3BhdGgsXG5cbiAgICAgICAgICAnaSdcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBpZiAoc2VsZi5yZS5ub19odHRwLnRlc3QodGFpbCkpIHtcbiAgICAgICAgLy8gc2hvdWxkIG5vdCBiZSBgOi8vYCAmIGAvLy9gLCB0aGF0IHByb3RlY3RzIGZyb20gZXJyb3JzIGluIHByb3RvY29sIG5hbWVcbiAgICAgICAgaWYgKHBvcyA+PSAzICYmIHRleHRbcG9zIC0gM10gPT09ICc6JykgeyByZXR1cm4gMCB9XG4gICAgICAgIGlmIChwb3MgPj0gMyAmJiB0ZXh0W3BvcyAtIDNdID09PSAnLycpIHsgcmV0dXJuIDAgfVxuICAgICAgICByZXR1cm4gdGFpbC5tYXRjaChzZWxmLnJlLm5vX2h0dHApWzBdLmxlbmd0aFxuICAgICAgfVxuICAgICAgcmV0dXJuIDBcbiAgICB9XG4gIH0sXG4gICdtYWlsdG86Jzoge1xuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAodGV4dCwgcG9zLCBzZWxmKSB7XG4gICAgICBjb25zdCB0YWlsID0gdGV4dC5zbGljZShwb3MpXG5cbiAgICAgIGlmICghc2VsZi5yZS5tYWlsdG8pIHtcbiAgICAgICAgc2VsZi5yZS5tYWlsdG8gPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICdeJyArIHNlbGYucmUuc3JjX2VtYWlsX25hbWUgKyAnQCcgKyBzZWxmLnJlLnNyY19ob3N0X3N0cmljdCwgJ2knXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGlmIChzZWxmLnJlLm1haWx0by50ZXN0KHRhaWwpKSB7XG4gICAgICAgIHJldHVybiB0YWlsLm1hdGNoKHNlbGYucmUubWFpbHRvKVswXS5sZW5ndGhcbiAgICAgIH1cbiAgICAgIHJldHVybiAwXG4gICAgfVxuICB9XG59XG5cbi8vIFJFIHBhdHRlcm4gZm9yIDItY2hhcmFjdGVyIHRsZHMgKGF1dG9nZW5lcmF0ZWQgYnkgLi9zdXBwb3J0L3RsZHNfMmNoYXJfZ2VuLmpzKVxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW4gKi9cbmNvbnN0IHRsZHNfMmNoX3NyY19yZSA9ICdhW2NkZWZnaWxtbm9xcnN0dXd4el18YlthYmRlZmdoaWptbm9yc3R2d3l6XXxjW2FjZGZnaGlrbG1ub3J1dnd4eXpdfGRbZWprbW96XXxlW2NlZ3JzdHVdfGZbaWprbW9yXXxnW2FiZGVmZ2hpbG1ucHFyc3R1d3ldfGhba21ucnR1XXxpW2RlbG1ub3Fyc3RdfGpbZW1vcF18a1tlZ2hpbW5wcnd5el18bFthYmNpa3JzdHV2eV18bVthY2RlZ2hrbG1ub3BxcnN0dXZ3eHl6XXxuW2FjZWZnaWxvcHJ1el18b218cFthZWZnaGtsbW5yc3R3eV18cWF8cltlb3N1d118c1thYmNkZWdoaWprbG1ub3J0dXZ4eXpdfHRbY2RmZ2hqa2xtbm9ydHZ3el18dVthZ2tzeXpdfHZbYWNlZ2ludV18d1tmc118eVtldF18elthbXddJ1xuXG4vLyBET04nVCB0cnkgdG8gbWFrZSBQUnMgd2l0aCBjaGFuZ2VzLiBFeHRlbmQgVExEcyB3aXRoIExpbmtpZnlJdC50bGRzKCkgaW5zdGVhZFxuY29uc3QgdGxkc19kZWZhdWx0ID0gJ2Jpenxjb218ZWR1fGdvdnxuZXR8b3JnfHByb3x3ZWJ8eHh4fGFlcm98YXNpYXxjb29wfGluZm98bXVzZXVtfG5hbWV8c2hvcHzRgNGEJy5zcGxpdCgnfCcpXG5cbmZ1bmN0aW9uIHJlc2V0U2NhbkNhY2hlIChzZWxmKSB7XG4gIHNlbGYuX19pbmRleF9fID0gLTFcbiAgc2VsZi5fX3RleHRfY2FjaGVfXyA9ICcnXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVZhbGlkYXRvciAocmUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0ZXh0LCBwb3MpIHtcbiAgICBjb25zdCB0YWlsID0gdGV4dC5zbGljZShwb3MpXG5cbiAgICBpZiAocmUudGVzdCh0YWlsKSkge1xuICAgICAgcmV0dXJuIHRhaWwubWF0Y2gocmUpWzBdLmxlbmd0aFxuICAgIH1cbiAgICByZXR1cm4gMFxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU5vcm1hbGl6ZXIgKCkge1xuICByZXR1cm4gZnVuY3Rpb24gKG1hdGNoLCBzZWxmKSB7XG4gICAgc2VsZi5ub3JtYWxpemUobWF0Y2gpXG4gIH1cbn1cblxuLy8gU2NoZW1hcyBjb21waWxlci4gQnVpbGQgcmVnZXhwcy5cbi8vXG5mdW5jdGlvbiBjb21waWxlIChzZWxmKSB7XG4gIC8vIExvYWQgJiBjbG9uZSBSRSBwYXR0ZXJucy5cbiAgY29uc3QgcmUgPSBzZWxmLnJlID0gcmVGYWN0b3J5KHNlbGYuX19vcHRzX18pXG5cbiAgLy8gRGVmaW5lIGR5bmFtaWMgcGF0dGVybnNcbiAgY29uc3QgdGxkcyA9IHNlbGYuX190bGRzX18uc2xpY2UoKVxuXG4gIHNlbGYub25Db21waWxlKClcblxuICBpZiAoIXNlbGYuX190bGRzX3JlcGxhY2VkX18pIHtcbiAgICB0bGRzLnB1c2godGxkc18yY2hfc3JjX3JlKVxuICB9XG4gIHRsZHMucHVzaChyZS5zcmNfeG4pXG5cbiAgcmUuc3JjX3RsZHMgPSB0bGRzLmpvaW4oJ3wnKVxuXG4gIGZ1bmN0aW9uIHVudHBsICh0cGwpIHsgcmV0dXJuIHRwbC5yZXBsYWNlKCclVExEUyUnLCByZS5zcmNfdGxkcykgfVxuXG4gIHJlLmVtYWlsX2Z1enp5ID0gUmVnRXhwKHVudHBsKHJlLnRwbF9lbWFpbF9mdXp6eSksICdpJylcbiAgcmUubGlua19mdXp6eSA9IFJlZ0V4cCh1bnRwbChyZS50cGxfbGlua19mdXp6eSksICdpJylcbiAgcmUubGlua19ub19pcF9mdXp6eSA9IFJlZ0V4cCh1bnRwbChyZS50cGxfbGlua19ub19pcF9mdXp6eSksICdpJylcbiAgcmUuaG9zdF9mdXp6eV90ZXN0ID0gUmVnRXhwKHVudHBsKHJlLnRwbF9ob3N0X2Z1enp5X3Rlc3QpLCAnaScpXG5cbiAgLy9cbiAgLy8gQ29tcGlsZSBlYWNoIHNjaGVtYVxuICAvL1xuXG4gIGNvbnN0IGFsaWFzZXMgPSBbXVxuXG4gIHNlbGYuX19jb21waWxlZF9fID0ge30gLy8gUmVzZXQgY29tcGlsZWQgZGF0YVxuXG4gIGZ1bmN0aW9uIHNjaGVtYUVycm9yIChuYW1lLCB2YWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJyhMaW5raWZ5SXQpIEludmFsaWQgc2NoZW1hIFwiJyArIG5hbWUgKyAnXCI6ICcgKyB2YWwpXG4gIH1cblxuICBPYmplY3Qua2V5cyhzZWxmLl9fc2NoZW1hc19fKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgY29uc3QgdmFsID0gc2VsZi5fX3NjaGVtYXNfX1tuYW1lXVxuXG4gICAgLy8gc2tpcCBkaXNhYmxlZCBtZXRob2RzXG4gICAgaWYgKHZhbCA9PT0gbnVsbCkgeyByZXR1cm4gfVxuXG4gICAgY29uc3QgY29tcGlsZWQgPSB7IHZhbGlkYXRlOiBudWxsLCBsaW5rOiBudWxsIH1cblxuICAgIHNlbGYuX19jb21waWxlZF9fW25hbWVdID0gY29tcGlsZWRcblxuICAgIGlmIChpc09iamVjdCh2YWwpKSB7XG4gICAgICBpZiAoaXNSZWdFeHAodmFsLnZhbGlkYXRlKSkge1xuICAgICAgICBjb21waWxlZC52YWxpZGF0ZSA9IGNyZWF0ZVZhbGlkYXRvcih2YWwudmFsaWRhdGUpXG4gICAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odmFsLnZhbGlkYXRlKSkge1xuICAgICAgICBjb21waWxlZC52YWxpZGF0ZSA9IHZhbC52YWxpZGF0ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NoZW1hRXJyb3IobmFtZSwgdmFsKVxuICAgICAgfVxuXG4gICAgICBpZiAoaXNGdW5jdGlvbih2YWwubm9ybWFsaXplKSkge1xuICAgICAgICBjb21waWxlZC5ub3JtYWxpemUgPSB2YWwubm9ybWFsaXplXG4gICAgICB9IGVsc2UgaWYgKCF2YWwubm9ybWFsaXplKSB7XG4gICAgICAgIGNvbXBpbGVkLm5vcm1hbGl6ZSA9IGNyZWF0ZU5vcm1hbGl6ZXIoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NoZW1hRXJyb3IobmFtZSwgdmFsKVxuICAgICAgfVxuXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoaXNTdHJpbmcodmFsKSkge1xuICAgICAgYWxpYXNlcy5wdXNoKG5hbWUpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzY2hlbWFFcnJvcihuYW1lLCB2YWwpXG4gIH0pXG5cbiAgLy9cbiAgLy8gQ29tcGlsZSBwb3N0cG9uZWQgYWxpYXNlc1xuICAvL1xuXG4gIGFsaWFzZXMuZm9yRWFjaChmdW5jdGlvbiAoYWxpYXMpIHtcbiAgICBpZiAoIXNlbGYuX19jb21waWxlZF9fW3NlbGYuX19zY2hlbWFzX19bYWxpYXNdXSkge1xuICAgICAgLy8gU2lsZW50bHkgZmFpbCBvbiBtaXNzZWQgc2NoZW1hcyB0byBhdm9pZCBlcnJvbnMgb24gZGlzYWJsZS5cbiAgICAgIC8vIHNjaGVtYUVycm9yKGFsaWFzLCBzZWxmLl9fc2NoZW1hc19fW2FsaWFzXSk7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzZWxmLl9fY29tcGlsZWRfX1thbGlhc10udmFsaWRhdGUgPVxuICAgICAgc2VsZi5fX2NvbXBpbGVkX19bc2VsZi5fX3NjaGVtYXNfX1thbGlhc11dLnZhbGlkYXRlXG4gICAgc2VsZi5fX2NvbXBpbGVkX19bYWxpYXNdLm5vcm1hbGl6ZSA9XG4gICAgICBzZWxmLl9fY29tcGlsZWRfX1tzZWxmLl9fc2NoZW1hc19fW2FsaWFzXV0ubm9ybWFsaXplXG4gIH0pXG5cbiAgLy9cbiAgLy8gRmFrZSByZWNvcmQgZm9yIGd1ZXNzZWQgbGlua3NcbiAgLy9cbiAgc2VsZi5fX2NvbXBpbGVkX19bJyddID0geyB2YWxpZGF0ZTogbnVsbCwgbm9ybWFsaXplOiBjcmVhdGVOb3JtYWxpemVyKCkgfVxuXG4gIC8vXG4gIC8vIEJ1aWxkIHNjaGVtYSBjb25kaXRpb25cbiAgLy9cbiAgY29uc3Qgc2xpc3QgPSBPYmplY3Qua2V5cyhzZWxmLl9fY29tcGlsZWRfXylcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAvLyBGaWx0ZXIgZGlzYWJsZWQgJiBmYWtlIHNjaGVtYXNcbiAgICAgIHJldHVybiBuYW1lLmxlbmd0aCA+IDAgJiYgc2VsZi5fX2NvbXBpbGVkX19bbmFtZV1cbiAgICB9KVxuICAgIC5tYXAoZXNjYXBlUkUpXG4gICAgLmpvaW4oJ3wnKVxuICAvLyAoPyFfKSBjYXVzZSAxLjV4IHNsb3dkb3duXG4gIHNlbGYucmUuc2NoZW1hX3Rlc3QgPSBSZWdFeHAoJyhefCg/IV8pKD86Wz48XFx1ZmY1Y118JyArIHJlLnNyY19aUENjICsgJykpKCcgKyBzbGlzdCArICcpJywgJ2knKVxuICBzZWxmLnJlLnNjaGVtYV9zZWFyY2ggPSBSZWdFeHAoJyhefCg/IV8pKD86Wz48XFx1ZmY1Y118JyArIHJlLnNyY19aUENjICsgJykpKCcgKyBzbGlzdCArICcpJywgJ2lnJylcbiAgc2VsZi5yZS5zY2hlbWFfYXRfc3RhcnQgPSBSZWdFeHAoJ14nICsgc2VsZi5yZS5zY2hlbWFfc2VhcmNoLnNvdXJjZSwgJ2knKVxuXG4gIHNlbGYucmUucHJldGVzdCA9IFJlZ0V4cChcbiAgICAnKCcgKyBzZWxmLnJlLnNjaGVtYV90ZXN0LnNvdXJjZSArICcpfCgnICsgc2VsZi5yZS5ob3N0X2Z1enp5X3Rlc3Quc291cmNlICsgJyl8QCcsXG4gICAgJ2knXG4gIClcblxuICAvL1xuICAvLyBDbGVhbnVwXG4gIC8vXG5cbiAgcmVzZXRTY2FuQ2FjaGUoc2VsZilcbn1cblxuLyoqXG4gKiBjbGFzcyBNYXRjaFxuICpcbiAqIE1hdGNoIHJlc3VsdC4gU2luZ2xlIGVsZW1lbnQgb2YgYXJyYXksIHJldHVybmVkIGJ5IFtbTGlua2lmeUl0I21hdGNoXV1cbiAqKi9cbmZ1bmN0aW9uIE1hdGNoIChzZWxmLCBzaGlmdCkge1xuICBjb25zdCBzdGFydCA9IHNlbGYuX19pbmRleF9fXG4gIGNvbnN0IGVuZCA9IHNlbGYuX19sYXN0X2luZGV4X19cbiAgY29uc3QgdGV4dCA9IHNlbGYuX190ZXh0X2NhY2hlX18uc2xpY2Uoc3RhcnQsIGVuZClcblxuICAvKipcbiAgICogTWF0Y2gjc2NoZW1hIC0+IFN0cmluZ1xuICAgKlxuICAgKiBQcmVmaXggKHByb3RvY29sKSBmb3IgbWF0Y2hlZCBzdHJpbmcuXG4gICAqKi9cbiAgdGhpcy5zY2hlbWEgPSBzZWxmLl9fc2NoZW1hX18udG9Mb3dlckNhc2UoKVxuICAvKipcbiAgICogTWF0Y2gjaW5kZXggLT4gTnVtYmVyXG4gICAqXG4gICAqIEZpcnN0IHBvc2l0aW9uIG9mIG1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMuaW5kZXggPSBzdGFydCArIHNoaWZ0XG4gIC8qKlxuICAgKiBNYXRjaCNsYXN0SW5kZXggLT4gTnVtYmVyXG4gICAqXG4gICAqIE5leHQgcG9zaXRpb24gYWZ0ZXIgbWF0Y2hlZCBzdHJpbmcuXG4gICAqKi9cbiAgdGhpcy5sYXN0SW5kZXggPSBlbmQgKyBzaGlmdFxuICAvKipcbiAgICogTWF0Y2gjcmF3IC0+IFN0cmluZ1xuICAgKlxuICAgKiBNYXRjaGVkIHN0cmluZy5cbiAgICoqL1xuICB0aGlzLnJhdyA9IHRleHRcbiAgLyoqXG4gICAqIE1hdGNoI3RleHQgLT4gU3RyaW5nXG4gICAqXG4gICAqIE5vdG1hbGl6ZWQgdGV4dCBvZiBtYXRjaGVkIHN0cmluZy5cbiAgICoqL1xuICB0aGlzLnRleHQgPSB0ZXh0XG4gIC8qKlxuICAgKiBNYXRjaCN1cmwgLT4gU3RyaW5nXG4gICAqXG4gICAqIE5vcm1hbGl6ZWQgdXJsIG9mIG1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMudXJsID0gdGV4dFxufVxuXG5mdW5jdGlvbiBjcmVhdGVNYXRjaCAoc2VsZiwgc2hpZnQpIHtcbiAgY29uc3QgbWF0Y2ggPSBuZXcgTWF0Y2goc2VsZiwgc2hpZnQpXG5cbiAgc2VsZi5fX2NvbXBpbGVkX19bbWF0Y2guc2NoZW1hXS5ub3JtYWxpemUobWF0Y2gsIHNlbGYpXG5cbiAgcmV0dXJuIG1hdGNoXG59XG5cbi8qKlxuICogY2xhc3MgTGlua2lmeUl0XG4gKiovXG5cbi8qKlxuICogbmV3IExpbmtpZnlJdChzY2hlbWFzLCBvcHRpb25zKVxuICogLSBzY2hlbWFzIChPYmplY3QpOiBPcHRpb25hbC4gQWRkaXRpb25hbCBzY2hlbWFzIHRvIHZhbGlkYXRlIChwcmVmaXgvdmFsaWRhdG9yKVxuICogLSBvcHRpb25zIChPYmplY3QpOiB7IGZ1enp5TGlua3xmdXp6eUVtYWlsfGZ1enp5SVA6IHRydWV8ZmFsc2UgfVxuICpcbiAqIENyZWF0ZXMgbmV3IGxpbmtpZmllciBpbnN0YW5jZSB3aXRoIG9wdGlvbmFsIGFkZGl0aW9uYWwgc2NoZW1hcy5cbiAqIENhbiBiZSBjYWxsZWQgd2l0aG91dCBgbmV3YCBrZXl3b3JkIGZvciBjb252ZW5pZW5jZS5cbiAqXG4gKiBCeSBkZWZhdWx0IHVuZGVyc3RhbmRzOlxuICpcbiAqIC0gYGh0dHAocyk6Ly8uLi5gICwgYGZ0cDovLy4uLmAsIGBtYWlsdG86Li4uYCAmIGAvLy4uLmAgbGlua3NcbiAqIC0gXCJmdXp6eVwiIGxpbmtzIGFuZCBlbWFpbHMgKGV4YW1wbGUuY29tLCBmb29AYmFyLmNvbSkuXG4gKlxuICogYHNjaGVtYXNgIGlzIGFuIG9iamVjdCwgd2hlcmUgZWFjaCBrZXkvdmFsdWUgZGVzY3JpYmVzIHByb3RvY29sL3J1bGU6XG4gKlxuICogLSBfX2tleV9fIC0gbGluayBwcmVmaXggKHVzdWFsbHksIHByb3RvY29sIG5hbWUgd2l0aCBgOmAgYXQgdGhlIGVuZCwgYHNreXBlOmBcbiAqICAgZm9yIGV4YW1wbGUpLiBgbGlua2lmeS1pdGAgbWFrZXMgc2h1cmUgdGhhdCBwcmVmaXggaXMgbm90IHByZWNlZWRlZCB3aXRoXG4gKiAgIGFscGhhbnVtZXJpYyBjaGFyIGFuZCBzeW1ib2xzLiBPbmx5IHdoaXRlc3BhY2VzIGFuZCBwdW5jdHVhdGlvbiBhbGxvd2VkLlxuICogLSBfX3ZhbHVlX18gLSBydWxlIHRvIGNoZWNrIHRhaWwgYWZ0ZXIgbGluayBwcmVmaXhcbiAqICAgLSBfU3RyaW5nXyAtIGp1c3QgYWxpYXMgdG8gZXhpc3RpbmcgcnVsZVxuICogICAtIF9PYmplY3RfXG4gKiAgICAgLSBfdmFsaWRhdGVfIC0gdmFsaWRhdG9yIGZ1bmN0aW9uIChzaG91bGQgcmV0dXJuIG1hdGNoZWQgbGVuZ3RoIG9uIHN1Y2Nlc3MpLFxuICogICAgICAgb3IgYFJlZ0V4cGAuXG4gKiAgICAgLSBfbm9ybWFsaXplXyAtIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIG5vcm1hbGl6ZSB0ZXh0ICYgdXJsIG9mIG1hdGNoZWQgcmVzdWx0XG4gKiAgICAgICAoZm9yIGV4YW1wbGUsIGZvciBAdHdpdHRlciBtZW50aW9ucykuXG4gKlxuICogYG9wdGlvbnNgOlxuICpcbiAqIC0gX19mdXp6eUxpbmtfXyAtIHJlY29nbmlnZSBVUkwtcyB3aXRob3V0IGBodHRwKHMpOmAgcHJlZml4LiBEZWZhdWx0IGB0cnVlYC5cbiAqIC0gX19mdXp6eUlQX18gLSBhbGxvdyBJUHMgaW4gZnV6enkgbGlua3MgYWJvdmUuIENhbiBjb25mbGljdCB3aXRoIHNvbWUgdGV4dHNcbiAqICAgbGlrZSB2ZXJzaW9uIG51bWJlcnMuIERlZmF1bHQgYGZhbHNlYC5cbiAqIC0gX19mdXp6eUVtYWlsX18gLSByZWNvZ25pemUgZW1haWxzIHdpdGhvdXQgYG1haWx0bzpgIHByZWZpeC5cbiAqXG4gKiovXG5mdW5jdGlvbiBMaW5raWZ5SXQgKHNjaGVtYXMsIG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIExpbmtpZnlJdCkpIHtcbiAgICByZXR1cm4gbmV3IExpbmtpZnlJdChzY2hlbWFzLCBvcHRpb25zKVxuICB9XG5cbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgaWYgKGlzT3B0aW9uc09iaihzY2hlbWFzKSkge1xuICAgICAgb3B0aW9ucyA9IHNjaGVtYXNcbiAgICAgIHNjaGVtYXMgPSB7fVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuX19vcHRzX18gPSBhc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKVxuXG4gIC8vIENhY2hlIGxhc3QgdGVzdGVkIHJlc3VsdC4gVXNlZCB0byBza2lwIHJlcGVhdGluZyBzdGVwcyBvbiBuZXh0IGBtYXRjaGAgY2FsbC5cbiAgdGhpcy5fX2luZGV4X18gPSAtMVxuICB0aGlzLl9fbGFzdF9pbmRleF9fID0gLTEgLy8gTmV4dCBzY2FuIHBvc2l0aW9uXG4gIHRoaXMuX19zY2hlbWFfXyA9ICcnXG4gIHRoaXMuX190ZXh0X2NhY2hlX18gPSAnJ1xuXG4gIHRoaXMuX19zY2hlbWFzX18gPSBhc3NpZ24oe30sIGRlZmF1bHRTY2hlbWFzLCBzY2hlbWFzKVxuICB0aGlzLl9fY29tcGlsZWRfXyA9IHt9XG5cbiAgdGhpcy5fX3RsZHNfXyA9IHRsZHNfZGVmYXVsdFxuICB0aGlzLl9fdGxkc19yZXBsYWNlZF9fID0gZmFsc2VcblxuICB0aGlzLnJlID0ge31cblxuICBjb21waWxlKHRoaXMpXG59XG5cbi8qKiBjaGFpbmFibGVcbiAqIExpbmtpZnlJdCNhZGQoc2NoZW1hLCBkZWZpbml0aW9uKVxuICogLSBzY2hlbWEgKFN0cmluZyk6IHJ1bGUgbmFtZSAoZml4ZWQgcGF0dGVybiBwcmVmaXgpXG4gKiAtIGRlZmluaXRpb24gKFN0cmluZ3xSZWdFeHB8T2JqZWN0KTogc2NoZW1hIGRlZmluaXRpb25cbiAqXG4gKiBBZGQgbmV3IHJ1bGUgZGVmaW5pdGlvbi4gU2VlIGNvbnN0cnVjdG9yIGRlc2NyaXB0aW9uIGZvciBkZXRhaWxzLlxuICoqL1xuTGlua2lmeUl0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQgKHNjaGVtYSwgZGVmaW5pdGlvbikge1xuICB0aGlzLl9fc2NoZW1hc19fW3NjaGVtYV0gPSBkZWZpbml0aW9uXG4gIGNvbXBpbGUodGhpcylcbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqIGNoYWluYWJsZVxuICogTGlua2lmeUl0I3NldChvcHRpb25zKVxuICogLSBvcHRpb25zIChPYmplY3QpOiB7IGZ1enp5TGlua3xmdXp6eUVtYWlsfGZ1enp5SVA6IHRydWV8ZmFsc2UgfVxuICpcbiAqIFNldCByZWNvZ25pdGlvbiBvcHRpb25zIGZvciBsaW5rcyB3aXRob3V0IHNjaGVtYS5cbiAqKi9cbkxpbmtpZnlJdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0IChvcHRpb25zKSB7XG4gIHRoaXMuX19vcHRzX18gPSBhc3NpZ24odGhpcy5fX29wdHNfXywgb3B0aW9ucylcbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBMaW5raWZ5SXQjdGVzdCh0ZXh0KSAtPiBCb29sZWFuXG4gKlxuICogU2VhcmNoZXMgbGlua2lmaWFibGUgcGF0dGVybiBhbmQgcmV0dXJucyBgdHJ1ZWAgb24gc3VjY2VzcyBvciBgZmFsc2VgIG9uIGZhaWwuXG4gKiovXG5MaW5raWZ5SXQucHJvdG90eXBlLnRlc3QgPSBmdW5jdGlvbiB0ZXN0ICh0ZXh0KSB7XG4gIC8vIFJlc2V0IHNjYW4gY2FjaGVcbiAgdGhpcy5fX3RleHRfY2FjaGVfXyA9IHRleHRcbiAgdGhpcy5fX2luZGV4X18gPSAtMVxuXG4gIGlmICghdGV4dC5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlIH1cblxuICBsZXQgbSwgbWwsIG1lLCBsZW4sIHNoaWZ0LCBuZXh0LCByZSwgdGxkX3BvcywgYXRfcG9zXG5cbiAgLy8gdHJ5IHRvIHNjYW4gZm9yIGxpbmsgd2l0aCBzY2hlbWEgLSB0aGF0J3MgdGhlIG1vc3Qgc2ltcGxlIHJ1bGVcbiAgaWYgKHRoaXMucmUuc2NoZW1hX3Rlc3QudGVzdCh0ZXh0KSkge1xuICAgIHJlID0gdGhpcy5yZS5zY2hlbWFfc2VhcmNoXG4gICAgcmUubGFzdEluZGV4ID0gMFxuICAgIHdoaWxlICgobSA9IHJlLmV4ZWModGV4dCkpICE9PSBudWxsKSB7XG4gICAgICBsZW4gPSB0aGlzLnRlc3RTY2hlbWFBdCh0ZXh0LCBtWzJdLCByZS5sYXN0SW5kZXgpXG4gICAgICBpZiAobGVuKSB7XG4gICAgICAgIHRoaXMuX19zY2hlbWFfXyA9IG1bMl1cbiAgICAgICAgdGhpcy5fX2luZGV4X18gPSBtLmluZGV4ICsgbVsxXS5sZW5ndGhcbiAgICAgICAgdGhpcy5fX2xhc3RfaW5kZXhfXyA9IG0uaW5kZXggKyBtWzBdLmxlbmd0aCArIGxlblxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLl9fb3B0c19fLmZ1enp5TGluayAmJiB0aGlzLl9fY29tcGlsZWRfX1snaHR0cDonXSkge1xuICAgIC8vIGd1ZXNzIHNjaGVtYWxlc3MgbGlua3NcbiAgICB0bGRfcG9zID0gdGV4dC5zZWFyY2godGhpcy5yZS5ob3N0X2Z1enp5X3Rlc3QpXG4gICAgaWYgKHRsZF9wb3MgPj0gMCkge1xuICAgICAgLy8gaWYgdGxkIGlzIGxvY2F0ZWQgYWZ0ZXIgZm91bmQgbGluayAtIG5vIG5lZWQgdG8gY2hlY2sgZnV6enkgcGF0dGVyblxuICAgICAgaWYgKHRoaXMuX19pbmRleF9fIDwgMCB8fCB0bGRfcG9zIDwgdGhpcy5fX2luZGV4X18pIHtcbiAgICAgICAgaWYgKChtbCA9IHRleHQubWF0Y2godGhpcy5fX29wdHNfXy5mdXp6eUlQID8gdGhpcy5yZS5saW5rX2Z1enp5IDogdGhpcy5yZS5saW5rX25vX2lwX2Z1enp5KSkgIT09IG51bGwpIHtcbiAgICAgICAgICBzaGlmdCA9IG1sLmluZGV4ICsgbWxbMV0ubGVuZ3RoXG5cbiAgICAgICAgICBpZiAodGhpcy5fX2luZGV4X18gPCAwIHx8IHNoaWZ0IDwgdGhpcy5fX2luZGV4X18pIHtcbiAgICAgICAgICAgIHRoaXMuX19zY2hlbWFfXyA9ICcnXG4gICAgICAgICAgICB0aGlzLl9faW5kZXhfXyA9IHNoaWZ0XG4gICAgICAgICAgICB0aGlzLl9fbGFzdF9pbmRleF9fID0gbWwuaW5kZXggKyBtbFswXS5sZW5ndGhcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5fX29wdHNfXy5mdXp6eUVtYWlsICYmIHRoaXMuX19jb21waWxlZF9fWydtYWlsdG86J10pIHtcbiAgICAvLyBndWVzcyBzY2hlbWFsZXNzIGVtYWlsc1xuICAgIGF0X3BvcyA9IHRleHQuaW5kZXhPZignQCcpXG4gICAgaWYgKGF0X3BvcyA+PSAwKSB7XG4gICAgICAvLyBXZSBjYW4ndCBza2lwIHRoaXMgY2hlY2ssIGJlY2F1c2UgdGhpcyBjYXNlcyBhcmUgcG9zc2libGU6XG4gICAgICAvLyAxOTIuMTY4LjEuMUBnbWFpbC5jb20sIG15LmluQGV4YW1wbGUuY29tXG4gICAgICBpZiAoKG1lID0gdGV4dC5tYXRjaCh0aGlzLnJlLmVtYWlsX2Z1enp5KSkgIT09IG51bGwpIHtcbiAgICAgICAgc2hpZnQgPSBtZS5pbmRleCArIG1lWzFdLmxlbmd0aFxuICAgICAgICBuZXh0ID0gbWUuaW5kZXggKyBtZVswXS5sZW5ndGhcblxuICAgICAgICBpZiAodGhpcy5fX2luZGV4X18gPCAwIHx8IHNoaWZ0IDwgdGhpcy5fX2luZGV4X18gfHxcbiAgICAgICAgICAgIChzaGlmdCA9PT0gdGhpcy5fX2luZGV4X18gJiYgbmV4dCA+IHRoaXMuX19sYXN0X2luZGV4X18pKSB7XG4gICAgICAgICAgdGhpcy5fX3NjaGVtYV9fID0gJ21haWx0bzonXG4gICAgICAgICAgdGhpcy5fX2luZGV4X18gPSBzaGlmdFxuICAgICAgICAgIHRoaXMuX19sYXN0X2luZGV4X18gPSBuZXh0XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcy5fX2luZGV4X18gPj0gMFxufVxuXG4vKipcbiAqIExpbmtpZnlJdCNwcmV0ZXN0KHRleHQpIC0+IEJvb2xlYW5cbiAqXG4gKiBWZXJ5IHF1aWNrIGNoZWNrLCB0aGF0IGNhbiBnaXZlIGZhbHNlIHBvc2l0aXZlcy4gUmV0dXJucyB0cnVlIGlmIGxpbmsgTUFZIEJFXG4gKiBjYW4gZXhpc3RzLiBDYW4gYmUgdXNlZCBmb3Igc3BlZWQgb3B0aW1pemF0aW9uLCB3aGVuIHlvdSBuZWVkIHRvIGNoZWNrIHRoYXRcbiAqIGxpbmsgTk9UIGV4aXN0cy5cbiAqKi9cbkxpbmtpZnlJdC5wcm90b3R5cGUucHJldGVzdCA9IGZ1bmN0aW9uIHByZXRlc3QgKHRleHQpIHtcbiAgcmV0dXJuIHRoaXMucmUucHJldGVzdC50ZXN0KHRleHQpXG59XG5cbi8qKlxuICogTGlua2lmeUl0I3Rlc3RTY2hlbWFBdCh0ZXh0LCBuYW1lLCBwb3NpdGlvbikgLT4gTnVtYmVyXG4gKiAtIHRleHQgKFN0cmluZyk6IHRleHQgdG8gc2NhblxuICogLSBuYW1lIChTdHJpbmcpOiBydWxlIChzY2hlbWEpIG5hbWVcbiAqIC0gcG9zaXRpb24gKE51bWJlcik6IHRleHQgb2Zmc2V0IHRvIGNoZWNrIGZyb21cbiAqXG4gKiBTaW1pbGFyIHRvIFtbTGlua2lmeUl0I3Rlc3RdXSBidXQgY2hlY2tzIG9ubHkgc3BlY2lmaWMgcHJvdG9jb2wgdGFpbCBleGFjdGx5XG4gKiBhdCBnaXZlbiBwb3NpdGlvbi4gUmV0dXJucyBsZW5ndGggb2YgZm91bmQgcGF0dGVybiAoMCBvbiBmYWlsKS5cbiAqKi9cbkxpbmtpZnlJdC5wcm90b3R5cGUudGVzdFNjaGVtYUF0ID0gZnVuY3Rpb24gdGVzdFNjaGVtYUF0ICh0ZXh0LCBzY2hlbWEsIHBvcykge1xuICAvLyBJZiBub3Qgc3VwcG9ydGVkIHNjaGVtYSBjaGVjayByZXF1ZXN0ZWQgLSB0ZXJtaW5hdGVcbiAgaWYgKCF0aGlzLl9fY29tcGlsZWRfX1tzY2hlbWEudG9Mb3dlckNhc2UoKV0pIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIHJldHVybiB0aGlzLl9fY29tcGlsZWRfX1tzY2hlbWEudG9Mb3dlckNhc2UoKV0udmFsaWRhdGUodGV4dCwgcG9zLCB0aGlzKVxufVxuXG4vKipcbiAqIExpbmtpZnlJdCNtYXRjaCh0ZXh0KSAtPiBBcnJheXxudWxsXG4gKlxuICogUmV0dXJucyBhcnJheSBvZiBmb3VuZCBsaW5rIGRlc2NyaXB0aW9ucyBvciBgbnVsbGAgb24gZmFpbC4gV2Ugc3Ryb25nbHlcbiAqIHJlY29tbWVuZCB0byB1c2UgW1tMaW5raWZ5SXQjdGVzdF1dIGZpcnN0LCBmb3IgYmVzdCBzcGVlZC5cbiAqXG4gKiAjIyMjIyBSZXN1bHQgbWF0Y2ggZGVzY3JpcHRpb25cbiAqXG4gKiAtIF9fc2NoZW1hX18gLSBsaW5rIHNjaGVtYSwgY2FuIGJlIGVtcHR5IGZvciBmdXp6eSBsaW5rcywgb3IgYC8vYCBmb3JcbiAqICAgcHJvdG9jb2wtbmV1dHJhbCAgbGlua3MuXG4gKiAtIF9faW5kZXhfXyAtIG9mZnNldCBvZiBtYXRjaGVkIHRleHRcbiAqIC0gX19sYXN0SW5kZXhfXyAtIGluZGV4IG9mIG5leHQgY2hhciBhZnRlciBtYXRoY2ggZW5kXG4gKiAtIF9fcmF3X18gLSBtYXRjaGVkIHRleHRcbiAqIC0gX190ZXh0X18gLSBub3JtYWxpemVkIHRleHRcbiAqIC0gX191cmxfXyAtIGxpbmssIGdlbmVyYXRlZCBmcm9tIG1hdGNoZWQgdGV4dFxuICoqL1xuTGlua2lmeUl0LnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uIG1hdGNoICh0ZXh0KSB7XG4gIGNvbnN0IHJlc3VsdCA9IFtdXG4gIGxldCBzaGlmdCA9IDBcblxuICAvLyBUcnkgdG8gdGFrZSBwcmV2aW91cyBlbGVtZW50IGZyb20gY2FjaGUsIGlmIC50ZXN0KCkgY2FsbGVkIGJlZm9yZVxuICBpZiAodGhpcy5fX2luZGV4X18gPj0gMCAmJiB0aGlzLl9fdGV4dF9jYWNoZV9fID09PSB0ZXh0KSB7XG4gICAgcmVzdWx0LnB1c2goY3JlYXRlTWF0Y2godGhpcywgc2hpZnQpKVxuICAgIHNoaWZ0ID0gdGhpcy5fX2xhc3RfaW5kZXhfX1xuICB9XG5cbiAgLy8gQ3V0IGhlYWQgaWYgY2FjaGUgd2FzIHVzZWRcbiAgbGV0IHRhaWwgPSBzaGlmdCA/IHRleHQuc2xpY2Uoc2hpZnQpIDogdGV4dFxuXG4gIC8vIFNjYW4gc3RyaW5nIHVudGlsIGVuZCByZWFjaGVkXG4gIHdoaWxlICh0aGlzLnRlc3QodGFpbCkpIHtcbiAgICByZXN1bHQucHVzaChjcmVhdGVNYXRjaCh0aGlzLCBzaGlmdCkpXG5cbiAgICB0YWlsID0gdGFpbC5zbGljZSh0aGlzLl9fbGFzdF9pbmRleF9fKVxuICAgIHNoaWZ0ICs9IHRoaXMuX19sYXN0X2luZGV4X19cbiAgfVxuXG4gIGlmIChyZXN1bHQubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBMaW5raWZ5SXQjbWF0Y2hBdFN0YXJ0KHRleHQpIC0+IE1hdGNofG51bGxcbiAqXG4gKiBSZXR1cm5zIGZ1bGx5LWZvcm1lZCAobm90IGZ1enp5KSBsaW5rIGlmIGl0IHN0YXJ0cyBhdCB0aGUgYmVnaW5uaW5nXG4gKiBvZiB0aGUgc3RyaW5nLCBhbmQgbnVsbCBvdGhlcndpc2UuXG4gKiovXG5MaW5raWZ5SXQucHJvdG90eXBlLm1hdGNoQXRTdGFydCA9IGZ1bmN0aW9uIG1hdGNoQXRTdGFydCAodGV4dCkge1xuICAvLyBSZXNldCBzY2FuIGNhY2hlXG4gIHRoaXMuX190ZXh0X2NhY2hlX18gPSB0ZXh0XG4gIHRoaXMuX19pbmRleF9fID0gLTFcblxuICBpZiAoIXRleHQubGVuZ3RoKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IG0gPSB0aGlzLnJlLnNjaGVtYV9hdF9zdGFydC5leGVjKHRleHQpXG4gIGlmICghbSkgcmV0dXJuIG51bGxcblxuICBjb25zdCBsZW4gPSB0aGlzLnRlc3RTY2hlbWFBdCh0ZXh0LCBtWzJdLCBtWzBdLmxlbmd0aClcbiAgaWYgKCFsZW4pIHJldHVybiBudWxsXG5cbiAgdGhpcy5fX3NjaGVtYV9fID0gbVsyXVxuICB0aGlzLl9faW5kZXhfXyA9IG0uaW5kZXggKyBtWzFdLmxlbmd0aFxuICB0aGlzLl9fbGFzdF9pbmRleF9fID0gbS5pbmRleCArIG1bMF0ubGVuZ3RoICsgbGVuXG5cbiAgcmV0dXJuIGNyZWF0ZU1hdGNoKHRoaXMsIDApXG59XG5cbi8qKiBjaGFpbmFibGVcbiAqIExpbmtpZnlJdCN0bGRzKGxpc3QgWywga2VlcE9sZF0pIC0+IHRoaXNcbiAqIC0gbGlzdCAoQXJyYXkpOiBsaXN0IG9mIHRsZHNcbiAqIC0ga2VlcE9sZCAoQm9vbGVhbik6IG1lcmdlIHdpdGggY3VycmVudCBsaXN0IGlmIGB0cnVlYCAoYGZhbHNlYCBieSBkZWZhdWx0KVxuICpcbiAqIExvYWQgKG9yIG1lcmdlKSBuZXcgdGxkcyBsaXN0LiBUaG9zZSBhcmUgdXNlciBmb3IgZnV6enkgbGlua3MgKHdpdGhvdXQgcHJlZml4KVxuICogdG8gYXZvaWQgZmFsc2UgcG9zaXRpdmVzLiBCeSBkZWZhdWx0IHRoaXMgYWxnb3J5dGhtIHVzZWQ6XG4gKlxuICogLSBob3N0bmFtZSB3aXRoIGFueSAyLWxldHRlciByb290IHpvbmVzIGFyZSBvay5cbiAqIC0gYml6fGNvbXxlZHV8Z292fG5ldHxvcmd8cHJvfHdlYnx4eHh8YWVyb3xhc2lhfGNvb3B8aW5mb3xtdXNldW18bmFtZXxzaG9wfNGA0YRcbiAqICAgYXJlIG9rLlxuICogLSBlbmNvZGVkIChgeG4tLS4uLmApIHJvb3Qgem9uZXMgYXJlIG9rLlxuICpcbiAqIElmIGxpc3QgaXMgcmVwbGFjZWQsIHRoZW4gZXhhY3QgbWF0Y2ggZm9yIDItY2hhcnMgcm9vdCB6b25lcyB3aWxsIGJlIGNoZWNrZWQuXG4gKiovXG5MaW5raWZ5SXQucHJvdG90eXBlLnRsZHMgPSBmdW5jdGlvbiB0bGRzIChsaXN0LCBrZWVwT2xkKSB7XG4gIGxpc3QgPSBBcnJheS5pc0FycmF5KGxpc3QpID8gbGlzdCA6IFtsaXN0XVxuXG4gIGlmICgha2VlcE9sZCkge1xuICAgIHRoaXMuX190bGRzX18gPSBsaXN0LnNsaWNlKClcbiAgICB0aGlzLl9fdGxkc19yZXBsYWNlZF9fID0gdHJ1ZVxuICAgIGNvbXBpbGUodGhpcylcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgdGhpcy5fX3RsZHNfXyA9IHRoaXMuX190bGRzX18uY29uY2F0KGxpc3QpXG4gICAgLnNvcnQoKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24gKGVsLCBpZHgsIGFycikge1xuICAgICAgcmV0dXJuIGVsICE9PSBhcnJbaWR4IC0gMV1cbiAgICB9KVxuICAgIC5yZXZlcnNlKClcblxuICBjb21waWxlKHRoaXMpXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogTGlua2lmeUl0I25vcm1hbGl6ZShtYXRjaClcbiAqXG4gKiBEZWZhdWx0IG5vcm1hbGl6ZXIgKGlmIHNjaGVtYSBkb2VzIG5vdCBkZWZpbmUgaXQncyBvd24pLlxuICoqL1xuTGlua2lmeUl0LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiBub3JtYWxpemUgKG1hdGNoKSB7XG4gIC8vIERvIG1pbmltYWwgcG9zc2libGUgY2hhbmdlcyBieSBkZWZhdWx0LiBOZWVkIHRvIGNvbGxlY3QgZmVlZGJhY2sgcHJpb3JcbiAgLy8gdG8gbW92ZSBmb3J3YXJkIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZG93bi1pdC9saW5raWZ5LWl0L2lzc3Vlcy8xXG5cbiAgaWYgKCFtYXRjaC5zY2hlbWEpIHsgbWF0Y2gudXJsID0gJ2h0dHA6Ly8nICsgbWF0Y2gudXJsIH1cblxuICBpZiAobWF0Y2guc2NoZW1hID09PSAnbWFpbHRvOicgJiYgIS9ebWFpbHRvOi9pLnRlc3QobWF0Y2gudXJsKSkge1xuICAgIG1hdGNoLnVybCA9ICdtYWlsdG86JyArIG1hdGNoLnVybFxuICB9XG59XG5cbi8qKlxuICogTGlua2lmeUl0I29uQ29tcGlsZSgpXG4gKlxuICogT3ZlcnJpZGUgdG8gbW9kaWZ5IGJhc2ljIFJlZ0V4cC1zLlxuICoqL1xuTGlua2lmeUl0LnByb3RvdHlwZS5vbkNvbXBpbGUgPSBmdW5jdGlvbiBvbkNvbXBpbGUgKCkge1xufVxuXG5leHBvcnQgZGVmYXVsdCBMaW5raWZ5SXRcbiIsImltcG9ydCBMaW5raWZ5SXQgZnJvbSAnbGlua2lmeS1pdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hcmtlZExpbmtpZnlJdChzY2hlbWFzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBsaW5raWZ5ID0gbmV3IExpbmtpZnlJdChzY2hlbWFzLCBvcHRpb25zKTtcbiAgYWRkVGxkcyhsaW5raWZ5LCBvcHRpb25zKTtcblxuICByZXR1cm4ge1xuICAgIGV4dGVuc2lvbnM6IFt7XG4gICAgICBuYW1lOiAnYXV0b2xpbmsnLFxuICAgICAgbGV2ZWw6ICdpbmxpbmUnLFxuICAgICAgc3RhcnQ6IChzcmMpID0+IHtcbiAgICAgICAgY29uc3QgbGluayA9IGdldE5leHRMaW5rKGxpbmtpZnksIHNyYyk7XG5cbiAgICAgICAgaWYgKCFsaW5rKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpbmsuaW5kZXg7XG4gICAgICB9LFxuICAgICAgdG9rZW5pemVyKHNyYykge1xuICAgICAgICBpZiAodGhpcy5sZXhlci5zdGF0ZS5pbkxpbmspIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsaW5rID0gZ2V0TmV4dExpbmsobGlua2lmeSwgc3JjKTtcblxuICAgICAgICBpZiAoIWxpbmspIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmF3O1xuICAgICAgICBpZiAobGluay5pbmRleCA9PT0gMCkge1xuICAgICAgICAgIHJhdyA9IGxpbmsucmF3O1xuICAgICAgICB9IGVsc2UgaWYgKGxpbmsuaW5kZXggPT09IDEgJiYgc3JjLmNoYXJBdCgwKSA9PT0gJzwnICYmIHNyYy5jaGFyQXQobGluay5sYXN0SW5kZXgpID09PSAnPicpIHtcbiAgICAgICAgICByYXcgPSBgPCR7bGluay5yYXd9PmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJhdykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogJ2xpbmsnLFxuICAgICAgICAgIHJhdyxcbiAgICAgICAgICB0ZXh0OiBsaW5rLnRleHQsXG4gICAgICAgICAgaHJlZjogbGluay51cmwsXG4gICAgICAgICAgdG9rZW5zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgcmF3OiBsaW5rLnRleHQsXG4gICAgICAgICAgICAgIHRleHQ6IGxpbmsudGV4dCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfV0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldE5leHRMaW5rKGxpbmtpZnksIHNyYykge1xuICBjb25zdCBtYXRjaCA9IGxpbmtpZnkubWF0Y2goc3JjKTtcblxuICBpZiAoIW1hdGNoIHx8ICFtYXRjaC5sZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gbWF0Y2hbMF07XG59XG5cbmZ1bmN0aW9uIGFkZFRsZHMobGlua2lmeSwgb3B0aW9ucykge1xuICBjb25zdCB0bGRzID0gb3B0aW9ucy50bGRzO1xuICBkZWxldGUgb3B0aW9ucy50bGRzO1xuICBjb25zdCB0bGRzS2VlcE9sZCA9IG9wdGlvbnMudGxkc0tlZXBPbGQ7XG4gIGRlbGV0ZSBvcHRpb25zLnRsZHNLZWVwT2xkO1xuXG4gIGlmICh0bGRzKSB7XG4gICAgbGlua2lmeS50bGRzKHRsZHMsIHRsZHNLZWVwT2xkKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFVBQWU7O0FDQWYsU0FBZTs7QUNBZixRQUFlOztBQ0FmLFFBQWU7O0FDRUEsa0JBQVEsRUFBRSxJQUFJLEVBQUU7QUFDL0IsRUFBRSxNQUFNLEVBQUUsR0FBRztBQUNiLEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSTs7QUFFakIsRUFBRSxFQUFFLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUNuQixFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLEVBQUUsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixFQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDOztBQUVmO0FBQ0EsRUFBRSxFQUFFLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRzs7QUFFeEQ7QUFDQSxFQUFFLEVBQUUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRzs7QUFFN0M7QUFDQTtBQUNBLEVBQUUsTUFBTSxlQUFlLEdBQUc7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsR0FBRyxlQUFlLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxPQUFPLEdBQUc7QUFDN0Y7QUFDQTs7QUFFQSxFQUFFLEVBQUUsQ0FBQyxPQUFPOztBQUVaLElBQUk7O0FBRUo7QUFDQSxFQUFFLEVBQUUsQ0FBQyxRQUFRLEdBQUcsV0FBVyxHQUFHLEVBQUUsQ0FBQyxPQUFPLEdBQUc7O0FBRTNDLEVB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
