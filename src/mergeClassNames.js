// @flow
import { mergeWith, isString } from 'lodash'

import type { ClassNamesT } from './types'

type SelectedClassNamesT = ClassNamesT | string;

const mergeClassNames = (...classNames: Array<SelectedClassNamesT>) => mergeWith(
  {}, ...classNames,
  (objValue: any, srcValue: any) => {
    if (!objValue) return srcValue

    const objValueIsString = isString(objValue)
    const srcValueIsString = isString(srcValue)

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

    return undefined  // causes default object merge behavior
  }
)

export default mergeClassNames
