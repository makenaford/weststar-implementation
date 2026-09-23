import { icon, cx, matrix, STATES, stateClass } from '../../stories/helpers.js';
import { initDropdown } from './dropdown.js';

const VARIANTS = ['Simple', 'Flexible', 'Groups', 'Drilldown', 'Search'];
const ITEM_TYPES = ['Action', 'Checkbox', 'Radio Button', 'Drilldown'];

const ACTIONS = [
  ['view', 'View work order'],
  ['download', 'Download invoice'],
  ['check', 'Approve squawks'],
  ['document-pdf', 'Export to PDF'],
  ['users', 'Share with crew'],
];

/** One _Item. type: Action | Checkbox | Radio Button | Drilldown. */
export const dropdownItem = ({ type = 'Action', label = 'Option', leftIcon = 'cloud', rightIcon = '', state = 'default', checked = false, name = 'dropdown-radio' } = {}) => {
  const disabled = state === 'disabled';
  if (type === 'Checkbox' || type === 'Radio Button') {
    const input = type === 'Checkbox' ? 'checkbox' : 'radio';
    return `<label class="${cx('ws-dropdown__item', 'ws-dropdown__item--check', stateClass(state))}"><input type="${input}"${input === 'radio' ? ` name="${name}"` : ''}${checked || state === 'active' ? ' checked' : ''}${disabled ? ' disabled' : ''}><span class="ws-dropdown__item-label">${label}</span></label>`;
  }
  const end = type === 'Drilldown' ? 'angle-right-small' : rightIcon;
  return `<button type="button" role="menuitem" class="${cx('ws-dropdown__item', stateClass(state))}"${type === 'Drilldown' ? ' aria-haspopup="menu"' : ''}${disabled ? ' disabled' : ''}>${leftIcon ? icon(leftIcon) : ''}<span class="ws-dropdown__item-label">${label}</span>${end ? icon(end, 'ws-dropdown__item-end') : ''}</button>`;
};

const li = (html) => `<li role="none">${html}</li>`;
const list = (items) => `<ul class="ws-dropdown__list" role="menu">${items.join('')}</ul>`;

/** The menu panel. */
export const dropdownMenu = ({ variant = 'Simple', alert = false, footer = false, back = false, isStatic = true, id = '', hidden = false } = {}) => {
  let body;
  switch (variant) {
    case 'Flexible':
      body = `<div class="ws-dropdown__content"><p class="ws-text-sm" style="margin: 0">Any content: N375MZ is at the Grand Junction facility, bay 4.</p></div>`;
      break;
    case 'Groups':
      body = list([
        `<li role="presentation" class="ws-dropdown__group-title">Work order</li>`,
        ...ACTIONS.slice(0, 3).map(([, label]) => li(dropdownItem({ label, leftIcon: '' }))),
        `<li role="separator" class="ws-dropdown__divider"></li>`,
        `<li role="presentation" class="ws-dropdown__group-title">Documents</li>`,
        ...['Logbook entries', 'Parts quote', 'Final invoice'].map((label) => li(dropdownItem({ label, leftIcon: '' }))),
      ]);
      break;
    case 'Drilldown':
      body = list(['Airframe', 'Engines', 'Avionics', 'Interior', 'Paint'].map((label, i) => li(dropdownItem({ type: 'Drilldown', label, leftIcon: ['briefcase', 'cog', 'bolt', 'squares', 'picture'][i] }))));
      break;
    case 'Search':
      body = `<div class="ws-dropdown__search"><input type="search" class="ws-dropdown__search-input" placeholder="Search aircraft" aria-label="Search aircraft">${icon('search')}</div>${list(
        ['N375MZ', 'N512WS', 'N88GJ', 'N140EA', 'N7TX'].map((label) => li(dropdownItem({ label, leftIcon: 'globe' }))),
      )}`;
      break;
    default:
      body = list(ACTIONS.map(([ic, label]) => li(dropdownItem({ label, leftIcon: ic }))));
  }
  return `<div class="${cx('ws-dropdown__menu', { 'ws-dropdown__menu--static': isStatic })}"${id ? ` id="${id}"` : ''}${hidden ? ' hidden' : ''}>
  ${alert ? '<div class="ws-dropdown__alert">Squawk approvals are due by 5 pm today.</div>' : ''}
  ${back ? `<div class="ws-dropdown__back"><button type="button" class="ws-btn ws-btn--borderless-secondary ws-btn--xs ws-btn--icon" aria-label="Back">${icon('angle-left')}</button>Airframe</div>` : ''}
  ${body}
  ${footer ? '<div class="ws-dropdown__footer"><p class="ws-dropdown__caption">Showing 5 of 20 items</p></div>' : ''}
</div>`;
};

/** Trigger + menu, wired up with initDropdown. */
export const dropdown = (args = {}) => {
  const el = document.createElement('div');
  el.className = 'ws-dropdown';
  const id = `dd-${Math.random().toString(36).slice(2, 8)}`;
  el.innerHTML = `<button type="button" class="ws-btn ws-btn--outline-secondary ws-btn--sm" aria-haspopup="menu" aria-expanded="false" aria-controls="${id}">Actions${icon('caret-bottom')}</button>${dropdownMenu({ ...args, isStatic: false, id, hidden: true })}`;
  initDropdown(el.querySelector('button'));
  return el;
};

export default {
  title: 'Components/Dropdown',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Dropdown (349:68066) and _Item (342:41261). `.ws-dropdown__menu` is the panel; the Figma Variant maps to what goes inside it (a `.ws-dropdown__list` of items, group titles and dividers, a search field, a drilldown back bar or free content). Items are `.ws-dropdown__item` buttons, or labels with `--check` for checkbox and radio items. `initDropdown(trigger)` from `dropdown.js` handles open/close, outside click, Esc and arrow keys.',
      },
    },
  },
  render: (args) => `<div style="min-height: 420px">${dropdownMenu(args)}</div>`,
  argTypes: {
    variant: { control: 'select', options: VARIANTS, description: 'Figma: Variant' },
    alert: { control: 'boolean', description: 'Figma: Alert' },
    footer: { control: 'boolean', description: 'Figma: Footer' },
    back: { control: 'boolean', description: 'Figma: Drilldown Back' },
  },
  args: { variant: 'Simple', alert: false, footer: false, back: false },
};

export const Playground = {};

export const AllVariants = {
  name: 'Variants',
  render: () =>
    matrix(VARIANTS, [
      { label: 'Default', cells: VARIANTS.map((variant) => dropdownMenu({ variant, back: variant === 'Drilldown' })) },
      { label: 'Alert + footer', cells: VARIANTS.map((variant) => dropdownMenu({ variant, alert: true, footer: true })) },
    ]),
};

export const Items = {
  name: 'Item type × state',
  render: () =>
    matrix(STATES, [
      ...ITEM_TYPES.map((type) => ({
        label: type,
        cells: STATES.map((state) => `<div style="width: 209px">${dropdownItem({ type, state, name: `radio-${state}` })}</div>`),
      })),
      { label: 'Group title', cells: [`<div style="width: 209px"><p class="ws-dropdown__group-title">Group title</p></div>`] },
      { label: 'Divider', cells: [`<div style="width: 209px; padding: 0 8px"><hr class="ws-dropdown__divider"></div>`] },
    ]),
};

export const Interactive = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.minHeight = '360px';
    wrap.className = 'sb-row';
    wrap.style.alignItems = 'flex-start';
    wrap.append(dropdown({ variant: 'Simple' }), dropdown({ variant: 'Search' }), dropdown({ variant: 'Groups' }));
    return wrap;
  },
};
