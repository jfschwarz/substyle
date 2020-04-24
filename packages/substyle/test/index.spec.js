import React from 'react'
import { mount } from 'enzyme'
import useStyle from '../src/index'

describe('default export', () => {
  it('should be usable as a hook', () => {
    const MyComp = (props) => {
      const style = useStyle(props)
      return <div {...style} />
    }

    const wrapper = mount(<MyComp className="foo" />)

    expect(wrapper.find('div')).toHaveProp('className', 'foo')
  })
})
