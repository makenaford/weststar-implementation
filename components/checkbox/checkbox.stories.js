import { cx, matrix } from '../../stories/helpers.js';

const STATES = ['default', 'hover', 'focus', 'disabled'];
const CHECKED = { Unchecked: 'unchecked', Indeterminate: 'indeterminate', Checked: 'checked' };

export const checkbox = ({ label = 'Label', checked = 'unchecked', state = 'default', showLabel = true, name = '' } = {}) => {
  const cls = cx('ws-checkbox', state !== 'default' && `is-${state}`);
  const attrs = [
    checked === 'checked' ? ' checked' : '',
    state === 'disabled' ? ' disabled' : '',
    name ? ` name="${name}"` : '',
    showLabel ? '' : ` aria-label="${label}"`,
  ].join('');
  // .is-indeterminate draws the dash statically; in real use set input.indeterminate = true.
  const input = `<input type="checkbox" class="${cx('ws-checkbox__input', { 'is-indeterminate': checked === 'indeterminate' })}"${attrs}>`;
  return `<label class="${cls}">${input}${showLabel ? `<span class="ws-checkbox__label">${label}</span>` : ''}</label>`;
};

export default {
  title: 'Components/Checkbox',
  excludeStories: /^[a-z]/, // lowercase exports are render helpers, not stories
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Checkbox (159:2711). A styled native `<input type="checkbox">` inside a `<label>`. Indeterminate is the native `:indeterminate` state (set `input.indeterminate = true`); `.is-indeterminate` draws it statically. Static `.is-*` state classes go on `.ws-checkbox`.',
      },
    },
  },
  render: (args) => checkbox(args),
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'inline-radio', options: Object.values(CHECKED), labels: Object.fromEntries(Object.entries(CHECKED).map(([k, v]) => [v, k])) },
    state: { control: 'inline-radio', options: STATES },
    showLabel: { control: 'boolean' },
  },
  args: { label: 'Label', checked: 'unchecked', state: 'default', showLabel: true },
};

export const Playground = {};

export const AllVariants = {
  name: 'Checked × state',
  render: () =>
    matrix(
      STATES,
      Object.entries(CHECKED).map(([label, checked]) => ({ label, cells: STATES.map((state) => checkbox({ checked, state })) })),
    ),
};

export const Group = {
  name: 'Group (example)',
  render: () => `
<fieldset class="sb-stack" style="border:0;padding:0;margin:0;gap:8px">
  <legend class="ws-text-base is-semibold" style="margin-bottom:8px">Inspection scope for N375MZ</legend>
  ${checkbox({ label: 'Landing gear overhaul', checked: 'checked', name: 'scope' })}
  ${checkbox({ label: 'Engine borescope', checked: 'checked', name: 'scope' })}
  ${checkbox({ label: 'Interior refurbishment', name: 'scope' })}
  ${checkbox({ label: 'Avionics upgrade (quote pending)', state: 'disabled', name: 'scope' })}
</fieldset>`,
};
