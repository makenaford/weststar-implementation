import { icon, matrix } from '../../stories/helpers.js';
import { button } from '../button/button.stories.js';
import { initTooltips } from './tooltip.js';

// Figma "Pointing" values in the order of the component set (4 rows × 3).
const POINTING = {
  'Bottom ↓ Right ↘': 'ws-tooltip--bottom-right',
  'Bottom ↓ Center ↓': 'ws-tooltip--bottom',
  'Bottom ↓ Left ↙': 'ws-tooltip--bottom-left',
  'Left ← Bottom ↙': 'ws-tooltip--left-bottom',
  'Left ← Center ←': 'ws-tooltip--left',
  'Left ← Top ↖': 'ws-tooltip--left-top',
  'Top ↑ Left ↖': 'ws-tooltip--top-left',
  'Top ↑ Center ↑': 'ws-tooltip--top',
  'Top ↑ Right ↗': 'ws-tooltip--top-right',
  'Right → Top ↗': 'ws-tooltip--right-top',
  'Right → Center →': 'ws-tooltip--right',
  'Right → Bottom ↘': 'ws-tooltip--right-bottom',
};

export const tooltip = ({ text = 'Tooltip text', pointing = 'ws-tooltip--bottom-right' } = {}) =>
  `<div class="ws-tooltip ${pointing}" role="tooltip">${text}</div>`;

export default {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Tooltip (742:540). Pointing is one modifier class naming the side and corner the CSS arrow sits on. For live tooltips add `data-tooltip="…"` (and optionally `data-tooltip-placement="top|bottom|left|right[-start|-end]"`) to a trigger and call `initTooltips(root)` from tooltip.js; it shows on hover and focus, hides on leave, blur and Escape.',
      },
    },
  },
  render: (args) => tooltip(args),
  argTypes: {
    text: { control: 'text', name: 'Tooltip text' },
    pointing: { control: 'select', options: Object.values(POINTING), labels: Object.fromEntries(Object.entries(POINTING).map(([k, v]) => [v, k])) },
  },
  args: { text: 'Tooltip text', pointing: 'ws-tooltip--bottom-right' },
};

export const Playground = {};

export const AllPointing = {
  name: 'Pointing',
  render: () => {
    const entries = Object.entries(POINTING);
    // Same layout as the Figma component set: one row per edge, three arrow positions each.
    const rows = [0, 3, 6, 9].map((i) => ({
      label: `${entries[i][0].split(' ')[0]} edge`,
      cells: entries.slice(i, i + 3).map(([name, pointing]) => `<div style="padding: 8px">${tooltip({ text: name, pointing })}</div>`),
    }));
    return `<div style="padding: 8px">${matrix(['', '', ''], rows)}</div>`;
  },
};

export const Interactive = {
  name: 'On hover and focus',
  render: () => {
    const el = document.createElement('div');
    el.style.padding = '64px 96px';
    el.innerHTML = `<div class="sb-row" style="gap: 24px">
      ${button({ label: 'Top', variant: 'ws-btn--outline-secondary' }).replace('<button', '<button data-tooltip="Download invoice INV-20931" data-tooltip-placement="top"')}
      ${button({ label: 'Bottom start', variant: 'ws-btn--outline-secondary' }).replace('<button', '<button data-tooltip="Opens the squawk list" data-tooltip-placement="bottom-start"')}
      ${button({ label: 'Right', variant: 'ws-btn--outline-secondary' }).replace('<button', '<button data-tooltip="Tail number N375MZ" data-tooltip-placement="right"')}
      ${button({ label: 'Left end', variant: 'ws-btn--outline-secondary' }).replace('<button', '<button data-tooltip="AOG: aircraft on ground" data-tooltip-placement="left-end"')}
      <button type="button" class="ws-btn ws-btn--borderless-secondary ws-btn--icon ws-btn--sm" aria-label="More information" data-tooltip="Estimated return to service" data-tooltip-placement="top-end">${icon('info-circle-open')}</button>
    </div>`;
    initTooltips(el);
    return el;
  },
};
