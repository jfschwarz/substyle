import { mount, shallow } from 'enzyme'
import PT from 'prop-types'
import React, { Component, createElement } from 'react'

import EnhancerProvider from '../src/EnhancerProvider'
import createSubstyle from '../src/createSubstyle'
import defaultStyle from '../src/defaultStyle'
import { PropTypes } from '../src/types'

describe('`defaultStyle` higher-order component factory', () => {
  const MyComponent = ({ style, ...rest }) => (
    <div {...style} {...rest}>
      <span {...style('nested')} />
    </div>
  )

  const getStyleProp = wrapper => wrapper.find(MyComponent).prop('style')

  it('should inject a substyle instance for the `style` prop', () => {
    const MyEnhancedComponent = defaultStyle({ color: 'red' })(MyComponent)
    const wrapper = mount(<MyEnhancedComponent />)
    const styleProp = getStyleProp(wrapper)

    expect(styleProp).toBeInstanceOf(Function)
    expect(styleProp.style).toEqual({ color: 'red' })
  })

  it('should merge styles provided by the component user with default styles', () => {
    const MyEnhancedComponent = defaultStyle({ color: 'red' })(MyComponent)
    const wrapper = mount(<MyEnhancedComponent style={{ cursor: 'pointer' }} />)

    const styleProp = getStyleProp(wrapper).style

    expect(styleProp).toEqual({
      color: 'red',
      cursor: 'pointer',
    })
  })

  it('should also work if a substyle instance is provided as `style`', () => {
    const MyEnhancedComponent = defaultStyle({ color: 'red' })(MyComponent)
    const wrapper = mount(
      <MyEnhancedComponent
        style={createSubstyle({
          style: { cursor: 'pointer' },
        })}
      />
    )
    const styleProp = getStyleProp(wrapper)

    expect(styleProp.style).toEqual({
      color: 'red',
      cursor: 'pointer',
    })
  })

  it('should accept a function mapping props to default styles as first argument', () => {
    const MyEnhancedComponent = defaultStyle(props => ({ color: props.color }))(
      MyComponent
    )

    const wrapper = mount(
      <MyEnhancedComponent style={{ cursor: 'pointer' }} color="black" />
    )
    const styleProp = getStyleProp(wrapper)

    expect(styleProp.style).toEqual({
      color: 'black',
      cursor: 'pointer',
    })
  })

  it('should take a modifier selection function as second argument', () => {
    const MyEnhancedComponent = defaultStyle(
      {
        color: 'red',

        '&readOnly': {
          opacity: 0.5,
        },
      },
      props => ({
        '&readOnly': props.readOnly,
      })
    )(MyComponent)
    const wrapper = mount(<MyEnhancedComponent readOnly />)
    const styleProp = getStyleProp(wrapper)

    expect(styleProp.style).toEqual({
      color: 'red',
      opacity: 0.5,
    })
  })

  it('should apply the selected modifiers also on the style supplied by the user', () => {
    const MyEnhancedComponent = defaultStyle({ color: 'red' }, props => ({
      '&readOnly': props.readOnly,
    }))(MyComponent)

    const wrapper = mount(
      <MyEnhancedComponent
        readOnly
        style={{
          '&readOnly': {
            opacity: 0.5,
          },
        }}
      />
    )
    const styleProp = getStyleProp(wrapper)
    expect(styleProp.style).toEqual({
      color: 'red',
      opacity: 0.5,
    })
  })

  it('should give precedence to styles supplied by the user, regardless the modifiers specificity', () => {
    const MyEnhancedComponent = defaultStyle(
      {
        '&readOnly': {
          opacity: 0.5,
        },
      },
      props => ({
        '&readOnly': props.readOnly,
      })
    )(MyComponent)

    const wrapper = mount(
      <MyEnhancedComponent
        readOnly
        style={{
          opacity: 0.7,
        }}
      />
    )
    const styleProp = getStyleProp(wrapper)
    expect(styleProp.style).toEqual({
      opacity: 0.7,
    })
  })

  it('should support dependency injection via context for additional HOC to wrap the component', () => {
    const MyStyledComponent = defaultStyle()(MyComponent)

    const wrapInSection = WrappedComponent => props => (
      <section>
        <WrappedComponent {...props} />
      </section>
    )

    const wrapper = mount(
      <EnhancerProvider enhancer={wrapInSection}>
        <MyStyledComponent />
      </EnhancerProvider>
    )

    expect(wrapper.find('section')).toExist()
    expect(wrapper.find('section').find(MyComponent)).toExist()
  })

  it('should fix `style` prop type if injected HOC defines (as Radium does)', () => {
    const MyStyledComponent = defaultStyle()(MyComponent)
    const wrapInSection = WrappedComponent => {
      const WrapperComp = props => (
        <section>
          <WrappedComponent {...props} />
        </section>
      )

      WrapperComp.propTypes = {
        style: PT.array,
      }
      return WrapperComp
    }
    const wrapper = mount(
      <EnhancerProvider enhancer={wrapInSection}>
        <MyStyledComponent />
      </EnhancerProvider>
    )
    expect(wrapper.find('WrapperComp').type().propTypes.style).toEqual(
      PropTypes.style
    )
  })

  it('should expose the wrapped component instance via `getWrappedInstance`', () => {
    class MyClassComponent extends Component {
      render() {
        return createElement('div')
      }
    }
    const MyEnhancedClassComponent = defaultStyle()(MyClassComponent)
    const instance = mount(createElement(MyEnhancedClassComponent)).instance()
    expect(typeof instance.getWrappedInstance).toEqual('function')
    expect(instance.getWrappedInstance()).toBeInstanceOf(MyClassComponent)

    const MyFunctionComponent = () => createElement('div')
    const MyEnhancedFunctionComponent = defaultStyle()(MyFunctionComponent)
    const instance2 = mount(
      createElement(MyEnhancedFunctionComponent)
    ).instance()
    expect(instance2.getWrappedInstance()).not.toBeDefined()
  })

  it('should support providing a props decorator function via context', () => {
    const MyStyledComponent = defaultStyle()(MyComponent)
    const decorateProps = props => ({
      'data-mapped': 'foobar',
    })
    const wrapper = mount(
      <EnhancerProvider propsDecorator={decorateProps}>
        <MyStyledComponent />
      </EnhancerProvider>
    )
    const containerProps = wrapper
      .find('MyComponent')
      .find('div')
      .props()
    expect(containerProps).not.toHaveProperty('style')
    expect(containerProps).not.toHaveProperty('className')
    expect(containerProps).toHaveProperty('data-mapped', 'foobar')
  })

  it('should allow passing a shouldUpdate function which is called with next and current props', () => {
    const shouldUpdate = jest.fn()
    const MyStyledComponent = defaultStyle(() => ({}), () => [], shouldUpdate)(
      MyComponent
    )
    const wrapper = mount(createElement(MyStyledComponent, { foo: 'bar' }))
    wrapper.setProps({ foo: 'baz' })

    expect(shouldUpdate).toHaveBeenCalledTimes(1)
    expect(shouldUpdate).toHaveBeenCalledWith({ foo: 'baz' }, { foo: 'bar' })
  })

  it('should preserve previous default styles if shouldUpdate function returns false', () => {
    const MyStyledComponent = defaultStyle(() => ({}), () => [], () => false)(
      MyComponent
    )
    const wrapper = mount(createElement(MyStyledComponent))
    const { style } = wrapper.find('MyComponent').props()
    wrapper.setProps({ update: 'yes' })

    const { style: nextStyle } = wrapper.find('MyComponent').props()
    expect(nextStyle).toBe(style)
  })
})
