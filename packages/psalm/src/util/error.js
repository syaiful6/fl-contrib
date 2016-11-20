import { show } from '../data/show'


/**
 * error reporting
 */

export const unsoppertedMethod = method => object => {
  throw new TypeError(`${show(object)} does not have a method '${method}'.`)
}

export const missingProperty = property => object => {
  throw new TypeError(`${show(object)} does not have a property '${property}'.`)
}

/**
 * Throw an error if the functions called.
 */
export function crashWith(msg) {
  return () => {
    throw new Error(msg)
  }
}
