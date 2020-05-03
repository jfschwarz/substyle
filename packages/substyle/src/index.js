// @flow
import PropsDecoratorProvider from './PropsDecoratorProvider'
import createSubstyle from './createSubstyle'
import defaultPropsDecorator from './defaultPropsDecorator'
import inline from './inline'
import type { SubstyleT as Substyle, PropsT as StylingProps } from './types'
import useStyles from './useStyles'

export { createSubstyle, PropsDecoratorProvider, defaultPropsDecorator, inline }

export default useStyles

export type { Substyle, StylingProps }
