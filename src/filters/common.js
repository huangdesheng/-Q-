//去掉换行符
export function brReplace(value) {
  if (!value) return "";
  return value.replace(/<br\/>/g, "");
}

//隐藏用户手机号中间四位
export function hidePhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
