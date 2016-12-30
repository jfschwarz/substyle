// @flow
import { negate } from 'lodash'

export const isModifier = (key: string) => key[0] === '&'
export const isElement = negate(isModifier)
