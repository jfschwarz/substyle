import { createSubstyle } from '../src'

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
