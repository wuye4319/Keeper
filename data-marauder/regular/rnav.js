/**
 * Created by nero on 2018/4/26
 */
// http://www.se8pc.com/thread-9283739-1-11.html

class snav {
  rule (cont, url, type) {
    let temp = {regular: [], deep: []}
    temp.regular.push(/<img\s.*(file|src|zoomfile)="http\S+?(.jpg|.png)".+?>{1}/g)
    temp.regular.push(/\S<img\s.*(file|src|zoomfile)="http\S+?(.jpg|.png)".+?>{1}/g)
    temp.deep.push(/\s(file|src|zoomfile)="(\S+?(.jpg|.png))"/)

    return temp
  }
}

module.exports = snav
