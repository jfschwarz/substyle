// @flow
import PropTypes from 'prop-types'
import React, { type Context, type Node, createContext } from 'react'

import type { DecoratorFuncT, EnhancerFuncT } from './types'
import { identity } from './utils'

type EnhancerContextT = {
  enhancer: EnhancerFuncT,
  propsDecorator: DecoratorFuncT,
}

type PropsT = {
  enhancer?: EnhancerFuncT,
  propsDecorator?: DecoratorFuncT,

  children: Node,
}

const { Provider, Consumer }: Context<EnhancerContextT> = createContext({
  enhancer: identity,
  propsDecorator: identity,
})

export const EnhancerConsumer = Consumer

function EnhancerProvider({
  enhancer = identity,
  propsDecorator = identity,
  children,
}: PropsT) {
  return <Provider value={{ enhancer, propsDecorator }}>{children}</Provider>
}

EnhancerProvider.propTypes = {
  enhancer: PropTypes.func,
  propsDecorator: PropTypes.func,
  children: PropTypes.element.isRequired,
}

export default EnhancerProvider
