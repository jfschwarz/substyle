import React, { useMemo } from 'react'
import { createSubstyle, PropsDecoratorProvider } from 'substyle'
import createPropsDecorator from './createPropsDecorator'

export const viaJss = (style, jss) =>
  createSubstyle({ style }, createPropsDecorator(jss))

export const StylesViaJss = ({ jss, children }) => {
  const propsDecorator = useMemo(() => createPropsDecorator(jss), [jss])

  return (
    <PropsDecoratorProvider value={propsDecorator}>
      {children}
    </PropsDecoratorProvider>
  )
}
