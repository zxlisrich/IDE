// pages/dongtaicenter/dongtaicenter.js
const app = getApp()
const db = wx.cloud.database();
let article = {};
let user_info = {};
let article_id = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:'评论',
        num:0,
        isActive:true,
        persons:[]
      },
      {
        id:1,
        value:'点赞',
        num: 0,
        isActive:false,
        persons:[]
      },
      {
        id:2,
        value:'转发',
        num:0,
        isActive:false,
        persons:[]
      },
      {
        id:3,
        value:'收藏',
        num:0,
        isActive:false,
        persons:[]
      },
    ],
    contents:{
      name:"",
      num:0,
      dianzan_num:0,
      pinglun_num:0,
      share_num:0,
      shoucang_num:0,
      avatar_url:"",
      create_time:"",
      discussion_title:"",
      contents:"",
      pictures:[],
      reading_num:0
     
    },
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar
  },


  isCard(e) {
    this.setData({
      isCard: e.detail.value
    })
  },

  onLoad: function(options){
    article_id = options.article_id;
    console.log(article_id);
    app.loadFont();
   this.get_article_detail();
  },

  async get_article_detail(){
    let that = this
    await db.collection("user_discussion_data").where({
      _id:article_id
    }).get().then(res => {
      console.log(res);
      let data = res.data[0];
      let contents = this.data.contents;
      data.reading_num++;
      contents = data;
      let{tabs}= that.data;
      tabs[0].num = data.comments.num;
      tabs[0].persons = data.comments.persons;
      tabs[1].num = data.like.num;
      tabs[1].persons = data.like.persons;
      tabs[2].num = data.collections.num;
      tabs[1].persons = data.collections.persons;
      tabs[3].num = data.collections.num;
      tabs[0].persons = data.comments.persons;
      that.setData({
        tabs,
        contents
      })
    })
  },
  onUnload: function () {
    wx.navigateBack({
      delta: 2,
    })
  },

  
  preview(e){
    const {index}=e.currentTarget.dataset;
    let pictures = this.data.contents.pictures;
    let temp = pictures[index];
    console.log("pictures",pictures);
    wx.previewImage({
      current: temp, // 当前显示图片的http链接
      urls: pictures // 需要预览的图片http链接列表
    })

  },

  handleTabsItemChange(e){
    // console.log(e);
    const {index} = e.detail;
    let{tabs}= this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },

  

})