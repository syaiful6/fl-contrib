import { empty } from '.'
import { concat } from '../semigroup'
import * as fl from '../../util/fantasy'
import { newtype, un } from '../../newtype'

export const Dual = M => {
  const Dual = newtype()

  Dual[fl.empty] = () => Dual(empty(M))

  Dual.prototype[fl.concat] = function mappend(other) {
    return Dual(concat(un(other), un(this)))
  }
  return Dual
}
