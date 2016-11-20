import { unsoppertedMethod } from '../util/error'
import * as fl from '../util/fantasy'


export const extract = comonad =>
  typeof comonad[fl.extract] === 'function' ? comonad[fl.extract]()
  :      /** otherwise */                     unsoppertedMethod(fl.extract)(comonad)
