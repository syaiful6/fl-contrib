import { FoldableC } from './foldable'
import { id } from './function'
import { map } from './functor'
import { show } from './show'
import { concat } from './semigroup'
import { equals } from './setoid'
import * as fl from '../util/fantasy'
import { define } from '../util/property'


const TAGGED = 'psalm.data.Tuple'

export function tuple(a, b) {
  switch (arguments.length) {
    case 0:
      throw new TypeError('No argument given to tuple')
    case 1:
      return b => new Tuple(a, b)
    default:
      return new Tuple(a, b)
  }
}

export function fst(tuple) {
  if (tuple['@@type'] !== TAGGED) {
    throw new TypeError(
      `Argument 1 passed to fst must be a tuple, you passed ${show(tuple)}`
    )
  }
  return tuple[0]
}

export function snd(tuple) {
  if (tuple['@@type'] !== TAGGED) {
    throw new TypeError(
      `Argument 1 passed to snd must be a tuple, you passed ${show(tuple)}`
    )
  }
  return tuple[1]
}

export function Tuple(a, b) {
  if (!(this instanceof Tuple)) {
    return new Tuple(a, b)
  }
  this[0] = a
  this[1] = b
  define(this, '@@type', TAGGED)
}

Tuple.prototype[fl.concat] = function (tuple) {
  if (tuple['@@type'] !== TAGGED) {
    throw new TypeError(
      `Argument 1 passed to Tuple.${fl.concat} must be a tuple`
      + `, you passed ${show(tuple)}`
    )
  }
  return new Tuple(
    concat(this[0], tuple[0]),
    concat(this[1], tuple[1])
  )
}

Tuple.prototype[fl.bimap] = function (f, g) {
  return new Tuple(f(this[0]), g(this[1]))
}

Tuple.prototype[fl.map] = function (f) {
  return this[fl.bimap](id, f)
}

Tuple.prototype[fl.ap] = function (tuple) {
  if (tuple['@@type'] !== TAGGED) {
    throw new TypeError(
      `Argument 1 passed to Tuple.${fl.ap} must be a tuple`
      + `, you passed ${show(tuple)}`
    )
  }
  return new Tuple(
    concat(this[0], tuple[0]),
    tuple[1](this[1])
  )
}

Tuple.prototype[fl.extend] = function (f) {
  return Tuple(this[0], f(this))
}

Tuple.prototype[fl.extract] = function () {
  return this[1]
}

Tuple.prototype[FoldableC.foldr] = function (f, i) {
  return f(this[1], i)
}

Tuple.prototype[FoldableC.foldl] = function (f, i) {
  return f(i, this[1])
}

Tuple.prototype[FoldableC.foldMap] = function (_, f) {
  return f(this[1])
}

Tuple.prototype[fl.traverse] = function (f) {
  return map(tuple(this[0]), f(this[1]))
}

Tuple.prototype[fl.equals] = function (tuple) {
  if (tuple['@@type'] !== TAGGED) {
    throw new TypeError(`Argument 1 passed to Tuple.${fl.equals} must be a tuple`)
  }
  return equals(this[0], tuple[0]) && equals(this[1], tuple[1])
}

Tuple.prototype.toString = function () {
  return `(${show(this[0])}, ${show(this[1])})`
}
