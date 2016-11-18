import { expect } from 'chai'
import * as T from '../src/data/traversable'

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

  it('scanl accumulate intermediate', () => {
    const a = T.scanl(sub, 10, [1, 2, 3])
    expect(a).to.deep.equal([9, 7, 4])
  })

})
