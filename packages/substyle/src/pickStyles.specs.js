import { hoistModifierStylesRecursive } from './pickStyles'

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
    expect(result).toEqual({
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
    expect(result).toEqual({
      position: 'absolute',
      cursor: 'pointer',
      '&unselected': {
        color: 'red',
      },
    })
  })

  it('should never mutate nested style objects but create copies when merging', () => {
    const nested1 = { n1: true }
    const nested2 = { n2: true }
    const nested3 = { n3: true }
    const myStyle = {
      nested: nested1,
      '&selected': {
        nested: nested2,
      },
      '&unselected': {
        nested: nested3,
      },
    }
    const result = hoistModifierStylesRecursive(myStyle, ['&selected'])
    expect(result.nested).not.toEqual(nested1)
    expect(result.nested).not.toEqual(nested2)
    expect(result.nested).not.toEqual(nested3)
  })
})
