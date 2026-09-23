import '../css/index.css';
import '../stories/storybook.css';

/** @type { import('@storybook/html-vite').Preview } */
export default {
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    options: { storySort: { order: ['Introduction', 'Foundations', 'Components'] } },
    backgrounds: {
      options: {
        light: { name: 'White', value: '#FFFFFF' },
        page: { name: 'Page (gray-100)', value: '#F7F8F9' },
        dark: { name: 'Nav (primary-d1)', value: '#131C2B' },
      },
    },
  },
  initialGlobals: { backgrounds: { value: 'light' } },
};
