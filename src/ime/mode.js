var Mode = {
  inputWhilePressShift: false,
  current: 'zh',
  switchMode: function (keyData) {
    if (keyData.type === 'keydown' && keyData.key !== 'Shift' && keyData.shiftKey) {
      this.inputWhilePressShift = true
    }
    if (keyData.type === 'keyup' && keyData.key === 'Shift') {
      if (this.inputWhilePressShift) {
        this.inputWhilePressShift = false
      } else {
        // TODO add a prompting when switch mode
        if (this.current === 'en') {
          this.current = 'zh'
          console.log('Mode switch to zh')
        } else {
          this.current = 'en'
          console.log('Mode switch to en')
          return true
        }
      }
    }
    return false
  }
}

module.exports = Mode
