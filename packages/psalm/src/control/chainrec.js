import { data } from '../adt'
import { curryN } from '../data/function'
import { map, mapConst } from '../data/functor'
import { assertFunction } from '../util/assert'
import * as fl from '../util/fantasy'
import { unsoppertedMethod } from '../util/error'


const Step = data('chainRec.Step', {
  Loop: (value) => ({ value }),
  Done: (value) => ({ value })
})

const { Loop, Done } = Step

Loop.prototype[fl.bimap] = function (f) {
  return Loop(f(this.value))
}

Done.prototype[fl.bimap] = function (_, g) {
  return Done(g(this.value))
}

Loop.prototype[fl.map] = function () {
  return Loop(this.value)
}

Done.prototype[fl.map] = function (f) {
  return Done(f(this.value))
}

export { Step, Loop, Done }

/**
 * An attempt to make chainRec more understandable
 *
 * forall a b. (a -> m (Step a b)) -> a -> m b
 */
export const TailRecMC = {
  tailRecM: 'fl-contrib/tailRecM'
}
/**
 * this function dispatch chainRec to ```m```. You maybe should avoid using
 * this function, because this function signature a bit confusing, and it can't
 * be easily composed.
 *
 * @sig chainRec :: forall a b m. ChainRec m => m -> ((a -> c, b -> c, a) -> m c, a) -> m b
 */
export const chainRec = curryN(3, (m, f, i) => {
  assertFunction('chainRec', f)
  return typeof m[fl.chainRec] === 'function' ? m[fl.chainRec](f, i)
  :      /** otherwise */                       unsoppertedMethod(fl.chainRec)(m)
})

/**
 * dispatch to m['fl-contrib/tailRecM'] if it available, if not then use chainRec
 * under the hood.
 *
 * @sig tailRecM :: forall a b m. ChainRec m => m -> (a -> m (Step a b)) -> a -> m b
 */
export const tailRecM = curryN(3, (m, f, i) => {
  assertFunction('tailRecM', f)
  return typeof m[TailRecMC.tailRecM] === 'function' ? m[TailRecMC.tailRecM](f, i)
  :      typeof m[fl.chainRec] === 'function'        ? tailRecDefault(m, f, i)
  :      /** otherwise */                              unsoppertedMethod(TailRecMC.tailRecM)(m)
})

/**
 * @sig tailRec :: forall a b m. ChainRec m => m -> (a -> m (Step a b)) -> a -> m b
 */
export const tailRecDefault = curryN(3, (m, f, i) => {
  const go = (n, d, v) => {
    return map(x => {
      return x.matchWith({
        Loop: ({ value }) => n(value),
        Done: ({ value }) => d(value)
      })
    }, f(v))
  }
  return chainRec(m, go, i)
})

/**
 * @sig forever :: forall m a b. ChainRec m => m -> m a -> m b
 */
export const forever = curryN(2, (M, ma) => tailRecM(M, v => mapConst(Loop(v), ma), {}))

/**
 * Define fantasy-land's chainRec spec by define tailRec / chainRec. Note: you should
 * override one of them
 */
export const ChainRec = M => {
  M[fl.chainRec] = function (f, v) {
    return M[TailRecMC.tailRecM](x => f(Loop, Done, x), v)
  }
  M[TailRecMC.tailRecM] = tailRecDefault(M)
  return M
}
