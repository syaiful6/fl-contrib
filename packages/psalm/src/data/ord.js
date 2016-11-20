import { curryN, on } from './function'
import { LT, GT, EQ, unsafeCompare } from './ordering'
import { unsoppertedMethod } from '../util/error'


/**
 * A value that implement Ord must also implement fantasy land Setoid interface.
 * Ord (Ordering) represents values which support comparisons with a total order:
 *
 * `Ord` instances should satisfy the laws of total orderings:
 * - Reflexivity: `a <= a`
 * - Antisymmetry: if `a <= b` and `b <= a` then `a = b`
 * - Transitivity: if `a <= b` and `b <= c` then `a <= c`
 */
export const OrdC = {
  compare: 'fl-contrib/compare'
}

/**
 * Dispatch Ord specification to the implementation.
 *
 * @sig compare :: forall a. Ord a => a -> a -> Ordering
 */
export const compare = curryN(2, (a, b) => {
  return typeof a[OrdC.compare] === 'function' ? a[OrdC.compare](b)
  :      typeof a === 'string'                 ? unsafeCompare(a, b)
  :      typeof a === 'number'                 ? unsafeCompare(a, b)
  :      typeof a === 'boolean'                ? unsafeCompare(a, b)
  :      Array.isArray(a)                      ? compareArray(a, b)
  :                                              unsoppertedMethod(OrdC.compare)(a)
})

/**
 * Test whether one value is _strictly greater than_ another.
 *
 * @sig gt :: forall a. Ord a => a -> a -> Boolean
 */
export const gt = curryN(2, (a, b) => {
  return compare(a, b).matchWith({
    LT: () => false,
    GT: () => true,
    EQ: () => false
  })
})

/**
 * Test whether one value is _strictly less than_ another.
 *
 * @sig lt :: forall a. Ord a => a -> a -> Boolean
 */
export const lt = curryN(2, (a, b) => {
  return compare(a, b).matchWith({
    LT: () => true,
    GT: () => false,
    EQ: () => false
  })
})

/**
 * Test whether one value is _non-strictly greater than_ another.
 *
 * @sig gte :: forall a. Ord a => a -> a -> Boolean
 */
export const gte = curryN(2, (a, b) => {
  return compare(a, b).matchWith({
    LT: () => false,
    GT: () => true,
    EQ: () => true
  })
})

/**
 * Test whether one value is _non-strictly less than_ another.
 *
 * @sig lte :: forall a. Ord a => a -> a -> Boolean
 */
export const lte = curryN(2, (a, b) => {
  return compare(a, b).matchWith({
    LT: () => true,
    GT: () => false,
    EQ: () => true
  })
})

/**
 * Compares two values by mapping them to a type with an `Ord` instance.
 *
 * @sig comparing :: forall a b. Ord b => (a -> b) -> (a -> a -> Ordering)
 */
export const comparing = on(compare)

/**
 * Take the minimum of two values. If they are considered equal, the first
 * argument is choosen.
 *
 * @sig min :: forall a. Ord a => a -> a -> a
 */
export const min = curryN(2, (x, y) => {
  return compare(x, y).matchWith({
    LT: () => x,
    GT: () => y,
    EQ: () => x
  })
})

/**
 * Take the maximum of two values. If they are considered equal, the first
 * argument is choosen.
 *
 * @sig max :: forall a. Ord a => a -> a -> a
 */
export const max = curryN(2, (x, y) => {
  return compare(x, y).matchWith({
    LT: () => y,
    GT: () => x,
    EQ: () => x
  })
})

/**
 * Clamp a value between a minimum and a maximum. For example:
 * ```javascript
 * let f = clamp(0, 10)
 * f(-2) // 0
 * f(11) // 10
 * f(5)  // 5
 * ```
 */
export const clamp = curryN(3, (low, hi, x) => min(hi, max(low, x)))

function compareArray(xs, ys) {
  let i = 0
  const xlen = xs.length
  const ylen = ys.length
  while (i < xlen && i < ylen) {
    const result = compare(xs[i], ys[i])
    if (!EQ.hasInstance(result)) {
      return result
    }
    i++
  }
  return xlen === ylen ? EQ()
  :      xlen >   ylen ? GT()
  :                      LT()
}
