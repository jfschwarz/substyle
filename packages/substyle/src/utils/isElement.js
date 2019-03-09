// @flow
import isModifier from './isModifier'

const isElement = (key: string): boolean => !isModifier(key)

export default isElement
