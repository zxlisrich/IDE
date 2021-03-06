const  util = require('../../utils/util.js')
var app = getApp()
var list = []
const db = wx.cloud.database();
let article = {};
let user_info = {};
let article_id = "";
Page({
  data: {
    content: '',
    height: 500,
    width: 320,
    imgIndex: 0,
    imageLength: 0,
    firstCon: '',
    dataList: [],
    upData: {
      dznum: 12,
      likes: 0,
      plnum: 0,
      title: "",
      user_head: "",
      user_name: "",
      contents: '',
      contents_img: []
    },
    textareaAValue: '',
  },

  sub(){
    this.update_user_data();
    
  },
  async update_user_data() {
    user_info = app.globalData.user_info;
    let time = util.formatTime(new Date());
    article.time = time;
    article.collections = [];
    article.like = [];
    article.comments = [];
    article.createTime = db.serverDate()
    // article.collections.num = 0;
    // article.collections.persons = [];
    // article.like.num = 0;
     article.reading_num = 0;
    // article.like.persons = [];
    // article.comments.num = 0;
    // article.comments.persons = [];
    if(user_info.article == undefined) user_info.article = [];
    await db.collection("user_discussion_data").add({
      data:
      {
        nick_name: user_info.nick_name,
        avatar_url:user_info.avatar_url,
        discussion_title:article.discussion_title,
        contents:article.contents,
        pictures:article.pictures,
        create_time:time,
        collections: article.collections,
        like: article.like,
        comments: article.comments,
        reading_num:article.reading_num,
        createTime:article.createTime
      }

    }).then(res => {
      console.log(res);
      article_id = res._id;
      user_info.article.push(res._id)
      app.globalData.newest_article = res._id;
      db.collection("ide_user_info").where({
        _openid:app.globalData.user_id
      }).update({
        data: {
          article:user_info.article
        },
      }).then(res => {
      })
      wx.navigateTo({
        url: '/pages/dongtaicenter/dongtaicenter?article_id='+article_id,
      })
    })

    //await db.collection("")

  },

  onLoad: function (options) {
    let that = this
    
    article.pictures = [];
  },
  onShow: function (e) {
    var that = this;
    //????????????????????????
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * ????????????
   */
  inputCon: function (e) {
    console.log('input_event', e);
    let that = this;
    if ('text_title' === e.currentTarget.id) { //?????????????????????????????????
      that.data.firstCon = e.detail.value;
      that.data.upData.title = e.detail.value;
      article.discussion_title = e.detail.value;
     
    } else {
      // that.data.dataList[e.currentTarget.id - 1].value = e.detail.value;
      that.data.upData.contents = e.detail.value;
      console.log("contents" + that.data.upData.contents)
      article.contents = e.detail.value;
    }
    console.log(e.currentTarget.id)
    console.log(that.data.upData.contents);

  },
  /**
   * ??????????????????
   * ?????????????????????input???????????????????????????????????????
   */
  outBlur: function (e) {
    let that = this;
    that.data.imgIndex = e.currentTarget.id - 0;
  },
  /**
   * ????????????
   */
  addImg: function () {
    var that = this;
    //??????????????????????????????????????????????????????
    if (that.data.dataList.length >= 6) { //????????????
      wx.showModal({
        title: '??????',
        content: '?????????????????????????????????',
        confirmText: "????????????",
        confirmColor: "#ef8383",
        showCancel: false,
        success: function (res) {
          ` awj `
          if (res.confirm) { } else if (res.cancel) { }
        }
      })
    } else { //????????????
      wx.showActionSheet({
        itemList: ['???????????????', '??????'],
        itemColor: '#ef8383',
        success: function (res) {
          var choseType = res.tapIndex == 0 ? "album" : res.tapIndex == 1 ? "camera" : "";
          if (choseType != "") {
            wx.chooseImage({
              sizeType: ['original'], //??????
              sourceType: [choseType],
              count: 1, //??????????????????
              success: function (res) {
                var info = {
                  pic: res.tempFilePaths[0], //??????????????????
                  temp: true, //???????????????????????????
                  value: '', //?????????????????????????????????????????????
                }
                that.data.dataList.splice(that.data.imgIndex, 0, info); //??????????????????
                that.data.upData.contents_img.splice(that.data.imgIndex, 0, info.pic);
                console.log("?????????????",that.data.upData.contents_img)
                article.pictures = that.data.upData.contents_img;
                that.setData({
                  dataList: that.data.dataList,
                })
                console.log(that.data.dataList)

              }
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  /**
   * ????????????
   */
  deletedImg: function (e) {
    console.log(13);
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['????????????'],
      success: function (res) {
        if (res.tapIndex === 0) { //??????????????????
          if (index === 0 && that.data.dataList[index].value != null) { //????????????????????????????????????textarea??????
            that.data.firstCon = that.data.firstCon + that.data.dataList[index].value;
          } else if (index > 0 && that.data.dataList[index].value != null) {
            that.data.dataList[index - 1].value = that.data.dataList[index - 1].value + that.data.dataList[index].value;
          }
          that.data.dataList.splice(index, 1);
          article.pictures.splice(index, 1);
          that.setData({
            firstCon: that.data.firstCon,
            dataList: that.data.dataList
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //????????????
  do_fail: function (a) {
    wx.showToast({
      title: a,
      icon: 'none',
      duration: 1000
    })
  },
})