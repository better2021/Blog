## git 的常用技巧

Git 是一个`分布式版本管理工具`，gitgub 的代码上传就是用的 git，git 比 svn 强大很多。
下面就来介绍一下 git 的命令和一些小技巧吧

### git 的常用命令

```js
git init
```

> `git init`是使用 git 的第一个命令，它会初始化一个 Git 仓库，执行该命令后会在当前的目录生成一个.git 目录

---

```js
git clone
git clone --depth=1 httpsxxxxx.git // clone 最新一次提交
```

> `git clone`可以从现有的仓库地址拷贝项目到本地

---

```js
git add .
```

> `git add`命令用来将文件添加到暂存区，`git add .`就是把当前项目的所有文件添加到暂存区

---

```js
git status
```

> `git status`命令用于查看项目的当前状态

---

```js
git diff
```

> `git diff`用于比较两次修改的差异(检查本地改动)

---

```js
git commit -m'xxx'
```

> 使用 `git add` 命令将想要快照的内容写入缓存区， 而执行 `git commit` 将缓存区内容添加到仓库中

---

```js
git push origin master
```

> 推送代码到远程的 master 分支

---

```js
git pull [remote] [branch] // 取回远程仓库的变化，并与本地分支合并
git branch // 列出所有本地分支
git branch -r // 列出所有远程分支
git checkout -b [branch] //新建一个分支，并切换到该分支
git checkout [branch-name] // 切换到指定分支，并更新工作区
git merge [branch] // 合并指定分支到当前分支
```

### git 修改远程仓库地址

> 修改命令

```js
git remote set-url origin [url]
```

> 先删后加

```js
git remote rm origin``git remote add origin [url]
```

> 强制提交（会覆盖）

```js
git push origin master -f
```

### 常用的小技巧

```js
// 删除本地分支
git branch -d [branch-name]

// 删除远程分支
git push origin --delete [remote-branchname]

// 重命名本地分支
git branch -m [new-branch-name]

// 显示当前分支的版本历史
git log

// 命令后面可以列出文件或者目录的名字
git rm PROJECTS.md

// 显示当前分支的最近几次提交
git reflog

// 下载远程仓库的所有变动
git fetch [remote]

// 添加地址到远程仓库
git remote add origin [remote-url]

// 列出所有的远程仓库
git remote -v

// 提交工作区自上次commit之后的变化，直接到仓库区
git commit -a

// 显示某个远程仓库的信息
git remote show [remote]

// 恢复暂存区的指定文件到工作区
git checkout [file]

// 恢复暂存区的所有文件到工作区
git checkout .

// 重置暂存区与工作区，与上一次commit保持一致
git reset --hard

// 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
git reset --hard [commit]

// 展示忽略的文件
git status --ignored

// 把某一个分支到导出成一个文件
git bundle create [file] [branch-name]
```
