// @flow
import { memoize } from 'lodash'
import coerceSelection from './coerceSelection'

const resolver = (select?: KeysT, defaultStyle?: Object) =>
  [coerceSelection(select), JSON.stringify(defaultStyle)].join()

export default substyle => memoize(substyle, resolver)
