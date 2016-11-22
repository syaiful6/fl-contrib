import { expect } from 'chai'
import { property } from 'jsverify'

import {
  either, isLeft, isRight, unsafeFromLeft, unsafeFromRight
} from '../lib/data/either/extra'
import { Left, Right } from '../lib/data/either/core'
import { equals } from '../lib/data/setoid'
import * as laws from './helpers/laws'


describe('Either', () => {
  describe('either', () => {
    property('apply to first function if Either is Left',
             'nat -> nat', 'nat -> nat', 'nat',
             (f, g, x) => equals(either(f, g, Left(x)), f(x)))

    property('apply to second function if Either is Right',
             'nat -> nat', 'nat -> nat', 'nat',
             (f, g, x) => equals(either(f, g, Right(x)), g(x)))
  })

  describe('isLeft', () => {
    it('return true if applied Left', () => {
      expect(isLeft(Left('foo'))).to.be.equal(true)
    })

    it('return false if applied Right', () => {
      expect(isLeft(Right('baz'))).to.be.equal(false)
    })
  })

  describe('isRight', () => {
    it('return true if applied Right', () => {
      expect(isRight(Right('foo'))).to.be.equal(true)
    })

    it('return false if applied Left', () => {
      expect(isRight(Left('baz'))).to.be.equal(false)
    })
  })

  describe('unsafeFromLeft', () => {
    it('extracts the value from the Left data constructor', () => {
      expect(unsafeFromLeft(Left('foo'))).to.be.equal('foo')
    })

    it('throw error if passing Right', () => {
      const badExtracts = () => unsafeFromLeft(Right('no!'))
      expect(badExtracts).to.throw(Error)
    })
  })

  describe('unsafeFromRight', () => {
    it('extracts the value from the Right data constructor', () => {
      expect(unsafeFromRight(Right('bazz'))).to.be.equal('bazz')
    })

    it('throw error if passing Left', () => {
      const badExtracts = () => unsafeFromRight(Left('no!'))
      expect(badExtracts).to.throw(Error)
    })
  })

  describe('Fantasy Land', () => {
    laws.Setoid(Left)
    laws.Setoid(Right)

    laws.Functor(Left)
    laws.Functor(Right)

    laws.Bifunctor((a, b) => Left(a))
    laws.Bifunctor((a, b) => Right(b))

    laws.Alt(Left)
    laws.Alt(Right)

    laws.Apply(Left)
    laws.Apply(Right)

    laws.Applicative(Left)
    laws.Applicative(Right)

    laws.Chain(Left)
    laws.Chain(Right)

    laws.Monad(Left)
    laws.Monad(Right)
  })
})
