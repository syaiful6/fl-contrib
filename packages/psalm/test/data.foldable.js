import { expect } from 'chai'

import { foldr, foldl, foldMap } from '../lib/data/foldable'
import { empty } from '../lib/data/monoid'


describe('Foldable', () => {
  const add = (x, y) => x + y
  const sub = (x, y) => x - y
  const mul = (x, y) => x * y
  const id = x => x

  it('dispatch to fl-contrib/foldr', () => {
    const foldable = {
      'fl-contrib/foldr': () => 'foldr#implementation'
    }
    expect(foldr(add, 0, foldable)).to.be.equal('foldr#implementation')
  })

  it('dispatch to fantasy-land/reduce', () => {
    const foldable = {
      'fantasy-land/reduce': () => 'foldl#implementation'
    }
    expect(foldl(add, 0, foldable)).to.be.equal('foldl#implementation')
  })

  it('dispatch to fl-contrib/foldMap', () => {
    const foldable = {
      'fl-contrib/foldMap': () => 'foldMap#implementation'
    }
    expect(foldMap(String, x => x, foldable)).to.be.equal('foldMap#implementation')
  })

  describe('Array implementation', () => {
    describe('foldr', () => {
      it('folds simple functions over arrays', () => {
        const a = foldr(add, 0, [1, 2, 3, 4])
        expect(a).to.be.equal(10)
        const b = foldr(sub, 0, [1, 2, 3, 4])
        // sub(1, sub(2, sub(3, sub(4, 0)))) or ( 1 - (2 - (3 - 4)))
        expect(b).to.be.equal(-2)
      })

      it('return the initial value if the structure is empty', () => {
        expect(foldr(add, 0, [])).to.be.equal(0)
        expect(foldr(mul, 1, [])).to.be.equal(1)
      })
    })

    describe('foldMap', () => {
      it('correctly fold a structure and collecting the results on monoid', () => {
        expect(foldMap(String, id, ['a', 'b', 'c'])).to.be.equal('abc')
      })

      it('return Monoid empty value if the structure is empty', () => {
        expect(foldMap(String, id, [])).to.be.equal(empty(String))
      })
    })
  })
})
