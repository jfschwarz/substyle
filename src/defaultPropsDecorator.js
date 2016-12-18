import { pickDirectStyles } from './pickStyles'

const defaultPropsDecorator = ({ style, className }) => ({
  ...(style ?
    { style: pickDirectStyles(style) } :
    {}
  ),
  ...(className ? { className } : {}),
})

export default defaultPropsDecorator
