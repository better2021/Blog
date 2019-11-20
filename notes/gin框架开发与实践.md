### Gin 框架简介

> Gin 是一个 golang 的微框架，封装比较优雅，API 友好，源码注释比较明确
> Gin 是一个 Golang 写的 web 框架，具有高性能的优点,,基于 httprouter，它提供了类似 martini 但更好性能(路由性能约快 40 倍)的 API 服务

Gin 包括以下几个主要的部分:

- 设计精巧的路由/中间件系统;
- 简单好用的核心上下文 `Context`;
- 附赠工具集(JSON/XML 响应, 数据绑定与校验等).

安装 gin

```go
go get -u github.com/gin-gonic/gin

// 示例
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func main() {
    router := gin.Default()
    router.GET("/", func(c *gin.Context) {
        c.String(http.StatusOK, "Hello World")
    })
    router.Run(":8000")
}
```

api 参数通过 Context 的 Param 方法来获取。

```go
// 日志与恢复中间件
router := gin.Default()
//创建不带中间件的路由：
//router := gin.New()

router.GET("/user/:name",func(c *gin.Context){
  name := c.Param("name")
 // name := c.DefaultQuery("name", "Guest") //可设置默认值
  c.String(http.StatusOK,name)
})
```

文件上传

> 使用 c.Request.FormFile 解析客户端文件 name 属性。如果不传文件，则会抛错，因此需要处理这个错误。此处我们略写了错误处理。一种是直接用 c.SaveUploadedFile()保存文件。另一种方式是使用 os 的操作，把文件数据复制到硬盘上。

```go
func main() {
    router := gin.Default()
    // Set a lower memory limit for multipart forms (default is 32 MiB)
    // router.MaxMultipartMemory = 8 << 20  // 8 MiB
    router.POST("/upload", func(c *gin.Context) {
        // single file
        file, _ := c.FormFile("file")
        log.Println(file.Filename)

        // Upload the file to specific dst.
        c.SaveUploadedFile(file, file.Filename)

        /*
        也可以直接使用io操作，拷贝文件数据。
        out, err := os.Create(filename)
        defer out.Close()
        _, err = io.Copy(out, file)
        */

        c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
    })
    router.Run(":8080")
}
```

上传多个文件

> 与单个文件上传类似，只不过使用了 c.Request.MultipartForm 得到文件句柄，再获取文件数据，然后遍历读写

```go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
    "fmt"
)

func main() {
    router := gin.Default()
    // Set a lower memory limit for multipart forms (default is 32 MiB)
    router.MaxMultipartMemory = 8 << 20 // 8 MiB
    //router.Static("/", "./public")
    router.POST("/upload", func(c *gin.Context) {

        // Multipart form
        form, err := c.MultipartForm()
        if err != nil {
            c.String(http.StatusBadRequest, fmt.Sprintf("get form err: %s", err.Error()))
            return
        }
        files := form.File["files"]

        for _, files := range files {
            if err := c.SaveUploadedFile(file, file.Filename); err != nil {
                c.String(http.StatusBadRequest, fmt.Sprintf("upload file err: %s", err.Error()))
                return
            }
        }

        c.String(http.StatusOK, fmt.Sprintf("Uploaded successfully %d files ", len(files)))
    })
    router.Run(":8080")
}
```
