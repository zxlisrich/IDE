// pages/login/login.js
Page({
  data: {
    account:null,
    pwd:null,
    repwd:null,
  },

  handlerSubmit:function(evt)
  {
    console.log(evt);
    //获取用户名和密码
    let account = evt.detail.value.account;
    let pwd = evt.detail.value.pwd;
    let repwd = evt.detail.value.repwd;
    const db = wx.cloud.database();//获取数据库引用
    const userCollection = db.collection("user");//获取集合（collection）的引用
     //通过集合向数据库添加数据
    userCollection.add({
      data:{
        account:account,
        pwd:pwd
      }
    })
  },
  getAccount:function(evt)
  {
    this.setData({account:evt.detail.value});//将数据存进data
    console.log(this.data.account);
  },
  getPwd:function(evt)
  {
    this.setData({pwd:evt.detail.value});//将数据存进data
    console.log(this.data.pwd);
  },
  reg:function(evt)//注册函数
  {
    const db = wx.cloud.database();
    const userCollection = db.collection("user");
    let flag = false  //表示账户是否存在,false为初始值

    userCollection.get({
      success: (res) => {
        let user = res.data;  //获取到的对象数组数据
        console.log(user);
        for (let i = 0; i < user.length; i++) {  //遍历数据库对象集合
          if (this.data.account === user[i].account) { //账户已存在
            flag = true;
            break;
          }
        }
        if (flag === true) {  //账户已存在
          wx.showToast({
            title: '账号已注册！',
            icon: 'error',
            duration: 2500
          })
        }
        else {  //账户未注册
          userCollection.add({
            data:{
              account:this.data.account,
              pwd:this.data.pwd
            }
          })
          wx.showToast({	//显示注册成功信息
            title: '注册成功！',
            icon: 'success',
            duration: 2500
          })
          wx.switchTab({	//注册成功后跳转页面
            url: "/user/user"
          }) 
        }
      }
    })
  } ,

})