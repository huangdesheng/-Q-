//http://qxiao.natapp1.cc/qxiao-mp/
//http://ax.qxiao.net/qxiao-mp/
//https://zc.qxiao.net/qxiao-mp/
//http://ring.qxiao.net/qxiao-mp/
//http://qxiaonmq.natapp1.cc/qxiao-mp/
const is_dev = process.env.NODE_ENV !== "production";
export const API_ROOT = is_dev ? " http://huangzhaoming.natapp1.cc/" : "http://ring.qxiao.net/qxiao-mp/";
