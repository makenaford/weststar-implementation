// Table behaviour: row selection (with select-all) and column sorting.
// Markup: <input class="ws-table__checkbox"> in the first header cell selects all; the same input in a body row
// selects that row. <th><button class="ws-table__sort"> sorts by that column; a cell can set data-sort="…"
// to sort on a value other than its text (e.g. an ISO date).

const SORT_ICONS = { none: 'order-arrow', ascending: 'order-arrow-up', descending: 'order-arrow-down' };

export function initTable(table) {
  const head = table.tHead;
  const body = table.tBodies[0];
  const selectAll = head?.querySelector('.ws-table__checkbox');
  const rowBoxes = () => [...body.querySelectorAll('.ws-table__checkbox')];

  const syncRow = (box) => {
    const row = box.closest('tr');
    row.classList.toggle('is-selected', box.checked);
    row.setAttribute('aria-selected', String(box.checked));
  };

  const syncAll = () => {
    if (!selectAll) return;
    const boxes = rowBoxes();
    const checked = boxes.filter((b) => b.checked).length;
    selectAll.checked = checked > 0 && checked === boxes.length;
    selectAll.indeterminate = checked > 0 && checked < boxes.length;
  };

  const onChange = (e) => {
    const box = e.target.closest('.ws-table__checkbox');
    if (!box) return;
    if (box === selectAll) rowBoxes().forEach((b) => { b.checked = box.checked; syncRow(b); });
    else syncRow(box);
    syncAll();
    table.dispatchEvent(new CustomEvent('ws-table:select', { detail: { rows: rowBoxes().filter((b) => b.checked).map((b) => b.closest('tr')) } }));
  };

  const onClick = (e) => {
    const btn = e.target.closest('.ws-table__sort');
    if (!btn) return;
    const th = btn.closest('th');
    const col = [...th.parentElement.children].indexOf(th);
    const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    head.querySelectorAll('th[aria-sort]').forEach((h) => {
      h.setAttribute('aria-sort', 'none');
      h.querySelector('.ws-table__sort use')?.setAttribute('href', `icons.svg#${SORT_ICONS.none}`);
    });
    th.setAttribute('aria-sort', dir);
    btn.querySelector('use')?.setAttribute('href', `icons.svg#${SORT_ICONS[dir]}`);
    const value = (row) => { const c = row.children[col]; return (c?.dataset.sort ?? c?.textContent ?? '').trim(); };
    const rows = [...body.rows].sort((a, b) => value(a).localeCompare(value(b), undefined, { numeric: true, sensitivity: 'base' }));
    if (dir === 'descending') rows.reverse();
    body.append(...rows);
  };

  table.addEventListener('change', onChange);
  table.addEventListener('click', onClick);
  rowBoxes().forEach(syncRow);
  syncAll();

  return {
    destroy() {
      table.removeEventListener('change', onChange);
      table.removeEventListener('click', onClick);
    },
  };
}
