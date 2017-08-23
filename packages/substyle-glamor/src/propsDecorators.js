import { css } from 'glamor'

export const decorateAsDataAttributes = ({ style, className }) => ({
  ...css(style),
  className,
})

export const decorateAsClasses = ({ style, className }) => ({
  className: className ? `${className} ${css(style)}` : `${css(style)}`,
})
