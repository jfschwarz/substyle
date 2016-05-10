import { expect } from 'chai'
import { defaultStyle } from '../src'

describe('defaultStyle', function () {

  it('should return a substyle that is preconfigured to merge the style prop with some default styles', function () {
     const substyleWithDefaultStyles = defaultStyle(
       { width: 50 }, 
       { nested: { height: 10, width: 10 }}
     ) 
     const props = { style: { height: 50, nested: { width: 20 } } }
     expect(substyleWithDefaultStyles(props)).to.deep.equal({ style: { height: 50, width: 50, nested: { height: 10, width: 20 } } })
     expect(substyleWithDefaultStyles(props, 'nested')).to.deep.equal({ style: { height: 10, width: 20 } })
  })

})
