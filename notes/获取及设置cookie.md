
```javascript
//获取cookie
function getCookie(name) {
  let arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
}

//设置cookie
const setCookie = (key,value,domain=null)=>{
  const Days = 30;
  let exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  let str = key + '=' + escape(value) + ';expires=' + exp.toGMTString();
  if(domain){
    str += `;domain=${domain};path=/`; 
  }
  document.cookie = str;
  console.log(str,getCookie('token'),'获取token')
}

export { getCookie , setCookie}
```