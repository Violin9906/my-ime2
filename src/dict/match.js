const BasicDict = require('./basic.js')
const TestDict = require('./test.js')

const Dicts = [TestDict, BasicDict]

var Match = {
  result: [],
  trans: function (text) {
    this.result = []
    for (var i in Dicts) {
      var index = text.length
      while (index !== -1) {
	if (Dicts[i][text.slice(0, index)]) {
	  for (char in Dicts[i][text.slice(0, index)]) {
	    this.result.push({ char: Dicts[i][text.slice(0, index)][char], pinyin: text.slice(0, index).replace(' ', '') })
	  }
	}
	index = text.slice(0, index).lastIndexOf(' ')
      }
    }
    return this.result
  }
}

module.exports = Match
