import { icon, cx, matrix, STATES, stateClass } from '../../stories/helpers.js';

const SIZES = { Large: 'ws-link--lg', Base: '', Small: 'ws-link--sm' };

export const link = ({ label = 'Link', href = '#', size = '', state = 'default', inverted = false, underlined = false, leftIcon = '', rightIcon = '' } = {}) => {
  const cls = cx('ws-link', size, stateClass(state), { 'ws-link--inverted': inverted, 'ws-link--underlined': underlined });
  const disabled = state === 'disabled' ? ' aria-disabled="true" tabindex="-1"' : '';
  return `<a class="${cls}" href="${href}"${disabled}>${leftIcon ? icon(leftIcon) : ''}${label}${rightIcon ? icon(rightIcon) : ''}</a>`;
};

export default {
  title: 'Components/Link',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Link (6681:11885). A text link, underlined on hover and active. Size, inverted and underlined are modifiers; icons are optional `.ws-icon` children. Disable a link with `aria-disabled="true"`. Figma has no focus state, so focus uses the standard focus ring.',
      },
    },
  },
  render: (args) => link(args),
  argTypes: {
    label: { control: 'text' },
    size: { control: 'inline-radio', options: Object.values(SIZES), labels: Object.fromEntries(Object.entries(SIZES).map(([k, v]) => [v, k])) },
    state: { control: 'inline-radio', options: STATES },
    inverted: { control: 'boolean' },
    underlined: { control: 'boolean' },
    leftIcon: { control: 'text', description: 'Clay icon name, e.g. download' },
    rightIcon: { control: 'text', description: 'Clay icon name, e.g. angle-right, shortcut' },
  },
  args: { label: 'Link', size: '', state: 'default', inverted: false, underlined: false, leftIcon: '', rightIcon: '' },
};

export const Playground = {};

const rows = (opts) => Object.entries(SIZES).map(([label, size]) => ({ label, cells: STATES.map((state) => link({ size, state, ...opts })) }));

export const AllVariants = { name: 'Size × state', render: () => matrix(STATES, rows({})) };

export const Inverted = {
  name: 'Inverted × state',
  parameters: { backgrounds: { value: 'dark' } },
  render: () => matrix(STATES, rows({ inverted: true }), { dark: true }),
};

export const Underlined = { name: 'Underlined × state', render: () => matrix(STATES, rows({ underlined: true })) };

export const WithIcons = {
  name: 'With icons',
  render: () =>
    matrix(
      ['Left icon', 'Right icon', 'Inverted'],
      Object.entries(SIZES).map(([label, size]) => ({
        label,
        cells: [
          link({ size, label: 'Download invoice', leftIcon: 'download' }),
          link({ size, label: 'View work order', rightIcon: 'angle-right' }),
          `<span class="sb-matrix--dark" style="display:inline-block;padding:8px">${link({ size, inverted: true, label: 'Open in new tab', rightIcon: 'shortcut' })}</span>`,
        ],
      })),
    ),
};
