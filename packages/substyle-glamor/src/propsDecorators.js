import { css } from 'glamor'
import { defaultPropsDecorator } from 'substyle'

export const decorateAsDataAttributes = (props) => {
  const { style, className } = defaultPropsDecorator(props)
  return {
    ...css(style),
    className,
  }
}

export const decorateAsClasses = (props) => {
  const { style, className } = defaultPropsDecorator(props)
  return {
    className: className ? `${className} ${css(style)}` : `${css(style)}`,
  }
}
