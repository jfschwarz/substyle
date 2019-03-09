// @flow
function isPlainObject(obj: mixed): boolean {
  return obj === Object(obj) && !(obj instanceof Date) && !Array.isArray(obj)
}

export default isPlainObject
