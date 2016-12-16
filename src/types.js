// @flow

export type StyleT = Function | Object;

export type KeysT = string | Array<string> | { [string]: boolean };

export type PropsT = {
  style?: StyleT,
  className?: string,
  classNames?: { [string]: string },
};
