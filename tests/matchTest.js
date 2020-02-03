const Match = require('../src/dict/match.js')

const { describe } = require('mocha')
const { expect } = require('chai')

describe('Basic match test:', function () {
  it('Simple match test 1', function () {
    // console.log(Match.get('ni'))
    expect(Match.get('ni')[0].char).to.equal('你')
  })
  it('Partical match test 1', function () {
    // console.log(Match.get('ni hao a'))
    expect(Match.get('ni hao a')[0].char).to.equal('你')
  })
})