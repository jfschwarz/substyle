import { mount } from 'enzyme'
import React from 'react'
import useStyles from 'substyle'

import { viaJss } from '../src'

describe('StylesViaJss', () => {
  const defaultStyle = { color: 'red' }
  const MyComp = ({ style }) => {
    const styles = useStyles(defaultStyle, { style })
    return <div {...styles} />
  }

  it('should process default styles and custom styling through JSS', () => {
    const wrapper = mount(<MyComp style={viaJss()} />)
    expect(wrapper.find('div')).toHaveProp('className')
    expect(wrapper.find('div')).not.toHaveProp('style')
    const classNameDefault = wrapper.find('div').prop('className')
    expect(classNameDefault.length).toBeGreaterThan(0)

    wrapper.setProps(viaJss({ style: { color: 'green' } }))
    expect(wrapper.find('div')).not.toHaveProp('style')
    const classNameWithCustom = wrapper.find('div').prop('className')
    expect(classNameWithCustom.length).toBeGreaterThan(0)
  })
})
