import { expect } from 'chai'
import { shallow } from 'enzyme'
import { createElement } from 'react'

import defaultStyle from '../src/defaultStyle'

// shallow render twice (once for the HoC wrapper, once for wrapped component)
const render = (element) => (
  shallow(shallow(element).get(0))
)

describe.only('`defaultStyle` higher-order component', () => {
  const MyComponent = ({ style, ...rest }) => createElement('div', { ...style, ...rest },
    createElement('span', { ...style('nested') })
  )

  it('should inject a substyle instance for the `style` prop', () => {
    const MyEnhancedComponent = defaultStyle()(MyComponent)
    const wrapper = render(createElement(MyEnhancedComponent))
    console.log(wrapper.find('div'))
  })
})
