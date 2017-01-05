import invariant from 'invariant'
import { isPlainObject, isFunction } from 'lodash'

import createSubstyle from './createSubstyle'
import defaultStyle from './defaultStyle'
import EnhancerProvider from './EnhancerProvider'

import type { SubstyleT, PropsT } from './types'

export { createSubstyle, EnhancerProvider }
export type { SubstyleT, PropsT }

const injectSubstyle = (...args) => {
  if (args.length === 1 && !isPlainObject(args[0])) {
    // assume use as higher-order component (argument is the wrapped component)
    return defaultStyle()(args[0])
  }

  invariant(
    !args[0] || isPlainObject(args[0]),
    'First argument of defaultStyle must be plain object or a falsy value.\n' +
    `(got: ${args[0]})`
  )
  invariant(
    !args[1] || isPlainObject(args[1]) || isFunction(args[1]),
    'Second argument of defaultStyle must a plain object, a function, or a falsy value.\n' +
    `(got: ${args[1]})`
  )

  // assume use a HoC factory (args are default style and modifiers mapping)
  return defaultStyle(...args)
}

export default injectSubstyle
