### SQL 的概念

- 什么是 SQL
  Structured Query Language : 结构化查询语句
  其实就是定义了操作所有关系型数据库的规则

- SQl 通用语法

  1.SQL 语句可以单行或者多行书写，以分号结尾  
  2.可使用空格或缩进来增强语句的可读性
  3.MYSQL 数据库的 SQL 语句不区分大小写，关键词建议使用大写  
  4.三种注释:单行注释 -- 或 # ，多行注释 /_注释_/

- SQL 分类

1. DDL 数据定义语言
   > 用来定义数据库对象：数据库，表，列等。关键词：create，drop,alter 等
2. DML 数据库操作语言
   > 用来对数据库中表的数据进行增删改查。关键词：insert,delete,update 等
3. DQl 数据查询语言
   > 用来查询数据库中标的记录。关键词：select，where 等
4. DCl 数据控制语言
   > 用来定义数据库的访问权限和安全级别，及穿件用户。关键词：GRANT，REVOKE 等

#### DDL:操作数据库、表

- 创建 db3 数据库，判断是否存在，如果不存在则创建并定制字符为 utf-8
  > create database if not existes db3 character set utf-8

查询所有数据库的名称 `show databases;`

选择一个数据库 `use test;` # use 数据库名称

查看某个库中的表 `show tables;`

查询某个表中的数据 `select * from users;` # `select * from 表名`

查看某个表的信息 `desc users;` # desc 表名

修改数据库的字符集 `alter database 数据库名称 character set 字符集名称;`

删除数据库 `drop database 数据库名称;`

- 操作数据库：CRUD
  1.C(Create):创建
  2.R(Retrieve):查询
  3.U(Update):修改
  4.D(Delete):删除

#### 创建表

create table student(
id int,
name varchar(32),
age int,
score double(4,1),
birthday date,
create_time timestamp
)

添加一列

> alter table students add sex varchar(10);

#### DQL:查询表中的记录

`select * from 表名`

语法：select 字段列表 from 表名列表 where 条件列表 group by 分组字段 having 分组之后的条件 order by 排序 limit 分页限定

条件查询

- where 子句就跟条件
- 运算符

> 模糊查询
> `SELECT * from admins WHERE`name`LIKE '%xiao%'`

```js
>、<、<=、>=、=、<>
BETWEEN...AND
IN(集合)
LIKE
IS NULL
and // 与
or // 或
not // 非

order by 字段名 asc  // 升序
order by 字段名 desc  // 降序
```

外键约束

```js
CREATE TABLE empoyee(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20),
  age INT,
  dep_id INT, // 外键对应主表的主键
  constraint emp_dept_fk FOREIGN KEY (dep_id) REFERENCES department (id)  // emp_dept_fk 关联empoyee和department表，关键外键为dep_id,关联到department的id字段
)
```

- 删除外键
  ALTER TABLE 表名 DROP FOREIGN KEY 外键名称

- 创建表之后，添加外键
  ALTER TABLE 表名 ADD CONSTEAINT 外键名称 FOREIGN KEY (外键字段名称) REFERENCES 主表名称(主表列表名称)

- 级联操作 1.添加级联操作
  语法：ALTER TABLE 表名 ADD CONSTRAINT 外建名称 FOREIGN KEY (外建字段名称) REFERENCES 主表名称(主表列名) ON UPDATE CASCADE ON DELETE CASADE

  2.分类： 1.级联更新：ON UPDATE CASCADE 2.级联删除：ON DELETE CASCADE

显式内连接：

- 语法：select 字段列表 from 表名 1 inner join 表名 2 on 条件
  例如：
  ```js
  select * from emp join dept on emp.`dept_id` = dept.`id`
  ```

-- 查询员工工资小于平均工资的人

```js
select * from emp where emp.salary < (select avg(aslary) from emp)  // salary字段为emp表中的工资字段，avg(salary)为计算的平均工资
```

-- 查询 admins 表中 name 为 sisi 的 id 值

```js
SELECT id from admins WHERE `name`='sisi';
```

-- 下面两个查询方法是等价的，都是查询 name 为 sisi 或 coco

```js
SELECT * from admins WHERE `name`='sisi' or `name`='coco';
SELECT * from admins WHERE `name` IN('sisi','coco')
```

-- AND 查询表示必须满足两个条件

```js
SELECT * from admins WHERE `name`='sisi' AND `sex`='girl'
```

-- 查询员工入职日期是 2018-11-11 日之后的员工信息和部门信息

```js
// 子查询
select * from dept t1,(select * from emp where emp.`join_date` > '2018-11-11') t2 where t1.id = t2.dept_id;
```

```js
// 左关联查询
select t1.enname,t1.mgr,t2.`id`,t2.`enname` from emp t1 left join emp t2 on t1.`mgr` = t2.`id`
```

```js
// 多表查询
select
  t1.`ename`,
  t1.`salary`,
  t2.`jname`,
  t2.`description`,
  t3.`dname`,
  t3.`log`,
  t4.`grade`
from
  emp t1,job t2,dept t3,salarygrade t4
where
  t1.`job_id` = t2.`id`
  and t1.`dept_id` = t3.`id`
  and t1.`salary` between t4.`losalary` and t4.`hisalary`;

// emp t1,job t2 表示t1为emp表的别名，t2为job表的别名，where是查询条件，例如：t1中的job_is等于t2中的id的字段
```

- 事务默认自动提交
  事务提交的两种方式：
  **_自动提交_**

* mysql 就是自动提交的
* 一条 DML（增删改）语句会自动提交一次事务
  **_手动提交_**
* 需要先开启事务，再提交

事务的四大特征：

- 原子性：是不可分割的最小操作单位，要么同时成功，要么同时失败
- 持久性：当事务提交或回滚后，数据库会持久化的保存数据
- 隔离性：多个事务之间，相互独立
- 一致性：事务操作前后，数据总量不变

---

条件表达式可以用<条件 1> AND <条件 2>表达满足条件 1 并且满足条件 2。
例如，符合条件“分数在 80 分或以上”，并且还符合条件“男生”，把这两个条件写出来：
就可以写出 WHERE 条件：`score >= 80 AND gender = 'M'`：

```sql
SELECT * FROM students WHERE score >= 80 AND gender = 'M';
```

第二种条件是<条件 1> OR <条件 2>，表示满足条件 1 或者满足条件 2。
例如，把上述 AND 查询的两个条件改为 OR，查询结果就是“分数在 80 分或以上”或者“男生”，满足任意之一的条件即选出该记录：
很显然 OR 条件要比 AND 条件宽松，返回的符合条件的记录也更多。

```sql
SELECT * FROM students WHERE score >= 80 OR gender = 'M';
```

第三种条件是 NOT <条件>，表示“不符合该条件”的记录。
例如，写一个“不是 2 班的学生”这个条件，可以先写出“是 2 班的学生”：class_id = 2，再加上 NOT：`NOT class_id = 2`：

```sql
SELECT * FROM students where not id > 2
```

要组合三个或者更多的条件，就需要用小括号()表示如何进行条件运算。
例如，编写一个复杂的条件：分数在 80 以下或者 90 以上，并且是男生：

```sql
SELECT * FROM students WHERE (score < 80 OR score > 90) AND gender = 'M';
```

如果不加括号，条件运算按照 NOT、AND、OR 的优先级进行，即 NOT 优先级最高，其次是 AND，最后是 OR。加上括号可以改变优先级。

使用=判断相等 score = 80 name = 'abc' 字符串需要用单引号括起来
使用>判断大于 score > 80 name > 'abc' 字符串比较根据 ASCII 码，中文字符比较根据数据库设置
使用>=判断大于或相等 score >= 80 name >= 'abc'
使用<判断小于 score < 80 name <= 'abc'
使用<=判断小于或相等 score <= 80 name <= 'abc'
使用<>判断不相等 score <> 80 name <> 'abc'
使用 LIKE 判断相似 name LIKE 'ab%' name LIKE '%bc%' %表示任意字符，例如'ab%'将匹配'ab'，'abc'，'abcd'

使用 `SELECT * FROM <表名> WHERE <条件>`可以选出表中的若干条记录。
我们注意到返回的二维表结构和原表是相同的，即结果集的所有列与原表的所有列都一一对应。

```sql
select name,id from students where id > 5
```

使用 SELECT 列 1, 列 2, 列 3 FROM ...时，还可以给每一列起个别名，
这样，结果集的列名就可以与原表的列名不同。它的语法是 SELECT 列 1 别名 1, 列 2 别名 2, 列 3 别名 3 FROM ...。.
例如，以下`SELECT`语句将列名`score`重命名为`points`，而`id`和`name`列名保持不变：

```sql
select id, score points,name from studengts;
```

### 排序

可以加上 ORDER BY 子句。例如按照成绩从低到高进行排序：

```sql
/* 按score从低到高*/
select id ,name ,gender,score from students order by score;
/* 按score从高到低*/
select id ,name ,gender,score from students order by score desc;
```

![按score排序](https://i.loli.net/2020/01/08/o7HUxil3q5MSaJN.png)

如果 score 列有相同的数据，要进一步排序，可以继续添加列名。
例如，使用 ORDER BY score DESC, gender 表示先按 score 列倒序，如果有相同分数的，再按 gender 列排序：

```sql
SELECT id, name, gender, score FROM students ORDER BY score DESC, gender;
```

默认的排序规则是 ASC：“升序”，即从小到大。ASC 可以省略，即 ORDER BY score ASC 和 ORDER BY score 效果一样。

如果有 WHERE 子句，那么 ORDER BY 子句要放到 WHERE 子句后面。例如，查询一班的学生成绩，并按照倒序排序：

```sql
SELECT id, name, gender, score
FROM students
WHERE class_id = 1
ORDER BY score DESC;
```

现在，我们把结果集分页，每页 3 条记录。要获取第 1 页的记录，可以使用 LIMIT 3 OFFSET 0：

```sql
SELECT id, name, gender, score
FROM students
ORDER BY score DESC
LIMIT 3 OFFSET 0;
```

上述查询 LIMIT 3 OFFSET 0 表示，对结果集从 0 号记录开始，最多取 3 条。注意 SQL 记录集的索引从 0 开始。

类似的，查询第 3 页的时候，OFFSET 应该设定为 6:

```sql
SELECT id, name, gender, score
FROM students
ORDER BY score DESC
LIMIT 3 OFFSET 6;
```

- `LIMIT`总是设定为`pageSize`；
- `OFFSET`计算公式为`pageSize * (pageIndex - 1)`。
