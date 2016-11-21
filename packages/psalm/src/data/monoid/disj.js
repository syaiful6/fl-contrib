import { equals } from '../setoid'
import { show } from '../show'
import { newtype, un } from '../../newtype'
import { assertAdtMember } from '../../util/assert'
import * as fl from '../../util/fantasy'


/**
 * Monoid under disjuntion.
 */
export const Disj = newtype('psalm.monoid.Disj')

const assertDisj = assertAdtMember(Disj)

Disj[fl.of] = Disj

Disj[fl.empty] = () => Disj(false)

Disj.prototype[fl.concat] = function (disj) {
  assertDisj(`Disj.${fl.concat}`, disj)
  return Disj(un(this) || un(disj))
}

Disj.prototype[fl.equals] = function (disj) {
  assertDisj(`Disj.${fl.equals}`, disj)
  return equals(un(this), un(disj))
}

Disj.prototype.toString = function () {
  return `Disj(${show(un(this))})`
}
