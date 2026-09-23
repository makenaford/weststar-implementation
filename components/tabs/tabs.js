// Tabs behavior: ARIA tablist wiring plus arrow-key navigation (automatic activation).
// Markup: <div class="ws-tabs" role="tablist"> <button class="ws-tabs__tab" role="tab" aria-controls="panel-id">…</button> … </div>
//         <div class="ws-tabs__panel" role="tabpanel" id="panel-id">…</div>
// initTabs(root) accepts the .ws-tabs element or any ancestor containing one or more tablists.
// Returns a cleanup function that removes the listeners.

export function initTabs(root) {
  const lists = root.matches?.('.ws-tabs') ? [root] : [...root.querySelectorAll('.ws-tabs')];
  const cleanups = lists.map(setup);
  return () => cleanups.forEach((fn) => fn());
}

function setup(list) {
  list.setAttribute('role', 'tablist');
  const tabs = () => [...list.querySelectorAll('.ws-tabs__tab')];
  const enabled = () => tabs().filter((t) => !t.disabled && t.getAttribute('aria-disabled') !== 'true');
  const panelOf = (tab) => {
    const id = tab.getAttribute('aria-controls');
    return id ? list.ownerDocument.getElementById(id) : null;
  };

  const select = (tab, focus = false) => {
    tabs().forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = panelOf(t);
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
    list.dispatchEvent(new CustomEvent('ws-tabs:change', { detail: { tab }, bubbles: true }));
  };

  tabs().forEach((t) => {
    t.setAttribute('role', 'tab');
    if (t.tagName === 'BUTTON' && !t.hasAttribute('type')) t.type = 'button';
    const panel = panelOf(t);
    if (panel) {
      panel.setAttribute('role', 'tabpanel');
      if (!panel.hasAttribute('tabindex')) panel.tabIndex = 0;
      if (t.id) panel.setAttribute('aria-labelledby', t.id);
    }
  });
  select(tabs().find((t) => t.getAttribute('aria-selected') === 'true') || enabled()[0]);

  const onClick = (e) => {
    const tab = e.target.closest('.ws-tabs__tab');
    if (tab && list.contains(tab) && enabled().includes(tab)) select(tab);
  };

  const onKey = (e) => {
    const items = enabled();
    const i = items.indexOf(e.target.closest('.ws-tabs__tab'));
    if (i < 0) return;
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: items.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(items[(next + items.length) % items.length], true);
  };

  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKey);
  return () => {
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKey);
  };
}
