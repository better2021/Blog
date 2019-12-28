### 封装

封装：把抽象出的字段和对字段的操作封装在一起,数据被保护在内部,程序的其它包只有通过被授权的操作(方法),才能对字段进行修改，其作用有

- 隐藏实现细节
- 可以对数据进行验证，保证安全合理

```go
// person.go文件
package person

import "fmt"

type person struct{
  Name string
  age int //年龄是隐私，不允许其他包访问,所以小写
}

// 工厂函数
func NewPerson(name string) *person{
  return &person{
    Name:name
  }
}

func (p *person) SetAge(age int){
  if age > 0 && age < 150{
    p.age = age
  }else{
    fmt.Println("年龄不合法")
  }
}

func (p *person) GetAge() int{
  return p.age
}
```

```go
// main.go文件
package main
import(
  "demo/person"
  "fmt"
)

func main(){
  p:= person.NewPerson("Tom")
  p.SetAge(18)
  fmt.Prinln(p)
}

```

### 继承

在 Golang 中，如果一个 struct 嵌套了另一个匿名结构体，那么这个结构体可以直接访 问匿名结构体的字段和方法，从而实现了继承特性。

```go
package main
import "fmt"

type Father struct{
  Name string
  age int
}

func (f *Father) run(){
  fmt.Prinln(f.Name + "running")
}

type Son struct{
  Father
}

func main(){
  var s Son
  s.Name = "Tom"
  s.age = 18
  s.run()
}
```

### 多态
