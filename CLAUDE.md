# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

LumenUI 是一个基于 React 的现代 UI 组件库，采用 glassmorphism 设计风格，使用 TypeScript 和 TailwindCSS v4 构建。

## 常用命令

```bash
# 开发
pnpm dev                # Watch 模式构建
pnpm storybook          # 启动 Storybook (端口 6006)

# 测试
pnpm test               # Vitest Watch 模式
pnpm test:run           # 单次运行所有测试
pnpm test:ui            # Vitest UI 界面
pnpm test:coverage      # 生成覆盖率报告

# 构建与检查
pnpm build              # 构建库
pnpm typecheck          # TypeScript 类型检查
pnpm clean              # 清理 dist 目录
```

## 架构概览

**Monorepo 结构** (pnpm workspace)
```
LumenUI/
├── packages/core/          # 核心组件库 (@ryanhe919/lumen-ui)
│   └── src/
│       ├── components/     # 25 个组件，每个组件目录包含:
│       │                   # *.tsx (组件) + *.stories.tsx (文档) + *.test.tsx (测试)
│       ├── styles/         # base.css (入口) + theme.css (CSS 变量主题)
│       ├── utils/          # cn.ts (类名合并) + componentSizes.ts (尺寸配置)
│       └── types/          # 公共类型定义
├── .storybook/             # Storybook 配置
├── vitest.config.ts        # 测试配置
└── vitest.setup.ts         # 测试环境设置
```

**组件分类** (Storybook 中的分组)
- 通用 General: LMButton, LMBadge
- 表单 Form: LMInput, LMTextarea, LMNumberInput, LMSearchInput, LMSelect, LMCheckbox, LMRadio, LMSwitch, LMField, LMDatePicker
- 数据展示 Data Display: LMTable, LMStatCard, LMTooltip, LMCard, LMEmpty, LMTabs
- 导航 Navigation: LMMenu, LMDropdown, LMPagination
- 反馈 Feedback: LMMessage, LMModal, LMConfirm, LMDrawer

## 关键技术约定

**设计风格**: Apple-like 现代设计，特点包括:
- 精致的圆角系统 (6px, 10px, 12px, 16px, 20px)
- 柔和的阴影效果
- 快速流畅的过渡动画 (120ms-250ms)
- Apple System Blue 主色调 (`#007AFF` / `#0A84FF`)
- 支持 `prefers-reduced-motion` 无障碍

**尺寸系统**: 所有组件支持 6 个尺寸: `xs | sm | md | lg | xl | 2xl`，配置在 `utils/componentSizes.ts`

**主题系统**: 使用 CSS 变量，通过 `data-theme="dark"` 切换暗色模式，变量定义在 `styles/theme.css`
- 支持 5 个主题: light, dark, blue, green, redWhite
- 新增缓动曲线变量: `--lm-ease-default`, `--lm-ease-spring`, `--lm-ease-out`

**动效系统**:
- 过渡时长: `--lm-transition-fast` (120ms), `--lm-transition-normal` (180ms), `--lm-transition-slow` (250ms)
- 悬停效果: 使用 `scale(1.02)` 而非 `translateY`
- 按压效果: 使用 `scale(0.98)` 提供反馈

**构建输出**:
- ESM: `dist/index.js`
- CJS: `dist/index.cjs`
- 类型: `dist/index.d.ts`
- 样式: `dist/style.css`

**外部依赖**: `react`, `react-dom` 作为 peerDependencies，不打包到库中

## 测试

- 使用 Vitest + @testing-library/react
- 测试文件与组件同目录: `ComponentName.test.tsx`
- 全局 API 已启用 (`globals: true`)
- jsdom 环境模拟浏览器

## Stories 文档

- 使用中文描述和注释
- 标题格式: `分类 Category/LMComponent 组件名`
- 每个 story 使用 JSDoc 注释: `/** 中文名称 - 简短说明 */`

## 设计规范

**圆角**: 使用 `rounded-xl` (12px) 作为主要圆角，避免过大的 `rounded-2xl`

**过渡**: 使用 CSS 变量控制，如 `transition: all var(--lm-transition-normal) var(--lm-ease-out)`

**阴影**: 使用柔和的多层阴影，如 `--lm-shadow-md: 0 4px 12px rgba(0,0,0,0.06)`

**交互**:
- 所有可点击元素添加 `cursor-pointer`
- 悬停使用 `scale(1.02)` 配合阴影增强
- 按压使用 `scale(0.98)` 提供触觉反馈

**无障碍**:
- 支持 `prefers-reduced-motion` 减少动画
- 使用 `:focus-visible` 显示键盘焦点
- 文字对比度满足 WCAG 4.5:1 标准
