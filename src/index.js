import invariant from 'invariant'
import keys from 'lodash/keys'
import values from 'lodash/values'
import pickBy from 'lodash/fp/pickBy'
import merge from 'lodash/merge'


export default function substyle({ style, className }, nestedKeys) {

  if(!nestedKeys) {
    nestedKeys = []
  } else if(typeof nestedKeys === 'string') {
    nestedKeys = [nestedKeys]
  } else if(Object.prototype.toString.call(nestedKeys) === '[object Object]') {
    nestedKeys = keys(nestedKeys).reduce(
      (keys, key) => keys.concat(nestedKeys[key] ? [key] : []),
      []
    )
  }

  invariant(
    Array.isArray(nestedKeys), 
    'Second parameter must be a string, an array of strings, an object with boolean values, or a falsy value'
  )

  return {

    ...( style ? { 
      style : nestedKeys.length > 0 ? merge({},
        ...values(pickNestedStyles(style, nestedKeys))
      ) : pickDirectStyles(style)
    } : {} ),

    ...( className ? { 
      className : nestedKeys.length > 0 ? nestedKeys.map(
        key => className + (key[0] === '&' ? 
                  '--' + key.substring(1) : 
                  '__' + key)
      ).join(' ') : className
    } : {} )

  }

}

const pickNestedStyles = (style, nestedKeys) => {
  let nestedStyles = {};
  nestedKeys.forEach(key => {
    const camelCaseKey = camelize(key);
    if(style[camelCaseKey] && typeof style[camelCaseKey] === "object") nestedStyles[camelCaseKey] = style[camelCaseKey];
    if(style[key] && typeof style[key] === "object" ) nestedStyles[key] = style[key]
  })
  return nestedStyles;
}

const pickDirectStyles = pickBy(
  (value, key) => typeof value !== "object" || key[0] === ':'
)

const camelize = str => str.replace(/-(\w)/g, (m, c) => c.toUpperCase())

