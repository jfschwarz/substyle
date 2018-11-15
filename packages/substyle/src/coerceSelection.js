// @flow
import { keys } from './utils'
import type { KeysT } from './types'

const coerceSelection = (select?: KeysT): Array<string> => {
  if (!select) {
    return []
  } else if (typeof select === 'string') {
    return [select]
  } else if (!Array.isArray(select)) {
    const objSelect: { [string]: boolean } = select // workaround for https://github.com/facebook/flow/issues/5781
    return keys(select).reduce(
      (acc, key: string) => acc.concat(objSelect[key] ? [key] : []),
      []
    )
  }
  return select
}

export default coerceSelection
