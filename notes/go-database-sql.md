### database-sql 学习

引入 database 源文件和 mysql 驱动

```go
import (
  "database/sql"
  _ "github.com/go-sql-driver/mysql" // _表示只引入init函数部分
)
```

创建 sql.DB 连接,返回一个\*sql.DB

```go
func main(){
  db,err := sql.Open("mysql","user:password@tcp(127.0.0.1:3306)/hello")
  if err != nil{
    log.Fatal(err)
  }
  defer db.Close()
}
```

检查 database 数据库是否可用

```go
err = db.Ping()
if err != nil{
  // do something
}
```

db.Query()函数向数据库查询并返回一组行的数据
我们将为 id 为 1 的用户查询 users 表，并打印出该用户的 id 和姓名。我们将使用 rows.Scan()将结果分配给变量，每次一行

```go
var (
  id int
  name string
)

rows,err := db.Query("select id,name from users where id = 1 ?",1) // 查询并返回一组行的数据
if err != nil{
  log.Fatal(err)
}
defer rows.Close() // 推迟关闭数据库连接
for rows.Next(){ // for rows.Next 循环读取rows的数据
  err := rows.Scan(&id,&name) // 把每一行的id和name读入变量
  if err != nil{
    log.Fatal(err)
  }
  log.Println(id,name)
}
err = rows.Err()
if err != nil{
  log.Fatal(err)
}
```

db.Prepare 预处理语句，它可以为执行语句时提供的参数提供占位符(即绑定值)。
这比串接字符串要好得多，这是出于所有常见的原因(例如，避免 SQL 注入攻击)。

```go
stmt, err := db.Prepare("select id,name from users where id = ?")
if err != nil{
  log.Fatal(err)
}
defer stmt.Close()
rows,err := stmt.Query(1)
if err != nil{
  log.Fatal(err)
}
defer rows.Close()
for rows.Next(){
  err := rows.Scan(&id,&name) // 把每一行的id和name读入变量
  if err != nil{
    log.Fatal(err)
  }
  log.Println(id,name)
}
if err = rows.Err(); err != nil {
	log.Fatal(err)
}
```

单行查询

```go
var name string
err =db.Query("select name from users where id = ?",1).Scan(&name)
if err !=nil{
  log.Fatal(err)
}
fmt.Println(name)
```

使用 Exec()，最好使用一个准备好的语句，来完成插入、更新、删除或其他不返回行的语句

```go
stmt,err := db.Prepare("insert into users(name) values(?)")
if err != nil{
  log.Fatal(err)
}
res,err := stmt.Exec("Dolly")
if err !=nil{
  log.Fatal(err)
}
lastId,err := res.LastInsertId()
if err != nil{
  log.Fatal(err)
}
rowCnt, err := res.RowsAffected()
if err != nil {
	log.Fatal(err)
}
log.Printf("ID = %d, affected = %d\n", lastId, rowCnt)


/*
它们不会做相同的事情，而且永远不应该像这样使用Query()。查询()将返回一个sql.Rows，
*/
_, err := db.Exec("DELETE FROM users")  // OK
_, err := db.Query("DELETE FROM users") // BAD
```

在事务中处理准备好的语句时必须谨慎

```go
tx,err := db.Begin()
if err != nil{
  log.Fatal(err)
}
defer tx.Rollvack()
stmt,err := tx.Prepare("insert into foo values(?)")
if err != nil{
  log.Fatal(err)
}
defer stmt.Close()
for i:=0;i <10;i++{
  _,err = stmt.Exec(i)
  if err != nil{
    log.Fatal(err)
  }
}
err = tx.Commit()
if err != nil{
  log.Fatal(err)
}
```

迭代结果集的错误

```go
if rows.Next(){
  //...
}
if err = rows.Err();err != nil{
  //...
}
```

```go
cols,err := rows.Columns()
vals := make([]interface{},len(cols))
for i,_ := range cols{
  vals[i] = new(sql.RawBytes)
}
for rows.Next(){
  err = rows.Scan(vals...)
}
```

```go
rows,err := db.Query("select * from tbll")
for rows.Next(){
  err = rows.Scan(&myvariable)
  db.Query("select * from tb12 where id = ?",myvariable)
}
```

但是事务只绑定到一个连接，所以这在事务中是不可能的

```go
tx,err := db.Begin()
rows,err := tx.Query("select * from tbl1")
for rows.Next(){
  err = rows.SCan($myvariable)
  tx.Query("select * from tbl2 where id =?",myvariable)
}
```
