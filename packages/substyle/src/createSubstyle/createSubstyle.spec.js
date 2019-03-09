import createSubstyle from './createSubstyle'

describe('createSubstyle', () => {
  describe('chaining', () => {
    it('should support chaining calls to selected deeper nested styles', () => {
      const substyle = createSubstyle({
        style: {
          first: {
            color: 'red',
            second: {
              cursor: 'pointer',
            },
          },
        },
      })

      const { style } = substyle('first')('second')
      expect(style).toEqual({
        cursor: 'pointer',
      })
    })

    it('should select the style definitions for all modifiers substyle calls', () => {
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
      expect(style).toEqual({
        position: 'absolute',
        cursor: 'pointer',
        color: 'red',
      })

      const { style: sameStyle } = substyle(['&outer', '&inner'])
      expect(sameStyle).toEqual(style)
    })
  })

  describe('`className` management', () => {
    it('should derive a BEM compliant className for a passed nested element key', () => {
      const substyle = createSubstyle({ className: 'my-class' })
      const { className } = substyle('toggle')
      expect(className).toEqual('my-class__toggle')
    })

    it('should derive a BEM compliant className for a passed modifier key', () => {
      const substyle = createSubstyle({ className: 'my-class' })
      const { className } = substyle('&active')
      expect(className).toEqual('my-class my-class--active')
    })

    it('should derive not include modifiers of parents elements in nested class names', () => {
      const substyle = createSubstyle({ className: 'my-class' })
      const { className } = substyle('&active')('nested')
      expect(className).toEqual('my-class__nested')
    })

    it('should not return a className when no className has been set in the props', () => {
      const substyle = createSubstyle({})
      const props = substyle('toggle')
      expect(props).not.toHaveProperty('className')
    })

    it('should not generate additional class names for modifiers if selectedKeys contain element keys', () => {
      const substyle = createSubstyle({ className: 'my-class' })
      const { className } = substyle(['btn', '&disabled'])
      expect(className).toEqual('my-class__btn')
    })

    it('should return the original className when selectedKeys is not specified or empty', () => {
      const substyle = createSubstyle({ className: 'my-class' })
      const { className } = substyle
      expect(className).toEqual('my-class')

      const { className: sameClassName } = substyle({ '@active': false })
      expect(sameClassName).toEqual('my-class')

      const { className: againTheSameClassName } = substyle([])
      expect(againTheSameClassName).toEqual('my-class')

      const { className: stillTheSameClassName } = substyle()
      expect(stillTheSameClassName).toEqual('my-class')
    })

    it('should correctly merge modifiers with existing classNames', () => {
      const substyle = createSubstyle({ className: 'foo foo--bar' })
      const { className } = substyle('&baz')
      expect(className).toEqual('foo foo--bar foo--baz')
    })
  })

  describe('`classNames` mapping', () => {
    it('should use the mapped value from `classNames`', () => {
      const substyle = createSubstyle({
        className: 'foo',
        classNames: {
          foo: 'my-container',
          foo__footer: 'my-footer',
          foo__footer__button: 'my-footer-button',
          'foo--readOnly': 'my-container-readOnly',
        },
      })

      expect(substyle.className).toEqual('my-container')
      expect(substyle('footer').className).toEqual('my-footer')
      expect(substyle('footer')('button').className).toEqual('my-footer-button')
      expect(substyle('&readOnly').className).toEqual(
        'my-container my-container-readOnly'
      )
    })

    it('should guess the base class name if no `className` prop is set', () => {
      const substyle = createSubstyle({
        classNames: {
          foo: 'my-container',
          foo__footer: 'my-footer',
          foo__footer__button: 'my-footer-button',
          'foo--readOnly': 'my-container-readOnly',
        },
      })

      expect(substyle.className).toEqual('my-container')
      expect(substyle('footer').className).toEqual('my-footer')
      expect(substyle('footer')('button').className).toEqual('my-footer-button')
      expect(substyle('&readOnly').className).toEqual(
        'my-container my-container-readOnly'
      )
    })

    it('should not set derived class names when a `classNames` prop is present', () => {
      const substyle = createSubstyle({
        className: 'foo',
        classNames: {},
      })

      expect(substyle.className).not.toBeDefined()
      expect(substyle('bar').className).not.toBeDefined()
    })

    it('should not set the base className if there is no mapping provided for it', () => {
      const substyle = createSubstyle({
        className: 'mycomp',
        classNames: {
          'mycomp--readOnly': 'read-only-container',
        },
      })

      const { className } = substyle('&readOnly')
      expect(className).toEqual('read-only-container')
    })

    it('should support modifier nesting to customize class names for combinations of modifiers', () => {
      const substyle = createSubstyle({
        className: 'mycomp',
        classNames: {
          mycomp: 'container',
          'mycomp--readOnly': 'container-as-readonly',
          'mycomp--nestedModifier': 'container-as-modified',
        },
      })

      const { className } = substyle(['&readOnly', '&nestedModifier'])
      expect(className).toEqual(
        'container container-as-readonly container-as-modified'
      )
    })
  })

  describe('memoization', () => {
    it('should return the very same result for two calls with same modifiers', () => {
      const substyle = createSubstyle({})

      // equal as in ===, no deep equal!
      expect(substyle('foo')).toBe(substyle('foo'))
      expect(substyle('foo')).toBe(substyle(['foo']))
      expect(substyle('foo')).toBe(substyle({ foo: true }))
    })

    it('should return the very same result for two calls with same modifiers and identic default styles', () => {
      const substyle = createSubstyle({})
      const defaultStyle = {}
      expect(substyle('foo', defaultStyle)).toBe(substyle('foo', defaultStyle))
    })

    it('should keep memoizing through chained substyle calls', () => {
      const substyle = createSubstyle({})
      expect(substyle('foo')('bar')).toBe(substyle('foo')('bar'))
    })
  })

  describe('substyle', () => {
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

    it('should should select the nested inline styles for the given key', () => {
      const substyle = createSubstyle({ style: myStyle })
      const { style } = substyle('toggle')
      expect(style).toEqual({
        display: 'block',
        width: 50,
      })
    })

    it('should not return a style when no style has been set in the props', () => {
      const substyle = createSubstyle({})
      const props = { ...substyle('toggle') }
      expect(props).not.toHaveProperty('style')
    })

    it('should hoist style definitions for the active modifiers', () => {
      const substyle = createSubstyle({ style: myStyle })
      const { style } = substyle('&active')
      expect(style).toHaveProperty('background', 'blue') // hoisted from &active
    })

    it('should not hoist modifier styles inside of element sub styles', () => {
      const substyle = createSubstyle({
        style: {
          myel: {
            color: 'blue',
            '&mymod': {
              color: 'red',
            },
          },
        },
      })
      const { style } = substyle(['myel', '&mymod'])
      expect(style).toEqual({
        color: 'blue',
      })
    })

    it('should support passing multiple keys in an array', () => {
      const substyle = createSubstyle({
        style: myStyle,
        className: 'my-class',
      })
      const { style, className } = substyle(['toggle', 'btn'])

      expect(className).toEqual('my-class__toggle my-class__btn')
      expect(style).toEqual({
        display: 'block',
        width: 50,
        cursor: 'pointer',
      })
    })

    it('should support passing multiple keys as an object', () => {
      const substyle = createSubstyle({ style: myStyle, className: 'my-class' })
      const subsubstyle = substyle({
        '&active': true,
        '&inactive': false,
        '&disabled': true,
      })
      const { style, className } = subsubstyle

      expect(className).toEqual('my-class my-class--active my-class--disabled')
      expect(style).toEqual({
        width: '100%',

        ':hover': {
          background: 'silver',
        },

        '@media (min-width: 600px)': {
          width: '50%',
        },

        background: 'blue', // hoisted from &active
        pointerEvents: 'none', // hoisted from &disabled
      })

      const { style: btnStyle } = subsubstyle('btn')
      expect(btnStyle).toEqual({
        cursor: 'default', // overridden btn styles hoisted from &disabled
      })
    })

    it('should return the top-level inline style definitions if selectedKeys is not specified', () => {
      const substyle = createSubstyle({ style: myStyle })
      const { style } = substyle
      expect(style).toHaveProperty('width', '100%')
    })

    it('should include nested inline style definitions for pseudo-class selectors', () => {
      const substyle = createSubstyle({ style: myStyle })
      const { style } = substyle
      expect(style).toHaveProperty(':hover')
      expect(style[':hover']).toEqual({
        background: 'silver',
      })
    })

    it('should include nested inline style definitions for media queries', () => {
      const substyle = createSubstyle({
        style: {
          background: 'white',
          '@media (min-width: 320px)': {
            width: '100%',
          },
        },
      })
      const { style } = substyle
      expect(style).toHaveProperty('@media (min-width: 320px)')
    })

    it('should include keyframe objects assigned to `animationName` property', () => {
      const keyframes = {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      }
      const substyle = createSubstyle({
        style: {
          animationName: keyframes,
        },
      })
      const { style } = substyle
      expect(style).toHaveProperty('animationName')
      expect(style.animationName).toBe(keyframes)
    })

    it('should merge nested inline styles in the order of appearance in the object', () => {
      const styleWithDeepNesting = {
        toggle: {
          width: 100,

          label: {
            fontSize: '11pt',
            color: 'blue',
          },
        },

        specialToggle: {
          width: 50,

          label: {
            color: 'red',
          },
        },
      }

      const substyle = createSubstyle({ style: styleWithDeepNesting })
      const subsubstyle = substyle(['toggle', 'specialToggle'])
      const { style } = subsubstyle
      expect(style).toEqual({
        width: 50,
      })
      const { style: labelStyle } = subsubstyle('label')
      expect(labelStyle).toEqual({
        fontSize: '11pt',
        color: 'red',
      })

      // changing the order of selections does not change the result ...
      const sameSubstyle = createSubstyle({ style: styleWithDeepNesting })
      const sameSubsubstyle = sameSubstyle(['specialToggle', 'toggle'])
      const { style: sameStyle } = sameSubsubstyle
      expect(sameStyle).toEqual(style)
      const { style: sameLabelStyle } = sameSubsubstyle('label')
      expect(sameLabelStyle).toEqual(labelStyle)

      // ... while changing the order in the style definition does
      const styleWithOtherOrder = {
        specialToggle: {
          width: 50,

          label: {
            color: 'red',
          },
        },

        toggle: {
          width: 100,

          label: {
            fontSize: '11pt',
            color: 'blue',
          },
        },
      }

      const otherSubstyle = createSubstyle({ style: styleWithOtherOrder })
      const otherSubsubstyle = otherSubstyle(['toggle', 'specialToggle'])
      const { style: otherStyle } = otherSubsubstyle
      expect(otherStyle).toEqual({
        width: 100,
      })
      const { style: labelOtherStyle } = otherSubsubstyle('label')
      expect(labelOtherStyle).toEqual({
        fontSize: '11pt',
        color: 'blue',
      })
    })

    it('should merge element styles nested under modifiers if selectedKeys contain both, element keys and modifier keys', () => {
      const substyle = createSubstyle({ style: myStyle })
      const { style } = substyle(['btn', '&disabled'])
      expect(style).toEqual({
        cursor: 'default',
      })
    })

    it('should merge modifier styles for nested elements after the base styles for those elements', () => {
      const substyle = createSubstyle({
        style: {
          '&narrow': {
            toggle: {
              width: 50,
            },
          },

          toggle: {
            width: 100,
            color: 'red',
          },
        },
      })
      const { style } = substyle(['toggle', '&narrow'])
      expect(style).toEqual({
        width: 50,
        color: 'red',
      })
    })

    it('should also pick the inline style sub object under the camelized version of the key', () => {
      const styleWithCamelCaseKey = {
        specialToggle: {
          width: 50,
        },
      }

      const substyle = createSubstyle({ style: styleWithCamelCaseKey })
      const { style } = substyle('special-toggle')
      expect(style).toEqual({
        width: 50,
      })
    })

    it('should correctly merge nested style definitions when selecting multiple modifiers', () => {
      const substyle = createSubstyle({
        style: {
          '&small': {
            height: 10,
          },

          '&top': {
            top: 0,

            '&small': {
              color: 'red',
            },
          },
        },
      })

      const { style } = substyle(['&small', '&top'])

      expect(style).toHaveProperty('height', 10)
      expect(style).toHaveProperty('top', 0)
      expect(style).toHaveProperty('color', 'red')

      // reverse modifiers order
      const { style: sameStyle } = substyle(['&top', '&small'])

      expect(sameStyle).toHaveProperty('height', 10)
      expect(sameStyle).toHaveProperty('top', 0)
      expect(sameStyle).toHaveProperty('color', 'red')
    })

    it('should hoist from multiple levels deep of nested modifier keys in inline styles', () => {
      const substyle = createSubstyle({
        style: {
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
        },
      })
      const { style } = substyle(['&clickable', '&small', '&red'])
      expect(style).toMatchObject({
        position: 'absolute',
        cursor: 'pointer', // hoisted from first level
        color: 'red', // hoisted from 2 levels deep
        width: 50, // hoisted from 3 levels deep
      })
    })

    it('should merge more deeply nested style definitions with higher precedence', () => {
      const substyle = createSubstyle({
        style: {
          '&top': {
            top: 10,

            '&small': {
              top: 1,
            },
          },

          '&small': {
            top: 5,
          },
        },
      })
      const { style } = substyle(['&small', '&top'])

      expect(style).toHaveProperty('top', 1)
    })

    it('should make sure that more specific, i.e., deeper nested modifier styles, override styles higher up the object', () => {
      const substyle = createSubstyle({
        style: {
          position: 'absolute',
          '&red': {
            width: 2,
            '&small': {
              width: 1,
            },
          },

          width: 3,
        },
      })
      const { style } = substyle(['&red', '&small'])
      expect(style).toHaveProperty('width', 1)
    })

    it('should take default styles as second arg to merge the style prop with', () => {
      const defaultStyle = {
        width: 50,
        nested: { height: 10, width: 10 },
      }

      const substyle = createSubstyle({
        style: { height: 50, nested: { width: 20 } },
      })
      const substyleWithDefaultStyle = substyle(undefined, defaultStyle)
      expect({ ...substyleWithDefaultStyle }).toEqual({
        style: { height: 50, width: 50 },
      })
      expect({ ...substyleWithDefaultStyle('nested') }).toEqual({
        style: { height: 10, width: 20 },
      })
    })

    it('should take a props decorator function as second arg of the constructor call and apply it on spread props', () => {
      const myDecorator = jest.fn(props => ({ mapped: 'foobar' }))
      const substyle = createSubstyle(
        {
          style: {
            height: 50,

            header: {
              width: 100,
            },
          },
          className: 'foo',
        },
        myDecorator
      )
      expect(myDecorator.calledOnce).toBeTruthy()
      expect(
        myDecorator.calledWithMatch({
          style: {
            height: 50,
            header: {
              width: 100,
            },
          },
          className: 'foo',
        })
      ).toBeTruthy()
      expect({ ...substyle }).toEqual({ mapped: 'foobar' })

      const subsubstyle = substyle('header')
      expect(myDecorator.calledTwice).toBeTruthy()
      expect(
        myDecorator.calledWithMatch({
          style: { width: 100 },
          className: 'foo__header',
        })
      ).toBeTruthy()
      expect({ ...subsubstyle }).toEqual({ mapped: 'foobar' })
    })
  })
})
