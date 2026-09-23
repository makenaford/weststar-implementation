import { icon, cx, matrix } from '../../stories/helpers.js';

const STATES = { Loading: '', Warning: 'ws-progress--warning', Completed: 'ws-progress--completed' };
const VALUES = [0, 10, 30, 50, 70, 90];

export const progressBar = ({ value = 30, state = '', label = 'Progress' } = {}) => {
  const completed = state === 'ws-progress--completed';
  const v = completed ? 100 : Math.max(0, Math.min(100, value));
  const end = completed ? icon('check-circle', 'ws-progress__icon') : `<span class="ws-progress__value">${v}%</span>`;
  return `<div class="${cx('ws-progress', state)}" role="progressbar" aria-label="${label}" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100"><div class="ws-progress__track"><div class="ws-progress__bar" style="width: ${v}%"></div></div>${end}</div>`;
};

export default {
  title: 'Components/Progress Bar',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Progress Bar (545:228). Shows how far along something is, e.g. work order completion or an upload. State is a modifier; the value is the bar\'s inline width plus the percentage text. Completed replaces the percentage with a check-circle icon.',
      },
    },
  },
  decorators: [(story) => `<div style="max-width: 356px">${story()}</div>`],
  render: (args) => progressBar(args),
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    state: { control: 'inline-radio', options: Object.values(STATES), labels: Object.fromEntries(Object.entries(STATES).map(([k, v]) => [v, k])) },
    label: { control: 'text', description: 'Accessible name (aria-label)' },
  },
  args: { value: 30, state: '', label: 'Progress' },
};

export const Playground = {};

export const AllVariants = {
  name: 'State × value',
  render: () =>
    `<div style="width: 356px">${[
      ...VALUES.map((value) => progressBar({ value })),
      ...VALUES.map((value) => progressBar({ value, state: 'ws-progress--warning' })),
      progressBar({ state: 'ws-progress--completed' }),
    ].join('')}</div>`,
};

export const InContext = {
  name: 'In context',
  render: () => `
<div class="sb-stack" style="width: 356px; gap: 4px">
  <span class="ws-text-sm is-semibold">N375MZ · Phase 3 inspection</span>
  ${progressBar({ value: 70, label: 'Work order progress' })}
  <span class="ws-text-sm is-semibold">N512WS · Avionics upgrade</span>
  ${progressBar({ value: 30, state: 'ws-progress--warning', label: 'Work order progress' })}
  <span class="ws-text-sm is-semibold">N88GX · Paint</span>
  ${progressBar({ state: 'ws-progress--completed', label: 'Work order progress' })}
</div>`,
};
