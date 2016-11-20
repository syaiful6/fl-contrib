import { curryN, id } from './function'
import { assertFunction } from '../util/assert'
import { unsoppertedMethod } from '../util/error'
import { bimap as _bimap } from '../utls/fantasy'


export const bimap = curryN(3, (f, g, bifunctor) => {
  assertFunction('arguments 1 passed to bimap', f)
  assertFunction('arguments 2 passed to bimap', g)
  return typeof bifunctor[_bimap] === 'function' ? bifunctor[_bimap](f, g)
  :      /** otherwise */                          unsoppertedMethod(_bimap)(bifunctor)
})

export const lmap = curryN(2, (f, bifunctor) => bimap(f, id, bifunctor))

export const rmap = bimap(id)
