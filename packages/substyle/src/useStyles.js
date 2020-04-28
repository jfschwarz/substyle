// @flow
import invariant from 'invariant'
import { useContext, useMemo } from 'react'

import { PropsDecoratorContext } from './PropsDecoratorProvider'
import createSubstyle from './createSubstyle'
import coerceSelection from './coerceSelection'
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

const useStyles = (
  defaultStyle?: StyleT,
  { style, className, classNames }: OverrideT,
  modifiers?: ModifiersT
) => {
  const propsDecorator = useContext(PropsDecoratorContext)

  const substyle = useMemo(
    () => createSubstyle({ style, className, classNames }, propsDecorator),
    [style, className, classNames, propsDecorator]
  )

  // Modifiers are recalculated on every render. To leverage memoization we need to map the
  // selected modifiers (array of strings) to something that keeps its identity if the set of
  // modifiers does not change.
  // We join them to a string, assuming users won't change the order of keys in the modifiers object.
  const selectedModifiers = coerceSelection(modifiers)
  return useMemo(() => substyle(selectedModifiers, defaultStyle), [
    substyle,
    selectedModifiers.join(','),
    defaultStyle,
  ])
}

export default useStyles
