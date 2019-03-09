// @flow
function keys<+T: Object>(obj: T): Array<$Keys<T>> {
  return obj === Object(obj) ? Object.keys(obj) : []
}

export default keys
