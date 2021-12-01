let mockStorage = {}
global.chrome = {
  storage: {
    local: {
      get: (keys, callback) => {
        callback({}) // Keep it simple for now
      },
      set: (items, callback) => {
        Object.assign(mockStorage, items)
        if (callback) {
          callback()
        }
      }
    }
  }
}
const Match = require('../src/dict/match.js')
const SelfLearning = require('../src/dict/self-learning.js')

const { describe } = require('mocha')
const { expect } = require('chai')

describe('Basic match test:', function () {
  it('Simple match test 1', function () {
    // console.log(Match.get('ni'))
    expect(Match.trans('ni')[0].char).to.equal('你')
  })
  it('Partial match test 1', function () {
    // console.log(Match.get('ni hao a'))
    expect(Match.trans('ni hao a')[0].char).to.equal('你')
  })
})

describe('Self learning test:', function () {
  it('Learning test', function () {
    SelfLearning.learn('测试', 'ce shi')
    expect(Match.trans('ce shi')[0].char).to.equal('测试')
    expect(Match.trans('ce shi huan jing')[0].char).to.equal('测试')
  })
  it('Repeat learning test', function () {
    SelfLearning.learn('重复', 'chong fu')
    SelfLearning.learn('重复', 'chong fu')
    expect(Match.trans('chong fu')[0].char).to.equal('重复')
    expect(Match.trans('chong fu').filter(item => item.char == '重复')).to.have.lengthOf(1)
  })
  it('Unlearning test', function () {
    SelfLearning.learn('笔吴', 'bi wu')
    expect(Match.trans('bi wu')[0].char).to.equal('笔吴')
    SelfLearning.unlearn('笔吴', 'bi wu')
    expect(Match.trans('bi wu')[0].char).to.not.equal('笔吴')
  })
  it('Single character test', function () {
    SelfLearning.learn('字', 'zi')
    expect(Match.trans('zi')[0].char).to.equal('字')
    expect(Match.trans('zi').filter(item => item.char == '字')).to.have.lengthOf(1)
  })
  it('Invalid unlearn test', function () {
    SelfLearning.unlearn('你', 'ni')
    expect(Match.trans('ni')[0].char).to.equal('你')
  })
  it('Saving test', function () {
    SelfLearning.learn('保存', 'bao cun')
    SelfLearning.saveDict()
    expect(mockStorage.learnedDict['bao cun']).to.include('保存')
  })
})
