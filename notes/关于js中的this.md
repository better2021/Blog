### 关于 js 中的 this

> **在 es5 中，永远是 this 永远指向最后调用它的那个对象**

```js
var name = 'windowsName';
function a() {
  var name = 'Cherry';

  console.log(this.name); // windowsName

  console.log('inner:' + this); // inner: windowsName
}
a();
console.log('outer:' + this); // outer: windowsName

var name = 'windowsName';
var a = {
  name: 'Cherry',
  fn: function() {
    console.log(this.name); // Cherry
  }
};
a.fn();

var name = 'windowsName';
var a = {
  name: 'Cherry',
  fn: function() {
    console.log(this.name); // Cherry
  }
};
window.a.fn();

//这里打印 Cherry 的原因也是因为刚刚那句话“this 永远指向最后调用它的那个对象”，最后调用它的对象仍然是对象 a。

var name = 'windowsName';
var a = {
  name: null,
  // name: "Cherry",
  fn: function() {
    console.log(this.name); // windowsName
  }
};

var f = a.fn;
f();
```

### 改变 this 指向的方法

- 使用 ES6 的箭头函数
- 在函数内部使用 \_this = this
- 使用 apply、call、bind
- new 实例化一个对象

> **箭头函数的 this 始终指向函数定义时的 this，而非执行时。，箭头函数需要记着这句话：“箭头函数中没有 this 绑定，必须通过查找作?用域链来决定其值，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 undefined”。**

```js
var name = 'windowsName';

var a = {
  name: 'Cherry',

  func1: function() {
    console.log(this.name);
  },

  func2: function() {
    setTimeout(() => {
      this.func1();
    }, 100);
  }
};

a.func2(); // Cherry

var name = 'windowsName';

var a = {
  name: 'Cherry',

  func1: function() {
    console.log(this.name);
  },

  func2: function() {
    var _this = this;
    setTimeout(function() {
      _this.func1();
    }, 100);
  }
};

a.func2(); // Cherry

// 使用apply
var a = {
  name: 'Cherry',

  func1: function() {
    console.log(this.name);
  },

  func2: function() {
    setTimeout(
      function() {
        this.func1();
      }.apply(a),
      100
    );
  }
};

a.func2(); // Cherry

//使用call
var a = {
  name: 'Cherry',

  func1: function() {
    console.log(this.name);
  },

  func2: function() {
    setTimeout(
      function() {
        this.func1();
      }.call(a),
      100
    );
  }
};

a.func2(); // Cherry

//使用bind
var a = {
  name: 'Cherry',

  func1: function() {
    console.log(this.name);
  },

  func2: function() {
    setTimeout(
      function() {
        this.func1();
      }.bind(a)(),
      100
    );
  }
};

a.func2(); // Cherry
```

### apply 和 call 基本类似，他们的区别只是传入的参数不同。

```js
// call 的语法为：
fun.call(thisArg[, arg1[, arg2[, ...]]])

// apply 的语法为:
fun.apply(thisArg, [argsArray])

var a ={
    name : "Cherry",
    fn : function (a,b) {
        console.log( a + b)
    }
}

var b = a.fn;
b.apply(a,[1,2])     // 3

var a ={
    name : "Cherry",
    fn : function (a,b) {
        console.log( a + b)
    }
}

var b = a.fn;
b.call(a,1,2)       // 3

```

> bind()方法创建一个新的函数, 当被调用时，将其 this 关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。

```js
var a = {
  name: 'Cherry',
  fn: function(a, b) {
    console.log(a + b);
  }
};

var b = a.fn;
b.bind(a, 1, 2)(); // 3
```

> 如果函数调用前使用了 new 关键字, 则是调用了构造函数。这看起来就像创建了新的函数，但实际上 JavaScript 函数是重新创建的对象：

```js
// 构造函数:
function myFunction(arg1, arg2) {
  this.firstName = arg1;
  this.lastName = arg2;
}

// This    creates a new object
var a = new myFunction('Li', 'Cherry');
a.lastName; // 返回 "Cherry"
```

**匿名函数的 this 永远指向 window**

**this 永远指向最后调用它的那个对象**
