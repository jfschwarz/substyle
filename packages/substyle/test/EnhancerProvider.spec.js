import { mount } from 'enzyme'
import { createElement } from 'react'
import { spy } from 'sinon'

import EnhancerProvider from '../src/EnhancerProvider'
import {
  ENHANCER_CONTEXT_NAME,
  PROPS_DECORATOR_CONTEXT_NAME,
} from '../src/types'

describe('<EnhancerProvider />', () => {
  let getChildContext

  beforeEach(() => {
    getChildContext = jest.spyOn(EnhancerProvider.prototype, 'getChildContext')
  })

  afterEach(() => {
    getChildContext.mockRestore()
  })

  it('should set up a context providing the passed enhancer function', () => {
    const enhancer = WrappedComponent => WrappedComponent
    mount(createElement(EnhancerProvider, { enhancer }, createElement('div')))
    expect(getChildContext).toHaveBeenCalled()
    expect(getChildContext).toHaveReturnedWith({
      [ENHANCER_CONTEXT_NAME]: enhancer,
      [PROPS_DECORATOR_CONTEXT_NAME]: undefined,
    })
  })

  it('should set up a context providing the passed propsDecorator function', () => {
    const propsDecorator = props => ({ ...props, foo: 'bar' })
    mount(
      createElement(EnhancerProvider, { propsDecorator }, createElement('div'))
    )
    expect(getChildContext).toHaveBeenCalled()
    expect(getChildContext).toHaveReturnedWith({
      [ENHANCER_CONTEXT_NAME]: undefined,
      [PROPS_DECORATOR_CONTEXT_NAME]: propsDecorator,
    })
  })
})
