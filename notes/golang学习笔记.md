### go 语言是近几年比较火的新编程语言，由 google 的三位大神开发，称为 21 世纪的 C 语言，在云时代很适合

> 比较好用的 web 框架 gin
> gorm 作为 orm 工具来操作数据库 mysql

### go 的环境变量

- `GOROOT` 该环境变量的值为 Go 语言的当前安装目录
- `GOPATH` 该环境变量的值为 Go 语言的工作区的集合，
- 每个不同的目录之间用：分隔，工作目录主要是用来存放自己编写的 go 项目源码
- GOPATH 下有三个目录 src 目录，pkg 目录，bin 目录
- 自己写的 go 代码就放在 src 目录
- 如果使用 go 的包管理工具 mod 就可以不用把代码放在 GOPATH 中

### go 语言的命令行工具

> 常用命令
> `go run xxx.go` 命令可以编译并运行命令源码文件
> `go build xxx.go` 命令用于编译我们指定的源码文件或代码包以及它们的依赖包

**当代码包中有且仅有一个命令源码文件的时候，在文件夹所在目录中执行 go build 命令，会在该目录下生成一个与目录同名的可执行文件**

> > `go install xxx.go` 用于编译并安装指定的代码包及它们的依赖包
> > 如果 go install 命令后跟的代码包中仅包含库源码文件，那么 go install 命令会把编译后的结果文件保存在源码文件所在工作区的 pkg 目录下
> > 如果我们在执行 go install 命令时不后跟任何代码包参数，那么命令将试图编译当前目录所对应的代码包
> > `go get xxx` 可以根据要求和实际情况从互联网上下载或更新指定的代码包及其依赖包，并对它们进行编译和安装

**注意，go get 命令会把当前的代码包下载到 \$GOPATH 中的第一个工作区的 src 目录中，并安装**

> `go clean` 命令会删除掉执行其它命令时产生的一些文件和目录

> 在使用 go build 命令时在当前代码包下生成的与包名同名或者与 Go 源码文件同名的可执行文件。在 Windows 下，则是与包名同名或者 Go 源码文件同名且带有“.exe”后缀的文件。
> 在执行 go test 命令并加入-c 标记时在当前代码包下生成的以包名加“.test”后缀为名的文件。在 Windows 下，则是以包名加“.test.exe”后缀为名的文件。我们会在后面专门介绍 go test 命令。
> `go test xxx.go` 命令用于对 Go 语言编写的程序进行测试
> `go list` 命令的作用是列出指定的代码包的信息
> `go env` 命令 go env 用于打印 Go 语言的环境信息

### go 的包管理工具 Go Modules

先设置环境变量
![mod的环境变量](https://i.loli.net/2019/08/10/tXjYkFJI7NBG8vV.png)

- GO111MODULE 设置为 on
- GOPROXY 设置代理地址 https://goproxy.io 如果访问不了外网就设置这个代理

可以设置通过一个环境变量 GO111MODULE 来激活 modules

- `GO111MODULE=off`，go 命令行将不会支持 module 功能，寻找依赖包的方式将会沿用旧版本那种通过 vendor 目录或者 GOPATH 模式来查找。
- `GO111MODULE=on`，go 命令行会使用 modules，而一点也不会去 GOPATH 目录下查找。
- `GO111MODULE=auto`，默认值，go 命令行将会根据当前目录来决定是否启用 module 功能。这种情况下可以分为两种情形：当前目录在 GOPATH/src 之外且该目录包含 go.mod 文件，或者当前文件在包含 go.mod 文件的目录下面
  **通过`set GO111MODULE` 命令可以查看 module 功能是否开启**

### go.mod 文件结构

- module：模块名称
- require：依赖包列表以及版本
- exclude：禁止依赖包列表（仅在当前模块为主模块时生效）
- replace：替换依赖包列表 （仅在当前模块为主模块时生效）

```go
go mod init xxx // 初始化项目的module,命令执行后会生成go.mod文件作为包管理文件
go mod tidy // 拉取缺少的模块，移除不用的模块
go mod download // 下载依赖包
go mod graph //打印模块依赖图
go list -m -json all //依赖详情
```

### go 语言的 init 和 main 函数

go 语言中 init 函数用于包(package)的初始化，该函数是 go 语言的一个重要特性
有下面的特征：

- init 函数是用于程序执行前做包的初始化的函数，比如初始化包里的变量等

- 每个包可以拥有多个 init 函数

- 包的每个源文件也可以拥有多个 init 函数

- 同一个包中多个 init 函数的执行顺序 go 语言没有明确的定义(说明)

- 不同包的 init 函数按照包导入的依赖关系决定该初始化函数的执行顺序

- **init 函数不能被其他函数调用，而是在 main 函数执行之前，自动被调用**

go 语言的 main 函数作为项目的入口文件，main 函数只能用于 main 包中，且只能定义一个

### go 的 web 框架 gin 与 gorm 的 RESTful 接口实例

```go
package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/unknwon/com"
)

// 定义数据模型(结构体)
type Movie struct {
	ID        int       `gorm:"primary_key" json:"id"`
	Name      string    `gorm:"not null;unique" json:"name"`
	Year      string    `json:"year"`
	Desc      string    `json:"desc"`
	CreatedAt time.Time `json:"createAt"`
	UpdatedAt time.Time `json:"updateAt"`
}

var db *gorm.DB

// init 初始化函数会最先执行
func init() {
	var err error
	db, err = gorm.Open("mysql", "root:709463253@/test?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		fmt.Println("数据库连接失败", err.Error())
	} else {
		fmt.Println("数据库已连接")
	}

	// 关联数据表
	db.AutoMigrate(&Movie{})

	// 检查模型`Movie`的表是否存在
	hasTable := db.HasTable(&Movie{})
	fmt.Println(hasTable, "--")
	if !hasTable {
		// 为模型`Product`创建表,CHARSET=utf8设置数据库的字符集为utf8
		db.Set("gorm:table_options", "ENGINE=InnoDB CHARSET=utf8").CreateTable(&Movie{})
	}
}

func main() {
	/*
		cors.Default() 默认允许所有源跨域
		跨域要写在路由前面，需要先执行
	*/
	router := gin.Default()
	router.Use(cors.Default())

	v1 := router.Group("/api/v1")
	{
		v1.GET("/movie", movieList)
		v1.POST("/movie", movieCreate)
		v1.PUT("/movie/:id", movieUpdate)
		v1.DELETE("/movie/:id", movieDelete)
	}

	router.Run("127.0.0.1:8081")

}

// 获取电影列表
func movieList(c *gin.Context) {
	var movie []Movie
	name := c.Query("name")
	pageNum := com.StrTo(c.Query("pageNum")).MustInt()
	pagesize := 10

	fmt.Println("name", name, pageNum, pagesize)
	/*
		迷糊搜索，name为搜索的条件，根据电影的名称name来搜索
		Offset 其实条数
		Limit	 每页的条数
		Order("id desc") 根据id倒序排序
		总条数 Count(&count)
	*/

	var count int
	db.Model(&movie).Where("name LiKE?", "%"+name+"%").Count(&count)
	db.Offset((pageNum-1)*pagesize).Limit(pagesize).Order("id desc").Where("name LiKE?", "%"+name+"%").Find(&movie)
	c.JSON(http.StatusOK, gin.H{
		"message": "请求成功",
		"status":  http.StatusOK,
		"data":    movie,
		"page":    pageNum,
		"total":   count, // 总条数
	})
}

// 创建列表
func movieCreate(c *gin.Context) {
	/*
	 gin还提供了更加高级方法，c.Bind，
	 它会更加content-type自动推断是bind表单还是json的参数
	 json格式application/json或者表单格式x-www-form-urlencoded
	*/
	data := &Movie{}
	err := c.Bind(data)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(data, "--")
	db.Create(data)
	c.JSON(http.StatusOK, gin.H{
		"message": "创建成功",
		"status":  http.StatusOK,
		"data":    data,
	})
}

//  更新列表
func movieUpdate(c *gin.Context) {
	id := com.StrTo(c.Param("id")).MustInt()
	fmt.Println(id, "--")

	movie := &Movie{ID: id} // 修改条件，根据ID修改
	// 需要更新的元素
	data := &Movie{}
	err := c.Bind(data) // c.Bind 可以获取json格式参数
	if err != nil {
		fmt.Println(err)
		return
	}
	db.Model(movie).Update(data)
	c.JSON(http.StatusOK, gin.H{
		"message": "更新成功",
		"status":  http.StatusOK,
		"data":    data,
	})
}

// 删除列表
func movieDelete(c *gin.Context) {
	id := com.StrTo(c.Param("id")).MustInt()
	fmt.Println(id, "--")

	db.Where("id=?", id).Delete(Movie{})
	c.JSON(http.StatusOK, gin.H{
		"message": "删除成功",
		"status":  http.StatusOK,
		"data":    id,
	})
}

```

### golang 并发

channels(多个 goroutine 间的数据通信与同步)

> 并发：值同一时刻，系统通过调度，来回切换交替的运行多个任务，看起来像同时进行
> 并行： 指同一时刻，两个或多个任务真正的同时进行

```go
c := make(chan string) //  创建一个channel
go func(){
	time.Sleep(1 * time.Second)
	c <- "message from closure" // 发送数据到channel中
}()
msg :<-c // 阻塞直到接受数据
```

select(从多个 chanel 中读取或写入数据)

```go
select{
	case v := <-c1:
		fmt.Println("channel 1 sends",v)
	case v := <-c2:
		fmt.Println("channel 2 sends",v)
	default:
		fmt.Println("neither channel was ready")
}
```
