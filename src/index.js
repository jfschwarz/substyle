// @flow
import createSubstyle from './createSubstyle'
import defaultStyle from './defaultStyle'
import EnhancerProvider from './EnhancerProvider'
import type { SubstyleT as Substyle } from './types'

export { createSubstyle, EnhancerProvider, defaultStyle }

export default defaultStyle()
export type { Substyle }
