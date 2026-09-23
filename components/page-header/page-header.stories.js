import { icon } from '../../stories/helpers.js';

export const pageHeader = ({ title = 'Welcome back, John', context = '(Non Stop Holdings)', subtitle = 'Synced 2 min ago from Corridor', action = true } = {}) => `
<header class="ws-page-header">
  <div class="ws-page-header__text">
    <h1 class="ws-page-header__title">${title}${context ? ` <span class="ws-page-header__context">${context}</span>` : ''}</h1>
    ${subtitle ? `<p class="ws-page-header__subtitle">${subtitle}</p>` : ''}
  </div>
  ${action ? `<div class="ws-page-header__actions"><button type="button" class="ws-btn ws-btn--outline-primary ws-btn--sm">${icon('reload')}Refresh</button></div>` : ''}
</header>`;

export default {
  title: 'Components/Page header',
  excludeStories: /^[a-z]/,
  tags: ['autodocs'],
  parameters: { backgrounds: { value: 'page' }, docs: { description: { component: 'Figma: Customer Dashboard "Banner" (17986:1677, main component 16201:30298). H3 bold title with an optional medium-weight context, an H6 gray-600 subtitle and actions on the right.' } } },
  render: (args) => pageHeader(args),
  args: { title: 'Welcome back, John', context: '(Non Stop Holdings)', subtitle: 'Synced 2 min ago from Corridor', action: true },
};

export const Playground = {};
export const TitleOnly = { name: 'Title only', args: { context: '', subtitle: '', action: false, title: 'Projects' } };
