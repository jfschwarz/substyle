import { createSubstyle } from 'substyle'
import { decorateAsDataAttributes, decorateAsClasses } from './propsDecorators'
import createEnhancerProvider from './createEnhancerProvider'

export const asDataAttributes = style =>
  createSubstyle({ style }, decorateAsDataAttributes)

export const asDataClasses = style =>
  createSubstyle({ style }, decorateAsClasses)

export const StylesAsDataAttributes = createEnhancerProvider(
  decorateAsDataAttributes
)

export const StylesAsClasses = createEnhancerProvider(decorateAsClasses)
