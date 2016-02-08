import invariant from 'invariant'
import warning from 'warning'
import keys from 'lodash/keys'
import values from 'lodash/values'
import pick from 'lodash/pick'
import merge from 'lodash/merge'


export default function substyle({ style, className }, nestedKeys, defaultStyle) {

  if(typeof nestedKeys === 'string') {
    nestedKeys = [nestedKeys]
  } else if(Object.prototype.toString.call(nestedKeys) === '[object Object]') {
    nestedKeys = keys(nestedKeys).reduce(
      (keys, key) => keys.concat(nestedKeys[key] ? [key] : []),
      []
    )
  }

  invariant(Array.isArray(nestedKeys), 'Second parameter must be a string, an array of strings, or an object with boolean values')
  warning(nestedKeys.length > 0, 'substyle selection is empty, no `style` and `className` props will be provided to the element')

  return {

    ...( defaultStyle || style ? { 
      style : merge({},
        ...values(pick(defaultStyle, nestedKeys)),
        ...values(pick(style, nestedKeys))
      )
    } : {} ),

    ...( className ? { 
      className : nestedKeys.map(
        key => className + (key[0] === '&' ? 
                  '--' + key.substring(1) : 
                  '__' + key)
      ).join(' ')
    } : {} )

  }

}