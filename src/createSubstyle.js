// @flow
import invariant from 'invariant'
import {
  keys, values, negate, identity, flatten, merge, assign,
  isFunction, isPlainObject, isString, isArray,
} from 'lodash'
import { filter, map, compose } from 'lodash/fp'

import defaultPropsDecorator from './defaultPropsDecorator'
import { pickDirectStyles, pickNestedStyles, pickNestedStylesRecursive } from './pickStyles'
import type { PropsT, KeysT } from './types'


const isModifier = key => key[0] === '&'
const isElement = negate(isModifier)

function createSubstyle(
  { style, className, classNames }: PropsT,
  propsDecorator: (props: PropsT) => Object = defaultPropsDecorator,
) {
  const styleIsFunction = isFunction(style)

  const substyle = styleIsFunction ? style :
    (selectedKeys: KeysT, defaultStyle?: Object) => {
      if (!selectedKeys) {
        selectedKeys = []
      } else if (isString(selectedKeys)) {
        selectedKeys = [selectedKeys]
      } else if (isPlainObject(selectedKeys)) {
        selectedKeys = keys(selectedKeys).reduce(
          (keys, key) => keys.concat(selectedKeys[key] ? [key] : []),
          []
        )
      }

      invariant(
        isArray(selectedKeys),
        'First parameter must be a string, an array of strings, ' +
        'a plain object with boolean values, or a falsy value.'
      )

      invariant(
        !defaultStyle || isPlainObject(defaultStyle),
        'Optional second parameter must be a plain object.'
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

        ...((style || defaultStyle) && {
          style: merge({},
            ...hoistElementStylesFromEach([ defaultStyle, ...hoistModifierStyles(defaultStyle) ]),
            ...hoistElementStylesFromEach([ style, ...hoistModifierStyles(style) ]),
          )
        }),

        ...(className && {
          className: (elementKeys.length === 0 ?
            [ className, ...toModifierClassNames(modifierKeys) ] :
            toElementClassNames(elementKeys)
          ).join(' ')
        }),

      }, propsDecorator)
    }

  const styleProps = {
    ...(styleIsFunction ? style : { style }),
  }

  const propsForSpread = propsDecorator({
    ...styleProps,
    ...(className && {
      className: [
        styleProps.className,
        className,
      ].join(' ').trim()
    }),
  })

  // assign `style` and/or `className` props to the return function object
  assign(substyle, propsForSpread)
  return substyle
}

export default createSubstyle
