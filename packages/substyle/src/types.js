// @flow
import PT from 'prop-types'

export const ENHANCER_CONTEXT_NAME = '__substyle__Enhancer'

export type KeysT = string | Array<string> | { [string]: boolean };

export type SubstyleT = (select: KeysT, defaultStyle?: Object) => SubstyleT;

export type StyleT = SubstyleT | Object;

const StylePT = PT.oneOfType([PT.func, PT.object])

export type ClassNamesT = {
  [string]: string
};

const ClassNamesPT = PT.objectOf(PT.string)

export type PropsT = {
  style?: StyleT,
  className?: string,
  classNames?: ClassNamesT,
};

export const PropTypes = {
  style: StylePT,
  className: PT.string,
  classNames: ClassNamesPT,
}

export type ContextT = {
  [ENHANCER_CONTEXT_NAME]: ?(WrappedComponent: ReactClass) => ReactClass,
};

export const ContextTypes = {
  [ENHANCER_CONTEXT_NAME]: PT.func,
}
