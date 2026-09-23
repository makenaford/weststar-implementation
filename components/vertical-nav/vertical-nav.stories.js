import { icon, cx, matrix } from '../../stories/helpers.js';
import { initVerticalNav } from './vertical-nav.js';

const STYLES = { Transparent: '', Decorated: 'ws-vnav--decorated' };
const ITEM_STATES = ['default', 'hover', 'focus', 'active', 'selected'];
const itemStateClass = (s) => (s === 'default' ? '' : `is-${s}`);

/** One item (Figma _Item). state: default | hover | focus | active | selected. */
export const vnavItem = ({ label = 'Work orders', state = 'default', leftIcon = '', expandable = false, expanded = false, controls = '', href = '#' } = {}) => {
  const cls = cx('ws-vnav__item', itemStateClass(state));
  const inner = `${leftIcon ? icon(leftIcon, 'ws-vnav__icon') : ''}<span class="ws-vnav__label">${label}</span>${expandable ? icon('angle-right', 'ws-vnav__caret') : ''}`;
  if (expandable) return `<button type="button" class="${cls}" aria-expanded="${expanded}"${controls ? ` aria-controls="${controls}"` : ''}>${inner}</button>`;
  return `<a class="${cls}" href="${href}"${state === 'selected' ? ' aria-current="page"' : ''}>${inner}</a>`;
};

// Per-project secondary nav for the portal.
const PROJECT_NAV = [
  { label: 'Overview', leftIcon: 'home' },
  {
    label: 'Work orders',
    leftIcon: 'order-form',
    children: ['Open (12)', 'Awaiting approval', 'Completed'],
  },
  { label: 'Squawks', leftIcon: 'flag-empty' },
  { label: 'Documents', leftIcon: 'document' },
  { label: 'Invoices', leftIcon: 'credit-card' },
];

/** Vertical nav. items: [{ label, leftIcon?, children?: [label] }]; selected: label of the current page. */
export const verticalNav = ({ style = '', primary = false, dark = false, icons = true, items = PROJECT_NAV, selected = 'Awaiting approval', expanded = true, idPrefix = 'vnav', label = 'Project' } = {}) =>
  `<nav class="${cx('ws-vnav', style, { 'ws-vnav--primary': primary, 'ws-vnav--dark': dark })}" aria-label="${label}"><ul class="ws-vnav__list">${items
    .map((it, i) => {
      const leftIcon = icons ? it.leftIcon : '';
      if (!it.children) return `<li class="ws-vnav__group">${vnavItem({ label: it.label, leftIcon, state: it.label === selected ? 'selected' : 'default' })}</li>`;
      const id = `${idPrefix}-sub-${i}`;
      return `<li class="ws-vnav__group">${vnavItem({ label: it.label, leftIcon, expandable: true, expanded, controls: id })}<ul class="ws-vnav__sub" id="${id}"${expanded ? '' : ' hidden'}>${it.children
        .map((c) => `<li>${vnavItem({ label: c, state: c === selected ? 'selected' : 'default' })}</li>`)
        .join('')}</ul></li>`;
    })
    .join('')}</ul></nav>`;

const live = (html) => {
  const el = document.createElement('div');
  el.style.width = '256px';
  el.innerHTML = html;
  initVerticalNav(el);
  return el;
};

const box = (html) => `<div style="width: 256px">${html}</div>`;

const cell = (html, { style = '', dark = false, level = 1 } = {}) =>
  `<div class="${cx('ws-vnav', style, { 'ws-vnav--dark': dark })}" style="width: 256px"><ul class="ws-vnav__list">${
    level === 2 ? `<li class="ws-vnav__group"><ul class="ws-vnav__sub"><li>${html}</li></ul></li>` : `<li class="ws-vnav__group">${html}</li>`
  }</ul></div>`;

const stateRows = (dark) =>
  Object.entries(STYLES).flatMap(([name, style]) =>
    [1, 2].map((level) => ({
      label: `${name} / Level ${level}`,
      cells: ITEM_STATES.map((state) => cell(vnavItem({ label: 'Item name', state, leftIcon: 'home', expandable: level === 1 }), { style, dark, level })),
    })),
  );

export default {
  title: 'Components/Vertical Nav',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/, // lowercase exports are render helpers, not stories
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Vertical Navigation (6528:4288), _Item Group (6528:4301), _Item (6528:4326). The portal\'s per-project secondary nav. Style (Transparent/Decorated), Mode (Dark) and the 12px group spacing (`--primary`) are block modifiers; Level 2 items live in `.ws-vnav__sub`. Mark the current page with `aria-current="page"`. `initVerticalNav(root)` from `vertical-nav.js` toggles expandable groups.',
      },
    },
  },
  render: (args) => live(verticalNav({ ...args, idPrefix: 'pg' })),
  argTypes: {
    style: { control: 'select', options: Object.values(STYLES), labels: Object.fromEntries(Object.entries(STYLES).map(([k, v]) => [v, k])) },
    primary: { control: 'boolean', description: 'Figma Vertical Navigation "Style=Primary": 12px between groups' },
    dark: { control: 'boolean', description: 'Figma "Inverted" / "Mode=Dark"' },
    icons: { control: 'boolean', description: 'Figma "Variant=Icon": left icons' },
    expanded: { control: 'boolean' },
    selected: { control: 'select', options: ['Overview', 'Open (12)', 'Awaiting approval', 'Completed', 'Squawks', 'Documents', 'Invoices'] },
  },
  args: { style: '', primary: false, dark: false, icons: true, expanded: true, selected: 'Awaiting approval' },
};

export const Playground = {};

export const AllStates = {
  name: 'Style × level × state',
  render: () => matrix(ITEM_STATES, stateRows(false)),
};

export const DarkStates = {
  name: 'Dark: style × level × state',
  parameters: { backgrounds: { value: 'dark' } },
  render: () => matrix(ITEM_STATES, stateRows(true), { dark: true }),
};

export const Navigations = {
  name: 'Style × mode',
  render: () =>
    matrix(
      ['Transparent', 'Decorated'],
      [
        { label: 'Light', cells: Object.values(STYLES).map((style) => box(verticalNav({ style, idPrefix: `l${style}` }))) },
        { label: 'Light, no icons, primary', cells: Object.values(STYLES).map((style) => box(verticalNav({ style, icons: false, primary: true, idPrefix: `p${style}` }))) },
      ],
    ) +
    matrix(
      ['Transparent', 'Decorated'],
      [{ label: 'Dark', cells: Object.values(STYLES).map((style) => box(verticalNav({ style, dark: true, idPrefix: `d${style}` }))) }],
      { dark: true },
    ),
};
