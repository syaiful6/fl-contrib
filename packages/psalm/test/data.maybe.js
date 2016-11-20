import { expect } from 'chai'
import { property } from 'jsverify'

import { Nothing, Just } from '../lib/data/maybe/core'
import { maybe, maybe_ } from '../lib/data/maybe/extra'
import { equals } from '../lib/data/setoid'
import * as laws from './helpers/laws'


describe('Maybe', () => {
  describe('maybe function', () => {
    property('invoke fn if Maybe is Just', 'nat', 'nat', 'nat -> nat', (a, b, f) => {
      return equals(maybe(a, f, Just(b)), f(b))
    })

    property('return default value if Maybe is Nothing', 'nat', 'nat -> nat', (a, f) => {
      return equals(maybe(a, f, Nothing.value), a)
    })
  })

  describe('maybe_ function', () => {
    it('thunk only evaluate when required', () => {
      let count = 0
      const increment = () => count += 1
      expect(maybe_(increment, Math.sqrt, Just(9))).to.be.equal(3)
      expect(count).to.be.equal(0)
      expect(maybe_(increment, Math.sqrt, Nothing.value)).to.not.equal(3)
      expect(count).to.be.equal(1)
    })
  })

  describe('Fantasy Land', () => {
    laws.Setoid(Just)
    laws.Setoid(Nothing)

    laws.Functor(Just)
    laws.Functor(Nothing)

    laws.Apply(Just)
    laws.Apply(Nothing)

    laws.Applicative(Just)
    laws.Applicative(Nothing)

    laws.Chain(Just)
    laws.Chain(Nothing)

    laws.Monad(Just)
    laws.Monad(Nothing)
  })
})
