// @flow
function compact<T>(arr: ?Array<T>): Array<T> {
  return (arr || []).filter(Boolean)
}

export default compact
