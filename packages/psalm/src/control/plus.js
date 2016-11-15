import * as fl from '../util/fantasy'
import { unsoppertedMethod } from '../util/error'

/**
 * Plus extend Alt, with additional zero method.
 *
 * `Plus` instances should satisfy the following laws:
 * Left identity: alt(zero(p), x) === x
 * Right identity: alt(x, zero(p)) === x
 * Annihilation: map(f, zero(p)) === zero(p)
 */
export const zero = p =>
  typeof p[fl.zero] === 'function'                                 ? p[fl.zero]()
  : p.constructor && typeof p.constructor[fl.zero] === 'function'  ? p.constructor[fl.zero]()
  : /** otherwise */                                                 unsoppertedMethod(fl.zero)(p)
