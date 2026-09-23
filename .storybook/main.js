/** @type { import('@storybook/html-vite').StorybookConfig } */
export default {
  framework: '@storybook/html-vite',
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.js', '../components/**/*.stories.js'],
  staticDirs: ['../assets'],
  addons: ['@storybook/addon-docs'],
};
