import { expect } from 'chai'
import { property } from 'jsverify'

import { either } from '../lib/data/either/extra'
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
