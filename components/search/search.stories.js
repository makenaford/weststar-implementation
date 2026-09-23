import { icon, cx, matrix } from '../../stories/helpers.js';

const SIZES = { Large: 'ws-search--lg', Regular: '', Small: 'ws-search--sm' };
const TYPES = { Auto: 'auto', Manual: 'manual' };

export const search = ({ placeholder = 'Search', value = '', size = '', type = 'auto', focus = false, width = '210px' } = {}) => {
  const cls = cx('ws-search', size, { 'is-focus': focus });
  const leading = type === 'auto' ? icon('search', 'ws-search__icon') : '';
  const submit = type === 'manual' ? `<button type="submit" class="ws-search__submit" aria-label="Search">${icon('search')}</button>` : '';
  return `<div class="${cls}" role="search" style="width:${width}">${leading}<input type="search" class="ws-search__input" placeholder="${placeholder}" aria-label="${placeholder}" value="${value}"><button type="button" class="ws-search__clear" aria-label="Clear search" onclick="const i=this.parentNode.querySelector('input');i.value='';i.focus()">${icon('times')}</button>${submit}</div>`;
};

export default {
  title: 'Components/Search',
  excludeStories: /^[a-z]/, // lowercase exports are render helpers, not stories
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Search (342:1973). Type=Auto has a leading search icon and filters as you type; Type=Manual has a trailing submit button. The clear (times) button appears once the input has a value. Focus uses `:focus-within` (or `.is-focus` for static display).',
      },
    },
  },
  render: (args) => search(args),
  argTypes: {
    placeholder: { control: 'text' },
    value: { control: 'text' },
    size: { control: 'inline-radio', options: Object.values(SIZES), labels: Object.fromEntries(Object.entries(SIZES).map(([k, v]) => [v, k])) },
    type: { control: 'inline-radio', options: Object.values(TYPES), labels: Object.fromEntries(Object.entries(TYPES).map(([k, v]) => [v, k])) },
    focus: { control: 'boolean', description: 'Static focus display (.is-focus)' },
    width: { control: 'text' },
  },
  args: { placeholder: 'Search', value: '', size: '', type: 'auto', focus: false, width: '210px' },
};

export const Playground = {};

export const AllVariants = {
  name: 'Size × type × state',
  render: () =>
    matrix(
      ['Default', 'Focus (with value)'],
      Object.entries(TYPES).flatMap(([typeLabel, type]) =>
        Object.entries(SIZES).map(([sizeLabel, size]) => ({
          label: `${typeLabel} / ${sizeLabel}`,
          cells: [search({ type, size }), search({ type, size, focus: true, value: 'N375MZ' })],
        })),
      ),
    ),
};
