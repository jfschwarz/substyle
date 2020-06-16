// @flow
export type ModifiersT = {
  [string]: boolean,
}
export type KeysT = string | Array<string> | ModifiersT

type PlainStyleT = {
  [string]: string | number,
}

export type StyleT = {
  [string]: string | number | StyleT,
}

export type SubstyleT = {|
  (select: KeysT, defaultStyle?: StyleT): SubstyleT,

  style?: PlainStyleT,
  className?: string,
|}

export type ClassNamesT = {
  [string]: string,
}

export type PropsT = {|
  style?: StyleT | SubstyleT,
  className?: string,
  classNames?: ClassNamesT,
|}

export type DecoratorFuncT = (props: PropsT) => Object
