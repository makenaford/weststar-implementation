// Tooltip behaviour: show a .ws-tooltip for any [data-tooltip] trigger on hover and keyboard focus.
//   <button data-tooltip="Download invoice" data-tooltip-placement="top">…</button>
// Placement is where the tooltip sits relative to its trigger: top | bottom | left | right,
// optionally with -start / -end. The arrow modifier is derived from it (top → .ws-tooltip--bottom).
// The arrow always points at the trigger's centre; -start / -end only choose which corner it sits in
// (so the tooltip extends towards the end / start side), which keeps small icon triggers readable.

/** Placement → arrow modifier (the arrow is on the side facing the trigger). */
export const ARROW = {
  top: 'bottom', 'top-start': 'bottom-left', 'top-end': 'bottom-right',
  bottom: 'top', 'bottom-start': 'top-left', 'bottom-end': 'top-right',
  left: 'right', 'left-start': 'right-top', 'left-end': 'right-bottom',
  right: 'left', 'right-start': 'left-top', 'right-end': 'left-bottom',
};
const OPPOSITE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const GAP = 8; // trigger edge → tooltip edge (the 5px arrow sits inside this)
const ARROW_INSET = 13; // corner → arrow centre (8px inset + half the 10px arrow)

function coords(r, w, h, placement) {
  const [side, align = 'center'] = placement.split('-');
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  if (side === 'top' || side === 'bottom') {
    const y = side === 'top' ? r.top - h - GAP : r.bottom + GAP;
    const x = align === 'start' ? cx - ARROW_INSET : align === 'end' ? cx - w + ARROW_INSET : cx - w / 2;
    return { x, y };
  }
  const x = side === 'left' ? r.left - w - GAP : r.right + GAP;
  const y = align === 'start' ? cy - ARROW_INSET : align === 'end' ? cy - h + ARROW_INSET : cy - h / 2;
  return { x, y };
}

/**
 * Position a floating element (position: fixed) next to a trigger, flipping to the other side
 * when it would leave the viewport. `block` is the BEM block ('ws-tooltip' or 'ws-popover');
 * its arrow modifier is updated to match. Returns the placement used.
 */
export function placeFloating(el, trigger, placement = 'top', block = 'ws-tooltip') {
  const r = trigger.getBoundingClientRect();
  const { offsetWidth: w, offsetHeight: h } = el;
  let p = placement;
  let { x, y } = coords(r, w, h, p);
  const out = y < 0 || x < 0 || y + h > innerHeight || x + w > innerWidth;
  if (out) {
    const [side, align] = p.split('-');
    const flipped = OPPOSITE[side] + (align ? `-${align}` : '');
    const c = coords(r, w, h, flipped);
    if (c.y >= 0 && c.x >= 0 && c.y + h <= innerHeight && c.x + w <= innerWidth) ({ x, y } = c), (p = flipped);
  }
  // Last resort: keep it on screen (the arrow may then no longer line up with the trigger).
  const M = 8;
  x = Math.min(Math.max(x, M), Math.max(M, innerWidth - w - M));
  y = Math.min(Math.max(y, M), Math.max(M, innerHeight - h - M));
  Object.values(ARROW).forEach((a) => el.classList.remove(`${block}--${a}`));
  el.classList.add(`${block}--${ARROW[p]}`);
  el.style.left = `${Math.round(x)}px`;
  el.style.top = `${Math.round(y)}px`;
  return p;
}

let uid = 0;

/** Wire every [data-tooltip] inside root. Returns a cleanup function. */
export function initTooltips(root = document) {
  const tip = document.createElement('div');
  tip.className = 'ws-tooltip is-floating';
  tip.id = `ws-tooltip-${++uid}`;
  tip.setAttribute('role', 'tooltip');
  tip.hidden = true;
  document.body.append(tip);
  let current = null;

  const show = (trigger) => {
    current = trigger;
    tip.textContent = trigger.dataset.tooltip;
    tip.hidden = false;
    trigger.setAttribute('aria-describedby', tip.id);
    placeFloating(tip, trigger, trigger.dataset.tooltipPlacement || 'top', 'ws-tooltip');
  };
  const hide = () => {
    if (current) current.removeAttribute('aria-describedby');
    current = null;
    tip.hidden = true;
  };

  const over = (e) => { const t = e.target.closest?.('[data-tooltip]'); if (t && root.contains(t) && t !== current) show(t); };
  const out = (e) => { if (current && !current.contains(e.relatedTarget)) hide(); };
  const key = (e) => { if (e.key === 'Escape') hide(); };

  root.addEventListener('mouseover', over);
  root.addEventListener('mouseout', out);
  root.addEventListener('focusin', over);
  root.addEventListener('focusout', out);
  document.addEventListener('keydown', key);
  addEventListener('scroll', hide, true);

  return () => {
    root.removeEventListener('mouseover', over);
    root.removeEventListener('mouseout', out);
    root.removeEventListener('focusin', over);
    root.removeEventListener('focusout', out);
    document.removeEventListener('keydown', key);
    removeEventListener('scroll', hide, true);
    tip.remove();
  };
}
