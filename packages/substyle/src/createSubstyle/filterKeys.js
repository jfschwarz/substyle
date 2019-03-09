// @flow

export const isModifier = (key: string): boolean => key[0] === '&'
export const isElement = (key: string): boolean => !isModifier(key)
