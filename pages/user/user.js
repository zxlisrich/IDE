// pages/user/user.js
const app = getApp()
const db = wx.cloud.database();
let user_info = {}
Page({
  data: {
    nick_name: '',
    avatar_url: '',
    isLogin: false,
  },
   onLoad: function () {
    user_info = app.globalData.user_info;
    this.set_data();
  },
  set_data(){
    console.log(user_info);
    let isLogin = user_info.isLogin;
    this.setData({
      isLogin
    })
    if (isLogin) {
      this.setData({
        nick_name: user_info.nick_name,
        avatar_url: user_info.avatar_url,
      })

    }
  },

  bindTapmy: function (e) {
    console.log(app.globalData.isLogin)
    let id = e.currentTarget.id;
    console.log("id = ", id)
    console.log(app.globalData);
    if (app.globalData.isLogin == false) {
      wx.showToast({
        title: "请先登录", // 提示的内容
        icon: "warn", // 图标，默认success
        image: "../../images/警告 (2).png", // 自定义图标的本地路径，image 的优先级高于 icon
        mask: false, // 是否显示透明蒙层，防止触摸穿透
      })
    } else {
      if (id == "tiji") {
        wx.navigateTo({
          url: '../../pages/my_tiji_center/my_tiji_center',
        })
      }
      else if (id == "colloction") {
        wx.navigateTo({
          url: '../../pages/my_tiji_center/my_tiji_center',
        })
      }
      else if (id == "record") {
        wx.navigateTo({
          url: '../../pages/my_tiji_center/my_tiji_center',
        })
      }
      else if (id == "plan") {
        wx.navigateTo({
          url: '../../pages/my_tiji_center/my_tiji_center',
        })

      }

    }

  },
  getUserProfile() {
    wx.getUserProfile({
      desc: "你好"
    }).then(res => {
      let _this = this
      console.log('what ?res', res);
      db.collection("ide_user_info").add({
        data:
        {
          nick_name: res.userInfo.nickName,
          avatar_url: res.userInfo.avatarUrl,
          isLogin: true,
        }

      })
      this.setData({
        nick_name: res.userInfo.nickName,
        avatar_url: res.userInfo.avatarUrl,
        isLogin: true
      })
      app.globalData.isLogin = true

    })
    this.onLoad()
  },


})