import { expect } from 'chai'
import { property } from 'jsverify'

import { Left, Right } from '../lib/data/either/core'
import * as laws from './helpers/laws'


describe('Either', () => {
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
