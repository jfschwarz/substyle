// @flow
import type { DecoratorFuncT } from '../types'
import pickDirectStyles from './pickDirectStyles'

// many css-in-js libs process keyframes objects as the value for `animationName`
const defaultObjectPropsWhitelist = ['animationName']

const defaultPropsDecorator: DecoratorFuncT = ({ style, className }) => ({
  ...(style
    ? { style: pickDirectStyles(style, defaultObjectPropsWhitelist) }
    : {}),
  ...(className ? { className } : {}),
})

export default defaultPropsDecorator
