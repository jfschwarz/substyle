// @flow
/* eslint-disable import/prefer-default-export */
export const ENHANCER_CONTEXT_NAME = '__substyle__Enhancer'

export type KeysT = string | Array<string> | { [string]: boolean };

export type SubstyleT = (select: KeysT, defaultStyle?: Object) => SubstyleT;

export type StyleT = SubstyleT | Object;

export type ClassNamesT = {
  [string]: {
    className?: string,
    classNames?: ClassNamesT,
  },
};

export type PropsT = {
  style?: StyleT,
  className?: string,
  classNames?: ClassNamesT,
};

export type ContextT = {
  [ENHANCER_CONTEXT_NAME]: ?(WrappedComponent: ReactClass) => ReactClass,
};
