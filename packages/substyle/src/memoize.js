// @flow
import coerceSelection from './coerceSelection'
import { SubstyleT } from './types'

const calculateHash = (select?: KeysT, defaultStyle?: Object) =>
  [coerceSelection(select), JSON.stringify(defaultStyle)].join()

// based on code by @philogb and @addyosmani (released under an MIT license)
// https://addyosmani.com/blog/faster-javascript-memoization/
const memoize = (substyle: SubstyleT) => (...args) => {
  substyle.memoize = substyle.memoize || {}
  const hash = calculateHash(...args)
  return hash in substyle.memoize
    ? substyle.memoize[hash]
    : (substyle.memoize[hash] = substyle.apply(this, args))
}

export default memoize
