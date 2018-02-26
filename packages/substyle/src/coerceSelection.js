// @flow
import { keys, isPlainObject, isString } from 'lodash'
import type { KeysT } from './types'

const coerceSelection = (select?: KeysT) => {
  if (!select) {
    return []
  } else if (isString(select)) {
    return [select]
  } else if (isPlainObject(select)) {
    return keys(select).reduce(
      (acc: Array<string>, key: string) => acc.concat(select[key] ? [key] : []),
      []
    )
  }
  return select
}

export default coerceSelection
