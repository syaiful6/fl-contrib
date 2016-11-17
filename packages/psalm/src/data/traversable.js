import { map } from './functor'
import { lift2 } from '../control/apply'
import { curryN, id } from './function'
import * as fl from '../util/fantasy'
import { un, newtype } from '../newtype'
import { assertFunction } from '../util/assert'
import { unsoppertedMethod } from '../util/error'

export const traverse = curryN(3, (point, f, ta) => {
  assertFunction(f, 'argument 2 to traverse is expected to be function, you pass it a ' + typeof f)
  return typeof ta[fl.traverse] === 'function' ? ta[fl.traverse](f, point)
  :      Array.isArray(ta)                     ? traversableArray(point, f, ta)
  :                                              unsoppertedMethod(fl.traverse)(ta)
})

export const sequence = curryN(2, (point, ta) => traverse(point, id, ta))

// newtype StateL s a = StateL (s -> { accum :: s, value :: a })
const StateL = newtype()

StateL.prototype[fl.map] = function (f) {
  return StateL(s => {
    const accum = un(this)(s)
    return {
      accum: accum.accum,
      value: f(accum.value)
    }
  })
}

StateL.prototype[fl.ap] = function (other) {
  return StateL(s => {
    const f = un(other)(s)
    const v = un(this)(f.accum)
    return {
      accum: v.accum,
      value: f.value(v.value)
    }
  })
}

StateL[fl.of] = a => StateL(s => ({ accum: s, value: a }))

/**
 * Fold a data structure from the left, keeping all intermediate results instead
 * of only the final result.
 */
export const mapAccumL = curryN(3, (f, s0, xs) =>
  un(traverse(StateL[fl.of], a => StateL(s => f(s, a)), xs))(s0)
)

/**
 * scanl :: forall a b f. Traversable f => (b -> a -> b) -> b -> f a -> f b
 */
export const scanl = curryN(3, (f, b0, xs) => {
  const go = (b, a) => {
    const b_ = f(b, a)
    return { accum: b_, value: b_ }
  }
  return mapAccumL(go, b0, xs).value
})

const traversableArray = (function () {
  const array1 = x => [x]
  const array2 = x => y => [x, y]
  const concat2 = xs => ys => xs.concat(ys)
  return function (point, f, arr) {
    /* eslint-disable no-case-declarations */
    function go(bottom, top) {
      switch (top - bottom) {
        case 0: return point([])
        case 1: return map(array1, f(arr[bottom]))
        case 2: return lift2(array2, f(arr[bottom]), f(arr[bottom + 1]))
        default:
          const pivot = (bottom + Math.floor((top - bottom) / 4) * 2) || 1
          return lift2(concat2, go(bottom, pivot), go(pivot, top))
      }
    }
    /* eslint-enable no-case-declarations */
    return go(0, arr.length)
  }
})()
