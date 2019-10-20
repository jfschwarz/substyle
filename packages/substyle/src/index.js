// @flow
import createSubstyle from './createSubstyle'
import createUseStyle from './createUseStyle'
import HookProvider from './HookProvider'
import PropsDecoratorProvider from './PropsDecoratorProvider'
import defaultPropsDecorator from './defaultPropsDecorator'
import type { SubstyleT as Substyle } from './types'

export {
  createUseStyle,
  createSubstyle,
  HookProvider,
  PropsDecoratorProvider,
  defaultPropsDecorator,
}

export default createUseStyle()

export type { Substyle }
