export const textReplace = (str) => {
  if (str) {
    return str.replace(/\n|\r\n/g, "<br/>");
  }
}

export const brReplace = (str) => {
  if (str) {
    return str.replace(/<br\/>/g, "\n");
  }
}
