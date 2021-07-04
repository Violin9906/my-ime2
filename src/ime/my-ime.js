var Mode = require('./mode.js')
var Buffer = require('./buffer.js')
var Composition = require('./composition.js')
var Candidate = require('./candidate.js')

var Parser = require('../parser/parser.js')
var Match = require('../dict/match.js')

var MyIME = {
  itemPerPage: 5,
  engineID: null,
  contextID: null,
  buffer: Buffer,
  composition: Composition,
  candidate: Candidate,
  mode: Mode,
  parser: Parser,
  transer: [Match],
  stage: 0, // stage 0: outer ime; stage 1: inner ime, inputting; stage 2: inner ime, selecting characters
  innerQuote: false,
  innerDoubleQuote: false,

  Init: function (engineID) {
    this.engineID = engineID
  },
  onFocus: function (contextID) {
    this.contextID = contextID
    this.buffer.Init(this.parser)
    this.composition.Init(this.contextID)
    this.candidate.Init(
      this.engineID,
      this.contextID,
      this.transer,
      this.itemPerPage
    )
    this.stage = 0
  },
  onBlur: function () {
    this.clearInput()
  },
  onReset: function () {
    this.clearInput()
  },
  commitText: function (text) {
    chrome.input.ime.commitText({ contextID: this.contextID, text: text })
  },
  moveCursor: function (rel) {
    if (
      (rel < 0 && this.buffer.cursor > 0) ||
      (rel > 0 && this.buffer.cursor < this.buffer.raw.length)
    ) {
      this.buffer.cursor += rel
      this.composition.set(this.composition.text, this.buffer.calcCursor())
      this.candidate.set(
        this.buffer.parsed.text.slice(0, this.buffer.calcCursorWithoutSpace())
      )
    }
  },
  inputChar: function (char) {
    this.buffer.addChar(char)
    this.buffer.parse()
    var spacedStr = this.buffer.parsed.spacedText
    this.composition.set(spacedStr, this.buffer.calcCursor())
    this.candidate.set(this.buffer.parsed.spacedText)
  },
  removeChar: function () {
    this.buffer.removeChar()
    this.buffer.parse()
    var spacedStr = this.buffer.parsed.text
    for (var i = this.buffer.parsed.space.length - 1; i >= 0; i--) {
      spacedStr =
        spacedStr.slice(0, this.buffer.parsed.space[i]) +
        ' ' +
        spacedStr.slice(this.buffer.parsed.space[i])
    }
    if (spacedStr === '') {
      this.clearInput()
    }
    this.composition.set(spacedStr, this.buffer.calcCursor())
    this.candidate.set(this.buffer.parsed.spacedText)
  },
  clearInput: function () {
    this.buffer.clear()
    this.composition.clear()
    this.candidate.clear()
    this.candidate.hide()
    this.stage = 0
  },
  select: function () {
    var select = this.candidate.select()
    console.log(select)
    if (select) {
      this.buffer.pushSelected(select)
      console.log(this.buffer)
      // whether need commit
      if (
        this.buffer.calcSelectedLetter() ===
        this.buffer.calcCursorWithoutSpace()
      ) {
        this.commitText(this.buffer.mergeAllSelected())
        this.clearInput()
        return true
      }
      // update composition text
      var spacedStr = this.buffer.parsed.text
      for (var i = this.buffer.parsed.space.length - 1; i >= 0; i--) {
        spacedStr =
          spacedStr.slice(0, this.buffer.parsed.space[i]) +
          ' ' +
          spacedStr.slice(this.buffer.parsed.space[i])
      }
      var selectedLetter = this.buffer.calcSelectedLetter()
      spacedStr =
        this.buffer.mergeAllSelected() +
        spacedStr.slice(
          selectedLetter +
            this.buffer.parsed.space.filter(function (item, index, array) {
              return item < selectedLetter
            }).length
        )
      this.composition.set(spacedStr, spacedStr.length)
      // update candidate
      this.candidate.set(
        this.buffer.parsed.spacedText.slice(this.buffer.calcSelectedLetterWithSpace())
      )
      return true
    }
    return false
  },
  deSelect: function () {
    // when user use backspace or left under stage 2
    // pop buffer
    this.buffer.popSelected()
    // whether back to stage 1
    if (this.buffer.calcSelectedLetter() === 0) {
      this.stage = 1
    }
    // update composition text
    var spacedStr = this.buffer.parsed.text
    for (var i = this.buffer.parsed.space.length - 1; i >= 0; i--) {
      spacedStr =
        spacedStr.slice(0, this.buffer.parsed.space[i]) +
        ' ' +
        spacedStr.slice(this.buffer.parsed.space[i])
    }
    var selectedLetter = this.buffer.calcSelectedLetter()
    spacedStr =
      this.buffer.mergeAllSelected() +
      spacedStr.slice(
        selectedLetter +
          this.buffer.parsed.space.filter(function (item, index, array) {
            return item < selectedLetter
          }).length
      )
    this.composition.set(spacedStr, spacedStr.length)
    // update candidate
    this.candidate.set(
      this.buffer.parsed.spacedText.slice(this.buffer.calcSelectedLetterWithSpace())
    )
    return true
  },
  choose: function (label) {
    if (label >= 1 && label <= 5) {
      return this.candidate.cursorSet(label - 1)
    } else {
      return false
    }
  },
  handleKeyEvent: function (keyData) {
    // TODO need fully fully fully rewrite

    // switch modes(Use SHIFT)
    if (this.mode.switchMode(keyData)) {
      this.commitText(this.buffer.raw)
      this.clearInput()
      return true
    } else if (this.mode.current === 'en') {
      return false
    }
    if (keyData.type === 'keydown' && this.mode.current === 'zh' && (!keyData.ctrlKey) && (!keyData.altKey)) {
      if (this.stage === 0) {
        if (keyData.key.match(/^[a-z]$/) && (!keyData.shiftKey)) {
          this.stage = 1
          this.inputChar(keyData.key)
          return true
        }
        if (keyData.key.match(/^[,.<>;:'"[\]\\!?^$()_`]$/)) {
          // chinese punctuations includes , . < > ? ! ; : ' " [ ] \ ^ ( ) _ $ `
          switch (keyData.key) {
            case ',':
              this.commitText('\uff0c')
              break
            case '.':
              this.commitText('\u3002')
              break
            case '<':
              this.commitText('\u300a')
              break
            case '>':
              this.commitText('\u300b')
              break
            case '?':
              this.commitText('\uff1f')
              break
            case '!':
              this.commitText('\uff01')
              break
            case ';':
              this.commitText('\uff1b')
              break
            case ':':
              this.commitText('\uff1a')
              break
            case "'":
              if (this.innerQuote) {
                this.commitText('\u2019')
                this.innerQuote = false
              } else {
                this.commitText('\u2018')
                this.innerQuote = true
              }
              break
            case '"':
              if (this.innerDoubleQuote) {
                this.commitText('\u201d')
                this.innerDoubleQuote = false
              } else {
                this.commitText('\u201c')
                this.innerDoubleQuote = true
              }
              break
            case '[':
              this.commitText('\u3010')
              break
            case ']':
              this.commitText('\u3011')
              break
            case '\\':
              this.commitText('\u3001')
              break
            case '^':
              this.commitText('\u2026\u2026')
              break
            case '(':
              this.commitText('\uff08')
              break
            case ')':
              this.commitText('\uff09')
              break
            case '_':
              this.commitText('\u2014\u2014')
              break
            case '$':
              this.commitText('\uffe5')
              break
            case '`':
              this.commitText('\u00b7')
              break
          }
          return true
        }
        return false
      } else if (this.stage === 1) {
        if (keyData.key.match(/^[a-zA-z;]$/)) {
          this.inputChar(keyData.key)
          return true
        }
        if (keyData.key === 'Backspace') {
          this.removeChar()
          return true
        }
        if (keyData.key === 'Right') {
          this.moveCursor(1)
          return true
        }
        if (keyData.key === 'Left') {
          this.moveCursor(-1)
          return true
        }
        if (keyData.key === 'Up') {
          this.candidate.cursorUp()
          return true
        }
        if (keyData.key === 'Down') {
          this.candidate.cursorDown()
          return true
        }
        if (keyData.key === '=' || keyData.key === '.') {
          this.candidate.pageDown()
          return true
        }
        if (keyData.key === '-' || keyData.key === ',') {
          this.candidate.pageUp()
          return true
        }
        if (
          keyData.key === ' ' &&
          !keyData.ctrlKey &&
          !keyData.altKey &&
          !keyData.shiftKey
        ) {
          // Enter Stage 2
          this.stage = 2
          this.select()
          return true
        }
        if (keyData.key.match(/^[1-5]$/)) {
          this.stage = 2
          if (this.choose(keyData.key)) {
            this.select()
          }
          return true
        }
      } /* this.stage === 2 */ else {
        // Cannot move cursor, use backspace or Left will deselect the character, and the cursor will stay at the right-end. Input a-z, A-Z or ';' will make the stage back to 1.
        if (
          keyData.key === ' ' &&
          !keyData.ctrlKey &&
          !keyData.altKey &&
          !keyData.shiftKey
        ) {
          this.select()
          return true
        }
        if (keyData.key.match(/^[1-5]$/)) {
          this.stage = 2
          if (this.choose(keyData.key)) {
            this.select()
          }
          return true
        }
        if (keyData.key === 'Backspace' || keyData.key === 'Left') {
          this.deSelect()
          return true
        }
        if (keyData.key === '=') {
          this.candidate.pageDown()
          return true
        }
        if (keyData.key === '-') {
          this.candidate.pageUp()
          return true
        }
      }
    } else {
      return false
    }
  }
}

module.exports = MyIME
