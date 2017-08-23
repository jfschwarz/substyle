// @flow
import { pickDirectStyles } from './pickStyles'

// many css-in-js libs process keyframes objects as the value for `animationName`
const defaultObjectPropsWhitelist = ['animationName']

const defaultPropsDecorator = ({ style, className }: { style?: Object, className?: string }) => ({
  ...(style ?
    { style: pickDirectStyles(style, defaultObjectPropsWhitelist) } :
    {}
  ),
  ...(className ? { className } : {}),
})

export default defaultPropsDecorator
