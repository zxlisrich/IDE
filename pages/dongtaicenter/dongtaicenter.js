// pages/dongtaicenter/dongtaicenter.js
const util = require('../../utils/util.js')
const app = getApp()
const db = wx.cloud.database();
let user_info = {};
let article_id = "";
let temp = {};
let reply_index = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '评论',
        num: 0,
        isActive: true,
        comments: []
      },
      {
        id: 1,
        value: '点赞',
        num: 0,
        isActive: false,
        likes: []
      },
      {
        id: 2,
        value: '转发',
        num: 0,
        isActive: false,
        persons: []
      },
      {
        id: 3,
        value: '收藏',
        num: 0,
        isActive: false,
        collections: []
      },
    ],
    contents: {
      name: "",
      num: 0,
      dianzan_num: 0,
      pinglun_num: 0,
      share_num: 0,
      shoucang_num: 0,
      avatar_url: "",
      create_time: "",
      discussion_title: "",
      contents: "",
      pictures: [],
      reading_num: 0,
      is_like: false,
      is_collection: true
    },
    show_comment: false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    textareaAValue: '',
    textareaBValue:'',
  },

  like_collection(e) {
    let t = temp;
    let time = util.formatTime(new Date());
    let contents = this.data.contents;
    let tabs = this.data.tabs;
    let value = e.currentTarget.dataset.title;
    t.time = time;
    if (value == 'like') {
      contents.is_like = !contents.is_like;
      if (!contents.is_like) {
        let index_a = (tabs[1].likes || []).findIndex((item) => item == temp);   //找到用户在点赞列表的位置
        tabs[1].likes.splice(index_a, 1);   //删除用户信息
        let index_u = (user_info.like_articles || []).findIndex((item) => item == article_id);  //同上
        user_info.like_articles.splice(index_u, 1);
      } else {
        tabs[1].likes.push(t);
        user_info.like_articles.push(contents._id);
      }

    }
    else if (value == "collection") {
      contents.is_collection = !contents.is_collection;
      if (!contents.is_collection) {
        let index_a = (tabs[3].collections || []).findIndex((item) => item == temp);   //找到用户在点赞列表的位置
        tabs[3].collections.splice(index_a, 1);   //删除用户信息
        let index_u = (user_info.collection_article || []).findIndex((item) => item == article_id);  //同上
        user_info.collection_article.splice(index_u, 1);
      } else {
        tabs[3].collections.push(t);
        user_info.collection_article.push(contents._id);
      }
    }
    this.setData({
      contents,
      tabs
    })
    this.onLoad();
    this.update_article_data();
    this.update_user_data();

  },
  isCard(e) {
    this.setData({
      isCard: e.detail.value
    })
  },
  showModal(e) {   //展示评论输入框
    console.log(e);
    if(e.currentTarget.dataset.index!=undefined) reply_index = e.currentTarget.dataset.index
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {   //收起评论输入框
    this.setData({
      modalName: null
    })
  },
  textareaAInput(e) {   //评论内容输入

    this.setData({
      textareaAValue: e.detail.value
    })
  },
  textareaBInput(e) {   //评论内容输入

    this.setData({
      textareaBValue: e.detail.value
    })
  },
  sub_comment() {
    let t = temp;  //获取评论者的用户信息
    let tabs = this.data.tabs;
    let time = util.formatTime(new Date());
    t.time = time;
    t.contents = this.data.textareaAValue;//将评论内容赋值给tabs
    t.reply = [];  //初始化这条评论的回复信息
    tabs[0].comments.unshift(t);
    this.setData({
      textareaAValue: '',
      tabs
    })
    this.update_article_data();
    this.onLoad();
    this.hideModal();
    
  },
  sub_comment_reply(){
    console.log("reply1",reply_index);
    let t = temp;  //获取评论者的用户信息
    let tabs = JSON.parse(JSON.stringify(this.data.tabs));
    let time = util.formatTime(new Date());
    t.time = time;
    t.contents = this.data.textareaBValue;//将评论内容赋值给tabs
    tabs[0].comments[reply_index].reply.push(t);
    this.setData({
      textareaBValue: '',
      tabs
    })
    this.update_article_data();
    this.onLoad();
    this.hideModal();

  },
  async update_user_data() {
    let that = this
    await db.collection("ide_user_info").where({
      _openid: app.globalData.user_id
    }).update({    //更新数据
      data: {
        history_article: user_info.history_article,
        like_articles: user_info.like_articles,
        collection_article: user_info.collection_article,
      },
    }).then(res => {
    })
  },

  async update_article_data() {
    let that = this
    await db.collection("user_discussion_data").where({
      _id: article_id
    }).update({
      data: {
        comments: that.data.tabs[0].comments,
        collections: that.data.tabs[3].collections,
        like: that.data.tabs[1].likes,
        reading_num: that.data.contents.reading_num
      },
    }).then(res => {
    })
  },

  onLoad: function (options) {
    app.loadFont();
    let { tabs } = this.data;
    console.log("tabs",this.data.tabs);
    console.log(app.globalData.user_info);
    let time = util.formatTime(new Date());
    if (options != undefined) {
      article_id = options.article_id;
      user_info = app.globalData.user_info;
      temp.avatar_url = user_info.avatar_url;
      temp.nick_name = user_info.nick_name;
      temp.time = time;
      console.log(temp);
      if (user_info.history_article == undefined) user_info.history_article = []
      user_info.history_article.unshift(article_id);
      if (user_info.like_articles == undefined) user_info.like_articles = [];   //初始化点赞数组
      if (user_info.collection_article == undefined) user_info.collection_article = [];  //初始化收藏数组
      console.log("文章id",article_id);
      this.get_article_detail();
    }
    else {
      tabs[0].num = tabs[0].comments.length;
      tabs[1].num = tabs[1].likes.length;
      tabs[3].num = tabs[3].collections.length;
      
    }
    this.setData({
      tabs
    })



  },


  async get_article_detail() {   //初始化各种所需数据
    let that = this
    await db.collection("user_discussion_data").where({
      _id: article_id
    }).get().then(res => {
      console.log("文章数据",res.data[0]);
      let data = res.data[0];
      let contents = this.data.contents;
      contents = data;
      contents.reading_num++;
      if (user_info.collection_article.indexOf(article_id) > -1)   //通过判断用户对象中是否出现了文章id判断用户是否对文章进行过操作
        contents.is_collection = true;
      if (user_info.like_articles.indexOf(article_id) > -1)
        contents.is_like = true
      if (contents.is_collection == undefined) contents.is_collection = false
      if (contents.is_like == undefined) contents.is_like = false;
      let { tabs } = that.data;
      tabs[0].comments = data.comments;  //初始化tabs中的数据
      tabs[1].likes = data.like;
      tabs[3].collections = data.collections;
      tabs[0].num = tabs[0].comments.length;
      tabs[1].num = tabs[1].likes.length;
      tabs[3].num = tabs[3].collections.length;
      that.setData({
        tabs,
        contents
      })
      console.log(tabs);
    })
  },
  onUnload: function () {   //退出页面返回首页
    app.globalData.user_info = user_info
    this.update_user_data();
    app.globalData.user_info = user_info;
    wx.navigateBack({
      delta: 2,
    })
  },


  preview(e) {   //展示图片列表
    const { index } = e.currentTarget.dataset;
    let pictures = this.data.contents.pictures;
    let temp = pictures[index];
    wx.previewImage({
      current: temp, // 当前显示图片的http链接
      urls: pictures // 需要预览的图片http链接列表
    })
  },

  handleTabsItemChange(e) {
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },


})