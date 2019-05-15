### clipboard.js 复制功能

> `clipboard`在同步功能中很容易使用，但是在异步接口中使用就会有问题，所以要把接口改为同步执行，才会得到正确的结果

```js
function handleCopy(row) {
  var xhr = new XMLHttpRequest()
  xhr.open("GET", `${environment.api}/movie/address/${row.id}`, false) // clipboard需要在同步中处理数据
  xhr.setRequestHeader("pl", "admin") // setRequestHeader设置xhr的请求头，需要在xhr.open之后，在xhr.open之前设置
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${window.localStorage.getItem("token")}`
  )
  xhr.onload = e => {
    // 使用箭头函数，this的指向就是声明时的指向
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // console.log(JSON.parse(xhr.responseText).data.url, '++--');
        const copyData = JSON.parse(xhr.responseText).data.url
        let clipboard = new Clipboard(".copyBtn", {
          text: () => {
            return copyData // 需要复制的值
          }
        })

        clipboard.on("success", e => {
          this.$Message.success("影片地址复制成功")
          clipboard.destroy()
        })
        clipboard.on("error", e => {
          this.$Message.error("该浏览器不支持自动复制")
          clipboard.destroy()
        })
      } else {
        this.$Message.error(xhr.statusText)
        console.error(xhr.statusText)
      }
    }
  }
  xhr.onerror = function(e) {
    console.error(xhr.statusText)
  }
  xhr.send(null) // xhr请发发送时的参数，没有参数可以设置为null
}
```
