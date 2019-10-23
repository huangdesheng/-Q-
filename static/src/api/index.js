import * as album from './module/album'; //班级相册
import * as clock from './module/clock'; //考勤管理
import * as community from './module/community'; //班级圈
import * as fresh from './module/fresh'; //新鲜报
import * as homework from './module/homework'; //作业
import * as manage from './module/manage'; //
import * as notice from './module/notice'; //通知公告
import * as recipe from './module/recipe'; //营养食谱
import * as user from './module/user'; //用户
import * as classes from './module/classes'; //班级
import * as wx from './module/wx'; //微信相关

import * as action from './module/action'; //行为
import * as prize from './module/prize'; //奖励
import * as homeStat from './module/homeStat'; //在家表现统计
import * as lesson from './module/lesson'; //课程
import * as remark from './module/remark'; //评语
import * as role from './module/role'; //角色相关
import * as works from './module/works'; //作品展
import * as process from './module/process'; //
import * as teacher from './module/teacher'; //老师管理
import * as deletes from './module/delete'; //删除用户功能
import * as feed from './module/feed'; //留言
import * as mail from './module/mail'; //邮件发送
import * as schedule from './module/schedule'; //课表
import * as expression from './module/expression';
import * as bracelet from './module/bracelet';
import * as director from './module/director';
import * as image from './module/image';
import * as data from './module/data';
export default {
  ...album,
  ...clock,
  ...community,
  ...fresh,
  ...homework,
  ...manage,
  ...notice,
  ...recipe,
  ...user,
  ...classes,
  ...wx,
  ...action,
  ...prize,
  ...homeStat,
  ...lesson,
  ...remark,
  ...role,
  ...works,
  ...process,
  ...teacher,
  ...deletes,
  ...feed,
  ...mail,
  ...schedule,
  ...expression,
  ...bracelet,
  ...director,
  ...image,
  ...data
}
