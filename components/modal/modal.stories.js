import { icon, cx, matrix } from '../../stories/helpers.js';
import { button } from '../button/button.stories.js';
import { initModals } from './modal.js';

const VARIANTS = { Default: 'default', Status: 'status' };
const STATUSES = { Success: 'success', Error: 'error', Warning: 'warning' };
const POSITIONS = { Right: '', Center: 'ws-modal__footer--center', Left: 'ws-modal__footer--left' };
const STATUS_ICONS = { success: 'check', error: 'times', warning: 'warning' };
const STATUS_COPY = {
  success: { title: 'Quote approved', text: 'Quote Q-7781 for N375MZ was approved. We’ll schedule the work and email you the work order.' },
  error: { title: 'Something went wrong', text: 'We couldn’t submit your approval for quote Q-7781. Check your connection and try again.' },
  warning: { title: 'Leave this form?', text: 'Your squawk details for N375MZ will not be saved if you leave this page.' },
};

let n = 0;

export const modal = ({
  variant = 'default',
  status = 'success',
  headerStyle = 'blank',
  title = 'Approve quote Q-7781',
  headerIcon = 'info-circle-open',
  closeable = true,
  body = '',
  footer = true,
  tertiary = true,
  btnPosition,
  primaryLabel,
  secondaryLabel,
  tertiaryLabel = 'Clear',
  isStatic = true,
  id = `ws-modal-${++n}`,
} = {}) => {
  const isStatus = variant === 'status';
  const copy = STATUS_COPY[status];
  const position = btnPosition ?? (isStatus ? 'ws-modal__footer--center' : '');
  const hasTitle = headerStyle === 'icon-text';
  const labelled = hasTitle ? `aria-labelledby="${id}-title"` : isStatus ? `aria-labelledby="${id}-status"` : `aria-label="${title}"`;
  const content =
    body ||
    (isStatus
      ? `<span class="ws-modal__status-icon">${icon(STATUS_ICONS[status])}</span>
         <h2 class="ws-modal__status-title" id="${id}-status">${copy.title}</h2>
         <p>${copy.text}</p>`
      : `<p>Quote Q-7781 covers the left main landing gear actuator seal replacement on N375MZ: 6.5 labor hours and parts on PO-55120, for a total of $4,812.40.</p>
         <p>Approving authorizes West Star to start work when the aircraft arrives on Oct 9.</p>`);
  const primary = primaryLabel ?? (isStatus ? { success: 'View work order', error: 'Try again', warning: 'Leave' }[status] : 'Approve');
  const secondary = secondaryLabel ?? (isStatus ? { success: 'Go to dashboard', error: 'Cancel', warning: 'Stay' }[status] : 'Cancel');
  const closeBtn = closeable
    ? `<button type="button" class="ws-btn ws-btn--borderless-secondary ws-btn--sm ws-btn--icon ws-modal__close" aria-label="Close" data-modal-close="close">${icon('times')}</button>`
    : '';
  const header =
    closeable || hasTitle
      ? `<div class="ws-modal__header">${hasTitle ? `${icon(headerIcon, 'ws-modal__icon')}<h2 class="ws-modal__title" id="${id}-title">${title}</h2>` : ''}${closeBtn}</div>`
      : '';
  const foot = footer
    ? `<div class="${cx('ws-modal__footer', position)}">
        ${tertiary && !isStatus ? button({ label: tertiaryLabel, variant: 'ws-btn--borderless-secondary' }) : ''}
        ${button({ label: secondary, variant: 'ws-btn--outline-secondary' }).replace('<button', '<button data-modal-close="cancel"')}
        ${button({ label: primary }).replace('<button', '<button data-modal-close="confirm"')}
      </div>`
    : '';
  return `<dialog class="${cx('ws-modal', { 'ws-modal--status': isStatus, [`ws-modal--${status}`]: isStatus && status !== 'success', 'ws-modal--static': isStatic })}" id="${id}" ${labelled}${isStatic ? ' open' : ''}>
  ${header}
  <div class="ws-modal__body">${content}</div>
  ${foot}
</dialog>`;
};

const opts = (o) => ({ options: Object.values(o), labels: Object.fromEntries(Object.entries(o).map(([k, v]) => [v, k])) });

export default {
  title: 'Components/Modal',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/,
  parameters: {
    backgrounds: { value: 'page' },
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Modal (470:15295), built from _Modal Header (12611:66655), _Modal Body (8197:119526) and _Modal Footer (12612:66656). A native `<dialog class="ws-modal">`: `openModal(dialog)` / `closeModal(dialog, value)` from modal.js, or `initModals(root)` to wire `[data-modal-open="<id>"]` triggers, `[data-modal-close]` buttons and backdrop clicks. The Overlay variant is the dialog’s `::backdrop`. Stories show dialogs statically with `.ws-modal--static`.',
      },
    },
  },
  render: (args) => modal(args),
  argTypes: {
    variant: { control: 'inline-radio', ...opts(VARIANTS) },
    status: { control: 'inline-radio', ...opts(STATUSES), if: { arg: 'variant', eq: 'status' } },
    headerStyle: { control: 'inline-radio', options: ['blank', 'icon-text'], labels: { blank: 'Blank', 'icon-text': 'Icon + Text' } },
    title: { control: 'text', if: { arg: 'headerStyle', eq: 'icon-text' } },
    closeable: { control: 'boolean' },
    footer: { control: 'boolean' },
    tertiary: { control: 'boolean', name: '3º Button' },
    btnPosition: { control: 'select', ...opts(POSITIONS), name: 'Btn Position' },
    body: { control: 'text', description: 'Slot content (HTML). Leave empty for the example copy.' },
    isStatic: { table: { disable: true } },
    id: { table: { disable: true } },
    headerIcon: { control: 'text' },
    primaryLabel: { control: 'text' },
    secondaryLabel: { control: 'text' },
    tertiaryLabel: { control: 'text' },
  },
  args: { variant: 'default', status: 'success', headerStyle: 'blank', title: 'Approve quote Q-7781', closeable: true, footer: true, tertiary: true, btnPosition: '', body: '' },
};

export const Playground = {};

export const Variants = {
  name: 'Variant × header',
  render: () =>
    matrix(
      ['Blank header', 'Icon + Text header'],
      [
        { label: 'Default', cells: [modal({}), modal({ headerStyle: 'icon-text' })] },
        { label: 'Default, no 3º button', cells: [modal({ tertiary: false, btnPosition: 'ws-modal__footer--center' }), modal({ headerStyle: 'icon-text', tertiary: false, btnPosition: 'ws-modal__footer--left' })] },
      ],
    ),
};

export const Status = {
  name: 'Status × status',
  render: () =>
    matrix(
      ['Status'],
      Object.entries(STATUSES).map(([label, status]) => ({ label, cells: [modal({ variant: 'status', status })] })),
    ),
};

export const FooterPositions = {
  name: 'Footer button position',
  render: () =>
    matrix(
      ['Btn Position'],
      Object.entries(POSITIONS).map(([label, btnPosition]) => ({ label, cells: [modal({ btnPosition, tertiary: btnPosition === '' })] })),
    ),
};

export const Overlay = {
  name: 'Overlay',
  render: () => `<div class="ws-modal-overlay">${modal({ headerStyle: 'icon-text' })}</div>`,
};

export const Interactive = {
  name: 'Open and close',
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `<div class="sb-row">
      ${button({ label: 'Review quote' }).replace('<button', '<button data-modal-open="demo-default"')}
      ${button({ label: 'Show success', variant: 'ws-btn--outline-secondary' }).replace('<button', '<button data-modal-open="demo-success"')}
      ${button({ label: 'Show error', variant: 'ws-btn--outline-secondary' }).replace('<button', '<button data-modal-open="demo-error"')}
      <span class="ws-text-sm" data-result></span>
    </div>
    ${modal({ id: 'demo-default', headerStyle: 'icon-text', isStatic: false })}
    ${modal({ id: 'demo-success', variant: 'status', status: 'success', isStatic: false })}
    ${modal({ id: 'demo-error', variant: 'status', status: 'error', isStatic: false })}`;
    initModals(el);
    el.addEventListener('close', (e) => { el.querySelector('[data-result]').textContent = `Closed with “${e.target.returnValue || 'escape'}”`; }, true);
    return el;
  },
};
