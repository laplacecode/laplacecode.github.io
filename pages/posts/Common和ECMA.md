---
title: CommonJS 和 ECMAScript
date: 2025-01-27
updated: 2025-01-27
categories: 前端开发
tags:
  - JavaScript
  - 模块化
  - CommonJS
  - ES6
  - ECMAScript
  - NodeJs
top: 1
---

## 概述

JavaScript 有两种主要的模块系统：**CommonJS** 和 **ECMAScript Modules (ESM)**。它们有不同的语法、加载机制和使用场景。

## 主要区别

| 特性 | CommonJS | ECMAScript Modules |
|------|----------|-------------------|
| **加载时机** | 运行时同步加载 | 编译时静态分析 |
| **使用场景** | Node.js 环境 | 浏览器和现代 Node.js |
| **导出方式** | `module.exports` / `exports` | `export` |
| **导入方式** | `require()` | `import` |
| **动态导入** | 支持（同步） | 支持（异步 `import()`） |
| **循环依赖** | 部分支持 | 更好的支持 |
| **Tree Shaking** | 不支持 | 支持 |

## CommonJS 模块系统

### 导出

```javascript
// math.js
// 方式1: 使用 module.exports
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// 方式2: 使用 exports（简化写法）
exports.multiply = (a, b) => a * b;
exports.divide = (a, b) => a / b;

// 方式3: 导出单个值
module.exports = function greet(name) {
  return `Hello, ${name}!`;
};
```

### 导入

```javascript
// app.js
// 导入对象
const math = require('./math');
console.log(math.add(1, 2)); // 3

// 解构导入
const { add, subtract } = require('./math');
console.log(add(1, 2)); // 3

// 导入函数
const greet = require('./greet');
console.log(greet('World')); // Hello, World!
```

## ECMAScript Modules (ESM)

### 导出

```javascript
// math.js
// 方式1: 命名导出
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// 方式2: 统一导出
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
export { multiply, divide };

// 方式3: 默认导出
export default function greet(name) {
  return `Hello, ${name}!`;
}

// 方式4: 混合导出
export const PI = 3.14159;
export default class Calculator {
  add(a, b) { return a + b; }
}
```

### 导入

```javascript
// app.js
// 命名导入
import { add, subtract } from './math.js';
console.log(add(1, 2)); // 3

// 默认导入
import greet from './greet.js';
console.log(greet('World')); // Hello, World!

// 混合导入
import Calculator, { PI } from './calculator.js';

// 全部导入
import * as math from './math.js';
console.log(math.add(1, 2)); // 3

// 重命名导入
import { add as sum } from './math.js';

// 动态导入（异步）
const module = await import('./math.js');
const { add } = module;
```

## export 和 export default 详解

### 核心区别

| 特性 | `export` (命名导出) | `export default` (默认导出) |
|------|-------------------|---------------------------|
| **导出数量** | 可以有多个 | 只能有一个 |
| **导入语法** | 必须使用 `{}` | 不使用 `{}` |
| **导入名称** | 必须与导出名称一致 | 可以任意命名 |

### export (命名导出)

```javascript
// math.js
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}

// 或者先定义后导出
const subtract = (a, b) => a - b;
export { subtract };
```

```javascript
// app.js
import { PI, add, subtract } from './math.js';
// 导入时重命名
import { add as sum } from './math.js';
```

### export default (默认导出)

```javascript
// user.js
export default function getUser(id) {
  return { id, name: 'John' };
}

// 或者
export default class User {
  constructor(name) {
    this.name = name;
  }
}
```

```javascript
// app.js
import getUser from './user.js';  // 可以任意命名
import UserService from './user.js';  // 也可以这样
```

### 混合使用

```javascript
// utils.js
export const API_URL = 'https://api.example.com';
export function formatDate(date) {
  return date.toISOString();
}
export default class Utils {
  static formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
  }
}
```

```javascript
// app.js
// 默认导出在前，命名导出在后
import Utils, { API_URL, formatDate } from './utils.js';
```

### 注意事项

1. **导入语法不能混用**：
```javascript
// math.js
export const add = (a, b) => a + b;
export default function multiply(a, b) {
  return a * b;
}

// ✅ 正确
import { add } from './math.js';        // 命名导出用 {}
import multiply from './math.js';      // 默认导出不用 {}
import multiply, { add } from './math.js';  // 混合导入

// ❌ 错误
import add from './math.js';           // add 是 undefined
import { multiply } from './math.js';  // multiply 是 undefined
```

2. **命名导出是活的绑定**：
```javascript
// counter.js
export let count = 0;
export function increment() {
  count++;
}

// app.js
import { count, increment } from './counter.js';
console.log(count);  // 0
increment();
console.log(count);  // 1，会同步更新
```

### 选择建议

- **使用 `export`**：导出多个值、工具函数、常量（Tree Shaking 友好）
- **使用 `export default`**：导出主要功能、类、组件（类似 `module.exports = ...`）
- **混合使用**：主要功能用默认导出，辅助功能用命名导出

## 完整示例对比

### CommonJS 示例

```javascript
// utils.js
function formatDate(date) {
  return date.toISOString();
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

module.exports = {
  formatDate,
  formatCurrency
};

// main.js
const { formatDate, formatCurrency } = require('./utils');

const today = new Date();
console.log(formatDate(today));
console.log(formatCurrency(100));
```

### ECMAScript Modules 示例

```javascript
// utils.js
export function formatDate(date) {
  return date.toISOString();
}

export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// main.js
import { formatDate, formatCurrency } from './utils.js';

const today = new Date();
console.log(formatDate(today));
console.log(formatCurrency(100));
```

## 关键差异详解

### 1. 加载机制

**CommonJS** 是同步加载，模块在运行时被加载和执行：

```javascript
// CommonJS - 同步加载
const fs = require('fs');
const data = fs.readFileSync('file.txt'); // 阻塞执行
```

**ESM** 是静态分析，在编译时确定依赖关系：

```javascript
// ESM - 静态分析
import fs from 'fs';
// 依赖关系在编译时就确定了
```

### 2. 循环依赖处理

**CommonJS** 在循环依赖时可能返回未完成初始化的对象：

```javascript
// a.js
const b = require('./b');
module.exports = { value: 'a', b };

// b.js
const a = require('./a');
module.exports = { value: 'b', a }; // a 可能是未完成的对象
```

**ESM** 通过提升（hoisting）更好地处理循环依赖：

```javascript
// a.js
import { b } from './b.js';
export const a = { value: 'a', b };

// b.js
import { a } from './a.js';
export const b = { value: 'b', a }; // 引用是活的绑定
```

### 3. Tree Shaking

**CommonJS** 不支持 Tree Shaking，因为无法静态分析：

```javascript
// utils.js
module.exports = {
  used: () => console.log('used'),
  unused: () => console.log('unused')
};

// main.js
const { used } = require('./utils');
// unused 也会被打包
```

**ESM** 支持 Tree Shaking，未使用的代码会被移除：

```javascript
// utils.js
export const used = () => console.log('used');
export const unused = () => console.log('unused');

// main.js
import { used } from './utils.js';
// unused 会被移除，不会被打包
```

## 在 Node.js 中使用

### 使用 CommonJS（默认）

```javascript
// package.json 不需要特殊配置
// 直接使用 require 和 module.exports
```

### 使用 ESM

```javascript
// package.json
{
  "type": "module"  // 启用 ESM
}

// 或者使用 .mjs 扩展名
// app.mjs
import { add } from './math.mjs';
```

### 混合使用

```javascript
// 在 ESM 中导入 CommonJS
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const commonJSModule = require('./commonjs-module.js');

// 在 CommonJS 中导入 ESM（需要动态导入）
const esmModule = await import('./esm-module.js');
```

## 总结

- **CommonJS** 适合 Node.js 传统项目，同步加载，语法简单
- **ESM** 适合现代前端项目，支持 Tree Shaking，更好的静态分析
- 选择建议：
  - 新项目优先使用 **ESM**
  - 旧项目或 Node.js 库可继续使用 **CommonJS**
  - 浏览器环境必须使用 **ESM**

两种模块系统各有优势，理解它们的差异有助于在不同场景下做出合适的选择。

