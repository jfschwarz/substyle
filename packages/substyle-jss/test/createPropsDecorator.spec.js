import { expect } from 'chai'
import { hash } from 'substyle'

import createPropsDecorator from '../src/createPropsDecorator'

const ruleClass = obj => hash(JSON.stringify(obj)).toString(36)

describe('createPropsDecorator', () => {
  const rules = {}
  const sheetStub = {
    getRule: ruleName => rules[ruleName],
    addRule: ruleName => {
      rules[ruleName] = {
        options: {
          classes: {
            [ruleName]: `${ruleName}`,
          },
        },
      }
      return rules[ruleName]
    },
  }
  const propsDecorator = createPropsDecorator(sheetStub)

  it('should generate class names based on the hash of default inline styles object', () => {
    const first = propsDecorator({ style: { backgroundColor: 'red' } })
    expect(first).to.not.have.property('style')
    expect(first).to.have.property(
      'className',
      ruleClass({ backgroundColor: 'red' })
    )

    const second = propsDecorator({ style: { width: 100 } })
    expect(second).to.not.have.property('style')
    expect(second).to.have.property('className', ruleClass({ width: 100 }))
  })

  it('should preserve classNames passed by the user', () => {
    const result = propsDecorator({
      className: 'foo',
      style: { backgroundColor: 'red' },
    })
    expect(result).to.have.property(
      'className',
      `foo ${ruleClass({ backgroundColor: 'red' })}`
    )
  })

  it('should not add multiple rules for the same style object', () => {
    const first = propsDecorator({ style: { backgroundColor: 'red' } })
    expect(first).to.have.property(
      'className',
      ruleClass({ backgroundColor: 'red' })
    )

    const second = propsDecorator({ style: { backgroundColor: 'red' } })
    expect(second).to.have.property(
      'className',
      ruleClass({ backgroundColor: 'red' })
    ) // same class name as before
  })
})
