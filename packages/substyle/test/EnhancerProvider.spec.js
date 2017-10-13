import { expect } from 'chai'
import { spy } from 'sinon'
import { mount } from 'enzyme'
import { createElement } from 'react'

import EnhancerProvider from '../src/EnhancerProvider'
import {
  ENHANCER_CONTEXT_NAME,
  PROPS_DECORATOR_CONTEXT_NAME,
} from '../src/types'

describe('<EnhancerProvider />', () => {
  let getChildContext

  beforeEach(() => {
    getChildContext = spy(EnhancerProvider.prototype, 'getChildContext')
  })

  afterEach(() => {
    getChildContext.restore()
  })

  it('should set up a context providing the passed enhancer function', () => {
    const enhancer = WrappedComponent => WrappedComponent
    mount(createElement(EnhancerProvider, { enhancer }, createElement('div')))
    expect(getChildContext.called).to.be.true
    expect(getChildContext.lastCall.returnValue).to.deep.equal({
      [ENHANCER_CONTEXT_NAME]: enhancer,
      [PROPS_DECORATOR_CONTEXT_NAME]: undefined,
    })
  })

  it('should set up a context providing the passed propsDecorator function', () => {
    const propsDecorator = props => ({ ...props, foo: 'bar' })
    mount(
      createElement(EnhancerProvider, { propsDecorator }, createElement('div'))
    )
    expect(getChildContext.called).to.be.true
    expect(getChildContext.lastCall.returnValue).to.deep.equal({
      [ENHANCER_CONTEXT_NAME]: undefined,
      [PROPS_DECORATOR_CONTEXT_NAME]: propsDecorator,
    })
  })
})
