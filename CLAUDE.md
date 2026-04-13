# CLAUDE.md

## 基本要求

- **始终使用中文进行对话和交流**
- 遵循现有代码风格和项目约定

## 项目概述

德州扑克筹码计分系统 — 单页 Web 应用，用于追踪扑克筹码变动、转移、结算和玩家管理。

## 技术栈

- **框架**: Vue 3 (Composition API, `<script setup>`)
- **构建工具**: Vite
- **样式**: TailwindCSS v3 (darkMode: 'class')
- **状态管理**: 模块级响应式 ref（composable 单例模式，非实例级）
- **持久化**: localStorage（通过 `useStorage` composable）
- **包管理器**: pnpm

## 常用命令

- `pnpm dev` — 启动开发服务器
- `pnpm build` — 生产构建（输出到 `dist/`）
- `pnpm preview` — 预览生产构建

## 项目结构

```
src/
├── main.js                          # 应用入口
├── App.vue                          # 根布局（响应式三栏 / 移动端标签页）
├── styles/main.css                  # Tailwind 指令、组件类、主题覆盖
├── composables/                     # 共享状态与逻辑（单例模式）
│   ├── usePlayers.js                # 玩家增删改、筹码操作、结算、检验
│   ├── useStorage.js                # localStorage 响应式封装
│   ├── useTheme.js                  # 主题管理（浅色/深色/赛博朋克/少女之心）
│   ├── useToast.js                  # Toast 通知系统
│   └── useTransfers.js              # 转移记录增删
└── components/
    ├── common/                      # 通用 UI 组件
    │   ├── AppModal.vue             # 通用弹窗
    │   ├── ChipModal.vue            # 转移/借入/归还弹窗
    │   ├── ContextMenu.vue          # 右键菜单
    │   ├── SakuraEffect.vue         # 樱花飘落动画
    │   └── ToastContainer.vue       # Toast 通知容器
    ├── table/                       # 筹码信息表格
    │   ├── ChipTable.vue            # 主表格 + 右键菜单逻辑
    │   └── PlayerRow.vue            # 玩家行（行内编辑、拖拽排序）
    ├── transfer/                    # 转移记录侧栏
    │   ├── TransferSidebar.vue
    │   └── TransferCard.vue
    └── operation/                   # 操作侧栏
        ├── OperationSidebar.vue
        ├── QuickActions.vue
        ├── Settlement.vue
        ├── ThemeSettings.vue
        └── SystemInfo.vue
```

## 架构要点

- **Composable 单例模式**：响应式 ref 声明在模块顶层（导出函数外部），所有组件共享同一份状态。
- **主题系统**：使用 CSS class `dark` + 主题类名。赛博朋克和少女之心主题覆盖样式放在 `@layer` 块外部，确保能覆盖 Tailwind 工具类。
- **响应式布局**：桌面端（>=1024px）三栏布局；移动端使用底部标签栏切换面板。`v-show` + CSS `!important` 在 lg 断点强制所有面板可见。
- **拖拽排序**：使用自定义 mousedown/mouseenter/mouseup 事件（不用 HTML5 DnD API，后者会触发浏览器打开新标签页）。仅桌面端可用；移动端通过右键菜单上移/下移。
- **Toast 进度条**：纯 CSS `@keyframes` 动画实现丝滑 60fps，JS 仅负责定时器和暂停/恢复（通过 `animation-play-state`）。

## 代码约定

- 界面文案全部使用中文（zh-CN）
- 组件类定义在 main.css 的 `@layer components` 中：`.card`、`.btn`、`.btn-primary`、`.btn-danger`、`.btn-ghost`、`.input`、`.action-btn`、`.sidebar`、`.sidebar-title`、`.sidebar-panel`、`.section-title`
- 表格斑马纹通过动态 `:class` 绑定 `index % 2` 实现
- 筹码数值颜色：正数=绿色，负数=红色，零=灰色
