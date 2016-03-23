import { expect } from 'chai'
import { stripToStrings } from './utils'
import { defaultStyle } from '../src'

describe('defaultStyle', function () {

  it('should return a substyle that is preconfigured to merge the style prop with some default styles', function () {
     const substyleWithDefaultStyles = defaultStyle(
       { width: 50 }, 
       { nested: { height: 10, width: 10 }}
     ) 
     const props = { style: { height: 50, nested: { width: 20 } } }
     expect(stripToStrings(substyleWithDefaultStyles(props).style)).to.deep.equal({ height: 50, width: 50, nested: { height: 10, width: 20 } })
     expect(stripToStrings(substyleWithDefaultStyles(props, 'nested').style)).to.deep.equal({ height: 10, width: 20 })
  })

})
