// Vertical navigation behavior: expandable groups.
// Markup: <button class="ws-vnav__item" aria-expanded="false" aria-controls="sub-id">…</button>
//         <ul class="ws-vnav__sub" id="sub-id" hidden>…</ul>
// initVerticalNav(root) accepts the .ws-vnav element or any ancestor. Returns a cleanup function.

export function initVerticalNav(root) {
  const sync = (btn) => {
    const sub = root.ownerDocument.getElementById(btn.getAttribute('aria-controls'));
    if (sub) sub.hidden = btn.getAttribute('aria-expanded') !== 'true';
  };
  root.querySelectorAll('.ws-vnav__item[aria-controls]').forEach((btn) => {
    if (!btn.hasAttribute('aria-expanded')) btn.setAttribute('aria-expanded', 'false');
    sync(btn);
  });

  const onClick = (e) => {
    const btn = e.target.closest('.ws-vnav__item[aria-controls]');
    if (!btn || !root.contains(btn)) return;
    btn.setAttribute('aria-expanded', String(btn.getAttribute('aria-expanded') !== 'true'));
    sync(btn);
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
