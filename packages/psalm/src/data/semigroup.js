import { curryN } from './function'
import { unsoppertedMethod } from '../util/error'
import { concat as mconcat } from '../util/fantasy'

/**
 * Semigroup, a value which has a Semigroup has method `concat`, and it required
 * to satisfy the following law:
 *
 * concat(concat(a, b), c) === concat(a, concat(b, c))
 */
export const concat = curryN(2, (se1, se2) => {
  return typeof se1[concatMethod] === 'function' ? se1[concatMethod](se2)
  :      typeof se1 === 'string'                 ? concatString(se1, se2)
  :      Array.isArray(se1)                      ? concatArray(se1, se2)
  :      /**otherwise */                           unsoppertedMethod(concatMethod)(se1)
})

const concatArray = (xs, ys) => {
  if (!Array.isArray(ys)) {
    throw new TypeError('trying to concatenate array with non array, you give us ' + ys)
  }
  return xs.concat(ys)
}

const concatString = (s1, s2) => {
  if (typeof s2 !== 'string') {
    throw new TypeError('trying to concatenate string with non string type, you give us ' + s2)
  }
  return s1 + s2
}
