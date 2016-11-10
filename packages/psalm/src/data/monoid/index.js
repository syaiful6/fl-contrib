import { unsoppertedMethod } from '../../util/error'
import { empty as emptyMethod } from '../../util/fantasy'

/**
 * A `Monoid` is a `Semigroup` with a method empty on their constructor/instance,
 * which is both a left and right unit for the associative operation of ```concat```
 * so, the following expression should be equals:
 *
 * concat(empty(x), x) === concat(x, empty(x))
 *
 * `Monoid`s are commonly used as the result of fold operations, where concat is used
 * as to combine individual results, and empty gives the result of folding empty elements
 */
export const empty = monoid => {
  return typeof monoid[emptyMethod] === 'function' ? monoid[emptyMethod]()
  :      inConstructor(monoid)                     ? monoid.constructor[emptyMethod]()
  :      monoid === String                         ? ''
  :      monoid === Array                          ? []
  :      /** otherwise */                            unsoppertedMethod('empty')(monoid)
}

const inConstructor = m => m.constructor && typeof m.constructor[emptyMethod] === 'function'
