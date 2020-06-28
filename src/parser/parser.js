const Map = require('./ms.json')
const Syllable = require('./syllable.json')

var Parser = {
  map: Map,
  parse: function (text) {
    var result = {
      text: '',
      space: [],
      spacedText: ''
    }
    var i = 0
    // var syllableFlag = false

    // eslint-disable-next-line no-labels
    TRAVERSE:
    while (i < text.length) {
      for (var init in Map[text.charAt(i)]) {
        if (i + 1 < text.length) {
          for (var final in Map[text.charAt(i + 1)]) {
            if (Syllable[Map[text.charAt(i)][init]] && Syllable[Map[text.charAt(i)][init]][Map[text.charAt(i + 1)][final]]) {
              if (Map[text.charAt(i)][init] !== ' ') {
                if (i === 0) {
                  result.text += Map[text.charAt(i)][init] + Map[text.charAt(i + 1)][final]
                } else {
                  result.space.push(result.text.length)
                  result.text += Map[text.charAt(i)][init] + Map[text.charAt(i + 1)][final]
                }
              } else {
                if (i === 0) {
                  result.text += Map[text.charAt(i + 1)][final]
                } else {
                  result.space.push(result.text.length)
                  result.text += Map[text.charAt(i + 1)][final]
                }
              }
              // syllableFlag = true
              i += 2
              // eslint-disable-next-line no-labels
              continue TRAVERSE
            }
          }
        } else {
          if (i === 0) {
            result.text += Map[text.charAt(i)][0]
          } else {
            result.space.push(result.text.length)
            result.text += Map[text.charAt(i)][0]
          }
          i++
          // eslint-disable-next-line no-labels
          continue TRAVERSE
        }
      }
      // Not a syllable
      if (i === 0) {
        result.text += Map[text.charAt(i)][0]
      } else {
        result.space.push(result.text.length)
        result.text += Map[text.charAt(i)][0]
      }
      // syllableFlag = false
      i++
    }
    result.spacedText = result.text
    for (i = result.space.length - 1; i >= 0; i--) {
      result.spacedText =
        result.spacedText.slice(0, result.space[i]) +
        ' ' +
        result.spacedText.slice(result.space[i])
    }
    return result
  }
}

module.exports = Parser
