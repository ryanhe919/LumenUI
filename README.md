# LumenUI

A modern React UI component library with glassmorphism design, built with TypeScript and TailwindCSS v4.

## Features

- 17+ beautifully crafted components
- Glassmorphism design language
- Full TypeScript support
- TailwindCSS v4 integration
- CSS variable-based theming (light/dark mode)
- 6 size variants (xs, sm, md, lg, xl, 2xl)
- ESM and CommonJS support
- Tree-shakeable

## Installation

```bash
npm install @lumen-ui/core
# or
pnpm add @lumen-ui/core
# or
yarn add @lumen-ui/core
```

## Quick Start

```tsx
import { LMButton, LMInput } from '@lumen-ui/core'
import '@lumen-ui/core/styles.css'

function App() {
  return (
    <div>
      <LMInput placeholder="Enter your name" />
      <LMButton variant="primary">Submit</LMButton>
    </div>
  )
}
```

## Components

### Basic Components
- **LMButton** - Button with multiple variants and sizes
- **LMInput** - Text input field
- **LMBadge** - Status badges and labels
- **LMTooltip** - Hover tooltips
- **LMModal** - Modal dialogs

### Form Components
- **LMCheckbox** - Checkbox input
- **LMRadio** - Radio button input
- **LMSwitch** - Toggle switch
- **LMTextarea** - Multi-line text input
- **LMNumberInput** - Numeric input with controls
- **LMSearchInput** - Search input with icon
- **LMSelect** - Dropdown select (single/multiple)
- **LMField** - Form field wrapper with label

### Complex Components
- **LMTable** - Data table with pagination, sorting, selection
- **LMMessage** - Toast notifications
- **LMConfirm** - Confirmation dialogs
- **LMStatCard** - Statistics display cards

## Theming

LumenUI uses CSS variables for theming. Add `data-theme="dark"` to enable dark mode:

```html
<html data-theme="dark">
  <!-- Your app -->
</html>
```

### Custom Theme

Override CSS variables to customize the theme:

```css
:root {
  --lm-primary-500: #6366f1;
  --lm-primary-600: #4f46e5;
  /* ... */
}
```

## Usage Examples

### Button

```tsx
<LMButton variant="primary" size="md">
  Click me
</LMButton>

<LMButton variant="outline" loading>
  Loading...
</LMButton>
```

### Table

```tsx
const columns = [
  { title: 'Name', dataIndex: 'name', sorter: true },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Email', dataIndex: 'email' },
]

const data = [
  { id: 1, name: 'John', age: 25, email: 'john@example.com' },
  { id: 2, name: 'Jane', age: 30, email: 'jane@example.com' },
]

<LMTable
  dataSource={data}
  columns={columns}
  pagination={{
    current: 1,
    pageSize: 10,
    total: 100,
    showPagination: true,
  }}
/>
```

### Message Notifications

```tsx
import { useMessage, LMMessageContainer } from '@lumen-ui/core'

function App() {
  const { messages, success, error, removeMessage } = useMessage()

  return (
    <>
      <button onClick={() => success('Operation successful!')}>
        Show Success
      </button>
      <LMMessageContainer messages={messages} onClose={removeMessage} />
    </>
  )
}
```

### Confirm Dialog

```tsx
import { useConfirm } from '@lumen-ui/core'

function App() {
  const { confirm, ConfirmDialog } = useConfirm()

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Item',
      content: 'Are you sure you want to delete this item?',
      confirmButtonStyle: 'danger',
    })

    if (confirmed) {
      // Perform delete
    }
  }

  return (
    <>
      <button onClick={handleDelete}>Delete</button>
      <ConfirmDialog />
    </>
  )
}
```

## Development

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build
pnpm build

# Type check
pnpm typecheck
```

## License

MIT License - see [LICENSE](./LICENSE) for details.
