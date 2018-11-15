// @flow
import {
  createElement,
  Component,
  type ComponentType,
  type ElementType,
} from 'react'
import hoistStatics from 'hoist-non-react-statics'
import warning from 'warning'
import { identity } from './utils'

import createSubstyle from './createSubstyle'
import {
  type SubstyleT,
  type EnhancerFuncT,
  PropTypes,
  ContextTypes,
  ENHANCER_CONTEXT_NAME,
  PROPS_DECORATOR_CONTEXT_NAME,
} from './types'
import type { PropsT, KeysT, ShouldUpdateFuncT, ContextT } from './types'

const isStatelessFunction = (Component: ComponentType<*>): boolean =>
  // $FlowFixMe
  Component.prototype && !Component.prototype.render

const createDefaultStyle = (
  defaultStyle?: Object | ((props: Object) => Object),
  getModifiers?: (props: Object) => KeysT,
  shouldUpdate: ShouldUpdateFuncT = () => true
) => (WrappedComponent: ComponentType<*>) => {
  class WithDefaultStyle extends Component<PropsT, void> {
    static WrappedComponent: ComponentType<*>

    substyle: SubstyleT
    defaultStyle: Object
    memoizedEnhance: EnhancerFuncT
    enhancedWrappedComponent: ComponentType<*>
    wrappedInstance: ElementType

    constructor(props, context) {
      super(props, context)
      const { style, className, classNames, innerRef: _, ...rest } = props

      this.substyle = createSubstyle(
        { style, className, classNames },
        this.context[PROPS_DECORATOR_CONTEXT_NAME]
      )

      if (typeof defaultStyle === 'function') {
        this.defaultStyle = defaultStyle(rest)
      }
    }

    shouldComponentUpdate({ style, className, classNames, ...rest }) {
      const {
        style: prevStyle,
        className: prevClassName,
        classNames: prevClassNames,
        innerRef: _,
        ...prevRest
      } = this.props
      if (
        style !== prevStyle ||
        className !== prevClassName ||
        classNames !== prevClassNames
      ) {
        this.substyle = createSubstyle(
          { style, className, classNames },
          this.context[PROPS_DECORATOR_CONTEXT_NAME]
        )
      }

      if (typeof defaultStyle === 'function') {
        if (shouldUpdate(rest, prevRest)) {
          this.defaultStyle = defaultStyle(rest)
        }
      }

      return true
    }

    render() {
      const {
        innerRef,
        style: _0,
        className: _1,
        classNames: _2,
        ...rest
      } = this.props
      const EnhancedWrappedComponent = this.getWrappedComponent()
      const modifiers = getModifiers ? getModifiers(rest) : []
      return createElement(EnhancedWrappedComponent, {
        style: this.substyle(modifiers, this.defaultStyle || defaultStyle),
        ref: isStatelessFunction(EnhancedWrappedComponent)
          ? undefined
          : // $FlowFixMe
            this.setWrappedInstance,
        ...rest,
      })
    }

    getWrappedComponent(): ComponentType<*> {
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

    getWrappedInstance(): ElementType {
      warning(
        true,
        '`getWrappedInstance()` is deprecated and will be removed with the next major release. ' +
          'Instead, use the `innerRef` prop to get a ref to the wrapped instance.'
      )
      return this.wrappedInstance
    }

    setWrappedInstance = (ref: ElementType): void => {
      this.wrappedInstance = ref
      const { innerRef } = this.props
      if (typeof innerRef === 'function') {
        innerRef(ref)
      } else if (innerRef && typeof innerRef !== 'string') {
        innerRef.current = ref
      }
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
