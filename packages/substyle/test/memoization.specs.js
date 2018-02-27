import { expect } from 'chai'

import { createSubstyle } from '../src'

describe('memoization', () => {
  it('should return the very same result for two calls with same modifiers', () => {
    const substyle = createSubstyle({})

    // equal as in ===, no deep equal!
    expect(substyle('foo')).to.equal(substyle('foo'))
    expect(substyle('foo')).to.equal(substyle(['foo']))
    expect(substyle('foo')).to.equal(substyle({ foo: true }))
  })

  it('should return the very same result for two calls with same modifiers and identic default styles', () => {
    const substyle = createSubstyle({})
    const defaultStyle = {}
    expect(substyle('foo', defaultStyle)).to.equal(
      substyle('foo', defaultStyle)
    )
  })

  it('should keep memoizing through chained substyle calls', () => {
    const substyle = createSubstyle({})
    expect(substyle('foo')('bar')).to.equal(substyle('foo')('bar'))
  })
})
