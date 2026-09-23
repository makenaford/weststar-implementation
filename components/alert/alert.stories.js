import { icon, cx, matrix } from '../../stories/helpers.js';
import { button } from '../button/button.stories.js';
import { initAlerts, showToast } from './alert.js';

const VARIANTS = { Vertical: '', Inline: 'ws-alert--inline', Feedback: 'ws-alert--feedback' };
const TYPES = { Toast: 'ws-alert--toast', Embedded: '', Stripe: 'ws-alert--stripe' };
const VALIDATIONS = { Info: 'info', Success: 'success', Warning: 'warning', Danger: 'danger' };
const ICONS = { info: 'info-circle-open', success: 'check-circle', warning: 'warning', danger: 'exclamation-circle' };
const LABELS = { info: 'Info:', success: 'Success:', warning: 'Warning:', danger: 'Error:' };

export const alert = ({
  variant = '',
  type = 'ws-alert--toast',
  validation = 'info',
  title = LABELS[validation],
  message = 'This is the alert’s message.',
  closeButton = true,
  actions = false,
  primary = true,
  secondary = true,
  primaryLabel = 'Button',
  secondaryLabel = 'Button',
} = {}) => {
  const feedback = variant === 'ws-alert--feedback';
  const cls = cx('ws-alert', `ws-alert--${validation}`, variant, feedback ? '' : type);
  const role = validation === 'danger' || validation === 'warning' ? 'alert' : 'status';
  const acts =
    actions && !feedback && (primary || secondary)
      ? `<div class="ws-alert__actions">${primary ? button({ label: primaryLabel, size: 'ws-btn--sm' }) : ''}${secondary ? button({ label: secondaryLabel, variant: 'ws-btn--outline-primary', size: 'ws-btn--sm' }) : ''}</div>`
      : '';
  const close =
    closeButton && !feedback
      ? `<button type="button" class="ws-btn ws-btn--icon ws-alert__close" aria-label="Dismiss">${icon('times')}</button>`
      : '';
  return `<div class="${cls}" role="${role}">
  <div class="ws-alert__main">
    <div class="ws-alert__content">${icon(ICONS[validation], 'ws-alert__icon')}<p class="ws-alert__message">${title ? `<strong>${title}</strong> ` : ''}${message}</p></div>
    ${acts}
  </div>
  ${close}
</div>`;
};

/** Render HTML into a wrapper with dismiss behaviour wired up. */
const live = (html, style = '') => {
  const el = document.createElement('div');
  if (style) el.style.cssText = style;
  el.innerHTML = html;
  initAlerts(el);
  return el;
};

/** Fixed-width cell (Figma component widths) so the matrix doesn't squeeze alerts. */
const w = (px, html) => `<div style="width: ${px}px">${html}</div>`;

const opts = (o) => ({ options: Object.values(o), labels: Object.fromEntries(Object.entries(o).map(([k, v]) => [v, k])) });

export default {
  title: 'Components/Alert',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Alert (92:1961). Variant, Type and Validation are modifier classes; the close button and actions are optional children. Feedback is the unboxed, coloured-text form used under form fields. Toasts are stacked in `.ws-toast-stack` by `showToast()` in alert.js; `initAlerts(root)` wires the close buttons.',
      },
    },
  },
  render: (args) => live(alert(args), 'max-width: 560px'),
  argTypes: {
    variant: { control: 'select', ...opts(VARIANTS) },
    type: { control: 'select', ...opts(TYPES), description: 'Ignored for Feedback (Figma has only Type=Simple there)' },
    validation: { control: 'inline-radio', ...opts(VALIDATIONS) },
    title: { control: 'text' },
    message: { control: 'text' },
    closeButton: { control: 'boolean' },
    actions: { control: 'boolean' },
    primary: { control: 'boolean', name: '↳ Primary' },
    secondary: { control: 'boolean', name: '↳ Secondary' },
  },
  args: {
    variant: '',
    type: 'ws-alert--toast',
    validation: 'info',
    title: 'Info:',
    message: 'N375MZ is scheduled for its 12-month inspection on Oct 14.',
    closeButton: true,
    actions: false,
    primary: true,
    secondary: true,
  },
};

export const Playground = {};

export const AllVariants = {
  name: 'Variant × type × validation',
  render: () =>
    live(
      matrix(
        Object.keys(VALIDATIONS),
        [
          ...Object.entries(TYPES).map(([t, type]) => ({
            label: `Vertical / ${t}`,
            cells: Object.values(VALIDATIONS).map((validation) => w(360, alert({ type, validation }))),
          })),
          ...Object.entries(TYPES).map(([t, type]) => ({
            label: `Inline / ${t}`,
            cells: Object.values(VALIDATIONS).map((validation) => w(492, alert({ variant: 'ws-alert--inline', type, validation, actions: true }))),
          })),
          {
            label: 'Feedback',
            cells: Object.values(VALIDATIONS).map((validation) => w(360, alert({ variant: 'ws-alert--feedback', validation }))),
          },
        ],
      ),
    ),
};

export const VerticalWithActions = {
  name: 'Vertical with actions',
  render: () =>
    live(
      `<div class="sb-stack" style="max-width: 420px">
        ${alert({ validation: 'warning', title: 'AOG:', message: 'N512WS is grounded at KGJT pending a replacement starter-generator. Approve the expedited part order?', actions: true, primaryLabel: 'Approve', secondaryLabel: 'View quote' })}
        ${alert({ type: '', validation: 'danger', title: 'Error:', message: 'Invoice INV-20931 could not be paid. Check your card details and try again.', actions: true, primaryLabel: 'Retry', secondary: false })}
        ${alert({ type: 'ws-alert--stripe', validation: 'success', title: 'Success:', message: 'Work order WO-10482 was approved.', actions: true, primaryLabel: 'Open work order', secondaryLabel: 'Dismiss' })}
      </div>`,
    ),
};

export const Toasts = {
  name: 'Toast stack',
  parameters: { docs: { story: { inline: false, iframeHeight: 360 } } },
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `<div class="sb-row">
      ${button({ label: 'Show success toast' }).replace('<button', '<button data-toast="success"')}
      ${button({ label: 'Show error toast', variant: 'ws-btn--outline-secondary' }).replace('<button', '<button data-toast="danger"')}
    </div>`;
    const messages = {
      success: 'Squawk 14 on WO-10482 was signed off.',
      danger: 'Could not upload logbook-N375MZ.pdf. The file is larger than 25 MB.',
    };
    el.addEventListener('click', (e) => {
      const v = e.target.closest('[data-toast]')?.dataset.toast;
      if (v) showToast({ validation: v, message: messages[v], timeout: 6000 });
    });
    // Show a couple on load so the stack is visible in the screenshot / docs.
    setTimeout(() => {
      document.querySelector('body > .ws-toast-stack')?.remove();
      showToast({ validation: 'info', message: 'Quote Q-7781 for N375MZ is ready for review.', timeout: 0 });
      showToast({ validation: 'success', message: messages.success, timeout: 0 });
    });
    return el;
  },
};
