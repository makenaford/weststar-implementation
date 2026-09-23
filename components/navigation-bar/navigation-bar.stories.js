import { icon, cx, matrix, STATES, stateClass } from '../../stories/helpers.js';

const STYLES = { Bar: '', Pill: 'ws-navbar--pill' };
const ITEMS = ['Dashboard', 'Aircraft', 'Projects', 'Squawks', 'Invoices', 'Documents'];

/** One nav item (Figma _NavBar Tab). state: default | hover | focus | active | disabled. */
export const navItem = ({ label = 'Aircraft', state = 'default', dropdown = false, href = '#' } = {}) => {
  const cls = cx('ws-navbar__item', stateClass(state));
  const current = state === 'active' ? ' aria-current="page"' : '';
  const disabled = state === 'disabled' ? ' aria-disabled="true" tabindex="-1"' : '';
  return `<a class="${cls}" href="${href}"${current}${disabled}>${label}${dropdown ? icon('caret-bottom') : ''}</a>`;
};

/** Navigation bar. items: array of labels; active: index of the current page. */
export const navbar = ({ style = '', inverted = false, items = ITEMS, active = 0, dropdown = false, label = 'Main' } = {}) =>
  `<nav class="${cx('ws-navbar', style, { 'ws-navbar--inverted': inverted })}" aria-label="${label}">${items
    .map((l, i) => navItem({ label: l, state: i === active ? 'active' : 'default', dropdown: dropdown && i === items.length - 1 }))
    .join('')}</nav>`;

export default {
  title: 'Components/Navigation Bar',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/, // lowercase exports are render helpers, not stories
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Navigation Bar (502:4177), items from _NavBar Tab (502:3962). Mark the current page with `aria-current="page"`. `.ws-navbar--inverted` is the portal\'s dark navy top bar (primary-d1 background, primary bottom border, primary-l2 text).',
      },
    },
  },
  render: (args) => navbar({ ...args, items: ITEMS.slice(0, args.count) }),
  argTypes: {
    style: { control: 'select', options: Object.values(STYLES), labels: Object.fromEntries(Object.entries(STYLES).map(([k, v]) => [v, k])) },
    inverted: { control: 'boolean' },
    count: { control: { type: 'range', min: 1, max: 6, step: 1 }, description: 'Number of nav items' },
    active: { control: { type: 'number', min: -1, max: 5 } },
    dropdown: { control: 'boolean', description: 'Figma "Dropdown": caret on the last item' },
  },
  args: { style: '', inverted: false, count: 6, active: 0, dropdown: true },
};

export const Playground = {};

export const Bars = {
  name: 'Style × inverted',
  render: () =>
    `<div class="sb-stack">${[false, true]
      .flatMap((inverted) => Object.values(STYLES).map((style) => navbar({ style, inverted, dropdown: true })))
      .join('')}</div>`,
};

export const AllStates = {
  name: 'Item: style × state',
  render: () =>
    matrix(
      STATES,
      Object.entries(STYLES).map(([label, style]) => ({
        label,
        cells: STATES.map((state) => `<div class="${cx('ws-navbar', style)}">${navItem({ label: 'Aircraft', state, dropdown: true })}</div>`),
      })),
    ),
};

export const InvertedStates = {
  name: 'Item: inverted × state',
  parameters: { backgrounds: { value: 'dark' } },
  render: () =>
    matrix(
      STATES,
      Object.entries(STYLES).map(([label, style]) => ({
        label,
        cells: STATES.map((state) => `<div class="${cx('ws-navbar ws-navbar--inverted', style)}">${navItem({ label: 'Aircraft', state, dropdown: true })}</div>`),
      })),
      { dark: true },
    ),
};
