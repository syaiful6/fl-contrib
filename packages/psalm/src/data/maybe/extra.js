import { id, constant, curryN } from '../function'
import { Nothing, Just, assertMaybe } from './core'
import { crashWith } from '../../util/error'


/**
 * Takes a default value, a function, and a `Maybe` value. If the `Maybe`
 * value is `Nothing` the default value is returned, otherwise the function
 * is applied to the value inside the `Just` and the result is returned.
 *
 * @sig maybe :: forall a b. b -> (a -> b) -> Maybe a -> b
 */
export const maybe = curryN(3, (a, fn, m) => {
  assertMaybe(`maybe`, m)
  return m.matchWith({
    Nothing: () => a,
    Just: ({ value }) => fn(value)
  })
})

/**
 * Similar to `maybe` but for use in cases where the default value may be
 * expensive to compute.
 *
 * @sig maybe_ :: forall a b. (() => b) -> (a -> b) -> Maybe a -> b
 */
export const maybe_ = curryN(3, (f1, f2, m) => {
  assertMaybe(`maybe_`, m)
  return m.matchWith({
    Nothing: () => f1(),
    Just: ({ value }) => f2(value)
  })
})

/**
 * Takes a default value, and a `Maybe` value. If the `Maybe` value is
 * `Nothing` the default value is returned, otherwise the value inside the
 * `Just` is returned.
 *
 * @sig fromMaybe :: a -> Maybe a -> a
 */
export const fromMaybe = curryN(2, (a, m) => maybe(a, id, m))

/**
 * Similar to `fromMaybe`, but for use in cases where the default value may be
 * expensive to compute.
 *
 * @sig fromMaybe_ :: (() => a) -> Maybe a -> a
 */
export const fromMaybe_ = curryN(2, (a, m) => maybe_(a, id, m))

/**
 * Returns `true` when the `Maybe` value was constructed with `Just`
 *
 * @sig isJust :: forall a. Maybe a -> Boolean
 */
export const isJust = maybe(false, constant(true))

/**
 * Returns `true` when the `Maybe` value is `Nothing`.
 *
 * @sig isNothing :: forall a. Maybe a -> Boolean
 */
export const isNothing = maybe(true, constant(false))

/**
 * A partial function that extracts the value from the `Just` data
 * constructor. Passing `Nothing` to `fromJust` will throw an error
 */
export const unsafeFromJust = maybe_(
  crashWith('the value you feed to unsafeFromJust function isnt a Just value.'),
  id
)

/**
 * take a value that maybe null then encode it to Maybe
 *
 * @summary fromNullable :: a -> Maybe a
 */
export const fromNullable = x => x === null ? Nothing.value : Just(x)

/**
 * take a value that maybe undefined then encode it to Maybe
 *
 * @summary fromUndefined :: a -> Maybe a
 */
export const fromUndefined = x => typeof x === 'undefined' ? Nothing.value : Just(x)
