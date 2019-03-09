// @flow
function assign<T, S>(
  target: T,
  ...sources: $ReadOnlyArray<S>
): {| ...T, ...S |} {
  return Object.assign(target, ...sources)
}

export default assign
