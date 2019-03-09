import { mount } from 'enzyme'
import React from 'react'

import EnhancerProvider, { EnhancerConsumer } from './EnhancerProvider'

describe('<EnhancerProvider />', () => {
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
