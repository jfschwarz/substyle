// @flow
import React from 'react'
import { useStyles } from 'substyle'

type ApiPropsT = {|
  size: 'small' | 'medium' | 'large',
  color: 'black' | 'red',

  className?: string,
|}

function ExampleComponent({ size, color, className }: ApiPropsT) {
  const styles = useStyles(
    defaultStyles,
    { className },
    {
      [`&${size}`]: true,
      [`&${color}`]: true,
    }
  )

  return (
    <div {...styles}>
      <h1 {...styles('title')}>Title</h1>
      <div {...styles('content')}>Some text...</div>
    </div>
  )
}

const defaultStyles = {
  '&large': {
    title: {
      fontSize: 24,
    },
  },

  '&medium': {
    title: {
      fontSize: 20,
    },
  },

  '&small': {
    title: {
      fontSize: 16,
    },
  },

  '&black': {
    content: {
      color: 'black',
    },
  },

  '&red': {
    content: {
      color: 'red',
    },
  },
}

export default ExampleComponent
