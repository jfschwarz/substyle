import invariant from 'invariant'
import { keys, values, negate, identity, flatten, merge, assign, omit } from 'lodash'
import { filter, map, compose } from 'lodash/fp'


function createSubstyle(closureProps) {
  function substyle(props, selectedKeys) {
    const style = (closureProps.style || props.style) && merge({}, closureProps.style, props.style)
    const className = props.className || closureProps.className

    if(Object.prototype.toString.call(selectedKeys) === '[object Function]') {
      selectedKeys = selectedKeys(props)
    }

    if(!selectedKeys) {
      selectedKeys = []
    } else if(typeof selectedKeys === 'string') {
      selectedKeys = [selectedKeys]
    } else if(Object.prototype.toString.call(selectedKeys) === '[object Object]') {
      selectedKeys = keys(selectedKeys).reduce(
        (keys, key) => keys.concat(selectedKeys[key] ? [key] : []),
        []
      )
    }

    invariant(
      Array.isArray(selectedKeys),
      'Second parameter must be a string, an array of strings, a plain object with boolean ' +
      'values, a falsy value, or a function with a return value of one of these four types.'
    )

    const baseClassName = className && className.split(' ')[0]
    const toElementClassNames = map(key => baseClassName + '__' + key)
    const toModifierClassNames = map(key => baseClassName + '--' + key.substring(1))

    const modifierKeys = filter(isModifier, selectedKeys)
    const elementKeys = filter(isElement, selectedKeys)

    const collectElementStyles = elementKeys.length > 0 ?
      (style) => values(pickNestedStyles(style, elementKeys)) :
      (style) => [ style ]

    return createSubstyle({

      ...( style && {
        style : merge({},
          ...collectElementStyles(
            hoistModifierStylesRecursive(style, modifierKeys)
          )
        )
      }),

      ...( className && {
        className : (elementKeys.length === 0 ?
          [ className, ...toModifierClassNames(modifierKeys) ] :
          toElementClassNames(elementKeys)
        ).join(' ')
      })

    })
  }

  // assign `style` and/or `className` props to the return function object
  assign(substyle, closureProps)
  return substyle
}

export default createSubstyle({})

const isModifier = key => key[0] === '&'
const isElement = negate(isModifier)

const pickNestedStyles = (style, keysToPick) => {
  const camelizedKeysToPick = map(camelize, keysToPick)
  const styleKeys = keys(style)
  const result = {}
  for(let i=0, l=styleKeys.length; i<l; ++i) {
    const key = styleKeys[i]
    if(keysToPick.indexOf(key) >= 0 || camelizedKeysToPick.indexOf(camelize(key)) >= 0) {
      result[key] = style[key]
    }
  }
  return result
}

// breadth-first hoisting of selected modifier style subtrees
// does not traverse into element, :pseudo-selector or @directive subtrees
const hoistModifierStylesRecursive = (style, modifierKeysToPick) => {
  // hoist styles for selected modifiers on current level
  const result = merge(
    omit(style, modifierKeysToPick),
    ...values(pickNestedStyles(style, modifierKeysToPick))
  )

  // traverse nested styled for ALL modifiers
  const modifierKeys = filter(isModifier, keys(result))
  for(let i=0, l=modifierKeys.length; i<l; ++i) {
    const key = modifierKeys[i]
    const subresult = hoistModifierStylesRecursive(result[key], modifierKeysToPick)
    if(modifierKeysToPick.indexOf(key) >= 0) {
      // selected modifier: hoist subresult
      delete result[key]
      merge(result, subresult)
    } else {
      // non-selected modifier: replace with subresult
      result[key] = subresult
    }
  }
  return result
}

const camelize = key => key.replace(/-(\w)/g, (m, c) => c.toUpperCase())
