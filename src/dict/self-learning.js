var SelfLearning = {
  dict: {},
  learn: function(word, pinyin) {
    if (!(pinyin in this.dict)) {
      this.dict[pinyin] = []
    }
    if (!this.dict[pinyin].includes(word)) {
      this.dict[pinyin].push(word)
    }
  },
  load_dict: function() {
    console.log('Loading learned dictionary.')
    chrome.storage.local.get('learned_dict', (result) => {
      if (result) {
        Object.assign(this.dict, result.learned_dict)
      }
    })
  },
  save_dict: function() {
    console.log('Saving learned dictionary.')
    chrome.storage.local.set({learned_dict: this.dict})
  }
}

SelfLearning.load_dict()
module.exports = SelfLearning
