// @flow
import assign from './assign'
import isPlainObject from './isPlainObject'
import keys from './keys'

function merge<+T: Object, +S: Object>(
  target: T,
  ...sources: $ReadOnlyArray<S>
): { ...T, ...S } {
  return sources.reduce((t, s) => {
    return mergeDeep(t, s)
  }, target)
}

function mergeDeep<+T: Object, +S: Object>(
  target: T,
  source: S
): { ...T, ...S } {
  let output = assign({}, target)
  if (isPlainObject(target) && isPlainObject(source)) {
    keys(source).forEach(key => {
      if (isPlainObject(source[key])) {
        if (!(key in target)) assign(output, { [key]: source[key] })
        else output[key] = mergeDeep(target[key], source[key])
      } else {
        assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

export default merge
