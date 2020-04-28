// @flow
import { useContext, useMemo } from 'react'

import { PropsDecoratorContext } from './PropsDecoratorProvider'
import createSubstyle from './createSubstyle'
import coerceSelection from './coerceSelection'
import { type ModifiersT, type StyleT, type PropsT } from './types'

const useStyles = (
  defaultStyle: ?StyleT,
  { style, className, classNames }: PropsT,
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
  const joinedModifiers = selectedModifiers.join(',')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => substyle(selectedModifiers, defaultStyle), [
    substyle,
    joinedModifiers,
    defaultStyle,
  ])
}

export default useStyles
