
> 保存和复制的值是本身，它们是指向对象的一个指针

```js
  let a = 100
  let b = a
  a = 200
  console.log(b) // 100 保存和复制的是值本身
```

> 引用类型可以扩展属性

```js
  let a = {age:100}
  let b = a
  b.age = 21
  console.log(a.age)  // 21
```