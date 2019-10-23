import ax from '../axios';

//邮箱发送
export function sendEmail(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/mail/sendEmail.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
