import hashify from './hashify'

const createPropsDecorator = sheet => {
  const decorateProps = stylingProps => {
    const { style, className, ...rest } = stylingProps

    if (!style) {
      return stylingProps
    }

    const ruleName = hashify(style)

    // prepend rule to the sheet if it does not already exist
    const rule =
      sheet.getRule(ruleName) || sheet.addRule(ruleName, style, { index: 0 })

    return {
      className: className ? `${className} ${rule.className}` : rule.className,
      ...rest,
    }
  }

  return decorateProps
}

export default createPropsDecorator
