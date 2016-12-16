// @flow
import invariant from 'invariant'
import { keys, values, negate, identity, flatten, merge, assign } from 'lodash'
import { filter, map, compose } from 'lodash/fp'

import { pickDirectStyles, pickNestedStyles, pickNestedStylesRecursive } from './pickStyles'
import type { PropsT, KeysT } from './types'


const isModifier = key => key[0] === '&'
const isElement = negate(isModifier)

function createSubstyle(closureProps: Object, propsDecorator: (props: PropsT) => Object = identity) {
  function substyle(selectedKeys?: KeysT) {
    const style = closureProps.style
    const className = closureProps.className
    const classNames = closureProps.classNames

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
      'Parameter must be a string, an array of strings, ' +
      'a plain object with boolean values, or a falsy value.'
    )

    const baseClassName = className && className.split(' ')[0]
    const toElementClassNames = map(key => baseClassName + '__' + key)
    const toModifierClassNames = map(key => baseClassName + '--' + key.substring(1))

    const modifierKeys = filter(isModifier, selectedKeys)
    const elementKeys = filter(isElement, selectedKeys)

    const hoistElementStyles = (style) => values(pickNestedStyles(style, elementKeys))
    const hoistModifierStyles = (style) => values(pickNestedStylesRecursive(style, modifierKeys))
    const hoistElementStylesFromEach = elementKeys.length > 0 ?
      compose(flatten, map(hoistElementStyles)) :
      identity

    return createSubstyle({

      ...( style && {
        style : merge({},
          ...hoistElementStylesFromEach([ style, ...hoistModifierStyles(style) ])
        )
      }),

      ...( className && {
        className : (elementKeys.length === 0 ?
          [ className, ...toModifierClassNames(modifierKeys) ] :
          toElementClassNames(elementKeys)
        ).join(' ')
      }),

      classNames,

    })
  }

  const propsForSpread = propsDecorator({
    ...closureProps,
    ...(closureProps.style ? { style: pickDirectStyles(closureProps.style) } : {}),
  })

  // assign `style` and/or `className` props to the return function object
  assign(substyle, propsForSpread)
  return substyle
}

export default createSubstyle
