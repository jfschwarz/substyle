import { defaultPropsDecorator } from 'substyle'
import hashify from './hashify'
import mapPseudoSelectors from './mapPseudoSelectors'

const createPropsDecorator = sheet => {
  const decorateProps = stylingProps => {
    const decoratedStylingProps = defaultPropsDecorator(stylingProps)
    const { style, className: baseClassName, ...rest } = decoratedStylingProps

    if (!style) {
      return decoratedStylingProps
    }

    const ruleName = hashify(style)

    // prepend rule to the sheet if it does not already exist
    const rule =
      sheet.getRule(ruleName) ||
      sheet.addRule(ruleName, mapPseudoSelectors(style), { index: 0 })

    const className = rule.options.classes[ruleName]

    return {
      className: baseClassName ? `${baseClassName} ${className}` : className,
      ...rest,
    }
  }

  return decorateProps
}

export default createPropsDecorator
