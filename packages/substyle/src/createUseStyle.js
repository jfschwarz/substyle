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

    const dependsOn = [
      style,
      className,
      classNames,
      ...(getModifiers ? coerceSelection(getModifiers(rest)) : []),
      ...(typeof defaultStyle === 'function' ? getDependsOn(rest) : []),
      propsDecorator,
    ]

    const substyle = useMemo(
      () => createSubstyle({ style, className, classNames }, propsDecorator),
      dependsOn
    )

    return substyle
  }

  return useStyle
}

export default createUseStyle
