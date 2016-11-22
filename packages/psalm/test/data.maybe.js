import { expect } from 'chai'
import { property } from 'jsverify'

import { Nothing, Just } from '../lib/data/maybe/core'
import {
  maybe, maybe_, fromMaybe, isJust, isNothing
} from '../lib/data/maybe/extra'
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

  describe('fromMaybe', () => {
    property('extract value inside Just if argument 2 is Just',
             'nat', 'nat',
             (a, b) => equals(fromMaybe(a, Just(b)), b))

    property('return default value if argument 2 is Nothing',
             'nat',
             a => equals(fromMaybe(a, Nothing.value), a))
  })

  describe('isJust', () => {
    it('return true if applied Just', () => {
      expect(isJust(Just('foo'))).to.be.equal(true)
    })

    it('return false if applied Right', () => {
      expect(isJust(Nothing.value)).to.be.equal(false)
    })
  })

  describe('isNothing', () => {
    it('return true if applied Nothing', () => {
      expect(isNothing(Nothing.value)).to.be.equal(true)
    })

    it('return false if applied Just', () => {
      expect(isNothing(Just('baz'))).to.be.equal(false)
    })
  })

  describe('Fantasy Land', () => {
    laws.Setoid(Just)
    laws.Setoid(Nothing)

    laws.Functor(Just)
    laws.Functor(Nothing)

    laws.Alt(Just)
    laws.Alt(Nothing)

    laws.Plus(Just)
    laws.Plus(Nothing)

    laws.Apply(Just)
    laws.Apply(Nothing)

    laws.Applicative(Just)
    laws.Applicative(Nothing)

    laws.Alternative(Just)
    laws.Alternative(Nothing)

    laws.Chain(Just)
    laws.Chain(Nothing)

    laws.Monad(Just)
    laws.Monad(Nothing)
  })
})
