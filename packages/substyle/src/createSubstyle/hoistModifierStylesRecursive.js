// @flow
import { isModifier, keys, merge, omit, values } from '../utils'
import pickNestedStyles from './pickNestedStyles'

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
