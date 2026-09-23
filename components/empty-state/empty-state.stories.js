import { cx, matrix } from '../../stories/helpers.js';
import { button } from '../button/button.stories.js';

const SIZES = { Regular: '', Small: 'ws-empty-state--sm' };
const VARIANTS = { 'With Animation': 'animated', 'Without Animation': 'plain' };
const ILLUSTRATIONS = ['spaceship', 'satellite', 'telescope'];

export const emptyState = ({
  size = '',
  variant = 'animated',
  illustration = 'spaceship',
  title = 'No open work orders',
  description = 'When West Star opens a work order for one of your aircraft, it will show up here.',
  showButton = true,
  buttonLabel = 'Request service',
} = {}) => {
  const plain = variant === 'plain';
  const small = size === 'ws-empty-state--sm';
  const btn = button({ label: buttonLabel, variant: plain ? 'ws-btn--primary' : 'ws-btn--outline-primary', size: small ? 'ws-btn--sm' : '' });
  return `<div class="${cx('ws-empty-state', size, { 'ws-empty-state--plain': plain })}">
  ${plain ? '' : `<img class="ws-empty-state__illustration" src="illustrations/${illustration}.svg" alt="" width="250" height="250">`}
  <div class="ws-empty-state__content">
    <div class="ws-empty-state__text">
      <p class="ws-empty-state__title">${title}</p>
      <p class="ws-empty-state__description">${description}</p>
    </div>
    ${showButton ? `<div class="ws-empty-state__actions">${btn}</div>` : ''}
  </div>
</div>`;
};

const opts = (o) => ({ options: Object.values(o), labels: Object.fromEntries(Object.entries(o).map(([k, v]) => [v, k])) });

export default {
  title: 'Components/Empty State',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Empty State (326:1136), with the _Illustration set (325:1278): satellite, spaceship and telescope, served from assets/illustrations/. Size and the Without Animation variant (`.ws-empty-state--plain`: no illustration, left aligned) are modifiers; the button is optional.',
      },
    },
  },
  render: (args) => emptyState(args),
  argTypes: {
    size: { control: 'inline-radio', ...opts(SIZES) },
    variant: { control: 'inline-radio', ...opts(VARIANTS) },
    illustration: { control: 'inline-radio', options: ILLUSTRATIONS, if: { arg: 'variant', eq: 'animated' } },
    title: { control: 'text' },
    description: { control: 'text' },
    showButton: { control: 'boolean', name: 'Button' },
    buttonLabel: { control: 'text' },
  },
  args: {
    size: '',
    variant: 'animated',
    illustration: 'spaceship',
    title: 'No open work orders',
    description: 'When West Star opens a work order for one of your aircraft, it will show up here.',
    showButton: true,
    buttonLabel: 'Request service',
  },
};

export const Playground = {};

export const AllVariants = {
  name: 'Size × variant',
  render: () =>
    matrix(
      ['Regular', 'Small'],
      [
        { label: 'With Animation', cells: [emptyState({}), emptyState({ size: 'ws-empty-state--sm' })] },
        { label: 'Without Animation', cells: ['<span class="ws-text-xs">Not in Figma</span>', emptyState({ size: 'ws-empty-state--sm', variant: 'plain' })] },
      ],
    ),
};

export const Illustrations = {
  render: () =>
    matrix(
      ILLUSTRATIONS,
      [
        {
          label: 'Regular',
          cells: [
            emptyState({ illustration: 'spaceship' }),
            emptyState({ illustration: 'satellite', title: 'No invoices yet', description: 'Invoices for completed work orders will appear here.', buttonLabel: 'View work orders' }),
            emptyState({ illustration: 'telescope', title: 'No results for “N375ZZ”', description: 'Check the tail number or try a different search.', showButton: false }),
          ],
        },
      ],
    ),
};
