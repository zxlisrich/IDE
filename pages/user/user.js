// pages/user/user.js
const app = getApp()

const db = wx.cloud.database();
Page({
  data:{
    user_info:{
      isLogin: false,
      nick_name: "",
      avatar_url: ""
    },

    
  },

  onShow:function(){

   
    
  },
  bindTapmy:function(e){
    console.log(app.globalData.isLogin)
    let id = e.currentTarget.id;
    console.log("id = ",id)
    console.log(app.globalData);
    if(app.globalData.isLogin == false){
      wx.showToast({
        title: "请先登录", // 提示的内容
        icon: "warn", // 图标，默认success
        image: "../../images/警告 (2).png", // 自定义图标的本地路径，image 的优先级高于 icon
        mask: false, // 是否显示透明蒙层，防止触摸穿透

        
    })
    }else{
      if(id == "tiji"){
        wx.navigateTo({
          url: '../../pages/my_tiji_center/my_tiji_center',
        })
      }
      else if(id == "colloction"){
        wx.navigateTo({
          url: '../../pages/my_tiji_center/my_tiji_center',
        })
      }
      else if(id == "record"){
        wx.navigateTo({
          url: '../../pages/my_tiji_center/my_tiji_center',
        })
      }
      else if(id == "plan"){
        wx.navigateTo({
          url: '../../pages/my_tiji_center/my_tiji_center',
        })

      }

    }

  },
  getUserProfile(){
   
   wx.getUserProfile({
     
     desc:"你好"
   }).then(res =>{
   
  
    let _this = this
     db.collection("user_info").add({
      data:
      {
        nick_name: res.userInfo.nickName,
        avatar_url: res.userInfo.avatarUrl,
        isLogin: true, 
        
      }
     
    })
    this.setData({
      user_info:{
        
        nick_name: res.userInfo.nickName,
        avatar_url: res.userInfo.avatarUrl,
        isLogin:true
      },
     

    })
    app.globalData.isLogin= true
    app.globalData({
      user_head:res.userInfo.avatarUrl,
      user_naem:res.userInfo.nickName,
    })
    console.log("登陆成功："+app.globalData.isLogin)
    
   })
   this.onLoad()
   
   

   
  },
  // console.log("登陆成功："+app.globalData.isLogin)
  onLoad:function(res){
   
    db.collection("user_info").get().then(res =>{
      
      console.log("res=",res)
     
        
      if(res.data.length!=0){
        
        this.setData({
          user_info:{
            nick_name: res.data[0].nick_name,
            avatar_url: res.data[0].avatar_url,
            isLogin: res.data[0].isLogin 
    
          }
        })
  
      }
      app.globalData.isLogin = res.data[0].isLogin ;
       
  
      
      
    })
    
       
      
    

  },
  
})