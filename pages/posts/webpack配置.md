---
title: Webpack 常用配置
date: 2025-12-13
updated: 2025-12-13
categories: 前端开发
tags:
  - webpack
  - 前端
  - 构建工具
  - 配置
top: 1
---

## Webpack 简介

Webpack 是一个现代 JavaScript 应用程序的静态模块打包器。它将项目中的各种资源（JS、CSS、图片等）打包成一个或多个 bundle。

## Webpack 配置结构

```
webpack.config.js
├── entry              # 入口文件
│   ├── 单入口: './src/index.js'
│   └── 多入口: { main: './src/index.js', admin: './src/admin.js' }
│
├── output             # 输出配置
│   ├── path           # 输出目录
│   ├── filename       # 输出文件名
│   └── chunkFilename  # 代码块文件名
│
├── module             # 模块处理
│   └── rules          # Loader 规则
│       ├── test       # 匹配文件
│       ├── use        # 使用的 Loader
│       └── exclude    # 排除文件
│
├── plugins            # 插件配置
│   ├── HtmlWebpackPlugin      # HTML 生成
│   ├── CleanWebpackPlugin     # 清理输出目录
│   ├── MiniCssExtractPlugin   # CSS 提取
│   └── ...            # 其他插件
│
├── resolve            # 模块解析
│   ├── alias          # 路径别名
│   └── extensions     # 文件扩展名
│
├── optimization       # 优化配置
│   ├── splitChunks    # 代码分割
│   └── minimize       # 压缩配置
│
├── devServer          # 开发服务器
│   ├── port           # 端口号
│   ├── hot            # 热更新
│   └── open           # 自动打开浏览器
│
└── devtool            # Source Map 配置
```

## 基础配置

### 入口和输出

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',  // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'   // 输出文件名
  }
};
```

### 多入口配置

```javascript
module.exports = {
  entry: {
    main: './src/index.js',
    admin: './src/admin.js'
  },
  output: {
    filename: '[name].bundle.js'  // main.bundle.js, admin.bundle.js
  }
};
```

## Loader 配置

### 处理 CSS

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

### 处理 Sass/Less

```javascript
{
  test: /\.s[ac]ss$/,
  use: ['style-loader', 'css-loader', 'sass-loader']
}
```

### 处理图片和字体

```javascript
{
  test: /\.(png|jpg|gif|svg)$/,
  type: 'asset/resource',
  generator: {
    filename: 'images/[hash][ext]'
  }
},
{
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  type: 'asset/resource'
}
```

### 处理 TypeScript

```javascript
{
  test: /\.tsx?$/,
  use: 'ts-loader',
  exclude: /node_modules/
}
```

## 插件配置

### HtmlWebpackPlugin

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ]
};
```

### CleanWebpackPlugin

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

plugins: [
  new CleanWebpackPlugin()  // 清理输出目录
]
```

### MiniCssExtractPlugin

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  }
};
```

## 代码分割

### SplitChunks 配置

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all'
        }
      }
    }
  }
};
```

### 动态导入

```javascript
// 在代码中使用
import('./module').then(module => {
  module.doSomething();
});

// 或者使用 async/await
const module = await import('./module');
```

## 开发环境配置

### 开发服务器

```javascript
const path = require('path');

module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    port: 3000,
    hot: true,        // 热更新
    open: true        // 自动打开浏览器
  }
};
```

### Source Map

```javascript
module.exports = {
  devtool: 'source-map',  // 开发环境使用
  // devtool: 'eval-source-map',  // 快速构建
  // devtool: 'cheap-module-source-map'  // 生产环境可选
};
```

## 生产环境优化

### 压缩配置

```javascript
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),      // JS 压缩
      new CssMinimizerPlugin() // CSS 压缩
    ]
  }
};
```

### 文件命名策略

```javascript
output: {
  filename: '[name].[contenthash].js',  // 内容哈希
  chunkFilename: '[name].[contenthash].chunk.js'
}
```

## 别名配置

```javascript
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components')
    },
    extensions: ['.js', '.json', '.ts', '.tsx']
  }
};
```

## 环境变量

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.API_URL': JSON.stringify('https://api.example.com')
    })
  ]
};
```

## 完整示例

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
```

## 总结

Webpack 的配置虽然复杂，但掌握了这些常用配置，就能满足大部分项目的需求。关键是理解：
- **Entry/Output**：定义输入输出
- **Loader**：处理各种资源
- **Plugin**：扩展功能
- **Optimization**：优化打包结果

根据项目需求灵活组合这些配置，就能构建出高效的打包方案。

