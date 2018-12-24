# findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。否则返回-1。
> Array.findIndex()
```javascript
var array1 = [5, 12, 8, 130, 44];

function findFirstLargeNumber(element) {
  return element > 13;
}

console.log(array1.findIndex(findFirstLargeNumber));
```
