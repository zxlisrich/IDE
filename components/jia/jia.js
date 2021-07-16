// components/jia/jia.js]
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showView:false,
    list:[
      {
        img:"https://6465-dev-2gzxo1d2dc39c5e3-1305581356.tcb.qcloud.la/images/home/write_/%E5%86%99%20(1).png?sign=3a95b0016f0d55436f90296d16db3651&t=1618922704",
        title:"写动态"
      },
      {
        img:"https://6465-dev-2gzxo1d2dc39c5e3-1305581356.tcb.qcloud.la/images/home/write_/%E5%86%99%20(1).png?sign=3a95b0016f0d55436f90296d16db3651&t=1618922704",
        title:"写动态"
      },
      {
        img:"https://6465-dev-2gzxo1d2dc39c5e3-1305581356.tcb.qcloud.la/images/home/write_/%E5%86%99%20(1).png?sign=3a95b0016f0d55436f90296d16db3651&t=1618922704",
        title:"写动态"
      },
      {
        img:"https://6465-dev-2gzxo1d2dc39c5e3-1305581356.tcb.qcloud.la/images/home/write_/%E5%86%99%20(1).png?sign=3a95b0016f0d55436f90296d16db3651&t=1618922704",
        title:"写动态"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChangeShowState:function(){
      var that=this;
      that.setData({
       showView:(!that.data.showView)
      })
      },
      bindTap(){
        console.log("isLogin:"+app.globalData.isLogin)
        if(app.globalData.isLogin==false){
          wx.switchTab({
            url: '../../pages/user/user',
          })
        }else{
          wx.navigateTo({
            url: '../../pages/writes/writes',
          })

        }
       
      }

  }
})
