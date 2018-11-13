import createSubstyle from '../src/createSubstyle'

describe('`className` management', () => {
  it('should derive a BEM compliant className for a passed nested element key', () => {
    const substyle = createSubstyle({ className: 'my-class' })
    const { className } = substyle('toggle')
    expect(className).toBe('my-class__toggle')
  })

  it('should derive a BEM compliant className for a passed modifier key', () => {
    const substyle = createSubstyle({ className: 'my-class' })
    const { className } = substyle('&active')
    expect(className).toBe('my-class my-class--active')
  })

  it('should derive not include modifiers of parents elements in nested class names', () => {
    const substyle = createSubstyle({ className: 'my-class' })
    const { className } = substyle('&active')('nested')
    expect(className).toBe('my-class__nested')
  })

  it('should not return a className when no className has been set in the props', () => {
    const substyle = createSubstyle({})
    const props = substyle('toggle')
    expect(props).not.toHaveProperty('className')
  })

  it('should not generate additional class names for modifiers if selectedKeys contain element keys', () => {
    const substyle = createSubstyle({ className: 'my-class' })
    const { className } = substyle(['btn', '&disabled'])
    expect(className).toBe('my-class__btn')
  })

  it('should return the original className when selectedKeys is not specified or empty', () => {
    const substyle = createSubstyle({ className: 'my-class' })
    const { className } = substyle
    expect(className).toBe('my-class')

    const { className: sameClassName } = substyle({ '@active': false })
    expect(sameClassName).toBe('my-class')

    const { className: againTheSameClassName } = substyle([])
    expect(againTheSameClassName).toBe('my-class')

    const { className: stillTheSameClassName } = substyle()
    expect(stillTheSameClassName).toBe('my-class')
  })

  it('should correctly merge modifiers with existing classNames', () => {
    const substyle = createSubstyle({ className: 'foo foo--bar' })
    const { className } = substyle('&baz')
    expect(className).toBe('foo foo--bar foo--baz')
  })
})
