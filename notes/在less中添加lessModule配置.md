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
  - localIndetName: "[name]__[local]__[hash:base64:5]" //css module编译后的css名