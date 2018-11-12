/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const Basemysql = require('../base/mysql')
let basemysql = new Basemysql()

class mysql {
  addPro (data) {
    return new Promise((resolve) => {
      basemysql.myquery('insert into product set MainImg=?,ProName=?,ProHref=?,Price=?,ProKind=?,ThemeID=?,MySort=?',
        [data.MainImg, data.ProName, data.ProHref, data.Price, data.ProKind, data.ThemeID, data.MySort],
        function (results) {
          if (results.insertId) {
            console.log('data insert success! insertid is : '.green + results.insertId)
            resolve(results.insertId)
          } else {
            console.log('data insert failed!'.red + results)
            resolve(false)
          }
        })
    })
  }

  getPro (id) {
    // 获取商品信息
    return new Promise((resolve) => {
      basemysql.myquery('select * from product where id=?', id, function (results) {
        resolve(results[0])
      })
    })
  }

  getProByTopic (id) {
    // 获取专题的商品
    return new Promise((resolve) => {
      basemysql.myquery('SELECT * FROM product WHERE topic_id=? AND is_pub=1 ORDER BY edit_date', id, function (results) {
        let data = basemysql.getarrt(results, [
          'main_img', 'name', 'href', 'sell_price', 'currency'
        ])
        resolve(data)
      })
    })
  }

  getTopicById (id) {
    // 获取专题信息
    return new Promise((resolve) => {
      basemysql.myquery('SELECT * FROM topics WHERE id=?', id, function (results) {
        let data = basemysql.getarrt(results, [
          'title', 'cover_img', 'main_img', 'description'
        ], 1)
        resolve(data)
      })
    })
  }

  getTopicByKind () {
    // 获取分类下的专题信息
    return new Promise((resolve) => {
      basemysql.myquery('SELECT * FROM topics WHERE kind_id=?', id, function (results) {
        resolve(results[0])
      })
    })
  }

  /** @param id 主题id，page 页数，numb 每页数量
   * 使用mysort来排序，前5的为hot
   */
  getProListByTheme (id) {
    return new Promise((resolve) => {
      // let tempid = ('ThemeID=' + id[0])
      // if (id.length > 1) {
      //   for (let i = 1; i < id.length; i++) {
      //     tempid += (' OR ThemeID=' + id[i])
      //   }
      // }
      let tempsql = '(SELECT * FROM product WHERE ThemeID=' + id[0] + ' AND IsPub=1 ORDER BY MySort,CreatDate DESC limit 0,3)'
      if (id.length > 1) {
        for (let i = 1; i < id.length; i++) {
          tempsql += ' UNION (SELECT * FROM product WHERE ThemeID=' + id[i] + ' AND IsPub=1 ORDER BY MySort,CreatDate DESC limit 0,3)'
        }
      }
      // basemysql.myquery('SELECT * FROM product WHERE ' + tempid + ' AND IsPub=1 ORDER BY MySort,CreatDate DESC LIMIT ?,?', [page, numb], (results) => {
      basemysql.myquery(tempsql, [], (results) => {
        let temparray = []
        for (let i in results) {
          let tempobj = {}
          tempobj.mainimg = results[i].MainImg
          tempobj.proname = results[i].ProName
          tempobj.prohref = results[i].ProHref
          tempobj.price = results[i].Price
          tempobj.themeid = results[i].ThemeID
          temparray.push(tempobj)
        }
        resolve(temparray)
      })
    })
  }
}

module.exports = mysql
