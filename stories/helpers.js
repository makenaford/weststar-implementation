// Shared helpers for stories.

/** Clay/Lexicon icon from assets/icons.svg (names match the Figma Icons page). */
export const icon = (name, cls = '') =>
  `<svg class="ws-icon ${cls}" aria-hidden="true" focusable="false"><use href="icons.svg#${name}"></use></svg>`;

/** Class list from an object of { className: boolean } plus plain strings. */
export const cx = (...parts) =>
  parts
    .flatMap((p) => (p && typeof p === 'object' ? Object.entries(p).filter(([, v]) => v).map(([k]) => k) : [p]))
    .filter(Boolean)
    .join(' ');

/** Labelled grid for "all variants" stories. rows: [{ label, cells: [html] }], cols: [label]. */
export const matrix = (cols, rows, { dark = false } = {}) => `
<table class="sb-matrix${dark ? ' sb-matrix--dark' : ''}">
  <thead><tr><th></th>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
  <tbody>${rows.map((r) => `<tr><th>${r.label}</th>${r.cells.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
</table>`;

export const STATES = ['default', 'hover', 'focus', 'active', 'disabled'];
export const stateClass = (s) => (s === 'default' ? '' : `is-${s}`);
