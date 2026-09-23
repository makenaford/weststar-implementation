import { icon, cx, matrix, stateClass } from '../../stories/helpers.js';

const CRUMB_STATES = ['default', 'hover', 'focus', 'active'];
const TRAIL = ['Home', 'Aircraft', 'N375MZ', 'Projects', 'WO-24817 Phase inspection'];

/** One crumb (Figma _Crumb). variant: default | nested-left | nested-right; state: default | hover | focus | active. */
export const crumb = ({ label = 'Aircraft', state = 'default', variant = 'default', href = '#', separator = true } = {}) => {
  if (variant !== 'default') {
    const dir = variant === 'nested-left' ? 'left' : 'right';
    return `<li class="ws-breadcrumb__item"><button type="button" class="${cx('ws-breadcrumb__link ws-breadcrumb__link--nested', stateClass(state))}" aria-label="Show more crumbs">${icon(`angle-double-${dir}-small`)}</button></li>`;
  }
  if (state === 'active') return `<li class="ws-breadcrumb__item"><span class="ws-breadcrumb__current" aria-current="page">${label}</span></li>`;
  return `<li class="ws-breadcrumb__item"><a class="${cx('ws-breadcrumb__link', stateClass(state))}" href="${href}">${label}</a>${separator ? icon('angle-right', 'ws-breadcrumb__sep') : ''}</li>`;
};

/** Breadcrumb trail. crumbs: count (Figma 2–5) or array of labels; the last one is the current page. */
export const breadcrumb = ({ crumbs = 3, nestedLeft = false, nestedRight = false } = {}) => {
  const labels = Array.isArray(crumbs) ? crumbs : TRAIL.slice(TRAIL.length - crumbs);
  return `<nav aria-label="Breadcrumb"><ol class="ws-breadcrumb">${nestedLeft ? crumb({ variant: 'nested-left' }) : ''}${labels
    .map((label, i) => crumb({ label, state: i === labels.length - 1 ? 'active' : 'default' }))
    .join('')}${nestedRight ? crumb({ variant: 'nested-right' }) : ''}</ol></nav>`;
};

const one = (html) => `<ol class="ws-breadcrumb">${html}</ol>`;

export default {
  title: 'Components/Breadcrumb',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/, // lowercase exports are render helpers, not stories
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Breadcrumb (114:2654), crumbs from _Crumb (114:2528). An `ol.ws-breadcrumb` inside `nav[aria-label="Breadcrumb"]`; the last crumb is `.ws-breadcrumb__current[aria-current="page"]`. Nested crumbs (« ») stand in for collapsed parts of a long trail.',
      },
    },
  },
  render: (args) => breadcrumb(args),
  argTypes: {
    crumbs: { control: { type: 'range', min: 2, max: 5, step: 1 }, description: 'Figma "Crumbs" (2–5)' },
    nestedLeft: { control: 'boolean', description: 'Collapsed crumbs at the start («)' },
    nestedRight: { control: 'boolean', description: 'Collapsed crumbs at the end (»)' },
  },
  args: { crumbs: 3, nestedLeft: false, nestedRight: false },
};

export const Playground = {};

export const AllStates = {
  name: 'Crumb: variant × state',
  render: () =>
    matrix(CRUMB_STATES, [
      { label: 'Default', cells: CRUMB_STATES.map((state) => one(crumb({ label: 'Breadcrumb', state }))) },
      { label: 'Nested - Left', cells: CRUMB_STATES.map((state) => (state === 'active' ? '' : one(crumb({ variant: 'nested-left', state })))) },
      { label: 'Nested - Right', cells: CRUMB_STATES.map((state) => (state === 'active' ? '' : one(crumb({ variant: 'nested-right', state })))) },
    ]),
};

export const Counts = {
  name: 'Crumbs',
  render: () =>
    matrix(
      ['Trail'],
      [
        ...[2, 3, 4, 5].map((n) => ({ label: `${n} crumbs`, cells: [breadcrumb({ crumbs: n })] })),
        { label: 'Collapsed', cells: [breadcrumb({ crumbs: 3, nestedLeft: true })] },
      ],
    ),
};
