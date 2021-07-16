// var Utils = require('../../utils/util.js')
var app = getApp()
var list = []
const db = wx.cloud.database();
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
      contents: [],
      contents_img: []
    }
  },
  sub() {
    let that = this
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const fileID_list = [];
    //提示用户上传中

    //上传成功并跳转页面




    //把图片上传到云存储
    this.data.upData.contents_img.forEach((value, index) => {
      // console.log("console"+this.data.upData.contents_img[i])
      wx.showLoading({
        title: '发表中',
      })
      wx.cloud.uploadFile({
        cloudPath: "contents_img/" + year + "/" + month + "/" + day + "/" + new Date().getTime() + '.png',
        filePath: value, // 文件路径
      }).then(res => {

        // get resource ID
        console.log("fileID = ", res.fileID)
        fileID_list.push(res.fileID);
        console.log("lenth=", this.data.upData.contents_img.length)
        if (fileID_list.length == this.data.upData.contents_img.length) {
          wx.hideLoading();
          wx.showToast({
            title: '发表成功',
          })
         
          this.data.upData.contents_img=fileID_list
        

          /**
           * 把数据存到数据库
           */
          console.log("fileID_list= " + fileID_list)
          console.log("data= " + this.data)
          db.collection("user").add({
            data: {
              
                dzsum: this.data.upData.dzsum,
                likes: this.data.upData.likes,
                plnum: this.data.upData.plnum,
                title: this.data.upData.title,
                user_head: app.globalData.user_head,
                user_name: app.globalData.user_name,
                contents: this.data.upData.contents,
                contents_img: this.data.upData.contents_img,

               

            }
          }).then(re => {
            var pages = getCurrentPages() 
            pages[pages.length -2 ].onLoad()  
            console.log("res = " + re)
            wx.switchTab({
              url: '../index/index',
            })

          })

        }
      }).catch(error => {
        // handle error
      })

    })

  },
  onLoad: function (options) {
    let that = this
  },
  onShow: function (e) {
    var that = this;
    //动态获取屏幕尺寸
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth,
        })
      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  /**
   * 输入监听
   */
  inputCon: function (e) {
    let that = this;
    if (0 === e.currentTarget.id - 0) { //第一个文本框的输入监听
      that.data.firstCon = e.detail.value;
      that.data.upData.title = e.detail.value;

    } else {
      // that.data.dataList[e.currentTarget.id - 1].value = e.detail.value;
      that.data.upData.contents[e.currentTarget.id - 1]=e.detail.value;
      console.log("contents"+that.data.upData.contents)
    }
    console.log(e.currentTarget.id)
    console.log(that.data.upData.contents);

  },
  /**
   * 失去焦点监听
   * 根据失去监听的input的位置来判断图片的插入位置
   */
  outBlur: function (e) {
    let that = this;
    that.data.imgIndex = e.currentTarget.id - 0;
  },
  /**
   * 添加图片
   */
  addImg: function () {
    var that = this;
    //这里考虑到性能，对于图片张数做了限制
    if (that.data.dataList.length >= 4) { //超过四张
      wx.showModal({
        title: '提示',
        content: '最多只能添加四张图片哦',
        confirmText: "我知道了",
        confirmColor: "#ef8383",
        showCancel: false,
        success: function (res) { ` awj `
          if (res.confirm) {} else if (res.cancel) {}
        }
      })
    } else { //添加图片
      wx.showActionSheet({
        itemList: ['从相册选择', '拍照'],
        itemColor: '#ef8383',
        success: function (res) {
          var choseType = res.tapIndex == 0 ? "album" : res.tapIndex == 1 ? "camera" : "";
          if (choseType != "") {
            wx.chooseImage({
              sizeType: ['original'], //原图
              sourceType: [choseType],
              count: 1, //每次添加一张
              success: function (res) {
                var info = {
                  pic: res.tempFilePaths[0], //存储本地地址
                  temp: true, //标记是否是临时图片
                  value: '', //存储图片下方相邻的输入框的内容
                }
                that.data.dataList.splice(that.data.imgIndex, 0, info); //方法自行百度
                that.data.upData.contents_img.splice(that.data.imgIndex, 0, info.pic);
                console.log(that.data.upData.contents_img)
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
   * 删除图片
   */
  deletedImg: function (e) {
    console.log(13);
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['删除图片'],
      success: function (res) {
        if (res.tapIndex === 0) { //点击删除图片
          if (index === 0 && that.data.dataList[index].value != null) { //删除第一张，要与最上方的textarea合并
            that.data.firstCon = that.data.firstCon + that.data.dataList[index].value;
          } else if (index > 0 && that.data.dataList[index].value != null) {
            that.data.dataList[index - 1].value = that.data.dataList[index - 1].value + that.data.dataList[index].value;
          }
          that.data.dataList.splice(index, 1);
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
  //失败警告
  do_fail: function (a) {
    wx.showToast({
      title: a,
      icon: 'none',
      duration: 1000
    })
  },
})