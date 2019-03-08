// @flow
import React from 'react'
import { render } from 'react-dom'

import App from './App'

const container = document.getElementById('application')

if (container) {
  render(<App />, container)
}
