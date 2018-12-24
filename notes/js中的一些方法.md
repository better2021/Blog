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
