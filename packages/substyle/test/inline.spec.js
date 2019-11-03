import inline from '../src/inline'

describe('inline', () => {
  it('should return an object with `style` and the props of the substyle instance', () => {
    const style = () => {}
    style.className = 'foo'
    style['data-foo'] = true

    expect(inline(style, { color: 'green' })).toEqual({
      className: 'foo',
      'data-foo': true,
      style: {
        color: 'green',
      },
    })
  })

  it('should return merge the inline styles of the substyle instance correctly', () => {
    const style = () => {}
    style.className = 'foo'
    style.style = {
      width: 100,
      height: 100,
    }

    expect(
      inline({ height: 200, color: 'green' }, style, { width: 200 })
    ).toEqual({
      className: 'foo',
      style: {
        color: 'green',
        width: 200,
        height: 100,
      },
    })
  })
})
