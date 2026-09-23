import { icon, cx, matrix } from '../../stories/helpers.js';

const BTN_STATES = ['default', 'hover', 'focus', 'selected'];
const btnStateClass = (s) => (s === 'default' ? '' : `is-${s}`);

/** One page button (Figma _ButtonPagination). Pass label for Text, or iconName for Icon. */
export const pageButton = ({ label = '1', iconName = '', state = 'default', ariaLabel = '', disabled = false } = {}) => {
  const cls = cx('ws-pagination__btn', btnStateClass(state), { 'ws-pagination__ellipsis': iconName === 'ellipsis-h' });
  const current = state === 'selected' ? ' aria-current="page"' : '';
  const a11y = ariaLabel ? ` aria-label="${ariaLabel}"` : iconName === 'ellipsis-h' ? ' aria-hidden="true" tabindex="-1"' : ` aria-label="Page ${label}"`;
  return `<button type="button" class="${cls}"${current}${a11y}${disabled ? ' disabled' : ''}>${iconName ? icon(iconName) : label}</button>`;
};

/** Page list with ellipses: 1 … (current ± 1) … total. */
const pageList = (current, total) => {
  const set = new Set([1, total, current - 1, current, current + 1].filter((n) => n >= 1 && n <= total));
  if (current <= 3) [2, 3].forEach((n) => n <= total && set.add(n));
  const nums = [...set].sort((a, b) => a - b);
  return nums.flatMap((n, i) => (i && n - nums[i - 1] > 1 ? ['…', n] : [n]));
};

/** Pagination (Figma Pagination + _PaginationGroup). */
export const pagination = ({ mobile = false, showControls = true, current = 2, total = 8, perPage = 10, entries = 75 } = {}) => {
  const from = (current - 1) * perPage + 1;
  const to = Math.min(current * perPage, entries);
  const controls = showControls
    ? `<div class="ws-pagination__controls"><button type="button" class="ws-btn ws-btn--borderless-secondary ws-btn--sm">${perPage} items${icon('caret-double-l')}</button><p class="ws-pagination__summary">Showing ${from} to ${to} of ${entries} entries.</p></div>`
    : '';
  const group = `<ul class="ws-pagination__group">
    <li>${pageButton({ iconName: 'angle-left', ariaLabel: 'Previous page', disabled: current === 1 })}</li>
    <li><ul class="ws-pagination__pages">${pageList(current, total)
      .map((p) => `<li>${p === '…' ? pageButton({ iconName: 'ellipsis-h' }) : pageButton({ label: String(p), state: p === current ? 'selected' : 'default' })}</li>`)
      .join('')}</ul></li>
    <li>${pageButton({ iconName: 'angle-right', ariaLabel: 'Next page', disabled: current === total })}</li>
  </ul>`;
  return `<nav class="${cx('ws-pagination', { 'ws-pagination--mobile': mobile })}" aria-label="Pagination">${controls}${group}</nav>`;
};

export default {
  title: 'Components/Pagination',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/, // lowercase exports are render helpers, not stories
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Pagination (538:20530), _ButtonPagination (1018:7801), _PaginationGroup (1022:10038). Variant Mobile is `.ws-pagination--mobile`; Show Controls adds the items-per-page button (a `ws-btn`) and the entry summary. The current page is `aria-current="page"`.',
      },
    },
  },
  render: (args) => pagination(args),
  argTypes: {
    mobile: { control: 'boolean', description: 'Figma "Variant=Mobile"' },
    showControls: { control: 'boolean', description: 'Figma "Show Controls"' },
    current: { control: { type: 'number', min: 1 } },
    total: { control: { type: 'number', min: 1 } },
    perPage: { control: 'select', options: [10, 20, 50] },
    entries: { control: 'number' },
  },
  args: { mobile: false, showControls: true, current: 2, total: 8, perPage: 10, entries: 75 },
};

export const Playground = {};

export const AllStates = {
  name: 'Button: variant × state',
  render: () =>
    matrix(BTN_STATES, [
      { label: 'Text', cells: BTN_STATES.map((state) => pageButton({ label: '1', state })) },
      { label: 'Icon', cells: BTN_STATES.map((state) => pageButton({ iconName: 'angle-right', ariaLabel: 'Next page', state })) },
      { label: 'Disabled', cells: [pageButton({ iconName: 'angle-left', ariaLabel: 'Previous page', disabled: true }), '', '', ''] },
    ]),
};

export const Variants = {
  name: 'Desktop × mobile',
  render: () =>
    matrix(
      ['Pagination'],
      [
        { label: 'Desktop', cells: [`<div style="width: 720px">${pagination()}</div>`] },
        { label: 'Desktop, no controls', cells: [`<div style="width: 720px">${pagination({ showControls: false, current: 5, total: 12 })}</div>`] },
        { label: 'Mobile', cells: [`<div style="width: 320px">${pagination({ mobile: true })}</div>`] },
      ],
    ),
};
