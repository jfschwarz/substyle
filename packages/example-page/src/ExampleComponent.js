// @flow
import React from 'react'
import { createUseStyle } from 'substyle'

const useStyle = createUseStyle({
  title: {
    fontSize: 20,
  },
})

function ExampleComponent(props: Object) {
  const style = useStyle(props)
  return (
    <div {...style}>
      <h1 {...style('title')}>Title</h1>
      <div {...style('content')}>Some text...</div>
    </div>
  )
}

export default ExampleComponent
