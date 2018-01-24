import { expect } from 'chai'

import createPropsDecorator from '../src/createPropsDecorator'

describe('createPropsDecorator', () => {
  const rules = {}
  let counter
  const sheetStub = {
    getRule: ruleName => rules[ruleName],
    addRule: ruleName => {
      counter += 1
      rules[ruleName] = {
        options: {
          classes: {
            [ruleName]: `${ruleName}-${counter}`,
          },
        },
      }
      return rules[ruleName]
    },
  }
  const propsDecorator = createPropsDecorator(sheetStub)

  beforeEach(() => {
    counter = 0
  })

  it('should generate class names based on the hash of default inline styles object', () => {
    const first = propsDecorator({ style: { backgroundColor: 'red' } })
    expect(first).to.not.have.property('style')
    expect(first).to.have.property('className', '1wtftbl-1')

    const second = propsDecorator({ style: { width: 100 } })
    expect(second).to.not.have.property('style')
    expect(second).to.have.property('className', 'umgnlr-2')
  })

  it('should preserve classNames passed by the user', () => {
    const result = propsDecorator({
      className: 'foo',
      style: { backgroundColor: 'red' },
    })
    expect(result).to.have.property('className', 'foo 1wtftbl-1')
  })

  it('should not add multiple rules for the same style object', () => {
    const first = propsDecorator({ style: { backgroundColor: 'red' } })
    expect(first).to.have.property('className', '1wtftbl-1')

    const second = propsDecorator({ style: { backgroundColor: 'red' } })
    expect(second).to.have.property('className', '1wtftbl-1') // same class name as before
  })
})
