// @flow
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import ExampleComponent from './ExampleComponent'

function SubstyleExample() {
  return (
    <div>
      <h1>Component code</h1>

      <p>{renderToStaticMarkup(<ExampleComponent />)}</p>
    </div>
  )
}

export default SubstyleExample
