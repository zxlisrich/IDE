// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
//let time = db.serverDate()

// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection("user_discussion_data").orderBy('create_time', 'desc').get(res =>{
    return res;
  })
}