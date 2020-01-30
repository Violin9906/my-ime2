const Parser = require('../src/parser/parser.js')

const { describe } = require('mocha')
const { expect } = require('chai')

describe('Microsoft layout parser test:', function () {
    it('Simple parse test', function () {
        expect(Parser.parse('nihkoa')).to.equal('ni hao a')
    })
    it('un-syllable test 1', function () {
        expect(Parser.parse('woybyigemp')).to.equal('wo you yi ge mp')
    })
    it('un-syllable test 2', function () {
        expect(Parser.parse('gck')).to.equal('g cao')
    })
    it('zero-init test', function () {
        expect(Parser.parse('oawosile')).to.equal('a wo si le')
    })
    it('long sentense test 1', function () {
        expect(Parser.parse(
            'vsgokextjiuudaxtuiyisowubilajidextxc'
        )).to.equal(
            'zhong guo ke xue ji shu da xue shi yi suo wu bi la ji de xue xiao'
        )
    })
    it('long sentense test 2', function () {
        expect(Parser.parse(
            'glgeipfgivmjdivsgorfmnvfvgqivegeuijxtlfgkdhkzidbgzmkdhbjnd'
        )).to.equal(
            'gai ge chun feng chui man di zhong guo ren min zhen zheng qi zhe ge shi jie tai feng kuang hao zi dou gei mao dang ban niang'
        )
    })
})