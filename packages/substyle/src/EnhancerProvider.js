// @flow
import * as React from 'react'
import PropTypes from 'prop-types'
import {
  ENHANCER_CONTEXT_NAME,
  PROPS_DECORATOR_CONTEXT_NAME,
  ContextTypes,
} from './types'
import type { EnhancerFuncT, DecoratorFuncT } from './types'

type PropsT = {
  enhancer?: EnhancerFuncT,
  propsDecorator?: DecoratorFuncT,

  children: React.Node,
}

export default class EnhancerProvider extends React.Component<PropsT, void> {
  getChildContext() {
    return {
      [ENHANCER_CONTEXT_NAME]: this.props.enhancer,
      [PROPS_DECORATOR_CONTEXT_NAME]: this.props.propsDecorator,
    }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

EnhancerProvider.propTypes = {
  enhancer: PropTypes.func,
  propsDecorator: PropTypes.func,
  children: PropTypes.element.isRequired,
}

EnhancerProvider.childContextTypes = ContextTypes

EnhancerProvider.displayName = 'EnhancerProvider'
