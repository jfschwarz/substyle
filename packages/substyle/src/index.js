// @flow
import defaultStyle from './defaultStyle'
import type { SubstyleT as Substyle } from './types'

export {
  default as createSubstyle,
  defaultPropsDecorator,
} from './createSubstyle'
export { default as defaultStyle } from './defaultStyle'
export { default as EnhancerProvider } from './EnhancerProvider'

export default defaultStyle()
export type { Substyle }
