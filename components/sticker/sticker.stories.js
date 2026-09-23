import { icon, cx, matrix } from '../../stories/helpers.js';

const TYPES = ['Icon', 'Image', 'Initial'];
// Array of pairs, not an object: a '32' key would be sorted first as an integer key.
const SIZES = [['24 (sm)', 'ws-sticker--sm'], ['32', ''], ['40 (lg)', 'ws-sticker--lg'], ['48 (xl)', 'ws-sticker--xl'], ['80 (xxl)', 'ws-sticker--xxl']];
const surface = (html) => `<div style="display:inline-block;background:var(--utility-component-bg);border-radius:8px">${html}</div>`;

export const sticker = ({ type = 'Initial', size = '', rounded = false, initials = 'MW', iconName = 'picture', src = 'sticker-sample.svg', alt = '' } = {}) => {
  const cls = cx('ws-sticker', size, { 'ws-sticker--image': type === 'Image', 'ws-sticker--rounded': rounded });
  if (type === 'Image') return `<span class="${cls}"><img class="ws-sticker__image" src="${src}" alt="${alt}"></span>`;
  if (type === 'Icon') return `<span class="${cls}">${icon(iconName)}</span>`;
  return `<span class="${cls}">${initials}</span>`;
};

export default {
  title: 'Components/Sticker',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Sticker (225:3717). Used as avatars (customer contacts, technicians) and aircraft thumbnails. Type comes from the content (icon, initials, or `.ws-sticker--image` with an `<img>`); size and rounded are modifiers. Square stickers are white with no border, so they need a tinted surface.',
      },
    },
  },
  decorators: [(story) => surface(`<div style="padding:16px">${story()}</div>`)],
  render: (args) => sticker(args),
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    size: { control: 'select', options: SIZES.map(([, v]) => v), labels: Object.fromEntries(SIZES.map(([k, v]) => [v, k])) },
    rounded: { control: 'boolean' },
    initials: { control: 'text' },
    iconName: { control: 'text', description: 'Clay icon name, e.g. picture, user' },
  },
  args: { type: 'Initial', size: '', rounded: false, initials: 'MW', iconName: 'picture' },
};

export const Playground = {};

export const AllVariants = {
  name: 'Type × rounded × size',
  render: () =>
    matrix(
      SIZES.map(([k]) => k),
      TYPES.flatMap((type) =>
        [false, true].map((rounded) => ({
          label: `${type}${rounded ? ', rounded' : ''}`,
          cells: SIZES.map(([, size]) => sticker({ type, size, rounded, initials: size === 'ws-sticker--xxl' && rounded ? 'AH' : 'MW' })),
        })),
      ),
    ),
};
