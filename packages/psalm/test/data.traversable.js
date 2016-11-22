import { expect } from 'chai'
import { property } from 'jsverify'

import { pure } from '../lib/control/applicative'
import { map } from '../lib/data/functor'
import { flip } from '../lib/data/function'
import { Maybe, Nothing, Just } from '../lib/data/maybe'
import { equals } from '../lib/data/setoid'
import * as T from '../lib/data/traversable'


function arrayFrom1UpTo(n) {
  let result = []
  for (let i = 1; i <= n; i++) {
    result.push(i)
  }
  return result
}

function computeCallStack() {
  try {
    return 1 + computeCallStack()
  } catch (_) {
    return 1
  }
}

export const MAX_STACK = computeCallStack()

describe('Traversable', () => {
  const add = (x, y) => x + y
  const sub = (x, y) => x - y

  describe('traverse', () => {
    property('simple traverse operation', 'nat', 'nat', 'nat', (a, b, c) =>
      equals(
        T.traverse(
          pure(Maybe),
          x => Just(add(10, x)),
          [a, b, c]
        ),
        Just(map(x => add(10, x), [a, b, c]))
      )
    )

    property('operates on a list of applicatives', 'nat', 'nat', 'nat', (a, b, c) =>
      equals(
        T.traverse(
          pure(Maybe),
          map(x => add(10, x)),
          [Just(a), Just(b), Just(c)]
        ),
        Just(map(x => add(10, x), [a, b, c]))
      )
    )

    it('stack safe for array implementation', () => {
      const run = () =>
        T.traverse(pure(Maybe), x => Just(add(10, x)), arrayFrom1UpTo(MAX_STACK))

      expect(run).to.not.throw(/Maximum call stack/)
    })
  })

  describe('sequence', () => {
    property('operates on a list of applicatives', 'nat', 'nat', 'nat', (a, b, c) =>
      equals(
        T.sequence(pure(Maybe), [Just(a), Just(b), Just(c)]),
        Just([a, b, c])
      ) && equals(
        T.sequence(pure(Maybe), [Just(a), Just(b), Just(c), Nothing.value]),
        Nothing.value
      )
    )
  })

  it('scanl accumulate intermediate from right', () => {
    const a = T.scanl(sub, 10, [1, 2, 3])
    expect(a).to.deep.equal([9, 7, 4])
  })

  it('scanr accumulate intermediate from right', () => {
    const b = T.scanr(flip(sub), 10, [1, 2, 3])
    expect(b).to.deep.equal([4, 5, 7])
  })
})
