import Vue from 'vue';
import Router from 'vue-router';

import album from './album';
import baby from './baby';
import classIn from './class';
import clock from './clock';
import community from './community';
import fresh from './fresh';
import home from './home';
import login from './login';
import homework from './home-work';
import notice from './notice';
import recipe from './recipe';
import school from './school';
import share from './share';
import shuttle from './shuttle';
import student from './student';
import teacher from './teacher';
//2019-04-17
import single from './single';
import action from './action';
import prize from './prize';
import wisdom from './wisdom';
import user from './user';
import child from './child';
import examPaper from './examPaper';
import score from './score';
import remark from './remark';
import course from './course';
import works from './works';
import role from './role';
import personality from './personality-plan';
import study from './study-plan';
import help from './help-center';
import about from './about';
import bracelet from './bracelet';
import welcome from './welcome';
import focusJoin from './focus-join';
import schedule from './schedule';
import feed from './feed';
import device from './device';
import edu from './edu-recommend';
import activity from './activity-recommend';
import read from './read-recommend';
import punch from './punch';
import notFound from './not-found';


Vue.use(Router);

export const constantRouterMap = [
  ...album,
  ...baby,
  ...classIn,
  ...clock,
  ...community,
  ...fresh,
  ...home,
  ...login,
  ...homework,
  ...notice,
  ...recipe,
  ...school,
  ...share,
  ...shuttle,
  ...student,
  ...teacher,
  ...single,
  ...action,
  ...prize,
  ...wisdom,
  ...user,
  ...child,
  ...examPaper,
  ...score,
  ...remark,
  ...course,
  ...works,
  ...role,
  ...personality,
  ...study,
  ...help,
  ...about,
  ...bracelet,
  ...welcome,
  ...focusJoin,
  ...schedule,
  ...feed,
  ...device,
  ...edu,
  ...activity,
  ...read,
  ...punch,
  ...notFound
]



export default new Router({
  routes: constantRouterMap,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition && to.meta.keepAlive) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
});
