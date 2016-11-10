/**
 * error reporting
 */

export const unsoppertedMethod = method => object => {
  throw new TypeError(`${object} does not have a method '${method}'.`)
}

export const missingProperty = property => object => {
  throw new TypeError(`${object} does not have a property '${property}'.`)
}
