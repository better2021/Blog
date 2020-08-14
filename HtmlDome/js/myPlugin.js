/**
 * 1.通过$.extend()来扩展jQuery
 * 2.通过$.fn向JQuery添加新的方法
 * 3.通过$.widget()应用jQuery UI的部件工厂方式创建
 * 在插件名字定义的这个函数内部，this指代的是我们在调用该插件时，用jQuery选择器选中的元素，一般是一个jQuery类型的集合。
 * 比如$('a')返回的是页面上所有a标签的集合，
 * 且这个集合已经是jQuery包装类型了，也就是说，在对其进行操作的时候可以直接调用jQuery的其他方法而不需要再用美元符号来包装一下。
所以在上面插件代码中，我们在this身上调用jQuery的css()方法，也就相当于在调用 $('a').css()
 */

// 我们调用通过$.extend()添加的函数时直接通过$符号调用（$.myfunction()）而不需要选中DOM元素($('#example').myfunction())
$.extend({
  sayHello: function (name) {
    console.log('hello,' + (name ? name : 'jay') + '!');
  },
  log: function (message) {
    var now = new Date(),
      y = now.getFullYear(),
      m = now.getMonth() + 1, //！JavaScript中月分是从0开始的
      d = now.getDate(),
      h = now.getHours(),
      min = now.getMinutes(),
      s = now.getSeconds(),
      time = y + '/' + m + '/' + d + ' ' + h + ':' + min + ':' + s;
    console.log(time + ' My App: ' + message);
    return time;
  },
});

$.sayHello(); // 调用

/**
 * 现在，已经有了外壳，可以开始编写真正的插件代码了。但在这之前，关于上下文我有话要说。
 * 在插件函数的立即作用域中，关键字 this 指向调用插件的 jQuery 对象。这是个经常出错的地方，
 * 因为有些情况下 jQuery 接受一个回调函数，此时 this 指向原生的 DOM 元素。
 * 这常常导致开发者在 jQuery 函数中对 this 关键字多作一次无必要的包装
 */

// 插件编写
(function ($) {
  // 获取页面中高度最大的div高度
  $.fn.maxHeight = function () {
    var max = 0;
    this.each(function () {
      max = Math.max(max, $(this).height());
      min = Math.min(max, $(this).height());
    });
    console.log(`最大的div高度为:${max}px`);
    console.log(`最小的div高度为:${min}px`);
    return max;
  };
})(jQuery);

/**
 * 对于那些提供许多选项、更复杂、更可配置的插件，最佳实践是提供一个默认设置，它可在插件调用时（通过 $.extend）被扩展。
 * 这样调用插件时无需大量参数， 只要一个对象参数，内容为你希望不同于默认值的那部分设置。做法如下：
 */
(function ($) {
  // 默认设置和选项
  $.fn.tooltip = function (options) {
    var setting = $.extend(
      {
        'background-color': 'blue',
      },
      options
    );

    return this.each(function () {
      $(this).css(options);
    });
  };
})(jQuery);
