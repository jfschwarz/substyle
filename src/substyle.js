import invariant from 'invariant'
import warning from 'warning'
import keys from 'lodash/keys'
import values from 'lodash/values'
import pickBy from 'lodash/fp/pickBy'
import merge from 'lodash/merge'
import all from 'lodash/fp/all'
import some from 'lodash/fp/some'


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
  
  let someAreModifiers = some(isModifier, selectedKeys)
  let allAreModifiers = all(isModifier, selectedKeys)

  warning(
    allAreModifiers || !someAreModifiers,
    `Mixing element and modifier keys in the same substyle call is discouraged `+
    `(got the following keys: [` + selectedKeys.map(k => `'${k}'`).join(', ') + `])`
  )

  warning(
    !className || className.split(' ').length === 1 || selectedKeys.length === 0,
    `Deriving class names from a \`className\` prop that already uses multiple class names is discouraged `+
    `(got the following className: '${className}')`
  )

  const useDirectStyles = selectedKeys.length === 0 || someAreModifiers

  return {

    ...( style && { 
      style : merge({},
        useDirectStyles && pickDirectStyles(style),
        ...values(pickNestedStyles(style, selectedKeys))
      )
    }),

    ...( className && { 
      className : [
        ...(useDirectStyles && [className]),
        ...selectedKeys.map(key => className + classNameSuffix(key))
      ].join(' ')
    })

  }

}

const isModifier = key => key[0] === '&'
const isPseudoClass = key => key[0] === ':'

const pickNestedStyles = (style, selectedKeys) => {
  let nestedStyles = {};
  selectedKeys.forEach(key => {
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
const classNameSuffix = key => isModifier(key) ? '--' + key.substring(1) : '__' + key

