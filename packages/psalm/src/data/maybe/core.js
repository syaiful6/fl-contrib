import { data } from '../../adt'
import {
  Loop, Done, TailRecMC, ChainRec
} from '../../control/chainrec'
import { map } from '../functor'
import { empty } from '../monoid'
import { compare, OrdC } from '../ord'
import { LT, GT, EQ } from '../ordering'
import { equals } from '../setoid'
import { show } from '../show'
import { assertFunction, assertAdtMember } from '../../util/assert'
import * as fl from '../../util/fantasy'


/**
 * The `Maybe` type is used to represent optional values and can be seen as
 * something like a type-safe `null`, where `Nothing` is `null` and `Just x`
 * is the non-null value `x`.
 */
const Maybe = data('psalm.Maybe', {
  Nothing: () => ({}),
  Just: (value) => ({ value })
}).derive(ChainRec)

const { Nothing, Just } = Maybe

export const assertMaybe = assertAdtMember(Maybe)

/**
 * The `Functor` instance allows functions to transform the contents of a
 * `Just` with the map function. `Nothing` values are left untouched.
 *
 * ```javascript
 * > map(add(1), Just(10))
 * . Just(11)
 * .
 * > map(add(1), Nothing())
 * . Nothing
 * ```
 */
Just.prototype[fl.map] = function (transform) {
  return Just(transform(this.value))
}

Nothing.prototype[fl.map] = function () {
  return this
}

/**
 * The `Apply` instance allows functions contained within a `Just` to
 * transform a value contained within a `Just` using the `ap` function
 * `Nothing` values are left untouched
 *
 * ```javascript
 * > ap(Just(add(10)), Just(1))
 * . Just(11)
 * > ap(Nothing(), Just(1))
 * . Nothing
 * ```
 */
Just.prototype[fl.ap] = function (maybe) {
  assertMaybe(`Maybe.${fl.ap}`, maybe)
  return maybe[fl.chain](f => this[fl.map](f))
}

Nothing.prototype[fl.ap] = function () {
  return this
}

/**
 * The `Applicative` instance enables lifting of values into `Maybe` with the
 * `pure` function.
 */
Maybe[fl.of] = Just

/**
 * The `Alt` instance allows for a choice to be made between two `Maybe` values
 * with `alt` function, where the first `Just` encountered is taken.
 *
 * ```javascript
 * > alt(Just(10), Just(11))
 * . Just(10)
 * > alt(Nothing(), Just(11))
 * . Just(11)
 * > alt(Nothing(), Nothing())
 * . Nothing
 * ```
 */
Just.prototype[fl.alt] = function () {
  return this
}

Nothing.prototype[fl.alt] = function (maybe) {
  assertMaybe(`Maybe.${fl.alt}`, maybe)
  return maybe.matchWith({
    Nothing: () => Nothing(),
    Just: ({ value }) => Just(value)
  })
}

/**
 * The `Plus` instance provides a default `Maybe` value:
 */
Maybe[fl.zero] = Nothing

/**
 * The `Chain` instance allows sequencing of `Maybe` values and functions that
 * return a `Maybe` by using `chain` function.
 *
 * ```javascript
 * > equals(chain(f, Just(x)), f(x))
 * . true
 * > equals(chain(f, Nothing()), Nothing())
 * . true
 * ```
 */
Just.prototype[fl.chain] = function (transform) {
  const maybe = transform(this.value)
  if (!Maybe.hasInstance(maybe)) {
    throw TypeError(
      `function passed to Maybe.${fl.chain} must return a Maybe`
      + `, it return ${show(maybe)} instead.`
    )
  }
  return maybe
}

Nothing.prototype[fl.chain] = function () {
  return this
}

/**
 * The `tailRecM` instance allows tail recursively chain operation
 */
Maybe[TailRecMC.tailRecM] = function (fn, i) {
  assertFunction(`Maybe.${TailRecMC.tailRecM}`, fn)
  let state = Loop(i)
  while (!Done.hasInstance(state)) {
    let result = fn(state.value)
    if (Nothing.hasInstance(result)) {
      return result
    }
    state = result.value
  }
  return Just(state.value)
}

/**
 * The `Extend` instance allows sequencing of `Maybe` values and functions
 * that accept a `Maybe a` and return a non-`Maybe` result using extend function
 *
 * ```javascript
 * > extend(f, Nothing)
 * . Nothing
 * > equals(extend(f, Just(x)), Just(f(x)))
 * . true
 * ```
 */
Just.prototype[fl.extend] = function (fn) {
  assertFunction(`Maybe.${fl.extend}`, fn)
  return Just(fn(this.value))
}

Nothing.prototype[fl.extend] = function () {
  return this
}

/**
 * The `Setoid` instance allows `Maybe` values to be checked for equality with
 * ```equals``` function, whenever there is an `Setoid` instance for the type the
 * `Maybe` contains.
 */
Nothing.prototype[fl.equals] = function (maybe) {
  return Nothing.hasInstance(maybe)
}

Just.prototype[fl.equals] = function (maybe) {
  return Just.hasInstance(maybe) && equals(maybe.value, this.value)
}

/**
 * The `Ord` instance allows `Maybe` values to be compared with `compare`, `lt`,
 * `gt`, etc. `Nothing` is considered to be less than any `Just` value.
 */
Nothing.prototype[OrdC.compare] = function (maybe) {
  assertMaybe(OrdC.compare, maybe)
  return maybe.matchWith({
    Nothing: () => EQ.value,
    Just: () => LT.value
  })
}

Just.prototype[OrdC.compare] = function (maybe) {
  assertMaybe(OrdC.compare, maybe)
  return maybe.matchWith({
    Nothing: () => GT.value,
    Just: ({ value }) => compare(this.value, value)
  })
}

/**
 * Foldable instance
 */
Just.prototype['fl-contrib/foldr'] = function (f, i) {
  return f(this.value, i)
}

Nothing.prototype['fl-contrib/foldr'] = function (_, i) {
  return i
}

Just.prototype[fl.reduce] = function (f, i) {
  return f(i, this.value)
}

Nothing.prototype[fl.reduce] = function (_, i) {
  return i
}

Just.prototype['fl-contrib/foldMap'] = function(f) {
  return f(this.value)
}

Nothing.prototype['fl-contrib/foldMap'] = function (_, m) {
  return empty(m)
}

Just.prototype[fl.traverse] = function (f) {
  return map(Just, f(this.value))
}

Nothing.prototype[fl.traverse] = function (_, point) {
  return point(Nothing())
}

Just.prototype.toString = function () {
  return `Just(${show(this.value)})`
}

Nothing.prototype.toString = function () {
  return `Nothing`
}

Nothing.value = Nothing()

export { Maybe, Nothing, Just }
