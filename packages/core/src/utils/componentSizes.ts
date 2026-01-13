/**
 * @file Component size utilities
 * @description Shared size tokens for LumenUI components
 */

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/** Size order for iteration */
export const COMPONENT_SIZE_ORDER: ComponentSize[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
]

/** Text size classes */
export const SIZE_TEXT_CLASSES: Record<ComponentSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
}

/** Heading size classes */
export const SIZE_HEADING_CLASSES: Record<ComponentSize, string> = {
  xs: 'text-lg',
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
  '2xl': 'text-5xl',
}

/** Display size classes */
export const SIZE_DISPLAY_CLASSES: Record<ComponentSize, string> = {
  xs: 'text-xl',
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
  xl: 'text-5xl',
  '2xl': 'text-6xl',
}

/** Gap classes */
export const SIZE_GAP_CLASSES: Record<ComponentSize, string> = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-3',
  '2xl': 'gap-4',
}

/** Padding classes */
export const SIZE_PADDING_CLASSES: Record<ComponentSize, string> = {
  xs: 'p-3',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
  '2xl': 'p-12',
}

/** Button size config */
export const SIZE_BUTTON_CONFIG: Record<
  ComponentSize,
  { padding: string; height: string }
> = {
  xs: { padding: 'px-2.5 py-1.5', height: 'h-7' },
  sm: { padding: 'px-3 py-2', height: 'h-8' },
  md: { padding: 'px-4 py-2.5', height: 'h-10' },
  lg: { padding: 'px-5 py-3', height: 'h-12' },
  xl: { padding: 'px-6 py-3.5', height: 'h-14' },
  '2xl': { padding: 'px-8 py-4', height: 'h-16' },
}

/** Input size config */
export const SIZE_INPUT_CONFIG: Record<
  ComponentSize,
  { padding: string; height: string; fontSize: string }
> = {
  xs: { padding: 'px-3 py-1', height: 'h-7', fontSize: 'text-xs' },
  sm: { padding: 'px-3 py-1.5', height: 'h-9', fontSize: 'text-sm' },
  md: { padding: 'px-4 py-2', height: 'h-10', fontSize: 'text-sm' },
  lg: { padding: 'px-4 py-2.5', height: 'h-12', fontSize: 'text-base' },
  xl: { padding: 'px-5 py-3', height: 'h-14', fontSize: 'text-base' },
  '2xl': { padding: 'px-6 py-4', height: 'h-16', fontSize: 'text-lg' },
}

/** Selector size config */
export const SIZE_SELECTOR_CONFIG: Record<
  ComponentSize,
  { padding: string; height: string; fontSize: string }
> = {
  xs: { padding: 'px-3 py-1', height: 'h-7', fontSize: 'text-xs' },
  sm: { padding: 'px-3 py-1.5', height: 'h-9', fontSize: 'text-sm' },
  md: { padding: 'px-4 py-2', height: 'h-10', fontSize: 'text-sm' },
  lg: { padding: 'px-4 py-2.5', height: 'h-12', fontSize: 'text-base' },
  xl: { padding: 'px-5 py-3', height: 'h-14', fontSize: 'text-base' },
  '2xl': { padding: 'px-6 py-4', height: 'h-16', fontSize: 'text-lg' },
}

/** Modal size config */
export const SIZE_MODAL_CONFIG: Record<
  ComponentSize,
  { width: string; maxWidth: string }
> = {
  xs: { width: '360px', maxWidth: '90vw' },
  sm: { width: '480px', maxWidth: '90vw' },
  md: { width: '640px', maxWidth: '90vw' },
  lg: { width: '800px', maxWidth: '95vw' },
  xl: { width: '960px', maxWidth: '95vw' },
  '2xl': { width: '1200px', maxWidth: '95vw' },
}

/** Tooltip size config */
export const SIZE_TOOLTIP_CONFIG: Record<
  ComponentSize,
  { paddingClass: string; textClass: string; maxWidth: number }
> = {
  xs: { paddingClass: 'px-2.5 py-1.5', textClass: 'text-xs', maxWidth: 200 },
  sm: { paddingClass: 'px-3 py-2', textClass: 'text-sm', maxWidth: 240 },
  md: { paddingClass: 'px-4 py-2.5', textClass: 'text-sm', maxWidth: 300 },
  lg: { paddingClass: 'px-4 py-3', textClass: 'text-base', maxWidth: 360 },
  xl: { paddingClass: 'px-5 py-3', textClass: 'text-lg', maxWidth: 420 },
  '2xl': { paddingClass: 'px-6 py-4', textClass: 'text-xl', maxWidth: 500 },
}

/** Icon size config */
export const SIZE_ICON_CONFIG: Record<ComponentSize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
  '2xl': 'w-12 h-12',
}

/** Table size config */
export const SIZE_TABLE_CONFIG: Record<
  ComponentSize,
  { cellPadding: string; rowHeight: string }
> = {
  xs: { cellPadding: 'px-2 py-1', rowHeight: 'h-8' },
  sm: { cellPadding: 'px-3 py-1.5', rowHeight: 'h-10' },
  md: { cellPadding: 'px-4 py-2', rowHeight: 'h-12' },
  lg: { cellPadding: 'px-6 py-3', rowHeight: 'h-14' },
  xl: { cellPadding: 'px-8 py-4', rowHeight: 'h-16' },
  '2xl': { cellPadding: 'px-10 py-5', rowHeight: 'h-20' },
}

/**
 * Clamp size to allowed values
 */
export const clampComponentSize = (
  size: ComponentSize | undefined,
  allowedSizes: ComponentSize[],
  fallback: ComponentSize = 'md'
): ComponentSize => {
  const nextSize = size ?? fallback
  return allowedSizes.includes(nextSize) ? nextSize : fallback
}
