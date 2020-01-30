const Map = require('./ms.json')
const Syllable = require('./syllable.json')

var Parser = {
  map: Map,
  parse: function (text) {
    var result = new String()
    var i = 0, syllableFlag = false

    TRAVERSE:
    while (i < text.length) {
      for (var init in Map[text.charAt(i)]) {
        for (var final in Map[text.charAt(i + 1)]) {
          if (Syllable[init] && Syllable[init][final]) {
            result += init + final + ' '
            syllableFlag = true
            i += 2
            continue TRAVERSE
          }
        }
      }
      // Not a syllable
      if (syllableFlag) {
        result += ' ' + text.charAt(i)
      } else {
        result += text.charAt(i)
      }
      syllableFlag = false
      i++
    }
    return result
  }
}

module.exports = Parser
