// Dropdown behaviour: open/close, outside click, Esc, and arrow-key navigation between items.
// Markup: <button aria-haspopup="menu" aria-expanded="false" aria-controls="menu-id"> followed by (or pointing at)
// <div class="ws-dropdown__menu" id="menu-id" hidden>…<button class="ws-dropdown__item">…</div>.

const ITEMS = '.ws-dropdown__item:not(:disabled):not(.is-disabled):not([aria-disabled="true"]), .ws-dropdown__search-input';

export function initDropdown(trigger) {
  const id = trigger.getAttribute('aria-controls');
  const menu = (id && trigger.ownerDocument.getElementById(id)) || trigger.nextElementSibling;
  const items = () => [...menu.querySelectorAll(ITEMS)];
  const isOpen = () => !menu.hidden;

  const focusItem = (index) => {
    const list = items();
    if (!list.length) return;
    list[(index + list.length) % list.length].focus();
  };

  const open = (focusIndex = null) => {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    if (focusIndex !== null) focusItem(focusIndex);
  };

  const close = (returnFocus = false) => {
    if (!isOpen()) return;
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();
  };

  const onTriggerClick = () => (isOpen() ? close() : open());

  const onTriggerKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      open(e.key === 'ArrowDown' ? 0 : -1);
    }
  };

  const onMenuKey = (e) => {
    const list = items();
    const i = list.indexOf(e.target.closest(ITEMS));
    if (e.key === 'Escape') { e.preventDefault(); close(true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(i + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(i - 1); }
    else if (e.key === 'Home') { e.preventDefault(); focusItem(0); }
    else if (e.key === 'End') { e.preventDefault(); focusItem(-1); }
    else if (e.key === 'Tab') close();
  };

  // Action items close the menu; checkbox, radio and drilldown items keep it open.
  const onMenuClick = (e) => {
    const item = e.target.closest('.ws-dropdown__item');
    if (item && !item.matches('.ws-dropdown__item--check, [aria-haspopup]') && !item.matches(':disabled, .is-disabled')) close(true);
  };

  const onDocClick = (e) => {
    if (!menu.contains(e.target) && !trigger.contains(e.target)) close();
  };

  trigger.setAttribute('aria-expanded', String(isOpen()));
  trigger.addEventListener('click', onTriggerClick);
  trigger.addEventListener('keydown', onTriggerKey);
  menu.addEventListener('keydown', onMenuKey);
  menu.addEventListener('click', onMenuClick);
  document.addEventListener('click', onDocClick);

  return {
    open,
    close,
    destroy() {
      trigger.removeEventListener('click', onTriggerClick);
      trigger.removeEventListener('keydown', onTriggerKey);
      menu.removeEventListener('keydown', onMenuKey);
      menu.removeEventListener('click', onMenuClick);
      document.removeEventListener('click', onDocClick);
    },
  };
}
