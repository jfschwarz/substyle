import { keys } from 'lodash'

const mapKey = key => (key[0] === ':' ? `&${key}` : key)

const mapPseudoSelectors = style =>
  keys(style).reduce(
    (acc, key) => ({
      ...acc,
      [mapKey(key)]: style[key],
    }),
    {}
  )

export default mapPseudoSelectors
