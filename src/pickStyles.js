import { keys } from 'lodash'

const camelize = (key) => key.replace(/-(\w)/g, (m, c) => c.toUpperCase())

export const pickDirectStyles = (style) => {
  const styleKeys = keys(style)
  const result = {}
  for (let i = 0, l = styleKeys.length; i < l; i += 1) {
    const key = styleKeys[i]
    const isDirect = (
      Object.prototype.toString.call(style[key]) !== '[object Object]' ||  // style defs
      key[0] === ':' ||  // pseudo selectors
      key[0] === '@'  // @media / @keyframes / @supports / @font-face
    )
    if (isDirect) {
      result[key] = style[key]
    }
  }
  return result
}

export const pickNestedStyles = (style, keysToPick) => {
  const camelizedKeysToPick = keysToPick.map(camelize)
  const styleKeys = keys(style)
  const result = {}
  for (let i = 0, l = styleKeys.length; i < l; i += 1) {
    const key = styleKeys[i]
    if (keysToPick.indexOf(key) >= 0 || camelizedKeysToPick.indexOf(camelize(key)) >= 0) {
      result[key] = style[key]
    }
  }
  return result
}

export const pickNestedStylesRecursive = (style, keysToPick) => {
  const result = pickNestedStyles(style, keysToPick)
  const resultKeys = keys(result)
  let finalResult = result
  for (let i = 0, l = resultKeys.length; i < l; i += 1) {
    finalResult = {
      ...finalResult,
      ...pickNestedStylesRecursive(result[resultKeys[i]], keysToPick),
    }
  }
  return finalResult
}
