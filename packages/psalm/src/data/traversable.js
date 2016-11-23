import { lift2 } from '../control/apply'
import { curryN, id } from './function'
import { map } from './functor'
import { un, newtype } from '../newtype'
import * as fl from '../util/fantasy'
import { assertFunction } from '../util/assert'
import { unsoppertedMethod } from '../util/error'


export const traverse = curryN(3, (point, f, ta) => {
  assertFunction('traverse', f)
  return typeof ta[fl.traverse] === 'function' ? ta[fl.traverse](f, point)
  :      Array.isArray(ta)                     ? traversableArray(f, point, ta)
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

const array1 = x => [x]
const pair = x => y => [x, y]
const concat2 = xs => ys => xs.concat(ys)

function traversableArray(f, point, xs) {
  /* eslint-disable no-case-declarations */
  function go(idx, n) {
    switch (n) {
      case 0: return point([]);
      case 2: return lift2(pair, f(xs[idx]), f(xs[idx + 1]));
      default:
        const m = Math.floor(n / 4) * 2;
        return lift2(concat2, go(idx, m), go(idx + m, n - m));
    }
  }
  const len = xs.length
  /* eslint-enable no-case-declarations */
  return len % 2 === 1     ? lift2(concat2, map(array1, f(xs[0])), go(1, len - 1))
  :      /** otherwise */    go(0, len)
}
