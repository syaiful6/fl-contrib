import { flip, curryN, id } from './function'
import { empty } from './monoid'
import { Dual } from './monoid/dual'
import { Endo } from './monoid/endo'
import { concat } from './semigroup'
import { un } from '../newtype'
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
