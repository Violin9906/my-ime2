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
	partial_text = text.slice(0, index)
	if (Dicts[i][partial_text]) {
	  for (char in Dicts[i][partial_text]) {
	    this.result.push({ char: Dicts[i][partial_text][char], pinyin: partial_text.replace(' ', '') })
	  }
	}
	index = text.slice(0, index).lastIndexOf(' ')
      }
    }
    return this.result
  }
}

module.exports = Match
