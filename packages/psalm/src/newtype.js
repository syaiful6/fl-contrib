import { id } from './data/function'

export function newtype(f = id) {
  function newType(v) {
    if(!(this instanceof newType)) {
      return new newType(v)
    }
    this.__wrapped__ = v
  }
  newType.prototype.__unwrap__  = function () {
    return this.__wrapped__
  }
  return newType
}

export const un = newtype => {
  if (typeof newtype.__wrapped__ !== 'function') {
    throw new TypeError('make sure arguments passed un are instanceof newtype')
  }
  return newtype.__wrapped__()
}
