var SelfLearning = {
  dict: {},
  learn: function (word, pinyin) {
    if (!(pinyin in this.dict)) {
      this.dict[pinyin] = []
    }
    if (!this.dict[pinyin].includes(word)) {
      this.dict[pinyin].push(word)
    }
  },
  unlearn: function (word, pinyin) {
    if (pinyin in this.dict) {
      this.dict[pinyin] = this.dict[pinyin].filter(item => item !== word)
    }
  },
  loadDict: function () {
    console.log('Loading learned dictionary.')
    chrome.storage.local.get('learnedDict', (result) => {
      if (result) {
        Object.assign(this.dict, result.learnedDict)
      }
    })
  },
  saveDict: function () {
    console.log('Saving learned dictionary.')
    chrome.storage.local.set({ learnedDict: this.dict })
  }
}

SelfLearning.loadDict()
module.exports = SelfLearning
