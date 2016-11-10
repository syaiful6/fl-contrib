/**
 * Curry a given function with a specified arity.
 */
export function curryN(arity, fn) {
  const curried = oldArgs => (...newArgS) => {
    const combine = oldArgs.concat(newArgS)
    const len = combine.length
    return len < arity      ? curried(combine)
    :      /* otherwise */    fn(...combine)
  }
  return curried([])
}

/**
 * Curry a given function with function's length
 */
export const curry = fn => curryN(fn.length, fn)

/**
 * I combinator, this function only give back argument passed to it. This function
 * helpful as default callback.
 *
 * @sig id :: a -> a
 */
export const id = x => x

/**
 * K combinator, take an argument and return function that when called will return
 * that argument.
 *
 * @sig constant :: forall a b. a -> b -> a
 */
export const constant = x => () => x

/**
 * Flips the order of the arguments to a function of two arguments.
 *
 * @sig flip :: forall a b c. (a -> b -> c) -> b -> a -> c
 */
export const flip = curryN(3, (f, a, b) => f(b, a))

/**
 * Applies a function to an argument.
 *
 * @sig apply :: forall a b. (a -> b) -> a -> b
 */
export const apply = curryN(2, (f, a) => f(a))

/**
 * an infix for apply
 *
 * @sig thrust :: forall a b. a -> (a -> b) -> b
 */
export const thrush = flip(apply)

/**
 * The `on` function is used to change the domain of a binary operator.
 *
 * @sig on :: forall a b c. (b -> b -> c) -> (a -> b) -> a -> a -> c
 */
export const on = curryN(4, (f, g, x, y) => f(g(x), g(y)))

/**
 * Performs right-to-left function composition.
 *
 * @sig compose :: ((b -> c), (a -> b)) -> a -> c
 */
export const compose = (f, g) => x => f(g(x))

/**
 * Conveniently composes multiple (more than 2) functions
 *
 * @sig compose.all :: Functions... -> Function
 */
compose.all = (...fns) => fns.reduce(compose, id)
