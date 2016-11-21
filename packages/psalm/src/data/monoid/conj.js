import { equals } from '../setoid'
import { show } from '../show'
import { newtype, un } from '../../newtype'
import { assertAdtMember } from '../../util/assert'
import * as fl from '../../util/fantasy'


/**
 * Monoid under conjuntion.
 */
export const Conj = newtype('psalm.monoid.Conj')

const assertConj = assertAdtMember(Conj)

Conj[fl.of] = Conj

Conj[fl.empty] = () => Conj(true)

Conj.prototype[fl.concat] = function (conj) {
  assertConj(`Conj.${fl.concat}`, conj)
  return Conj(un(this) && un(conj))
}

Conj.prototype[fl.equals] = function (conj) {
  assertConj(`Conj.${fl.equals}`, conj)
  return equals(un(this), un(conj))
}

Conj.prototype.toString = function () {
  return `Conj(${show(un(this))})`
}
