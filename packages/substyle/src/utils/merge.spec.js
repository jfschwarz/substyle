import merge from './merge'

describe('merge', () => {
  it.each([
    [{ a: 2 }, {}, { a: 2 }],
    [{ a: 2 }, { b: 3 }, { a: 2, b: 3 }],
    [{}, { b: 3 }, { b: 3 }],
    [{}, {}, {}],
    [undefined, undefined, {}],
  ])('should merge %j and %j to %j', (input1, input2, expected) => {
    expect(merge(input1, input2)).toEqual(expected)
  })
})
