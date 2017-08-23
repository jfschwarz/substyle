import { expect } from 'chai'

import {
  decorateAsDataAttributes,
  decorateAsClasses,
} from '../src/propsDecorators'

describe('decorateAsDataAttributes', () => {
  it('should generate some data-* attribute', () => {
    const result = decorateAsDataAttributes({ style: { width: 50 } })
    expect(result).to.not.have.property('style')
    expect(result).to.have.property('data-css-rfq0ee')
  })

  it('should keep className props unchanged', () => {
    const result = decorateAsDataAttributes({
      style: { width: 50 },
      className: 'foo bar',
    })
    expect(result).to.have.property('className', 'foo bar')
  })
})

describe('decorateAsClasses', () => {
  it('should generate some data-* attribute', () => {
    const result = decorateAsClasses({ style: { width: 50 } })
    expect(result).to.not.have.property('style')
    expect(result).to.have.property('className', 'css-rfq0ee')
  })

  it('should merge generated className with passed className prop', () => {
    const result = decorateAsClasses({
      style: { width: 50 },
      className: 'foo bar',
    })
    expect(result).to.have.property('className', 'foo bar css-rfq0ee')
  })
})
