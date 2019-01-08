### webpack中的less配置及在less中增加css Module配置
```javascript
{
  test: /\.less$/,
  use: [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
        modules: true,  //在less中开启css module
        localIndetName: "[name]__[local]__[hash:base64:5]" //css module编译后的css名
      },
    },
    {
      loader: require.resolve('less-loader') // compiles Less to CSS
    }
  ],
}
```     
#### 下面两句就是配置css Module
> - modules: true,  //在less中开启css module
>  - localIndetName: "[name]__[local]__[hash:base64:5]" //css module编译后的css名


----

### 配置代码检查eslint与格式化代码
> vscode 安装插件 Prettier、Vetur、ESlint。
> 配置全局 setting.json:
```javascript
{
  //代码格式保存时格式化配置
  "files.autoSave": "off",
  "editor.tabSize": 2,
  "window.zoomLevel": 0,
  "editor.fontLigatures": true,
  "editor.fontFamily": "'Fira Code Retina', Consolas, 'Courier New', monospace",
  "editor.fontSize": 16,
  "editor.lineHeight": 24,
  "javascript.implicitProjectConfig.experimentalDecorators": true,
  "javascript.updateImportsOnFileMove.enabled": "never",
  "git.ignoreMissingGitWarning": true,
  "emmet.triggerExpansionOnTab": true,
  "prettier.singleQuote": true,
  "prettier.semi": true,
  "editor.formatOnSave": true,
  "terminal.integrated.shell.windows": "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",

  //eslint配置
  "vetur.validation.template": false,
  "prettier.disableLanguages": [],
  "prettier.eslintIntegration": true,
  "eslint.autoFixOnSave": true,
  "eslint.alwaysShowStatus": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    {
      "language": "vue",
      "autoFix": true
    }
  ]
}
```

> 配置工作区 setting.json:
```javascript
"settings": {
  "eslint.validate": [
    "javascript", { "autoFix": true, "language": "vue" }
  ]
}
```
