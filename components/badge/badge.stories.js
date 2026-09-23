import { cx, matrix } from '../../stories/helpers.js';

const TYPES = { Primary: 'ws-badge--primary', Info: 'ws-badge--info', Success: 'ws-badge--success', Warning: 'ws-badge--warning', Danger: 'ws-badge--danger' };

export const badge = ({ label = '12', type = 'ws-badge--primary', translucent = false, dark = false } = {}) =>
  `<span class="${cx('ws-badge', type, { 'ws-badge--translucent': translucent, 'ws-badge--dark': dark })}">${label}</span>`;

export default {
  title: 'Components/Badge',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Badge (63:5098). A small count or status pill, e.g. open squawks on a work order. Type is one modifier; translucent and dark (for translucent badges on dark surfaces) are separate modifiers.',
      },
    },
  },
  render: (args) => badge(args),
  argTypes: {
    label: { control: 'text' },
    type: { control: 'select', options: Object.values(TYPES), labels: Object.fromEntries(Object.entries(TYPES).map(([k, v]) => [v, k])) },
    translucent: { control: 'boolean' },
    dark: { control: 'boolean', description: 'Figma "Dark Mode": use on dark surfaces' },
  },
  args: { label: '12', type: 'ws-badge--primary', translucent: false, dark: false },
};

export const Playground = {};

export const AllVariants = {
  name: 'Type × translucent',
  render: () =>
    matrix(
      ['Solid', 'Translucent'],
      Object.entries(TYPES).map(([label, type]) => ({ label, cells: [badge({ type, label: '123' }), badge({ type, label: '123', translucent: true })] })),
    ),
};

export const Dark = {
  name: 'Dark mode',
  parameters: { backgrounds: { value: 'dark' } },
  render: () =>
    matrix(
      ['Solid', 'Translucent'],
      Object.entries(TYPES).map(([label, type]) => ({
        label,
        cells: [badge({ type, label: '123', dark: true }), badge({ type, label: '123', translucent: true, dark: true })],
      })),
      { dark: true },
    ),
};

export const InContext = {
  name: 'In context',
  render: () => `
<div class="sb-row">
  <span class="ws-text-sm">Open squawks ${badge({ label: '3', type: 'ws-badge--danger' })}</span>
  <span class="ws-text-sm">Work orders ${badge({ label: '14', type: 'ws-badge--info', translucent: true })}</span>
  <span class="ws-text-sm">AOG ${badge({ label: '1', type: 'ws-badge--warning' })}</span>
</div>`,
};
