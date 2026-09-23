import { icon, cx, matrix } from '../../stories/helpers.js';
import { button } from '../button/button.stories.js';

const SIZES = { Regular: '', Small: 'ws-form-group--sm' };
const TYPES = { Text: 'text', 'Text Area': 'textarea', Select: 'select' };
const STATES = {
  Placeholder: 'placeholder',
  Filled: 'filled',
  'Active (Focus)': 'focus',
  Disabled: 'disabled',
  'Read Only': 'readonly',
  Success: 'success',
  Error: 'error',
  Warning: 'warning',
};
const FEEDBACK = {
  success: { icon: 'check-circle', title: 'Success:', text: 'Tail number matches your fleet record.' },
  warning: { icon: 'warning-full', title: 'Warning:', text: 'This aircraft already has an open work order.' },
  error: { icon: 'exclamation-circle', title: 'Error:', text: 'Enter a valid tail number, e.g. N375MZ.' },
};

let uid = 0;

/** The bare control: <input>, <textarea> or <select> (wrapped in .ws-input-control for the caret / trailing icon). */
export const input = ({ type = 'text', state = 'placeholder', value = 'N375MZ', placeholder = 'Enter tail number', inputIcon = '', id = '', extraClass = '', ariaLabel = '' } = {}) => {
  const filled = state !== 'placeholder';
  const cls = cx('ws-input', extraClass, { 'is-focus': state === 'focus' });
  const attrs = [id ? ` id="${id}"` : '', ariaLabel ? ` aria-label="${ariaLabel}"` : '', state === 'disabled' ? ' disabled' : '', state === 'readonly' ? ' readonly' : '', state === 'error' ? ' aria-invalid="true"' : ''].join('');
  if (type === 'textarea') {
    return `<textarea class="${cls}" rows="3" placeholder="${placeholder}"${attrs}>${filled ? value : ''}</textarea>`;
  }
  if (type === 'select') {
    return `<div class="ws-input-control"><select class="${cls}"${attrs}><option value=""${filled ? '' : ' selected'}>${placeholder}</option><option${filled ? ' selected' : ''}>${value}</option><option>N512WS</option><option>N88GX</option></select>${icon('caret-bottom', 'ws-input-control__icon')}</div>`;
  }
  const control = `<input type="text" class="${cls}" placeholder="${placeholder}" value="${filled ? value : ''}"${attrs}>`;
  return inputIcon ? `<div class="ws-input-control">${control}${icon(inputIcon, 'ws-input-control__icon')}</div>` : control;
};

/** Label + control + help text / validation feedback. */
export const formGroup = ({
  label = 'Tail number',
  showLabel = true,
  required = true,
  labelIcon = '',
  type = 'text',
  size = '',
  state = 'placeholder',
  value,
  placeholder,
  inputIcon = '',
  helpText = '',
  control,
} = {}) => {
  const id = `ws-input-${++uid}`;
  const validation = ['success', 'warning', 'error'].includes(state) ? state : '';
  const fb = FEEDBACK[validation];
  const cls = cx('ws-form-group', size, validation && `ws-form-group--${validation}`);
  const labelHtml = showLabel
    ? `<label class="ws-form-group__label" for="${id}">${label}${required ? ' <span class="ws-form-group__required" aria-hidden="true">*</span>' : ''}${labelIcon ? icon(labelIcon) : ''}</label>`
    : '';
  const valueArgs = { ...(value !== undefined && { value }), ...(placeholder !== undefined && { placeholder }) };
  return `<div class="${cls}" style="width:288px">${labelHtml}${control ?? input({ type, state, inputIcon, id, ariaLabel: showLabel ? '' : label, ...valueArgs })}${helpText ? `<p class="ws-form-group__help">${helpText}</p>` : ''}${fb ? `<p class="ws-form-group__feedback">${icon(fb.icon)}<span><strong>${fb.title}</strong> ${fb.text}</span></p>` : ''}</div>`;
};

/* ---- Input group ---- */

const GROUP_TYPES = {
  'Button Left': 'button-left',
  'Button Right': 'button-right',
  Checkbox: 'checkbox',
  Email: 'email',
  Radio: 'radio',
  URL: 'url',
  Units: 'units',
  Username: 'username',
};
const GROUP_STATES = ['default', 'focus-input', 'focus-button', 'success', 'error', 'warning', 'readonly', 'disabled'];

const text = (t) => `<span class="ws-input-group__text">${t}</span>`;

/** Input group: Figma Input Group types, as a .ws-input-group (wrapped in a .ws-form-group when it needs a label or feedback). */
export const inputGroup = ({ type = 'button-right', state = 'default', small = false } = {}) => {
  const inputState = { 'focus-input': 'focus', disabled: 'disabled', readonly: 'readonly' }[state] || 'placeholder';
  const field = (placeholder, value = placeholder) =>
    input({ state: inputState, placeholder, value, extraClass: small ? 'ws-input--sm' : '' });
  const btn = button({ label: 'Search', variant: 'ws-btn--outline-secondary', size: small ? 'ws-btn--sm' : '', state: state === 'focus-button' ? 'focus' : 'default' });
  const inner = {
    'button-left': () => btn + field('Tail number'),
    'button-right': () => field('Work order #') + btn,
    checkbox: () => `<span class="ws-input-group__text ws-input-group__text--control"><input type="checkbox" class="ws-checkbox__input" aria-label="Use as billing contact"${inputState === 'disabled' ? ' disabled' : ''}></span>` + field('Contact name'),
    radio: () => `<span class="ws-input-group__text ws-input-group__text--control"><input type="radio" class="ws-radio__input" name="ws-ig-${++uid}" aria-label="Primary contact"${inputState === 'disabled' ? ' disabled' : ''}></span>` + field('Contact name'),
    email: () => field('email-example') + text('@weststaraviation.com'),
    units: () => text('$') + field('5,000') + text('.00'),
    username: () => text('@') + field('Username'),
    url: () => text('/') + field('portal/work-orders'),
  }[type]();
  const group = `<div class="${cx('ws-input-group', { 'ws-input-group--sm': small })}">${inner}</div>`;
  const validation = ['success', 'warning', 'error'].includes(state) ? state : '';
  const fb = FEEDBACK[validation];
  const labelled = type === 'url';
  if (!validation && !labelled) return `<div style="width:392px">${group}</div>`;
  return `<div class="${cx('ws-form-group', { 'ws-form-group--sm': small }, validation && `ws-form-group--${validation}`)}" style="width:392px">${
    labelled ? `<div><div class="ws-text-sm is-semibold">Portal link</div><div class="ws-text-sm" style="color:var(--color-gray-600)">https://portal.weststaraviation.com</div></div>` : ''
  }${group}${fb ? `<p class="ws-form-group__feedback">${icon(fb.icon)}<span><strong>${fb.title}</strong> ${fb.text}</span></p>` : ''}</div>`;
};

export default {
  title: 'Components/Input',
  excludeStories: /^[a-z]/, // lowercase exports are render helpers, not stories
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma: 💠 Clay Components / Input (334:22427), Input Group (348:16136) and _InputGroupField (799:12644). Real `<input>`, `<textarea>` and `<select>` elements with the `.ws-input` class, inside a `.ws-form-group` (label, control, help text, validation feedback). Validation states are modifiers on the form group. Input groups join inputs, `.ws-btn` buttons and `.ws-input-group__text` addons.',
      },
    },
  },
  render: (args) => formGroup(args),
  argTypes: {
    label: { control: 'text' },
    showLabel: { control: 'boolean' },
    required: { control: 'boolean' },
    labelIcon: { control: 'text', description: 'Clay icon name after the label, e.g. question-circle' },
    type: { control: 'inline-radio', options: Object.values(TYPES), labels: Object.fromEntries(Object.entries(TYPES).map(([k, v]) => [v, k])) },
    size: { control: 'inline-radio', options: Object.values(SIZES), labels: Object.fromEntries(Object.entries(SIZES).map(([k, v]) => [v, k])) },
    state: { control: 'select', options: Object.values(STATES), labels: Object.fromEntries(Object.entries(STATES).map(([k, v]) => [v, k])) },
    inputIcon: { control: 'text', description: 'Trailing icon (Text type), e.g. view' },
    helpText: { control: 'text' },
  },
  args: { label: 'Tail number', showLabel: true, required: true, labelIcon: '', type: 'text', size: '', state: 'placeholder', inputIcon: '', helpText: '' },
};

export const Playground = {};

export const AllVariants = {
  name: 'Size × type × state',
  render: () =>
    matrix(
      Object.keys(STATES),
      Object.entries(SIZES).flatMap(([sizeLabel, size]) =>
        Object.entries(TYPES).map(([typeLabel, type]) => ({
          label: `${sizeLabel} / ${typeLabel}`,
          cells: Object.values(STATES).map((state) => formGroup({ size, type, state, label: 'Label', value: type === 'textarea' ? 'Left main gear strut leaking hydraulic fluid.' : undefined, placeholder: type === 'textarea' ? 'Describe the squawk' : undefined })),
        })),
      ),
    ),
};

export const Options = {
  name: 'Label icon, input icon, help text',
  render: () =>
    matrix(
      ['Label icon', 'Input icon', 'Help text', 'No label', 'Optional (no marker)'],
      Object.entries(SIZES).map(([label, size]) => ({
        label,
        cells: [
          formGroup({ size, labelIcon: 'question-circle' }),
          formGroup({ size, label: 'Portal password', inputIcon: 'view', state: 'filled', value: '••••••••••', placeholder: 'Password' }),
          formGroup({ size, helpText: 'Registration as shown on the aircraft, e.g. N375MZ.' }),
          formGroup({ size, showLabel: false }),
          formGroup({ size, label: 'Purchase order #', required: false, placeholder: 'PO-00000' }),
        ],
      })),
    ),
};

export const InputGroup = {
  name: 'Input group: type × state',
  render: () =>
    matrix(
      ['Default', 'Focus (input)', 'Focus (button)', 'Success', 'Error', 'Warning', 'Read only', 'Disabled'],
      Object.entries(GROUP_TYPES).flatMap(([label, type]) =>
        [false, true].map((small) => ({
          label: `${label}${small ? ' / Small' : ''}`,
          cells: GROUP_STATES.map((state) =>
            state === 'focus-button' && !type.startsWith('button') ? '' : inputGroup({ type, state, small }),
          ),
        })),
      ),
    ),
};
