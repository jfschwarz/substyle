import { expect } from 'chai'
import { createElement } from 'react'

import injectSubstyle from '../src/index'

describe('default export', () => {
  it('should be usable as a higher-order component', () => {
    const MyComp = ({ style }) => createElement('div', { ...style })
    const MyEnhancedComponent = injectSubstyle(MyComp)

    expect(MyEnhancedComponent.displayName).to.equal('withDefaultStyle(MyComp)')
  })
})
