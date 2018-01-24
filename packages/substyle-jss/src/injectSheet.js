import { createSubstyle } from 'substyle'
import { createElement } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import injectSheetBase from 'react-jss'

import createPropsDecorator from './createPropsDecorator'

const injectSheet = (stylesOrSheet, options) => {
  const jssHoc = injectSheetBase(stylesOrSheet, options)

  return WrappedComponent => {
    const SubstyleJss = ({ classes, sheet, style, className, ...rest }) => {
      return createElement(WrappedComponent, {
        style: createSubstyle(
          {
            style,
            className,
            classNames: classes,
          },
          createPropsDecorator(sheet)
        ),
        ...rest,
      })
    }

    hoistStatics(SubstyleJss, WrappedComponent)
    const componentName = WrappedComponent.displayName || WrappedComponent.name
    SubstyleJss.displayName = `substyleJss(${componentName})`

    return jssHoc(SubstyleJss)
  }
}

export default injectSheet
