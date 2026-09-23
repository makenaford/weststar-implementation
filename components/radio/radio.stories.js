import { cx, matrix } from '../../stories/helpers.js';

const STATES = ['default', 'hover', 'focus', 'disabled'];

let uid = 0;

export const radio = ({ label = 'Label', checked = false, state = 'default', showLabel = true, name = '' } = {}) => {
  const cls = cx('ws-radio', state !== 'default' && `is-${state}`);
  const attrs = [
    ` name="${name || `ws-radio-${++uid}`}"`,
    checked ? ' checked' : '',
    state === 'disabled' ? ' disabled' : '',
    showLabel ? '' : ` aria-label="${label}"`,
  ].join('');
  return `<label class="${cls}"><input type="radio" class="ws-radio__input"${attrs}>${showLabel ? `<span class="ws-radio__label">${label}</span>` : ''}</label>`;
};

export default {
  title: 'Components/Radio',
  excludeStories: /^[a-z]/, // lowercase exports are render helpers, not stories
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Radio Button (342:42125). A styled native `<input type="radio">` inside a `<label>`. Static `.is-*` state classes go on `.ws-radio`.',
      },
    },
  },
  render: (args) => radio(args),
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    state: { control: 'inline-radio', options: STATES },
    showLabel: { control: 'boolean' },
  },
  args: { label: 'Label', checked: false, state: 'default', showLabel: true },
};

export const Playground = {};

export const AllVariants = {
  name: 'Checked × state',
  render: () =>
    matrix(
      STATES,
      [
        { label: 'Off', cells: STATES.map((state) => radio({ state })) },
        { label: 'On', cells: STATES.map((state) => radio({ state, checked: true })) },
      ],
    ),
};

export const Group = {
  name: 'Group (example)',
  render: () => `
<fieldset class="sb-stack" style="border:0;padding:0;margin:0;gap:8px">
  <legend class="ws-text-base is-semibold" style="margin-bottom:8px">Work order priority</legend>
  ${radio({ label: 'AOG — aircraft on ground', name: 'priority' })}
  ${radio({ label: 'Scheduled maintenance', name: 'priority', checked: true })}
  ${radio({ label: 'Deferred squawk', name: 'priority' })}
  ${radio({ label: 'Warranty claim (not eligible)', name: 'priority', state: 'disabled' })}
</fieldset>`,
};
