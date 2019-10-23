import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';

let adapters = new LocalStorage('qxiao');
let db = low(adapters)



// 初始化数据库
db.defaults({
  wx: {
    openId: "",
    tel: "",
    photo: ""
  }
}).write();


export default db;
