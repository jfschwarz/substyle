export const keys = (obj) => {
  return obj === Object(obj) ? Object.keys(obj) : []
}

export const values = (obj) => {
  return obj === Object(obj) ? Object.values(obj) : []
}

function mergeDeep(target, source) {
  let output = assign({}, target);
  if (isPlainObject(target) && isPlainObject(source)) {
    keys(source).forEach(key => {
      if (isPlainObject(source[key])) {
        if (!(key in target))
          assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

export const merge = (target, ...sources) => {
  return sources.reduce((t, s) => {
    return mergeDeep(t, s);
  }, target);
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

export const isPlainObject = obj => !(obj instanceof Date) && obj === Object(obj) && !Array.isArray(obj);

export const compact = (arr) => {
  return (arr || []).filter(Boolean)
}
