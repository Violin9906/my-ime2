const BasicDict = require('./basic.js')
const LearnedDict = require('./self-learning.js').dict

const Dicts = [LearnedDict, BasicDict]

var Match = {
  result: [],
  trans: function (text) {
    this.result = []
    var appeared = new Set()
    for (var i in Dicts) {
      var index = text.length
      while (index !== -1) {
        partial_text = text.slice(0, index)
        if (Dicts[i][partial_text]) {
          for (j in Dicts[i][partial_text]) {
            word = Dicts[i][partial_text][j]
            if (!appeared.has(word)) {
              appeared.add(word)
              this.result.push({ char: word, pinyin: partial_text.replaceAll(' ', '') })
            }
          }
        }
        index = text.slice(0, index).lastIndexOf(' ')
      }
    }
    return this.result
  }
}

module.exports = Match
