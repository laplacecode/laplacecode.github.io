---
title: Tailwind CSS 两种安装方式
date: 2025-02-20
updated: 2025-02-20
categories: 前端开发
tags:
  - Tailwind CSS
  - 前端
  - CSS框架
  - Vite
  - PostCSS
top: 1
---

## 简介

Tailwind CSS 是一个实用优先的 CSS 框架，可以通过两种方式安装：使用 Vite 插件或使用 PostCSS。两种方式都能快速集成 Tailwind CSS 到项目中。


## 方式一：使用 Vite 插件安装

### 安装依赖

```bash
npm install -D tailwindcss @tailwindcss/vite
```

### 配置 Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss()
  ]
})
```

### 创建 Tailwind 配置文件

```bash
npx tailwindcss init
```

### 配置 tailwind.config.js

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 引入样式

```css
/* src/index.css */
@import "tailwindcss";
```

## 方式二：使用 PostCSS 安装

### 三个工具的作用

- **Tailwind CSS**：实用优先的 CSS 框架，提供大量预定义的实用类，通过类名快速构建界面
- **PostCSS**：CSS 转换工具，通过插件系统处理 CSS（如转换、优化、添加前缀等）
- **Autoprefixer**：PostCSS 插件，自动为 CSS 属性添加浏览器厂商前缀（如 `-webkit-`、`-moz-` 等）

### 工具关系树状图

```
CSS 构建流程
│
├── PostCSS (CSS 转换工具)
│   │
│   ├── Tailwind CSS (PostCSS 插件)
│   │   └── 功能：将 Tailwind 类名转换为实际 CSS
│   │       └── 示例：.flex → display: flex
│   │
│   └── Autoprefixer (PostCSS 插件)
│       └── 功能：自动添加浏览器前缀
│           └── 示例：display: flex → -webkit-display: flex; display: flex
│
└── 工作流程
    ├── 1. 源代码 (HTML + Tailwind 类名)
    ├── 2. Tailwind CSS 处理 (生成 CSS)
    ├── 3. Autoprefixer 处理 (添加前缀)
    └── 4. 最终 CSS (浏览器兼容)
```

### 安装依赖

```bash
npm install -D tailwindcss postcss autoprefixer
```

### 初始化配置

```bash
npx tailwindcss init -p
```

### 配置 postcss.config.js

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 配置 tailwind.config.js

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 引入样式

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 两种方式对比

| 特性 | Vite 插件 | PostCSS |
|------|----------|---------|
| 配置复杂度 | 简单 | 中等 |
| 构建速度 | 更快 | 较快 |
| 兼容性 | Vite 项目 | 所有构建工具 |
| 推荐场景 | Vite 项目 | 通用项目 |

## 使用示例

```html
<!-- 使用 Tailwind 类名 -->
<div class="flex items-center justify-center h-screen bg-gray-100">
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-gray-800">Hello Tailwind</h1>
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      点击按钮
    </button>
  </div>
</div>
```

## 总结

- **Vite 项目**：推荐使用 `@tailwindcss/vite` 插件，配置简单，构建更快
- **其他构建工具**：使用 PostCSS 方式，兼容性更好
- 两种方式都需要配置 `tailwind.config.js` 中的 `content` 路径
- 样式引入方式不同：Vite 插件使用 `@import "tailwindcss"`，PostCSS 使用 `@tailwind` 指令

