// Test-only React host-contract fixture. It is not React and is never exported by @maataa/react.
// It exists only to deterministically exercise the MAATAA React adapter in a real browser.
export function createReactHostFixture() {
  const effects = [];
  return {
    createElement(type, props = {}, ...children) {
      return { type, props: props ?? {}, children: children.flat(Infinity) };
    },
    useState(initial) {
      let value = typeof initial === "function" ? initial() : initial;
      const setValue = (next) => { value = typeof next === "function" ? next(value) : next; return value; };
      return [value, setValue];
    },
    useEffect(effect) {
      const cleanup = effect();
      if (typeof cleanup === "function") effects.push(cleanup);
    },
    __cleanup() { while (effects.length) effects.pop()(); }
  };
}

function applyProps(el, props) {
  for (const [key, value] of Object.entries(props ?? {})) {
    if (key === "children" || value == null || value === false) continue;
    if (key === "className") el.setAttribute("class", value);
    else if (key === "style" && value && typeof value === "object") Object.assign(el.style, value);
    else if (key.startsWith("on") && typeof value === "function") el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === "htmlFor") el.setAttribute("for", value);
    else if (value === true) el.setAttribute(key, "");
    else el.setAttribute(key, String(value));
  }
}

export function renderFixture(vnode) {
  if (vnode == null || vnode === false) return document.createTextNode("");
  if (typeof vnode === "string" || typeof vnode === "number") return document.createTextNode(String(vnode));
  if (vnode instanceof Node) return vnode;
  if (typeof vnode.type === "function") return renderFixture(vnode.type({ ...(vnode.props ?? {}), children: vnode.children }));
  const el = document.createElement(vnode.type);
  applyProps(el, vnode.props);
  for (const child of vnode.children ?? []) el.append(renderFixture(child));
  return el;
}
