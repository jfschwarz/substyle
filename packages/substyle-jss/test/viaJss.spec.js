import React from 'react'
import { mount } from 'enzyme'
import { viaJss } from '../src'
import { createUseStyle } from 'substyle'

describe('StylesViaJss', () => {
  const useStyle = createUseStyle({ color: 'red' })
  const MyComp = props => {
    const style = useStyle(props)
    return <div {...style} />
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
