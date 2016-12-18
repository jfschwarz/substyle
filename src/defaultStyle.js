// @flow
import React from 'react'

import createSubstyle from './createSubstyle'
import mergeStyles from './mergeStyles'
import type { KeysT } from './types'

const createDefaultStyle = (
  defaultStyle: Object,
  getModifiers?: (props: Object) => KeysT
) => (WrappedComponent: ReactClass) => {
  function WithDefaultStyle({ style, className, classNames, ...rest }) {
    const substyle = createSubstyle({ style, className, classNames })
    const modifiers = getModifiers && getModifiers(rest)
    return (
      <WrappedComponent
        style={substyle(modifiers, defaultStyle)}
        {...rest}
      />
    )
  }

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name
  WithDefaultStyle.displayName = `withDefaultStyle(${wrappedComponentName}`
  return WithDefaultStyle;
}

export default createDefaultStyle
