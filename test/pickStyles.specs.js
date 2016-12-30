import { expect } from 'chai'
import { hoistModifierStylesRecursive } from '../src/pickStyles'

describe('hoistModifierStylesRecursive', () => {
  it('should hoist styles from modifiers even if those are nested under unselected modifer keys', () => {
    const myStyle = {
      '&unselected': {
        '&selected': {
          top: 1,
        },
      },
    }

    const result = hoistModifierStylesRecursive(myStyle, ['&selected'])
    expect(result).to.deep.equal({
      '&unselected': {
        top: 1,
      },
    })
  })

  it('should omit nested style definitions that are hoisted but keep the nesting of unselected modifiers', () => {
    const myStyle = {
      position: 'absolute',
      '&selected': {
        cursor: 'pointer',
      },
      '&unselected': {
        color: 'red',
      },
    }
    const result = hoistModifierStylesRecursive(myStyle, ['&selected'])
    expect(result).to.deep.equal({
      position: 'absolute',
      cursor: 'pointer',
      '&unselected': {
        color: 'red',
      },
    })
  })
})
