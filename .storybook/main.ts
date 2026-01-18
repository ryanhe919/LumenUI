import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  stories: [
    '../packages/core/src/**/*.mdx',
    '../packages/core/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    // Add Tailwind CSS v4 plugin
    config.plugins = config.plugins || []
    config.plugins.push(tailwindcss())

    return config
  },
}

export default config
