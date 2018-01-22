import { createElement, Component } from 'react'
import jss from 'jss'
import { EnhancerProvider } from 'substyle'
import hashify from './hashify'

export default class JssEnhancerProvider extends Component {
  componentWillMount() {
    this.sheet = jss
      .createStyleSheet(
        {},
        {
          index: 0, // insert default styles at the very start of the document
          ...this.props.sheetOptions,
        }
      )
      .attach()
  }

  componentWillUnmount() {
    this.sheet.detach()
  }

  render() {
    return createElement(
      EnhancerProvider,
      { propsDecorator: this.decorateProps },
      this.props.children
    )
  }

  decorateProps = stylingProps => {
    const { style, className, ...rest } = stylingProps

    if (!style) {
      return stylingProps
    }

    const classNamePrefix =
      this.props.sheetOptions && this.props.sheetOptions.classNamePrefix
    const ruleName = `${classNamePrefix || ''}${hashify(style)}`

    // add rule to the sheet if it does not already exist
    if (this.sheet.getRule(ruleName) !== undefined) {
      this.sheet.addRule(ruleName, style, { className: ruleName })
    }

    return {
      className: className ? `${className} ${ruleName}` : ruleName,
      ...rest,
    }
  }
}
