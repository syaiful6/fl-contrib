import { curryN, compose, constant } from './function'
import { map as fmap } from '../util/fantasy'
import { assertFunction } from '../util/assert'
import { unsoppertedMethod } from '../util/error'

/**
 * A `Functor` is a type constructor which supports a mapping operation.
 *
 * Instances must satisfy the following laws:
 * Identity: map(x => x, u) === u
 * composition: map(x => f(g(x)), u) === map(f, map(g, u))
 *
 * @sig forall a b. Functor f => (a -> b) -> f a -> f b
 */
export const map = curryN(2, (f, functor) => {
  assertFunction(f, 'argument 1 to map is expected to be function, you pass it a ' + typeof f)
  return typeof functor[fmap]    === 'function'   ? functor[fmap](f)
  :      typeof functor          === 'function'   ? compose(f, functor)
  :      Array.isArray(functor)                   ? arrayMap(f, functor)
  :      /** otherwise */                           unsoppertedMethod(fmap)(functor)
})

/**
 * Ignore the return value of a computation, using the specified return value
 * instead.
 *
 * @sig mapConst :: forall a b. Functor f => a -> f b -> f a
 */
export const mapConst = curryN(2, (x, functor) => map(constant(x), functor))

/**
 * Apply a value in a computational context to a value in no context.
 *
 * @sig flap :: forall f a b. Functor f => f (a -> b) -> a -> f b
 */
export const flap = curryN(2, (ff, a) => map(f => f(a), ff))

function arrayMap(f, xs) {
  return xs.map(x => f(x))
}
