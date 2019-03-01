import { mount } from 'enzyme'
import React, { createElement } from 'react'
import { spy } from 'sinon'

import EnhancerProvider, { EnhancerConsumer } from '../src/EnhancerProvider'
import {
  ENHANCER_CONTEXT_NAME,
  PROPS_DECORATOR_CONTEXT_NAME,
} from '../src/types'

describe('<EnhancerProvider />', () => {
  let getChildContext
  const TestComponent = () => <div />

  it('should set up a context providing the passed enhancer function', () => {
    const enhancer = WrappedComponent => WrappedComponent

    const Component = () => (
      <EnhancerProvider enhancer={enhancer}>
        <EnhancerConsumer>
          {({ enhancer }) => <TestComponent enhancer={enhancer} />}
        </EnhancerConsumer>
      </EnhancerProvider>
    )

    const component = mount(<Component />)

    expect(component.find(TestComponent).props()).toHaveProperty(
      'enhancer',
      enhancer
    )
  })

  it('should set up a context providing the passed propsDecorator function', () => {
    const propsDecorator = props => ({ ...props, foo: 'bar' })

    const Component = () => (
      <EnhancerProvider propsDecorator={propsDecorator}>
        <EnhancerConsumer>
          {({ propsDecorator }) => (
            <TestComponent propsDecorator={propsDecorator} />
          )}
        </EnhancerConsumer>
      </EnhancerProvider>
    )

    const component = mount(<Component />)

    expect(component.find(TestComponent).props()).toHaveProperty(
      'propsDecorator',
      propsDecorator
    )
  })
})
