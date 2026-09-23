import { icon, cx, matrix, stateClass } from '../../stories/helpers.js';
import { initTabs } from './tabs.js';

const STYLES = { Classic: '', Underline: 'ws-tabs--underline' };
const TAB_STATES = ['default', 'hover', 'focus', 'active', 'active + focus', 'disabled'];
const LABELS = ['Overview', 'Work orders', 'Squawks', 'Invoices', 'Documents', 'Contacts', 'History', 'Photos'];

const tabStateClass = (state) => (state === 'active + focus' ? 'is-active is-focus' : stateClass(state));

/** One tab. state is a Figma State (default | hover | focus | active | active + focus | disabled). */
export const tab = ({ label = 'Overview', state = 'default', dropdown = false, selected, controls = '', id = '' } = {}) => {
  const isSelected = selected ?? state.startsWith('active');
  const disabled = state === 'disabled' ? ' disabled' : '';
  return `<button type="button" class="${cx('ws-tabs__tab', tabStateClass(state))}" role="tab" aria-selected="${isSelected}"${id ? ` id="${id}"` : ''}${controls ? ` aria-controls="${controls}"` : ''}${disabled}>${label}${dropdown ? icon('caret-bottom') : ''}</button>`;
};

/** Tab list. tabs: number of tabs (Figma 2–8) or an array of labels; active: selected index. */
export const tabs = ({ style = '', tabs: t = 3, active = 0, dropdown = false, label = 'Aircraft sections', panels = false, idPrefix = 'tabs' } = {}) => {
  const labels = Array.isArray(t) ? t : LABELS.slice(0, t);
  const list = `<div class="${cx('ws-tabs', style)}" role="tablist" aria-label="${label}">${labels
    .map((l, i) =>
      tab({ label: l, selected: i === active, dropdown: dropdown && i === labels.length - 1, id: `${idPrefix}-tab-${i}`, controls: panels ? `${idPrefix}-panel-${i}` : '' }),
    )
    .join('')}</div>`;
  if (!panels) return list;
  return `${list}${labels
    .map((l, i) => `<div class="ws-tabs__panel" role="tabpanel" id="${idPrefix}-panel-${i}" aria-labelledby="${idPrefix}-tab-${i}"${i === active ? '' : ' hidden'}>${l} for N375MZ (Challenger 350).</div>`)
    .join('')}`;
};

/** Wrap markup in an element and run initTabs on it, for interactive stories. */
const live = (html) => {
  const el = document.createElement('div');
  el.innerHTML = html;
  initTabs(el);
  return el;
};

export default {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/, // lowercase exports are render helpers, not stories
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Tabs (557:5126), items from Tab-Item (556:5009). Style is a modifier on the `.ws-tabs` list; the selected tab is `aria-selected="true"`. `initTabs(root)` from `tabs.js` wires ARIA roles, panels, click and ←/→/Home/End keys.',
      },
    },
  },
  render: (args) => live(tabs({ ...args, panels: true, idPrefix: 'pg' })),
  argTypes: {
    style: { control: 'select', options: Object.values(STYLES), labels: Object.fromEntries(Object.entries(STYLES).map(([k, v]) => [v, k])) },
    tabs: { control: { type: 'range', min: 2, max: 8, step: 1 }, description: 'Figma "Tabs" (2–8)' },
    active: { control: { type: 'number', min: 0, max: 7 } },
    dropdown: { control: 'boolean', description: 'Figma "Dropdown": caret on the last tab' },
  },
  args: { style: '', tabs: 3, active: 0, dropdown: false },
};

export const Playground = {};

export const AllStates = {
  name: 'Style × state',
  render: () =>
    matrix(
      TAB_STATES,
      Object.entries(STYLES).map(([label, style]) => ({
        label,
        cells: TAB_STATES.map((state) => `<div class="${cx('ws-tabs', style)}" role="tablist" style="padding: 0 8px">${tab({ label: 'Group (15)', state, dropdown: true })}</div>`),
      })),
    ),
};

export const Counts = {
  name: 'Style × tab count',
  render: () =>
    matrix(
      ['Tabs'],
      Object.entries(STYLES).flatMap(([name, style]) => [2, 3, 4, 5, 6, 7, 8].map((n) => ({ label: `${name} / ${n}`, cells: [tabs({ style, tabs: n })] }))),
    ),
};

export const Interactive = {
  name: 'Interactive (initTabs)',
  render: () =>
    live(`<div class="sb-stack">
      <div>${tabs({ tabs: 4, panels: true, idPrefix: 'ic' })}</div>
      <div>${tabs({ style: 'ws-tabs--underline', tabs: ['Overview', 'Work orders', 'Squawks', 'Invoices'], panels: true, idPrefix: 'iu' })}</div>
    </div>`),
};
