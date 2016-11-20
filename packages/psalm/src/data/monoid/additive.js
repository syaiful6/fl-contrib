import { equals } from '../setoid'
import { show } from '../show'
import { newtype, un } from '../../newtype'
import * as fl from '../../util/fantasy'


export const Additive = newtype()

Additive[fl.empty] = () => Additive(0)

Additive[fl.of] = x => Additive(x)

Additive.prototype[fl.concat] = function (other) {
  return Additive(un(this) + un(other))
}

Additive.prototype[fl.equals] = function (additive) {
  return equals(un(this), un(additive))
}

Additive.prototype.toString = function () {
  return `Additive(${show(un(this))})`
}
