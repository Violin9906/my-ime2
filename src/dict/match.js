const BasicDict = require('./basic.js')

const Dicts = [BasicDict]

var Match = {
  result: [],
  get: function (text) {
    this.result = []
    for (var i in Dicts) {
      if (Dicts[i][text]) {
        // all match
        for (var char in Dicts[i][text]) {
          this.result.push({'char': Dicts[i][text][char], 'pinyin': text})
        }
      } else {
        // partical match
        var index = text.length
        while (index != -1) {
          if (Dicts[i][text.slice(0, index)]) {
            for (var char in Dicts[i][text.slice(0, index)]) {
              this.result.push({'char': Dicts[i][text.slice(0, index)][char], 'pinyin': text.slice(0, index)})
            }
          }
          index = text.slice(0, index).lastIndexOf(' ')
        }
      }
    }
    return this.result
  }
}

module.exports = Match
