## findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。否则返回-1。
> Array.findIndex()
```javascript
var array1 = [5, 12, 8, 130, 44];

function findFirstLargeNumber(element) {
  return element > 13;
}

console.log(array1.findIndex(findFirstLargeNumber));
```

> vue中获取随机颜色值
```javascript
 computed: {
    color() {
      return '#' + ((Math.random() * 0xffffff) << 0).toString(16);
    }
  }
  ```

> 高阶函数累加器 reduce
- total	必需。初始值, 或者计算结束后的返回值。
- currentValue	必需。当前元素
- currentIndex	可选。当前元素的索引
- arr	可选。当前元素所属的数组对象。
- initialValue	可选。传递给函数的初始值

```javascript
array.reduce((total,currentValue, index,array)=>{
  return total += currentValue
},initialValue)

let numbers = [65, 44, 12, 4];
numbers.reduce((total,num)=>{
	return total += Number(num)
},0)
```

### 获取url的？后面的参数
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
Array.prototype.unique = function(){
  for(var i = 0; i < this.length; i++){
    for(var j = i+1; j < this.length; j++){
      if(this[i] == this[j]){
        this.splice(j,1);
      }
    }
  }
  return this;
};

// es6的方法
let arr = [2,3,6,2,5,6]
Array.from(new Set(arr)) //[2, 3, 6, 5]
```

### 获取数组中的最大值与最小值
```js
// 获取数组中的最大值与最小值
let arr = [2,3,9,6,5]

undefined
// 获取最大值
Math.max.apply(Math,arr)	//9

// 获取最小值
Math.min.apply(Math,arr)	//2

```

### 1.Github页面修改仓库信息
> 跑到自己的仓库那,找到Setting的tag, 点进去后Options的Settings就可以设定Repository name.
### 2.修改本地仓库信息
因为远程的仓库名改了, 本地的对应仓库名也要改. 这里假设远程仓库本地命名为origin.
> git remote -v
### 列出所有远程仓库信息, 包括网址.
> git remote set-url origin git@github.com:username/newrepo.git
> git push -u origin master -f  //github上的版本里有readme文件和本地版本冲突解决

### url的转义与还原
> encodeURI 方法的参数是一个字符串，代表整个URL。它会将元字符和语义字符之外的字符，都进行转义。encodeURIComponent只转除了语义字符之外的字符，元字符也会被转义。因此，它的参数通常是URL的路径或参数值，而不是整个URL。
> decodeURI用于还原转义后的URL。它是encodeURI方法的逆运算。decodeURIComponent用于还原转义后的URL片段。它是encodeURIComponent方法的逆运算。

### 解除chrome浏览器的跨域限制
> chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security

### css的毛玻璃效果
***background-attachment: fixed;
filter: bulr() 
实现毛玻璃效果***

### 在谷歌瀏覽器中的console中輸入以下代碼即可編輯頁面
document.body.contentEditable = 'true'

### 在浏览器中打开word，ppt,pdf等文档
https://view.officeapps.live.com/op/view.aspx?src=https://res.wxsrtgg.com/2019_04_05_16_31_05_462/e42bf29e-23f0-4700-b34d-b860b0a21c27.%E8%AF%B7%E5%81%87%E5%8D%95%E6%A8%A1%E6%9D%BF.xlsx

> `https://view.officeapps.live.com/op/view.aspx?src=`后面加文件的绝对地址就可以在浏览器中预览文档了
