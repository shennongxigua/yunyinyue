// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'
// 获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 标识是否播放
    song: {}, // 歌曲详情对象
    musicId: '', // 音乐的id
    musicLink: '', //存放音乐链接
    currentTime: '00:00', // 实时时间
    durationTime: '00:00', // 总时长
    currentWidth: 0, // 实时进度 单位 %
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId;
    this.setData({
      musicId
    })
    // 获取歌曲详情信息
    this.getMusicInfo(musicId);

    // 获取当前页面的歌曲是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === this.data.musicId) {
      this.setData({
        isPlay: true
      })
    }

    // 创建控制音乐的实例对象
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    /* 监听播放实例的播放/暂停/停止 */
    this.backgroundAudioManager.onPause((res) => {
      console.log(1)
      this.changePlayState(false);
    })
    this.backgroundAudioManager.onPlay((res) => {
      this.changePlayState(true);
      appInstance.globalData.musicId = musicId;
    })
    // 监听音乐自然播放结束
    this.backgroundAudioManager.onEnded(() => {
      // 自动切换到下一首，并且自动播放
      PubSub.publish('switchType','next');
      // 将实时进度条归零
      this.setData({ currentWidth: 0 })
    })
    this.backgroundAudioManager.onStop((res) => {
      console.log(2)
      this.changePlayState(false);
    })
    // 监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {

      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
      let currentWidth = (this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration) * 100;
      this.setData({ currentTime, currentWidth })
    })

    // 订阅来自recommendSong页面发布的id
    PubSub.subscribe('musicId', (msg, musicId) => {
      // 获取音乐的详情信息
      this.getMusicInfo(musicId);
      // 判读当前是否正在播放音乐
      if (this.data.isPlay) {
        //自动播放音乐
        this.musicControl(true, musicId)
      }
    })
  },

  /* 修改播放状态的功能函数 */
  changePlayState(state) {
    this.setData({
      isPlay: state
    })
    // 修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = state;
  },

  /* 点击播放或暂停的回调 */
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    let { musicId, musicLink } = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },

  /* 控制音乐播放/暂停的功能函数 */
  async musicControl(isPlay, musicId, musicLink) {

    if (isPlay) { // 播放
      if (!musicLink) {
        // 获取音乐的播放链接
        let music = await request('/song/url', { id: musicId });
        musicLink = music.data[0].url;
        this.setData({ musicLink })
      }
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name;
    } else { // 暂停
      this.backgroundAudioManager.pause()
    }
  },

  /* 切换歌曲的回调 */
  handleSwitch(e) {
    let type = e.currentTarget.id;
    // 发布消息数据给recommendSong页面
    PubSub.publish('switchType', type)
  },

  /* 根据id查询歌曲详情 */
  async getMusicInfo(id) {
    let songData = await request('/song/detail', { ids: id });
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    console.log(songData)
    this.setData({
      song: songData.songs[0],
      durationTime,
    })
    // 动态设置页面标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
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
    PubSub.unsubscribe('musicId');
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