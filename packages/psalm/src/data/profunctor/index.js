import { curryN, id, compose } from './function'
import { assertFunction } from '../util/assert'
import { unsoppertedMethod } from '../util/error'
import { promap as _promap } from '../utls/fantasy'


export const promap = curryN(3, (f, g, profunctor) => {
  assertFunction('arguments 1 passed to promap', f)
  assertFunction('arguments 2 passed to promap', g)
  return typeof profunctor[_promap] === 'function' ? profunctor[_promap](f, g)
  :      typeof profunctor === 'function'          ? compose.all(g, profunctor, f)
  :      /** otherwise */                            unsoppertedMethod(_promap)(profunctor)
})

export const lmap = curryN(2, (f, profunctor) => promap(f, id, profunctor))

export const rmap = promap(id)
