import { show } from '../show'
import { newtype, un } from '../../newtype'
import * as fl from '../../util/fantasy'
import { Nothing, Just } from './core'


/**
 * Monoid returning the last (right-most) non-`Nothing` value.
 *
 * ```javascript
 * > concat(Last(Just(10)), Last(Just(9)))
 * . Last(Just(9))
 * ```
 */
export const Last = newtype('psalm.maybe.Last')

Last.prototype[fl.concat] = function (second) {
  return Just.hasInstance(un(second)) ? second : this
}

Last[fl.empty] = () => Last(Nothing.value)

Last.prototype.toString = function () {
  return `Last(${show(un(this))})`
}
