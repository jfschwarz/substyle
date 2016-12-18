import { expect } from 'chai'

import createSubstyle from '../src/createSubstyle'

describe('`classNames` mapping', () => {

  it('should use the mapped class name when selecting a nested element', () => {
    const substyle = createSubstyle({
      className: 'container',
      classNames: {
        footer: {
          className: 'my-footer',
        },
      },
    })

    const { className } = substyle('footer')
    expect(className).to.equal('my-footer')
  })

  it('should support a shortcut notation for elements with no further children', () => {
    const substyle = createSubstyle({
      className: 'container',
      classNames: {
        footer: 'my-footer', // same as: { className: 'my-footer' }
      },
    })

    const { className } = substyle('footer')
    expect(className).to.equal('my-footer')
  })

  it('should use the mapped modifier class name in addition to the base className', () => {
    const substyle = createSubstyle({
      className: 'container',
      classNames: {
        '&readOnly': {
          className: 'read-only-container',
        },
      },
    })

    const { className } = substyle('&readOnly')
    expect(className).to.equal('container read-only-container')
  })

  it('should support modifier nesting to customize class names for combinations of modifiers', () => {
    const substyle = createSubstyle({
      className: 'container',
      classNames: {
        '&readOnly': {
          '&nestedModifier': 'container-as-modified-readonly',
        },
      },
    })

    const { className } = substyle(['&readOnly', '&nestedModifier'])
    expect(className).to.equal('container container-as-modified-readonly')
  })

})
