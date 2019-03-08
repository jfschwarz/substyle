// @flow
import React from 'react'
import { defaultStyle } from 'substyle'

function ExampleComponent({ style }) {
  return (
    <div {...style}>
      <h1 {...style('title')}>Title</h1>

      <p {...style('content')}>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet.
      </p>

      <button {...style('action')}>Some action</button>
    </div>
  )
}

const enhance = defaultStyle({
  title: {
    fontSize: 20,
  },

  content: {
    fontSize: 12,
  },

  action: {
    textTransform: 'uppercase',

    ':hover': {
      textDecoration: 'underline',
    },
  },
})

export default enhance(ExampleComponent)
