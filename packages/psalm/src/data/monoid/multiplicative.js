import { equals } from '../setoid'
import { show } from '../show'
import { newtype, un } from '../../newtype'
import * as fl from '../../util/fantasy'


export const Multiplicative = newtype('psalm.monoid.Multiplicative')

Multiplicative[fl.empty] = () => Multiplicative(1)

Multiplicative[fl.of] = x => Multiplicative(x)

Multiplicative.prototype[fl.concat] = function (other) {
  return Multiplicative(un(this) * un(other))
}

Multiplicative.prototype[fl.equals] = function (mul) {
  return equals(un(this), un(mul))
}

Multiplicative.prototype.toString = function () {
  return `Multiplicative(${show(un(this))})`
}
