import { expect } from 'chai'
import { spy } from 'sinon'
import { shallow } from 'enzyme'
import { createElement } from 'react'

import EnhancerProvider from '../src/EnhancerProvider'
import {
  ENHANCER_CONTEXT_NAME,
  PROPS_DECORATOR_CONTEXT_NAME,
} from '../src/types'

describe('<EnhancerProvider />', () => {
  it('should set up a context providing the passed enhancer function', () => {
    const enhancer = WrappedComponent => WrappedComponent
    const getChildContext = spy(EnhancerProvider.prototype, 'getChildContext')
    shallow(createElement(EnhancerProvider, { enhancer }, createElement('div')))
    expect(getChildContext.called).to.be.true
    expect(getChildContext.lastCall.returnValue).to.deep.equal({
      [ENHANCER_CONTEXT_NAME]: enhancer,
      [PROPS_DECORATOR_CONTEXT_NAME]: undefined,
    })
    getChildContext.restore()
  })

  it('should set up a context providing the passed propsDecorator function', () => {
    const propsDecorator = props => ({ ...props, foo: 'bar' })
    const getChildContext = spy(EnhancerProvider.prototype, 'getChildContext')
    shallow(
      createElement(EnhancerProvider, { propsDecorator }, createElement('div'))
    )
    expect(getChildContext.called).to.be.true
    expect(getChildContext.lastCall.returnValue).to.deep.equal({
      [ENHANCER_CONTEXT_NAME]: undefined,
      [PROPS_DECORATOR_CONTEXT_NAME]: propsDecorator,
    })
    getChildContext.restore()
  })
})
