var MyIME = require('./ime/my-ime.js')

var ime = null

chrome.input.ime.onFocus.addListener(function (context) {
  console.log('onFocus:' + context.contextID)
  ime.onFocus(context)
})

chrome.input.ime.onBlur.addListener(function (contextID) {
  console.log('onBlur:' + contextID)
  ime.onBlur()
})

chrome.input.ime.onReset.addListener(function (engineID) {
  ime.onReset()
})

chrome.input.ime.onActivate.addListener(function (engineID) {
  console.log('onActivate:' + engineID)
  ime = MyIME
  MyIME.Init(engineID)
  console.log('IME:')
  console.log(ime)
})

chrome.input.ime.onDeactivated.addListener(function (engineID) {
  console.log('onDeactivated:' + engineID)
  ime.onDeactivated()
  ime = null
})

chrome.input.ime.onKeyEvent.addListener(function (engineID, keyData) {
  return ime.handleKeyEvent(keyData)
})
