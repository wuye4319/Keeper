/**
 * Created by nero on 2018/4/26
 */
// http://www.se8pc.com/thread-9283739-1-11.html

class taobao {
  async getcont (cont) {
    let cont = await this.getcont(cont, filterbox, selfbrowser)
    console.log(cont)

    if (systemconfig.cache && filterbox) cache.writecache(cont, url, type)
    filterbox ? mylogstr.apidata = 'success' : mylogstr.apidata = 'Failed'
  }

  async getcont (cont, filterbox, selfbrowser) {
    return new Promise(async resolve => {
      let isjson = false
      let templine = '\n<script>\nvar apidata = '
      let endtempline = '\n</script>'

      let tempstr = this.subresult(filterbox)
      if (tempstr) filterbox = tempstr
      isjson = this.isJson(filterbox)
      if (isjson && filterbox && cont) {
        apidata = true
        // if previous api is success, reduce
        if (logincount && !selfbrowser) logincount -= 1
      } else {
        let befailed = await this.befailed(filterbox, selfbrowser)
        if (befailed === 'changeip') { resolve('changeip') } else { resolve('Analysis failed!') }
      }

      cont = cont + templine + filterbox + endtempline
      resolve(cont)
    })
  }

  isJson (obj) {
    try {
      obj = JSON.parse(obj)
      let isjsonstr = typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
      if (isjsonstr) {
        let verifystr = JSON.stringify(obj).indexOf('detailskip.taobao.com/__x5__/query.htm')
        if (verifystr !== -1) {
          return false
        } else {
          return true
        }
      }
    } catch (e) {
      return false
    }
  }

  async befailed (filterbox, selfbrowser) {
    // check login count, if get api failed more than 2 times, change ip first
    selfbrowser ? logger.myconsole('Self browser analysis failed!'.red) : logger.myconsole('Analysis failed!'.red)
    if (!selfbrowser) {
      if (logincount < 1) {
        logincount += 1
      } else {
        logincount = 0
        return 'changeip'
      }
    }

    return false
  }

  subresult (filterbox) {
    filterbox = filterbox.substr(filterbox.indexOf('(') + 1)
    filterbox = filterbox.substr(0, filterbox.lastIndexOf(')'))
    return filterbox
  }

  // checklogin (cookiebox) {
  //   let result = false
  //   for (let i in cookiebox) {
  //     let key1 = 'lgc'
  //     let key2 = 'tracknick'
  //     if (cookiebox[i].name === key1 || cookiebox[i].name === key2) {
  //       result = true
  //       break
  //     }
  //   }
  //   return result
  // }
}

module.exports = taobao
