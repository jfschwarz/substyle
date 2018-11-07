import {
  decorateAsDataAttributes,
  decorateAsClasses,
} from '../src/propsDecorators'

describe('decorateAsDataAttributes', () => {
  it('should generate some data-* attribute', () => {
    const result = decorateAsDataAttributes({ style: { width: 50 } })
    expect(result).not.toHaveProperty('style')
    expect(result).toHaveProperty('data-css-rfq0ee')
  })

  it('should keep className props unchanged', () => {
    const result = decorateAsDataAttributes({
      style: { width: 50 },
      className: 'foo bar',
    })
    expect(result).toHaveProperty('className', 'foo bar')
  })

  it('should pick only direct styles', () => {
    const result = decorateAsDataAttributes({
      style: {
        width: 50,

        nested: {
          color: 'red',
        },
      },
    })
    const sameResult = decorateAsDataAttributes({ style: { width: 50 } })
    expect(result).not.toHaveProperty('style')
    expect(result).toEqual(sameResult)
  })
})

describe('decorateAsClasses', () => {
  it('should generate some data-* attribute', () => {
    const result = decorateAsClasses({ style: { width: 50 } })
    expect(result).not.toHaveProperty('style')
    expect(result).toHaveProperty('className', 'css-rfq0ee')
  })

  it('should merge generated className with passed className prop', () => {
    const result = decorateAsClasses({
      style: { width: 50 },
      className: 'foo bar',
    })
    expect(result).toHaveProperty('className', 'foo bar css-rfq0ee')
  })
})
