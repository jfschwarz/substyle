import invariant from 'invariant'
import warning from 'warning'
import keys from 'lodash/keys'
import values from 'lodash/values'
import pickBy from 'lodash/fp/pickBy'
import negate from 'lodash/negate'
import flatten from 'lodash/flatten'
import merge from 'lodash/merge'


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

  const modifierKeys = selectedKeys.filter(isModifier)
  const elementKeys = selectedKeys.filter(isElement)

  const getElementStyles = (style) => values(pickNestedStyles(style, elementKeys))
  const getModifierStyles = (style) => values(pickNestedStyles(style, modifierKeys))

  return {

    ...( style && { 
      style : merge({},
        ...flatten([ style, ...getModifierStyles(style) ].map(
          elementKeys.length > 0 ? getElementStyles : pickDirectStyles
        ))
      )
    }),

    ...( className && { 
      className : (elementKeys.length === 0 ?
        [ className, ...modifierKeys.map(key => className + '--' + key.substring(1)) ] :
        elementKeys.map(key => className + '__' + key)
      ).join(' ')
    })

  }

}

const isModifier = key => key[0] === '&'
const isElement = negate(isModifier)
const isPseudoClass = key => key[0] === ':'

const pickNestedStyles = (style, keys) => {
  let nestedStyles = {};
  keys.forEach(key => {
    const camelCaseKey = camelize(key);
    if(style[camelCaseKey] && typeof style[camelCaseKey] === "object") nestedStyles[camelCaseKey] = style[camelCaseKey];
    if(style[key] && typeof style[key] === "object" ) nestedStyles[key] = style[key]
  })
  return nestedStyles;
}

const pickDirectStyles = pickBy(
  (value, key) => typeof value !== "object" || isPseudoClass(key)
)

const camelize = key => key.replace(/-(\w)/g, (m, c) => c.toUpperCase())
