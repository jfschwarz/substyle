import createPropsDecorator from '../src/createPropsDecorator'

jest.mock('css-jss', () => ({
  create: () => styles =>
    Buffer.from(JSON.stringify(styles)).toString('base64'),
}))

describe('createPropsDecorator', () => {
  const propsDecorator = createPropsDecorator()

  it('should preserve classNames passed by the user', () => {
    const result = propsDecorator({
      className: 'foo',
      style: { backgroundColor: 'red' },
    })
    expect(result.className.split(' ')).toContain('foo')
  })

  it('should not add multiple rules for the same style object', () => {
    const first = propsDecorator({ style: { backgroundColor: 'red' } })
    const second = propsDecorator({ style: { backgroundColor: 'red' } })
    expect(first.className.length).toBeGreaterThan(0)
    expect(first.className).toBe(second.className)
  })
})
