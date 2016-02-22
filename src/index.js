import substyle from './substyle'
import defaultStyle from './defaultStyle'

const wrapper = (...args) => substyle(...args)
wrapper.defaultStyle = defaultStyle

export default wrapper