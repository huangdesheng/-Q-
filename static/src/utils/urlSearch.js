//获取地址栏参数
//替换指定传入参数的值,paramName为参数,replaceWith为新值
export function replaceParamVal(paramName, replaceWith) {
  let url = location.href.toString();
  let reg = eval('/(' + paramName + '=)([^&]*)/gi');
  let newUrl = url.replace(reg, paramName + '=' + replaceWith);
  return newUrl;
}

//获取地址栏参数
//这里处理一下链接地址有可能是从微信推送点击进来的
export function urlSearch() {
  let url = decodeURIComponent(location.href).split('?');
  let pars = url[url.length - 1].split('&');
  if (pars.length) {
    let data = {};
    for (let i = 0; i < pars.length; i++) {
      let tmp = pars[i].split('=');
      data[tmp[0]] = tmp[1];
    }
    if (Object.keys(data).length) {
      return data || {};
    }
  } else {
    return -1;
  }
}
