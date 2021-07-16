// pages/login/login.js
const app = getApp()
Page({
  data: {
    account:null,
    pwd:null,
  },



  
  doLogin(e) {
    let code = '';
    wx.login({
      success: (res) => {
        code = res.code;
      },
    });
    // 获取用户信息
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '用户登录',
      success: (res) => {
        let loginParams = {
          code: code,
          encryptedData: res.encryptedData,
          iv: res.iv,
          rawData: res.rawData,
          signature: res.signature
        };
        _this.postLogin(loginParams);
      },
      // 失败回调
      fail: () => {
        // 弹出错误
        wx.showModal({
          title: '提示',
          content: "用户点击取消",
          success: function (res) {
            if (res.confirm) {
             console.log('用户点击确定')
           }
          }
        })
      }
    });
  },








  // handlerSubmit:function(evt)
  // {
  //   console.log(evt);
  //   //获取用户名和密码
  //   let account = evt.detail.value.account;
  //   let pwd = evt.detail.value.pwd;
  //   const db = wx.cloud.database();//获取数据库引用
  //   const userCollection = db.collection("user");//获取集合（collection）的引用
  //    //通过集合向数据库添加数据
  //   userCollection.add({
  //     data:{
  //       account:account,
  //       pwd:pwd
  //     }
  //   })
  // },
  // getAccount:function(evt)
  // {
  //   this.setData({account:evt.detail.value});//将数据存进data
  //   console.log(this.data.account);
  // },
  // getPwd:function(evt)
  // {
  //   this.setData({pwd:evt.detail.value});//将数据存进data
  //   console.log(this.data.pwd);
  // },
  // reg:function(evt)//注册函数
  // {
  //   const db = wx.cloud.database();
  //   const userCollection = db.collection("user");
  //   let flag = false  //表示账户是否存在,false为初始值

  //   userCollection.get({
  //     success: (res) => {
  //       let user = res.data;  //获取到的对象数组数据
  //       console.log(user);
  //       for (let i = 0; i < user.length; i++) {  //遍历数据库对象集合
  //         if (this.data.account === user[i].account) { //账户已存在
  //           flag = true;
  //           break;
  //         }
  //       }
  //       if (flag === true) {  //账户已存在
  //         wx.showToast({
  //           title: '账号已注册！',
  //           icon: 'error',
  //           duration: 2500
  //         })
  //       }
  //       else {  //账户未注册
  //         userCollection.add({
  //           data:{
  //             account:this.data.account,
  //             pwd:this.data.pwd
  //           }
  //         })
  //         wx.showToast({	//显示注册成功信息
  //           title: '注册成功！',
  //           icon: 'success',
  //           duration: 2500
  //         })
  //         wx.switchTab({	//注册成功后跳转页面
  //           url: "/user/user"
  //         }) 
  //       }
  //     }
  //   })
  // } ,
  // login:function(evt)//登录函数
  // {
  //   const db = wx.cloud.database();
  //   const userCollection = db.collection("user");
  //   let flag = false  //表示账户是否存在,false为初始值
  //   userCollection.get({
  //     success: (res) => {
  //       let user = res.data;
  //       console.log(user);
  //       for (let i = 0; i < user.length; i++) {  //遍历数据库对象集合
  //         if (this.data.account === user[i].account) { //账户已存在
  //           if (this.data.pwd !== user[i].pwd) {  //判断密码正确与否
  //             wx.showToast({  //显示密码错误信息
  //               title: '密码错误！！',
  //               icon: 'error',
  //               duration: 2500
  //             });
  //             i=-1; //密码错误则重头开始遍历数据库对象集合
  //           } else {
  //             wx.showToast({  //显示登录成功信息
  //               title: '登陆成功！！',
  //               icon: 'success',
  //               duration: 2500,
                
  //             })
  //             app.globalData.isLogin = true
  //             flag=true;
  //             wx.switchTab({  //登录成功后跳转页面
  //               url: "../user/user",
  //             })
  //             break;
  //           }
  //         }
  //       };
  //       if(flag==false)//遍历完数据后发现没有该账户
  //       {
  //         wx.showToast({
  //           title: '该用户不存在',
  //           icon: 'error',
  //           duration: 2500
  //         })
  //       }
  //     }
  //   })
  // }


})