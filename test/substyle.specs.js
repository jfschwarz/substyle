import { expect } from 'chai'

import substyle, { defaultStyle } from '../src'

const myStyle = {

  width: '100%',

  ':hover': {
    background: 'silver',
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

  it('should derive a BEM compliant className for a passed nested element key', function () {
    const { className } = substyle({ className: 'my-class' }, 'toggle')
    expect(className).to.equal('my-class__toggle')
  })

  it('should derive a BEM compliant className for a passed modifier key', function () {
    const { className } = substyle({ className: 'my-class' }, '&active')
    expect(className).to.equal('my-class my-class--active')
  })

  it('should should select the nested inline styles for the given key', function () {
    const { style } = substyle({ style: myStyle }, 'toggle')
    expect(style).to.deep.equal({
      display: 'block',
      width: 50
    })
  })

  it('should not return a className when no className has been set in the props', function () {
    const props = substyle({ style: myStyle }, 'toggle')
    expect(props).to.not.have.property('className')
  })

  it('should not return a style when no style has been set in the props', function () {
    const props = substyle({ className: 'my-class' }, 'toggle')
    expect(props).to.not.have.property('style')
  })


  it('should include all direct style definitions if only modifier keys are used, hoisting those for the active modifiers', function () {
    const { style } = substyle({ style: myStyle }, '&active')
    expect(style).to.deep.equal({ 
      ...myStyle,
      background: 'blue' // hoisted from &active
    })
  })

  it('should merge element styles nested under modifiers if selectedKeys contain both, element keys and modifier keys', function () {
    const { style } = substyle({ style: myStyle }, ['btn', '&disabled'])
    expect(style).to.deep.equal({ 
      cursor: 'default',
    })
  })

  it('should not generate additional class names for modifiers if selectedKeys contain element keys', function () {
    const { className } = substyle({ className: 'my-class' }, ['btn', '&disabled'])
    expect(className).to.equal('my-class__btn')
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
    const { style, className } = substyle(
      { style: myStyle, className: 'my-class' }, 
      { '&active': true, '&inactive': false, '&disabled': true }
    )

    expect(className).to.equal('my-class my-class--active my-class--disabled')
    expect(style).to.deep.equal({ 
      ...myStyle,

      background: 'blue',    // hoisted from &active
      pointerEvents: 'none', // hoisted from &disabled
      btn: {                 
        cursor: 'default',   // overriden btn styles hoisted from &disabled
      },
    })
  })

  it('should return the original className when selectedKeys is not specified or empty', function () {
    const { className } = substyle({ className: 'my-class' })
    expect(className).to.equal('my-class')

    const { className: sameClassName } = substyle({ className: 'my-class' }, { '@active': false })
    expect(sameClassName).to.equal('my-class')

    const { className: stillTheSameClassName } = substyle({ className: 'my-class' }, undefined)
    expect(stillTheSameClassName).to.equal('my-class')
  })

  it('should return the top-level inline style definitions when selectedKeys is not specified', function () {
    const { style } = substyle({ style: myStyle })
    expect(style).to.have.property('width', '100%')
  })

  it('should include nested inline style definitions for pseudo-class selectors when selectedKeys is not specified', function () {
    const { style } = substyle({ style: myStyle })
    expect(style).to.have.property(':hover')
    expect(style[':hover']).to.deep.equal({
      background: 'silver'
    })
  })

  it('should include nested inline style definitions for media queries when selectedKeys is not specified', function () {
    const styleWithMedia = {
      background: 'white',
      '@media (min-width: 320px)': {
        width: '100%'
      }
    }
    const { style } = substyle({ style: styleWithMedia })
    expect(style).to.have.property('@media (min-width: 320px)')
  })

  // TODO: rethink this! is it better maybe to merge in appearance order?
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

    const { style } = substyle({ style: styleWithDeepNesting }, ['toggle', 'specialToggle'])
    expect(style).to.deep.equal({
      width: 50,

      label: {
        fontSize: '11pt',
        color: 'red'
      }
    })
    const { style: sameStyle } = substyle({ style: styleWithDeepNesting }, ['specialToggle', 'toggle'])
    expect(sameStyle).to.deep.equal(style)

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
    const { style: otherStyle } = substyle({ style: styleWithOtherOrder }, ['toggle', 'specialToggle'])
    expect(otherStyle).to.deep.equal({
      width: 100,

      label: {
        fontSize: '11pt',
        color: 'blue'
      }
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

  it('should correctly merge modifiers with existing classNames', function () {
    const { className } = substyle({ className: 'foo foo--bar' }, '&baz')
    expect(className).to.equal('foo foo--bar foo--baz')
  })

  it('should select the style definitions for all modifiers if container elements introduce nested substyle calls', function () {
    const myStyle = {
      position: 'absolute',
      '&outer': {
        cursor: 'pointer',
      },
      '&inner': {
        color: 'red' 
      }
    }
    const { style } = substyle(substyle({ style: myStyle }, '&outer'), '&inner')
    expect(style).to.deep.equal({
      position: 'absolute',
      cursor: 'pointer',
      color: 'red',
      '&outer': {
        cursor: 'pointer',
      },
      '&inner': {
        color: 'red' 
      }
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
    const { style } = substyle({ style: myStyle }, ['&clickable', '&red', '&small'])
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

})
