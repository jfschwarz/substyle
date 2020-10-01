declare module 'substyle-jss' {
  import { ReactNode } from 'react'
  import { Jss } from 'jss'

  type EnhancerPropsT = {
    children: ReactNode
    jss: Jss
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

  export function StylesViaJss(props: EnhancerPropsT): JSX.Element

  export function viaJss(style: Style, jss: Jss): Substyle
}
