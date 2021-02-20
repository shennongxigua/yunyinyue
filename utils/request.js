/* 发送ajax请求 */
/* 
  1. 封装功能函数
    1. 功能点明确
    2. 函数内部应该保留固定代码
    3. 减懂爱的数据抽象成形参，由使用者自身的情况传入 
    4. 一个良好的功能函数应该设置形参的默认值  es6的形参默认值
  2. 封装功能组件
    1. 功能点明确
    2. 组件内保留静态的代码
    3. 将动态的数据抽取成props参数，由使用者根据自身的情况以标签属性的形式传入props数据
    4. 一个良好的组件应该设置组件的必要性和数据类型
      props: {
        msg: {
          require: true,
          default: 默认值,
          type: String
        }
      }
*/
import config from './config'
export default (url, data = {}, method = 'GET') => {
  return new Promise((resovle, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('MUSIC_U') ? wx.getStorageSync('MUSIC_U').find(item => item.indexOf('MUSIC_U') !== -1) : ''
      },
      success: (res) => {
        if (data.isLogin) { // 登录请求
          // 将cookie存入至本地
          wx.setStorage({
            data: res.cookies,
            key: 'MUSIC_U',
          })
        }
        resovle(res.data);
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}