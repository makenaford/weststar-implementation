// Segmented control: single selection with aria-pressed. Fires "ws-segmented:change" with { value, item }.
export function initSegmented(root) {
  const items = () => [...root.querySelectorAll('.ws-segmented__item')];
  const onClick = (e) => {
    const item = e.target.closest('.ws-segmented__item');
    if (!item || !root.contains(item)) return;
    items().forEach((i) => i.setAttribute('aria-pressed', String(i === item)));
    root.dispatchEvent(new CustomEvent('ws-segmented:change', { detail: { value: item.dataset.value ?? item.textContent.trim(), item } }));
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
