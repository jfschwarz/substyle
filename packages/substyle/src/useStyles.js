// @flow
import invariant from 'invariant'
import { useContext, useMemo } from 'react'

import { PropsDecoratorContext } from './PropsDecoratorProvider'
import createSubstyle from './createSubstyle'
import {
  type ClassNamesT,
  type KeysT,
  type StyleT,
  type SubstyleT,
} from './types'

type OverrideT = {|
  className?: ?string,
  classNames?: ?ClassNamesT,
  style?: StyleT | SubstyleT,
|}

type Args =
  | [StyleT]
  | [StyleT, KeysT]
  | [StyleT, OverrideT]
  | [StyleT, KeysT, OverrideT]

const useStyles = (...args: Args) => {
  const [defaultStyle, modifiers, { style, className, classNames }] = parseArgs(
    ...args
  )

  const propsDecorator = useContext(PropsDecoratorContext)

  const substyle = useMemo(
    () => createSubstyle({ style, className, classNames }, propsDecorator),
    [style, className, classNames, propsDecorator]
  )

  return useMemo(() => substyle(modifiers, defaultStyle), [substyle, modifiers])
}

const defaultModifiers = Object.freeze({})
const defaultProps = Object.freeze({})

const parseArgs = (...args: Args): [StyleT, KeysT, OverrideT] => {
  if (args.length === 1) {
    const [defaultStyle] = args

    return [defaultStyle, defaultModifiers, defaultProps]
  }

  if (args.length === 2) {
    const [defaultStyle, maybeModifiers] = args

    if (areModifiers(maybeModifiers)) {
      return [defaultStyle, ensureModifiers(maybeModifiers), defaultProps]
    }

    return [defaultStyle, defaultModifiers, ensureOverrides(maybeModifiers)]
  }

  invariant(
    args.length === 3,
    `useStyles must be called with either 1, 2, or 3 arguments, not ${
      args.length
    }.`
  )

  return args
}

const areModifiers = (maybeModifiers): boolean => {
  if (typeof maybeModifiers === 'string') {
    return true
  }

  if (Array.isArray(maybeModifiers)) {
    return true
  }

  return Object.keys(maybeModifiers).every(key => key.startsWith('&'))
}

const ensureOverrides = (overrides): OverrideT => {
  invariant(
    typeof overrides !== 'string',
    'Overrides must be an object, not "string".'
  )

  invariant(!Array.isArray(overrides), 'Overrides cannot be an array.')

  const style = ensureStyle(overrides)

  const className = style?.className
    ? ensureClassName(style)
    : ensureClassName(overrides)
  const classNames = ensureClassNames(overrides)

  return { classNames, className, style }
}

const ensureClassName = (overrides): ?string => {
  if (!overrides) {
    return
  }

  if (!overrides.className) {
    return
  }

  invariant(
    typeof overrides.className === 'string',
    `"className" property must be "string" not "${typeof overrides.className}".`
  )

  return overrides.className
}

const ensureClassNames = (overrides): ?ClassNamesT => {
  if (!overrides.classNames) {
    return
  }

  invariant(
    typeof overrides.classNames !== 'boolean',
    '"classNames" property cannot be a boolean.'
  )

  return overrides.classNames
}

const ensureStyle = (overrides): StyleT | SubstyleT | void => {
  if (!overrides.style) {
    return
  }

  invariant(
    typeof overrides.style !== 'boolean',
    '"style" property cannot be a boolean'
  )

  return overrides.style
}

const ensureModifiers = (modifiers): KeysT => {
  return ((modifiers: any): KeysT)
}

export default useStyles
