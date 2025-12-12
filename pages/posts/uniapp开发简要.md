---
title: UniApp 开发简要
date: 2025-12-13
updated: 2025-12-13
categories: 前端开发
tags:
  - uniapp
  - vue
  - 跨平台
  - 移动开发
---

## UniApp 简介

UniApp 是一个使用 Vue.js 开发所有前端应用的框架，可以编译到 iOS、Android、H5、以及各种小程序等多个平台。

## 从 0 到 1 搭建

### 1. 安装 HBuilderX

下载并安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)，这是 DCloud 官方推荐的开发工具。

### 2. 创建项目

在 HBuilderX 中：
- 文件 → 新建 → 项目
- 选择 `uni-app` 模板
- 选择默认模板或 Vue3/Vue2 版本

或使用 CLI 创建：

```bash
# 使用 Vue CLI
npm install -g @vue/cli
vue create -p dcloudio/uni-preset-vue my-project

# 或使用 Vite
npx degit dcloudio/uni-preset-vue#vite-ts my-project
```

### 3. 项目结构

```
my-project/
├── pages/              # 页面目录
│   ├── index/
│   │   └── index.vue
│   └── ...
├── components/         # 组件目录
├── static/            # 静态资源
├── App.vue            # 应用入口
├── main.js            # 入口文件
├── manifest.json      # 应用配置
└── pages.json         # 页面路由配置
```

### 4. 基础配置

**pages.json** - 页面路由配置：

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "UniApp",
    "navigationBarBackgroundColor": "#F8F8F8"
  }
}
```

**manifest.json** - 应用配置（部分）：

```json
{
  "name": "my-app",
  "appid": "",
  "description": "",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false
}
```

## 开发对比：UniApp vs Vue

### 模板语法

**Vue 项目：**

```vue
<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <button @click="handleClick">点击</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello Vue'
    }
  },
  methods: {
    handleClick() {
      console.log('clicked')
    }
  }
}
</script>
```

**UniApp 项目：**

```vue
<template>
  <view class="container">
    <text>{{ title }}</text>
    <button @tap="handleClick">点击</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello UniApp'
    }
  },
  methods: {
    handleClick() {
      uni.showToast({
        title: '点击了按钮'
      })
    }
  }
}
</script>
```

**主要区别：**
- `div` → `view`
- `span` → `text`
- `@click` → `@tap`
- 使用 `uni.xxx` API 替代浏览器 API

### 路由导航

**Vue Router：**

```javascript
// 编程式导航
this.$router.push('/detail?id=123')

// 声明式导航
<router-link to="/detail?id=123">详情</router-link>
```

**UniApp：**

```javascript
// 编程式导航
uni.navigateTo({
  url: '/pages/detail/detail?id=123'
})

// 声明式导航
<navigator url="/pages/detail/detail?id=123">详情</navigator>
```

### 网络请求

**Vue (axios)：**

```javascript
import axios from 'axios'

axios.get('/api/user')
  .then(res => {
    console.log(res.data)
  })
```

**UniApp：**

```javascript
uni.request({
  url: 'https://api.example.com/user',
  method: 'GET',
  success: (res) => {
    console.log(res.data)
  }
})

// 或使用 async/await
async getUser() {
  const res = await uni.request({
    url: 'https://api.example.com/user'
  })
  return res.data
}
```

### API 差异

UniApp 与 Vue 在 API 使用上有显著差异，主要在于 UniApp 提供了统一的跨平台 API。

#### 1. 路由 API

**Vue Router：**

```javascript
// 导航
this.$router.push('/page')
this.$router.replace('/page')
this.$router.go(-1)
this.$router.back()

// 获取路由信息
this.$route.params
this.$route.query
```

**UniApp：**

```javascript
// 导航
uni.navigateTo({ url: '/pages/detail/detail' })      // 保留当前页面
uni.redirectTo({ url: '/pages/detail/detail' })      // 关闭当前页面
uni.reLaunch({ url: '/pages/detail/detail' })         // 关闭所有页面
uni.switchTab({ url: '/pages/index/index' })         // 切换到 tabBar 页面
uni.navigateBack({ delta: 1 })                        // 返回上一页

// 获取页面参数
onLoad(options) {
  console.log(options.id)  // 页面参数
}
```

#### 2. 存储 API

**Vue (localStorage)：**

```javascript
// 存储
localStorage.setItem('key', 'value')
sessionStorage.setItem('key', 'value')

// 读取
const value = localStorage.getItem('key')
const value2 = sessionStorage.getItem('key')

// 删除
localStorage.removeItem('key')
localStorage.clear()
```

**UniApp：**

```javascript
// 同步存储
uni.setStorageSync('key', 'value')
const value = uni.getStorageSync('key')
uni.removeStorageSync('key')
uni.clearStorageSync()

// 异步存储
uni.setStorage({
  key: 'key',
  data: 'value',
  success: () => {}
})
uni.getStorage({
  key: 'key',
  success: (res) => {
    console.log(res.data)
  }
})
```

#### 3. 提示框 API

**Vue (浏览器 API)：**

```javascript
alert('提示信息')
confirm('确认信息')
prompt('输入信息')
```

**UniApp：**

```javascript
// 提示框
uni.showToast({
  title: '提示信息',
  icon: 'success',  // success/error/loading/none
  duration: 2000
})

// 模态框
uni.showModal({
  title: '提示',
  content: '确认操作？',
  success: (res) => {
    if (res.confirm) {
      console.log('用户点击确定')
    }
  }
})

// 加载提示
uni.showLoading({
  title: '加载中...'
})
uni.hideLoading()
```

#### 4. 页面交互 API

**Vue：**

```javascript
// 需要手动实现或使用第三方库
window.scrollTo(0, 0)
document.title = '新标题'
```

**UniApp：**

```javascript
// 设置导航栏标题
uni.setNavigationBarTitle({
  title: '新标题'
})

// 显示/隐藏导航栏加载动画
uni.showNavigationBarLoading()
uni.hideNavigationBarLoading()

// 设置页面滚动位置
uni.pageScrollTo({
  scrollTop: 0,
  duration: 300
})
```

#### 5. 设备信息 API

**Vue：**

```javascript
// 需要手动获取
const width = window.innerWidth
const height = window.innerHeight
const system = navigator.userAgent
```

**UniApp：**

```javascript
// 获取系统信息
uni.getSystemInfo({
  success: (res) => {
    console.log(res.windowWidth)   // 窗口宽度
    console.log(res.windowHeight)  // 窗口高度
    console.log(res.platform)      // 平台信息
    console.log(res.system)        // 系统版本
  }
})

// 同步获取
const systemInfo = uni.getSystemInfoSync()
```

#### 6. 媒体 API

**Vue：**

```javascript
// 需要手动实现或使用第三方库
const audio = new Audio('audio.mp3')
audio.play()
```

**UniApp：**

```javascript
// 选择图片
uni.chooseImage({
  count: 1,
  success: (res) => {
    const tempFilePaths = res.tempFilePaths
  }
})

// 预览图片
uni.previewImage({
  urls: ['image1.jpg', 'image2.jpg'],
  current: 0
})

// 选择视频
uni.chooseVideo({
  success: (res) => {
    console.log(res.tempFilePath)
  }
})
```

#### 7. 位置 API

**Vue：**

```javascript
// 浏览器 Geolocation API
navigator.geolocation.getCurrentPosition((position) => {
  console.log(position.coords.latitude)
})
```

**UniApp：**

```javascript
// 获取位置
uni.getLocation({
  type: 'gcj02',
  success: (res) => {
    console.log(res.latitude)   // 纬度
    console.log(res.longitude)  // 经度
  }
})

// 打开地图选择位置
uni.chooseLocation({
  success: (res) => {
    console.log(res.name)       // 位置名称
    console.log(res.address)    // 详细地址
  }
})
```

#### 8. 分享 API

**Vue：**

```javascript
// 需要手动实现 Web Share API 或第三方库
navigator.share({
  title: '分享标题',
  url: 'https://example.com'
})
```

**UniApp：**

```javascript
// 分享
uni.share({
  provider: 'weixin',
  scene: 'WXSceneSession',
  type: 0,
  href: 'https://example.com',
  title: '分享标题',
  success: () => {}
})

// 或使用页面分享
onShareAppMessage() {
  return {
    title: '分享标题',
    path: '/pages/index/index'
  }
}
```

### 条件编译

UniApp 支持条件编译，针对不同平台编写不同代码：

```javascript
// #ifdef H5
console.log('这是 H5 平台')
// #endif

// #ifdef MP-WEIXIN
console.log('这是微信小程序')
// #endif

// #ifdef APP-PLUS
console.log('这是 App 平台')
// #endif
```

## 打包发布

### H5 打包

1. 在 HBuilderX 中：发行 → 网站-H5
2. 或使用 CLI：

```bash
npm run build:h5
```

打包后的文件在 `dist/build/h5` 目录，可直接部署到服务器。

### 小程序打包

**微信小程序：**

1. 发行 → 小程序-微信
2. 使用微信开发者工具打开 `dist/build/mp-weixin` 目录
3. 在微信开发者工具中上传代码

**其他小程序：**

```bash
# 支付宝小程序
npm run build:mp-alipay

# 百度小程序
npm run build:mp-baidu

# 字节跳动小程序
npm run build:mp-toutiao
```

### App 打包

**云打包（推荐）：**

1. 发行 → 原生 App-云打包
2. 选择平台（Android/iOS）
3. 配置证书和签名
4. 提交打包，等待完成

**本地打包：**

需要配置 Android Studio 或 Xcode 环境，较为复杂。

### 发布流程

1. **H5**：将打包文件上传到服务器（Nginx/Apache）
2. **小程序**：在对应平台开发者后台提交审核
3. **App**：上传到应用商店（App Store/应用宝等）

## 总结

UniApp 的优势：
- ✅ 一套代码，多端运行
- ✅ 基于 Vue，学习成本低
- ✅ 丰富的 API 和插件生态
- ✅ 条件编译支持平台差异化

与 Vue 的主要区别：
- 使用平台特定的组件和 API
- 路由和导航方式不同
- 需要适配不同平台的特性
- 打包和发布流程更复杂

掌握 UniApp 后，可以快速开发跨平台应用，大大提高开发效率。

