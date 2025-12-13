---
title: React 快速入手
date: 2025-05-20
updated: 2025-05-20
categories: 前端开发
tags:
  - React
  - 前端
  - JavaScript
  - 框架
top: 1
---

## React 知识体系

```
React
│
├── Class Components (类组件)
│   ├── this.setState({ count: 2 })
│   └── 生命周期
│       ├── constructor
│       ├── render
│       ├── componentDidMount
│       ├── componentDidUpdate
│       ├── componentWillUnmount
│       └── componentDidCatch
│
├── Function Components (函数组件)
│   ├── const [count, setCount] = useState(0)
│   ├── Hooks
│   │   ├── useState
│   │   ├── useEffect
│   │   ├── useMemo(factory, deps)
│   │   └── useCallback(callback, deps) == useMemo(()=>callback, deps)
│   ├── Hooks 模拟生命周期
│   │   ├── useEffect(..., []) 挂载
│   │   ├── useEffect(..., [deps]) 更新
│   │   └── useEffect return 函数, 销毁
│   ├── ErrorBoundary (捕捉错误)
│   └── React.memo(<Child/>) (高阶组件, props 不变化时子组件不渲染)
│
└── 组件通信
    ├── 父传子: Props
    ├── 子传父: 回调函数
    ├── 父调用子方法: forwardRef + useImperativeHandle
    ├── 跨层: context (不推荐), redux
    └── 事件总线: envBus
```

## Class Components (类组件)

### 基本用法

```javascript
import React, { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleClick}>+1</button>
      </div>
    );
  }
}
```

### 生命周期方法

```javascript
class MyComponent extends Component {
  constructor(props) {
    super(props);
    // 初始化
  }

  componentDidMount() {
    // 组件挂载后执行（类似 useEffect(..., [])）
    console.log('组件已挂载');
  }

  componentDidUpdate(prevProps, prevState) {
    // 组件更新后执行（类似 useEffect(..., [deps])）
    console.log('组件已更新');
  }

  componentWillUnmount() {
    // 组件卸载前执行（类似 useEffect return 函数）
    console.log('组件即将卸载');
  }

  componentDidCatch(error, info) {
    // 捕获子组件错误
    console.log('捕获到错误:', error);
  }

  render() {
    return <div>My Component</div>;
  }
}
```

## Function Components (函数组件)

### 基本用法

```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

### Hooks

#### useState

```javascript
const [state, setState] = useState(initialValue);

// 示例
const [name, setName] = useState('');
const [age, setAge] = useState(0);
```

#### useEffect

```javascript
// 挂载时执行（类似 componentDidMount）
useEffect(() => {
  console.log('组件挂载');
}, []); // 空依赖数组

// 依赖更新时执行（类似 componentDidUpdate）
useEffect(() => {
  console.log('count 变化了');
}, [count]); // 依赖 count

// 卸载时清理（类似 componentWillUnmount）
useEffect(() => {
  const timer = setInterval(() => {
    console.log('定时器');
  }, 1000);
  
  return () => {
    clearInterval(timer); // 清理函数
  };
}, []);
```

#### useMemo

```javascript
// 缓存计算结果，只有依赖变化时才重新计算
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]); // 依赖 a 和 b
```

#### useCallback

```javascript
// 缓存函数，只有依赖变化时才重新创建
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// useCallback 等价于
const memoizedCallback = useMemo(() => {
  return () => doSomething(a, b);
}, [a, b]);
```

### Hooks 模拟生命周期

```javascript
function MyComponent() {
  // 模拟 componentDidMount
  useEffect(() => {
    console.log('挂载');
  }, []);

  // 模拟 componentDidUpdate
  useEffect(() => {
    console.log('更新');
  }, [deps]); // 依赖变化时触发

  // 模拟 componentWillUnmount
  useEffect(() => {
    return () => {
      console.log('卸载');
    };
  }, []);

  return <div>My Component</div>;
}
```

### React.memo

```javascript
// 子组件：props 不变化时不重新渲染
const Child = React.memo(({ name }) => {
  console.log('Child 渲染');
  return <div>{name}</div>;
});

// 父组件
function Parent() {
  const [count, setCount] = useState(0);
  const name = 'John'; // 不变的值

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child name={name} /> {/* name 不变，Child 不会重新渲染 */}
    </div>
  );
}
```

### ErrorBoundary

```javascript
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>出错了！</h1>;
    }
    return this.props.children;
  }
}

// 使用
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

## 组件通信

### 父传子：Props

```javascript
// 父组件
function Parent() {
  const message = 'Hello';
  return <Child message={message} />;
}

// 子组件
function Child({ message }) {
  return <div>{message}</div>;
}
```

### 子传父：回调函数

```javascript
// 父组件
function Parent() {
  const handleChildClick = (data) => {
    console.log('收到子组件数据:', data);
  };
  return <Child onClick={handleChildClick} />;
}

// 子组件
function Child({ onClick }) {
  return <button onClick={() => onClick('子组件数据')}>点击</button>;
}
```

### 父调用子方法：forwardRef + useImperativeHandle

```javascript
// 子组件
const Child = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    doSomething: () => {
      console.log('子组件方法被调用');
    }
  }));

  return <div>Child</div>;
});

// 父组件
function Parent() {
  const childRef = useRef();

  const handleClick = () => {
    childRef.current.doSomething(); // 调用子组件方法
  };

  return (
    <div>
      <button onClick={handleClick}>调用子方法</button>
      <Child ref={childRef} />
    </div>
  );
}
```

### 跨层通信：Context

```javascript
// 创建 Context
const MyContext = createContext();

// 提供者
function App() {
  const value = '共享数据';
  return (
    <MyContext.Provider value={value}>
      <Child />
    </MyContext.Provider>
  );
}

// 消费者
function Child() {
  const value = useContext(MyContext);
  return <div>{value}</div>;
}
```

### 事件总线：envBus

```javascript
// 安装: npm install env-bus

import envBus from 'env-bus';

// 发送事件
function ComponentA() {
  const handleClick = () => {
    envBus.emit('custom-event', { data: '消息内容' });
  };
  return <button onClick={handleClick}>发送事件</button>;
}

// 监听事件
function ComponentB() {
  useEffect(() => {
    const handler = (data) => {
      console.log('收到事件:', data);
    };
    
    envBus.on('custom-event', handler);
    
    // 清理监听
    return () => {
      envBus.off('custom-event', handler);
    };
  }, []);

  return <div>Component B</div>;
}

// 一次性监听
envBus.once('custom-event', (data) => {
  console.log('只触发一次:', data);
});

// 移除所有监听
envBus.off('custom-event');
```

### 状态管理：Redux

```javascript
// 安装: npm install redux react-redux

// 1. 创建 Reducer
const initialState = { count: 0 };

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// 2. 创建 Store
import { createStore } from 'redux';
const store = createStore(counterReducer);

// 3. 在组件中使用
import { useSelector, useDispatch } from 'react-redux';

function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
  );
}

// 4. 在 App 中提供 Store
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
```

## 完整示例

### Class Component 示例

```javascript
class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      input: ''
    };
  }

  componentDidMount() {
    console.log('组件挂载');
  }

  handleAdd = () => {
    this.setState({
      todos: [...this.state.todos, this.state.input],
      input: ''
    });
  }

  render() {
    return (
      <div>
        <input
          value={this.state.input}
          onChange={(e) => this.setState({ input: e.target.value })}
        />
        <button onClick={this.handleAdd}>添加</button>
        <ul>
          {this.state.todos.map((todo, i) => (
            <li key={i}>{todo}</li>
          ))}
        </ul>
      </div>
    );
  }
}
```

### Function Component 示例

```javascript
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    console.log('组件挂载');
  }, []);

  const handleAdd = () => {
    setTodos([...todos, input]);
    setInput('');
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleAdd}>添加</button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 总结

- **Class Components**：使用 `this.setState` 管理状态，通过生命周期方法处理副作用
- **Function Components**：使用 Hooks（`useState`, `useEffect` 等）管理状态和副作用
- **组件通信**：
  - 父传子：Props
  - 子传父：回调函数
  - 父调用子：`forwardRef` + `useImperativeHandle`
  - 跨层：Context 或 Redux
  - 事件总线：envBus（任意组件间通信）
  - 状态管理：Redux（全局状态管理）
- **性能优化**：使用 `React.memo`、`useMemo`、`useCallback` 避免不必要的渲染

现代 React 开发推荐使用 **Function Components + Hooks**，代码更简洁，逻辑更清晰。

