// @flow
function omit<T, Keys: Array<string>>(
  obj: T,
  keys: Keys
): $Diff<T, { [key: Keys]: any }> {
  const { ...other } = { ...obj }
  if (keys) {
    for (const key of keys) {
      delete other[key]
    }
  }
  return other
}

export default omit
