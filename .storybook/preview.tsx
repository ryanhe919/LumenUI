import React, { useEffect } from 'react'
import type { Preview, Decorator } from '@storybook/react'
// base.css imports tailwindcss and theme.css
import '../packages/core/src/styles/base.css'

// Theme decorator - applies data-theme attribute to html element
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'light'

  useEffect(() => {
    const html = document.documentElement
    // Set data-theme for all themes (light uses :root defaults, others use specific theme)
    if (theme === 'light') {
      html.removeAttribute('data-theme')
    } else {
      html.setAttribute('data-theme', theme)
    }
  }, [theme])

  return <Story />
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true, // Disable backgrounds addon, use theme instead
    },
    layout: 'centered',
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light 亮色' },
          { value: 'dark', icon: 'moon', title: 'Dark 暗色' },
          { value: 'blue', icon: 'paintbrush', title: 'Blue 蓝色' },
          { value: 'green', icon: 'tree', title: 'Green 绿色' },
          { value: 'redWhite', icon: 'heart', title: 'RedWhite 红白' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
  tags: ['autodocs'],
}

export default preview
