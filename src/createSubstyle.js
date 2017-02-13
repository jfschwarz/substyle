// @flow
import invariant from 'invariant'
import {
  keys, values, merge, assign, compact,
  isFunction, isPlainObject, isString, isArray,
} from 'lodash'
import { filter, compose } from 'lodash/fp'

import defaultPropsDecorator from './defaultPropsDecorator'
import { pickNestedStyles, hoistModifierStylesRecursive } from './pickStyles'
import { isModifier, isElement } from './filterKeys'
import mergeClassNames from './mergeClassNames'

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

      const modifierKeys = filter(isModifier, selectedKeys)
      const elementKeys = filter(isElement, selectedKeys)

      const collectElementStyles = elementKeys.length > 0 ?
        (fromStyle: Object) => values(pickNestedStyles(fromStyle, elementKeys)) :
        (fromStyle: Object) => [fromStyle]

      const collectSelectedStyles = compose(
        collectElementStyles,
        (fromStyle: Object) => hoistModifierStylesRecursive(fromStyle, modifierKeys)
      )

      // use the provided `className` only if there is no sub-element selection
      const baseClassName = (elementKeys.length === 0) ? className : undefined

      // if `classNames` are present, select the mapped class name
      const selectedClassNames = classNames && mergeClassNames(...collectSelectedStyles(classNames))
      const selectedClassName = selectedClassNames && selectedClassNames.className

      // if `classNames` are not present, automatically derive a class name
      const firstClassName = className && className.split(' ')[0]
      const derivedClassName = !classNames && [
        ...modifierKeys.map((key: string) => `${firstClassName}--${key.substring(1)}`),
        ...elementKeys.map((key: string) => `${firstClassName}__${key}`),
      ].join(' ')

      return createSubstyle({

        ...((style || defaultStyle) && {
          style: merge({},
            ...collectSelectedStyles(defaultStyle),
            ...collectSelectedStyles(style)
          ),
        }),

        ...((baseClassName || selectedClassName || derivedClassName) && {
          className: compact([baseClassName, selectedClassName, derivedClassName]).join(' '),
        }),

        ...(classNames && {
          classNames: selectedClassNames.classNames || {},
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
