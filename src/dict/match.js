const BasicDict = require('./basic.js')
const LearnedDict = require('./self-learning.js').dict

const Dicts = [LearnedDict, BasicDict]

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
	    this.result.push({ char: Dicts[i][partial_text][char], pinyin: partial_text.replaceAll(' ', '') })
	  }
	}
	index = text.slice(0, index).lastIndexOf(' ')
      }
    }
    return this.result
  }
}

module.exports = Match
