import invariant from 'invariant'

import coerceSelection from './coerceSelection'
import defaultPropsDecorator from './defaultPropsDecorator'
import { isElement, isModifier } from './filterKeys'
import memoize from './memoize'
import { hoistModifierStylesRecursive, pickNestedStyles } from './pickStyles'
import type {
  ClassNamesT,
  DecoratorFuncT,
  KeysT,
  PropsT,
  SubstyleT,
} from './types'
import { compact, isPlainObject, keys, merge, values } from './utils'

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
  propsDecorator: DecoratorFuncT = defaultPropsDecorator
): SubstyleT {
  const baseClassName =
    className || guessBaseClassName(classNames) || style?.className

  const substyle =
    typeof style === 'function'
      ? style
      : memoize((select: KeysT, defaultStyle?: Object) => {
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
              ? (fromStyle: Object) =>
                  values(pickNestedStyles(fromStyle, elementKeys))
              : (fromStyle: Object) => [fromStyle]

          const collectSelectedStyles = (fromStyle: Object = {}) => {
            return collectElementStyles(
              hoistModifierStylesRecursive(fromStyle, modifierKeys)
            )
          }

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
    ...new Set([
      ...(styleProps.className ? styleProps.className.split(' ') : []),
      ...(baseClassName ? baseClassName.split(' ') : []),
    ]),
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

  // assign `style`, `className`, and/or any props added by the decorator to the return function object
  Object.assign(substyle, propsForSpread)
  return substyle
}

export default createSubstyle
