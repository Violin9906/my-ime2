var SelfLearning = {
  dict: {},
  learn: function(word, pinyin) {
    if (!(pinyin in this.dict)) {
      this.dict[pinyin] = []
    }
    if (!this.dict[pinyin].includes(word)) {
      this.dict[pinyin].push(word)
    }
  }
}

module.exports = SelfLearning
