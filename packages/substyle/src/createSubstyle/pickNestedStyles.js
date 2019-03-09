// @flow
import { type StyleDefinitionT } from '../types'
import { camelize, keys } from '../utils'

const pickNestedStyles = (
  style: StyleDefinitionT,
  keysToPick: Array<string>
): StyleDefinitionT => {
  const camelizedKeysToPick = keysToPick.map(camelize)
  const styleKeys = keys(style)
  const result = {}
  for (let i = 0, l = styleKeys.length; i < l; i += 1) {
    const key = styleKeys[i]
    if (
      keysToPick.indexOf(key) >= 0 ||
      camelizedKeysToPick.indexOf(camelize(key)) >= 0
    ) {
      result[key] = style[key]
    }
  }
  return result
}

export default pickNestedStyles
