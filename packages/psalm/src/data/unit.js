import { OrdC } from './ord'
import { EQ } from './ordering'
import * as fl from '../util/fantasy'


function Unit() {
  if (!(this instanceof Unit)) {
    return new Unit()
  }
}

Unit[fl.empty] = Unit

Unit.prototype.toString = function () {
  return 'unit'
}

Unit.prototype[fl.equals] = () => true

Unit.prototype[OrdC.compare] = () => EQ.value

Unit.prototype[fl.concat] = function () {
  return this
}

export const unit = Unit()
