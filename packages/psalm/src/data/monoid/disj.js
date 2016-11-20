import { equals } from '../setoid'
import { show } from '../show'
import { newtype, un } from '../../newtype'
import * as fl from '../../util/fantasy'


/**
 * Monoid under disjuntion.
 */
export const Disj = newtype()

Disj[fl.of] = Disj

Disj[fl.empty] = () => Disj(false)

Disj.prototype[fl.concat] = function (disj) {
  return Disj(un(this) || un(disj))
}

Disj.prototype[fl.equals] = function (disj) {
  return equals(un(this), un(disj))
}

Disj.prototype.toString = function () {
  return `Disj(${show(un(this))})`
}
