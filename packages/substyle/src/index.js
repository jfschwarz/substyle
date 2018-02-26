// @flow
import createSubstyle from './createSubstyle'
import defaultStyle from './defaultStyle'
import EnhancerProvider from './EnhancerProvider'
import defaultPropsDecorator from './defaultPropsDecorator'
import hash from './hash'
import type { SubstyleT as Substyle } from './types'

export {
  createSubstyle,
  EnhancerProvider,
  defaultStyle,
  defaultPropsDecorator,
  hash,
}

export default defaultStyle()
export type { Substyle }
