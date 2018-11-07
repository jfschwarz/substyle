import createSubstyle from '../src/createSubstyle'

describe('`classNames` mapping', () => {
  it('should use the mapped value from `classNames`', () => {
    const substyle = createSubstyle({
      className: 'foo',
      classNames: {
        foo: 'my-container',
        foo__footer: 'my-footer',
        foo__footer__button: 'my-footer-button',
        'foo--readOnly': 'my-container-readOnly',
      },
    })

    expect(substyle.className).toBe('my-container')
    expect(substyle('footer').className).toBe('my-footer')
    expect(substyle('footer')('button').className).toBe('my-footer-button')
    expect(substyle('&readOnly').className).toBe('my-container my-container-readOnly')
  })

  it('should guess the base class name if no `className` prop is set', () => {
    const substyle = createSubstyle({
      classNames: {
        foo: 'my-container',
        foo__footer: 'my-footer',
        foo__footer__button: 'my-footer-button',
        'foo--readOnly': 'my-container-readOnly',
      },
    })

    expect(substyle.className).toBe('my-container')
    expect(substyle('footer').className).toBe('my-footer')
    expect(substyle('footer')('button').className).toBe('my-footer-button')
    expect(substyle('&readOnly').className).toBe('my-container my-container-readOnly')
  })

  it('should not set derived class names when a `classNames` prop is present', () => {
    const substyle = createSubstyle({
      className: 'foo',
      classNames: {},
    })

    expect(substyle.className).toBeFalsy()
    expect(substyle('bar').className).toBeFalsy()
  })

  it('should not set the base className if there is no mapping provided for it', () => {
    const substyle = createSubstyle({
      className: 'mycomp',
      classNames: {
        'mycomp--readOnly': 'read-only-container',
      },
    })

    const { className } = substyle('&readOnly')
    expect(className).toBe('read-only-container')
  })

  it('should support modifier nesting to customize class names for combinations of modifiers', () => {
    const substyle = createSubstyle({
      className: 'mycomp',
      classNames: {
        mycomp: 'container',
        'mycomp--readOnly': 'container-as-readonly',
        'mycomp--nestedModifier': 'container-as-modified',
      },
    })

    const { className } = substyle(['&readOnly', '&nestedModifier'])
    expect(className).toBe('container container-as-readonly container-as-modified')
  })
})
