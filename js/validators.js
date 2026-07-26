/* =========================================================
   validators.js
   Shared helpers used by quest definitions in data-web.js
   and data-java.js to check the learner's code, plus the
   sandboxed JS runner and the offline Java "simulator".
   ========================================================= */

const Validators = (() => {

  /** True if `code` contains every string in `list` (case-insensitive by default). */
  function hasAll(code, list, caseSensitive = false) {
    const src = caseSensitive ? code : code.toLowerCase();
    return list.every(needle => src.includes(caseSensitive ? needle : needle.toLowerCase()));
  }

  /** True if `code` contains at least one string in `list`. */
  function hasAny(code, list, caseSensitive = false) {
    const src = caseSensitive ? code : code.toLowerCase();
    return list.some(needle => src.includes(caseSensitive ? needle : needle.toLowerCase()));
  }

  function matches(code, regex) {
    return regex.test(code);
  }

  /** Parse an HTML string into a Document for structural checks. */
  function parseHTML(htmlString) {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString, 'text/html');
  }

  /**
   * Run untrusted JS in a sandboxed, script-only iframe.
   * Captures console.log calls and thrown errors, then resolves with them.
   * Returns a Promise<{ logs: string[], error: string|null }>
   */
  function runJsSandbox(code, opts = {}) {
    const html = opts.html || '';
    const timeoutMs = opts.timeoutMs || 1500;
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('sandbox', 'allow-scripts');
      iframe.style.display = 'none';

      let settled = false;
      const finish = (result) => {
        if (settled) return;
        settled = true;
        window.removeEventListener('message', onMsg);
        clearTimeout(timer);
        iframe.remove();
        resolve(result);
      };

      const onMsg = (ev) => {
        if (!ev.data || ev.data.__cq !== true) return;
        finish({ logs: ev.data.logs || [], error: ev.data.error || null });
      };
      window.addEventListener('message', onMsg);

      const timer = setTimeout(() => finish({ logs: [], error: 'Timed out (possible infinite loop).' }), timeoutMs);

      const doc = `<!DOCTYPE html><html><head></head><body>${html}<script>
        const __logs = [];
        console.log = function(...args){
          __logs.push(args.map(a => {
            try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
            catch(e){ return String(a); }
          }).join(' '));
        };
        window.onerror = function(msg){
          parent.postMessage({ __cq:true, logs: __logs, error: String(msg) }, '*');
          return true;
        };
        try {
          ${code}
          parent.postMessage({ __cq:true, logs: __logs, error: null }, '*');
        } catch (e) {
          parent.postMessage({ __cq:true, logs: __logs, error: e.message }, '*');
        }
      <\/script></body></html>`;

      iframe.srcdoc = doc;
      document.body.appendChild(iframe);
    });
  }

  /**
   * Very small, honest "Java simulator" for an offline vanilla-JS app.
   * It cannot compile or execute real Java. Instead it:
   *   1) Extracts literal System.out.println("...") / print("...") calls
   *      and simple `+` string concatenations of literals/simple vars.
   *   2) Reports a friendly note that this is a simulated console.
   * This is intentionally limited — good enough to give learners
   * immediate feedback on beginner-level snippets without pretending
   * to be a full JVM.
   */
  function simulateJava(code) {
    const out = [];
    const varMap = {};

    // capture simple variable declarations: int x = 5; String name = "Nova";
    const declRe = /\b(?:int|double|long|float|boolean|String|char)\s+([a-zA-Z_]\w*)\s*=\s*("(?:[^"\\]|\\.)*"|'[^']*'|-?\d+(?:\.\d+)?|true|false);/g;
    let d;
    while ((d = declRe.exec(code))) {
      let val = d[2];
      if (val.startsWith('"') || val.startsWith("'")) val = val.slice(1, -1);
      varMap[d[1]] = val;
    }

    const printRe = /System\.out\.println\s*\(([^;]*)\)\s*;/g;
    let m;
    let found = false;
    while ((m = printRe.exec(code))) {
      found = true;
      out.push(evalSimpleExpr(m[1], varMap));
    }
    if (!found) {
      return { lines: [], note: 'No System.out.println(...) statements were found to simulate.' };
    }
    return { lines: out, note: 'Simulated console (offline approximation — not a real JVM).' };
  }

  function evalSimpleExpr(expr, varMap) {
    // split on + at top level (good enough for simple concatenation)
    const parts = expr.split('+').map(p => p.trim());
    return parts.map(p => {
      if (/^".*"$/.test(p) || /^'.*'$/.test(p)) return p.slice(1, -1);
      if (/^-?\d+(\.\d+)?$/.test(p)) return p;
      if (varMap.hasOwnProperty(p)) return varMap[p];
      return p; // unresolved identifier/expression — show as-is
    }).join('');
  }

  return { hasAll, hasAny, matches, parseHTML, runJsSandbox, simulateJava };
})();
