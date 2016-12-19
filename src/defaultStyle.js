// @flow
import { createElement } from 'react'

import createSubstyle from './createSubstyle'
import type { KeysT } from './types'

const createDefaultStyle = (
  defaultStyle: Object,
  getModifiers?: (props: Object) => KeysT
) => (WrappedComponent: ReactClass) => {
  function WithDefaultStyle({ style, className, classNames, ...rest }) {
    const substyle = createSubstyle({ style, className, classNames })
    const modifiers = getModifiers && getModifiers(rest)
    return createElement(
      WrappedComponent,
      { style: substyle(modifiers, defaultStyle), ...rest }
    )
  }

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name
  WithDefaultStyle.displayName = `withDefaultStyle(${wrappedComponentName})`
  return WithDefaultStyle
}

export default createDefaultStyle
