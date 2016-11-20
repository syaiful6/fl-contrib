import { id, compose } from '../function'
import { show } from '../show'
import { newtype, un } from '../../newtype'
import * as fl from '../../util/fantasy'


export const Endo = newtype()

Endo.prototype[fl.concat] = function mappend(endo) {
  return Endo(compose(un(this), un(endo)))
}

Endo.prototype.toString = function () {
  return `Endo(${show(un(this))})`
}

Endo[fl.empty] = () => Endo(id)
