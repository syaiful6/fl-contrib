import { equals } from '../setoid'
import { show } from '../show'
import { newtype, un } from '../../newtype'
import { assertAdtMember } from '../../util/assert'
import * as fl from '../../util/fantasy'


export const Additive = newtype('psalm.monoid.Additive')

const assertAdditive = assertAdtMember(Additive)

Additive[fl.empty] = () => Additive(0)

Additive[fl.of] = x => Additive(x)

Additive.prototype[fl.concat] = function (additive) {
  assertAdditive(`Additive.${fl.concat}`, additive)
  return Additive(un(this) + un(additive))
}

Additive.prototype[fl.equals] = function (additive) {
  assertAdditive(`Additive.${fl.equals}`, additive)
  return equals(un(this), un(additive))
}

Additive.prototype.toString = function () {
  return `Additive(${show(un(this))})`
}
