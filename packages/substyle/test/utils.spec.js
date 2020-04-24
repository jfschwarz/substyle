import { isPlainObject, omit, merge } from '../src/utils'

describe('isPlainObject', () => {
  ;[
    { input: {}, expected: true },
    { input: { a: 1 }, expected: true },
    { input: new Object(), expected: true }, // eslint-disable-line no-new-object
    { input: new Object({ a: 1 }), expected: true }, // eslint-disable-line no-new-object
    { input: new Object({}), expected: true }, // eslint-disable-line no-new-object
    { input: 2, expected: false },
    { input: 'Name', expected: false },
    { input: new Date(), expected: false },
  ].forEach((x) => {
    it('should check if input is object', () => {
      expect(isPlainObject(x.input)).toBe(x.expected)
    })
  })
})

describe('omit', () => {
  ;[
    { input: { a: 2 }, keys: undefined, expected: { a: 2 } },
    { input: { a: 2 }, keys: ['a'], expected: {} },
    { input: { a: 2 }, keys: ['b'], expected: { a: 2 } },
    { input: { a: 2, b: 3, c: 4 }, keys: ['a', 'c'], expected: { b: 3 } },
  ].forEach((x) => {
    it('should omit values from input with given keys', () => {
      expect(omit(x.input, x.keys)).toEqual(x.expected)
    })
  })
})

describe('merge', () => {
  ;[
    { input1: { a: 2 }, input2: {}, expected: { a: 2 } },
    { input1: { a: 2 }, input2: { b: 3 }, expected: { a: 2, b: 3 } },
    { input1: {}, input2: { b: 3 }, expected: { b: 3 } },
    { input1: {}, input2: {}, expected: {} },
    { input1: undefined, input2: undefined, expected: {} },
  ].forEach((x) => {
    it('should merge values from input1 + input2', () => {
      expect(merge(x.input1, x.input2)).toEqual(x.expected)
    })
  })
})
