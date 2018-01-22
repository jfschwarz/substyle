import { expect } from 'chai'
import { createElement } from 'react'
import { defaultStyle } from 'substyle'
import TestRenderer from 'react-test-renderer'

import EnhancerProvider from '../src'

const MyComponent = ({ style }) =>
  createElement(
    'div',
    { ...style },
    createElement('div', { ...style('inner') })
  )

const MySubstyledComponent = defaultStyle({
  backgroundColor: 'red',
  inner: {
    width: 100,
  },
})(MyComponent)

describe('EnhancerProvider', () => {
  it('should generate class names based on hash of default inline styles object', () => {
    const result = TestRenderer.create(
      createElement(EnhancerProvider, {}, createElement(MySubstyledComponent))
    ).toJSON()

    expect(result.props).to.not.have.property('style')
    expect(result.props).to.have.property('className', '14xopof')

    expect(result.children[0].props).to.not.have.property('style')
    expect(result.children[0].props).to.have.property('className', 'umgnlr')
  })

  it('should preserve classNames passed by the user', () => {
    const result = TestRenderer.create(
      createElement(
        EnhancerProvider,
        {},
        createElement(MySubstyledComponent, { className: 'foo' })
      )
    ).toJSON()

    expect(result.props).to.have.property('className', 'foo 14xopof')
    expect(result.children[0].props).to.have.property(
      'className',
      'foo__inner umgnlr'
    )
  })
})
