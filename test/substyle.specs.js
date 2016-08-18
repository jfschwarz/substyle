import { expect } from 'chai'

import substyle from '../src'

const myStyle = {

  width: '100%',

  ':hover': {
    background: 'silver',
  },

  '@media (min-width: 600px)': {
    width: '50%',
  },

  toggle: {
    display: 'block',
    width: 50,
  },

  btn: {
    cursor: 'pointer',
  },

  '&active': {
    background: 'blue',
  },

  '&inactive': {
    background: 'white',
  },

  '&disabled': {
    pointerEvents: 'none',

    btn: {
      cursor: 'default',
    },
  },

}

describe('substyle', function () {

  it('should should select the nested inline styles for the given key', function () {
    const { style } = substyle({ style: myStyle }, 'toggle')
    expect(style).to.deep.equal({
      display: 'block',
      width: 50
    })
  })

  it('should not return a style when no style has been set in the props', function () {
    const props = substyle({ }, 'toggle')
    expect(props).to.not.have.property('style')
  })

  it('should hoist style definitions for the active modifiers', function () {
    const { style } = substyle({ style: myStyle }, '&active')
    expect(style).to.have.property('background', 'blue' ) // hoisted from &active
  })

  it('should not hoist modifier styles inside of element sub styles', () => {
    const { style } = substyle({ 
      style: {
        myel: {
          color: 'blue',
          '&mymod': {
            color: 'red'
          }
        }
      }
    }, ['myel', '&mymod'])
    expect(style).to.deep.equal({
      color: 'blue',
    })
  })

  it('should support passing multiple keys in an array', function () {
    const { style, className } = substyle(
      { style: myStyle, className: 'my-class' }, 
      [ 'toggle', 'btn' ]
    )

    expect(className).to.equal('my-class__toggle my-class__btn')
    expect(style).to.deep.equal({ 
      display: 'block',
      width: 50,
      cursor: 'pointer'
    })
  })

  it('should support passing multiple keys as an object', function () {
    const derivedSubstyle = substyle(
      { style: myStyle, className: 'my-class' }, 
      { '&active': true, '&inactive': false, '&disabled': true }
    )
    const { style, className } = derivedSubstyle

    expect(className).to.equal('my-class my-class--active my-class--disabled')
    expect(style).to.deep.equal({ 
      width: '100%',

      ':hover': {
        background: 'silver',
      },

      '@media (min-width: 600px)': {
        width: '50%',
      },

      background: 'blue',    // hoisted from &active
      pointerEvents: 'none', // hoisted from &disabled
    })

    const { style: btnStyle } = derivedSubstyle({}, 'btn')
    expect(btnStyle).to.deep.equal({                 
      cursor: 'default',   // overridden btn styles hoisted from &disabled
    })
  })

  it('should return the top-level inline style definitions if selectedKeys is not specified', function () {
    const { style } = substyle({ style: myStyle })
    expect(style).to.have.property('width', '100%')
  })

  it('should include nested inline style definitions for pseudo-class selectors', function () {
    const { style } = substyle({ style: myStyle })
    expect(style).to.have.property(':hover')
    expect(style[':hover']).to.deep.equal({
      background: 'silver'
    })
  })

  it('should include nested inline style definitions for media queries', function () {
    const styleWithMedia = {
      background: 'white',
      '@media (min-width: 320px)': {
        width: '100%'
      }
    }
    const { style } = substyle({ style: styleWithMedia })
    expect(style).to.have.property('@media (min-width: 320px)')
  })

  it('should merge nested inline styles in the order of appearance in the object', function () {
    const styleWithDeepNesting = {
      toggle: {
        width: 100,

        label: {
          fontSize: '11pt',
          color: 'blue'
        }
      },

      specialToggle: {
        width: 50,

        label: {
          color: 'red'
        }
      }
    }

    const derivedSubstyle = substyle({ style: styleWithDeepNesting }, ['toggle', 'specialToggle'])
    const { style } = derivedSubstyle
    expect(style).to.deep.equal({
      width: 50,
    })
    const { style: labelStyle } = derivedSubstyle({}, 'label')
    expect(labelStyle).to.deep.equal({
      fontSize: '11pt',
      color: 'red'
    })

    // changing the order of selections does not change the result ...
    const derivedSameSubstyle = substyle({ style: styleWithDeepNesting }, ['specialToggle', 'toggle'])
    const { style: sameStyle } = derivedSameSubstyle
    expect(sameStyle).to.deep.equal(style)
    const { style: sameLabelStyle } = derivedSameSubstyle({}, 'label')
    expect(sameLabelStyle).to.deep.equal(labelStyle)

    // ... while changing the order in the style definition does
    const styleWithOtherOrder = {
      specialToggle: {
        width: 50,

        label: {
          color: 'red'
        }
      },

      toggle: {
        width: 100,

        label: {
          fontSize: '11pt',
          color: 'blue'
        }
      }
    }
    const derivedOtherStyle = substyle({ style: styleWithOtherOrder }, ['toggle', 'specialToggle'])
    const { style: otherStyle } = derivedOtherStyle
    expect(otherStyle).to.deep.equal({
      width: 100,
    })
    const { style: labelOtherStyle } = derivedOtherStyle({}, 'label')
    expect(labelOtherStyle).to.deep.equal({
      fontSize: '11pt',
      color: 'blue'
    })

  })

  it('should merge element styles nested under modifiers if selectedKeys contain both, element keys and modifier keys', function () {
    const { style } = substyle({ style: myStyle }, ['btn', '&disabled'])
    expect(style).to.deep.equal({ 
      cursor: 'default',
    })
  })

  it('should merge modifier styles for nested elements after the base styles for those elements', function () {
    const myStyle = {
      '&narrow': {
        toggle: {
          width: 50,
        }
      },

      toggle: {
        width: 100,
        color: 'red'
      }
    }
    const { style } = substyle({ style: myStyle }, ['toggle', '&narrow'])
    expect(style).to.deep.equal({
      width: 50,
      color: 'red'
    })
  })

  it('should also pick the inline style sub object under the camelized version of the key', function () {
    const styleWithCamelCaseKey = {
      specialToggle: {
        width: 50
      }
    }

    const { style } = substyle({ style: styleWithCamelCaseKey }, 'special-toggle')
    expect(style).to.deep.equal({
      width: 50
    })
  })

  it('should hoist from multiple levels deep of nested modifier keys in inline styles', () => {
    const myStyle = {
      position: 'absolute',
      '&clickable': {
        cursor: 'pointer',
        '&red': {
          color: 'red',
          '&small': {
            width: 50,
          },
        },
      },
    }
    const { style } = substyle({ style: myStyle }, ['&clickable', '&small', '&red'])
    expect(style).to.include({
      position: 'absolute',
      cursor: 'pointer', // hoisted from first level
      color: 'red', // hoisted from 2 levels deep
      width: 50, // hoisted from 3 levels deep
    })
  })

  it('should make sure that more specific, i.e., deeper nested modifier styles, override styles higher up the object', () => {
    const myStyle = {
      position: 'absolute',
      width: 4,
      '&red': {
        width: 2,
        '&small': {
          width: 1,
        },
      },

      width: 3,
    }
    const { style } = substyle({ style: myStyle }, ['&red', '&small'])
    expect(style).to.have.property('width', 1)
  })

  it('should pass the props (first arg) as an argument to the keys selector function', () => {
    const props = { className: 'foo', otherProp: 'bar' }
    const selectKeys = (...args) => {
      expect(args).to.have.length(1)
      expect(args[0]).to.equal(props)
    }
    substyle(props, selectKeys)
  })

})
