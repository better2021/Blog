#### useState

`initialState` 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用：

```js
const [state, setState] = useState(() => {
  const initialState = someComputttion(props);
  return initialState;
});
```

### useEffect

useEffect 的第二个参数，依赖项[props.source]改变时函数就会重新渲染，
第二个参数为[]数组，表示只渲染一次
如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）
`return ()=>{}` 相当于 class 中的 `componentWillUnmount`

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    subscription.unsubscribe();
  };
}, [props.source]);
```

### useContext

接收一个 context 对象（`React.createContext` 的返回值）并返回该 `context` 的当前值。
当前的 `context` 值由上层组件中距离当前组件最近的 <MyContext.Provider> 的 `value prop` 决定。
当组件上层最近的 <MyContext.Provider> 更新时，该 Hook 会触发重渲染，
并使用最新传递给 MyContext provider 的 `context value` 值
别忘记 `useContext` 的参数必须是 `context` 对象本身

```js
const value = useContext(MyContext);
```

useContext(MyContext) 只是让你能够读取 context 的值以及订阅 context 的变化。
你仍然需要在上层组件树中使用 <MyContext.Provider> 来为下层组件提供 `context`

```js
const MyContext = React.createContext(defaultValue);
// defaultValue参数作为默认值，当Provider没有提供value值时，组件则默认使用defaultValue
// 当Provider提供value值时，就会使用提供的value，不会用默认值defaultValue
```

`defaultValue` 参数 仅 当 consumer(使用者) 在树中没有匹配的 `Provider`(提供则) 时使用它。
这有助于在不封装它们的情况下对组件进行测试。
注意：将 undefined 作为 Provider(提供者) 值传递不会导致 consumer(使用者) 组件使用 `defaultValue` 。

```js
const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee'
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222'
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

### useReducer

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

它接收一个形如 `(state, action) => newState` 的 `reducer`，
并返回当前的 `state` 以及与其配套的 `dispatch` 方法

```js
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}
```

### useCallback

```js
const memoCallback = useCallback(() => {
  dosomething(a, b);
}, [a, b]);
```

把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 `memoized` 版本，
**_该回调函数仅在某个依赖项改变时才会更新_**。
当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染
（例如 shouldComponentUpdate）的子组件时，它将非常有用
`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`

### useRef

```js
const refContainer = useRef(initialValue);
```

`useRef` 返回一个可变的 `ref` 对象，其 `.current` 属性被初始化为传入的参数（initialValue）。
返回的 ref 对象在组件的整个生命周期内保持不变

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

你应该熟悉 ref 这一种访问 DOM 的主要方式。如果你将 ref 对象以 <div ref={myRef} />
形式传入组件，则无论该节点如何改变，React 都会将 ref 对象的 .current 属性设置为相应的 DOM 节点

### useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。
这种优化有助于避免在每次渲染时都进行高开销的计算
如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值

#### useImperativeHandle

```js
useImperativeHandle(ref, createHandle, [deps]);
```

useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。
在大多数情况下，应当避免使用 ref 这样的命令式代码。useImperativeHandle 应当与 forwardRef 一起使用

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```
