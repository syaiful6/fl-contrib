import { curryN, id, flip, compose } from '../data/function'
import { assertFunction } from '../util/assert'
import { unsoppertedMethod } from '../util/error'
import * as fl from '../util/fantasy'


/**
 * @sig chain :: forall a b. Chain m => (a -> m b) -> m a -> m b
 */
export const chain = curryN(2, (f, ch) => {
  assertFunction('chain', f)
  return typeof ch[fl.chain] === 'function' ? ch[fl.chain](f)
  :      typeof ch           === 'function' ? chainFn(f, ch)
  :      Array.isArray(ch)                  ? chainArray(f, ch)
  :      /** otherwise */                     unsoppertedMethod(fl.chain)(ch)
})

/**
 * the flipped version of chain
 *
 * @sig bind :: forall a b. Chain m => m a -> (a -> m b) -> m b
 */
export const bind = flip(chain)

/**
 * Collapse two applications of a monadic type constructor into one.
 *
 * @sig join :: forall a m. Chain m => m (m a) -> m a
 */
export const join = chain(id)

/**
 * @sig composeK :: forall a b c m. Chain m => (b -> m c) -> (a -> m b) -> a -> m c
 */
export const composeK = (f, g) => compose(chain(f), chain(g))

composeK.all = (...binds) => binds.reduce(composeK)

function chainArray(f, xs) {
  let result = []
  for (let i = 0, len = xs.length; i < len; i++) {
    Array.prototype.push.apply(result, f(xs[i]))
  }
  return result
}

function chainFn(f, m) {
  return x => f(m(x))(x)
}
