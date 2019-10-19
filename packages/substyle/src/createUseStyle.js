// @flow
import { useContext, useMemo } from 'react'
import { type KeysT, type PropsT, type SubstyleT } from './types'
import createSubstyle from './createSubstyle'
import coerceSelection from './coerceSelection'

type DependsOnFuncT = (props: Object) => any[]

const createUseStyle = (
  defaultStyle?: Object | ((props: Object) => Object),
  getModifiers?: (props: Object) => KeysT,
  getDependsOn: DependsOnFuncT = props => Object.values(props)
) => {
  const useStyle = (props: PropsT) => {
    const { style, className, classNames, ...rest } = props
    const propsDecorator = undefined //useContext()
    // const adapterHook = useContext() // for JSS adapter

    const substyle = useMemo(
      () => createSubstyle({ style, className, classNames }, propsDecorator),
      [style, className, classNames, propsDecorator]
    )

    const modifiers = getModifiers ? coerceSelection(getModifiers(rest)) : []
    return useMemo(
      () =>
        substyle(
          modifiers,
          typeof defaultStyle === 'function' ? defaultStyle(rest) : defaultStyle
        ),
      [
        substyle,
        ...modifiers,
        ...(typeof defaultStyle === 'function' ? getDependsOn(rest) : []),
      ]
    )
  }

  return useStyle
}

export default createUseStyle
