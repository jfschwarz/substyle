// @flow
import { memoize } from 'lodash'
import coerceSelection from './coerceSelection'
import hash from './hash'

const resolver = (select?: KeysT, defaultStyle?: Object) =>
  hash([coerceSelection(select), JSON.stringify(defaultStyle)].join()).toString(
    36
  )

export default substyle => memoize(substyle, resolver)
