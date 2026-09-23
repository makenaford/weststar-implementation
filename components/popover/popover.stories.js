import { icon, cx, matrix } from '../../stories/helpers.js';
import { button } from '../button/button.stories.js';
import { initPopovers } from './popover.js';

// Figma "Pointing" values in the order of the component set (4 rows × 3).
const POINTING = {
  'Bottom ↓ Right ↘': 'ws-popover--bottom-right',
  'Bottom ↓ Center ↓': 'ws-popover--bottom',
  'Bottom ↓ Left ↙': 'ws-popover--bottom-left',
  'Left ← Bottom ↙': 'ws-popover--left-bottom',
  'Left ← Center ←': 'ws-popover--left',
  'Left ← Top ↖': 'ws-popover--left-top',
  'Top ↑ Left ↖': 'ws-popover--top-left',
  'Top ↑ Center ↑': 'ws-popover--top',
  'Top ↑ Right ↗': 'ws-popover--top-right',
  'Right → Top ↗': 'ws-popover--right-top',
  'Right → Center →': 'ws-popover--right',
  'Right → Bottom ↘': 'ws-popover--right-bottom',
};

let n = 0;

export const popover = ({ title = 'Popover title', text = 'Popover text', closeIcon = true, scrollBar = false, pointing = 'ws-popover--bottom-right', id = `ws-popover-${++n}`, hidden = false } = {}) => `
<div class="${cx('ws-popover', pointing, { 'ws-popover--scroll': scrollBar })}" id="${id}" role="dialog" aria-labelledby="${id}-title"${hidden ? ' hidden' : ''}>
  <div class="ws-popover__header">
    <p class="ws-popover__title" id="${id}-title">${title}</p>
    ${closeIcon ? `<button type="button" class="ws-btn ws-btn--borderless-secondary ws-btn--xs ws-btn--icon ws-popover__close" aria-label="Close">${icon('times')}</button>` : ''}
  </div>
  <div class="ws-popover__body">${text}</div>
</div>`;

const LONG =
  'Replace the left main landing gear actuator seal and perform an operational check. Inspect the actuator rod end for corrosion and pitting. Parts are on order under PO-55120 with an expected arrival of Oct 9. Labor is estimated at 6.5 hours.';

export default {
  title: 'Components/Popover',
  tags: ['autodocs'],
  excludeStories: /^[a-z]/,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Popover (800:20561). Pointing is one modifier naming where the CSS arrow sits (same names as Tooltip); the close icon is an optional child and ScrollBar is `.ws-popover--scroll`. For live popovers give a trigger `data-popover-target="<id>"` (and optionally `data-popover-placement`) and call `initPopovers(root)` from popover.js.',
      },
    },
  },
  render: (args) => popover(args),
  argTypes: {
    title: { control: 'text' },
    text: { control: 'text' },
    closeIcon: { control: 'boolean', name: 'Close Icon' },
    scrollBar: { control: 'boolean', name: 'ScrollBar' },
    pointing: { control: 'select', options: Object.values(POINTING), labels: Object.fromEntries(Object.entries(POINTING).map(([k, v]) => [v, k])) },
    id: { table: { disable: true } },
    hidden: { table: { disable: true } },
  },
  args: { title: 'Popover title', text: 'Popover text', closeIcon: true, scrollBar: false, pointing: 'ws-popover--bottom-right' },
};

export const Playground = {};

export const AllPointing = {
  name: 'Pointing',
  render: () => {
    const entries = Object.entries(POINTING);
    const rows = [0, 3, 6, 9].map((i) => ({
      label: `${entries[i][0].split(' ')[0]} edge`,
      cells: entries.slice(i, i + 3).map(([name, pointing]) => `<div style="padding: 8px">${popover({ pointing, text: name })}</div>`),
    }));
    return `<div style="padding: 8px">${matrix(['', '', ''], rows)}</div>`;
  },
};

export const Options = {
  name: 'Close icon and scroll bar',
  render: () =>
    matrix(
      ['Close icon', 'No close icon', 'Scroll bar'],
      [
        {
          label: 'Default',
          cells: [
            popover({ pointing: 'ws-popover--top-left', title: 'Squawk 14', text: 'Left MLG actuator seal leaking. Awaiting parts.' }),
            popover({ pointing: 'ws-popover--top-left', title: 'Squawk 14', text: 'Left MLG actuator seal leaking. Awaiting parts.', closeIcon: false }),
            popover({ pointing: 'ws-popover--top-left', title: 'Corrective action', text: LONG, scrollBar: true }),
          ],
        },
      ],
    ),
};

export const Interactive = {
  name: 'Click to open',
  render: () => {
    const el = document.createElement('div');
    el.style.padding = '24px 24px 200px';
    el.innerHTML = `<div class="sb-row" style="gap: 24px">
      ${button({ label: 'Squawk details', variant: 'ws-btn--outline-primary', rightIcon: 'caret-bottom' }).replace('<button', '<button data-popover-target="po-squawk" data-popover-placement="bottom-start" aria-expanded="false" aria-haspopup="dialog"')}
      ${button({ label: 'Labor estimate', variant: 'ws-btn--outline-secondary' }).replace('<button', '<button data-popover-target="po-labor" data-popover-placement="right" aria-expanded="false" aria-haspopup="dialog"')}
    </div>
    ${popover({ id: 'po-squawk', title: 'Squawk 14 · N375MZ', text: 'Left MLG actuator seal leaking. Parts on order, ETA Oct 9.', hidden: true })}
    ${popover({ id: 'po-labor', title: 'Labor estimate', text: LONG, scrollBar: true, hidden: true })}`;
    initPopovers(el);
    return el;
  },
};
