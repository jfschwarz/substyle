declare module 'substyle' {
  import * as React from 'react'

  type PlainStyle = {
    [key: string]: string | number
  }

  type Style = {
    [key: string]: string | number | Style
  }

  type ClassNames = {
    [key: string]: string
  }

  type Modifiers = {
    [key: string]: boolean
  }

  type Keys = string | Array<string> | Modifiers

  namespace useStyles {
    export type StylingProps = {
      style?: Style | Substyle
      className?: string
      classNames?: ClassNames
    }

    type DecoratorFunc = (props: StylingProps) => Object

    export type Substyle = {
      (select: Keys, defaultStyle?: Style): Substyle

      style?: PlainStyle
      className?: string
    }

    export function createSubstyle(
      props: StylingProps,
      propsDecorator?: DecoratorFunc
    ): Substyle

    export const defaultPropsDecorator: DecoratorFunc
    export const PropsDecoratorContext: React.Context<DecoratorFunc>
    export const PropsDecoratorProvider: React.Context<DecoratorFunc>['Provider']

    export function inline(
      base: Substyle,
      inlineStyle: PlainStyle
    ): { style?: PlainStyle; className?: string }
  }

  function useStyles(
    defaultStyle: void | Style,
    stylingProps: useStyles.StylingProps,
    modifiers?: Modifiers
  ): useStyles.Substyle

  export = useStyles
}
