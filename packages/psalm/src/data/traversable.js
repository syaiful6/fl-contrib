import { lift2, lift3 } from '../control/apply'
import { curryN, id } from './function'
import { map } from './functor'
import { un, newtype } from '../newtype'
import * as fl from '../util/fantasy'
import { assertFunction } from '../util/assert'
import { unsoppertedMethod } from '../util/error'


export const traverse = curryN(3, (point, f, ta) => {
  assertFunction('traverse', f)
  return typeof ta[fl.traverse] === 'function' ? ta[fl.traverse](f, point)
  :      Array.isArray(ta)                     ? traversableArray(point, f, ta)
  :                                              unsoppertedMethod(fl.traverse)(ta)
})

export const sequence = curryN(2, (point, ta) => traverse(point, id, ta))

// newtype StateL s a = StateL (s -> { accum :: s, value :: a })
const StateL = newtype('psalm.traversable.StateL')

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

/**
 *
 */
const StateR = newtype('psalm.traversable.StateR')

StateR.prototype[fl.map] = function (f) {
  return StateR(s => {
    const accum = un(this)(s)
    return {
      accum: accum.accum,
      value: f(accum.value)
    }
  })
}

StateR.prototype[fl.ap] = function (other) {
  return StateR(s => {
    const v = un(this)(s)
    const ff = un(other)(v.accum)
    return {
      accum: ff.accum,
      value: ff.value(v.value)
    }
  })
}

StateR[fl.of] = a => StateR(s => ({ accum: s, value: a }))

/**
 * Fold a data structure from the right, keeping all intermediate results
 * instead of only the final result.
 */
export const mapAccumR = curryN(3, (f, s0, xs) =>
  un(traverse(StateR[fl.of], a => StateR(s => f(s, a)), xs))(s0)
)

/**
 * @sig scanr :: forall a b f. Traversable f => (a -> b -> b) -> b -> f a -> f b
 */
export const scanr = curryN(3, (f, b0, xs) => {
  const go = (b, a) => {
    const b_ = f(a, b)
    return { accum: b_, value: b_ }
  }
  return mapAccumR(go, b0, xs).value
})

const traversableArray = (function () {
  const array1 = x => [x]
  const array2 = x => y => [x, y]
  const array3 = x => y => z => [x, y, z]
  const concat2 = xs => ys => xs.concat(ys)
  return function (point, f, arr) {
    /* eslint-disable no-case-declarations */
    function go(bottom, top) {
      switch (top - bottom) {
        case 0: return point([])
        case 1: return map(array1, f(arr[bottom]))
        case 2: return lift2(array2, f(arr[bottom]), f(arr[bottom + 1]))
        case 3: return lift3(array3, f(arr[bottom]), f(arr[bottom + 1]), f(arr[bottom + 2]))
        default:
          const pivot = bottom + Math.floor((top - bottom) / 4) * 2
          return lift2(concat2, go(bottom, pivot), go(pivot, top))
      }
    }
    /* eslint-enable no-case-declarations */
    return go(0, arr.length)
  }
})()
