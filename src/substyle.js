import invariant from 'invariant'
import warning from 'warning'
import keys from 'lodash/keys'
import values from 'lodash/values'
import negate from 'lodash/negate'
import identity from 'lodash/identity'
import flatten from 'lodash/flatten'
import merge from 'lodash/merge'
import filter from 'lodash/fp/filter'
import map from 'lodash/fp/map'
import compose from 'lodash/fp/compose'


export default function substyle({ style, className }, selectedKeys) {

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
    'Second parameter must be a string, an array of strings, an object with boolean values, or a falsy value'
  )

  warning(
    !className || className.split(' ').length === 1 || selectedKeys.length === 0,
    `Deriving class names from a \`className\` prop that already uses multiple class names is discouraged `+
    `(got the following className: '${className}')`
  )

  const baseClassName = className && className.split(' ')[0]
  const toElementClassNames = map(key => baseClassName + '__' + key)
  const toModifierClassNames = map(key => baseClassName + '--' + key.substring(1))

  const modifierKeys = filter(isModifier, selectedKeys)
  const elementKeys = filter(isElement, selectedKeys)

  const hoistElementStyles = (style) => values(pickNestedStyles(style, elementKeys))
  const hoistModifierStyles = (style) => values(pickNestedStyles(style, modifierKeys))
  const hoistAllElementStyles = elementKeys.length > 0 ? compose(flatten, map(hoistElementStyles)) : identity

  return {

    ...( style && { 
      style : merge({},
        ...hoistAllElementStyles([ style, ...hoistModifierStyles(style) ])
      )
    }),

    ...( className && { 
      className : (elementKeys.length === 0 ?
        [ className, ...toModifierClassNames(modifierKeys) ] :
        toElementClassNames(elementKeys)
      ).join(' ')
    })

  }

}

const isModifier = key => key[0] === '&'
const isElement = negate(isModifier)
// const isPseudoClassOrMedia = key => key[0] === ':' || key.substring(0, 6) === '@media'

// TODO: rather use the order of style definitions for overwriting precendence!!
const pickNestedStyles = (style, keys) => {
  let nestedStyles = {};
  keys.forEach(key => {
    const camelCaseKey = camelize(key);
    if(style[camelCaseKey] && typeof style[camelCaseKey] === "object") nestedStyles[camelCaseKey] = style[camelCaseKey];
    if(style[key] && typeof style[key] === "object" ) nestedStyles[key] = style[key]
  })
  return nestedStyles;
}

// const pickDirectStyles = pickBy(
//   (value, key) => typeof value !== "object" || isPseudoClassOrMedia(key) || isModifier(key)
// )

const camelize = key => key.replace(/-(\w)/g, (m, c) => c.toUpperCase())
