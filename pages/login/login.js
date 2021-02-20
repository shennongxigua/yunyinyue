// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '', // 手机号
    password: '', // 用户密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 表单项内容发生改变的回调
  handleInput(event) {
    // let type = event.currentTarget.id; // id传值  取值 phone || password
    let type = event.currentTarget.dataset.type; // 自定义属性传值  data-key = value 
    this.setData({
      [type]: event.detail.value
    })
  },

  // 登录
  async login() {
    let { phone, password } = this.data;
    let reg_tel = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;    //11位手机号码正则
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
      })
      return;
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
      })
      return;
    }
    if (!reg_tel.exec(this.data.phone)) {
      // 验证不通过
      wx.showToast({
        title: '手机号不合法',
        icon: 'none',
      })
      return;
    }
    // 验证通过发起登录请求
    let result = await request('/login/cellphone', { phone, password, isLogin: true });
    if (result.code === 200) {// 登录成功
      wx.showToast({
        title: '登录成功',
      })
      // 本地存储用户信息
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    } else if (result.code === 400) {
      wx.showToast({
        title: '手机号错误',
        icon: 'none',
      })
      return;
    } else if (result.code === 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'none',
      })
    } else {
      wx.showToast({
        title: '登录失败，请重新登录',
        icon: 'none',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})