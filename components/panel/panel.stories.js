import { icon } from '../../stories/helpers.js';

export const panel = ({ title = 'Project alerts', count = '12', countTone = 'danger', action = 'link', body = '' } = {}) => `
<section class="ws-panel" aria-label="${title}">
  <header class="ws-panel__header">
    <h2 class="ws-panel__title">${title}</h2>
    ${count ? `<span class="ws-badge ws-badge--${countTone} ws-badge--translucent ws-panel__count">${count}</span>` : ''}
    ${action === 'link' ? `<div class="ws-panel__actions"><a class="ws-link" href="#">View all${icon('order-arrow-right')}</a></div>` : ''}
    ${action === 'toolbar' ? `<div class="ws-panel__actions"><div class="ws-search" role="search" style="width:280px"><input type="search" class="ws-search__input" placeholder="Search projects" aria-label="Search projects"><button type="button" class="ws-search__submit" aria-label="Search">${icon('search')}</button></div><button type="button" class="ws-btn ws-btn--outline-primary ws-btn--sm">${icon('filter')}Filter</button></div>` : ''}
  </header>
  ${body || '<div class="ws-panel__well"><p style="margin:0;font-size:14px;color:var(--color-gray-600)">Panel content</p></div>'}
</section>`;

export default {
  title: 'Components/Panel',
  excludeStories: /^[a-z]/,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { value: 'page' },
    docs: { description: { component: 'Figma: Customer Dashboard section containers ("Tank Data" 17986:1916, 17986:2085, 17988:97671). White, 16px radius, 24px padding, with a header holding the title, an optional count badge and actions or a "View all" link. `.ws-panel__well` is the nested bordered list container.' } },
  },
  render: (args) => panel(args),
  argTypes: {
    countTone: { control: 'select', options: ['primary', 'info', 'success', 'warning', 'danger'] },
    action: { control: 'inline-radio', options: ['none', 'link', 'toolbar'] },
  },
  args: { title: 'Project alerts', count: '12', countTone: 'danger', action: 'link' },
};

export const Playground = {};

export const Variants = {
  render: () => `<div class="sb-stack" style="align-items:stretch">
    ${panel({ title: 'Project list', count: '12', countTone: 'info', action: 'toolbar' })}
    ${panel({ title: 'Project alerts', count: '12', countTone: 'danger', action: 'link' })}
    ${panel({ title: 'Financial information', count: '', action: 'link' })}
  </div>`,
};
