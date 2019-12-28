### 接口 interface

接口（interface）是调用方和实现方均需要遵守的一种约束，约束开发者按照统一的方法命名、参数类型、数量来处理具体业务。实际上，接口就是一组没有实现的方法声明，到某个自定义类型要使用该方法时，根据具体情况把这些方法实现出来。接口语法

```go
type 接口类型名 interface {
	方法名1(参数列表) 返回值列表
	方法名2(参数列表) 返回值列表
	...
}
```

示例

```go
package main

import "fmt"

//  接口
type Transporter interface{
  BicycleTran()
  CarTran()
}

// 结构图
type Driver struct{
  Name string
  Age int
}

/*
 实现接口的方法
*/
func (d *Driver) BicycleTran(){
  fmt.Prinln("使用自行车运输")
}

func (d *Driver) CarTran(){
  fmt.Prinln("使用小汽车运输")
}

func mian(){
  d := &Driver{
    "张三",
    27
  }
  d.BicycleTran()
}

```

### Go 接口的特点

在上述示例中，Go 无须像 Java 那样显式声明实现了哪个接口，即为非侵入式，接口编写者无需知道接口被哪些类型实现，接口实现者只需要知道实现的是什么样子的接口，但无需指明实现了哪个接口。编译器知道最终编译时使用哪个类型实现哪个接口，或者接口应该由谁来实现。

```go
type Service interface{
  Start()
  Log(string)
}

// 日志
type Logger struct{
}

// 日志输出方法
func (g *Logger) Log(s string){
  fmt.Prinln("日志",s)
}

// 游戏服务
type GameService struct{
  Logger
}

// 实现游戏服务的Start方法
func (g *GameService) Start(){
  fmt.Prinln("游戏服务启动")
}

fun main(){
  s := new(GameService)
  s.Start()
  s.Log("hello")
}
```

### 接口嵌套

Go 中不仅结构体之间可以嵌套，接口之间也可以嵌套。接口与接口嵌套形成了新的接口，只要接口的所有方法被实现，则这个接口中所有嵌套接口的方法均可以被调用

```go
// 定义一个写接口
type Writer interface{
  Write(p []byte) (n int, e error)
}

// 定义一个读接口
type Reader interface{
  Read() error
}

// 定义一个嵌套接口
type Io interface{
  Writer()
  Read()
}
```

### 空接口

空接口是接口的特殊形式，没有任何方法，因此任何具体的类型都可以认为实现了空接口

```go
var ant interface{}
any = 1
any ="hello"
fmt.Prinln(any)

// 空接口作为函数参数：
func Test (i interface{}){
  fmt.Printf("%v\n",i)
}

func main(){
  Test(3)
  Test("hello")
}

// 利用空接口，可以实现任意类型的存储
m := make(map[string]interface{})
m["name"] = "李四"
m["age"] = 30
```
