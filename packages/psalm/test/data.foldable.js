import { expect } from 'chai'

import * as F from '../lib/data/foldable'
import { Just, Nothing } from '../lib/data/maybe'
import { empty } from '../lib/data/monoid'
import { equals } from '../lib/data/setoid'


describe('Foldable', () => {
  const add = (x, y) => x + y
  const sub = (x, y) => x - y
  const mul = (x, y) => x * y
  const id = x => x

  it('dispatch to fl-contrib/foldr', () => {
    const foldable = {
      'fl-contrib/foldr': () => 'foldr#implementation'
    }
    expect(F.foldr(add, 0, foldable)).to.be.equal('foldr#implementation')
  })

  it('dispatch to fantasy-land/reduce', () => {
    const foldable = {
      'fantasy-land/reduce': () => 'foldl#implementation'
    }
    expect(F.foldl(add, 0, foldable)).to.be.equal('foldl#implementation')
  })

  it('dispatch to fl-contrib/foldMap', () => {
    const foldable = {
      'fl-contrib/foldMap': () => 'foldMap#implementation'
    }
    expect(F.foldMap(String, x => x, foldable)).to.be.equal('foldMap#implementation')
  })

  describe('Array implementation', () => {
    describe('foldr', () => {
      it('folds simple functions over arrays', () => {
        const a = F.foldr(add, 0, [1, 2, 3, 4])
        expect(a).to.be.equal(10)
        const b = F.foldr(sub, 0, [1, 2, 3, 4])
        // sub(1, sub(2, sub(3, sub(4, 0)))) or ( 1 - (2 - (3 - 4)))
        expect(b).to.be.equal(-2)
      })

      it('return the initial value if the structure is empty', () => {
        expect(F.foldr(add, 0, [])).to.be.equal(0)
        expect(F.foldr(mul, 1, [])).to.be.equal(1)
      })
    })

    describe('foldMap', () => {
      it('correctly fold a structure and collecting the results on monoid', () => {
        expect(F.foldMap(String, id, ['a', 'b', 'c'])).to.be.equal('abc')
      })

      it('return Monoid empty value if the structure is empty', () => {
        expect(F.foldMap(String, id, [])).to.be.equal(empty(String))
      })
    })
  })

  describe('elem', () => {
    it('return true if an element in structure', () => {
      expect(F.elem('a', ['b', 'd', 'a', 't'])).to.be.equal(true)
    })

    it('return false if an element not in structure', () => {
      expect(F.elem('a', ['b', 'd', 't'])).to.be.equal(false)
    })
  })

  describe('maximum', () => {
    it('return Just contained the max value in the structure', () => {
      const m = F.maximum([5, 6, 9, 2, 10, 8])
      expect(equals(m, Just(10))).to.be.equal(true)
    })

    it('return Nothing if the structure is empty', () => {
      const m = F.maximum([])
      expect(equals(m, Nothing.value)).to.be.equal(true)
    })
  })

  describe('minimum', () => {
    it('return Just contained the minimum value in the structure', () => {
      const m = F.minimum([5, 6, 9, 2, 10, 8])
      expect(equals(m, Just(2))).to.be.equal(true)
    })

    it('return Nothing if the structure is empty', () => {
      const m = F.minimum([])
      expect(equals(m, Nothing.value)).to.be.equal(true)
    })
  })
})
