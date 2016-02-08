import { expect } from 'chai'

import substyle from '../src'

describe('substyle', function () {

  const myStyle = {

    toggle: {
      display: 'block',
      width: 50,
    },

    '&active': {
      background: 'blue'
    },

    '&inactive': {
      background: 'white'
    }

  }


  
  it('should derive a BEM compatible classNames for a passed nested element key', function () {
    const { className } = substyle({ className: 'my-class' }, 'toggle')
    expect(className).to.equal('my-class__toggle')
  })

  it('should derive a BEM compatible classNames for a passed modifier key', function () {
    const { className } = substyle({ className: 'my-class' }, '&active')
    expect(className).to.equal('my-class--active')
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

  it('should accept a default inline style object', function () {
    const defaultStyle = {
      toggle: { width: 100 }
    }
    const { style } = substyle({ className: 'my-class' }, 'toggle', defaultStyle)
    expect(style).to.deep.equal({ width: 100 })
  })

  it('should be guaranteed that custom inline styles overwrite default inline styles', function () {
    const defaultStyle = {
      toggle: { width: 100, border: '1px solid black' }
    }
    const { style } = substyle({ style: myStyle }, 'toggle', defaultStyle)
    expect(style).to.deep.equal({ 
      display: 'block',
      width: 50, 
      border: '1px solid black'
    })
  })

  it('should support passing multiple keys in an array', function () {
    const defaultStyle = {
      btn: { cursor: 'pointer' }
    }
    const { style, className } = substyle(
      { style: myStyle, className: 'my-class' }, 
      [ 'toggle', 'btn' ], 
      defaultStyle
    )

    expect(className).to.equal('my-class__toggle my-class__btn')
    expect(style).to.deep.equal({ 
      display: 'block',
      width: 50,
      cursor: 'pointer'
    })
  })

  it('should support passing multiple keys as an object', function () {
    const defaultStyle = {
      '&disabled': { pointerEvents: 'none' }
    }
    const { style, className } = substyle(
      { style: myStyle, className: 'my-class' }, 
      { '&active': true, '&inactive': false, '&disabled': true }, 
      defaultStyle
    )

    expect(className).to.equal('my-class--active my-class--disabled')
    expect(style).to.deep.equal({ 
      background: 'blue',
      pointerEvents: 'none'
    })
  })

  it('should merge nested inline styles', function () {
    const defaultStyleWithDeepNesting = {
      toggle: {
        width: 100,

        label: {
          fontSize: '11pt',
          color: 'blue'
        }
      }
    }
    const customStyleWithDeepNesting = {
      toggle: {
        display: 'block',
        width: 50,

        label: {
          color: 'red'
        }
      }
    }
    const { style } = substyle({ style: customStyleWithDeepNesting }, 'toggle', defaultStyleWithDeepNesting)

    expect(style).to.deep.equal({
      display: 'block',
      width: 50,

      label: {
        fontSize: '11pt',
        color: 'red'
      }
    })
  });

})