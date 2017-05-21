// @flow
import negate from 'lodash/negate'

export const isModifier = (key: string) => key[0] === '&'
export const isElement = negate(isModifier)
