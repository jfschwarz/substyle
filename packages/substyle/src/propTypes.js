// @flow
import PT from 'prop-types'

const StylePT = PT.oneOfType([PT.func, PT.object])

const ClassNamesPT = PT.objectOf(PT.string)

export const PropTypes = {
  style: StylePT,
  className: PT.string,
  classNames: ClassNamesPT,
  innerRef: PT.oneOfType([
    PT.func,
    PT.shape({
      current: typeof Element === 'undefined' ? PT.any : PT.instanceOf(Element),
    }),
  ]),
}
