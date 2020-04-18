###  Proxy

> proxy可以理解成在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

```js
/*proxy的基本用法*/
const obj = {
    name : "小明",
    age : 18
}

const proxy = new Proxy(obj,{
    get(target,propKey,receiver){
        console.log('get:' + propKey)
        return Reflect.get(target,propKey,receiver)
    },
    set(target,propKey,value,receiver){
        console.log('set:'+ propKey)
        return Reflect.set(targrt,propKey,value,receiver)
    }
})

console.log(proxy.name) // get:name 小明
proxy.work = 'frontend' // set:work fronted
```

### Reflect
> `Reflect`对象与`Proxy`对象一样，也是ES6为了操作对象而提出来的新API,更多的应用场景是配合`proxy`一起使用,可以将`Object`对象的一些明显属于语言内部的方法放到`Reflect`对象上，并修改某些`Object`方法的返回结果


### Intersection Observer

> IntersectionObserver提供了一种异步观察目标元素与其祖先元素交叉状态的方法。当一个IntersectionObserver对象被创建时，其被配置为监听根中一段给定比例的可见区域,并且无法更改其配置，所以一个给定的观察者对象只能用来监听可见区域的特定变化值；然而，我们可以在同一个观察者对象中配置监听多个目标元素。

说简单点就是该api可以异步监听目标元素在根元素里的位置变动,并触发响应事件.我们可以利用它来实现更为高效的图片懒加载, 无限滚动以及内容埋点上报等.接下来我们通过一个例子来说明一下它的使用步骤.

```js
// 1.定义观察者及观察回调
const intersectionObserver = new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
        console.log(entry)
        // 一些操作...
    })
},{
    root : document.querySelector("#root"),
    rootMargin:"10px",
    threshold:0.5
})

// 2.定义要观察的目标对象
const targrt = document.querySelector(".targrt")
intersectionObserver.observe(target)
```

- callback IntersectionObserver实例的第一个参数, 当目标元素与根元素通过阈值🍌时就会触发该回调.回调中第一个参数是被观察对象列表,一旦被观察对象发生突变就会被移入该列表, 列表中每一项都保留有观察者的位置信息;第二个参数为observer,观察者本身,其中rootBounds表示根元素的位置信息, boundingClientRect表示目标元素的位置信息,intersectionRect表示叉部分的位置信息, intersectionRatio表示目标元素的可见比例.

- root 所监听对象的具体祖先元素(element)。如果未传入值或值为null，则默认使用顶级文档的视窗。
rootMargin 计算交叉时添加到根(root)边界盒bounding box的矩形偏移量， 可以有效的缩小或扩大根的判定范围从而满足计算需要
thresholds  一个包含阈值的列表, 按升序排列, 列表中的每个阈值都是监听对象的交叉区域与边界区域的比率。当监听对象的任何阈值被越过时，都会生成一个通知(Notification)。如果构造器未传入值, 则默认值为0。
以上属性介绍字面上可能很难理解,笔者花几个草图来让大家有个直观的认知:

disconnect()  使IntersectionObserver对象停止监听工作
takeRecords() 返回所有观察目标的IntersectionObserverEntry对象数组
unobserve()  使IntersectionObserver停止监听特定目标元素

```html
<div id="scrollView">
    <img src="loading.gif" data-src="absolute.jpg">
    <img src="loading.gif" data-src="relative.jpg">
    <img src="loading.gif" data-src="fixed.jpg">
</div>

<script>
let observerImg = new IntersectionObserver((entries,observer)=>{
  entries,forEach(entry=>{
      // 替换为正式的图片
      entry.target.src = entry.target.dataset.src;
      // 停止监听
      observer.unobserve(entry,target);
  },{
      root:document.getElementById("scrollView"), // 根元素
      threshold:0.3 // 当图片30%进入根元素时开始加载datasrc的图片地址
  })

  document.querySelectorAll("img").forEach(img => {observerImg,observe(img)})
</script>
```

以上代码就实现了一个图片懒加载功能, 当图片的30%进入根元素时才加载真实的图片,这又让我想起了之前在某条做广告埋点上报时使用react-lazyload的画面.大家还可以利用它实现无限滚动, H5视差动画等有意思的交互场景.

### Mutation Observer和Resize Observer

 `Mutation Observer`主要用来实现dom变动时的监听,同样也是异步触发,对监听性能非常友好.
`Resize Observer`主要用来监听元素大小的变化,相比于每次窗口变动都触发的`window.resize`事件, `Resize Observer`有更好的性能和对dom有更细粒度的控制,它只会在绘制前或布局后触发调用.
以上两个api的使用和Intersection使用非常类似,官方资料也写得很全,大家可以好好研究一下.


### 自定义事件
`CustomEvent API`是个非常有意思的api, 而且非常实用, 更重要的是学起来非常简单,而且被大部分现代浏览器支持.我们可以让任意dom元素监听和触发自定义事件,只需要如下操作:

```js
// 添加一个适当的事件监听器
 dom1.addEventListener("boom",function(e){
     something(e.detail.num)
 })

 // 创建并发事件
 var event = new CustomEvent("boom",{
     "detail":{"num":10}
 })
 dom1.dispatchEvent(event)
```

### fileReader
`File API`使得我们在浏览器端可以访问文件的数据,比如预览文件,获取文件信息(比如文件名,文件内容,文件大小等), 并且可以在前端实现文件下载(可以借助canvas和 window.URL.revokeObjectURL的一些能力).当然我们还可以实现拖拽上传文件这样高用户体验的操作.接下来我们来看看几个实际例子.

```js
// 显示缩略图
function previewFiles(files,previewBox){
    for(var i = 0;i <files.length,i++){
        var file = files[i]
        var imageType = /^image\//;

        if(!imageType.test(file.type)){
            continue;
        }

        var img = document.createElement("img");
        previewBox.appendChild(img) //  假设"preview"就是用来显示内容的div

        var reader = new FileReader()
        reader.onload = (function(img1){
            return function(e){
                img1.src = e.target.result
            }
        })(img);
        reader.readAsDataURL(file)
    }
}
```

### Fullscreen
全屏API主要是让网页能在电脑屏幕中全屏显示,它允许我们打开或者退出全屏模式,以便我们根据需要进行对应的操作,比如我们常用的网页图形编辑器或者富文本编辑器, 为了让用户专心于内容设计,我们往往提供切换全屏的功能供用户使用.由于全屏API比较简单,这里我们直接上代码:

```js
// 开启全屏
document.documentElement.requestFullscreen();

// 退出全屏
cocument.exitFullscreen();
```

默认情况下我们还可以通过`document.fullscreen`来判断当前页面是否处于全屏状态

###  URL
> URL API是URL标准的组成部分，URL标准定义了构成有效统一资源定位符的内容以及访问和操作URL的API

```js
let addr = new URL(window.location.href)
let host = addr.host // 获取主机地址
let path = addr.pathname // 获取路劲名称
let user = addr.searchParams.get("user") // 获取参数为user对应的值
```

另一方面,如果网站安全性比较高,我们还可以对参数进行自然数排序然后再加密上传给后端.具体代码如下:

```js
function sortMD5WithParameters() {
    let url = new URL(document.location.href);
    url.searchParams.sort();
    let keys = url.searchParams.keys();
    let params = {}
  
    for (let key of keys) {
      let val = url.searchParams.get(key);
      params[key] = val
    };
    // ...md5加密
    return MD5(params)
 }

```

### Geolocation
地理位置 API 通过 navigator.geolocation 提供, 这个浏览器API也比较实用, 我们在网站中可以用此方式确定用户的位置信息,从而让网站有不同的展现,增强用户体验.

```js
function getUserLocation(){
    return new Promise((resolve,reject)=>{
        if(!navigator.geolocation){
            reject()
        }else{
            navigator.geolocation.getCurrentPosition(success,error);
        }

        function success(position){
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
        }

        function error(){
            reject()
        }
    })
}

let obj = await getUserLocation()
console.log(obj) // {latitude: 22.5644633,longitude: 113.9685021}
```

我们基于获取到的经纬度调用第三方api(比如百度,高德)就可以获取用户所在为精确位置信息了.


### Notifications

> `Notifications API` 允许网页或应用程序在系统级别发送在页面外部显示的通知;这样即使应用程序空闲或在后台，Web应用程序也会向用户发送信息。

```js
Notification.requestPermission( function(status) {
  console.log(status); // 仅当值为 "granted" 时显示通知
  var n = new Notification("趣谈前端", {body: "从零搭建一个CMS全栈项目"}); // 显示通知
});

```

当然浏览器的Notification还给我们提供了4个事件触发api方便我们做更全面的控制:

- show 当通知被显示给用户时触发
- click 当用户点击通知时触发
- close 当通知被关闭时触发
- error 当通知发生错误的时候触发

有了这样的事件监听,我们就可以控制当用户点击通知时, 跳转到对应的页面或者执行相关的业务逻辑.如下代码所示:

```js
Notification.requestPermission( function(status) {
  console.log(status); // 仅当值为 "granted" 时显示通知
  var n = new Notification("趣谈前端", {body: "从零搭建一个CMS全栈项目"}); // 显示通知
      n.onshow = function () { 
        // 消息显示时执行的逻辑
        console.log('show') 
      }
      n.click = function () { 
        // 消息被点击时执行的逻辑
        history.push('/detail/1232432')
      }
      n.close = function () { 
        // 消息关闭时执行的逻辑
        console.log('close')
      }
});
```

### Battery Status
> Battery Status API提供了有关系统充电级别的信息并提供了通过电池等级或者充电状态的改变提醒用户的事件。 这个可以在设备电量低的时候调整应用的资源使用状态，或者在电池用尽前保存应用中的修改以防数据丢失。

`Battery Status API`提供了几个事件监听函数来监听电量的变化以及监听设备是否充电,但是笔者看文档时这些api都已经废弃,如下:

- chargingchange 监听设别是否充电
- levelchange 监听电量充电等级
- chargingtimechange 充电时间变化
- dischargingtimechange 放电时间变化

```js
navigator.getBattery().then(function(battery){
     console.log("是否在充电? " + (battery.charging ? "是" : "否"));
  console.log("电量等级: " + battery.level * 100 + "%");
  console.log("充电时间: " + battery.chargingTime + " s");
  console.log("放电时间: " + battery.dischargingTime + "s");

  if(!battery.charging){
    alert(`当前电量为：${battery.level*100}%,当前没有充电哦~`)
  }else{
         alert(`当前电量为：${battery.level*100}%,正在充电中~`)
  }
})
```

我们可以通过getBattery拿到设备电池信息,这个api非常有用,比如我们可以在用户电量不足时禁用网站动画或者停用一些耗时任务,亦或者是对用户做适当的提醒,改变网站颜色等,对于webapp中播放视频或者直播时,我们也可以用css画一个电量条,当电量告急时提醒用户.作为一个优秀的网站体验师,这一块还是不容忽视的

链接：https://juejin.im/post/5e97c1206fb9a03c300f9d75
来源：掘金
