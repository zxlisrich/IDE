// pages/reading_history/reading_history.js

const app = getApp()
const db = wx.cloud.database();
let user_info = app.globalData.user_info;
Page({
  data: {
    article:[]
  },


  onLoad: function () {
    user_info = app.globalData.user_info;
    console.log(user_info);
    this.get_data()
  },

  async get_data() {
    let temp = user_info.collection_article;
    let article = []
    for(let i = 0; i<temp.length; i++){
      await db.collection("user_discussion_data").where({ _id: temp[i] }).get().then(res => {
        console.log(temp[i],res);
        let obj_a = {}
        obj_a =  res.data[0];
        if(obj_a != null) article.push(obj_a);
    })

    }
    this.setData({
      article
    })

  },

  
})