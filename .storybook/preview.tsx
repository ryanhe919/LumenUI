import React, { useEffect } from 'react'
import type { Preview, Decorator } from '@storybook/react-vite'
// base.css imports tailwindcss and theme.css
import '../packages/core/src/styles/base.css'

// Additional styles for Storybook docs background
const storybookThemeStyles = `
  /* Override Storybook docs background to follow theme */
  .docs-story,
  .sb-story,
  .sbdocs-preview,
  .sbdocs .sb-story,
  #storybook-root,
  #storybook-docs {
    background-color: var(--lm-bg-paper) !important;
    transition: background-color var(--lm-transition-normal);
  }

  /* Canvas wrapper */
  .sb-main-padded {
    background-color: var(--lm-bg-paper) !important;
  }
`

// Theme decorator - applies data-theme attribute to html element and updates backgrounds
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'light'

  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    // Set data-theme for all themes (light uses :root defaults, others use specific theme)
    if (theme === 'light') {
      html.removeAttribute('data-theme')
    } else {
      html.setAttribute('data-theme', theme)
    }

    // Force update body and root backgrounds
    body.style.backgroundColor = 'var(--lm-bg-paper)'
    body.style.color = 'var(--lm-text-primary)'

    // Also update any Storybook-specific containers
    const storybookRoot = document.getElementById('storybook-root')
    if (storybookRoot) {
      storybookRoot.style.backgroundColor = 'var(--lm-bg-paper)'
    }

    // Inject theme styles if not already present
    const styleId = 'lm-storybook-theme-styles'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = storybookThemeStyles
      document.head.appendChild(style)
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
      disabled: true,
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
