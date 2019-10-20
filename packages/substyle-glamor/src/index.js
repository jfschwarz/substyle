import React from 'react'
import { createSubstyle, PropsDecoratorProvider } from 'substyle'
import { decorateAsDataAttributes, decorateAsClasses } from './propsDecorators'

export const asDataAttributes = style =>
  createSubstyle({ style }, decorateAsDataAttributes)

export const asDataClasses = style =>
  createSubstyle({ style }, decorateAsClasses)

export const StylesAsDataAttributes = ({ children }) => (
  <PropsDecoratorProvider value={decorateAsDataAttributes}>
    {children}
  </PropsDecoratorProvider>
)

export const StylesAsClasses = ({ children }) => (
  <PropsDecoratorProvider value={decorateAsClasses}>
    {children}
  </PropsDecoratorProvider>
)
