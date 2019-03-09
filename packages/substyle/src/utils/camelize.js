// @flow
const camelize = (key: string): string =>
  key.replace(/-(\w)/g, (m, c) => c.toUpperCase())

export default camelize
