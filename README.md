# Valaxy Blog

> Have fun every day! - Laplace的个人博客

基于 [Valaxy](https://github.com/YunYouJun/valaxy) 搭建的静态博客，使用 [Yun 主题](https://github.com/YunYouJun/valaxy-theme-yun)。

## ✨ 特性

- 🚀 **极速打包**：基于 Vite，开发体验流畅
- 📝 **Markdown 支持**：原生 Markdown 语法，支持 Front Matter
- 🎨 **主题定制**：Yun 主题，美观简洁
- 🌍 **多语言支持**：内置 i18n 支持
- 📱 **响应式设计**：完美适配各种设备
- 🔍 **SEO 友好**：静态站点生成，搜索引擎友好
- 🎯 **TypeScript**：完整的类型支持

## 🚀 快速开始

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm（推荐）
pnpm install
```

### 开发

```bash
npm run dev
# 或
pnpm dev
```

访问 `http://localhost:5173/` 查看效果（会自动打开浏览器）。

### 打包

```bash
# SSG 打包（推荐）
npm run build:ssg

# 或 SPA 打包
npm run build:spa
```

### 预览打包结果

```bash
npm run serve
```

访问 `http://localhost:8080/` 查看效果（会自动打开浏览器）。

## 🔄 自动化更新

每次更新内容后，只需运行以下命令即可重新部署：

```bash
git add .
git commit -m "update blog"
git push origin main && pnpm run deploy
```


## 📁 项目结构

```
valaxy-blog/
├── pages/              # 页面目录
│   ├── posts/         # 博客文章
│   ├── about/         # 关于页面
│   ├── archives/      # 归档页
│   ├── categories/    # 分类页
│   ├── tags/          # 标签页
│   └── links/         # 友链页
├── styles/            # 样式文件
│   ├── index.scss     # 全局样式
│   └── css-vars.scss  # CSS 变量
├── components/        # Vue 组件（自动加载）
├── layouts/           # 自定义布局
├── locales/           # 国际化文件
├── public/            # 静态资源
├── site.config.ts     # 站点配置
└── valaxy.config.ts   # Valaxy 配置
```

## ⚙️ 配置说明

### 站点配置

修改 `site.config.ts` 来配置站点基本信息：

- 站点 URL、标题、描述
- 作者信息
- 社交链接
- 搜索功能

### 主题配置

修改 `valaxy.config.ts` 来配置主题：

- 主题选择
- Banner 设置
- 导航菜单
- 页脚信息

更多配置请参考 [Valaxy 文档](https://valaxy.site/)。

## 📝 写作

### 创建文章

在 `pages/posts/` 目录下创建 `.md` 文件即可。

### Front Matter

```markdown
---
title: 文章标题
date: 2025-12-13
updated: 2025-12-13
categories: 分类
tags:
  - 标签1
  - 标签2
top: 1  # 置顶
---

文章内容...
```

## 🐳 Docker 部署

```bash
docker build . -t valaxy-blog:latest
docker run -p 4859:4859 valaxy-blog:latest
```

## 📦 部署到平台

### GitHub Pages

项目已配置 GitHub Actions，推送到仓库后自动打包并部署。

### Netlify

配置文件：`netlify.toml`

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/valaxy-blog)

### Vercel

配置文件：`vercel.json`

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/valaxy-blog)

## 🔗 相关链接

- [Valaxy 官方文档](https://valaxy.site/)
- [Valaxy GitHub](https://github.com/YunYouJun/valaxy)
- [Yun 主题](https://github.com/YunYouJun/valaxy-theme-yun)
- [Valaxy 示例站点](https://valaxy.site/)

## 📄 License

MIT

---

**Have fun every day!** 🎉
