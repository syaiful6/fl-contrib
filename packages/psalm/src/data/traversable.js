import { map } from './functor'
import { lift2 } from '../control/apply'
import { curryN, id } from './function'
import * as fl from '../util/fantasy'
import { assertFunction } from '../util/assert'
import { unsoppertedMethod } from '../util/error'

export const traverse = curryN(3, (point, f, ta) => {
  assertFunction(f, 'argument 2 to traverse is expected to be function, you pass it a ' + typeof f)
  return typeof ta[fl.traverse] === 'function' ? ta[fl.traverse](f, point)
  :      Array.isArray(ta)                     ? traversableArray(point, f, ta)
  :                                              unsoppertedMethod(fl.traverse)(ta)
})

export const sequence = curryN(2, (point, ta) => traverse(point, id, ta))

const traversableArray = (function () {
  const array1 = x => [x]
  const array2 = x => y => [x, y]
  const concat2 = xs => ys => xs.concat(ys)
  return function (point, f, arr) {
    function go(bottom, top) {
      const pivot = bottom + Math.floor((top - bottom) / 4) * 2
      switch (top - bottom) {
        case 0: return point([])
        case 1: return map(array1, f(arr[bottom]))
        case 2: return lift2(array2, f(arr[bottom]), f(arr[bottom + 1]))
        default:
          return lift2(concat2, go(bottom, pivot), go(pivot, top))
      }
    }
    return go(0, arr.length)
  }
})()
