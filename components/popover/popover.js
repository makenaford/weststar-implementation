// Popover behaviour: click a trigger to toggle its popover.
//   <button data-popover-target="po-1" data-popover-placement="bottom-start" aria-expanded="false">…</button>
//   <div class="ws-popover" id="po-1" role="dialog" hidden>…</div>
// Closes on the close button, Escape (focus returns to the trigger) or a click outside.
import { placeFloating } from '../tooltip/tooltip.js';

export function openPopover(popover, trigger) {
  popover.hidden = false;
  popover.classList.add('is-floating');
  placeFloating(popover, trigger, trigger.dataset.popoverPlacement || 'bottom', 'ws-popover');
  trigger.setAttribute('aria-expanded', 'true');
  popover.__wsTrigger = trigger;
}

export function closePopover(popover, { focusTrigger = false } = {}) {
  if (popover.hidden) return;
  popover.hidden = true;
  const trigger = popover.__wsTrigger;
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
    if (focusTrigger) trigger.focus();
  }
}

/** Wire every [data-popover-target] inside root. Returns a cleanup function. */
export function initPopovers(root = document) {
  const openOnes = () => [...root.querySelectorAll('.ws-popover.is-floating:not([hidden])')];

  const click = (e) => {
    const trigger = e.target.closest('[data-popover-target]');
    if (trigger && root.contains(trigger)) {
      const po = document.getElementById(trigger.dataset.popoverTarget);
      if (!po) return;
      openOnes().filter((p) => p !== po).forEach((p) => closePopover(p));
      po.hidden ? openPopover(po, trigger) : closePopover(po);
      return;
    }
    const close = e.target.closest('.ws-popover__close');
    if (close) return closePopover(close.closest('.ws-popover'), { focusTrigger: true });
    openOnes().forEach((p) => { if (!p.contains(e.target)) closePopover(p); });
  };
  const key = (e) => { if (e.key === 'Escape') openOnes().forEach((p) => closePopover(p, { focusTrigger: true })); };
  const reposition = () => openOnes().forEach((p) => p.__wsTrigger && placeFloating(p, p.__wsTrigger, p.__wsTrigger.dataset.popoverPlacement || 'bottom', 'ws-popover'));

  document.addEventListener('click', click);
  document.addEventListener('keydown', key);
  addEventListener('resize', reposition);
  addEventListener('scroll', reposition, true);
  return () => {
    document.removeEventListener('click', click);
    document.removeEventListener('keydown', key);
    removeEventListener('resize', reposition);
    removeEventListener('scroll', reposition, true);
  };
}
