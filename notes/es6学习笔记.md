### Promise 对象是一个构造函数，用来生成 Promise 实例

```js
const promise = new Promise(function(resolve,reject){
  //    ...some code 此处可以写异步接口请求
  if(/*异步操作成功*/){
    resolve(value)
  }else{
    reject(error)
  }
})
```

> Promise 实例生成以后，可以用 then 方法分别指定 resolved 状态和 rejected> 状态的回调函数

```js
promise.then(
  function(value) {
    // 成功后的操作
  },
  function(error) {
    // 失败后的操作
  }
);
```

> hen 方法可以接受两个回调函数作为参数。第一个回调函数是 Promise 对象的状态变为 resolved 时调用，第二个回调函数是 Promise 对象的状态变为 rejected 时调用。其中，第二个函数是可选的，不一定要提供

```js
// 列子，延时触发函数
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

//延时函数调用
timeout(100).then(value => {
  console.log(value);
});
```

> Promise 新建后就会立即执行

```js
let promise = new Promise((resolve, reject) => {
  console.log('promise');
  resolve();
});

promise.then(function() {
  console.log('resolved');
});

console.log('hello');

// Promise
// Hi!
// resolved
```

```js
// 异步加载图片
fuction loadImage(url){
  return new Promise(fuction(resolve,reject){
    const image = new Image()
    image.onload = function(){
      resolve(image)
    }

    image.onerror = function(){
      reject(new Error('can not load image at' + url))
    }

    image.src = url
  })
}
```

> 如果调用 resolve 函数和 reject 函数时带有参数，那么它们的参数会被传递给回调函数。reject 函数的参数通常是 Error 对象的实例，表示抛出的错误；resolve 函数的参数除了正常的值以外，还可能是另一个 Promise 实例

> resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。

**Promise.all 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。**

```js
const p = Promise.all([p1, p2, p3]);
p.then(result => {
  cosnole.log(result);
}).catch(err => {
  console.log(err);
});
```

### async 函数是什么？一句话，它就是 Generator 函数的语法糖。

```js
const readFile = function(fileName) {
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

const gen = function*() {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

const asyncReadFile = async function() {
  const f1 = await readFile('/etc/fsa');
  const f2 = await readfile('/etc/fsb');
  console.log(f1.toString(), f1.toString());
};
```

> 一比较就会发现，`async` 函数就是将 Generator 函数的星号（\*）替换成 async，将 `yield` 替换成 `await`，仅此而已。

- 内置执行器
  Generator 函数的执行必须靠执行器，所以才有了 co 模块，而 async 函数自带执行器。也就是说，async 函数的执行，与普通函数一模一样，只要一行。

- 更好的语义
  `async`和`await`，比起 `星号`和`yield`，语义更清楚了。`async` 表示函数里有异步操作，`await` 表示紧跟在后面的表达式需要等待结果。

- 更广的适用性
  co 模块约定，`yield` 命令后面只能是 `Thunk` 函数或 `Promise`对象，而 `async` 函数的 `await` 命令后面，可以是 `Promise` 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 `resolved` 的 `Promise` 对象）

- 返回值是 Promise
  `async`函数的返回值是 `Promise` 对象，这比 `Generator` 函数的返回值是 `Iterator` 对象方便多了。你可以用`then`方法指定下一步的操作。

进一步说，`async`函数完全可以看作多个异步操作，包装成的一个 `Promise` 对象，而`await`命令就是内部`then`命令的语法糖。

> `async`函数返回一个 `Promise` 对象，可以使用`then`方法添加回调函数。当函数执行的时候，一旦遇到`await`就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

```js
async function getStockPriceByName(name) {
  const symbol = await getStockSymbol(name);
  const stockPrice = await getStockPrice(symbol);
  return stockPrice;
}

getStockPriceByName('goog').then(function(result) {
  console.log(result);
});
```

_上面代码是一个获取股票报价的函数，函数前面的 async 关键字，表明该函数内部有异步操作。调用该函数时，会立即返回一个 Promise 对象。_

> async 函数有多种使用形式。

```js
// 函数声明
async function foo(){}

// 函数表达式
const foo = async function(){}

// 对象的方法
let obj = {async foo(){}}
obj.foo().then(/*...*/)

// class 的方法
class Storge(){
  constructor(){
    this.cachePromise = caches.open('avatars')
  }

  async getName(name){
    const res = await this.cachePromise
    return res.match(`/avatars/${name}.jpg`)
  }
}

const storge = new Storge()
storge.getAvatar('jake').then(/*...*/)

// 箭头函数
const foo = async ()=>{}
```

> `async`函数内部`return`语句返回的值，会成为`then`方法回调函数的参数。

```js
async function f() {
  return 'hello';
}

f().then(res => {
  console.log(res); //'hello'
});
```

_上面代码中，函数 f 内部 return 命令返回的值，会被 then 方法回调函数接收到。_

> `async`函数返回的 `Promise` 对象，必须等到内部所有`await`命令后面的 `Promise` 对象执行完，才会发生状态改变，除非遇到`return`语句或者抛出错误。也就是说，只有`async`函数内部的异步操作执行完，才会执行`then`方法指定的回调函数。

> 正常情况下，await 命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。

```js
async function f() {
  // 等同于
  // return 123;
  return await 123;
}

f().then(v => console.log(v)); //123;
```

> await 命令后面的 Promise 对象如果变为 reject 状态，则 reject 的参数会被 catch 方法的回调函数接收到。

```js
async function f() {
  await Promise.reject('出错了');
}

f()
  .then(v => console.log(v))
  .catch(e => console.log(e)); // 出错了
```

> 任何一个 await 语句后面的 Promise 对象变为 reject 状态，那么整个 async 函数都会中断执行

```js
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}
```

_上面代码中，第二个 await 语句是不会执行的，因为第一个 await 语句状态变成了 reject。_

有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个 await 放在 try...catch 结构里面，这样不管这个异步操作是否成功，第二个 await 都会执行。

```js
async function f() {
  try {
    await Promise.reject('出错了');
  } catch (e) {}
  return await Promise.resolve('hello world');
}

f().then(v => console.log(v));
// hello world
```

> getFoo 和 getBar 是两个独立的异步操作（即互不依赖），被写成继发关系。这样比较耗时，因为只有 getFoo 完成以后，才会执行 getBar，完全可以让它们同时触发。

```js
let foo = await getFoo();
let bar = await getBar();
let [foo, bar] = await Promise.all([getFoo(), getBar()]);
```

_上面两种写法，getFoo 和 getBar 都是同时触发，这样就会缩短程序的执行时间。_

```js
// async 函数的写法
const start = async () => {
  const res = await fetch('google.com');
  return res.text();
};

start().then(console.log);
```

**async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里**

```js
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function*() {
    // ...
  });
}
```

_可以看到 Async 函数的实现最简洁，最符合语义，几乎没有语义不相关的代码。它将 Generator 写法中的自动执行器，改在语言层面提供，不暴露给用户，因此代码量最少。如果使用 Generator 写法，自动执行器需要用户自己提供。_

> ES5 的 JavaScript 语言中，生成实例对象的传统方法是通过构造函数

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function() {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);
```

> 基本上，ES6 的 class 可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。上面的代码用 ES6 的 class 改写，就是下面这样。

```js
class Point {
  constructor() {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

_Point 类除了构造方法，还定义了一个 toString 方法。注意，定义“类”的方法的时候，前面不需要加上 function 这个关键字，直接把函数定义放进去了就可以了。另外，方法之间不需要逗号分隔，加了会报错。_

> 使用的时候，也是直接对类使用 new 命令，跟构造函数的用法完全一致。

```js
class Bar {
  doSomeThing() {
    console.log('hello');
  }
}
let b = new Bar();
b.doSomeThing(); //hello
```

```js
/*es6的类*/
class Point(){
  constructor(){
    //...
  }

  toString(){/*...*/}
  toValue(){/*...*/}

  //等同于
  Point.prototype = {
    constructor(){},
    toStrong(){},
    toValue()
  }
}

```

> 由于类的方法都定义在 prototype 对象上面，所以类的新方法可以添加在 prototype 对象上面。Object.assign 方法可以很方便地一次向类添加多个方法。

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

Object.assign(Point.prototype, {
  toString() {},
  toValue() {}
});
```

```js
var Point = function(x, y) {
  //...
};

point.prototype.toString = function() {
  /*...*/
};
Object.keys(Point.prototype); //['toString']
```

**`constructor` 方法是类的默认方法，通过 `new` 命令生成对象实例时，自动调用该方法。`一个类必须有 constructor 方法`，如果没有显式定义，一个空的 `constructor 方法会被默认添加`**

> 与函数一样，类也可以使用表达式的形式定义。

```js
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};

let inst = new MyClass();
inst.getClassName(); // Me
Me.name; // ReferenceError: Me is not defined
```

_上面代码表示，Me 只在 Class 内部有定义。
如果类的内部没用到的话，可以省略 Me，也就是可以写成下面的形式。_

```js
const MyClass = class {
  /*...*/
};
```

> 采用 `Class` 表达式，可以写出立即执行的 Class。

```js
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('小明');

person.sayName(); //小明
```

> 类不存在变量提升（hoist），这一点与 ES5 完全不同。

```js
new Foo(); // ReferenceError
class Foo {}
```

_上面代码中，Foo 类使用在前，定义在后，这样会报错，因为 ES6 不会把类的声明提升到代码头部。这种规定的原因与下文要提到的继承有关，必须保证子类在父类之后定义_

> 父类的静态方法，可以被子类继承。

```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ',too';
  }
}

Bar.classMethod(); // hello,too
```

> 使用 Array.from 方法，将类似数组的对象转为数组。

```js
const foo = document.querySelectorAll('.foo');
const nodes = Array.from(foo);
```

> 立即执行函数可以写成箭头函数的形式。

```js
(() => {
  cosnole.log('hello');
})();
```

```js
// good
[1, 2, 3].map(x => {
  return x * x;
});

// best
[1, 2, 3].map(x => x * x);
```

**首先，Module 语法是 JavaScript 模块的标准写法，坚持使用这种写法。使用 import 取代 require。**

```js
// bad
const moduleA = require('moduleA');
const func1 = moduleA.func1;
const func2 = moduleA.func2;

// good
import { func1, func2 } from 'moduleA';
```

> `__proto__`属性（前后各两个下划线），用来读取或设置当前对象的`prototype`对象。目前，所有浏览器（包括 IE11）都部署了这个属性。

```js
// es5写法
var obj = {
  method: function() {
    /*...*/
  }
};
obj._proto_ = someobj;

//es6的写法
const obj = Object.create(someobj);
obj.method = function() {
  /*...*/
};
```

> ES2017 引入了跟`Object.keys`配套的`Object.values`和`Object.entries`，作为遍历一个对象的补充手段，供`for...of`循环使用。

```js
let { keys, values, entries } = Object;
let obj = { a: 1, b: 2, c: 3 };

for (let key of keys(obj)) {
  console.log(key); // 'a', 'b', 'c'
}

for (let value of values(obj)) {
  console.log(value); // 1, 2, 3
}

for (let [key, value] of entries(obj)) {
  console.log([key, value]); // ['a', 1], ['b', 2], ['c', 3]
}
```

### 数组的解构
```js
// bad
const spliteLocale = locale.splite("-");
const language = spliteLocale[0];
const country = spliteLocale[1];

// good
const [language, country] = locale.splite('-');
```