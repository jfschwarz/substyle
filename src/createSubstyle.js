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

const deriveClassNames = (
  className: ?string,
  elementKeys: Array<string>,
  modifierKeys: Array<string>
): ?Array<string> => {
  // do not derive class names, if the user did not specify any class name
  if (!className) {
    return undefined
  }

  // derive class names based using the passed modifier/element keys
  const firstClassName = className.split(' ')[0]
  const derivedClassNames = [
    ...(
      (elementKeys.length === 0) ?
        modifierKeys.map((key: string) => `${firstClassName}--${key.substring(1)}`) : []
    ),
    ...elementKeys.map((key: string) => `${firstClassName}__${key}`),
  ]

  // also use the provided `className` if there is no sub-element selection
  return (elementKeys.length === 0) ?
    [ className, ...derivedClassNames ] :
    derivedClassNames
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

      const derivedClassNames = deriveClassNames(className, elementKeys, modifierKeys)

      return createSubstyle({

        ...((style || defaultStyle) && {
          style: merge({},
            ...collectSelectedStyles(defaultStyle),
            ...collectSelectedStyles(style)
          ),
        }),

        ...(derivedClassNames && {
          className: derivedClassNames.join(' '),
        }),

        ...(classNames && {
          classNames: classNames,
        }),

      }, propsDecorator)
    }

  const styleProps = {
    ...(styleIsFunction ? style : { style }),
  }
  const classNameSplitted = [
    ...(styleProps.className ? styleProps.className.split(' ') : []),
    ...(className ? className.split(' ') : []),
  ]
  const mappedClassNames = classNames ?
    compact(classNameSplitted.map((singleClassName: string) => classNames[singleClassName])) :
    classNameSplitted

  const propsForSpread = propsDecorator({
    ...styleProps,
    ...(mappedClassNames.length > 0 && {
      className: mappedClassNames.join(' '),
    }),
  })

  // assign `style` and/or `className` props to the return function object
  assign(substyle, propsForSpread)
  return substyle
}

export default createSubstyle
