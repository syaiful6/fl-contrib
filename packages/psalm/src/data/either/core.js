import { data } from '../../adt'
import {
  Loop, Done, TailRecMC, ChainRec
} from '../../control/chainrec'
import { FoldableC } from '../foldable'
import { map } from '../functor'
import { empty } from '../monoid'
import { compare, OrdC } from '../ord'
import { LT, GT } from '../ordering'
import { equals } from '../setoid'
import { show } from '../show'
import { assertFunction, assertAdtMember } from '../../util/assert'
import * as fl from '../../util/fantasy'


/**
 * The `Either` type is used to represent a choice between two types of value.
 * A common use case for `Either` is error handling, where `Left` is used to
 * carry an error value and `Right` is used to carry a success value.
 */
const Either = data('psalm.Either', {
  Left: (value) => ({ value }),
  Right: (value) => ({ value })
}).derive(ChainRec)

const { Left, Right } = Either

export const assertEither = assertAdtMember(Either)

/**
 * The `Functor` instance allows functions to transform the contents of a
 * `Right` with `map` function, `Left` values are untouched
 *
 * ```javascript
 * > map(increment, Right(10))
 * . Right(11)
 * > map(increment, Left('an error occured'))
 * . Left('an error occured')
 * ```
 */
Right.prototype[fl.map] = function(transform) {
  return Right(transform(this.value))
}

Left.prototype[fl.map] = function() {
  return this
}

// Bifunctor
Right.prototype[fl.bimap] = function (_, g) {
  return Right(g(this.value))
}

Left.prototype[fl.bimap] = function (f) {
  return Left(f(this.value))
}

/**
 * The `Apply` instance allows functions contained within a `Right` to
 * transform a value contained within a `Right` using `ap` function.
 * Combining `Functor`'s `map` with `Apply`'s `ap` can be used transform a
 * pure function to take `Either`-typed arguments so `f :: a -> b -> c`
 * becomes `f :: Either l a -> Either l b -> Either l c`:
 *
 * ```javascript
 * > ap(Left('error'), Right(10))
 * . Left('error')
 * .
 * > ap(Right(add(10)), Left('err'))
 * . Left('error')
 * .
 * > ap(map(add, Right(10)), Right(12))
 * . Right(22)
 * ```
 *
 * The `Left`-preserving behaviour of both operators means the result of
 * an expression like the above but where any one of the values is `Left`
 * means the whole result becomes `Left` also, taking the first `Left` value
 * found:
 *
 * ```javascript
 * > ap(map(add, Left('error')), Right(10))
 * . Left('error')
 * .
 * > ap(map(add, Right(10)), Left('error'))
 * . Left('error')
 * .
 * > ap(map(add, Left('error')), Left('error2'))
 * . Left('error')
 * ```
 */
Right.prototype[fl.ap] = function (either) {
  assertEither(`Either.${fl.ap}`, either)
  return either[fl.chain](f => this[fl.map](f))
}

Left.prototype[fl.ap] = function () {
  return this
}

/**
 * The `Applicative` instance enables lifting of values into `Either` with the
 * `pure` or `of
 */
Either[fl.of] = Right

/**
 * The `Alt` instance allows for a choice to be made between two `Either`
 * values with `alt` function, where the first `Right` encountered
 * is taken.
 *
 * ```javascript
 * > alt(Right(10), Right(13))
 * . Right(10)
 * .
 * > alt(Left('err'), Right(10))
 * . Right(10)
 * .
 * > alt(Left('err'), Left('err2'))
 * . Left('err2')
 * ```
 */
Right.prototype[fl.alt] = function () {
  return this
}

Left.prototype[fl.alt] = function (either) {
  assertEither(`Either.${fl.alt}`, either)
  return either
}

/**
 * The `Bind` instance allows sequencing of `Either` values and functions that
 * return an `Either` by using `chain` function
 *
 * ```javascript
 * > equals(chain(f, Left('error msg')), Left('error msg'))
 * . true
 * .
 * > equals(chain(f, Right([1, 2, 3])), f([1, 2, 3]))
 * . true
 */
Right.prototype[fl.chain] = function (transform) {
  const either = transform(this.value)
  if (!Either.hasInstance(either)) {
    throw TypeError(
      `function passed to Either.${fl.chain} must return an Either`
      + `, it return ${show(either)} instead.`
    )
  }
  return either
}

Left.prototype[fl.chain] = function () {
  return this
}

/**
 * The `tailRecM` instance allows tail recursively chain operation
 */
Either[TailRecMC.tailRecM] = function (fn, i) {
  assertFunction(`Either.${TailRecMC.tailRecM}`, fn)
  let state = Loop(i)
  while (!Done.hasInstance(state)) {
    let result = fn(state.value)
    if (Left.hasInstance(result)) {
      return result
    }
    state = result.value
  }
  return Right(state.value)
}

/**
 * The `Extend` instance allows sequencing of `Either` values and functions
 * that accept an `Either` and return a non-`Either` result using `extend` function
 *
 * ```javascript
 * > equals(extend(f, Left('err')), Left('err'))
 * . true
 * .
 * > equals(extend(f, Right([1, 2, 3])), Right(f([1, 2, 3])))
 */
Right.prototype[fl.extend] = function (fn) {
  assertFunction(`Either.${fl.extend}`, fn)
  return Right(fn(this))
}

Left.prototype[fl.extend] = function () {
  return this
}

Right.prototype[fl.equals] = function (either) {
  assertEither(`Either.${fl.equals}`, either)
  return either.matchWith({
    Left: () => false,
    Right: ({ value }) => this.value === value || equals(this.value, value)
  })
}

Left.prototype[fl.equals] = function (either) {
  assertEither(`Either.${fl.equals}`, either)
  return either.matchWith({
    Left: ({ value }) => this.value === value || equals(this.value, value),
    Right: () => false
  })
}

Right.prototype[OrdC.compare] = function (either) {
  assertEither(`Either.${OrdC.compare}`, either)
  return either.matchWith({
    Left: () => GT.value,
    Right: ({ value }) => compare(this.value, value)
  })
}

Left.prototype[OrdC.compare] = function (either) {
  assertEither(`Either.${OrdC.compare}`, either)
  return either.matchWith({
    Left: ({ value }) => compare(this.value, value),
    Right: () => LT.value
  })
}

Right.prototype.toString = function () {
  return `Right(${show(this.value)})`
}

Left.prototype.toString = function () {
  return `Left(${show(this.value)})`
}

/**
 * Foldable instance
 */
Right.prototype[FoldableC.foldr] = function (f, i) {
  return f(this.value, i)
}

Left.prototype[FoldableC.foldr] = function (_, i) {
  return i
}

Right.prototype[fl.reduce] = function (f, i) {
  return f(i, this.value)
}

Left.prototype[fl.reduce] = function (_, i) {
  return i
}

Right.prototype[FoldableC.foldMap] = function(f) {
  return f(this.value)
}

Left.prototype[FoldableC.foldMap] = function (_, m) {
  return empty(m)
}

Right.prototype[fl.traverse] = function (f) {
  return map(Right, f(this.value))
}

Left.prototype[fl.traverse] = function (_, point) {
  return point(Left(this.value))
}

export { Left, Right, Either }
