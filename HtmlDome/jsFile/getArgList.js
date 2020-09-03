// 获取参数列表
module.exports = function getArgList() {
  let argvs
  const res = {}
  try {
    argvs = JSON.parse(process.env.npm_config_argv).original
  } catch (ex) {
    argvs = process.argv
  }
  const argv = argvs.slice(2)
  for (const i in argv) {
    const key = argv[i].match(/--(\S*)=/)[1]
    const value = argv[i].split('=')[1]
    res[key] = value
  }
  return res
}
