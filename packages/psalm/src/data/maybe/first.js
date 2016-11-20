import { show } from '../show'
import { newtype, un } from '../../newtype'
import * as fl from '../../util/fantasy'
import { Nothing, Just } from './core'


/**
 * Monoid returning the first (left-most) non-`Nothing` value.
 *
 * ```javascript
 * > concat(First(Just(10)), First(Just(9)))
 * . First(Just(10))
 * ```
 */
export const First = newtype()

First.prototype[fl.concat] = function (second) {
  return Just.hasInstance(un(this)) ? this : second
}

First[fl.empty] = () => First(Nothing.value)

First.prototype.toString = function () {
  return `First(${show(un(this))})`
}
