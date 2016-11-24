import { curryN, constant, id } from '../data/function'
import { map } from '../data/functor'
import { unsoppertedMethod } from '../util/error'
import * as fl from '../util/fantasy'


/**
 * implementation for function
 */
const apFn = (a, b) =>
  x => a(x)(b(x))

/**
 * implementation for array
 */
const apArray = (fs, xs) => fs.reduce((acc, f) => acc.concat(map(f, xs)), [])

/**
 * A value that implements the Apply specification must also implement the Functor
 * specification:
 *
 * Laws:
 * - v.ap(u.ap(a.map(f => g => x => f(g(x))))) === v.ap(u).ap(a)
 */
export const ap = curryN(2, (apF, apV) => {
  return typeof apV[fl.ap] === 'function'         ? apV[fl.ap](apF)
  :      typeof apF        === 'function'         ? apFn(apF, apV)
  :      Array.isArray(apF) && Array.isArray(apV) ? apArray(apF, apV)
  :      /** otherwise */                           unsoppertedMethod(fl.ap)(apV)
})

/**
 * An infix version of ap to use with es7 operator
 * ```javascript
 * > Right(add(1))::apply(Right(10))
 * . 11
 * ```
 */
export function apply(apV) {
  return ap(this, apV)
}

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @sig apFirst :: forall a b f. Apply f => f a -> f b -> f a
 */
export const apFirst = curryN(2, (a, b) => ap(map(constant, a), b))

/**
 * Combine two effectful actions, keeping only the result of the second
 *
 * @sig apSecond :: forall a b f. Apply f => f a -> f b -> f b
 */
export const apSecond = curryN(2, (a, b) => ap(map(constant(id), a), b))

/**
 * Lift a function of two arguments to a function which accepts and returns
 * values wrapped with the type constructor `f`.
 *
 * @sig lift2 :: forall a b c f. Apply f => (a -> b -> c) -> f a -> f b -> f c
 */
export const lift2 = curryN(3, (f, a, b) => ap(map(f, a), b))

/**
 * Lift a function of three arguments to a function which accepts and returns
 * values wrapped with the type constructor `f`.
 *
 * @sig lift3 :: forall a b c d f. Apply f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
 */
export const lift3 = curryN(4, (f, a, b, c) => ap(lift2(f, a, b), c))

/**
 * Lift a function of four arguments to a function which accepts and returns
 * values wrapped with the type constructor `f`.
 *
 * @sig lift4 :: forall a b c d e f. Apply => (a -> b -> c -> d -> e) -> f a -> f b -> f c -> f d -> f e
 */
export const lift4 = curryN(5, (f, a, b, c, d) => ap(lift3(f, a, b, c), d))

/**
 * Lift a function of five arguments to a function which accepts and returns
 * values wrapped with the type constructor `f`.
 *
 * @sig lift5 :: forall a b c d e f g. Apply f => (a -> b -> c -> d -> e -> g) -> f a -> f b-> f c -> f d -> f e -> f g
 */
export const lift5 = curryN(6, (f, a, b, c, d, e) => ap(lift4(f, a, b, c, d), e))
