// @flow
import { useContext, useMemo } from 'react'

import { PropsDecoratorContext } from './PropsDecoratorProvider'
import createSubstyle from './createSubstyle'
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

  return substyle(modifiers, defaultStyle)
}

export default useStyles
