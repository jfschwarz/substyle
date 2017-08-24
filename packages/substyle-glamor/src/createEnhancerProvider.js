import { createElement } from 'react'
import { EnhancerProvider } from 'substyle'

const createEnhancerProvider = propsDecorator =>
  function GlamorEnhancerProvider({ children }) {
    return createElement(EnhancerProvider, { propsDecorator }, children)
  }

export default createEnhancerProvider
