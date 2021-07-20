// app.js
wx.cloud.init()
const db = wx.cloud.database()
App({
  kaiping: false,
  loadFont() {
    wx.loadFontFace({
      family: '方正仿宋',
      source: 'https://6465-dev-2gzxo1d2dc39c5e3-1305581356.tcb.qcloud.la/%E6%96%B9%E6%AD%A3%E4%BB%BF%E5%AE%8B.TTF?sign=88e684c62837e52e8c33c365e14e03ee&t=1618238117',
      success(res) {
        console.log('res', res)
      },
      fail(err) {
        console.log('err', err)
      },
      complete(res) {
        console.log('complete', res)
      }
    })
  },
  onLaunch: function () {
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true
      })
    }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    }),
      wx.cloud.callFunction({
        name: 'getopenid',//调用云函数获取用户唯一openid
        complete: res => {
          const openid = res.result.openid
          this.globalData.user_id = openid;
          console.log("app.openid", res);
        }
      })
    this.get_data();
  },

  async get_data() {
    await db.collection("ide_user_info").where({ _openid: this.globalData.user_id }).get().then(res => {
      if(res.data[0].isLogin){
        this.globalData.user_info = res.data[0];
      }
      console.log("user_info:",this.globalData.user_info);
    })

  },
  globalData: {
    user_info: {},
    user_id: '',
    openid: '',
    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#cce6ff'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
    ]
  }

})
