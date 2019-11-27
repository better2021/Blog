### Go 标准库中 database/sql 包文档

当 QueryRow 没有返回一个行时， Scan 将返回 ErrNoRows 。 在这种情况下， QueryRow 将返回一个 \*Row 占位符值， 从而将这个错误推延至 Scan

```go
var ErrNoRows = errors.New("sql: no rows in result set")
```

当用户尝试在事务中执行一个已经提交又或者已经回滚的操作时， 就会返回一个 ErrTxDone

```go
var ErrTxDone = errors.New("sql:ransaction has already been committed or rolled back)
```

DB 是一个数据库句柄， 它代表的是包含着零个或多个底层连接的池（pool）。 多个 goroutine 可以安全地、并发地使用这个句柄。
当 DB.Begin 被调用时， 它返回的 Tx 将与单个连接绑定， 而当事务提交或者回滚时， 这个连接将返回至 DB 的闲置连接池。 闲置连接池的大小可以通过 SetMaxIdleConns 来控制

```go
type DB struct{
  //...
}
```

Open 函数会根据给定的数据库驱动以及驱动专属的数据源来打开一个数据库， 驱动专属的数据源一般至少会包含数据库的名字以及相关的连接信息
大多数用户都会通过驱动专属的辅助函数来打开数据库， 这种函数会返回一个指向 DB 结构的指针
通过调用 Ping 可以检查给定的数据源是否有效。

```go
// (*DB) Begin 方法
// 开启一个事务， 事务的隔离级别由驱动决定
func (db *DB) Begin() (*Tx,error){}

// (*DB) BeginTx 方法
func (db *DB) BeginTx(ctx context.Context,opts *TxOptions)(*Tx,error){}

```

关闭数据库并释放所有已打开的资源
因为 DB 句柄通常会长时间存在， 并且会有多个 goroutine 进行分享， 所以用户一般不需要手动地关闭数据库

```go
func (db *DB) close() error
```

返回数据库的底层驱动

```go
func (db *DB) Driver() driver.Driver
```

执行指定的查询， 但不返回任何数据行。 方法的 arg 部分用于填写查询语句中包含的占位符的实际参数。

```go
// (*DB) Exec 方法
func (db *DB) Exec(query string,args ...interface{}) (Result,error)
```

检查数据库连接是否仍然有效， 并在有需要时建立一个连接

```go
// (*DB)Ping方法
func (db *DB) Ping() error
```

为之后的查询或执行（execution）创建预处理语句， 多个查询或者执行可以并发地使用 Prepare 返回的预处理语句。 当调用者不再需要这个预处理语句时， 它必须调用这个语句的 Close 方法

```go
// (*DB) Prepare 方法
func (db *DB) Prepare(query string) (*Stmt,error)
```

执行一个查询并返回多个数据行， 这个查询通常是一个 SELECT 。 方法的 arg 部分用于填写查询语句中包含的占位符的实际参数

```go
// (*DB) Query 方法
func (db *DB) Query(query string,args ...interface{}) (*Rows,error)

// 例子
age := 27
rows,err := db.Query("select name from users where age=?",age)
if err != nil{
  log.Fatal(err)
}
defer rows.Close()
for rows.Next(){
  var name string
  if err := rows.Scan(&name); err != nil{
    log.Faral(err)
  }
  fmt.Printf("%s us %d\n",name,age)
}

if err := rows.Err();err !=nil{
  log.Fatal(err)
}
```

执行一个预期最多只会返回一个数据行的查询。
这个方法总是会返回一个非空的值， 而它引起的错误则会被推延到数据行的 Scan 方法被调用为止

```go
// (*DB) QueryRow方法
func (db *DB) QueryRow(query string,args ...interface{}) *Row

// 例子
id := 133
var username string
err := db.QueryRow("select username from where id = ?",id).Scan(&username)
switch{
  case err = sql.ReeNiRows:
    log.Prinf("No user whth that ID")
  case err != nil{
    log.Fatal(err)
  }
  default:
    fmt.Printf("Username is %s\n",username)
}
```

设置可以重用连接的时长
过期的连接可以在重用之前惰性地进行关闭。

```go
func (db*DB) SetConnMaxLifetime (d time.Duration)
```

设置闲置连接池里面最多可放置的连接数量

```go
func (db *DB) SetMaxIdleConns(n int)
```

设置最大可创建的数据库连接数量

```go
func (db *DB) SetMaxOpenConns(n int)
```

返回数据库的统计数据

```go
//  (*db* DB) Stats() DBStats
func (db *DB) Stats() DBStats
```

Row 是调用 QueryRow 查询单个数据行所得的结果

```go
// Row 类型
type Row struct{
  // ...
}
```

Scan 会将被匹配数据行中的各个列复制到 dest 指向的值里面， 更多细节请参考 Rows.Scan 方法的文档。 如果有多个数据行与查询匹配， 那么 Scan 将使用第一个数据行并丢弃其他所有数据行。 如果没有任何数据行与查询匹配， 那么 Scan 将返回 ErrNoRows

```go
// (r *Row) Scan方法
func (r *Row) Scan(dest ...interface) error
```

Rows 是查询的结果

```go
type Rows struct{
  // ...
}
```

它的游标会从结果集的第一个数据行开始， 而用户则可以通过 Next 来遍历结果集中的所有数据行

```go
rows,err := db.Query("select ...")

defer rows.Close()
for rows.Next(){
  var id int
  var name string
  err = rows.Scan(&id,&name)
}
err = rows.Err()
```
