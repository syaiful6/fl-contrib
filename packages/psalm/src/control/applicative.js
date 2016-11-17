import { constant } from './apply'
import { curryN } from '../data/function'
import * as fl from '../util/fantasy'
import { unsoppertedMethod } from '../util/error'

export const pure = curryN(2, (A, x) => {
  return typeof A[fl.of] === 'function'                ? A[fl.of](x)
  :      A.constructor && typeof A.constructor[fl.of]  ? A.constructor[fl.of](x)
  :      A === Function || typeof A === 'function'     ? constant(x)
  :      A === Array  || Array.isArray(A)              ? [x]
  :      /** otherwise */                                unsoppertedMethod(fl.of)(x)
})

/**
 * Perform an applicative action when a condition is true. if it false then we just
 * put an empty object to it.
 *
 * @sig when :: forall m. Applicative m => Boolean -> m Unit -> m Unit
 */
export const when = curryN(2, (condition, m) => condition === true ? m : pure(m, {}))

/**
 * Perform an applicative action unless a condition is true.
 *
 * @sig unless :: forall m. Applicative m => Boolean -> m Unit -> m Unit
 */
export const unless = curryN(2, (condition, m) => condition === false ? m : pure(m, {}))
