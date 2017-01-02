// @flow
import invariant from 'invariant'
import {
  keys, values, merge, assign,
  isFunction, isPlainObject, isString, isArray,
} from 'lodash'
import { filter, map } from 'lodash/fp'

import defaultPropsDecorator from './defaultPropsDecorator'
import { pickNestedStyles, hoistModifierStylesRecursive } from './pickStyles'
import { isModifier, isElement } from './filterKeys'
import type { PropsT, KeysT } from './types'


const coerceSelectedKeys = (select?: KeysT) => {
  if (!select) {
    return []
  } else if (isString(select)) {
    return [select]
  } else if (isPlainObject(select)) {
    return keys(select).reduce(
      (acc: Array<string>, key: string) => acc.concat(select[key] ? [key] : []),
      []
    )
  }
  return select
}

function createSubstyle(
  { style, className, classNames }: PropsT,
  propsDecorator: (props: PropsT) => Object = defaultPropsDecorator,
) {
  const styleIsFunction = isFunction(style)

  const substyle = styleIsFunction ? style :
    (select?: KeysT, defaultStyle?: Object) => {
      const selectedKeys = coerceSelectedKeys(select)

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
      const toElementClassNames = map((key: string) => `${baseClassName}__${key}`)
      const toModifierClassNames = map((key: string) => `${baseClassName}--${key.substring(1)}`)

      const modifierKeys = filter(isModifier, selectedKeys)
      const elementKeys = filter(isElement, selectedKeys)

      const collectElementStyles = elementKeys.length > 0 ?
        (fromStyle: Object) => values(pickNestedStyles(fromStyle, elementKeys)) :
        (fromStyle: Object) => [fromStyle]

      return createSubstyle({

        ...((style || defaultStyle) && {
          style: merge({},
            ...collectElementStyles(
              hoistModifierStylesRecursive(defaultStyle, modifierKeys)
            ),
            ...collectElementStyles(
              hoistModifierStylesRecursive(style, modifierKeys)
            )
          ),
        }),

        ...(className && {
          className: (elementKeys.length === 0 ?
            [className, ...toModifierClassNames(modifierKeys)] :
            toElementClassNames(elementKeys)
          ).join(' '),
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
      ].join(' ').trim(),
    }),
  })

  // assign `style` and/or `className` props to the return function object
  assign(substyle, propsForSpread)
  return substyle
}

export default createSubstyle
