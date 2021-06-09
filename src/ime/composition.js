var Composition = {
  contextID: null,
  text: '',
  cursor: 0,

  Init: function (contextID) {
    this.contextID = contextID
  },
  clear: function () {
    this.text = ''
    this.cursor = 0
    chrome.input.ime.clearComposition({ "contextID": this.contextID })
  },
  set: function (text, cursor, args) {
    this.text = text
    this.cursor = cursor
    var allowedFields = ['selectionStart', 'selectionEnd']
    var obj = {
      "contextID": this.contextID,
      "text": this.text,
      "cursor": this.cursor
    }
    args = args || {}
    for (var i = 0; i < allowedFields.length; i++) {
      var field = allowedFields[i]
      if (args[field]) {
        obj[field] = args[field]
      }
    }
    chrome.input.ime.setComposition(obj)
  }
}

module.exports = Composition
