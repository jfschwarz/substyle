export const keys = (obj) => {
  return obj === Object(obj) ? Object.keys(obj) : []
}

export const values = (obj) => {
  return obj === Object(obj) ? Object.values(obj) : []
}

export const merge = (target, ...sources) => {
  return Object.assign({}, target, ...sources);
}

export const assign = (target, ...sources) => {
  return Object.assign(target, ...sources);
}

export const identity = (value) => {
  return value
}

export const omit = (obj, keys: string[]) => {
  const { ...other } = { ...obj }
  if (keys) {
    for(const key of keys) {
      delete other[key];
    }
  }
  return other;
}

export const isPlainObject = obj => !(obj instanceof Date) && obj === Object(obj);

export const compact = (arr) => {
  return (arr || []).filter(Boolean)
}
