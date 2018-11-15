// @flow
import PT from 'prop-types'
import * as React from 'react'

export const ENHANCER_CONTEXT_NAME = '__substyle__enhancer'
export const PROPS_DECORATOR_CONTEXT_NAME = '__substyle__propsDecorator'

export type KeysT = string | Array<string> | { [string]: boolean }

export type SubstyleT = (select: KeysT, defaultStyle?: Object) => SubstyleT

export type StyleT = SubstyleT | Object

const StylePT = PT.oneOfType([PT.func, PT.object])

export type ClassNamesT = {
  [string]: string,
}

const ClassNamesPT = PT.objectOf(PT.string)

export type PropsT = {
  style?: StyleT,
  className?: string,
  classNames?: ClassNamesT,
  innerRef?: React.Ref<*>,
}

export const PropTypes = {
  style: StylePT,
  className: PT.string,
  classNames: ClassNamesPT,
  innerRef: PT.oneOfType([
    PT.func,
    PT.shape({
      current: typeof Element === 'undefined' ? PT.any : PT.instanceOf(Element),
    }),
  ]),
}

export type EnhancerFuncT = (
  WrappedComponent: React.ComponentType<*>
) => React.ComponentType<*>

export type DecoratorFuncT = (props: PropsT) => Object

export type ShouldUpdateFuncT = (nextProps: Object, props: Object) => boolean

export type ContextT = {|
  __substyle__enhancer?: EnhancerFuncT,
  __substyle__propsDecorator?: DecoratorFuncT,
|}

export const ContextTypes = {
  [ENHANCER_CONTEXT_NAME]: PT.func,
  [PROPS_DECORATOR_CONTEXT_NAME]: PT.func,
}
