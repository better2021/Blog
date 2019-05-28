### git修改远程仓库地址
> 修改命令
`git remote set-url origin [url]`

> 先删后加
`git remote rm origin`
`git remote add origin [url]`

> 强制提交（会覆盖）
`git push origin master -f`

