// @flow
import { createElement, Component } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { omit, identity, isFunction } from 'lodash'

import createSubstyle from './createSubstyle'
import {
  PropTypes,
  ContextTypes,
  ENHANCER_CONTEXT_NAME,
  PROPS_DECORATOR_CONTEXT_NAME,
} from './types'
import type { PropsT, KeysT, ShouldUpdateFuncT } from './types'

const isStatelessFunction = Component => !Component.prototype.render

const createDefaultStyle = (
  defaultStyle?: Object | ((props: Object) => Object),
  getModifiers?: (props: Object) => KeysT,
  shouldUpdate: ShouldUpdateFuncT = () => true
) => (WrappedComponent: ReactClass) => {
  class WithDefaultStyle extends Component<void, PropsT, void> {
    static WrappedComponent: ReactClass

    constructor(props, context) {
      super(props, context)
      const { style, className, classNames, ...rest } = props
      this.substyle = createSubstyle(
        { style, className, classNames },
        this.context[PROPS_DECORATOR_CONTEXT_NAME]
      )
      this.setWrappedInstance = this.setWrappedInstance.bind(this)
      if (isFunction(defaultStyle)) {
        this.defaultStyle = defaultStyle(rest)
      }
    }

    componentWillReceiveProps({ style, className, classNames, ...rest }) {
      if (
        style !== this.props.style ||
        className !== this.props.className ||
        classNames !== this.props.classNames
      ) {
        this.substyle = createSubstyle(
          { style, className, classNames },
          this.context[PROPS_DECORATOR_CONTEXT_NAME]
        )
      }

      if (isFunction(defaultStyle)) {
        if (shouldUpdate(rest)) {
          this.defaultStyle = defaultStyle(rest)
        }
      }
    }

    render() {
      const rest = omit(this.props, ['style', 'className', 'classNames'])
      const EnhancedWrappedComponent = this.getWrappedComponent()
      const modifiers = getModifiers && getModifiers(rest)
      return createElement(EnhancedWrappedComponent, {
        style: this.substyle(modifiers, this.defaultStyle || defaultStyle),
        ref: isStatelessFunction(EnhancedWrappedComponent)
          ? undefined
          : this.setWrappedInstance,
        ...rest,
      })
    }

    getWrappedComponent() {
      const {
        [ENHANCER_CONTEXT_NAME]: enhance = identity,
      }: ContextT = this.context

      if (this.memoizedEnhance !== enhance) {
        this.memoizedEnhance = enhance
        this.enhancedWrappedComponent = enhance(WrappedComponent)
        if (this.enhancedWrappedComponent.propTypes) {
          this.enhancedWrappedComponent.propTypes = {
            ...this.enhancedWrappedComponent.propTypes,
            style: PropTypes.style,
          }
        }
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

  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name
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
