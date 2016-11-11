export function define(target, key, value) {
  Object.defineProperty(target, key, {
    value: value,
    enumerable: false,
    writable: true,
    configurable: true
  })
}
