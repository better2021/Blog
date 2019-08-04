
### grid布局
```html
<div class="wrapper">
  <div class="letter">
    A
  </div>
  <div class="letter">
    B
  </div>
</div>
```
- 样式
```css
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1px;
  background-color: black;
}
```


> 让我们分析一下上面的代码。首先我们用 grid-template-columns 创建了一个两列的网格，如果你以前没见过这样的，那 1fr 可能看起来比较奇怪 ，但它是有效的 CSS 单元，可以将每一列都列为我们网格的一小部分

> 但是看到两列之间的黑线了吗？这是 wrapper 勾勒的每个字母 div 的背景，因为我们将 grid-column-gap 设置为了 1px。通常，我们会设置更大的距离，尤其是对于两个相邻的文本框来说。但在本例中，1px 就足够了。


> 如果屏幕为 500px 的时候我们想让其显示为 3 列，如果屏幕再大点，我们要 4 列
---
```css
<div class='wrapper'>
  <div class='letter'>
    A
  </div>
  <div class='letter'>
    B
  </div>
  <div class='letter'>
    C
  </div>
  <div class='letter'>
    D
  </div>
</div>

.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media screen and (min-width: 500px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media screen and (min-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
```

> 图示

![grid的响应式布局](https://pic4.zhimg.com/80/v2-f71f850a97bed455ea6953c1bd7063b3_hd.png)


### 手机端横竖屏媒体查询
```html
  <link rel="stylesheet" media="all and (orientation:portrait)" href="portrait.css">    // 竖放加载
	<link rel="stylesheet" media="all and (orientation:landscape)"href="landscape.css">   // 横放加载
```

### 竖屏时使用的样式
```css
<style media="all and (orientation:portrait)" type="text/css">
		#landscape { display: none; }
	</style>
```

### 竖屏时的样式
```css
<style media="all and (orientation:landscape)" type="text/css">
		#portrait { display: none; }
</style>
```

```js
// 解决ios safari tab在后台会遭遇进程冻结问题
// http://www.apple.com/safari/#gallery-icloud-tabs
// Safari takes advantage of power-saving technologies such as App Nap, which puts background Safari tabs into a low-power state until you start using them again. In addition, Safari Power Saver conserves battery life by intelligently pausing web videos and other plug‑in content when they’re not front and center on the web pages you visit. All told, Safari on OS X Mavericks lets you browse up to an hour longer than with Chrome or Firefox.1

importScripts('/socket.io/socket.io.js');

var count = 0,
	targetURL = ''
	; 

var socket = io.connect('/');
socket.on('navigate', function (data) {
  count = count++;
  postMessage({targetURL:data.url,count:count});
});
```

<input type=file accept="video/*">  // 上传视频(默认刷选出文件夹中的视频格式)
<input type=file accept="image/*">  // 上传图片(默认刷选出文件夹中的图片格式)
