const config = {
  logo: <span style={{ fontWeight: 700 }}>LumenUI</span>,
  project: {
    link: 'https://github.com/ryanhe919/lumen-ui',
  },
  docsRepositoryBase: 'https://github.com/ryanhe919/lumen-ui/tree/main/apps/docs',
  footer: {
    content: `MIT ${new Date().getFullYear()} © LumenUI`,
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
  },
  i18n: [],
  search: {
    placeholder: '搜索文档...',
  },
  editLink: {
    content: '在 GitHub 上编辑此页',
  },
  feedback: {
    content: '有问题？给我们反馈 →',
  },
  navigation: {
    prev: true,
    next: true,
  },
  gitTimestamp: ({ timestamp }: { timestamp: Date }) => (
    <span>最后更新于 {timestamp.toLocaleDateString('zh-CN')}</span>
  ),
}

export default config
