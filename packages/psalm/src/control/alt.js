import { curryN } from '../data/function'
import { unsoppertedMethod } from '../util/error'
import * as fl from '../util/fantasy'


/**
 * The `Alt` type class identifies an associative operation on a type constructor.
 * It similiar to Semigroup. It separated because sometimes it used to ```choose```
 * rather than concatenating. For example on Maybe structure, alt maybe defined
 * as preferring Just over Nothing.
 *
 * @sig forall a t. forall Alt t => t a -> t a -> t a
 */
export const alt = curryN(2, (a, b) => {
  return typeof a[fl.alt] === 'function' ? a[fl.alt](b)
  :      /** otherwise */                  unsoppertedMethod(fl.alt)(a)
})
