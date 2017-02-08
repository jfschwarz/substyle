// @flow
import { createElement, Component } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { identity } from 'lodash'

import createSubstyle from './createSubstyle'
import { PropTypes, ContextTypes, ENHANCER_CONTEXT_NAME } from './types'
import type { KeysT, PropsT, ContextT } from './types'

// const isStateless(component: Function): boolean {
//   return !component.render && !(component.prototype && component.prototype.render);
// }

const createDefaultStyle = (
  defaultStyle?: Object,
  getModifiers?: (props: Object) => KeysT,
) => (WrappedComponent: ReactClass) => {
  class WithDefaultStyle extends Component<void, PropsT, void> {
    static WrappedComponent: ReactClass;

    constructor(props, context) {
      super(props, context)
      this.setWrappedInstance = this.setWrappedInstance.bind(this)
    }

    render() {
      const { style, className, classNames, ...rest } = this.props

      const substyle = createSubstyle({ style, className, classNames })
      const modifiers = getModifiers && getModifiers(rest)

      return createElement(
        this.getWrappedComponent(),
        {
          style: substyle(modifiers, defaultStyle),
          ref: this.setWrappedInstance,
          // ...(isStateless && { ref: this.setWrappedInstance })
          ...rest,
        }
      )
    }

    getWrappedComponent() {
      const { [ENHANCER_CONTEXT_NAME]: enhance = identity }: ContextT = this.context

      if (this.memoizedEnhance !== enhance) {
        this.memoizedEnhance = enhance
        this.enhancedWrappedComponent = enhance(WrappedComponent)
      }

      return this.enhancedWrappedComponent || WrappedComponent
    }

    getWrappedInstance() {
      return this.wrappedInstance
    }

    setWrappedInstance(ref) {
      this.wrappedInstance = ref
    }
  }

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name
  WithDefaultStyle.displayName = `withDefaultStyle(${wrappedComponentName})`

  // define prop types based on WrappedComponent's prop types
  WithDefaultStyle.propTypes = {
    ...WrappedComponent.propTypes,
    ...PropTypes,
  }

  WithDefaultStyle.contextTypes = ContextTypes

  // expose WrappedComponent, e.g., for testing purposes
  WithDefaultStyle.WrappedComponent = WrappedComponent

  return hoistStatics(WithDefaultStyle, WrappedComponent)
}

export default createDefaultStyle
