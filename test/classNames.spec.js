import { expect } from 'chai'

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

    expect(substyle.className).to.equal('my-container')
    expect(substyle('footer').className).to.equal('my-footer')
    expect(substyle('footer')('button').className).to.equal('my-footer-button')
    expect(substyle('&readOnly').className).to.equal('my-container my-container-readOnly')
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

    expect(substyle.className).to.equal('my-container')
    expect(substyle('footer').className).to.equal('my-footer')
    expect(substyle('footer')('button').className).to.equal('my-footer-button')
    expect(substyle('&readOnly').className).to.equal('my-container my-container-readOnly')
  })

  it('should not set derived class names when a `classNames` prop is present', () => {
    const substyle = createSubstyle({
      className: 'foo',
      classNames: {
      },
    })

    expect(substyle.className).to.not.exist
    expect(substyle('bar').className).to.not.exist
  })

  it('should not set the base className if there is no mapping provided for it', () => {
    const substyle = createSubstyle({
      className: 'mycomp',
      classNames: {
        'mycomp--readOnly': 'read-only-container',
      },
    })

    const { className } = substyle('&readOnly')
    expect(className).to.equal('read-only-container')
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
    expect(className).to.equal('container container-as-readonly container-as-modified')
  })
})
