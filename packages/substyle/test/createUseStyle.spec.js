import { mount } from 'enzyme'
import React from 'react'

import PropsDecoratorProvider from '../src/PropsDecoratorProvider'
import createSubstyle from '../src/createSubstyle'
import useStyles from '../src/useStyles'

describe('useStyles', () => {
  const defaultContentStyle = {
    title: {
      fontStyle: 'bold',
    },
  }

  const Content = ({ title, style }) => {
    const styles = useStyles(defaultContentStyle, { style })

    return (
      <section {...styles}>
        <h1 {...styles('title')}>{title}</h1>
      </section>
    )
  }

  const defaultContainerStyle = {
    background: 'white',

    footer: {
      fontSize: 10,
    },

    '&readOnly': {
      color: 'gray',
      opacity: 0.25,
    },
  }

  const Container = ({ className, style, readOnly }) => {
    const styles = useStyles(
      defaultContainerStyle,
      { '&readOnly': readOnly },
      { className, style }
    )
    return (
      <div {...styles}>
        <Content style={styles('content')} />

        <div {...styles('footer')} />
      </div>
    )
  }

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

  it('should take a modifier selection function as second argument', () => {
    const wrapper = mount(<Container readOnly />)
    expect(
      wrapper
        .find('div')
        .at(0)
        .prop('style')
    ).toHaveProperty('color', 'gray')
  })

  it('should apply the selected modifiers also on the style supplied by the user', () => {
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
    ).toHaveProperty('opacity', 0.5)
  })

  it('should give precedence to styles supplied by the user, regardless the modifiers specificity', () => {
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
    ).toHaveProperty('opacity', 0.7)
  })

  it('should preserve previous default styles if none of the values returned by getDependsOn changes', () => {
    let style
    const Component = props => {
      style = useStyles({})
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
