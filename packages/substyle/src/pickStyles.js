import { keys, merge, omit, values } from './utils'

import { isModifier } from './filterKeys'

const camelize = (key) => key.replace(/-(\w)/g, (m, c) => c.toUpperCase())

export const pickDirectStyles = (style, objectPropertiesWhitelist = []) => {
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

export const pickNestedStyles = (style, keysToPick) => {
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

// breadth-first hoisting of selected modifier style subtrees
// does not traverse into element, :pseudo-selector or @directive subtrees
export const hoistModifierStylesRecursive = (style, modifierKeysToPick) => {
  // hoist styles for selected modifiers on current level
  let result = merge(
    {},
    omit(style, modifierKeysToPick),
    ...values(pickNestedStyles(style, modifierKeysToPick))
  )

  // traverse nested styled for ALL modifiers
  const modifierKeys = keys(result).filter(isModifier)
  for (let i = 0, l = modifierKeys.length; i < l; i += 1) {
    const key = modifierKeys[i]
    const subresult = hoistModifierStylesRecursive(
      result[key],
      modifierKeysToPick
    )
    if (modifierKeysToPick.indexOf(key) >= 0) {
      // selected modifier: hoist subresult
      delete result[key]
      result = merge({}, result, subresult)
    } else {
      // non-selected modifier: replace with subresult
      result[key] = subresult
    }
  }

  return result
}
