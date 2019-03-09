// @flow
function values<+T: Object>(obj: T): Array<$Values<T>> {
  return obj === Object(obj) ? Object.values(obj) : []
}

export default values
