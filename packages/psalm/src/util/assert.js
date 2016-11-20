import { show } from '../data/show'


export function assertFunction (method, fn) {
  if (typeof fn !== 'function') {
    throw new TypeError(
      `${method} expects a function, but was given ${show(fn)}.`
    )
  }
}

export const assertAdtMember = adt => (method, value) => {
  if (!adt.hasInstance(value)) {
    throw new TypeError(
      `${method} expects a type ${show(adt)}, but was given ${show(value)}.`
    )
  }
}
