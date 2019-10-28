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
