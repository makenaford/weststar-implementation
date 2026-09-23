import { icon, maskIcon, matrix } from '../../stories/helpers.js';

const GLYPH = { timelapse: () => maskIcon('timelapse'), warning: () => icon('warning'), 'bell-on': () => icon('bell-on'), check: () => icon('check-circle'), info: () => icon('info-circle') };

export const alertItem = ({ tone = 'warning', glyph = 'timelapse', eyebrow = 'WO CL 10269 · N375MZ', date = '', lead = 'Pending squawk', text = '5.1: RH NLG door bonding wire is fraying.', tag = 'Airworthy', meta = true, action = true, state = 'default' } = {}) => `
<article class="ws-activity${state !== 'default' ? ` is-${state}` : ''}">
  ${tone ? `<span class="ws-activity__icon ws-activity__icon--${tone}">${GLYPH[glyph]()}</span>` : ''}
  <div class="ws-activity__body">
    <div class="ws-activity__top"><p class="ws-activity__eyebrow">${eyebrow}</p>${date ? `<time class="ws-activity__date">${date}</time>` : ''}</div>
    <p class="ws-activity__title"><strong>${lead}</strong> ${text}${tag ? `<span class="ws-label ws-label--danger ws-label--translucent ws-label--sm">${icon('warning-full', 'ws-label__icon')}${tag}</span>` : ''}</p>
    ${meta ? '<ul class="ws-activity__meta"><li>Schedule impact: <b>2 days</b></li><li>Cost: <b>$506.34</b></li><li>Squawk item: <b>5.1</b></li></ul>' : ''}
  </div>
  ${action ? `<div class="ws-activity__action"><button type="button" class="ws-btn ws-btn--outline-secondary ws-btn--xs ws-btn--icon" aria-label="Actions">${icon('ellipsis-v')}</button></div>` : ''}
</article>`;

export const activityItem = ({ eyebrow = 'WO CL 10269 · N375MZ', text = 'You have new squawk activity', date = '05/23/26 10:05 AM', state = 'default' } = {}) => `
<a class="ws-activity ws-activity--simple${state !== 'default' ? ` is-${state}` : ''}" href="#">
  <div class="ws-activity__body">
    <div class="ws-activity__text-group"><p class="ws-activity__eyebrow">${eyebrow}</p><p class="ws-activity__title">${text}</p></div>
    <time class="ws-activity__date">${date}</time>
  </div>
</a>`;

export default {
  title: 'Components/Activity item',
  excludeStories: /^[a-z]/,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Figma: Customer Dashboard "action" rows — Project Alerts (17986:1924) and Recent Activity (17986:2090, main component 16040:109934). A bordered row with an optional status icon disc, text and a trailing action. `.ws-activity--simple` is the Recent Activity style. Stack rows in `.ws-activity-list`.' } } },
  render: (args) => alertItem(args),
  argTypes: {
    tone: { control: 'select', options: ['', 'warning', 'danger', 'info', 'success'] },
    glyph: { control: 'select', options: Object.keys(GLYPH) },
    state: { control: 'inline-radio', options: ['default', 'hover', 'focus'] },
  },
  args: { tone: 'warning', glyph: 'timelapse', eyebrow: 'WO CL 10269 · N375MZ', date: '', lead: 'Pending squawk', text: '5.1: RH NLG door bonding wire is fraying.', tag: 'Airworthy', meta: true, action: true, state: 'default' },
};

export const Playground = {};

export const Alerts = {
  render: () => `<ul class="ws-activity-list" style="max-width:968px">
    <li>${alertItem({})}</li>
    <li>${alertItem({ tone: 'danger', glyph: 'warning', date: '05/23/25', lead: 'Pending squawk escalated to critical' })}</li>
    <li>${alertItem({ tone: 'warning', glyph: 'bell-on', lead: 'PM sent reminder on pending squawk:' })}</li>
    <li>${alertItem({ tone: 'info', glyph: 'info', lead: 'Quote revision 2', text: 'is ready for review.', tag: '', meta: false })}</li>
  </ul>`,
};

export const RecentActivity = {
  name: 'Recent activity (simple)',
  render: () => `<ul class="ws-activity-list ws-activity-list--loose" style="max-width:432px">
    <li>${activityItem({})}</li>
    <li>${activityItem({ text: 'New documents have been added' })}</li>
    <li>${activityItem({ text: 'Invoice INV-20418 has been issued' })}</li>
  </ul>`,
};

export const States = {
  render: () => matrix(['default', 'hover', 'focus'], [{ label: 'Simple', cells: ['default', 'hover', 'focus'].map((state) => `<div style="width:320px">${activityItem({ state })}</div>`) }]),
};
