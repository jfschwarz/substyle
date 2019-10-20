import React from 'react'
import { mount } from 'enzyme'
import createUseStyle from '../src/createUseStyle'
import createSubstyle from '../src/createSubstyle'
import PropsDecoratorProvider from '../src/PropsDecoratorProvider'
import HookProvider from '../src/HookProvider'

describe('createUseStyle', () => {
  const useStyle = createUseStyle()
  const Content = props => {
    const style = useStyle(props)
    return (
      <section {...style}>
        <h1 {...style('title')}>{props.title}</h1>
      </section>
    )
  }

  const createContainer = useStyle => {
    const Container = props => {
      const style = useStyle(props)
      return (
        <div {...style}>
          <Content style={style('content')} />
          <div {...style('footer')} />
        </div>
      )
    }
    return Container
  }
  const useMyStyle = createUseStyle(
    {
      background: 'white',

      content: {
        title: {
          fontStyle: 'bold',
        },
      },

      footer: {
        fontSize: 10,
      },

      '&readOnly': {
        color: 'gray',
      },
    },
    ({ readOnly }) => ({ '&readOnly': readOnly })
  )
  const Container = createContainer(useMyStyle)

  it('should correctly apply default styles and derive class names', () => {
    const wrapper = mount(<Container className="foo" />)
    expect(
      wrapper
        .find('div')
        .at(0)
        .prop('style')
    ).toEqual({
      background: 'white',
    })

    expect(wrapper.find('.foo__footer')).toExist()
    expect(wrapper.find('.foo__footer').prop('style')).toEqual({
      fontSize: 10,
    })

    expect(wrapper.find('.foo__content')).toExist()
    expect(wrapper.find('.foo__content__title')).toExist()
    expect(wrapper.find('.foo__content__title').prop('style')).toEqual({
      fontStyle: 'bold',
    })
  })

  it('should merge styles provided by the user with default styles', () => {
    const wrapper = mount(<Container style={{ cursor: 'pointer' }} />)

    expect(
      wrapper
        .find('div')
        .at(0)
        .prop('style')
    ).toEqual({
      background: 'white',
      cursor: 'pointer',
    })
  })

  it('should also work if a substyle instance is provided as `style`', () => {
    const wrapper = mount(
      <Container
        style={createSubstyle({
          style: { cursor: 'pointer' },
        })}
      />
    )

    expect(
      wrapper
        .find('div')
        .at(0)
        .prop('style')
    ).toEqual({
      background: 'white',
      cursor: 'pointer',
    })
  })

  it('should accept a function mapping props to default styles as first argument', () => {
    const Container = createContainer(
      createUseStyle(props => ({ color: props.color }))
    )
    const wrapper = mount(
      <Container style={{ cursor: 'pointer' }} color="black" />
    )

    expect(
      wrapper
        .find('div')
        .at(0)
        .prop('style')
    ).toEqual({
      color: 'black',
      cursor: 'pointer',
    })
  })

  it('should take a modifier selection function as second argument', () => {
    const Container = createContainer(
      createUseStyle(
        {
          color: 'red',

          '&readOnly': {
            opacity: 0.5,
          },
        },
        props => ({
          '&readOnly': props.readOnly,
        })
      )
    )
    const wrapper = mount(<Container readOnly />)
    expect(
      wrapper
        .find('div')
        .at(0)
        .prop('style')
    ).toEqual({
      color: 'red',
      opacity: 0.5,
    })
  })

  it('should apply the selected modifiers also on the style supplied by the user', () => {
    const Container = createContainer(
      createUseStyle({ color: 'red' }, props => ({
        '&readOnly': props.readOnly,
      }))
    )
    const wrapper = mount(
      <Container
        readOnly
        style={{
          '&readOnly': {
            opacity: 0.5,
          },
        }}
      />
    )

    expect(
      wrapper
        .find('div')
        .at(0)
        .prop('style')
    ).toEqual({
      color: 'red',
      opacity: 0.5,
    })
  })

  it('should give precedence to styles supplied by the user, regardless the modifiers specificity', () => {
    const Container = createContainer(
      createUseStyle(
        {
          '&readOnly': {
            opacity: 0.5,
          },
        },
        props => ({
          '&readOnly': props.readOnly,
        })
      )
    )
    const wrapper = mount(
      <Container
        readOnly
        style={{
          opacity: 0.7,
        }}
      />
    )
    expect(
      wrapper
        .find('div')
        .at(0)
        .prop('style')
    ).toEqual({
      opacity: 0.7,
    })
  })

  it('should allow passing a getDependsOn function that is called with the props', () => {
    const getDependsOn = jest.fn()
    const Container = createContainer(
      createUseStyle(() => ({}), () => [], getDependsOn)
    )
    const wrapper = mount(<Container foo="bar" />)
    wrapper.setProps({ foo: 'baz' })

    expect(getDependsOn).toHaveBeenCalledTimes(2)
    expect(getDependsOn).toHaveBeenCalledWith({ foo: 'bar' })
    expect(getDependsOn).toHaveBeenCalledWith({ foo: 'baz' })
  })

  it('should preserve previous default styles if none of the values returned by getDependsOn changes', () => {
    const getDependsOn = () => false
    const useStyle = createUseStyle(() => ({}), () => [], getDependsOn)

    let style
    const Component = props => {
      style = useStyle(props)
      return null
    }
    const wrapper = mount(<Component />)
    const styleOnFirstRender = style
    wrapper.setProps({ update: 'yes' })
    const styleOnSecondRender = style

    expect(styleOnFirstRender).toBe(styleOnSecondRender)
  })

  it('should support providing a props decorator function via context', () => {
    const decorateProps = props => ({
      'data-mapped': 'foobar',
    })
    const wrapper = mount(
      <PropsDecoratorProvider value={decorateProps}>
        <Container />
      </PropsDecoratorProvider>
    )

    const props = wrapper.find('section').props()
    expect(props).not.toHaveProperty('style')
    expect(props).not.toHaveProperty('className')
    expect(props).toHaveProperty('data-mapped', 'foobar')
  })
})
