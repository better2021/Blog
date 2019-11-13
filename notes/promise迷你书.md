### promise

> Promise 类似于 XMLHttpRequest，从构造函数 Promise 来创建一个新建新 promise 对象作为接口。
> 要想创建一个 promise 对象、可以使用 new 来调用 Promise 的构造器来进行实例化

对通过 `new` 生成的 `promise` 对象为了设置其值在 `resolve(成功)` / `reject(失败)`时调用的回调函数 可以使用 `promise.then()` 实例方法

```js
var promise = new Promise((resolve, reject) => {
  // 异步处理
  // 处理结束后，调用resolve 或 reject
});

promise.then(onFulfilled, onRejected);

// 例子
var promise = new Promise(function(resolve) {
  resolve(42);
});

promise
  .then(function(value) {
    console.log(value); // 42
  })
  .catch(function(err) {
    console.log(err);
  });

function asyncFunction() {
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
      resolve("hello");
    }, 1000);
  });
}

asyncFunction()
  .then(value => {
    console.log(value); // hello
  })
  .catch(err => {
    console.log(err);
  });

  // 创建XHR的promise对象
  function getUrl(url){
    return new Promise((resolve,reject)=>{
      let req = new XMLHttpRequest()
      req.open("GET",url,true)
      req.onload = function(){
        if(req.status===200){
          resolve(req.responseText)
        }else{
          reject(new Error(req.statusText))
        }
      }

      req.onerror = fuction(){
        reject(new Error(req.statusText))
      }

      req.send()
    })
  }

  // 调用getURl()
  var url = "http://httpbin.org/get";
  getUrl(url).then((value)=>{
    console.log(value)
  }).catch((error)=>{
    console.log(error)
  })
```

#### 为 promise 对象添加处理方法主要有以下两种

- promise 对象被 resolve 时的处理(onFulfilled)
- promise 对象被 reject 时的处理(onRejected)
  ![](http://liubin.org/promises-book/Ch1_WhatsPromises/img/promise-onFulfilled_onRejected.png)

`Promise.resolve` 方法另一个作用就是将 `thenable` 对象转换为`promise`对象。
jQuery.ajax()的返回值是一个具有 .then 方法的 jqXHR Object 对象，这个对象继承了来自 Deferred Object 的方法和属性。

```js
var promise = Promise.resolve($.ajax("/json/comment.json"));
promise.then(value => {
  console.log(value);
});
```

`Promise.reject(error)`是和 `Promise.resolve(value)` 类似的静态方法，是 `new Promise()` 方法的快捷方式。

```js
Promise.reject(new Error("boom!")).catch(err => {
  console.log(err);
});
```

为了应对这种需要对多个异步调用进行统一处理的场景，`Promise` 准备了 `Promise.all` 和 `Promise.race` 这两个静态方法

> Promise.all 接收一个 promise 对象的数组作为参数，当这个数组里的所有 promise 对象全部变为 resolve 或 reject 状态的时候，它才会去调用 .then 方法,之前例子中的 getURL 返回了一个 promise 对象，它封装了 XHR 通信的实现。 向 Promise.all 传递一个由封装了 XHR 通信的 promise 对象数组的话，则只有在全部的 XHR 通信完成之后（变为 FulFilled 或 Rejected 状态）之后，才会调用 .then 方法。

```js
function getURL(URL) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open("GET", URL, true);
    req.onload = function() {
      if (req.status === 200) {
        resolve(req.responseText);
      } else {
        reject(new Error(req.statusText));
      }
    };
    req.onerror = function() {
      reject(new Error(req.statusText));
    };
    req.send();
  });
}

var request = {
  comment: function getComment() {
    return getURL("http://azu.github.io/promises-book/json/comment.json").then(
      JSON.parse
    );
  },
  people: function getPeople() {
    return getURL("http://azu.github.io/promises-book/json/people.json").then(
      JSON.parse
    );
  }
};

function main() {
  return Promise.all([request.comment(), request.people()]);
}
// 运行示例
main()
  .then(function(value) {
    console.log(value);
  })
  .catch(function(error) {
    console.log(error);
  });

/*
`delay`毫秒后执行resolve
*/
function timerPromisefy(delay) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(delay);
    }, delay);
  });
}
var startDate = Date.now();
// 所有promise变为resolve后程序退出
Promise.all([
  timerPromisefy(1),
  timerPromisefy(32),
  timerPromisefy(64),
  timerPromisefy(128)
]).then(function(values) {
  console.log(Date.now() - startDate + "ms");
  // 約128ms
  console.log(values); // [1,32,64,128]
});
```

接着我们来看看和 `Promise.all` 类似的对多个`promise`对象进行处理的 `Promise.race` 方法
它的使用方法和 Promise.all 一样，接收一个 promise 对象数组为参数

> Promise.all 在接收到的所有的对象 promise 都变为 FulFilled 或者 Rejected 状态之后才会继续进行后面的处理， 与之相对的是 **_Promise.race 只要有一个 promise 对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理_**

```js
// delay 毫秒后执行resolve
function timerPromise(delay) {
  return new Promise(resovle => {
    setTimeout(() => {
      resolve(delay);
    }, delay);
  });
}

// 任何一个promise变为resolve或reject的话程序就停止运行
Promise.race([
  timerPromise(1)
  timerPromise(32)
  timerPromise(64)
]).then((value)=>{
  console.log(value) // 1
})

/*
Promise.race()
*/

var winnerPromise = new Promise(function (resolve) {
        setTimeout(function () {
            console.log('this is winner');
            resolve('this is winner');
        }, 4);
    });
var loserPromise = new Promise(function (resolve) {
        setTimeout(function () {
            console.log('this is loser');
            resolve('this is loser');
        }, 1000);
    });
// 第一个promise变为resolve后程序停止
Promise.race([winnerPromise, loserPromise]).then(function (value) {
    console.log(value);    // => 'this is winner'
});
```
