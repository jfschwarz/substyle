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
    ).toEqual({
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
