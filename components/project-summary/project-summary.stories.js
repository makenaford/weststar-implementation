import { icon } from '../../stories/helpers.js';

const IMG = 'images/aircraft-g650.png';
const title = (wo, site) => `<span class="ws-project__wo">WO: <b>${wo}</b></span> · ${site}`;
const steps = (pct) => `<span class="ws-progress-steps" role="meter" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Discrepancies resolved">${Array.from({ length: 5 }, (_, i) => `<span class="ws-progress-steps__step${i < Math.floor(pct / 20) ? ' is-done' : i === Math.floor(pct / 20) ? ' is-current' : ''}"></span>`).join('')}<span class="ws-progress-steps__value">${pct}%</span></span>`;

export const projectSummary = ({ wo = 'CL 10269', site = 'Gainesway Aviation', meta = 'N375MZ · RN: CL 10269 · SN: GXRS-9368', alerts = 2, progress = 45 } = {}) => `
<article class="ws-project">
  <img class="ws-project__image" src="${IMG}" alt="N375MZ" />
  <div class="ws-project__body">
    <div class="ws-project__info">
      <p class="ws-project__meta">${meta}</p>
      <div class="ws-project__heading">
        <h3 class="ws-project__title">${title(wo, site)}</h3>
        <span class="ws-label ws-label--success ws-label--translucent">${icon('check-circle', 'ws-label__icon')}On track</span>
        ${alerts ? `<span class="ws-label ws-label--warning ws-label--translucent">${icon('bell-on', 'ws-label__icon')}${alerts} alerts</span>` : ''}
      </div>
    </div>
    <dl class="ws-data-points">
      <div class="ws-data-point"><dt class="ws-data-point__label">Delivery</dt><dd class="ws-data-point__value">06/12/26 <span class="ws-data-point__note ws-data-point__note--warning">+12 day shift</span></dd></div>
      <div class="ws-data-point"><dt class="ws-data-point__label">Discrepancies</dt><dd class="ws-data-point__value">${steps(progress)}</dd></div>
      <div class="ws-data-point"><dt class="ws-data-point__label">Outstanding balance</dt><dd class="ws-data-point__value">$45,078 <span class="ws-data-point__note ws-data-point__note--success">Up to date</span></dd></div>
      <div class="ws-data-point"><dt class="ws-data-point__label">Paid to date</dt><dd class="ws-data-point__value">$45,078</dd></div>
    </dl>
  </div>
</article>`;

export const projectDisclosure = ({ open = false, wo = 'CL 10269', site = 'Gainesway Aviation' } = {}) => `
<details class="ws-project-disclosure"${open ? ' open' : ''}>
  <summary class="ws-project ws-project--compact">
    <img class="ws-project__image" src="${IMG}" alt="" />
    <div class="ws-project__body">
      <div class="ws-project__info"><p class="ws-project__meta">RN: ${wo} · SN: GXRS-9368</p><h3 class="ws-project__title">${title(wo, site)}</h3></div>
      <div class="ws-data-points">
        <div class="ws-data-point ws-data-point--end"><span class="ws-data-point__label">Quoted</span><span class="ws-data-point__value">$455,000</span></div>
        <div class="ws-data-point ws-data-point--end"><span class="ws-data-point__label">Actual</span><span class="ws-data-point__value">$462,318</span></div>
        <div class="ws-data-point ws-data-point--end"><span class="ws-data-point__label">Estimated flyaway</span><span class="ws-data-point__value">$471,900</span></div>
      </div>
      <span class="ws-label ws-label--success ws-label--translucent">${icon('check-circle', 'ws-label__icon')}On budget</span>
    </div>
    ${icon('caret-bottom', 'ws-project__toggle')}
  </summary>
  <div class="ws-table-wrap">
    <table class="ws-table ws-table--condensed ws-table--flush">
      <thead><tr><th>Line item</th><th>Category</th><th>Status</th><th class="ws-table__num">Quoted</th><th class="ws-table__num">Actual</th><th class="ws-table__num">Variance</th></tr></thead>
      <tbody>
        <tr><td>Replace RH NLG door bonding wire</td><td>Airworthy</td><td><span class="ws-label ws-label--warning ws-label--translucent">Upcoming</span></td><td class="ws-table__num">$506.34</td><td class="ws-table__num">$612.10</td><td class="ws-table__num">+$105.76</td></tr>
        <tr><td>Hydraulic system servicing</td><td>Airworthy</td><td><span class="ws-label ws-label--info ws-label--translucent">In progress</span></td><td class="ws-table__num">$1,808.05</td><td class="ws-table__num">$1,808.05</td><td class="ws-table__num">$0.00</td></tr>
      </tbody>
      <tfoot><tr><th colspan="3">Total</th><td class="ws-table__num">$2,314.39</td><td class="ws-table__num">$2,420.15</td><td class="ws-table__num">+$105.76</td></tr></tfoot>
    </table>
  </div>
</details>`;

export default {
  title: 'Components/Project summary',
  excludeStories: /^[a-z]/,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Figma: Customer Dashboard project rows — Project List (18004:106376) and Financial Information (17988:97315, 17988:97268). `.ws-project` is the list row; `.ws-project--compact` inside `<details class="ws-project-disclosure">` is the expandable financial row with line items. Uses Label, Data point, Progress (segmented) and Table.' } } },
  render: (args) => projectSummary(args),
  args: { wo: 'CL 10269', site: 'Gainesway Aviation', meta: 'N375MZ · RN: CL 10269 · SN: GXRS-9368', alerts: 2, progress: 45 },
  argTypes: { progress: { control: { type: 'range', min: 0, max: 100, step: 5 } } },
};

export const Playground = {};

export const Financial = {
  name: 'Financial (expandable)',
  render: () => `<div class="ws-project-list">${projectDisclosure({ open: true })}${projectDisclosure({ wo: 'CL 10274', site: 'East Alton, IL' })}</div>`,
};
