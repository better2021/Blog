### python 中的 list 和 tuple

> list 是一种有序的集合，可以随时添加和删除其中的元素
> tuple 是一种有序列表叫元组：tuple，tuple 一旦初始化就不能修改

```py
classmates = ['Michael', 'Bob', 'Tracy']
len(classmates) #3;用len()函数可以获取list元素的个数，索引从0开始
classmates[1] #Bob

classmates.append('hello') #可以往list中追加元素到末尾

classmates.insert(1, 'Jack') #也可以把元素插入到指定的位置，比如索引号为1的位置

classmates.pop() #要删除list末尾的元素，用pop()方法

# python中的条件判断
age = 20
if age >= 18:
  print('your age is',age,'adult')
elif age >=6: # elif是else if的缩写
  print('teenager')
else:
  print('kid')

# python中的for循环
names = ['co','hi','qw']
for name in names:
  print(name) #co hi qw

#Python提供一个range()函数，可以生成一个整数序列，再通过list()函数可以转换为list。比如range(5)生成的序列是从0开始小于5的整数
list(range(5))
[0, 1, 2, 3, 4]

# 字典的key值循环
d = {'a': 1, 'b': 2, 'c': 5}
for key in  d:
  print(key) # a,b,c

# 字典的value值循环
for value in d.values():
  print(value) # 1,2,5

# 字符串也是可迭代对象，因此，也可以作用于for循环
for i in 'asdf':
  print(i)  # a,s,d,f

list(range(2,6)) # [2,3,4,5]

[x * x for x in range(1, 11) if x % 2 == 0] # [4, 16, 36, 64, 100] 筛选出仅偶数的平方

L = ['HELLO','PYTHON']
lower = [s.lower() for s in L]
print(lower) # ['hello','python'] 转化为小写
```
