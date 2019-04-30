// @flow
import hoistStatics from 'hoist-non-react-statics'
import React, { Component, type ComponentType, type ElementType } from 'react'
import warning from 'warning'

import { EnhancerConsumer } from './EnhancerProvider'
import createSubstyle from './createSubstyle'
import PropTypes from './propTypes'
import {
  type EnhancerFuncT,
  type KeysT,
  type PropsT,
  type ShouldUpdateFuncT,
  type SubstyleT,
} from './types'

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

    lastProps: PropsT
    memoizedSubstyle: ?SubstyleT

    substyle: SubstyleT
    defaultStyle: Object
    memoizedEnhance: EnhancerFuncT
    enhancedWrappedComponent: ComponentType<*>
    wrappedInstance: ElementType

    constructor(props) {
      super(props)
      const { innerRef: _, ...rest } = props

      if (typeof defaultStyle === 'function') {
        this.defaultStyle = defaultStyle(rest)
      }
    }

    shouldComponentUpdate({ style, className, classNames, ...rest }) {
      const { innerRef: _, ...prevRest } = this.props

      if (typeof defaultStyle === 'function') {
        if (shouldUpdate(rest, prevRest)) {
          this.defaultStyle = defaultStyle(rest)
        }
      }

      return true
    }

    render() {
      const { innerRef, style, className, classNames, ...rest } = this.props
      const modifiers = getModifiers ? getModifiers(rest) : []

      return (
        <EnhancerConsumer>
          {({ enhancer, propsDecorator }) => {
            const EnhancedWrappedComponent = this.getWrappedComponent(enhancer)
            const substyle = this.getSubstyle(
              { style, className, classNames },
              propsDecorator
            )

            return (
              <EnhancedWrappedComponent
                style={substyle(modifiers, this.defaultStyle || defaultStyle)}
                ref={
                  isStatelessFunction(EnhancedWrappedComponent)
                    ? undefined
                    : // $FlowFixMe
                      this.setWrappedInstance
                }
                {...rest}
              />
            )
          }}
        </EnhancerConsumer>
      )
    }

    getSubstyle({ style, className, classNames }, propsDecorator) {
      const {
        style: prevStyle,
        className: prevClassName,
        classNames: prevClassNames,
      } = this.lastProps || {}

      if (
        this.memoizedSubstyle &&
        prevStyle === style &&
        prevClassName === className &&
        prevClassNames === classNames
      ) {
        return this.memoizedSubstyle
      }

      this.memoizedSubstyle = createSubstyle(
        { style, className, classNames },
        propsDecorator
      )
      this.lastProps = { style, className, classNames }

      return this.memoizedSubstyle
    }

    getWrappedComponent(enhance): ComponentType<*> {
      if (this.memoizedEnhance !== enhance) {
        this.memoizedEnhance = enhance
        this.enhancedWrappedComponent = enhance(WrappedComponent)
      }

      // eslint-disable-next-line react/forbid-foreign-prop-types
      if (this.enhancedWrappedComponent.propTypes) {
        this.enhancedWrappedComponent.propTypes = {
          ...this.enhancedWrappedComponent.propTypes,
          style: PropTypes.style,
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
      } else if (
        innerRef &&
        typeof innerRef !== 'string' &&
        typeof innerRef !== 'number'
      ) {
        innerRef.current = ref
      }
    }
  }

  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown'
  WithDefaultStyle.displayName = `withDefaultStyle(${wrappedComponentName})`

  // define prop types based on WrappedComponent's prop types
  WithDefaultStyle.propTypes = {
    ...WrappedComponent.propTypes,
    ...PropTypes,
  }

  // expose WrappedComponent, e.g., for testing purposes
  WithDefaultStyle.WrappedComponent = WrappedComponent

  return hoistStatics(WithDefaultStyle, WrappedComponent)
}

export default createDefaultStyle
