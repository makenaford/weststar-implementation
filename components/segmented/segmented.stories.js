import { matrix } from '../../stories/helpers.js';
import { initSegmented } from './segmented.js';

const OPTIONS = ['All', 'Prearrival', 'In work (3)', 'Completed'];

export const segmented = ({ options = OPTIONS, selected = 0, label = 'Filter projects by phase' } = {}) => `
<div class="ws-segmented" role="group" aria-label="${label}">
  ${options.map((o, i) => `<button type="button" class="ws-segmented__item" aria-pressed="${i === selected}">${o}</button>`).join('')}
</div>`;

export default {
  title: 'Components/Segmented',
  excludeStories: /^[a-z]/,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Figma: the Project List phase filter on the Customer Dashboard (17988:97679), built from _NavBar Tab instances on a gray-100 pill track. Single selection via `aria-pressed`; `initSegmented(root)` from `segmented.js` handles clicks and fires `ws-segmented:change`.' } } },
  render: (args) => {
    const el = document.createElement('div');
    el.innerHTML = segmented(args);
    initSegmented(el.firstElementChild);
    return el;
  },
  argTypes: { selected: { control: { type: 'number', min: 0, max: 3 } } },
  args: { selected: 0 },
};

export const Playground = {};

export const ItemStates = {
  name: 'Item states',
  render: () => matrix(['default', 'hover', 'focus', 'selected'], [{ label: 'Item', cells: ['', 'is-hover', 'is-focus', 'is-active'].map((c) => `<div class="ws-segmented" style="padding:2px 8px"><button type="button" class="ws-segmented__item ${c}">Prearrival</button></div>`) }]),
};
