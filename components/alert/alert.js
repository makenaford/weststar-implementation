// Alert behaviour: dismiss buttons and a stacked toast container.

const ICONS = { info: 'info-circle-open', success: 'check-circle', warning: 'warning', danger: 'exclamation-circle' };
const LABELS = { info: 'Info:', success: 'Success:', warning: 'Warning:', danger: 'Error:' };

/** Remove an alert, with the toast exit transition when it is inside a stack. */
export function dismissAlert(alert) {
  if (!alert) return;
  alert.dispatchEvent(new CustomEvent('ws-alert:dismiss', { bubbles: true }));
  if (alert.parentElement?.classList.contains('ws-toast-stack') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    alert.classList.add('is-leaving');
    setTimeout(() => alert.remove(), 150);
  } else {
    alert.remove();
  }
}

/** Wire every .ws-alert__close inside root (delegated, so alerts added later work too). */
export function initAlerts(root = document) {
  if (root.__wsAlerts) return;
  root.__wsAlerts = true;
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.ws-alert__close');
    if (btn && root.contains(btn)) dismissAlert(btn.closest('.ws-alert'));
  });
}

/** Get (or create) the page's toast stack. */
export function toastStack(container = document.body) {
  let stack = container.querySelector(':scope > .ws-toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'ws-toast-stack';
    stack.setAttribute('aria-live', 'polite');
    container.append(stack);
    initAlerts(stack);
  }
  return stack;
}

/**
 * Show a toast alert. Returns the element.
 * showToast({ validation: 'success', title: 'Success:', message: 'Work order WO-10482 approved.', timeout: 5000 })
 * timeout: ms before auto-dismiss (0 keeps it until closed).
 */
export function showToast({ validation = 'info', title = LABELS[validation], message = '', timeout = 5000, container } = {}) {
  const el = document.createElement('div');
  el.className = `ws-alert ws-alert--${validation} ws-alert--toast`;
  el.setAttribute('role', validation === 'danger' ? 'alert' : 'status');
  el.innerHTML = `
    <div class="ws-alert__main">
      <div class="ws-alert__content">
        <svg class="ws-icon ws-alert__icon" aria-hidden="true" focusable="false"><use href="icons.svg#${ICONS[validation]}"></use></svg>
        <p class="ws-alert__message">${title ? `<strong>${title}</strong> ` : ''}${message}</p>
      </div>
    </div>
    <button type="button" class="ws-btn ws-btn--icon ws-alert__close" aria-label="Dismiss">
      <svg class="ws-icon" aria-hidden="true" focusable="false"><use href="icons.svg#times"></use></svg>
    </button>`;
  toastStack(container).append(el);
  if (timeout) setTimeout(() => el.isConnected && dismissAlert(el), timeout);
  return el;
}
