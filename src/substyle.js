import invariant from 'invariant'
import keys from 'lodash/keys'
import values from 'lodash/values'
import negate from 'lodash/negate'
import identity from 'lodash/identity'
import flatten from 'lodash/flatten'
import merge from 'lodash/merge'
import filter from 'lodash/fp/filter'
import map from 'lodash/fp/map'
import mapValues from 'lodash/mapValues'
import compose from 'lodash/fp/compose'
import isPlainObject from 'lodash/isPlainObject'


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
    'Second parameter must be a string, an array of strings, a plain object with boolean values, or a falsy value'
  )

  const baseClassName = className && className.split(' ')[0]
  const toElementClassNames = map(key => baseClassName + '__' + key)
  const toModifierClassNames = map(key => baseClassName + '--' + key.substring(1))

  const modifierKeys = filter(isModifier, selectedKeys)
  const elementKeys = filter(isElement, selectedKeys)

  const hoistElementStyles = (style) => values(pickNestedStyles(style, elementKeys))
  const hoistModifierStyles = (style) => values(pickNestedStyles(style, modifierKeys))
  const hoistElementStylesFromEach = elementKeys.length > 0 ? compose(flatten, map(hoistElementStyles)) : identity

  return {

    ...( style && { 
      style : attachToStringToObjects(merge({},
        ...hoistElementStylesFromEach([ style, ...hoistModifierStyles(style) ])
      ))
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
const isPseudoOrMedia = key => key[0] === ':' || key[0] === '@'
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

const camelize = key => key.replace(/-(\w)/g, (m, c) => c.toUpperCase())

const attachToStringToObjects = ({ toString, ...styles }) => mapValues(styles, (value, key, ...args) => {
  if(!isPseudoOrMedia(key) && Object.prototype.toString.call(value) === '[object Object]') {
    value = {...value}
    value.toString = () => undefined
  }
  return value
})
