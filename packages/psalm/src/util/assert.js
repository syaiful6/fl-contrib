export function assertFunction (test, msg) {
  if (typeof test !== 'function') {
    throw new TypeError(msg)
  }
}

export const assertAdtMember = adt => (value, msg) => {
  if (!adt.hasInstance(value)) {
    throw new TypeError(msg)
  }
}
