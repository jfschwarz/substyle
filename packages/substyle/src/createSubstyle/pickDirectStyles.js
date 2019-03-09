// @flow
import { type StyleDefinitionT } from '../types'
import { keys } from '../utils'

const pickDirectStyles = (
  style: StyleDefinitionT,
  objectPropertiesWhitelist: Array<string> = []
): StyleDefinitionT => {
  const styleKeys = keys(style)
  const result = {}
  for (let i = 0, l = styleKeys.length; i < l; i += 1) {
    const key = styleKeys[i]
    const isDirect =
      Object.prototype.toString.call(style[key]) !== '[object Object]' || // style defs
      key[0] === ':' || // pseudo selectors
      key[0] === '@' || // @media / @keyframes / @supports / @font-face
      objectPropertiesWhitelist.indexOf(key) >= 0 // whitelisted object-type properties

    if (isDirect) {
      result[key] = style[key]
    }
  }
  return result
}

export default pickDirectStyles
