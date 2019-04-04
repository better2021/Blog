
#### onclick与addEventListener区别

- onclick事件在同一时间只能指向唯一对象
- addEventListener给一个事件注册多个listener
- addEventListener对任何DOM都是有效的，而onclick仅限于HTML
- addEventListener可以控制listener的触发阶段，（捕获/冒泡）。对于多个相同的时间处理器，不会重复触发，不需要手动使用removeEventListener清除
- IE9使用attachEvent和detachEvent

onclick添加事件
```js
element.onclick = functionRef
```
> functionRef是一个函数，通常是在别处声明的函数名，或者是一个函数表达式

onclick删除事件
```js
element.onclick = null
```

```js
var d=document.getElementById("btn");
//这个事件会被覆盖不会执行
d.onclick=function(){
  console.log(1);
}
//这个事件正常执行
d.onclick=function(){
  console.log(2);
}
/**/
//这个事件先注册，先执行
d.addEventListener("click",function(){
  console.log(3);
})
//这个事件后注册，后执行
d.addEventListener("click",function(){
  console.log(3);
})
```
- addEventListener第一个参数type是click，load，不带on事件处理程序会在当前对象的作用域进行，因此，事件处理程序的this就是当前对象

> js引擎始终只有一个线程，它维护一个消息队列，当前函数栈执行完后就去不断地取消息队列中的消息（回调），取到了就执行，但是js引擎**只负责取消息，不负责生产消息**
> js运行时，就是负责给js引擎线程发送消息
> 主线程收到通知并且主线程执行完毕后，再执行一定的动作(调用回调函数，settimeout、permise、ajax等)。

> 各种语言在处理堆栈的原理上都是大同小异：**堆是动态分配内存，内存大小不一，也不会自动释放。栈是自动分配相对固定大小的内存空间，并由系统自动释放**
> js的数据类型，它们都是直接按值存储在栈中的，每种类型的数据占用的内存空间的大小是确定的，并由系统自动分配和自动释放。

**栈，线性结构，后进先出，便于管理**
**堆，一个混沌，杂乱无章，方便存储和开辟内存空间。**