### redis 学习

1.字符串(string)

- SET key value 设置指定 key 值
- GET key 获取指定 key 的值

```py
# 对不存在的键进行设置

redis 127.0.0.1:6379> SET key "value"
OK

redis 127.0.0.1:6379> GET key
"value"

# 对已存在的键进行设置

redis 127.0.0.1:6379> SET key "new-value"
OK

redis 127.0.0.1:6379> GET key
"new-value"
```

2.哈希(hash)

> hash 是一个 string 类型的 field 和 value 的映射表，hash 特别适合用于存储对象。

- HDEL key field1 [filed2] 删除一个或者多个哈希表字段
- HEXISTS key fileld 查看哈希表 key 中，指定的字段是否存在
- HGET key fileld 获取存储在哈希表中的值
- HGETALL key 获取哈希表中指定 key 的所有字段和值
- HKEYS key 获取所有哈希表中的字段
- HLEN key 获取哈希表中的数据

```py
redis 127.0.0.1:6379> HSET myhash field1 "foo"
(integer) 1
redis 127.0.0.1:6379> HDEL myhash field1
(integer) 1
redis 127.0.0.1:6379> HDEL myhash field2
(integer) 0

# 如果哈希表含有给定字段，返回 1 。 如果哈希表不含有给定字段，或 key 不存在，返回 0 。
redis 127.0.0.1:6379> HSET myhash field1 "foo"
(integer) 1
redis 127.0.0.1:6379> HEXISTS myhash field1
(integer) 1
redis 127.0.0.1:6379> HEXISTS myhash field2
(integer) 0

# 字段存在

redis> HSET site redis redis.com
(integer) 1

redis> HGET site redis
"redis.com"


# 字段不存在

redis> HGET site mysql
(nil)
```

3.列表(List)

> Redis 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）
> 一个列表最多可以包含 232 - 1 个元素 (4294967295, 每个列表超过 40 亿个元素)。

- LPUSH key value1 [value2] 将一个或多个值插入到列表头部
- LLEN key 获取列表的长度
- LPOP key 移出并获取列表的第一个元素
- BLPOP key1 [key2 ] timeout 移出并获取列表的第一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止
- LINDEX key index 通过索引获取列表中的元素

```py
redis 127.0.0.1:6379> LPUSH runoobkey redis
(integer) 1
redis 127.0.0.1:6379> LPUSH runoobkey mongodb
(integer) 2
redis 127.0.0.1:6379> LPUSH runoobkey mysql
(integer) 3
redis 127.0.0.1:6379> LRANGE runoobkey 0 10

1) "mysql"
2) "mongodb"
3) "redis"


redis 127.0.0.1:6379> LPUSH mylist "World"
(integer) 1

redis 127.0.0.1:6379> LPUSH mylist "Hello"
(integer) 2

redis 127.0.0.1:6379> LINDEX mylist 0
"Hello"

redis 127.0.0.1:6379> LINDEX mylist -1
"World"

redis 127.0.0.1:6379> LINDEX mylist 3        # index不在 mylist 的区间范围内
(nil)
```

4.集合(Set)

> Redis 的 Set 是 String 类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据。
> Redis 中集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是 O(1)。
> 集合中最大的成员数为 232 - 1 (4294967295, 每个集合可存储 40 多亿个成员)。

- SADD key member1 [member2] 向集合添加一个或多个成员
- SCARD key 获取集合的成员数
- SDIFF key1 [key2] 返回给定所有集合的差集

```py
redis 127.0.0.1:6379> SADD runoobkey redis
(integer) 1
redis 127.0.0.1:6379> SADD runoobkey mongodb
(integer) 1
redis 127.0.0.1:6379> SADD runoobkey mysql
(integer) 1
redis 127.0.0.1:6379> SADD runoobkey mysql
(integer) 0
redis 127.0.0.1:6379> SMEMBERS runoobkey

1) "mysql"
2) "mongodb"
3) "redis"
```
