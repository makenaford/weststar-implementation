// Modal behaviour on a native <dialog class="ws-modal">.
//   <button data-modal-open="approve-quote">Review quote</button>
//   <dialog class="ws-modal" id="approve-quote">… <button data-modal-close="cancel">Cancel</button> …</dialog>
// showModal() gives focus trapping, Escape to close, inert page and the ::backdrop overlay for free.

let lastTrigger = null;

export function openModal(dialog, trigger = document.activeElement) {
  if (!dialog || dialog.open) return;
  lastTrigger = trigger;
  dialog.showModal();
}

/** Close with an optional return value (read it from dialog.returnValue or the 'close' event). */
export function closeModal(dialog, returnValue = '') {
  if (!dialog?.open) return;
  dialog.close(returnValue);
}

/** Wire [data-modal-open="<id>"] triggers, [data-modal-close] buttons and backdrop clicks inside root. */
export function initModals(root = document) {
  if (root.__wsModals) return;
  root.__wsModals = true;

  root.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal-open]');
    if (opener && root.contains(opener)) {
      openModal(document.getElementById(opener.dataset.modalOpen), opener);
      return;
    }
    const closer = e.target.closest('[data-modal-close]');
    if (closer) {
      closeModal(closer.closest('dialog.ws-modal'), closer.dataset.modalClose);
      return;
    }
    // A click on the dialog element itself (not its content) is a click on the backdrop.
    if (e.target instanceof HTMLDialogElement && e.target.classList.contains('ws-modal') && !e.target.classList.contains('ws-modal--static')) {
      const r = e.target.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) closeModal(e.target, 'backdrop');
    }
  });

  // Return focus to whatever opened the dialog.
  root.addEventListener('close', (e) => {
    if (e.target.classList?.contains('ws-modal') && lastTrigger?.isConnected) lastTrigger.focus();
  }, true);
}
