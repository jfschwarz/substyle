import mapValues from 'lodash/mapValues'
import isPlainObject from 'lodash/isPlainObject'

export const stripToStrings = (obj) => mapValues(obj, val => {
  if(isPlainObject(val)) {
    const { toString, ...rest } = val
    return rest;
  }
  return val;
})