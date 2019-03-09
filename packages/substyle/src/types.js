// @flow
import { type ComponentType, type Ref } from 'react'

export type KeysT = string | Array<string> | { [string]: boolean }

export type StyleDefinitionT = {
  [key: string]: string | number | StyleDefinitionT,
}

export type SubstyleT = (
  select: KeysT,
  defaultStyle?: StyleDefinitionT
) => SubstyleT

export type StyleT = SubstyleT | StyleDefinitionT

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
