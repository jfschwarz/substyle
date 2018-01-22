// @flow
import invariant from 'invariant'
import {
  keys,
  values,
  merge,
  assign,
  compact,
  isFunction,
  isPlainObject,
  isString,
  isArray,
} from 'lodash'
import { filter, compose } from 'lodash/fp'

import defaultPropsDecorator from './defaultPropsDecorator'
import { pickNestedStyles, hoistModifierStylesRecursive } from './pickStyles'
import { isModifier, isElement } from './filterKeys'

import type { PropsT, KeysT, ClassNamesT } from './types'

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

const guessBaseClassName = (classNames: ?ClassNamesT): ?string => {
  // all class names must start with the same prefix: the component's base class name
  // which will finally go to the container element
  const firstKey = classNames && keys(classNames)[0]
  return firstKey && firstKey.split('__')[0].split('--')[0]
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
    ...(elementKeys.length === 0
      ? modifierKeys.map(
          (key: string) => `${firstClassName}--${key.substring(1)}`
        )
      : []),
    ...elementKeys.map((key: string) => `${firstClassName}__${key}`),
  ]

  // also use the provided `className` if there is no sub-element selection
  return elementKeys.length === 0
    ? [className, ...derivedClassNames]
    : derivedClassNames
}

function createSubstyle(
  { style, className, classNames }: PropsT,
  propsDecorator: (props: PropsT) => Object = defaultPropsDecorator
) {
  const styleIsFunction = isFunction(style)

  const baseClassName = className || guessBaseClassName(classNames)

  const substyle = styleIsFunction
    ? style
    : (select?: KeysT, defaultStyle?: Object) => {
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

        const collectElementStyles =
          elementKeys.length > 0
            ? (fromStyle: Object) =>
                values(pickNestedStyles(fromStyle, elementKeys))
            : (fromStyle: Object) => [fromStyle]

        const collectSelectedStyles = compose(
          collectElementStyles,
          (fromStyle: Object) =>
            hoistModifierStylesRecursive(fromStyle, modifierKeys)
        )

        const derivedClassNames = deriveClassNames(
          baseClassName,
          elementKeys,
          modifierKeys
        )

        return createSubstyle(
          {
            ...((style || defaultStyle) && {
              style: merge(
                {},
                ...collectSelectedStyles(defaultStyle),
                ...collectSelectedStyles(style)
              ),
            }),

            ...(derivedClassNames && {
              className: derivedClassNames.join(' '),
            }),

            ...(classNames && { classNames }),
          },
          propsDecorator
        )
      }

  const styleProps = {
    ...(styleIsFunction ? style : { style }),
  }
  const classNameSplit = [
    ...(styleProps.className ? styleProps.className.split(' ') : []),
    ...(baseClassName ? baseClassName.split(' ') : []),
  ]
  const mappedClassNames = classNames
    ? compact(
        classNameSplit.map(
          (singleClassName: string) => classNames[singleClassName]
        )
      )
    : classNameSplit

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
