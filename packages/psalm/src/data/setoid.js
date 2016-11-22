import { curryN } from './function'
import { unsoppertedMethod } from '../util/error'
import { equals as eqMethod } from '../util/fantasy'


export const equals = curryN(2, (a, b) => {
  return typeof a[eqMethod] === 'function'    ? a[eqMethod](b)
  :      typeof a === 'string'                ? refEQ(a, b)
  :      typeof a === 'number'                ? refEQ(a, b)
  :      typeof a === 'boolean'               ? refEQ(a, b)
  :      Array.isArray(a) && Array.isArray(b) ? eqArray(a, b)
  :                                             unsoppertedMethod(eqMethod)(a)
})

export function eq(b) {
  return equals(this, b)
}

const refEQ = (a, b) => a === b

function eqArray(xs, ys) {
  let len = xs.length
  if (len !== ys.length) return false
  for (let i = 0; i < len; i++) {
    if (!equals(xs[i], ys[i])) return false
  }
  return true
}
