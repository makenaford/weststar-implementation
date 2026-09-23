import { icon, cx, matrix } from '../../stories/helpers.js';

const SIZES = { Regular: '', Small: 'ws-toggle--sm' };

export const toggle = ({ label = 'Label', size = '', checked = false, disabled = false, focus = false, showIcon = true, iconName = 'bell-on', showLabel = true } = {}) => {
  const cls = cx('ws-toggle', size, { 'is-focus': focus });
  const attrs = [checked ? ' checked' : '', disabled ? ' disabled' : '', showLabel ? '' : ` aria-label="${label}"`].join('');
  return `<label class="${cls}"><input type="checkbox" role="switch" class="ws-toggle__input"${attrs}><span class="ws-toggle__track"><span class="ws-toggle__knob">${showIcon ? icon(iconName) : ''}</span></span>${showLabel ? `<span class="ws-toggle__label">${label}</span>` : ''}</label>`;
};

export default {
  title: 'Components/Toggle',
  excludeStories: /^[a-z]/, // lowercase exports are render helpers, not stories
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Toggle (596:1387). A native `<input type="checkbox" role="switch">`, visually hidden and drawn by `.ws-toggle__track`, so it works with no JS. Figma has no focus variant; focus puts the standard focus ring on the track.',
      },
    },
  },
  render: (args) => toggle(args),
  argTypes: {
    label: { control: 'text' },
    size: { control: 'inline-radio', options: Object.values(SIZES), labels: Object.fromEntries(Object.entries(SIZES).map(([k, v]) => [v, k])) },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    focus: { control: 'boolean', description: 'Static focus display (.is-focus)' },
    showIcon: { control: 'boolean' },
    iconName: { control: 'text', description: 'Clay icon name, e.g. bell-on, check, lock' },
    showLabel: { control: 'boolean' },
  },
  args: { label: 'Label', size: '', checked: true, disabled: false, focus: false, showIcon: true, iconName: 'bell-on', showLabel: true },
};

export const Playground = {};

const COLS = ['On', 'Off', 'On, disabled', 'Off, disabled', 'On, focus', 'No icon'];

export const AllVariants = {
  name: 'Size × checked × disabled',
  render: () =>
    matrix(
      COLS,
      Object.entries(SIZES).map(([label, size]) => ({
        label,
        cells: [
          toggle({ size, checked: true }),
          toggle({ size }),
          toggle({ size, checked: true, disabled: true }),
          toggle({ size, disabled: true }),
          toggle({ size, checked: true, focus: true }),
          toggle({ size, checked: true, showIcon: false }),
        ],
      })),
    ),
};

export const Settings = {
  name: 'Settings list (example)',
  render: () => `
<div class="sb-stack">
  ${toggle({ label: 'Email me when a squawk is added to N375MZ', checked: true })}
  ${toggle({ label: 'Text me AOG updates', checked: false })}
  ${toggle({ label: 'Invoice reminders (managed by your account admin)', checked: true, disabled: true })}
</div>`,
};
