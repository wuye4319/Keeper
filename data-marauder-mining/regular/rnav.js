/**
 * Created by nero on 2018/4/26
 */
// http://www.se8pc.com/thread-9283739-1-11.html

class snav {
  rule (cont, url, type) {
    let regular = []
    regular.push(/<img\s.*(file|src|zoomfile)="http\S+(.jpg|.png)".+>/g)
    regular.push(/<img\s.*(file|src|zoomfile)="http\S+?(.jpg|.png)".+?>{1}/g)
    // regular.push(/\s(file|src|zoomfile)="(.+)"/)

    return regular
  }
}

module.exports = snav
