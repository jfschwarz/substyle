// @flow
import { type ComponentType, type Ref } from 'react'

export type KeysT = string | Array<string> | { [string]: boolean }

export type SubstyleT = (select: KeysT, defaultStyle?: Object) => SubstyleT

export type StyleT = SubstyleT | Object

export type ClassNamesT = {
  [string]: string,
}

export type PropsT = {
  style?: StyleT,
  className?: string,
  classNames?: ClassNamesT,
  innerRef?: Ref<*>,
}

export type EnhancerFuncT = (
  WrappedComponent: ComponentType<*>
) => ComponentType<*>

export type DecoratorFuncT = (props: PropsT) => Object

export type ShouldUpdateFuncT = (nextProps: Object, props: Object) => boolean
