// pages/dongtaicenter/dongtaicenter.js
const  util = require('../../utils/util.js')
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
        comments:{}
      },
      {
        id:1,
        value:'点赞',
        num: 0,
        isActive:false,
        likes:{}
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
        collections:{}
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
      reading_num:0,
      is_like:false,
      is_collection:true
    },
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar
  },

  bottom_click(e){
    console.log(e);
    let contents = this.data.contents;
    let tabs = this.data.tabs;
    let value = e.currentTarget.dataset.title;
    let time = util.formatTime(new Date());
    let temp = {};
    if(value == 'like')  {
      contents.is_like = true;
      tabs[1].likes.num++;
      temp.avatar_url = user_info.avatar_url;
      temp.nick_name = user_info.nick_name;
      temp.time = time;
      console.log(tabs[1].likes.persons);
      tabs[1].likse.persons.push(temp);
      user_info.like_articles.push(contents._id);
    }
    else if(value == "collection"){
      contents.is_collection = true;
      tabs[3].collections.num++;
      temp.avatar_url = user_info.avatar_url;
      temp.nick_name = user_info.nick_name;
      temp.time = time;
      tabs[3].collections.persons.push(temp);
      user_info.collection_article.push(contents._id);
    }
    this.setData({
      contents,
      tabs
    })
    this.onLoad();
    this.update_user_data();
  },
  isCard(e) {
    this.setData({
      isCard: e.detail.value
    })
  },

  async update_user_data() {
    let that = this
    await db.collection("ide_user_info").where({
      _openid:app.globalData.user_id
    }).update({
      data: {
        history_article:user_info.history_article,
        like_articles:user_info.like_articles,
        collection_article:user_info.collection_article,
      },
    }).then(res => {
    })
    await db.collection("user_discussion_data").where({
      _openid:that.data.contents._id
    }).update({
      data: {
        comments:that.data.tabs[0].comments,
        collections:that.data.tabs[3].collections,
        like:that.data.tabs[1].likes,
      },
    }).then(res => {
    })

  },

  onLoad: function(options){
    article_id = options.article_id;
    user_info = app.globalData.user_info;
    if(user_info.history_article == undefined) user_info.history_article = []
    user_info.history_article.push(article_id);
    if(user_info.like_articles == undefined) user_info.like_articles = [];   //初始化点赞数组
    if(user_info.collection_article == undefined) user_info.collection_article = [];  //初始化收藏数组
    console.log(article_id);
    console.log(user_info);
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
      if(contents.is_collection == undefined) contents.is_collection = false
      if(contents.is_like == undefined) contents.is_like = false;
      let{tabs}= that.data;
      tabs[0].comments.num = data.comments;
      tabs[1].likes = data.like;
      tabs[3].collections = data.collections;
      that.setData({
        tabs,
        contents
      })
      console.log(tabs);
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