// pages/reading_history/reading_history.js

const app = getApp()
const db = wx.cloud.database();
let user_info = app.globalData.user_info;
Page({
  data: {
    article:{}
  },

  onLoad: function (options) {
    let user_info = app.globalData.user_info;
    
  },

  
})