import merge from 'lodash/merge'
import substyle from './substyle'

export default function defaultStyle(...defaultStyles) {
  return ({ style, className }, selectedKeys) => (
    substyle({
      style: merge({}, ...defaultStyles, style),
      className
    }, selectedKeys)
  )
}