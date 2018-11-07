import createSubstyle from '../src/createSubstyle'

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
