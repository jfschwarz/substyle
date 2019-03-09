// @flow
import invariant from 'invariant'

import type {
  ClassNamesT,
  DecoratorFuncT,
  KeysT,
  PropsT,
  StyleDefinitionT,
  SubstyleT,
} from '../types'
import {
  assign,
  compact,
  isElement,
  isModifier,
  isPlainObject,
  keys,
  merge,
  values,
} from '../utils'
import coerceSelection from './coerceSelection'
import defaultPropsDecorator from './defaultPropsDecorator'
import hoistModifierStylesRecursive from './hoistModifierStylesRecursive'
import memoize from './memoize'
import pickNestedStyles from './pickDirectStyles'

function createSubstyle(
  { style, className, classNames }: PropsT,
  propsDecorator: DecoratorFuncT = defaultPropsDecorator
): SubstyleT {
  const baseClassName = className || guessBaseClassName(classNames)

  const substyle =
    typeof style === 'function'
      ? style
      : memoize((select: KeysT, defaultStyle?: StyleDefinitionT) => {
          const selectedKeys = coerceSelection(select)

          invariant(
            Array.isArray(selectedKeys),
            'First parameter must be a string, an array of strings, ' +
              'a plain object with boolean values, or a falsy value.'
          )

          invariant(
            !defaultStyle || isPlainObject(defaultStyle),
            'Optional second parameter must be a plain object.'
          )

          const modifierKeys = selectedKeys.filter(isModifier)
          const elementKeys = selectedKeys.filter(isElement)

          const collectElementStyles =
            elementKeys.length > 0
              ? (fromStyle: StyleDefinitionT) =>
                  values(pickNestedStyles(fromStyle, elementKeys))
              : (fromStyle: StyleDefinitionT) => [fromStyle]

          const collectSelectedStyles = (fromStyle: StyleDefinitionT = {}) =>
            collectElementStyles(
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
        })

  const styleProps = {
    ...(typeof style === 'function' ? style : { style }),
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
    ...(mappedClassNames.length > 0
      ? {
          className: mappedClassNames.join(' '),
        }
      : {}),
  })

  // assign `style` and/or `className` props to the return function object
  assign(substyle, propsForSpread)
  return substyle
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

export default createSubstyle
