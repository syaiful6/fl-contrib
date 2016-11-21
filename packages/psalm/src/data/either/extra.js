import { curryN, constant, id } from '../function'
import { assertEither } from './core'
import { crashWith } from '../../util/error'


/**
 * Takes two functions and an `Either` value, if the value is a `Left` the
 * inner value is applied to the first function, if the value is a `Right`
 * the inner value is applied to the second function.
 *
 * ```javascript
 * > equals(either(f, g, Left(x)), f(x))
 * . true
 * .
 * > equals(either(f, g, Right(y)), g(y))
 * . true
 * ```
 * @sig either :: forall a b c. (a -> c) -> (b -> c) -> Either a b -> c
 */
export const either = curryN(3, (f, g, ei) => {
  assertEither('either', ei)
  return ei.matchWith({
    Left: ({ value }) => f(value),
    Right: ({ value }) => g(value)
  })
})

/**
 * Returns `true` when the `Either` value was constructed with `Left`.
 *
 * @sig isLeft :: forall a b. Either a b -> Boolean
 */
export const isLeft = either(constant(true), constant(false))

/**
 * Returns `true` when the `Either` value was constructed with `Left`.
 *
 * @sig isLeft :: forall a b. Either a b -> Boolean
 */
export const isRight = either(constant(false), constant(true))

/**
 * A partial function that extracts the value from the `Left` data constructor.
 * Passing a `Right` to `unsafeFromLeft` will throw an error.
 *
 * @sig unsafeFromLeft :: forall a b. Partial => Either a b -> a
 */
export const unsafeFromLeft = either(
  id,
  crashWith('the value you feed to unsafeFromLeft function isnt a Left.')
)

/**
 * A partial function that extracts the value from the `Right` data constructor.
 * Passing a `Left` to `unsafeFromRight` will throw an error.
 *
 * @sig unsafeFromRight :: forall a b. Partial => Either a b -> a
 */
export const unsafeFromRight = either(
  crashWith('the value you feed to unsafeFromRight function isnt a Right.'),
  id
)
