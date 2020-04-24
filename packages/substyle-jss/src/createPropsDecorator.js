import { defaultPropsDecorator } from 'substyle'
import { create } from 'css-jss'
import mapPseudoSelectors from './mapPseudoSelectors'

const createPropsDecorator = jss => {
  const css = create(jss)
  const decorateProps = stylingProps => {
    const decoratedStylingProps = defaultPropsDecorator(stylingProps)
    const { style, className, ...rest } = decoratedStylingProps

    if (!style) {
      return decoratedStylingProps
    }

    const generatedClassName = css(mapPseudoSelectors(style))
    return {
      className: className
        ? `${className} ${generatedClassName}`
        : generatedClassName,
      ...rest,
    }
  }

  return decorateProps
}

export default createPropsDecorator
