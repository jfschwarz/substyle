import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import mergeClassNames from '../src/mergeClassNames'

describe('mergeClassNames', () => {
  const cn1 = {
    className: 'top1',
    classNames: {
      nested: {
        className: 'nested1',
        classNames: {
          deep: {
            className: 'deep1',
          },
        },
      },
    },
  }

  const cn2 = {
    className: 'top2',
    classNames: {
      nested: {
        className: 'nested2',
        classNames: {
          deep: {
            className: 'deep2',
          },
        },
      },
      extra: {
        className: 'extra2',
      },
    },
  }

  it.only('should return a merged classNames object and not mutate inputs', () => {
    const cn1Copy = cloneDeep(cn1)
    const cn2Copy = cloneDeep(cn2)

    const merged = mergeClassNames(cn1, cn2)
    expect(merged).to.deep.equal({
      className: 'top1 top2',
      classNames: {
        nested: {
          className: 'nested1 nested2',
          classNames: {
            deep: {
              className: 'deep1 deep2',
            },
          },
        },
        extra: {
          className: 'extra2',
        },
      },
    })

    // check that no mutation is going on
    expect(cn1).to.deep.equal(cn1Copy)
    expect(cn2).to.deep.equal(cn2Copy)
  })

  it('should be able to merge more than two objects', () => {
    console.log(cn1, cn2);
    const cn3 = {
      className: 'top3',
      classNames: {
        nested: {
          className: 'nested3',
        },
      },
    }

    expect(mergeClassNames(cn1, cn2, cn3)).to.deep.equal({
      className: 'top1 top2 top3',
      classNames: {
        nested: {
          className: 'nested1 nested2 nested3',
          classNames: {
            deep: {
              className: 'deep1 deep2',
            },
          },
        },
        extra: {
          className: 'extra2',
        },
      },
    })
  })

  it('should be able to deal with shortcut syntax', () => {
    const myClassNames1 = {
      className: 'top1',
      classNames: {
        nested: 'nested1',
        extra: {
          className: 'extra1',
        },
        another: 'another1',
      },
    }

    const myClassNames2 = {
      className: 'top2',
      classNames: {
        nested: 'nested2',
        extra: 'extra2',
        another: {
          className: 'another2',
        },
      },
    }

    expect(mergeClassNames(myClassNames1, myClassNames2)).to.deep.equal({
      className: 'top1 top2',
      classNames: {
        nested: 'nested1 nested2',
        extra: {
          className: 'extra1 extra2',
        },
        another: {
          className: 'another1 another2',
        },
      },
    })
  })
})
