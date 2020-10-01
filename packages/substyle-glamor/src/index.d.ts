declare module 'substyle-glamor' {
  import { ReactNode } from 'react'

  type EnhancerPropsT = {
    children: ReactNode
  }

  type PlainStyle = {
    [key: string]: string | number
  }

  type Style = {
    [key: string]: string | number | Style
  }

  type Modifiers = {
    [key: string]: boolean
  }

  type Keys = string | Array<string> | Modifiers

  type Substyle = {
    (select: Keys, defaultStyle?: Style): Substyle

    style?: PlainStyle
    className?: string
  }

  export function StylesAsDataAttributes(props: EnhancerPropsT): JSX.Element

  export function StylesAsClasses(props: EnhancerPropsT): JSX.Element

  export function asDataAttributes(style: Style): Substyle

  export function asDataClasses(style: Style): Substyle
}
