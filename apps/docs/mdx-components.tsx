import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { LivePreview } from './components/LivePreview'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components?: Record<string, React.ComponentType>) {
  return {
    ...docsComponents,
    LivePreview,
    ...components,
  }
}
