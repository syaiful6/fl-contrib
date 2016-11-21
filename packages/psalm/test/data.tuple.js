import { property } from 'jsverify'

import { ap } from '../lib/control/apply'
import { show } from '../lib/data/show'
import { equals } from '../lib/data/setoid'
import { concat } from '../lib/data/semigroup'
import { map } from '../lib/data/functor'
import { tuple, fst, snd } from '../lib/data/tuple'


describe('Tuple', () => {
  describe('Setoid instance', () => {
    property('reflexivity', 'string', 'string', (a, b) => {
      const t = tuple(a, b)
      return equals(t, t) === true
    })

    property('symmetry', 'string', 'string', 'string', 'string', (a, b, c, d) => {
      const t1 = tuple(a, b)
      const t2 = tuple(c, d)
      return equals(t1, t2) === equals(t2, t1)
    })

    property('transitivity', 'string', 'string', (a, b) => {
      const t1 = tuple(a, b)
      const t2 = tuple(a, b)
      const t3 = tuple(a, b)
      return equals(t1, t2)
      &&     equals(t2, t3)
      &&     equals(t1, t3)
    })
  })

  describe('Semigroup instance', () => {
    property('associativity',
             'string', 'string',
             'string', 'string',
             'string', 'string',
             (a, b, c, d, e, f) =>
              equals(
               concat(concat(tuple(a, b), tuple(c, d)), tuple(e, f)),
               concat(tuple(a, b), concat(tuple(c, d), tuple(e, f)))
             ))
  })

  describe('Functor instance', () => {
    property('identity', 'string', 'string',
             (a, b) => equals(map(x => x, tuple(a, b)), tuple(a, b)))

    property('composition', 'string', 'string',
             'string -> string', 'string -> string',
             (a, b, f, g) =>
              equals(
               map(x => f(g(x)), tuple(a, b)),
               map(f, map(g, tuple(a, b)))))
  })

  describe('Apply instance', () => {
    property('composition',
             'string', 'string',
             'string', 'string -> string',
             'string', 'string -> string',
             (a, b, c, f, d, g) =>
                equals(
                  ap(
                    ap(map(f => g => x => f(g(x)), tuple(c, f)), tuple(d, g)),
                    tuple(a, b)
                  ),
                  ap(tuple(c, f), ap(tuple(d, g), tuple(a, b)))))
  })

  describe('Tuple usage', () => {
    property('should work with indexes', 'array string', 'array string', (a, b) => {
      const t = tuple(a, b)
      return equals(a, t[0]) && equals(b, t[1])
    })

    property('snd & fst function', 'array string', 'array string', (a, b) => {
      const t = tuple(a, b)
      return equals(a, fst(t)) && equals(b, snd(t))
    })

    property('toString', 'string', 'string', (a, b) =>
      equals(show(tuple(a, b)), `(${show(a)}, ${show(b)})`)
    )
  })
})
