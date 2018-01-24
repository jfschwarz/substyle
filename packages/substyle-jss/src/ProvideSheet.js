import { createElement } from 'react'
import { EnhancerProvider } from 'substyle'
import injectSheet from 'react-jss'
import createPropsDecorator from './createPropsDecorator'

const ProvideSheet = ({ sheet, children }) =>
  createElement(
    EnhancerProvider,
    { propsDecorator: createPropsDecorator(sheet) },
    children
  )

export default injectSheet({}, { inject: ['sheet'] })(ProvideSheet)
