import { expect } from 'chai'

import substyle from '../src'

describe('`className` management', () => {

  it('should derive a BEM compliant className for a passed nested element key', function () {
    const { className } = substyle({ className: 'my-class' }, 'toggle')
    expect(className).to.equal('my-class__toggle')
  })

  it('should derive a BEM compliant className for a passed modifier key', function () {
    const { className } = substyle({ className: 'my-class' }, '&active')
    expect(className).to.equal('my-class my-class--active')
  })

  it('should not return a className when no className has been set in the props', function () {
    const props = substyle({ }, 'toggle')
    expect(props).to.not.have.property('className')
  })

  it('should not generate additional class names for modifiers if selectedKeys contain element keys', function () {
    const { className } = substyle({ className: 'my-class' }, ['btn', '&disabled'])
    expect(className).to.equal('my-class__btn')
  })

  it('should return the original className when selectedKeys is not specified or empty', function () {
    const { className } = substyle({ className: 'my-class' })
    expect(className).to.equal('my-class')

    const { className: sameClassName } = substyle({ className: 'my-class' }, { '@active': false })
    expect(sameClassName).to.equal('my-class')

    const { className: stillTheSameClassName } = substyle({ className: 'my-class' }, undefined)
    expect(stillTheSameClassName).to.equal('my-class')
  })

  it('should correctly merge modifiers with existing classNames', function () {
    const { className } = substyle({ className: 'foo foo--bar' }, '&baz')
    expect(className).to.equal('foo foo--bar foo--baz')
  })

  it('should allow passing a function as second arg which is supposed to return the keys to select', () => {
    const { className } = substyle({ className: 'foo' }, () => 'bar')
    expect(className).to.equal('foo__bar')
  })

})
