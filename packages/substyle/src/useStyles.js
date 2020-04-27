// @flow
import invariant from 'invariant'
import { useContext, useMemo } from 'react'

import { PropsDecoratorContext } from './PropsDecoratorProvider'
import createSubstyle from './createSubstyle'
import {
  type ClassNamesT,
  type ModifiersT,
  type StyleT,
  type SubstyleT,
} from './types'

type OverrideT = {|
  className?: string,
  classNames?: ClassNamesT,
  style?: StyleT | SubstyleT,
|}

type InternalOverrideT = {|
  className?: ?string,
  classNames?: ?ClassNamesT,
  style?: void | StyleT | SubstyleT,
|}

type Args = [StyleT, OverrideT] | [StyleT, OverrideT, ModifiersT]

const useStyles = (...args: Args) => {
  const [defaultStyle, { style, className, classNames }, modifiers] = parseArgs(
    ...args
  )

  const propsDecorator = useContext(PropsDecoratorContext)

  const substyle = useMemo(
    () => createSubstyle({ style, className, classNames }, propsDecorator),
    [style, className, classNames, propsDecorator]
  )

  return useMemo(() => substyle(modifiers, defaultStyle), [
    substyle,
    modifiers,
    defaultStyle,
  ])
}

const defaultModifiers = Object.freeze({})
const defaultOverrides = Object.freeze({})

const parseArgs = (...args: Args): [StyleT, InternalOverrideT, ModifiersT] => {
  if (args.length === 1) {
    const [defaultStyle] = args

    return [defaultStyle, defaultOverrides, defaultModifiers]
  }

  if (args.length === 2) {
    const [defaultStyle, overrides] = args

    return [defaultStyle, ensureOverrides(overrides), defaultModifiers]
  }

  invariant(
    args.length === 3,
    `useStyles must be called with either 1, 2, or 3 arguments, not ${args.length}.`
  )

  const [defaultStyle, overrides, modifiers] = args

  return [defaultStyle, ensureOverrides(overrides), modifiers]
}

const ensureOverrides = (overrides): InternalOverrideT => {
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

export default useStyles
