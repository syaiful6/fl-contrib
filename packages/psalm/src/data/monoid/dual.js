import { empty } from '.'
import { concat } from '../semigroup'
import { show } from '../show'
import { newtype, un } from '../../newtype'
import * as fl from '../../util/fantasy'


export const Dual = M => {
  const Dual = newtype('psalm.monoid.Dual')

  Dual[fl.empty] = () => Dual(empty(M))

  Dual.prototype[fl.concat] = function mappend(other) {
    return Dual(concat(un(other), un(this)))
  }

  Dual.prototype.toString = function toString() {
    return `Dual(${show(un(this))})`
  }
  return Dual
}
