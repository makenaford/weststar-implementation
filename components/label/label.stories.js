import { icon, cx, matrix } from '../../stories/helpers.js';

const TYPES = { Neutral: 'ws-label--neutral', Info: 'ws-label--info', Success: 'ws-label--success', Warning: 'ws-label--warning', Danger: 'ws-label--danger', Primary: 'ws-label--primary' };
const STYLES = { Translucent: 'ws-label--translucent', Outline: 'ws-label--outline', Solid: 'ws-label--solid' };
const SIZES = { Large: '', Small: 'ws-label--sm' };

export const label = ({ label = 'Label', type = 'ws-label--neutral', style = 'ws-label--translucent', size = '', leftIcon = '', rightIcon = '' } = {}) =>
  `<span class="${cx('ws-label', type, style, size)}">${leftIcon ? icon(leftIcon, 'ws-label__icon') : ''}${label}${rightIcon ? icon(rightIcon, 'ws-label__icon ws-label__icon--right') : ''}</span>`;

const opts = (map) => ({ options: Object.values(map), labels: Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k])) });

export default {
  title: 'Components/Label',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Label (210:3634). The portal uses labels as status pills (work order status, invoice status, AOG). Type, style and size are modifier classes; the optional left and right icons are `.ws-label__icon` children. Figma Size=Small is inconsistent, so every small label follows the Neutral Small spec.',
      },
    },
  },
  render: (args) => label(args),
  argTypes: {
    label: { control: 'text' },
    type: { control: 'select', ...opts(TYPES) },
    style: { control: 'inline-radio', ...opts(STYLES) },
    size: { control: 'inline-radio', ...opts(SIZES) },
    leftIcon: { control: 'text', description: 'Clay icon name, e.g. check' },
    rightIcon: { control: 'text', description: 'Clay icon name, e.g. times-small' },
  },
  args: { label: 'Label', type: 'ws-label--neutral', style: 'ws-label--translucent', size: '', leftIcon: '', rightIcon: '' },
};

export const Playground = {};

const grid = (size) =>
  matrix(
    Object.keys(TYPES),
    Object.entries(STYLES).map(([name, style]) => ({ label: name, cells: Object.values(TYPES).map((type) => label({ type, style, size })) })),
  );

export const AllVariants = { name: 'Type × style (large)', render: () => grid('') };
export const Small = { name: 'Type × style (small)', render: () => grid('ws-label--sm') };

export const WithIcons = {
  name: 'With icons',
  render: () =>
    matrix(
      ['Left icon', 'Right icon', 'Both'],
      Object.entries(SIZES).map(([name, size]) => ({
        label: name,
        cells: [
          label({ size, type: 'ws-label--success', label: 'Approved', leftIcon: 'check' }),
          label({ size, type: 'ws-label--info', label: 'N375MZ', rightIcon: 'times-small' }),
          label({ size, type: 'ws-label--primary', style: 'ws-label--outline', label: 'Filter', leftIcon: 'check', rightIcon: 'times-small' }),
        ],
      })),
    ),
};

export const StatusPills = {
  name: 'Status pills',
  render: () => `
<div class="sb-row">
  ${label({ label: 'In progress', type: 'ws-label--info' })}
  ${label({ label: 'Awaiting approval', type: 'ws-label--warning' })}
  ${label({ label: 'Completed', type: 'ws-label--success' })}
  ${label({ label: 'AOG', type: 'ws-label--danger', style: 'ws-label--solid' })}
  ${label({ label: 'Draft', type: 'ws-label--neutral' })}
  ${label({ label: 'Invoice overdue', type: 'ws-label--danger', size: 'ws-label--sm' })}
</div>`,
};
