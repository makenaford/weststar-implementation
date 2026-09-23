import { icon, cx, matrix } from '../../stories/helpers.js';
import { initTable } from './table.js';

const APPROVAL = {
  approved: ['Approved', 'ws-label--success'],
  pending: ['Pending approval', 'ws-label--warning'],
  declined: ['Declined', 'ws-label--danger'],
  deferred: ['Deferred', 'ws-label--neutral'],
};

export const SQUAWKS = [
  { id: 'SQ-1042', title: 'Replace left main landing gear actuator seal', category: 'Airworthy', estimate: 4850, approval: 'approved' },
  { id: 'SQ-1043', title: 'Cabin forward lavatory flush motor inoperative', category: 'Optional', estimate: 1320, approval: 'pending' },
  { id: 'SQ-1044', title: 'No. 2 engine bleed air duct clamp cracked', category: 'Airworthy', estimate: 2975, approval: 'pending' },
  { id: 'SQ-1045', title: 'Replace worn galley carpet runner', category: 'Optional', estimate: 890, approval: 'declined' },
  { id: 'SQ-1046', title: 'Right wing leading edge de-ice boot delaminated', category: 'Airworthy', estimate: 7400, approval: 'approved' },
  { id: 'SQ-1047', title: 'Refinish scratched cockpit sidewall panel', category: 'Optional', estimate: 640, approval: 'deferred' },
];

const money = (n) => `$${n.toLocaleString('en-US')}`;
const label = (key) => `<span class="ws-label ${APPROVAL[key][1]} ws-label--outline">${APPROVAL[key][0]}</span>`;
const checkCell = (tag, name, checked = false) =>
  `<${tag} class="ws-table__cell-check"><label class="ws-checkbox"><input type="checkbox" class="ws-checkbox__input ws-table__checkbox" aria-label="${name}"${checked ? ' checked' : ''}></label></${tag}>`;
const actionsCell = (tag, name, iconName = 'ellipsis-v') =>
  `<${tag} class="ws-table__cell-actions"><button type="button" class="ws-btn ws-btn--borderless-primary ws-btn--sm ws-btn--icon" aria-label="${name}">${icon(iconName)}</button></${tag}>`;
const sortHeader = (text, sort = 'none') =>
  `<th aria-sort="${sort}"><button type="button" class="ws-table__sort">${text}${icon({ none: 'order-arrow', ascending: 'order-arrow-up', descending: 'order-arrow-down' }[sort])}</button></th>`;

/** Title cell (_Cell Body Title). */
export const titleCell = ({ text, href = '#', sticker = 'document', level = 1, expandable = false, expanded = false } = {}) =>
  `<div class="${cx('ws-table__title', { [`ws-table__title--level-${level}`]: level > 1 })}">${
    expandable
      ? `<button type="button" class="ws-btn ws-btn--borderless-secondary ws-btn--xs ws-btn--icon ws-table__expand" aria-expanded="${expanded}" aria-label="${expanded ? 'Collapse' : 'Expand'}">${icon(expanded ? 'angle-down' : 'angle-right')}</button>`
      : ''
  }${sticker ? `<span class="ws-table__sticker">${icon(sticker)}</span>` : ''}<a class="ws-table__title-link" href="${href}">${text}</a></div>`;

/** Squawk list table. rowStates: { [index]: 'hover' | 'selected' } for static display. */
export const table = ({ checkbox = true, striped = false, bordered = false, spaced = false, condensed = false, sortable = true, rows = SQUAWKS, rowStates = {} } = {}) => `
<div class="ws-table-wrap">
<table class="${cx('ws-table', { 'ws-table--striped': striped, 'ws-table--bordered': bordered, 'ws-table--spaced': spaced, 'ws-table--condensed': condensed })}">
  <caption class="ws-sr-only">Squawks for work order WO-24817, N375MZ</caption>
  <thead>
    <tr>
      ${checkbox ? checkCell('th', 'Select all squawks') : ''}
      ${sortable ? sortHeader('Squawk') : '<th>Squawk</th>'}
      ${sortable ? sortHeader('Category') : '<th>Category</th>'}
      ${sortable ? sortHeader('Estimate') : '<th>Estimate</th>'}
      <th>Approval</th>
      ${actionsCell('th', 'Choose columns', 'caret-bottom')}
    </tr>
  </thead>
  <tbody>
    ${rows
      .map((r, i) => {
        const state = rowStates[i];
        const selected = state === 'selected';
        return `<tr${state ? ` class="is-${state}"` : ''}${selected ? ' aria-selected="true"' : ''}>
      ${checkbox ? checkCell('td', `Select ${r.id}`, selected) : ''}
      <td data-sort="${r.title}">${titleCell({ text: r.title, sticker: r.category === 'Airworthy' ? 'warning' : 'document' })}</td>
      <td>${r.category}<span class="ws-table__secondary">${r.id}</span></td>
      <td data-sort="${r.estimate}">${money(r.estimate)}</td>
      <td>${label(r.approval)}</td>
      ${actionsCell('td', `Actions for ${r.id}`)}
    </tr>`;
      })
      .join('')}
  </tbody>
</table>
</div>`;

export default {
  title: 'Components/Table',
  tags: ['autodocs'],
  excludeStories: /^[a-z]|^SQUAWKS$/,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Table (3902:15349), built from _Row (3902:10795), _Cell Header (3902:9953), _Cell Body (3902:10163) and _Cell Body Title (3902:10636). A real `<table class="ws-table">`; Striped, Border Column, Spaced and Condensed are modifier classes, and the checkbox and actions columns are optional cells. Row states are `:hover`, `.is-hover` and `.is-selected` / `aria-selected="true"`. Status pills use the Label component (`.ws-label`). `initTable(table)` from `table.js` adds select-all and column sorting.',
      },
    },
  },
  render: (args) => table(args),
  argTypes: {
    checkbox: { control: 'boolean', description: 'Figma: Checkbox' },
    striped: { control: 'boolean', description: 'Figma: Striped' },
    bordered: { control: 'boolean', description: 'Figma: Border Column' },
    spaced: { control: 'boolean', description: 'Figma: Spaced' },
    condensed: { control: 'boolean', description: 'Figma: Condensed' },
    sortable: { control: 'boolean', description: 'Figma: _Cell Header Sorting Icon' },
  },
  args: { checkbox: true, striped: false, bordered: false, spaced: false, condensed: false, sortable: true },
};

export const Playground = {};

export const RowStates = {
  name: 'Row states',
  render: () => table({ rows: SQUAWKS.slice(0, 3), rowStates: { 1: 'hover', 2: 'selected' } }),
};

const OPTIONS = {
  Default: {},
  Striped: { striped: true },
  'Border column': { bordered: true },
  Condensed: { condensed: true },
  'Striped, border column, condensed': { striped: true, bordered: true, condensed: true },
  'No checkbox': { checkbox: false },
};

export const Options = {
  name: 'Striped × border column × condensed',
  render: () =>
    matrix(
      [''],
      Object.entries(OPTIONS).map(([name, opts]) => ({ label: name, cells: [table({ rows: SQUAWKS.slice(0, 3), ...opts })] })),
    ),
};

export const Spaced = {
  parameters: { backgrounds: { value: 'page' } },
  render: () => `<div class="sb-stack" style="align-items: stretch">${table({ spaced: true, rows: SQUAWKS.slice(0, 4) })}${table({ spaced: true, condensed: true, rows: SQUAWKS.slice(0, 4) })}</div>`,
};

export const CellTypes = {
  name: 'Cell types',
  render: () => `
<div class="ws-table-wrap">
<table class="ws-table ws-table--bordered">
  <thead>
    <tr>${checkCell('th', 'Select all')}<th>Title</th><th>Content</th><th>Label</th><th>Image</th>${actionsCell('th', 'Choose columns', 'caret-bottom')}</tr>
  </thead>
  <tbody>
    <tr>${checkCell('td', 'Select row')}<td>${titleCell({ text: 'Landing gear', sticker: 'folder', expandable: true, expanded: true })}</td><td>Content</td><td>${label('approved')}</td><td><img class="ws-table__image" src="sticker-sample.svg" alt=""></td>${actionsCell('td', 'Actions')}</tr>
    <tr>${checkCell('td', 'Select row')}<td>${titleCell({ text: 'Left main gear', sticker: 'folder', level: 2, expandable: true })}</td><td>Content<span class="ws-table__secondary">Second line</span></td><td>${label('pending')}</td><td><img class="ws-table__image" src="sticker-sample.svg" alt=""></td>${actionsCell('td', 'Actions')}</tr>
    <tr>${checkCell('td', 'Select row')}<td>${titleCell({ text: 'Actuator seal', level: 3 })}</td><td>${icon('calendar', 'ws-table__cell-icon')}Left icon</td><td>${label('declined')}</td><td><img class="ws-table__image" src="sticker-sample.svg" alt=""></td>${actionsCell('td', 'Actions')}</tr>
    <tr>${checkCell('td', 'Select row')}<td>${titleCell({ text: 'Seal kit P/N 114A2203', sticker: '', level: 4 })}</td><td>Right icon${icon('info-circle-open', 'ws-table__cell-icon ws-table__cell-icon--right')}</td><td>${label('deferred')}</td><td><img class="ws-table__image" src="sticker-sample.svg" alt=""></td>${actionsCell('td', 'Actions')}</tr>
  </tbody>
</table>
</div>`,
};

export const SquawkList = {
  name: 'Squawk list (interactive)',
  parameters: { backgrounds: { value: 'page' } },
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = table();
    initTable(el.querySelector('table'));
    return el;
  },
};
