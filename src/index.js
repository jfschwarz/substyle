import invariant from 'invariant'
import keys from 'lodash/keys'
import values from 'lodash/values'
import pick from 'lodash/pick'
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
        ...values(pick(style, nestedKeys))
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

const pickDirectStyles = pickBy(
  (value, key) => typeof value !== "object" || key[0] === ':'
)
