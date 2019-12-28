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
