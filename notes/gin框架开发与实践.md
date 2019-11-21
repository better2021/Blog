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

#### 数据解析绑定

> JSON 绑定

```go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

type Login struct {
    User     string `form:"username" json:"user" uri:"user" xml:"user"  binding:"required"`
    Password string `form:"password" json:"password" uri:"password" xml:"password" binding:"required"`
}

func main() {
    router := gin.Default()
    //1.binding JSON
    // Example for binding JSON ({"user": "hanru", "password": "hanru123"})
    router.POST("/loginJSON", func(c *gin.Context) {
        var json Login
        //其实就是将request中的Body中的数据按照JSON格式解析到json变量中
        if err := c.ShouldBindJSON(&json); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        if json.User != "hanru" || json.Password != "hanru123" {
            c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
            return
        }
        c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
    })

    router.Run(":8080")
}
```

> Form 表单

```go
// 3. Form 绑定普通表单的例子
    // Example for binding a HTML form (user=hanru&password=hanru123)
    router.POST("/loginForm", func(c *gin.Context) {
        var form Login
        //方法一：对于FORM数据直接使用Bind函数, 默认使用使用form格式解析,if c.Bind(&form) == nil
        // 根据请求头中 content-type 自动推断.
        if err := c.Bind(&form); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        if form.User != "hanru" || form.Password != "hanru123" {
            c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
    })
```

JSON/XML/YAML 渲染

```go
func main() {
    r := gin.Default()

    // gin.H is a shortcut for map[string]interface{}
    r.GET("/someJSON", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
    })

    r.GET("/moreJSON", func(c *gin.Context) {
        // You also can use a struct
        var msg struct {
            Name    string `json:"user"`
            Message string
            Number  int
        }
        msg.Name = "hanru"
        msg.Message = "hey"
        msg.Number = 123
        // 注意 msg.Name 变成了 "user" 字段
        // 以下方式都会输出 :   {"user": "hanru", "Message": "hey", "Number": 123}
        c.JSON(http.StatusOK, msg)
    })

    r.GET("/someXML", func(c *gin.Context) {
        c.XML(http.StatusOK, gin.H{"user":"hanru","message": "hey", "status": http.StatusOK})
    })

    r.GET("/someYAML", func(c *gin.Context) {
        c.YAML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
    })

    r.GET("/someProtoBuf", func(c *gin.Context) {
        reps := []int64{int64(1), int64(2)}
        label := "test"
        // The specific definition of protobuf is written in the testdata/protoexample file.
        data := &protoexample.Test{
            Label: &label,
            Reps:  reps,
        }
        // Note that data becomes binary data in the response
        // Will output protoexample.Test protobuf serialized data
        c.ProtoBuf(http.StatusOK, data)
    })

    // Listen and serve on 0.0.0.0:8080
    r.Run(":8080")
}
```

HTML 模板渲染

> gin 支持加载 HTML 模板, 然后根据模板参数进行配置并返回相应的数据。
> 先要使用 LoadHTMLGlob() 或者 LoadHTMLFiles()方法来加载模板文件

创建一个目录：templates，然后在该目录下创建一个模板文件
templates/index.tmpl

```html
<html>
  <h1>
    {{ .title }}
  </h1>
</html>
```

```go
func main(){
  router := gin.Default()
  // 加载模板
   router.LoadHTMLGlob("templates/*")
    //router.LoadHTMLFiles("templates/template1.html", "templates/template2.html")
   // 定义路由
   router.GET("/index",func(c *gin.Context){
     // 根据完整文件名渲染模板，并传递参数
     c.HTML(http.StatusOK,"index.tmpl",gin.H{
       "title":"Main website"
     })
   })
   router.Run(":8080")
}
```

![打开浏览器输入地址：http://127.0.0.1:8080/index](http://image.chaindesk.cn/gin_yunxing24.png/mark)

文件响应

> 可以向客户端展示本地的一些文件信息，例如显示某路径下地文件

```go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func main() {
    router := gin.Default()
    // 下面测试静态文件服务
    // 显示当前文件夹下的所有文件/或者指定文件
    router.StaticFS("/showDir", http.Dir("."))
    router.StaticFS("/files", http.Dir("/bin"))
    //Static提供给定文件系统根目录中的文件。
    //router.Static("/files", "/bin")
    router.StaticFile("/image", "./assets/miao.jpg")

    router.Run(":8080")
}
```

![打开浏览器，输入地址：http://127.0.0.1:8080/showDir，访问当前项目目录的内容](http://image.chaindesk.cn/gin_yunxing29.png/mark)

重定向

```go
package main

import(
  "github.com/gin-gonic/gin"
  "net/http"
)

func main(){
  r := gin.Default()
  r.GET("/redirect",function(c *gin.Context){
    // 支持内部和外部的重定向
    c.Redirect(http.StatusMovePermanently,"http://www.baidu.com")
  })
  r.Run(":8080")
}
```

#### 中间件 middleware

> golang 的 net/http 设计的一大特点就是特别容易构建中间件。gin 也提供了类似的中间件。需要注意的是中间件只对注册过的路由函数起作用。对于分组路由，嵌套使用中间件，可以限定中间件的作用范围。中间件分为全局中间件，单个路由中间件和群组中间件

所以中间件和我们普通的 HandlerFunc 没有任何区别对吧, 我们怎么写 HandlerFunc 就可以怎么写一个中间件

我们之前说过, Context 是 Gin 的核心, 它的构造如下

```go
type Context struct {
    writermem responseWriter
    Request   *http.Request
    Writer    ResponseWriter

    Params   Params
    handlers HandlersChain
    index    int8

    engine   *Engine
    Keys     map[string]interface{}
    Errors   errorMsgs
    Accepted []string
}
```

- 全局中间件

```go
func MiddleWare() gin.HandlerFunc(){
  return func(c *gin.Context){
    t := time.Now()
    fmt.Println("before middleware")
    // 设置request变量到Context的key中，通过GET等函数可获取到
    c.Set("request","client_request")
    // 发送request之前
    c.Next()

    // 发送request之后
    status := c.Writer.Status() // 这个c.Write是ResponseWriter,我们可以获得状态等信息
    fmt.Println("after middleware,", status)
    t2 := time.Since(t)
    fmt.Println("time",t2)
  }
}
```

该函数很简单，只会给 c 上下文添加一个属性，并赋值。后面的路由处理器，可以根据被中间件装饰后提取其值。需要注意，虽然名为全局中间件，只要注册中间件的过程之前设置的路由，将不会受注册的中间件所影响。只有注册了中间件一下代码的路由函数规则，才会被中间件装饰。

```go
router := gin.Default()

router.Use(MiddleWare())
{
  router.GET("/middleware",func(c *gin.Context){
    // 获取gin上下文的变量
    request := c.MustGet("request").(string)
    req,_ := c.Get("request")
    fmt.Println("request",request)

    c.JSON(http.StatusOK,gin.H{
      "middle_request":requset,
      "request":req,
    })
  })
}

router.Run(":8080")
```

- 全局中间件 router.Use(gin.Logger()) router.Use(gin.Recovery())
- 单路由的中间件，可以加任意多个 router.GET("/benchmark", MyMiddelware(), benchEndpoint)
- 群组路由的中间件 authorized := router.Group("/", MyMiddelware()) // 或者这样用： authorized := router.Group("/") authorized.Use(MyMiddelware()) {​ authorized.POST("/login", loginEndpoint) }

#### 基于 database/sql 的 CURD 操作

我们就查询一张表，并将查询的结果以 json 的形式，返回给客户端

```go
// 定义User类型结构
type User struct{
  Id int `json:"id"`
  Username string `json:"username"`
  Password string `json:"password"`
}

// 定义衣蛾getAll函数用于获取全部信息
func getAll()(users []User,err error){
  // 1.操作数据库
  db,_:= sql.Open("mysql","root:hanru1314@tcp(127.0.0.1:3306)/mytest?charset=utf8")
  // 错误检查
  if err != nil{
    log.Fatal(err.Error())
  }
  // 推迟数据库的关闭
  defer db.Close()

  // 2.查询
  rows,err := db.Query("SELECT id,username,password FROM user_info")
  if err !=nil{
    log.Fatal(err.Error())
  }

  for rows.Next(){
    var user User
    // 遍历表中所有行的信息
    rows.Scan(&user.Id,&user.Username,&user.Password)
    // 将user添加users中
    users = append(users,user)
  }
  // 最后关闭连接
  defer rows.Close()
  return
}


//创建一个路由Handler
router := gin.Default()

// get方法的查询
router.GET("/user",func(c *gin.Context){
  users,err := getAll()
  if err != nil{
    log.Fatal(err)
  }

  c.JSON(http.StatusOK,gin.H{
    "result"：users,
    "count":len(users)
  })
})
router.Run(":8080")
```

#### 插入数据

```go
// 插入数据
func add(user User)(Id int,err error){
  //1.操作数据库
  db,_ := sql.Open("mysql","root:hanru1314@tcp(127.0.0.1:3306)/mytest?charset=utf8")
  // 错误检查
  if err != nil{
    log.Fatal(err.Error())
  }
  // 推迟数据库连接的关闭
  defer db.Close()
  stmt,err := db.Prepare("INSERT INTO user_info(username, password) VALUES (?, ?)")
  if err != nil{
    return
  }
  // 执行插入操作
  id,err := stmt.Exec(user.Username,user.Password)
  if err !=nil{
    return
  }
  // 返回插入的id
  id,err := rs.LastInsertId()
  if err != nil{
    log.Fatal(err)
  }
  // 将id类型转换
  Id = int(id)
  defer stmt.Close()
  return
}
```

然后我们添加一个 POST 的路由，当通过 post 请求的时候，我们向数据库中插入数据：

```go
//定义User类型结构
type User struct {
    Id       int    `json:"id" form:"id"`
    Username string `json:"username" form:"username"`
    Password string `json:"password" form:"password"`
}

// 利用post方法新增数据
router.POST("/add",func(c *gin.Context){
  var u User
  err := c.Bind(&u)
  if err !=nil{
    log.Fatal(err)
  }
  id,err := add(u)
  fmt.Print("id=",id)
  c.JSON(http.StatusOK,gin.H{
    "message":fmt.Sprintf("%s 插入成功", u.Username),
  })

})
```

#### 修改数据

```go
// 修改数据
func update(user User)(rowsAffected int64,err error){

  // 1.操作数据库
  db,_ := sql.Open("mysql", "root:hanru1314@tcp(127.0.0.1:3306)/mytest?charset=utf8")
  // 错误检查
  if err !=nil{
    log.Fatal(err.Error())
  }
  // 推迟数据库连接的关闭
  defer db.Close()
  stmt,err := db.Prepare("UPDATE user_info SET username=?,password=? WHERE id = ?")
  if err != nil{
    return
  }
  // 执行修改操作
  rs,err := stmt.Exec(user.Username,user.Password,user.Id)
  if err != nil{
    return
  }
  // 返回输入的id
   rowsAffected,err =rs.RowsAffected()
    if err != nil {
        log.Fatalln(err)
    }
    defer stmt.Close()
    return
}

/*
然后在main中新添加一个路由
*/
// 利用put方法修数据
router.PUT("/uodate",func(c *gin.Context){
  var u  User
  err := c.Bind(&u)
  if err != nil{
    log.Fatal(err)
  }
  num,err := update(u)
  fmt.Print("num=",num)
  c.JSON(http.StatusOK,gin.H{
    "message": fmt.Sprintf("修改id: %d 成功", u.Id),
  })
})
```

#### 删除数据

我们可以根据 Id 删除一条数据，删除刚刚修改的 id 为 10 的数据，先添加一个 delete 方法：

```go
// 通过id删除
func del(id int)(rows int,err error){
  // 1.操作数据库
  db,_ := sql.Open("mysql","root:hanru1314@tcp(127.0.0.1:3306)/mytest?charset=utf8")
  // 检查错误
  if err !=nil{
    log.Fatal(err.Error())
  }
  // 推迟数据连接的关闭
  defer db.Close()
  stmt,err := db.Prepare("DELETE FROM user_info WHERE id = ?")
  if err !=nil{
    log.Fatalin(err)
  }
  rs,err := stmt.Exec(id)
  if err !=nil{
    log.Fatalin(err)
  }
  // 删除的行数
  row,err := rs.RowsAffected()
  if err != nil{
    log.Fatalln(err)
  }
  defer stmt.Close()
  rows = int(row)
  return
}

 //利用DELETE请求方法通过id删除
router.DELETE("/delete/:id",func(c *gin.Context){
  id := c.Param("id")
  Id,err := strconv.Atoi(id)
  if err !=nil{
    log.Fatalln(err)
  }
  rows,err := del(Id)
  fmt.Println("delete rows ", rows)

  c.JSON(http.StatusOK, gin.H{
      "message": fmt.Sprintf("Successfully deleted user: %s", id),
  })
})
```
