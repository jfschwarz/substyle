// @flow

export const isModifier = (key: string) => key[0] === '&'
export const isElement = (key: string) => !isModifier(key)
