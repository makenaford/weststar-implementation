import { icon, cx, matrix, stateClass } from '../../stories/helpers.js';

const TYPES = ['Image', 'Icon', 'User', 'Navigation', 'Folder', 'Text', 'Metrics Card', 'No background'];
const TYPE_CLASS = { Navigation: 'ws-card--navigation', Folder: 'ws-card--folder', Text: 'ws-card--text', 'Metrics Card': 'ws-card--metrics', 'No background': 'ws-card--plain' };
const SURFACES = { Default: '', Flat: 'ws-card--flat', Outline: 'ws-card--outline' };
const CARD_STATES = ['default', 'hover', 'active', 'disabled'];

const text = ({ subtitle, title, description, meta }) => `
  <div class="ws-card__text">
    ${subtitle ? `<p class="ws-card__subtitle">${subtitle}</p>` : ''}
    <h3 class="ws-card__title">${title}</h3>
    ${description ? `<p class="ws-card__description">${description}</p>` : ''}
  </div>
  ${meta ? `<p class="ws-card__meta">${meta}</p>` : ''}`;

/** Stat tile (Metrics Card). */
export const metricCard = ({ label = 'Open work orders', labelIcon = 'order-form', prefix = '', value = '12', suffix = '', trend = '+3 this week', trendDir = 'up', horizontal = false, state = 'default' } = {}) => `
<div class="${cx('ws-card', 'ws-card--metrics', stateClass(state), { 'ws-card--horizontal': horizontal })}">
  <div class="ws-card__metric-body">
    <p class="ws-card__metric">${prefix ? `<span>${prefix}</span>` : ''}<span class="ws-card__metric-value">${value}</span>${suffix ? `<span>${suffix}</span>` : ''}</p>
    ${trend ? `<span class="${cx('ws-card__trend', { 'ws-card__trend--down': trendDir === 'down', 'ws-card__trend--neutral': trendDir === 'neutral' })}">${trendDir === 'neutral' ? '' : icon(trendDir === 'down' ? 'order-arrow-down' : 'order-arrow-up')}${trend}</span>` : ''}
  </div>
  <p class="ws-card__metric-label">${labelIcon ? icon(labelIcon) : ''}${label}</p>
</div>`;

export const card = ({
  type = 'Image',
  horizontal = false,
  surface = '',
  size = '',
  state = 'default',
  subtitle = 'Work order WO-24817',
  title = 'N375MZ Challenger 350',
  description = 'Phase 3 inspection with landing gear overhaul at Grand Junction.',
  meta = 'Inducted 07 July 2025',
  checkbox = false,
  overflow = false,
  interactive = false,
} = {}) => {
  if (type === 'Metrics Card') return metricCard({ horizontal, state });
  const cls = cx('ws-card', TYPE_CLASS[type], surface, size, stateClass(state), { 'ws-card--horizontal': horizontal, 'ws-card--interactive': interactive });
  const disabled = state === 'disabled' ? ' aria-disabled="true"' : '';
  const check = checkbox || type === 'Folder' ? `<span class="ws-card__check"><label class="ws-checkbox"><input type="checkbox" class="ws-checkbox__input ws-card__checkbox" aria-label="Select ${title}"${state === 'active' ? ' checked' : ''}></label></span>` : '';
  const menu = overflow ? `<span class="ws-card__overflow"><button type="button" class="ws-btn ws-btn--borderless-secondary ws-btn--xs ws-btn--icon" aria-label="More actions">${icon('ellipsis-v')}</button></span>` : '';
  const t = { subtitle, title, description, meta };
  const width = horizontal ? (type === 'Image' || type === 'No background' ? 557 : type === 'Icon' || type === 'User' ? 420 : 288) : type === 'Image' || type === 'No background' ? 250 : 288;
  const style = ` style="width: ${width}px"`;

  switch (type) {
    case 'Image':
    case 'No background':
      return `<article class="${cls}"${style}${disabled}>${check}${menu}<div class="ws-card__media">${icon('picture')}</div><div class="ws-card__body">${text(t)}</div></article>`;
    case 'Icon':
      return `<article class="${cls}"${style}${disabled}>${check}${menu}<div class="ws-card__header">${icon('bolt', 'ws-card__icon')}</div><div class="ws-card__body">${text(t)}</div></article>`;
    case 'User':
      return `<article class="${cls}"${style}${disabled}>${check}${menu}<div class="ws-card__header"><span class="ws-card__avatar">${icon('user')}</span></div><div class="ws-card__body">${text({ ...t, subtitle: 'Account manager', title: 'Dana Whitfield', description: 'West Star Aviation, East Alton', meta: '' })}</div></article>`;
    case 'Navigation':
      return horizontal
        ? `<a href="#" class="${cls}"${style}${disabled}><div class="ws-card__body"><span class="ws-card__sticker">${icon('document')}</span><h3 class="ws-card__title">Invoices</h3></div></a>`
        : `<a href="#" class="${cls}"${style}${disabled}><div class="ws-card__body">${icon('document', 'ws-card__icon')}${text({ subtitle: 'Billing', title: 'Invoices', description: 'Review, approve and pay invoices for every work order.', meta: '3 awaiting payment' })}</div></a>`;
    case 'Folder':
      return `<article class="${cls}"${style}${disabled}><div class="ws-card__body">${check}<span class="ws-card__sticker">${icon('folder')}</span><h3 class="ws-card__title">Logbook entries</h3></div></article>`;
    case 'Text':
      return `<article class="${cls}"${style}${disabled}><div class="ws-card__body">${text(t)}</div></article>`;
    default:
      return '';
  }
};

export default {
  title: 'Components/Card',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/,
  parameters: {
    backgrounds: { value: 'page' },
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Card (248:7552) and Surface (12435:75676). `.ws-card` is the white surface (8px radius, Shadow/Card-Default); Surface styles are `--flat` and `--outline`. Card types are built from `__media`, `__header`, `__body` and the text elements, plus the `--navigation`, `--folder`, `--text`, `--metrics` and `--plain` modifiers. Hover (shadow and underlined title) applies to `a.ws-card` and `.ws-card--interactive`. The portal uses white cards on the gray-100 page and Metrics Cards as stat tiles.',
      },
    },
  },
  render: (args) => card(args),
  argTypes: {
    type: { control: 'select', options: TYPES, description: 'Figma: Type' },
    horizontal: { control: 'boolean', description: 'Figma: Orientation=Horizontal' },
    surface: { control: 'inline-radio', options: Object.values(SURFACES), labels: { '': 'Default', 'ws-card--flat': 'Flat', 'ws-card--outline': 'Outline' }, description: 'Surface Style' },
    size: { control: 'inline-radio', options: ['', 'ws-card--md'], labels: { '': 'Small', 'ws-card--md': 'Medium' }, description: 'Figma: Size' },
    state: { control: 'inline-radio', options: CARD_STATES },
    subtitle: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    meta: { control: 'text', description: 'Figma: Metadata' },
    checkbox: { control: 'boolean' },
    overflow: { control: 'boolean', description: 'Figma: Overflow Btn' },
    interactive: { control: 'boolean', description: 'Adds hover styling (.ws-card--interactive)' },
  },
  args: { type: 'Image', horizontal: false, surface: '', size: '', state: 'default', checkbox: false, overflow: false, interactive: false },
};

export const Playground = {};

export const AllTypes = {
  name: 'Type × state',
  render: () =>
    matrix(
      CARD_STATES,
      TYPES.filter((t) => t !== 'Metrics Card').map((type) => ({ label: type, cells: CARD_STATES.map((state) => card({ type, state })) })),
    ),
};

export const Horizontal = {
  render: () =>
    matrix(
      [''],
      ['Image', 'Icon', 'User', 'Navigation', 'Folder'].map((type) => ({ label: type, cells: [card({ type, horizontal: true })] })),
    ),
};

export const Sizes = {
  render: () => matrix(['Small', 'Medium'], ['Image', 'Text'].map((type) => ({ label: type, cells: [card({ type }), card({ type, size: 'ws-card--md' })] }))),
};

export const Surfaces = {
  name: 'Surface style',
  render: () =>
    matrix(
      Object.keys(SURFACES),
      [{ label: 'Text card', cells: Object.values(SURFACES).map((surface) => card({ type: 'Text', surface })) }],
    ),
};

export const MetricsCards = {
  name: 'Metrics cards (stat tiles)',
  render: () => `
<div class="sb-row" style="align-items: stretch">
  ${metricCard({ label: 'Open work orders', value: '4', trend: '1 new', labelIcon: 'order-form' })}
  ${metricCard({ label: 'Squawks awaiting approval', value: '7', trend: '2 since yesterday', trendDir: 'down', labelIcon: 'warning' })}
  ${metricCard({ label: 'Outstanding invoices', prefix: '$', value: '31.9K', trend: '22.5%', labelIcon: 'dollar-symbol' })}
  ${metricCard({ label: 'On-time delivery', value: '96', suffix: '%', trend: 'Flat', trendDir: 'neutral', labelIcon: 'time', horizontal: true })}
</div>`,
};
