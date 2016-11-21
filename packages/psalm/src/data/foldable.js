import { alt } from '../control/alt'
import { apSecond } from '../control/apply'
import { zero } from '../control/plus'
import { compose, curryN, flip, id } from './function'
import { Nothing, Just } from './maybe'
import { empty } from './monoid'
import { Conj } from './monoid/conj'
import { Disj } from './monoid/disj'
import { Dual } from './monoid/dual'
import { Endo } from './monoid/endo'
import { compare } from './ord'
import { LT, GT } from './ordering'
import { equals } from './setoid'
import { concat } from './semigroup'
import { unit } from './unit'
import { un } from '../newtype'
import { assertFunction } from '../util/assert'
import { unsoppertedMethod } from '../util/error'


export const FoldableC = {
  foldMap: 'fl-contrib/foldMap',
  foldr: 'fl-contrib/foldr',
  foldl: 'fantasy-land/reduce'
};

/**
 * Take a type representative for the monoid that f return, f is a function that return
 * a monoid.
 *
 * @sig foldMap :: forall f a m. (Foldable f, Monoid m) => m -> (a -> m) -> f a -> m
 */
export const foldMap = curryN(3, (m, f, fa) => {
  assertFunction('foldMap', f)
  return typeof fa[FoldableC.foldMap] === 'function' ? fa[FoldableC.foldMap](f, m)
  :      Array.isArray(fa)                           ? foldMapDefault(m, f, fa)
  :      /** otherwise */                              unsoppertedMethod(FoldableC.foldMap)(fa)
})

/**
 * Left-associative fold of a structure.
 *
 * @sig foldl :: forall a b f. Foldable f => ((b, a) -> b) -> b -> f a -> b
 */
export const foldl = curryN(3, (f, init, fa) => {
  assertFunction('foldl', f)
  return typeof fa[FoldableC.foldl] === 'function' ? fa[FoldableC.foldl](f, init)
  :      Array.isArray(fa)                         ? foldlArray(f, init, fa)
  :      /** otherwise */                            unsoppertedMethod(FoldableC.foldl)(fa)
})

/**
 * Right-associative fold of a structure.
 *
 * @sig foldr :: forall a b f. Foldable f => ((a, b) -> b) -> b -> f a -> b
 */
export const foldr = curryN(3, (f, init, fa) => {
  assertFunction('foldr', f)
  return typeof fa[FoldableC.foldr] === 'function' ? fa[FoldableC.foldr](f, init)
  :      Array.isArray(fa)                         ? foldrArray(f, init, fa)
  :      /** otherwise */                            unsoppertedMethod(FoldableC.foldr)(fa)
})

/**
 * Fold a data structure, accumulating values in some `Monoid`.
 *
 * @sig fold :: f m. (Foldable f, Monoid m) => m -> f m -> m
 */
export const fold = curryN(2, (m, foldable) => foldMap(m, id, foldable))

/**
 * Traverse a data structure, performing some effects encoded by an `Applicative`
 * functor at each value, ignoring the final result.
 *
 * @sig traverse_ :: (Applicative m, Foldable f) => (c -> m c) -> (a -> m b) -> f a -> m Unit
 */
export const traverse_ = curryN(3, (point, f, fa) =>
  foldr((a, b) => apSecond(f(a), b), point(unit), fa)
)

/**
 * Perform all of the effects in some data structure in the order
 * given by the `Foldable` instance, ignoring the final result.
 *
 * @sig sequence_ :: forall a f m. (Applicative m, Foldable f) => f (m a) -> m Unit
 */
export const sequence_ = curryN(2, (point, fa) => traverse_(point, id, fa))

/**
 * Combines a collection of elements using the `Alt` operation.
 *
 * @sig oneOf :: forall f g a. (Foldable f, Plus g) => g -> f (g a) -> g a
 */
export const oneOf = curryN(3, (P, fa) => foldr(alt, zero(P), fa))

/**
 * @sig all :: forall f a. Foldable f => (a -> Boolean) -> f a -> Boolean
 */
export const all = curryN(2, (f, fa) => un(foldMap(Conj, compose(Conj, f), fa)))

/**
 * @sig any :: forall f a. Foldable f => (a -> Boolean) -> f a -> Boolean
 */
export const any = curryN(2, (f, fa) => un(foldMap(Disj, compose(Disj, f), fa)))

/**
 * @sig and :: forall f. Foldable f => f Boolean -> Boolean
 */
export const and = all(id)

/**
 * @sig or :: forall f. Foldable f => f Boolean -> Boolean
 */
export const or = any(id)

/**
 * Test whether a value is an element of a data structure.
 *
 * @sig forall a f. (Foldable f, Setoid a) => a -> f a -> Boolean
 */
export const elem = curryN(2, (a, fa) => any(equals(a), fa))

/**
 * Find the largest element of a structure, according to a given comparison
 * function. The comparison function should represent a total ordering (see
 * the `Ord` type class laws); if it does not, the behaviour is undefined.
 *
 * @sig maximumBy :: forall a f. Foldable f => (a -> a -> Ordering) -> f a -> Maybe a
 */
export const maximumBy = curryN(2, (cmp, fa) => {
  function max_(a, b) {
    return a.matchWith({
      Nothing: () => Just(b),
      Just: ({ value }) => Just(equals(cmp(value, b), GT.value) ? value : b)
    })
  }
  return foldl(max_, Nothing.value, fa)
})

/**
 * Find the largest element of a structure, according to its `Ord` instance.
 *
 * @sig maximum :: forall a f. (Ord a, Foldable f) => f a -> Maybe a
 */
export const maximum = maximumBy(compare)

/**
 * Find the smallest element of a structure, according to a given comparison
 * function. The comparison function should represent a total ordering (see
 * the `Ord` type class laws); if it does not, the behaviour is undefined.
 *
 * @sig minimumBy :: forall a f. Foldable f => (a -> a -> Ordering) -> f a -> Maybe a
 */
export const minimumBy = curryN(2, (cmp, fa) => {
  function min_(a, b) {
    return a.matchWith({
      Nothing: () => Just(b),
      Just: ({ value }) => Just(equals(cmp(value, b), LT.value) ? value : b)
    })
  }
  return foldl(min_, Nothing.value, fa)
})

/**
 * Find the smallest element of a structure, according to its `Ord` instance.
 *
 * @sig minimum :: forall a f. (Ord a, Foldable f) => f a -> Maybe a
 */
export const minimum = minimumBy(compare)

/**
 * A default implementation of `foldMap` using `foldr`.
 *
 * @sig foldMapDefault :: forall f a m. (Foldable f, Monoid m) => m -> (a -> m) -> f a -> m
 */
export const foldMapDefault = curryN(3, (m, f, xs) => {
  return foldr((x, acc) => concat(f(x), acc), empty(m), xs)
})

/**
 * A default implementation of `foldl` using `foldMap`.
 *
 * @sig foldlDefault :: forall f a b. Foldable f => ((b, a) -> b) -> b -> f a -> b
 */
export const foldlDefault = curryN(3, (f, init, xs) => {
  const DualEndo = Dual(Endo)
  return un(un(foldMap(DualEndo, x => DualEndo(Endo(flip(f, x))), xs)))(init)
})

/**
 * A default implementation of `foldr` using `foldMap`.
 *
 * @sig foldrDefault :: forall f a b. Foldable f => ((a, b) -> b) -> b -> f a -> b
 */
export const foldrDefault = curryN(3, (f, init, xs) => {
  return un(foldMap(Endo, x => Endo(y => f(x, y)), xs))(init)
})

/**
 * Define foldable by just define foldMap or foldr
 */
export const Foldable = adt => {
  adt.prototype[FoldableC.foldMap] = function (m, f) {
    return foldMapDefault(m, f, this)
  }
  adt.prototype[FoldableC.foldl] = function (f, initial) {
    return foldlDefault(f, initial, this)
  }
  adt.prototype[FoldableC.foldr] = function (f, initial) {
    return foldrDefault(f, initial, this)
  }
  return adt
}

function foldlArray(f, init, xs) {
  let acc = init
  let len = xs.length
  for (let i = 0; i < len; i++) {
    acc = f(acc, xs[i])
  }
  return acc
}

function foldrArray(f, init, xs) {
  let acc = init
  let len = xs.length
  for (let i = len - 1; i >= 0; i--) {
    acc = f(xs[i], acc);
  }
  return acc
}
