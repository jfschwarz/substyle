// @flow

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
