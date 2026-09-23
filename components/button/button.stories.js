import { icon, cx, matrix, STATES, stateClass } from '../../stories/helpers.js';

const VARIANTS = {
  'Primary / Solid': 'ws-btn--primary',
  'Primary / Outlined': 'ws-btn--outline-primary',
  'Secondary / Outlined': 'ws-btn--outline-secondary',
  'Primary / Borderless': 'ws-btn--borderless-primary',
  'Secondary / Borderless': 'ws-btn--borderless-secondary',
  'Primary / Link': 'ws-btn--link',
};
const SIZES = { Large: 'ws-btn--lg', Default: '', Small: 'ws-btn--sm', XS: 'ws-btn--xs' };

export const button = ({ label = 'Button', variant = 'ws-btn--primary', size = '', state = 'default', rounded = false, iconOnly = false, inverted = false, leftIcon = '', rightIcon = '' } = {}) => {
  const cls = cx('ws-btn', variant, size, stateClass(state), { 'ws-btn--rounded': rounded, 'ws-btn--icon': iconOnly, 'ws-btn--inverted': inverted });
  const disabled = state === 'disabled' ? ' disabled' : '';
  if (iconOnly) return `<button type="button" class="${cls}" aria-label="${label}"${disabled}>${icon(leftIcon || 'plus')}</button>`;
  return `<button type="button" class="${cls}"${disabled}>${leftIcon ? icon(leftIcon) : ''}${label}${rightIcon ? icon(rightIcon) : ''}</button>`;
};

export default {
  title: 'Components/Button',
  excludeStories: /^[a-z]/, // lowercase exports are render helpers, not stories
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Button (145:26649). Color × Type map to one modifier class; size, rounded, icon-only and inverted are separate modifiers. There is no Secondary / Solid in Figma.',
      },
    },
  },
  render: (args) => button(args),
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: Object.values(VARIANTS), labels: Object.fromEntries(Object.entries(VARIANTS).map(([k, v]) => [v, k])) },
    size: { control: 'select', options: Object.values(SIZES), labels: Object.fromEntries(Object.entries(SIZES).map(([k, v]) => [v, k])) },
    state: { control: 'inline-radio', options: STATES },
    rounded: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    inverted: { control: 'boolean' },
    leftIcon: { control: 'text', description: 'Clay icon name, e.g. plus, check, download' },
    rightIcon: { control: 'text' },
  },
  args: { label: 'Button', variant: 'ws-btn--primary', size: '', state: 'default', rounded: false, iconOnly: false, inverted: false, leftIcon: '', rightIcon: '' },
};

export const Playground = {};

export const AllVariants = {
  name: 'Color × type × state',
  render: () =>
    matrix(
      STATES,
      Object.entries(VARIANTS).map(([label, variant]) => ({ label, cells: STATES.map((state) => button({ variant, state })) })),
    ),
};

export const Inverted = {
  name: 'Inverted × state',
  parameters: { backgrounds: { value: 'dark' } },
  render: () =>
    matrix(
      STATES,
      Object.entries(VARIANTS).map(([label, variant]) => ({ label, cells: STATES.map((state) => button({ variant, state, inverted: true })) })),
      { dark: true },
    ),
};

export const Sizes = {
  render: () =>
    matrix(
      ['Label', 'Rounded', 'Icon only', 'Icon only, rounded', 'With icons'],
      Object.entries(SIZES).map(([label, size]) => ({
        label,
        cells: [
          button({ size }),
          button({ size, rounded: true }),
          button({ size, iconOnly: true, label: 'Add' }),
          button({ size, iconOnly: true, rounded: true, label: 'Add' }),
          button({ size, leftIcon: 'download', rightIcon: 'caret-bottom', label: 'Export' }),
        ],
      })),
    ),
};
