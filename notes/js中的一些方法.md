## findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。否则返回-1。

> Array.findIndex()

```javascript
var array1 = [5, 12, 8, 130, 44]

function findFirstLargeNumber(element) {
  return element > 13
}

console.log(array1.findIndex(findFirstLargeNumber))
```

> vue 中获取随机颜色值

```javascript
 computed: {
    color() {
      return '#' + ((Math.random() * 0xffffff) << 0).toString(16);
    }
  }
```

> 高阶函数累加器 reduce

- total 必需。初始值, 或者计算结束后的返回值。
- currentValue 必需。当前元素
- currentIndex 可选。当前元素的索引
- arr 可选。当前元素所属的数组对象。
- initialValue 可选。传递给函数的初始值

```javascript
array.reduce((total, currentValue, index, array) => {
  return (total += currentValue)
}, initialValue)

let numbers = [65, 44, 12, 4]
numbers.reduce((total, num) => {
  return (total += Number(num))
}, 0)
```

### 获取 url 的？后面的参数

```javascript
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    if (window.location.href.split("?")[1] != undefined) {
      var r = window.location.href.split("?")[1].match(reg);
      if (r == undefined && window.location.href.split("?").length > 2) {
        r = window.location.href.split("?")[2].match(reg);
      }
      if (r != null) return decodeURI(r[2]);
      return null;
    }
  },
```

### 数组去重

```javascript
// es5的方法
Array.prototype.unique = function() {
  for (var i = 0; i < this.length; i++) {
    for (var j = i + 1; j < this.length; j++) {
      if (this[i] == this[j]) {
        this.splice(j, 1)
      }
    }
  }
  return this
}

// es6的方法
let arr = [2, 3, 6, 2, 5, 6]
Array.from(new Set(arr)) //[2, 3, 6, 5]
```

### 获取数组中的最大值与最小值

```js
// 获取数组中的最大值与最小值
let arr = [2, 3, 9, 6, 5]

undefined
// 获取最大值
Math.max.apply(Math, arr) //9

// 获取最小值
Math.min.apply(Math, arr) //2
```

### 深拷贝

```js
const deepCopy = source => {
  if (!source || typeof source !== "object") {
    throw new Error("error arguments", "shallowClone")
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (let keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === "object") {
        targetObj[keys] = deepCopy(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}
```

### 函数防抖

```js
function debounce(fn, delay) {
  let timer = null
  return function() {
    let context = this
    let args = arguments
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(function() {
      fn.apply(context, args)
    }, delay)
  }
}

let fn = function() {
  console.log("boom")
}

setInterval(debounce(fn, 500), 1000) // 第一次在1500ms后触发，之后每1000ms触发一次
setInterval(debounce(fn, 2000), 1000) // 不会触发一次（我把函数防抖看出技能读条，如果读条没完成就用技能，便会失败而且重新读条）
```

### 函数节流

```js
// 时间戳方式
let throttle = (fn, delayTime) = >{
	let _start = Date.now();
	return
	function() {
		let _now = Date.now(),
		context = this,
		args = arguments;
		if (_now - _start >= delayTime) {
			fn.apply(context, args);
			_start = Date.now();
		}
	}
}

// 定时器方式
let throttle = function(fn, delayTime) {
	let flag;
	return
	function() {
		let context = this,
		args = arguments;
		if (!flag) {
			flag = setTimeout(function() {
				fn.apply(context, args);
				flag = false;
			},
			delayTime);
		}
	}
}
```

### 随机数范围

```js
function randNum(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min))
}
randNum(0, 10) // 生成0-10的随机数
```

### 金额转换为千分位

```js
function replaceMoney(str) {
  return String(str).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,")
}
replaceMoney(1236.36) //"1,236.36"
```

### 判断函数中的类型

```js
function typeFn(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}

let a = "add"
typeFn(a) // String
```

### 用 promise 实现 sleep 函数

```js
function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

const t1 = +new Date()
sleep(3000).then(() => {
  const t2 = +new Date()
  console.log(t2 - t1)
})
```

### `rem` 布局不再使用 `JavaScript` 设置

需求

> 有时候，移动端用 `rem` 布局时候，根据不同的屏幕宽度要设置不同的 `font-size` 来做到适配，要写一坨 `JS` 来设置，能不能不用`JS`呢？
> 例如：以 `750px` 设计稿作为基准，根节点设置 `font-size` 为 `100px` ,只考虑 `DPR` 为 2 的情况，只考虑最简单的情况

```js
document.querySelector("html").style.fontSize = `${window.innerWidth / 7.5}px`
```

代码

> 现在移动端 `css3` 单位 `vw` ,`vh` 兼容性已经很不错了，在不需要兼容太低版本的安卓机情况下可以这样来：

```js
html{
  font-size: calc(100vw  /  7.5)
}
```

> 就这么简单的设置，`rem` 就可以使用了

### 利用 transparent 属性实现各种三角形，提示框
```js
<div id="triangle-right"></div>
#triangle-right {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-top: 100px solid red;
    border-right: 50px solid transparent;
    border-radius:10px;
}
```
![三角形](https://i.loli.net/2019/06/15/5d04b27a2245010916.png)

### axios 中的请求

> `GET`请求传参用`params`
> 其他(POST，PUT 等)请求用`data`

### fetch 中的请求

> `GET`请求用`qyery`
> 其他请求(POST，PUT,DETELE 等) 请求用`body`

### 检测一次打开网站的运行时间

> performance.now() //单位是毫秒，表示距离网页加载的时间

### 1.Github 页面修改仓库信息

> 跑到自己的仓库那,找到 Setting 的 tag, 点进去后 Options 的 Settings 就可以设定 Repository name.

### 2.修改本地仓库信息

因为远程的仓库名改了, 本地的对应仓库名也要改. 这里假设远程仓库本地命名为 origin.

> git remote -v

### 列出所有远程仓库信息, 包括网址.

> git remote set-url origin git@github.com:username/newrepo.git
> git push -u origin master -f //github 上的版本里有 readme 文件和本地版本冲突解决

### url 的转义与还原

> encodeURI 方法的参数是一个字符串，代表整个 URL。它会将元字符和语义字符之外的字符，都进行转义。encodeURIComponent 只转除了语义字符之外的字符，元字符也会被转义。因此，它的参数通常是 URL 的路径或参数值，而不是整个 URL。
> decodeURI 用于还原转义后的 URL。它是 encodeURI 方法的逆运算。decodeURIComponent 用于还原转义后的 URL 片段。它是 encodeURIComponent 方法的逆运算。

### 解除 chrome 浏览器的跨域限制

> chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security

### css 的毛玻璃效果

**_background-attachment: fixed;
filter: bulr()
实现毛玻璃效果_**

### 在谷歌瀏覽器中的 console 中輸入以下代碼即可編輯頁面

document.body.contentEditable = 'true'

### 在浏览器中打开 word，ppt,pdf 等文档

https://view.officeapps.live.com/op/view.aspx?src=https://res.wxsrtgg.com/2019_04_05_16_31_05_462/e42bf29e-23f0-4700-b34d-b860b0a21c27.%E8%AF%B7%E5%81%87%E5%8D%95%E6%A8%A1%E6%9D%BF.xlsx

> `https://view.officeapps.live.com/op/view.aspx?src=`后面加文件的绝对地址就可以在浏览器中预览文档了

### 两种方法实现查找数组中的最大值和最小值
```js
let arr = [12,35,16,9,90,54]
Math.max(...arr) // 90
Math.min(...arr) // 9
Math.max.apply(null,arr) // 90
Math.min.apply(null,arr) // 9
```
