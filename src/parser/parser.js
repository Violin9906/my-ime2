const Map = require('./ms.json')

var Parser = {
  map: Map,
  search: function (key) {
    var index
    for (index in this.map) {
      if (this.map[index].key === 'key') {
        return this.map[index]
      }
    }
    return null
  },
  parse: function (text) {
    var result = ''
    return result
  }
}

module.exports = Parser
