var Buffer = {
  raw: '',
  parsed: null,
  selected: [],
  cursor: 0,
  parser: null,

  Init: function (parser) {
    this.parser = parser
    this.clear()
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
    console.log(beforeCursor.text)
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
    this.parsed = null
    this.selected = []
    this.cursor = 0
  },
  pushSelected: function (selected) {
    console.log('Push:')
    this.selected.push(selected)
    console.log(this.selected)
  },
  popSelected: function () {
    return this.selected.pop()
  },
  calcSelectedLetter: function () {
    // need add "'"
    var sum = this.selected.reduce(function (prev, cur, index, array) {
      console.log(cur)
      return prev + cur.pinyin.length
    }, 0)
    for (var i = 0; i < sum; i++) {
      if (this.parsed.text.charAt(i) === "'") {
        sum++
      }
    }
    console.log('SUM: ' + sum)
    return sum
  },
  calcSelectedLetterWithSpace: function () {
    var selectedLetter = this.calcSelectedLetter()
    var spaceCount = 0
    for (var i = 0; this.parsed.space[i] <= selectedLetter; i++) {
      spaceCount++
    }
    return selectedLetter + spaceCount
  },
  mergeAllSelected: function () {
    var merge = ''
    console.log(this.selected)
    for (var i = 0; i < this.selected.length; i++) {
      merge += this.selected[i].char
    }
    console.log('MERGE: ' + merge)
    return merge
  }
}

module.exports = Buffer
