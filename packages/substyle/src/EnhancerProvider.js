// @flow
import { PureComponent, Children } from 'react'
import PropTypes from 'prop-types'
import { ENHANCER_CONTEXT_NAME, ContextTypes } from './types'

export default class EnhancerProvider extends PureComponent {
  getChildContext() {
    return { [ENHANCER_CONTEXT_NAME]: this.props.enhancer }
  }

  render() {
    return Children.only(this.props.children)
  }
}

EnhancerProvider.propTypes = {
  enhancer: PropTypes.func,
  children: PropTypes.element.isRequired,
}

EnhancerProvider.childContextTypes = ContextTypes

EnhancerProvider.displayName = 'EnhancerProvider'
