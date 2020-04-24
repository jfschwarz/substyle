// @flow
import createSubstyle from './createSubstyle'
import createUseStyle from './createUseStyle'
import PropsDecoratorProvider from './PropsDecoratorProvider'
import defaultPropsDecorator from './defaultPropsDecorator'
import inline from './inline'
import type { SubstyleT as Substyle } from './types'

export {
  createUseStyle,
  createSubstyle,
  PropsDecoratorProvider,
  defaultPropsDecorator,
  inline,
}

export default createUseStyle()

export type { Substyle }
