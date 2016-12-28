// @flow
import { pickDirectStyles } from './pickStyles'

const defaultPropsDecorator = ({ style, className }: { style?: Object, className?: string }) => ({
  ...(style ?
    { style: pickDirectStyles(style) } :
    {}
  ),
  ...(className ? { className } : {}),
})

export default defaultPropsDecorator
