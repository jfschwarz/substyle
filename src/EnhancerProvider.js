// @flow
import { PureComponent, PropTypes, Children } from 'react'
import { ENHANCER_CONTEXT_NAME } from './types'

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

EnhancerProvider.childContextTypes = {
  [ENHANCER_CONTEXT_NAME]: PropTypes.func,
}

EnhancerProvider.displayName = 'EnhancerProvider'
