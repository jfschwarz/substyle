// @flow
import { mergeWith, isString, compact } from 'lodash'

import type { ClassNamesT } from './types'

type SelectedClassNamesT = ClassNamesT | string;

const mergeClassNames = (...classNames: Array<SelectedClassNamesT>) => mergeWith(
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

export default mergeClassNames
