// @flow
import React from 'react'
import { type Substyle, defaultStyle } from 'substyle'

type PropsT = {
  style: Substyle,
}

function ExampleComponent({ style }: PropsT) {
  return (
    <div {...style}>
      <h1 {...style('title')}>Title</h1>

      <div {...style('content')}>Some text...</div>
    </div>
  )
}

const enhance = defaultStyle({
  title: {
    fontSize: 20,
  },
})

export default enhance(ExampleComponent)
