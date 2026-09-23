export const dataPoint = ({ label = 'Delivery', value = '06/12/26', note = '+12 day shift', noteTone = 'warning', end = false } = {}) => `
<div class="ws-data-point${end ? ' ws-data-point--end' : ''}">
  <span class="ws-data-point__label">${label}</span>
  <span class="ws-data-point__value">${value}${note ? ` <span class="ws-data-point__note ws-data-point__note--${noteTone}">${note}</span>` : ''}</span>
</div>`;

export default {
  title: 'Components/Data point',
  excludeStories: /^[a-z]/,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Figma: label/value "Slot" pairs on the Customer Dashboard project rows (18004:106387, 17988:97323). Small-caps gray-600 label over a 14px semibold value, with an optional colored note. Use `<dt>`/`<dd>` inside a `<dl class="ws-data-points">`.' } } },
  render: (args) => dataPoint(args),
  argTypes: { noteTone: { control: 'select', options: ['warning', 'success', 'danger', 'info'] } },
  args: { label: 'Delivery', value: '06/12/26', note: '+12 day shift', noteTone: 'warning', end: false },
};

export const Playground = {};

export const Group = {
  render: () => `<div class="sb-stack">
    <div class="ws-data-points">
      ${dataPoint({})}
      ${dataPoint({ label: 'Outstanding balance', value: '$45,078', note: 'Up to date', noteTone: 'success' })}
      ${dataPoint({ label: 'Paid to date', value: '$45,078', note: '' })}
    </div>
    <div class="ws-data-points ws-data-points--tight">
      ${dataPoint({ label: 'Quoted', value: '$455,000', note: '', end: true })}
      ${dataPoint({ label: 'Actual', value: '$462,318', note: '', end: true })}
      ${dataPoint({ label: 'Estimated flyaway', value: '$471,900', note: '', end: true })}
    </div>
  </div>`,
};
