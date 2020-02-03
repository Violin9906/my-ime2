const Parser = require('../src/parser/parser.js')

const { describe } = require('mocha')
const { expect } = require('chai')

describe('Microsoft layout parser test:', function () {
    it('Simple parse test', function () {
        expect(Parser.parse('nihkoa').spacedText).to.equal('ni hao a')
    })
    it('un-syllable test 1', function () {
        expect(Parser.parse('woybyigemp').spacedText).to.equal('wo you yi ge m p')
    })
    it('un-syllable test 2', function () {
        expect(Parser.parse('vqm').spacedText).to.equal('zh qian')
    })
    it('un-syllable test 3', function () {
        expect(Parser.parse('u').spacedText).to.equal('sh')
    })
    it('un-syllable test 4', function () {
        expect(Parser.parse('vgkxjudx').spacedText).to.equal('zheng k x ju die')
    })
    it('un-syllable test 5', function () {
        expect(Parser.parse('l;g;').spacedText).to.equal('ling g ；')
    })
    it('zero-init test', function () {
        expect(Parser.parse('oawosile').spacedText).to.equal('a wo si le')
    })
    it('long sentense test 1', function () {
        expect(Parser.parse(
            'vsgokextjiuudaxtuiyisowubilajidextxc'
        ).spacedText).to.equal(
            'zhong guo ke xue ji shu da xue shi yi suo wu bi la ji de xue xiao'
        )
    })
    it('long sentense test 2', function () {
        expect(Parser.parse(
            'glgeipfgivmjdivsgorfmnvfvgqivegeuijxtlfgkdhkzidbgzmkdhbjnd'
        ).spacedText).to.equal(
            'gai ge chun feng chui man di zhong guo ren min zhen zheng qi zhe ge shi jie tai feng kuang hao zi dou gei mao dang ban niang'
        )
    })
})