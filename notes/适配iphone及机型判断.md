### 适配Iphone
1，iphone清除input默认样式
---  
`-webkit-appearance:none;`
    
2，苹果手机默认行为 
```js
-webkit-touch-callout:none;
-webkit-user-select:none;
-khtml-user-select:none;
-moz-user-select:none;
-ms-user-select:none;
user-select:none;
-o-user-select:none;
```

3，苹果滑动卡顿（设置overflow:auto;）
---
`-webkit-overflow-scrolling: touch;`

4,点击会出现闪烁
---
`-webkit-tap-highlight-color:rgba(0,0,0,0);`

5，解决ios双击页面上移问题
```js
   //在项目中测试不紧input/button这些表单控件有这个问题，p,div等也有问题，于是乎就直接在body开刀了
   (function(){
       var agent = navigator.userAgent.toLowerCase();        //检测是否是ios
       var iLastTouch = null;                                //缓存上一次tap的时间
       if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0){
           document.body.addEventListener('touchend', function(event){
               var iNow = new Date().getTime();
               iLastTouch = iLastTouch || iNow + 1 /** 第一次时将iLastTouch设为当前时间+1 */ ;
               var delta = iNow - iLastTouch;
               if (delta < 500 && delta > 0){
                   event.preventDefault();
                   return false;
               }
               iLastTouch = iNow;
           }, false);
       }
   })();
```

6，机型判断
```js
function platform(){ // 判断手机平台
   var system = 'other';
   var browser = {
      versions: function() {
         var u = navigator.userAgent, app = navigator.appVersion;
         return {
            trident: u.indexOf('Trident') > -1,
            presto: u.indexOf('Presto') > -1,
            webKit: u.indexOf('AppleWebKit') > -1,
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            iPhone: u.indexOf('iPhone') > -1 ,
            mac: u.indexOf('Mac') > -1,
            iPad: u.indexOf('iPad') > -1,
            webApp: u.indexOf('Safari') == -1 ,
            wx: u.indexOf('MicroMessenger') > -1 ,
            wb: u.indexOf('Weibo') > -1
         };
      }(),
      language: (navigator.browserLanguage || navigator.language).toLowerCase()
   };
   if (browser.versions.android) { // android
      system = 'android';
   }else if(browser.versions.iPhone || browser.versions.ios || browser.versions.iPad){
      system = 'ios';
   }else{
      system = 'pc';
   }
   return system;
}
```

7，判断是否是微信环境
```js
function detectPlatform(){ // 判断是否是微信
   var system = 'other';
   var browser = {
      versions: function() {
         var u = navigator.userAgent, app = navigator.appVersion;
         return {
            trident: u.indexOf('Trident') > -1,
            presto: u.indexOf('Presto') > -1,
            webKit: u.indexOf('AppleWebKit') > -1,
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            iPhone: u.indexOf('iPhone') > -1 ,
            mac: u.indexOf('Mac') > -1,
            iPad: u.indexOf('iPad') > -1,
            webApp: u.indexOf('Safari') == -1 ,
            wx: u.indexOf('MicroMessenger') > -1 ,
            wb: u.indexOf('Weibo') > -1
         };
      }(),
      language: (navigator.browserLanguage || navigator.language).toLowerCase()
   };
   if (browser.versions.wx) { // 微信
      system = 'wx';
   }
   return system;
}
```
