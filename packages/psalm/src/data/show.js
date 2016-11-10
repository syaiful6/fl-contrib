export const show = v => {
  return typeof v === 'undefined' ? 'undefined'
  :      typeof v === 'symbol'    ? v.toString()
  :      typeof v === 'function'  ? fnToString(v)
  :      typeof v === 'object'    ? objToString(v)
  :                                 JSON.stringify(v)
}

const fnToString = fn => `[Function${fnNameToString(fn)}]`
const fnNameToString = fn => fn.name !== '' ? `: ${fn.name}` : ''

const objToString = obj => {
  return obj === null                          ? 'null'
  :      Array.isArray(obj)                    ? arrayToString(obj)
  :      obj.toString() === ({}).toString()    ? plainObjectToString(obj)
  :      /** otherwise */                        obj.toString()
}

const arrayToString = xs => `[${xs.map(show).join(', ')}]`

const plainObjectToString = obj => `{ ${showKeyValuePair(obj)} }`
const showKeyValuePair = obj =>
  Object.keys(obj)
    .map(k => `${k}: ${show(obj[k])}`)
    .join(', ')
