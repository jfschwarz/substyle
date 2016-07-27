import { expect } from 'chai'

import substyle from '../src'

describe('chaining', () => {

  it('should return a new substyle that has preconfigured default styles to merge the style prop with', function () {
    const substyleWithDefaultStyles = substyle({
      style: {
        width: 50, 
        nested: { height: 10, width: 10 },
      }
    })
    const props = { style: { height: 50, nested: { width: 20 } } }
    expect({...substyleWithDefaultStyles(props)}).to.deep.equal(
      { style: { height: 50, width: 50, nested: { height: 10, width: 20 } } }
    )
    expect({...substyleWithDefaultStyles(props, 'nested')}).to.deep.equal(
      { style: { height: 10, width: 20 } }
    )
  })

  it('should have a default className which is used if no other className is passed', () => {
    const substyleWithDefaultClassName = substyle({
      className: 'foo'
    })
    expect({...substyleWithDefaultClassName({}, 'bar')}).to.deep.equal({
      className: 'foo__bar'
    })
    expect({...substyleWithDefaultClassName({ className: 'baz' }, 'bar')}).to.deep.equal({
      className: 'baz__bar'
    })
  })

})