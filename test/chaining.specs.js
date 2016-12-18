import { expect } from 'chai'

import createSubstyle from '../src/createSubstyle'

describe('chaining', () => {

  it('should select the style definitions for all modifiers substyle calls', function () {
    const myStyle = {
      position: 'absolute',
      '&outer': {
        cursor: 'pointer',
      },
      '&inner': {
        color: 'red',
      },
    }
    const substyle = createSubstyle({ style: myStyle })
    const { style } = substyle('&outer')('&inner')
    expect(style).to.deep.equal({
      position: 'absolute',
      cursor: 'pointer',
      color: 'red',
    })

    const { style: sameStyle } = substyle(['&outer', '&inner'])
    expect(sameStyle).to.deep.equal(style)
  })

})
