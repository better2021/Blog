### 微信sdk的config签名配置

***传给接口的参数url必须是当前地址#前面的地址`location.href.split("#")[0]`***
> 请求config配置参数的接口的ip要加入微信开发者的平台的ip白名单
> 访问的当前域名要绑定到微信开发者平台

```js
$(function() {
        $.ajax({
          url: "https://xxxxxxx/weixin.php",    // 接口的ip要加入微信开发者的平台的ip白名单
          method: "GET",
          dataType: "json",
          data: { url: location.href.split("#")[0] }, // 当前地址#前面的部分，必须要完整的（带http的）
          success: function(res) {
            wx.config({
              debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
              appId: res.data.appId,
              timestamp: res.data.timestamp,
              nonceStr: res.data.nonceStr,
              signature: res.data.signature, // 签名
              jsApiList: [
                "checkJsApi",
                "onMenuShareTimeline",
                "onMenuShareAppMessage"
              ]
            })
          },
          error: function(err) {
            console.log(err)
          }
        })

        let num = getQueryString("id")
        var share_info = {
          title: `🐧我的5月签：${
            num ? dataSource[Number(num)].title : dataSource[0].title
          }`,
          desc: "你也试一下！",
          link: location.href,
          imgUrl: num ? dataSource[Number(num)].imgUrl : dataSource[0].imgUrl
        }

        wx.checkJsApi({
          jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: function(res) {
            alert(JSON.stringify(res))
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          }
        })

        wx.ready(function() {
          wx.onMenuShareAppMessage({
            title: share_info.title,
            desc: share_info.desc,
            link: share_info.link,
            imgUrl: share_info.imgUrl,
            success: function() { // 分享成功后的回调
              document.getElementById("cover").style.display = "none"
            },
            cancel: function() { // 取消分享后的回调
              document.getElementById("cover").style.display = "block"
            }
          })

          wx.onMenuShareTimeline({
            title: share_info.title,
            desc: share_info.desc,
            link: share_info.link,
            imgUrl: share_info.imgUrl,
            success: function() {
              document.getElementById("cover").style.display = "none"
            },
            cancel: function() {
              document.getElementById("cover").style.display = "block"
            }
          })
        })

        wx.error(function(res) {  // config配置错位的信息提示
          //alert(JSON.stringify(res))
        })
      })
      ```
