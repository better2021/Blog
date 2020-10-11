### vue 中的 watch 的高级用法

```js
<div>
      <p>FullName: {{fullName}}</p>
      <p>FirstName: <input type="text" v-model="firstName"></p>
</div>

new Vue({
  el: '#root',
  data: {
    firstName: 'Dawei',
    lastName: 'Lou',
    fullName: ''
  },
  watch: {
    firstName(newName, oldName) {
      this.fullName = newName + ' ' + this.lastName;
    }
  }
})
```

> 上面的代码的效果是，当我们输入`firstName`后，`wacth` 监听每次修改变化的新值，然后计算输出 `fullName`

#### handler 方法和 immediate 属性

这里 watch 的一个特点是，最初绑定的时候是不会执行的，要等到 `firstName` 改变时才执行监听计算。那我们想要一开始就让他最初绑定的时候就执行改怎么办呢？我们需要修改一下我们的 watch 写法，修改过后的 watch 代码如下：

```js
watch: {
  firstName: {
    handler(newName, oldName) {
      this.fullName = newName + ' ' + this.lastName;
    },
    // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
    immediate: true
  }
}
```

注意到 `handler` 了吗，我们给 `firstName` 绑定了一个 `handler` 方法，之前我们写的 `watch` 方法其实默认写的就是这个 `handler，Vue`.js 会去处理这个逻辑，最终编译出来其实就是这个 `handler。`
而 `immediate:true` 代表如果在 `wacth` 里声明了 `firstName` 之后，就会立即先去执行里面的 `handler` 方法，如果为 `false` 就跟我们以前的效果一样，不会在绑定的时候就执行

#### deep 属性

`watch` 里面还有一个属性 deep，默认值是 false，代表是否深度监听，比如我们 data 里有一个 obj 属性：

```js
<div>
      <p>obj.a: {{obj.a}}</p>
      <p>obj.a: <input type="text" v-model="obj.a"></p>
</div>

new Vue({
  el: '#root',
  data: {
    obj: {
      a: 123
    }
  },
  watch: {
    obj: {
      handler(newName, oldName) {
         console.log('obj.a changed');
      },
      immediate: true
    }
  }
})

```

当我们在在输入框中输入数据视图改变 `obj.a` 的值时，我们发现是无效的。受现代 `JavaScript` 的限制 (以及废弃 `Object.observe`)，Vue 不能检测到对象属性的添加或删除。由于 Vue 会在初始化实例时对属性执行 `getter/setter` 转化过程，所以属性必须在 `data` 对象上存在才能让 Vue 转换它，这样才能让它是响应的。

默认情况下 `handler` 只监听 `obj` 这个属性它的引用的变化，我们只有给 `obj` 赋值的时候它才会监听到，比如我们在 mounted 事件钩子函数中对 obj 进行重新赋值：

```js
mounted: {
  this.obj = {
    a: "123"
  }
}
```

这样我们的 `handler` 才会执行，打印`obj.a changed`。

相反，如果我们需要监听 `obj` 里的属性 a 的值呢？这时候 `deep` 属性就派上用场了！

```js
watch:{
  obj:{
    handler(newName,oldName){
      console.log('obj.a changed')
    },
    immediate:true,
    deep:true
  }
}
```

`deep`的意思就是深入观察，监听器会一层层的往下遍历，给对象的所有属性都加上这个监听器，但是这样性能开销就会非常大了，任何修改`obj`里面任何一个属性都会触发这个监听器里的 `handler`。

优化，我们可以是使用字符串形式监听。

```js
watch: {
  'obj.a': {
    handler(newName, oldName) {
      console.log('obj.a changed');
    },
    immediate: true,
    // deep: true
  }
}
```

> 这样 `Vue.js` 才会一层一层解析下去，直到遇到属性 a，然后才给 a 设置监听函数

end