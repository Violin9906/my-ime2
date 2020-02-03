// 这到底是一坨什么鬼，我为什么要写这个模块
var Buffer = {
  raw: '',
  parsed: {
    text: '',
    space: []
  },
  selected: [],
  cursor: 0,
  parser: null,

  Buffer: function (parser) {
    this.parser = parser
  },
  parse: function () {
    this.parsed = this.parser.parse(this.raw)
  },
  calcCursor: function () {
    var beforeCursor = this.parser.parse(this.raw.slice(0, this.cursor))
    return beforeCursor.text.length + beforeCursor.space.length
  },
  calcCursorWithoutSpace: function () {
    var beforeCursor = this.parser.parse(this.raw.slice(0, this.cursor))
    return beforeCursor.text.length
  },
  addChar: function (char) {
    // this function won't refresh the parsed object
    this.raw = this.raw.slice(0, this.cursor) + char + this.raw.slice(this.cursor)
    this.cursor++
  },
  removeChar: function () {
    // this function won't refresh the parsed object
    this.raw = this.raw.slice(0, this.cursor - 1) + this.raw.slice(this.cursor)
    this.cursor--
  },
  clear: function () {
    this.raw = ''
    this.parsed = {
      text: '',
      space: []
    }
    this.selected = []
    this.cursor = 0
  },
  pushSelected: function (selected) {
    this.selected.push(selected)
  },
  popSelected: function () {
    return this.selected.pop()
  },
  calcSelectedLetter: function () {
    // need add "'"
    var sum = this.selected.reduce(function (prev, cur, index, array) {
      return prev + parseInt(cur[1])
    }, 0)
    for (var i = 0; i < sum; i++) {
      if (this.parsed.text.charAt(i) === "'") {
        sum++
      }
    }
    console.log('SUM: ' + sum)
    return sum
  },
  mergeAllSelected: function () {
    var merge = ''
    for (var i = 0; i < this.selected.length; i++) {
      merge += this.selected[i][0].toString()
    }
    console.log('MERGE: ' + merge)
    return merge
  }
}

module.exports = Buffer
