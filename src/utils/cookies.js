import Cookies from 'js-cookie';

export function cookieSet(name, value) {
  return Cookies.set(name, value);
}
export function cookieGet(name) {
  return Cookies.get(name);
}
//清除所有cookie
export function clearAllCookie() {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (var i = keys.length; i--;) {
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
    }
  }
}

//获取单个cookie值
export function getCookieValue(c_name) {
  let cookieName = encodeURIComponent(c_name) + "=",
    cookieStart = document.cookie.indexOf(cookieName),
    cookieValue = null;
  if (cookieStart > -1) {
    let cookieEnd = document.cookie.indexOf(";", cookieStart);
    if (cookieEnd == -1) {
      cookieEnd = document.cookie.length;
    }
    cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd)).replace(/\"/g, "");
  }
  return cookieValue;
}
