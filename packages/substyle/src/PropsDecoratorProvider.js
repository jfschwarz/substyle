// @flow
import { createContext } from 'react'
import defaultPropsDecorator from './defaultPropsDecorator'
import type { DecoratorFuncT } from './types'

export const PropsDecoratorContext = createContext<DecoratorFuncT>(
  defaultPropsDecorator
)

export default PropsDecoratorContext.Provider
