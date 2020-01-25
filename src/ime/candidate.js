var Candidate = {
  engineID: null,
  contextID: null,
  rawText: '',
  candidates: [],
  transBack: null,
  page: 0,
  cursor: 0,
  itemPerPage: null,
  transer: null,

  Candidate: function (engineID, contextID, transer, itemPerPage) {
    this.engineID = engineID
    this.contextID = contextID
    this.transer = transer
    this.itemPerPage = itemPerPage
  },
  show: function () {
    chrome.input.ime.setCandidateWindowProperties({
      engineID: this.engineID,
      properties: {
        visible: true,
        cursorVisible: true,
        vertical: true,
        pageSize: this.itemPerPage,
        windowPosition: 'cursor'
      }
    })
  },
  hide: function () {
    chrome.input.ime.setCandidateWindowProperties({
      engineID: this.engineID,
      properties: {
        visible: false,
        cursorVisible: false,
        vertical: true,
        pageSize: this.itemPerPage,
        windowPosition: 'cursor'
      }
    })
  },
  clear: function () {
    this.cursor = 0
    this.rawText = ''
    this.candidates = []
    this.transBack = null
    this.page = 0
    this.hide()
  },
  set: function (text) {
    this.rawText = text
    var transerResult = null
    for (var i = 0; i < this.transer.length; i++) {
      transerResult = this.transer[i].trans(this.rawText, 0)
      if (transerResult) {
        this.transBack = transerResult
        for (var j = 0; j < transerResult.length; j++) {
          this.candidates[j] = {
            candidate: transerResult[j][0],
            id: j,
            label: (j + 1).toString()
          }
        }
        this.page = 0
        chrome.input.ime.setCandidates({
          contextID: this.contextID,
          candidates: this.candidates
        })
        this.cursorSet(0)
        this.show()
        return true
      }
    }
    return false
  },
  pageUp: function () {
    if (this.page !== 0) {
      this.page--
      var transerResult = null
      for (var i = 0; i < this.transer.length; i++) {
        transerResult = this.transer[i].trans(this.rawText, this.page)
        if (transerResult) {
          this.transBack = transerResult
          for (var j = 0; j < transerResult.length; j++) {
            this.candidates[j] = {
              candidate: transerResult[j][0],
              id: j,
              label: (j + 1).toString()
            }
          }
          chrome.input.ime.setCandidates({
            contextID: this.contextID,
            candidates: this.candidates
          })
          this.cursorSet(0)
          return true
        }
      }
      return false
    }
  },
  pageDown: function () {
    this.page++
    var transerResult = null
    for (var i = 0; i < this.transer.length; i++) {
      transerResult = this.transer[i].trans(this.rawText, this.page)
      if (transerResult) {
        this.transBack = transerResult
        for (var j = 0; j < transerResult.length; j++) {
          this.candidates[j] = {
            candidate: transerResult[j][0],
            id: j,
            label: (j + 1).toString()
          }
        }
        chrome.input.ime.setCandidates({
          contextID: this.contextID,
          candidates: this.candidates
        })
        this.cursorSet(0)
        return true
      }
    }
    return false
  },
  cursorSet: function (id) {
    if (id >= 0 && id < this.candidates.length) {
      this.cursor = id
      chrome.input.ime.setCursorPosition({
        contextID: this.contextID,
        candidateID: this.cursor
      })
      return true
    } else {
      return false
    }
  },
  cursorDown: function () {
    if (this.cursor < this.candidates.length - 1) {
      this.cursor++
      chrome.input.ime.setCursorPosition({
        contextID: this.contextID,
        candidateID: this.cursor
      })
    } else {
      if (this.pageDown()) {
        this.cursor = 0
        chrome.input.ime.setCursorPosition({
          contextID: this.contextID,
          candidateID: this.cursor
        })
      }
    }
  },
  cursorUp: function () {
    if (this.cursor > 0) {
      this.cursor--
      chrome.input.ime.setCursorPosition({
        contextID: this.contextID,
        candidateID: this.cursor
      })
    } else {
      if (this.pageUp()) {
        this.cursor = this.itemPerPage - 1
        chrome.input.ime.setCursorPosition({
          contextID: this.contextID,
          candidateID: this.cursor
        })
      }
    }
  },
  select: function () {
    return this.transBack[this.cursor]
  }
}

module.exports = Candidate
