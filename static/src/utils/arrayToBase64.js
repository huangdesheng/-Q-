/**
 *  Byte数组转Base64字符,原理同上
 * @Param [0x23, 0x02, 0x02, 0x03, 0x24]
 * @return Base64字符串
 **/
export function bytesArrayToBase64(array = []) {
  if (array.length == 0) {
    return "";
  }
  var b64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var result = ""; // 给末尾添加的字符,先计算出后面的字符
  var d3 = array.length % 3;
  var endChar = "";
  if (d3 == 1) {
    var value = array[array.length - 1];
    endChar = b64Chars.charAt(value >> 2);
    endChar += b64Chars.charAt((value << 4) & 0x3f);
    endChar += "==";
  } else if (d3 == 2) {
    var value1 = array[array.length - 2];
    var value2 = array[array.length - 1];
    endChar = b64Chars.charAt(value1 >> 2);
    endChar += b64Chars.charAt(((value1 << 4) & 0x3f) + (value2 >> 4));
    endChar += b64Chars.charAt((value2 << 2) & 0x3f);
    endChar += "=";
  }
  var times = array.length / 3;
  var startIndex = 0; // 开始计算
  for (var i = 0; i < times - (d3 == 0 ? 0 : 1); i++) {
    startIndex = i * 3;
    var S1 = array[startIndex + 0];
    var S2 = array[startIndex + 1];
    var S3 = array[startIndex + 2];
    var s1 = b64Chars.charAt(S1 >> 2);
    var s2 = b64Chars.charAt(((S1 << 4) & 0x3f) + (S2 >> 4));
    var s3 = b64Chars.charAt(((S2 & 0xf) << 2) + (S3 >> 6));
    var s4 = b64Chars.charAt(S3 & 0x3f); // 添加到结果字符串中
    result += s1 + s2 + s3 + s4;
  }
  return result + endChar;
}

/**
 *  十六进制字符串转字节数组
 * @Param ("230203")
 * @return [35,2,3]
 **/
export function hexString2Bytes(str) {
  var pos = 0;
  var len = str.length;
  if (len % 2 != 0) {
    return null;
  }
  len /= 2;
  var arrBytes = new Array();
  for (var i = 0; i < len; i++) {
    var s = str.substr(pos, 2);
    var v = parseInt(s, 16);
    arrBytes.push(v);
    pos += 2;
  }
  return arrBytes;
}

/**
 *  字节数组转十六进制字符串
 * @Param [35,01,216]
 * @return "2301d8"
 **/
export function bytes2HexString(arrBytes) {
  var str = "";
  for (var i = 0; i < arrBytes.length; i++) {
    var tmp;
    var num = arrBytes[i];
    if (num < 0) {
      //此处填坑，当byte因为符合位导致数值为负时候，需要对数据进行处理
      tmp = (255 + num + 1).toString(16);
    } else {
      tmp = num.toString(16);
    }
    if (tmp.length == 1) {
      tmp = "0" + tmp;
    }
    str += tmp;
  }
  return str;
}

//生成校验值
function XX(len = 8) {
  
}