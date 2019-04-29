import createPropsDecorator from '../src/createPropsDecorator'
import hash from '../src/hash'

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
    expect(first).not.toHaveProperty('style')
    expect(first).toHaveProperty('className', hash({ backgroundColor: 'red' }))

    const second = propsDecorator({ style: { width: 100 } })
    expect(second).not.toHaveProperty('style')
    expect(second).toHaveProperty('className', hash({ width: 100 }))
  })

  it('should preserve classNames passed by the user', () => {
    const result = propsDecorator({
      className: 'foo',
      style: { backgroundColor: 'red' },
    })
    expect(result).toHaveProperty(
      'className',
      `foo ${hash({ backgroundColor: 'red' })}`
    )
  })

  it('should not add multiple rules for the same style object', () => {
    const first = propsDecorator({ style: { backgroundColor: 'red' } })
    expect(first).toHaveProperty('className', hash({ backgroundColor: 'red' }))

    const second = propsDecorator({ style: { backgroundColor: 'red' } })
    expect(second).toHaveProperty('className', hash({ backgroundColor: 'red' })) // same class name as before
  })
})
