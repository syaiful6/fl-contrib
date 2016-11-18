import { empty } from '.'
import { concat } from '../semigroup'
import { newtype, un } from '../../newtype'
import * as fl from '../../util/fantasy'


export const Dual = M => {
  const Dual = newtype()

  Dual[fl.empty] = () => Dual(empty(M))

  Dual.prototype[fl.concat] = function mappend(other) {
    return Dual(concat(un(other), un(this)))
  }
  return Dual
}
