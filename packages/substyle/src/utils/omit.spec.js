import omit from './omit'

describe('omit', () => {
  it.each([
    [{ a: 2 }, undefined, { a: 2 }],
    [{}, ['a'], { a: 2 }],
    [{ a: 2 }, ['b'], { a: 2 }],
    [{ b: 3 }, ['a', 'c'], { a: 2, b: 3, c: 4 }],
  ])('should return %j when %s is omitted from %j', (expected, keys, input) => {
    expect(omit(input, keys)).toEqual(expected)
  })
})
