import { equals } from '../setoid'
import { show } from '../show'
import { newtype, un } from '../../newtype'
import * as fl from '../../util/fantasy'


/**
 * Monoid under conjuntion.
 */
export const Conj = newtype()

Conj[fl.of] = Conj

Conj[fl.empty] = () => Conj(true)

Conj.prototype[fl.concat] = function (conj) {
  return Conj(un(this) && un(conj))
}

Conj.prototype[fl.equals] = function (conj) {
  return equals(un(this), un(conj))
}

Conj.prototype.toString = function () {
  return `Conj(${show(un(this))})`
}
