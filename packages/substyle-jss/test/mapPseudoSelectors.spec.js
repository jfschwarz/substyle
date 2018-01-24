import { expect } from 'chai'

import mapPseudoSelectors from '../src/mapPseudoSelectors'

describe('mapPseudoSelectors', () => {
  it('should prepend `&` chars to pseudo selector keys', () => {
    expect(
      mapPseudoSelectors({
        color: 'red',
        ':hover': {
          color: 'blue',
        },
        ':focus': {
          color: 'green',
        },
      })
    ).to.deep.equal({
      color: 'red',
      '&:hover': {
        color: 'blue',
      },
      '&:focus': {
        color: 'green',
      },
    })
  })
})
