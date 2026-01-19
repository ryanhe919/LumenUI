import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { readdirSync, statSync } from 'fs'

// Get all component entries
function getComponentEntries() {
  const entries: Record<string, string> = {}
  const componentsDir = resolve(__dirname, 'src/components')
  const categories = ['General', 'Form', 'DataDisplay', 'Navigation', 'Feedback']

  categories.forEach((category) => {
    const categoryPath = resolve(componentsDir, category)
    try {
      const components = readdirSync(categoryPath).filter((name) => {
        const componentPath = resolve(categoryPath, name)
        return statSync(componentPath).isDirectory() && name.startsWith('LM')
      })

      components.forEach((component) => {
        // Convert LMButton -> button, LMDatePicker -> date-picker
        const exportName = component
          .replace(/^LM/, '')
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase()
        entries[exportName] = resolve(categoryPath, component, 'index.ts')
      })
    } catch {
      // Category doesn't exist, skip
    }
  })

  return entries
}

const componentEntries = getComponentEntries()

export default defineConfig({
  plugins: [
    react() as PluginOption,
    tailwindcss() as PluginOption,
    dts({
      include: ['src'],
      outDir: 'dist',
      // Generate .d.ts for each entry
      rollupTypes: false,
    }) as PluginOption,
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...componentEntries,
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'js' : 'cjs'
        if (entryName === 'index') {
          return `index.${ext}`
        }
        return `components/${entryName}/index.${ext}`
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name || ''
        },
        // Preserve module structure for better tree-shaking
        preserveModules: false,
      },
    },
    sourcemap: true,
    minify: false,
  },
})
