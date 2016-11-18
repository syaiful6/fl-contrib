import { expect } from 'chai'

import { compare } from '../src/data/ord'
import { LT, GT, EQ } from '../src/data/ordering'


describe('Ord', () => {
  describe('Number', () => {
    const plusInfinity = 1/0
    const minusInfinity = -1/0

    it('if a less than b, compare should return LT', () => {
      const a = compare(1, 2)
      expect(LT.hasInstance(a)).to.be.equal(true)
      const b = compare(-2, 1)
      expect(LT.hasInstance(b)).to.be.equal(true)
    })

    it('if a greater than b, compare should return GT', () => {
      const a = compare(2, 1)
      expect(GT.hasInstance(a)).to.be.equal(true)
      const b = compare(1, -2)
      expect(GT.hasInstance(b)).to.be.equal(true)
    })

    it('return LT when compare minus Infinity with plus Infinity', () => {
      const a = compare(minusInfinity, plusInfinity)
      expect(LT.hasInstance(a)).to.be.equal(true)
    })

    it('return LT when compare minus Infinity with any number', () => {
      const a = compare(minusInfinity, 0)
      expect(LT.hasInstance(a)).to.be.equal(true)
    })

    it('return GT when compare plus Infinity with any number', () => {
      const a = compare(plusInfinity, 0)
      expect(GT.hasInstance(a)).to.be.equal(true)
    })
  })
})
