import coerceSelection from './coerceSelection'
import type { KeysT, SubstyleT } from './types'

const EMPTY = {}

const memoize = (substyle: SubstyleT): SubstyleT => (
  select: KeysT,
  defaultStyle?: Object
) => {
  const cacheKey = defaultStyle || EMPTY
  substyle.memoize = substyle.memoize || new WeakMap()
  let mapEntry
  if (!substyle.memoize.has(cacheKey)) {
    mapEntry = {}
    substyle.memoize.set(cacheKey, mapEntry)
  } else {
    mapEntry = substyle.memoize.get(cacheKey)
  }
  const selectHash = coerceSelection(select).join(' ')
  return selectHash in mapEntry
    ? mapEntry[selectHash]
    : (mapEntry[selectHash] = substyle(select || [], defaultStyle))
}

export default memoize
