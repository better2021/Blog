
### vue滚动行为（浏览器回退记忆位置）用法

解决方法：路由设置  
1.开启vue-router的history模式  
2.设置滚动行为：vue滚动行为文档

```js
const router = new VueRouter({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) { 
        //如果savedPosition存在，滚动条会自动跳转到记录值的地方
        return savedPosition
    } else {
       return { x: 0, y: 0 }//savedPositionxy也是一个记录X轴和Y轴位置的对象
    }
  }
  routes: [...]
})
```

### vue 的css深度作用选择器

使用场景：scope的的样式，希望影响到子组件的默认样式
解决方法：使用深度作用选择器

```css
<style scoped>
.a >>> .b { color:red; }
</style>
/*有些像Sass之类的预处理器无法正确解析>>>。这种情况下可以使用/deep/操作符取代（/deep/是>>>>>的别名，一样可以正常工作）*/
<style scoped lang=“scss”>
.a /deep/ .b {color:red; }
</style>
```

使用场景：默认打开页面，如果没有设置启动页，用户访问时也没有带锚点，则页面会显示为空白。
解决方法：重定向默认页面

```js
export default new Router({
  routes: [
      {
        path: '/', // 默认启动页
        redirect:'/login' //重定向到下方声明的路由
      },
      ......
      {
        path: '*', // 404 页面
        component: () => import('./notFind') // 或者使用component
      },
    ]
}）
```

###css3多行显示省略号

```css
.two-line{
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
```

打包后不显示省略号就加上：
```js
/* autoprefixer: off */
-webkit-box-orient: vertical;
/* autoprefixer: on */
```
就可以完美兼容了


###  判断元素是否在可视区域内
```js
let obj = document.getElementById('product-list');
let clientHeight = window.innerHeight;
let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
let offsetTop = obj.offsetTop;
let objHeight = obj.offsetHeight;
if(offsetTop < scrollTop + clientHeight && offsetTop + objHeight > scrollTop) { //判断是否在可视区域内
  console.log('元素在可视区域')
}
```

### js禁止拷贝等方法
禁止鼠标右键：oncontextmenu="return false"；

禁止选择：onselectstart="return false"；

禁止拖放：ondragstart="return false"；

禁止拷贝：oncopy=document.selection.empty()。

禁止复制：oncopy = "return false"；

禁止保存：<noscript><iframe src="*.htm"></iframe></noscript>，放在head里面。

禁止粘贴：<input type=text onpaste="return false">

禁止剪贴：oncut = "return false"；

关闭输入法：<input style="ime-mode:disabled">

### 图片上传时的格式
图片上传时的格式限制； accept="image/*" //限制只能上传图片格式
---
例子：
···html
<input class="changeHead" type="file" enctype="multipart/form-data" id="drivingLicence"
       name="file" accept="image/*" @change='getFile($event)'/>
```
accept="camera" 只调用相机
