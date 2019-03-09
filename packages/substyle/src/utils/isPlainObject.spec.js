import isPlainObject from './isPlainObject'

describe('isPlainObject', () => {
  it.each([
    [true, {}],
    [true, { a: 1 }],
    // eslint-disable-next-line no-new-object
    [true, new Object()],
    // eslint-disable-next-line no-new-object
    [true, new Object({})],
    // eslint-disable-next-line no-new-object
    [true, new Object({ a: 1 })],
    [false, 2],
    [false, 'Name'],
    [false, new Date()],
  ])('should return %s for %j ', (expected, input) => {
    expect(isPlainObject(input)).toBe(expected)
  })
})
