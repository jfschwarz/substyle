import React from 'react'
import { mount } from 'enzyme'
import useStyles from '../src/index'

describe('default export', () => {
  it('should be usable as a hook', () => {
    const MyComp = (props) => {
      const style = useStyles(undefined, props)
      return <div {...style} />
    }

    const wrapper = mount(<MyComp className="foo" />)

    expect(wrapper.find('div')).toHaveProp('className', 'foo')
  })
})
