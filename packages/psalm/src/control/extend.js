import { curryN, compose, id } from '../data/function'
import { assertFunction } from '../util/assert'
import { unsoppertedMethod } from '../util/error'
import * as fl from '../util/fantasy'


/**
 *  `Extend` is the dual of `Chain`
 *
 * @sig forall b a w. Extend w => (w a -> b) -> w a -> w b
 */
export const extend = curryN(2, (f, ex) => {
  assertFunction(f, 'argument 1 passed to extend must be a function')
  return typeof ex[fl.extend] === 'function' ? ex[fl.extend](f)
  :      /** otherwise */                      unsoppertedMethod(fl.extend)(ex)
})

/**
 * Duplicate a comonadic context.
 *
 * @sig duplicate :: forall a w. Extend w => w a -> w (w a)
 */
export const duplicate = extend(id)

/**
 * Right-associative Co-Kleisli composition
 *
 * @sig composeCoK :: forall b a w c. Extend w => (w a -> b) -> (w b -> c) -> w a -> c
 */
export const composeCoK = (f, g) => compose(extend(f), extend(g))
composeCoK.all = (...exs) => exs.reduce(composeCoK)
