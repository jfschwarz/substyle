export const keys = (obj) => {
  return obj === Object(obj) ? Object.keys(obj) : []
}

export const values = (obj) => {
  return obj === Object(obj) ? Object.values(obj) : []
}

function mergeDeep(target, source) {
  let output = Object.assign({}, target)
  if (isPlainObject(target) && isPlainObject(source)) {
    keys(source).forEach((key) => {
      if (isPlainObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        else output[key] = mergeDeep(target[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

export const merge = (target, ...sources) => {
  return sources.reduce((t, s) => {
    return mergeDeep(t, s)
  }, target)
}

export const identity = (value) => {
  return value
}

export const omit = (obj, keys: string[]) => {
  const other = Object.assign({}, obj)
  if (keys) {
    for (let i = 0; i < keys.length; i++) {
      delete other[keys[i]]
    }
  }
  return other
}

export const isPlainObject = (obj) =>
  obj === Object(obj) && !(obj instanceof Date) && !Array.isArray(obj)

export const compact = (arr) => {
  return (arr || []).filter(Boolean)
}
