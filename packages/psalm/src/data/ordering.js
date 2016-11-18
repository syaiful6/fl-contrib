import { data } from '../adt'
import { curryN } from './function'
import { assertAdtMember } from '../util/assert'
import * as fl from '../util/fantasy'


const Ordering = data('data.Ordering', {
  LT: () => ({}),
  GT: () => ({}),
  EQ: () => ({})
})

const { LT, GT, EQ } = Ordering

LT.value = LT()
GT.value = GT()
EQ.value = EQ()

LT.prototype[fl.equals] = function (other) {
  return LT.hasInstance(other)
}

GT.prototype[fl.equals] = function (other) {
  return GT.hasInstance(other)
}

EQ.prototype[fl.equals] = function (other) {
  return EQ.hasInstance(other)
}

LT.prototype['fl-contrib/compare'] = function (ordering) {
  return ordering.matchWith({
    LT: () => EQ.value,
    GT: () => LT.value,
    EQ: () => LT.value
  })
}

GT.prototype['fl-contrib/compare'] = function (ordering) {
  return ordering.matchWith({
    LT: () => GT.value,
    GT: () => EQ.value,
    EQ: () => GT.value
  })
}

EQ.prototype['fl-contrib/compare'] = function (ordering) {
  return ordering.matchWith({
    LT: () => LT.value,
    GT: () => GT.value,
    EQ: () => EQ.value
  })
}

LT.prototype.toString = function () {
  return 'LT'
}

GT.prototype.toString = function () {
  return 'GT'
}

EQ.prototype.toString = function () {
  return 'EQ'
}

LT.prototype[fl.concat] = function () {
  return LT()
}

GT.prototype[fl.concat] = function () {
  return GT()
}

EQ.prototype[fl.concat] = function (other) {
  assertAdtMember(Ordering)(other, 'Argument 1 passed concat must be also ordering.')
  return other
}

LT.prototype.valueOf = () => -1
GT.prototype.valueOf = () => 1
EQ.prototype.valueOf = () => 0

const unsafeCompare = curryN(2, (x, y) => {
  return x < y        ? LT.value
  :      x === y      ? EQ.value
  : /** otherwise */    GT.value
})

/**
 * Invert ordering
 */
function invert(ordering) {
  return ordering.matchWith({
    LT: () => GT.value,
    GT: () => LT.value,
    EQ: () => EQ.value
  })
}

export { Ordering, LT, GT, EQ, unsafeCompare, invert }
