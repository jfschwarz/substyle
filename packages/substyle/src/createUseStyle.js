// @flow
import { useContext, useMemo } from 'react'
import { type KeysT, type PropsT } from './types'
import createSubstyle from './createSubstyle'
import coerceSelection from './coerceSelection'
import { PropsDecoratorContext } from './PropsDecoratorProvider'

type DependsOnFuncT = (props: Object) => any[]

const createUseStyle = (
  defaultStyle?: Object | ((props: Object) => Object),
  getModifiers?: (props: Object) => KeysT,
  getDependsOn: DependsOnFuncT = (props) => Object.values(props)
) => {
  const useStyle = (props: PropsT) => {
    const { style, className, classNames, ...rest } = props
    const propsDecorator = useContext(PropsDecoratorContext)

    const substyle = useMemo(
      () => createSubstyle({ style, className, classNames }, propsDecorator),
      [style, className, classNames, propsDecorator]
    )

    // we apply an extra useMemo to the user-specified deps, so React warns if these change in length
    const dependsOn =
      (typeof defaultStyle === 'function' && getDependsOn(rest)) || []
    const dependsOnMemo = useMemo(() => dependsOn, dependsOn)

    const modifiers = getModifiers ? coerceSelection(getModifiers(rest)) : []

    return useMemo(
      () =>
        substyle(
          modifiers,
          typeof defaultStyle === 'function' ? defaultStyle(rest) : defaultStyle
        ),
      // the array of deps must not change its length, so we join all modifiers
      [substyle, modifiers.join(','), dependsOnMemo]
    )
  }

  return useStyle
}

export default createUseStyle
