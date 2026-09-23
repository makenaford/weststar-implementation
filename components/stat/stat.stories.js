import { icon, maskIcon, matrix } from '../../stories/helpers.js';

const ICONS = { cog: (c) => icon('cog', c), time: (c) => icon('time', c), warning: (c) => icon('warning', c), payments: (c) => maskIcon('payments', c), draft: (c) => maskIcon('draft', c) };
const TONES = ['', 'accent', 'info', 'success', 'warning', 'danger', 'orange'];

export const stat = ({ label = 'Active projects', value = '3', meta = '', iconName = 'cog', tone = 'accent' } = {}) => `
<div class="ws-stat">
  <div class="ws-stat__header"><span class="ws-stat__label">${label}</span>${ICONS[iconName]?.(`ws-stat__icon${tone ? ` ws-stat__icon--${tone}` : ''}`) ?? ''}</div>
  <p class="ws-stat__value">${value}</p>
  ${meta ? `<p class="ws-stat__meta">${meta}</p>` : ''}
</div>`;

export default {
  title: 'Components/Stat',
  excludeStories: /^[a-z]/,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Figma: Customer Dashboard "stat" tile (17986:1681, main component 16084:126794). A KPI tile with a small-caps label, a 16px icon and an H3 bold value. Group tiles with `.ws-stat-group` (16px gap) or `.ws-stat-group--tight` (8px).' } } },
  render: (args) => `<div style="max-width:300px">${stat(args)}</div>`,
  argTypes: {
    iconName: { control: 'select', options: Object.keys(ICONS) },
    tone: { control: 'select', options: TONES },
  },
  args: { label: 'Active projects', value: '3', meta: '', iconName: 'cog', tone: 'accent' },
};

export const Playground = {};

export const Dashboard = {
  name: 'Dashboard row',
  parameters: { backgrounds: { value: 'page' } },
  render: () => `<div class="ws-stat-group">
    ${stat({ label: 'Active projects', value: '3', iconName: 'cog', tone: 'accent' })}
    ${stat({ label: 'Upcoming projects', value: '14', iconName: 'time', tone: 'accent' })}
    ${stat({ label: 'Pending squawks', value: '7', iconName: 'warning', tone: 'warning' })}
    ${stat({ label: 'Outstanding balance', value: '$123,945', iconName: 'payments', tone: 'orange' })}
    ${stat({ label: 'Paid to date', value: '$456,967', iconName: 'draft', tone: 'info' })}
  </div>`,
};

export const IconTones = {
  name: 'Icon tones',
  render: () => matrix(TONES.map((t) => t || 'default'), [{ label: 'Tone', cells: TONES.map((tone) => `<div style="width:180px">${stat({ label: 'Delivery date', value: 'Jul 22', meta: '69 days remaining', iconName: 'time', tone })}</div>`) }]),
};
