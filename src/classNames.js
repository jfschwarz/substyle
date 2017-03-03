// @flow
import { mergeWith, isString, compact, keys } from 'lodash'

import type { ClassNamesT, CoercedClassNamesT } from './types'

type SelectedClassNamesT = ClassNamesT | string;

export const coerceClassNames = (classNames: SelectedClassNamesT): CoercedClassNamesT => {
  if (isString(classNames)) {
    return { className: classNames }
  }

  const classNamesKeys = keys(classNames)
  const result = {}
  let someChanged = false
  for (let i = 0, l = classNamesKeys.length; i < l; i += 1) {
    const key = classNamesKeys[i]
    if (key === 'className') {
      result.className = classNames.className
    } else {
      result[key] = coerceClassNames(classNames[key])
      someChanged = someChanged || result[key] !== classNames[key]
    }
  }

  return someChanged ? result : classNames
}

export const mergeClassNames = (...classNames: Array<CoercedClassNamesT>) => mergeWith(
  {}, ...classNames,
  (objValue: any, srcValue: any) => {
    if (!objValue) return srcValue

    const objValueIsString = isString(objValue)
    const srcValueIsString = isString(srcValue)

    // handle shortcut syntax
    if (objValueIsString && srcValueIsString) {
      return `${objValue} ${srcValue}`
    } else if (objValueIsString && !srcValueIsString) {
      return {
        className: `${objValue} ${srcValue.className}`,
        ...(srcValue.classNames && { classNames: srcValue.classNames }),
      }
    } else if (!objValueIsString && srcValueIsString) {
      return {
        className: `${objValue.className} ${srcValue}`,
        ...(objValue.classNames && { classNames: objValue.classNames }),
      }
    }

    const { className: objClassName, classNames: objClassNames, ...objRest } = objValue
    const { className: srcClassName, classNames: srcClassNames, ...srcRest } = srcValue

    const className = compact([objClassName, srcClassName]).join(' ')
    const mergedClassNames = (objClassNames || srcClassNames) &&
      mergeClassNames(objClassNames, srcClassNames)

    return {
      ...(className && { className }),
      ...(mergedClassNames && { classNames: mergedClassNames }),
      ...mergeClassNames(objRest, srcRest),
    }
  }
)
