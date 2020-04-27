// @flow
import { type ComponentType, type Ref } from 'react'

export type ModifiersT = { [string]: boolean }
export type KeysT = string | Array<string> | ModifiersT

export type StyleT = {|
  [property: string]: string | number,
|}

export type SubstyleT = {
  (select: KeysT, defaultStyle?: Object): SubstyleT,

  style?: StyleT,
  className?: string,
  ...
}

export type ClassNamesT = {
  [string]: string,
}

export type PropsT = {
  style?: StyleT | SubstyleT,
  className?: string,
  classNames?: ClassNamesT,
  innerRef?: Ref<*>,
}

export type EnhancerFuncT = (
  WrappedComponent: ComponentType<*>
) => ComponentType<*>

export type DecoratorFuncT = (props: PropsT) => Object

export type ShouldUpdateFuncT = (nextProps: Object, props: Object) => boolean
