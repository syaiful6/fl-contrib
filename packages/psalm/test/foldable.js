import { expect } from 'chai'
import { foldr, foldl, foldMap } from '../src/data/foldable'

describe('Foldable', () => {
  const add = (x, y) => x + y
  const sub = (x, y) => x - y
  const mul = (x, y) => x * y

  describe('foldr', () => {
    it('folds simple functions over arrays', () => {
      const a = foldr(add, 0, [1, 2, 3, 4])
      expect(a).to.be.equal(10)
      const b = foldr(mul, 1, [1, 2, 3, 4])
      // mul(1, mul(2, mul(3, 4))) or ( 1 * (2 * (3 * 4)))
      expect(b).to.be.equal(24)
    })

    it('dispatch to fl-contrib/foldr', () => {
      const d = {
        'fl-contrib/foldr': () => 'foldr#implementation'
      }
      expect(foldr(add, 0, d)).to.be.equal('foldr#implementation')
    })

    it('return the initial value if the structure is empty', () => {
      expect(foldr(add, 0, [])).to.be.equal(0)
      expect(foldr(mul, 1, [])).to.be.equal(1)
    })
  })
})
