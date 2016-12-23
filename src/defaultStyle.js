// @flow
import { createElement, PropTypes } from 'react'
import { identity } from 'lodash'

import createSubstyle from './createSubstyle'
import { ENHANCER_CONTEXT_NAME } from './types'
import type { KeysT, PropsT } from './types'

const createDefaultStyle = (
  defaultStyle: Object,
  getModifiers?: (props: Object) => KeysT
) => (WrappedComponent: ReactClass) => {
  function WithDefaultStyle(
    { style, className, classNames, ...rest }: PropsT,
    { [ENHANCER_CONTEXT_NAME]: enhance = identity }: ContextT,
  ) {
    const substyle = createSubstyle({ style, className, classNames })
    const modifiers = getModifiers && getModifiers(rest)

    return createElement(
      enhance(WrappedComponent),
      { style: substyle(modifiers, defaultStyle), ...rest }
    )
  }

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name
  WithDefaultStyle.displayName = `withDefaultStyle(${wrappedComponentName})`

  WithDefaultStyle.contextTypes = { [ENHANCER_CONTEXT_NAME]: PropTypes.func }

  return WithDefaultStyle
}

export default createDefaultStyle
