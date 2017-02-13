import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { mergeClassNames, coerceClassNames } from '../src/classNames'

describe('`classNames` utils', () => {
  describe('mergeClassNames', () => {
    const cn1 = {
      className: 'top1',

      nested: {
        className: 'nested1',
        deep: {
          className: 'deep1',
        },
      },
    }

    const cn2 = {
      className: 'top2',

      nested: {
        className: 'nested2',
        deep: {
          className: 'deep2',
        },
      },
      extra: {
        className: 'extra2',
      },
    }

    it('should return a merged classNames object and not mutate inputs', () => {
      const cn1Copy = cloneDeep(cn1)
      const cn2Copy = cloneDeep(cn2)

      const merged = mergeClassNames(cn1, cn2)
      expect(merged).to.deep.equal({
        className: 'top1 top2',

        nested: {
          className: 'nested1 nested2',
          deep: {
            className: 'deep1 deep2',
          },
        },
        extra: {
          className: 'extra2',
        },
      })

      // check that no mutation is going on
      expect(cn1).to.deep.equal(cn1Copy)
      expect(cn2).to.deep.equal(cn2Copy)
    })

    it('should be able to merge more than two objects', () => {
      const cn3 = {
        className: 'top3',

        nested: {
          className: 'nested3',
        },
      }

      expect(mergeClassNames(cn1, cn2, cn3)).to.deep.equal({
        className: 'top1 top2 top3',

        nested: {
          className: 'nested1 nested2 nested3',
          deep: {
            className: 'deep1 deep2',
          },
        },
        extra: {
          className: 'extra2',
        },
      })
    })

    it('should be able to deal with shortcut syntax', () => {
      const myClassNames1 = {
        className: 'top1',

        nested: 'nested1',
        extra: {
          className: 'extra1',
        },
        another: 'another1',
      }

      const myClassNames2 = {
        className: 'top2',

        nested: 'nested2',
        extra: 'extra2',
        another: {
          className: 'another2',
        },
      }

      expect(mergeClassNames(myClassNames1, myClassNames2)).to.deep.equal({
        className: 'top1 top2',

        nested: 'nested1 nested2',
        extra: {
          className: 'extra1 extra2',
        },
        another: {
          className: 'another1 another2',
        },
      })
    })
  })

  describe('coerceClassNames', () => {
    it('should wrap a single string in an object under `className`', () => {
      expect(coerceClassNames('foo')).to.deep.equal({
        className: 'foo',
      })
    })

    it('should wrap all shortcut definitions in proper className structures', () => {
      expect(coerceClassNames({
        nested: {
          deep: 'foo',
        },
      })).to.deep.equal({
        nested: {
          deep: {
            className: 'foo',
          },
        },
      })
    })
  })
})
