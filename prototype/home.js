// Home (Customer Dashboard, Figma 17986:1656): mock data and rendering for the repeated lists.
import { initSegmented } from '../components/segmented/segmented.js';
import { initDropdown } from '../components/dropdown/dropdown.js';

const ICONS = '../assets/icons.svg';
const icon = (name, cls = '') => `<svg class="ws-icon ${cls}" aria-hidden="true"><use href="${ICONS}#${name}"></use></svg>`;
const maskIcon = (name, cls = '') =>
  `<span class="ws-icon ws-icon-mask ${cls}" style="--icon: url(../assets/icons-extra/${name}.svg)" aria-hidden="true"></span>`;
const AIRCRAFT_IMG = '../assets/images/aircraft-g650.png';

// ---- Mock data --------------------------------------------------------------

const PROJECTS = [
  { wo: 'CL 10269', site: 'Gainesway Aviation', tail: 'N375MZ', rn: 'CL 10269', sn: 'GXRS-9368', phase: 'in-work', status: ['success', 'check-circle', 'On track'], alerts: 2, delivery: '06/12/26', shift: '+12 day shift', progress: 45, balance: '$45,078', balanceNote: ['success', 'Up to date'], paid: '$45,078' },
  { wo: 'CL 10274', site: 'East Alton, IL', tail: 'N415JA', rn: 'CL 10274', sn: 'CL350-20311', phase: 'in-work', status: ['warning', 'warning-full', 'At risk'], alerts: 5, delivery: '07/03/26', shift: '+4 day shift', progress: 62, balance: '$18,420', balanceNote: ['warning', 'Due in 5 days'], paid: '$96,310' },
  { wo: 'CL 10281', site: 'Grand Junction, CO', tail: 'N4234X', rn: 'CL 10281', sn: '560-6187', phase: 'in-work', status: ['success', 'check-circle', 'On track'], alerts: 0, delivery: '06/28/26', shift: null, progress: 30, balance: '$0', balanceNote: ['success', 'Up to date'], paid: '$22,900' },
  { wo: 'CL 10302', site: 'Chattanooga, TN', tail: 'N204CR', rn: 'CL 10302', sn: 'GLEX-9741', phase: 'prearrival', status: ['info', 'time', 'Arrives 08/04/26'], alerts: 0, delivery: '09/15/26', shift: null, progress: 0, balance: '$0', balanceNote: null, paid: '$0' },
  { wo: 'CL 10305', site: 'Perryville, MO', tail: 'N812WS', rn: 'CL 10305', sn: 'F7X-288', phase: 'prearrival', status: ['info', 'time', 'Arrives 08/19/26'], alerts: 1, delivery: '10/02/26', shift: null, progress: 0, balance: '$0', balanceNote: null, paid: '$0' },
  { wo: 'CL 10198', site: 'East Alton, IL', tail: 'N519HJ', rn: 'CL 10198', sn: 'LJ75-412', phase: 'completed', status: ['neutral', 'check', 'Delivered 04/22/26'], alerts: 0, delivery: '04/22/26', shift: null, progress: 100, balance: '$0', balanceNote: ['success', 'Paid in full'], paid: '$212,480' },
];

const ALERTS = [
  { tone: 'warning', icon: ['mask', 'timelapse'], wo: 'WO CL 10269 · N375MZ', lead: 'Pending squawk', text: '5.1: RH NLG door bonding wire is fraying.', tag: 'Airworthy', impact: '2 days', cost: '$506.34', item: '5.1' },
  { tone: 'warning', icon: ['mask', 'timelapse'], wo: 'WO CL 10274 · N415JA', lead: 'You have 5 pending squawks', text: 'awaiting approval.', tag: 'Airworthy', impact: '6 days', cost: '$12,840.00', item: '3.2–3.6' },
  { tone: 'danger', icon: ['sprite', 'warning'], wo: 'WO CL 10269 · N375MZ', date: '05/23/25', lead: 'Pending squawk escalated to critical', text: '5.1: RH NLG door bonding wire is fraying.', tag: 'Airworthy', impact: '2 days', cost: '$506.34', item: '5.1' },
  { tone: 'warning', icon: ['sprite', 'bell-on'], wo: 'WO CL 10269 · N375MZ', lead: 'PM sent reminder on pending squawk:', text: '5.1: RH NLG door bonding wire is fraying.', tag: 'Airworthy', metaDate: '05/23/25', impact: '2 days', cost: '$506.34', item: '5.1' },
  { tone: 'warning', icon: ['sprite', 'bell-on'], wo: 'WO CL 10274 · N415JA', lead: 'PM sent reminder on pending squawk:', text: '3.4: LH engine bleed air duct clamp cracked.', tag: 'Airworthy', metaDate: '05/22/25', impact: '1 day', cost: '$1,975.00', item: '3.4' },
];

const ACTIVITY = [
  ['WO CL 10269 · N375MZ', 'You have new squawk activity', '05/23/26 10:05 AM'],
  ['WO CL 10274 · N415JA', 'New documents have been added', '05/23/26 9:41 AM'],
  ['WO CL 10269 · N375MZ', 'Invoice INV-20418 has been issued', '05/22/26 4:18 PM'],
  ['WO CL 10281 · N4234X', 'Quote revision 2 is ready for review', '05/22/26 11:02 AM'],
  ['WO CL 10274 · N415JA', 'Payment of $24,000 was received', '05/21/26 2:37 PM'],
];

const LINE_ITEMS = [
  ['Replace RH NLG door bonding wire', 'Airworthy', ['warning', 'Upcoming'], '$506.34', '$612.10', '+$105.76'],
  ['Hydraulic system servicing', 'Airworthy', ['info', 'In progress'], '$1,808.05', '$1,808.05', '$0.00'],
  ['Cabin forward lavatory flush motor', 'Optional', ['success', 'Complete'], '$1,320.00', '$1,775.02', '+$455.02'],
];

const FINANCE = [
  { wo: 'CL 10269', site: 'Gainesway Aviation', rn: 'CL 10269', sn: 'GXRS-9368', quoted: '$455,000', actual: '$462,318', flyaway: '$471,900', status: ['success', 'check-circle', 'On budget'], open: true, items: LINE_ITEMS, totals: ['$3,634.39', '$4,195.17', '+$560.78'] },
  { wo: 'CL 10274', site: 'East Alton, IL', rn: 'CL 10274', sn: 'CL350-20311', quoted: '$318,500', actual: '$296,880', flyaway: '$341,200', status: ['warning', 'warning-full', 'Over quote'], items: LINE_ITEMS, totals: ['$3,634.39', '$4,195.17', '+$560.78'] },
  { wo: 'CL 10281', site: 'Grand Junction, CO', rn: 'CL 10281', sn: '560-6187', quoted: '$94,200', actual: '$41,730', flyaway: '$94,200', status: ['success', 'check-circle', 'On budget'], items: LINE_ITEMS, totals: ['$3,634.39', '$4,195.17', '+$560.78'] },
];

// ---- Templates ----------------------------------------------------------------

const label = ([tone, iconName, text]) =>
  `<span class="ws-label ws-label--${tone} ws-label--translucent">${icon(iconName, 'ws-label__icon')}${text}</span>`;

const title = (p) => `<span class="ws-project__wo">WO: <b>${p.wo}</b></span> · ${p.site}`;

const steps = (pct) => {
  const done = Math.floor(pct / 20);
  const cells = Array.from({ length: 5 }, (_, i) => `<span class="ws-progress-steps__step${i < done ? ' is-done' : i === done && pct < 100 ? ' is-current' : ''}"></span>`);
  return `<span class="ws-progress-steps" role="meter" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Discrepancies resolved">${cells.join('')}<span class="ws-progress-steps__value">${pct}%</span></span>`;
};

const projectRow = (p) => `
  <article class="ws-project" data-phase="${p.phase}" data-search="${[p.wo, p.site, p.tail, p.sn].join(' ').toLowerCase()}">
    <img class="ws-project__image" src="${AIRCRAFT_IMG}" alt="${p.tail}" />
    <div class="ws-project__body">
      <div class="ws-project__info">
        <p class="ws-project__meta">${p.tail} · RN: ${p.rn} · SN: ${p.sn}</p>
        <div class="ws-project__heading">
          <h3 class="ws-project__title">${title(p)}</h3>
          ${label(p.status)}
          ${p.alerts ? label(['warning', 'bell-on', `${p.alerts} alert${p.alerts > 1 ? 's' : ''}`]) : ''}
        </div>
      </div>
      <dl class="ws-data-points">
        <div class="ws-data-point"><dt class="ws-data-point__label">Delivery</dt><dd class="ws-data-point__value">${p.delivery}${p.shift ? ` <span class="ws-data-point__note ws-data-point__note--warning">${p.shift}</span>` : ''}</dd></div>
        <div class="ws-data-point"><dt class="ws-data-point__label">Discrepancies</dt><dd class="ws-data-point__value">${steps(p.progress)}</dd></div>
        <div class="ws-data-point"><dt class="ws-data-point__label">Outstanding balance</dt><dd class="ws-data-point__value">${p.balance}${p.balanceNote ? ` <span class="ws-data-point__note ws-data-point__note--${p.balanceNote[0]}">${p.balanceNote[1]}</span>` : ''}</dd></div>
        <div class="ws-data-point"><dt class="ws-data-point__label">Paid to date</dt><dd class="ws-data-point__value">${p.paid}</dd></div>
      </dl>
    </div>
  </article>`;

let menuId = 0;
const alertItem = (a) => {
  const id = `alert-menu-${++menuId}`;
  const glyph = a.icon[0] === 'mask' ? maskIcon(a.icon[1]) : icon(a.icon[1]);
  return `
  <li>
    <article class="ws-activity">
      <span class="ws-activity__icon ws-activity__icon--${a.tone}">${glyph}</span>
      <div class="ws-activity__body">
        <div class="ws-activity__top"><p class="ws-activity__eyebrow">${a.wo}</p>${a.date ? `<time class="ws-activity__date">${a.date}</time>` : ''}</div>
        <p class="ws-activity__title"><strong>${a.lead}</strong> ${a.text}<span class="ws-label ws-label--danger ws-label--translucent ws-label--sm">${icon('warning-full', 'ws-label__icon')}${a.tag}</span></p>
        <ul class="ws-activity__meta">
          ${a.metaDate ? `<li>${a.metaDate}</li>` : ''}
          <li>Schedule impact: <b>${a.impact}</b></li>
          <li>Cost: <b>${a.cost}</b></li>
          <li>Squawk item: <b>${a.item}</b></li>
        </ul>
      </div>
      <div class="ws-activity__action ws-dropdown">
        <button type="button" class="ws-btn ws-btn--outline-secondary ws-btn--xs ws-btn--icon" aria-label="Actions" aria-haspopup="menu" aria-expanded="false" aria-controls="${id}">${icon('ellipsis-v')}</button>
        <div class="ws-dropdown__menu ws-dropdown__menu--end" id="${id}" role="menu" hidden>
          <div class="ws-dropdown__list">
            <button type="button" class="ws-dropdown__item" role="menuitem">View squawk</button>
            <button type="button" class="ws-dropdown__item" role="menuitem">Approve</button>
            <button type="button" class="ws-dropdown__item" role="menuitem">Decline</button>
            <button type="button" class="ws-dropdown__item" role="menuitem">Message PM</button>
          </div>
        </div>
      </div>
    </article>
  </li>`;
};

const activityItem = ([wo, text, when]) => `
  <li>
    <a class="ws-activity ws-activity--simple" href="#">
      <div class="ws-activity__body">
        <div class="ws-activity__text-group"><p class="ws-activity__eyebrow">${wo}</p><p class="ws-activity__title">${text}</p></div>
        <time class="ws-activity__date">${when}</time>
      </div>
    </a>
  </li>`;

const financeRow = (f) => `
  <details class="ws-project-disclosure"${f.open ? ' open' : ''}>
    <summary class="ws-project ws-project--compact">
      <img class="ws-project__image" src="${AIRCRAFT_IMG}" alt="" />
      <div class="ws-project__body">
        <div class="ws-project__info">
          <p class="ws-project__meta">RN: ${f.rn} · SN: ${f.sn}</p>
          <h3 class="ws-project__title">${title(f)}</h3>
        </div>
        <div class="ws-data-points">
          <div class="ws-data-point ws-data-point--end"><span class="ws-data-point__label">Quoted</span><span class="ws-data-point__value">${f.quoted}</span></div>
          <div class="ws-data-point ws-data-point--end"><span class="ws-data-point__label">Actual</span><span class="ws-data-point__value">${f.actual}</span></div>
          <div class="ws-data-point ws-data-point--end"><span class="ws-data-point__label">Estimated flyaway</span><span class="ws-data-point__value">${f.flyaway}</span></div>
        </div>
        ${label(f.status)}
      </div>
      ${icon('caret-bottom', 'ws-project__toggle')}
    </summary>
    <div class="ws-table-wrap">
      <table class="ws-table ws-table--condensed ws-table--flush">
        <thead><tr><th scope="col">Line item</th><th scope="col">Category</th><th scope="col">Status</th><th scope="col" class="ws-table__num">Quoted</th><th scope="col" class="ws-table__num">Actual</th><th scope="col" class="ws-table__num">Variance</th><th class="ws-table__cell-actions"><span class="ws-sr-only">Actions</span></th></tr></thead>
        <tbody>
          ${f.items.map(([name, cat, [tone, status], q, a, v]) => `
          <tr><td>${name}</td><td>${cat}</td><td><span class="ws-label ws-label--${tone} ws-label--translucent">${status}</span></td><td class="ws-table__num">${q}</td><td class="ws-table__num">${a}</td><td class="ws-table__num">${v}</td>
            <td class="ws-table__cell-actions"><button type="button" class="ws-btn ws-btn--borderless-secondary ws-btn--sm ws-btn--icon" aria-label="Actions for ${name}">${icon('ellipsis-v')}</button></td></tr>`).join('')}
        </tbody>
        <tfoot><tr><th scope="row" colspan="3">Total</th><td class="ws-table__num">${f.totals[0]}</td><td class="ws-table__num">${f.totals[1]}</td><td class="ws-table__num">${f.totals[2]}</td><td></td></tr></tfoot>
      </table>
    </div>
  </details>`;

// ---- Render and behaviour -------------------------------------------------------

const $ = (id) => document.getElementById(id);

$('project-list').innerHTML = PROJECTS.map(projectRow).join('') + '<p class="home-empty" hidden>No projects match your search.</p>';
$('alert-list').innerHTML = ALERTS.map(alertItem).join('');
$('activity-list').innerHTML = ACTIVITY.map(activityItem).join('');
$('finance-list').innerHTML = FINANCE.map(financeRow).join('');

let phase = 'all';
const applyFilters = () => {
  const q = $('project-search').value.trim().toLowerCase();
  let shown = 0;
  $('project-list').querySelectorAll('.ws-project').forEach((row) => {
    const match = (phase === 'all' || row.dataset.phase === phase) && (!q || row.dataset.search.includes(q));
    row.hidden = !match;
    if (match) shown += 1;
  });
  $('project-list').querySelector('.home-empty').hidden = shown > 0;
  $('project-count').textContent = shown;
};

initSegmented($('project-filter'));
$('project-filter').addEventListener('ws-segmented:change', (e) => { phase = e.detail.value; applyFilters(); });
$('project-search').addEventListener('input', applyFilters);
document.querySelector('.ws-search__clear').addEventListener('click', () => { $('project-search').value = ''; applyFilters(); $('project-search').focus(); });
applyFilters();

document.querySelectorAll('[aria-haspopup="menu"]').forEach((trigger) => initDropdown(trigger));

$('refresh').addEventListener('click', () => {
  $('sync-status').textContent = 'Synced just now from Corridor';
});
