import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import '@ryanhe919/lumen-ui/styles.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: {
    default: 'LumenUI',
    template: '%s - LumenUI',
  },
  description: 'LumenUI - 基于 React 的现代 UI 组件库，采用 glassmorphism 设计风格',
  keywords: ['React', 'UI', 'Component Library', 'Glassmorphism', 'TailwindCSS'],
}

const navbar = (
  <Navbar
    logo={
      <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>
        LumenUI
      </span>
    }
    projectLink="https://github.com/ryanhe919/lumen-ui"
  />
)

const footer = (
  <Footer>
    MIT {new Date().getFullYear()} © LumenUI
  </Footer>
)

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" dir="ltr" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/ryanhe919/lumen-ui/tree/main/apps/docs/content"
          footer={footer}
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          toc={{ backToTop: true }}
          editLink="在 GitHub 上编辑此页"
          feedback={{ content: '有问题？给我们反馈 →' }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
