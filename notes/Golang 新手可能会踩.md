### Golang 新手可能会踩的坑

1.左大括号 `{`不能单独放一行
在其他大多数语言中，{ 的位置你自行决定。Go 比较特别，遵守分号注入规则（automatic semicolon injection）：编译器会在每行代码尾部特定分隔符后加 ; 来分隔多条语句，比如会在 ) 后加分号：

```go
// 错误示例
func main()
{
 println("hello golang")
}

// 正确示例
func main(){
  println("hello golang")
}
```

2. 未使用的变量
   如果在函数体代码中有未使用的变量，则无法通过编译，不过全局变量声明但不使用是可以的。

```go
// 错误示例
var gvar int     // 全局变量，声明不使用也可以

func main() {
    var one int     // error: one declared and not used
    two := 2    // error: two declared and not used
    var three int    // error: three declared and not used
    three = 3
}


// 正确示例
// 可以直接注释或移除未使用的变量
func main() {
    var one int
    _ = one

    two := 2
    println(two)

    var three int
    one = three

    var four int
    four = four
}
```

3. 未使用的 import
   如果你 import 一个包，但包中的变量、函数、接口和结构体一个都没有用到的话，将编译失败。

```go
// 错误示例
import (
    "fmt"    // imported and not used: "fmt"
    "log"    // imported and not used: "log"
    "time"    // imported and not used: "time"
)

func main() {
}


// 正确示例
// 可以使用 goimports 工具来注释或移除未使用到的包
import (
    _ "fmt"
    "log"
    "time"
)

func main() {
    _ = log.Println
    _ = time.Now
}
```

4. 简短声明的变量只能在函数内部使用

```go
// 错误示例
myvar := 1    // syntax error: non-declaration statement outside function body
func main() {
}

// 正确示例
var myvar = 1
func main() {
}
```

5. 使用简短声明来重复声明变量
   不能用简短声明方式来单独为一个变量重复声明， := 左侧至少有一个新变量，才允许多变量的重复声明：

```go
// 错误示例
func main() {
    one := 0
    one := 1 // error: no new variables on left side of :=
}


// 正确示例
func main() {
    one := 0
    one, two := 1, 2    // two 是新变量，允许 one 的重复声明。比如 error 处理经常用同名变量 err
    one, two = two, one    // 交换两个变量值的简写
}
```

6. 不能使用简短声明来设置字段的值
   struct 的变量字段不能使用 := 来赋值以使用预定义的变量来避免解决：

```go
// 错误示例
type info struct {
    result int
}

func work() (int, error) {
    return 3, nil
}

func main() {
    var data info
    data.result, err := work()    // error: non-name data.result on left side of :=
    fmt.Printf("info: %+v\n", data)
}

// 正确示例
func main(){
  var data info
  var err error

  data.result,err = work()
  if err !=nil{
    fmt.Prinln(err)
    return
  }
  fmt.Printf("info: %+v\n", data)
}
```

7. 不小心覆盖了变量
   对从动态语言转过来的开发者来说，简短声明很好用，这可能会让人误会 := 是一个赋值操作符。

如果你在新的代码块中像下边这样误用了 :=，编译不会报错，但是变量不会按你的预期工作

```go
func main() {
    x := 1
    println(x)        // 1
    {
        println(x)    // 1
        x := 2
        println(x)    // 2    // 新的 x 变量的作用域只在代码块内部
    }
    println(x)        // 1
}
```

8. 显式类型的变量无法使用 nil 来初始化
   nil 是 interface、function、pointer、map、slice 和 channel 类型变量的默认初始值。但声明时不指定类型，编译器也无法推断出变量的具体类型。

```go
// 错误示例
func main() {
    var x = nil    // error: use of untyped nil
    _ = x
}


// 正确示例
func main() {
    var x interface{} = nil
    _ = x
}
```

9. 直接使用值为 nil 的 slice、map
   允许对值为 nil 的 slice 添加元素，但对值为 nil 的 map 添加元素则会造成运行时 panic

```go
// map 错误示例
func main() {
    var m map[string]int
    m["one"] = 1        // error: panic: assignment to entry in nil map
    // m := make(map[string]int)// map 的正确声明，分配了实际的内存
}


// slice 正确示例
func main() {
    var s []int
    s = append(s, 1)
}
```

10. map 容量
    在创建 map 类型的变量时可以指定容量，但不能像 slice 一样使用 cap() 来检测分配空间的大小：

```go
// 错误示例
func main(){
  m := make(map[string]int,90)
  println(cap(m)) // error: invalid argument m1 (type map[string]int) for cap
}
```

11. string 类型的变量值不能为 nil
    对那些喜欢用 nil 初始化字符串的人来说，这就是坑：

```go
// 错误示例
func main() {
    var s string = nil    // cannot use nil as type string in assignment
    if s == nil {    // invalid operation: s == nil (mismatched types string and nil)
        s = "default"
    }
}


// 正确示例
func main() {
    var s string    // 字符串类型的零值是空串 ""
    if s == "" {
        s = "default"
    }
}
```

12. Array 类型的值作为函数参数
    在 Go 中，数组是值。作为参数传进函数时，传递的是数组的原始值拷贝，此时在函数内部是无法更新该数组的：

```go

// 数组使用值拷贝传参
func main() {
    x := [3]int{1,2,3}

    func(arr [3]int) {
        arr[0] = 7
        fmt.Println(arr)    // [7 2 3]
    }(x)
    fmt.Println(x)            // [1 2 3]    // 并不是你以为的 [7 2 3]
}

//直接使用 slice：即使函数内部得到的是 slice 的值拷贝，但依旧会更新 slice 的原始数据（底层 array）
// 会修改 slice 的底层 array，从而修改 slice
func main() {
    x := []int{1, 2, 3}
    func(arr []int) {
        arr[0] = 7
        fmt.Println(x)    // [7 2 3]
    }(x)
    fmt.Println(x)    // [7 2 3]
}
```

13. range 遍历 slice 和 array 时混淆了返回值

- 与其他编程语言中的 for-in 、foreach 遍历语句不同，Go 中的 range 在遍历时会生成 2 个值，第一个是元素索引，第二个是元素的值：

```go
// 错误示例
func main(){
  x := []string{"a","b","c"}
  for v:= range x{
    fmt.Println(v) //1,2,3
  }
}


// 正确示例
func main() {
    x := []string{"a", "b", "c"}
    for _, v := range x {    // 使用 _ 丢弃索引
        fmt.Println(v)  // a b c
    }
}
```

14. slice 和 array 其实是一维数据

- 看起来 Go 支持多维的 array 和 slice，可以创建数组的数组、切片的切片，但其实并不是。

- 对依赖动态计算多维数组值的应用来说，就性能和复杂度而言，用 Go 实现的效果并不理想

15. 访问 map 中不存在的 key

o 则会返回元素对应数据类型的零值，比如 nil、'' 、false 和 0，取值操作总有值返回，故不能通过取出来的值来判断 key 是不是在 map 中。

检查 key 是否存在可以用 map 直接访问，检查返回的第二个参数即可：

```go
// 错误的 key 检测方式
func main() {
    x := map[string]string{"one": "2", "two": "", "three": "3"}
    if v := x["two"]; v == "" {
        fmt.Println("key two is no entry")    // 键 two 存不存在都会返回的空字符串
    }
}

// 正确示例
func main() {
    x := map[string]string{"one": "2", "two": "", "three": "3"}
    if _,ok := x["two"];!ok{
      fmt.Println("key two is no entry")
    }
}
```

16. string 类型的值是常量，不可更改

尝试使用索引遍历字符串，来更新字符串中的个别字符，是不允许的。
string 类型的值是只读的二进制 byte slice，如果真要修改字符串中的字符，将 string 转为 []byte 修改后，再转为 string 即可

```go
// 修改字符串的错误示例
func main(){
  x := "text"
  x[0] = "T"  // error: cannot assign to x[0]
  fmt.Println(x)
}

// 修改示例
func main(){
  x := "text"
  xBytes := []byte(x)
  xBytes[0]= "T"  // 注意此时的 T 是 rune 类型
  x = string(xBytes)
  fmt.Println(x)  // Text
}

// 更新字串的正确姿势：将 string 转为 rune slice（此时 1 个 rune 可能占多个 byte），直接更新 rune 中的字符
func main(){
  x := "text"
  xRunes := []rune(x)
  xRunes[0] = "我"
  x = string(xRunes)
  fmt.Prinln(x) // 我ext
}
```

17. string 与 byte slice 之间的转换

- 在 map[string] 中查找 key 时，使用了对应的 []byte，避免做 m[string(key)] 的内存分配
- 使用 for range 迭代 string 转换为 []byte 的迭代：for i,v := range []byte(str) {...}

18. string 与索引操作符

- 对字符串用索引访问返回的不是字符，而是一个 byte 值

```go
func main(){
  x := "ascii"
  fmt.Prinln(x[0]) // 97
  fmt.Println("%T\n",x[0]) // uint8
}
```

19. 字符串并不都是 UTF8 文本

```go
func main() {
    str1 := "ABC"
    fmt.Println(utf8.ValidString(str1))    // true

    str2 := "A\xfeC"
    fmt.Println(utf8.ValidString(str2))    // false

    str3 := "A\\xfeC"
    fmt.Println(utf8.ValidString(str3))    // true    // 把转义字符转义成字面值
}
```

20. 字符串的长度

```go
func main(){
  char := "♥"
  fmt.Prinln(len(char)) // 3
}
```

21. 在多行 array、slice、map 语句中缺少 , 号

```go
// 声明语句中 } 折叠到单行后，尾部的 , 不是必需的。
func main() {
    x := []int {
        1,
        2    // syntax error: unexpected newline, expecting comma or }
    }
    y := []int{1,2,}
    z := []int{1,2}
    // ...
}
```

22. log.Fatal 和 log.Panic 不只是 log

```go
func main() {
    log.Fatal("Fatal level log: log entry")        // 输出信息后，程序终止执行
    log.Println("Nomal level log: log entry")
}
```

23. 对内建数据结构的操作并不是同步的

- 尽管 Go 本身有大量的特性来支持并发，但并不保证并发的数据安全，用户需自己保证变量等数据以原子操作更新。
- goroutine 和 channel 是进行原子操作的好方法，或使用 "sync" 包中的锁。

24. range 迭代 string 得到的值

```go
func main() {
    data := "A\xfe\x02\xff\x04"
    for _, v := range data {
        fmt.Printf("%#x ", v)    // 0x41 0xfffd 0x2 0xfffd 0x4    // 错误
    }

    for _, v := range []byte(data) {
        fmt.Printf("%#x ", v)    // 0x41 0xfe 0x2 0xff 0x4    // 正确
    }
}
```

25. range 迭代 map

- Go 的运行时是有意打乱迭代顺序的，所以你得到的迭代结果可能不一致。但也并不总会打乱，得到连续相同的 5 个迭代结果也是可能的，如：

```go
func main() {
    m := map[string]int{"one": 1, "two": 2, "three": 3, "four": 4}
    for k, v := range m {
        fmt.Println(k, v)
    }
}
```

26. switch 中的 fallthrough 语句

- switch 语句中的 case 代码块会默认带上 break，但可以使用 fallthrough 来强制执行下一个 case 代码块。

27. 自增和自减运算

- 很多编程语言都自带前置后置的 ++、-- 运算。但 Go 特立独行，去掉了前置操作，同时 ++、— 只作为运算符而非表达式。

```go
// 错误示例
func main() {
    data := []int{1, 2, 3}
    i := 0
    ++i            // syntax error: unexpected ++, expecting }
    fmt.Println(data[i++])    // syntax error: unexpected ++, expecting :
}


// 正确示例
func main() {
    data := []int{1, 2, 3}
    i := 0
    i++
    fmt.Println(data[i])    // 2
}
```

28. 按位取反

- 很多编程语言使用 ~ 作为一元按位取反（NOT）操作符，Go 重用 ^ XOR 操作符来按位取反：

```go
// 错误的取反操作
func main() {
    fmt.Println(~2)        // bitwise complement operator is ^
}


// 正确示例
func main() {
    var d uint8 = 2
    fmt.Printf("%08b\n", d)        // 00000010
    fmt.Printf("%08b\n", ^d)    // 11111101
}
```

29. 运算符的优先级

```go
Precedence    Operator
    5             *  /  %  <<  >>  &  &^
    4             +  -  |  ^
    3             ==  !=  <  <=  >  >=
    2             &&
    1             ||
```

30. 不导出的 struct 字段无法被 encode

```go
func main() {
    in := MyData{1, "two"}
    fmt.Printf("%#v\n", in)    // main.MyData{One:1, two:"two"}

    encoded, _ := json.Marshal(in)
    fmt.Println(string(encoded))    // {"One":1}    // 私有字段 two 被忽略了

    var out MyData
    json.Unmarshal(encoded, &out)
    fmt.Printf("%#v\n", out)     // main.MyData{One:1, two:""}
}
```

31. 程序退出时还有 goroutine 在执行

- 常用解决办法：使用 "WaitGroup" 变量，它会让主程序等待所有 goroutine 执行完毕再退出。

```go
// 等待所有 goroutine 执行完毕
// 进入死锁
func main() {
    var wg sync.WaitGroup
    done := make(chan struct{})

    workerCount := 2
    for i := 0; i < workerCount; i++ {
        wg.Add(1)
        go doIt(i, done, wg)
    }

    close(done)
    wg.Wait()
    fmt.Println("all done!")
}

func doIt(workerID int, done <-chan struct{}, wg sync.WaitGroup) {
    fmt.Printf("[%v] is running\n", workerID)
    defer wg.Done()
    <-done
    fmt.Printf("[%v] is done\n", workerID)
}
```

32. 向无缓冲的 channel 发送数据，只要 receiver 准备好了就会立刻返回

```go
func main() {
    ch := make(chan string)

    go func() {
        for m := range ch {
            fmt.Println("Processed:", m)
            time.Sleep(1 * time.Second)    // 模拟需要长时间运行的操作
        }
    }()

    ch <- "cmd.1"
    ch <- "cmd.2" // 不会被接收处理
}
```

33. 向已关闭的 channel 发送数据会造成 panic

```go
func main() {
    ch := make(chan int)
    done := make(chan struct{})

    for i := 0; i < 3; i++ {
        go func(idx int) {
            select {
            case ch <- (idx + 1) * 2:
                fmt.Println(idx, "Send result")
            case <-done:
                fmt.Println(idx, "Exiting")
            }
        }(i)
    }

    fmt.Println("Result: ", <-ch)
    close(done)
    time.Sleep(3 * time.Second)
}
```
