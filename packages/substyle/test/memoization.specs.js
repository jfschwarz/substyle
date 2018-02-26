import { expect } from 'chai'

import createSubstyle from '../src/createSubstyle'

describe('memoization', () => {
  it('should not return the very same result for two calls with same modifiers', () => {
    const substyle = createSubstyle({})
    expect(substyle('foo')).to.equal(substyle('foo')) // equal as in ===, no deep equal!
  })
})
