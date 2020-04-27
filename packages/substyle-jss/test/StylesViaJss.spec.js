import { mount } from 'enzyme'
import React from 'react'
import { useStyles } from 'substyle'

import { StylesViaJss } from '../src'
import createPropsDecorator from '../src/createPropsDecorator'

jest.mock('css-jss', () => ({
  create: () => (styles) =>
    Buffer.from(JSON.stringify(styles)).toString('base64'),
}))

jest.mock('../src/createPropsDecorator', () => {
  return {
    __esModule: true,
    default: jest.fn(jest.requireActual('../src/createPropsDecorator').default),
  }
})

describe('StylesViaJss', () => {
  const defaultStyle = { color: 'red' }

  const MyComp = ({ style }) => {
    const styles = useStyles(defaultStyle, { style })
    return <div {...styles} />
  }

  beforeEach(() => {
    createPropsDecorator.mockClear()
  })

  it('should process default styles and custom styling through JSS', () => {
    const wrapper = mount(
      <StylesViaJss>
        <MyComp />
      </StylesViaJss>
    )
    expect(wrapper.find('div')).toHaveProp('className')
    expect(wrapper.find('div')).not.toHaveProp('style')
    const classNameDefault = wrapper.find('div').prop('className')
    expect(classNameDefault.length).toBeGreaterThan(0)

    wrapper.setProps(
      <StylesViaJss>
        <MyComp style={{ color: 'green' }} />
      </StylesViaJss>
    )
    expect(wrapper.find('div')).not.toHaveProp('style')
    const classNameWithCustom = wrapper.find('div').prop('className')
    expect(classNameWithCustom.length).toBeGreaterThan(0)
  })

  it('should memoize the result of createPropsDecorator as long as the jss prop does not change', () => {
    const wrapper = mount(
      <StylesViaJss>
        <MyComp />
      </StylesViaJss>
    )
    expect(createPropsDecorator).toHaveBeenCalledTimes(1)
    expect(createPropsDecorator).toHaveBeenCalledTimes(1)

    wrapper.setProps({ jss: 'updated' })
    expect(createPropsDecorator).toHaveBeenCalledTimes(2)
  })
})
