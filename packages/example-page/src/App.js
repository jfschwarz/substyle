// @flow
import pretty from 'pretty'
import React, { useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { StylesAsClasses, StylesAsDataAttributes } from 'substyle-glamor'
import { ProvideSheet } from 'substyle-jss'

import ExampleComponent from './ExampleComponent'

function SubstyleExample() {
  const [color, setColor] = useState('black')
  const [fontSize, setFontSize] = useState('medium')

  const sizes = {
    small: 16,
    medium: 20,
    large: 24,
  }

  const defaultStyle = {
    title: {
      fontSize: sizes[fontSize],
    },

    content: {
      color,
    },
  }

  const component = <ExampleComponent style={defaultStyle} />

  return (
    <div>
      <h1>Substyle example page</h1>

      <h2>Defaults</h2>

      <table>
        <tbody>
          <tr>
            <td>
              <label htmlFor="titleSize">Title size</label>
            </td>
            <td>
              <select
                id="titleSize"
                value={fontSize}
                onChange={event => setFontSize(event.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="contentColor">Content text color</label>
            </td>
            <td>
              <select
                id="contentColor"
                value={color}
                onChange={event => setColor(event.target.value)}
              >
                <option value="black">Black</option>
                <option value="red">Red</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Results</h2>

      <table>
        <thead>
          <tr>
            <th>Enhancer</th>
            <th>Generated HTML</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Default (inline styles & class names)</td>
            <td>
              <ExampleComponent style={defaultStyle} className="example" />
            </td>
            <td>
              <CodeExample>
                <ExampleComponent style={defaultStyle} className="example" />
              </CodeExample>
            </td>
          </tr>
          <tr>
            <td>Glamor (through data attribute)</td>
            <td>
              <StylesAsDataAttributes>{component}</StylesAsDataAttributes>
            </td>
            <td>
              <CodeExample>
                <StylesAsDataAttributes>{component}</StylesAsDataAttributes>
              </CodeExample>
            </td>
          </tr>
          <tr>
            <td>Glamor (through class names)</td>
            <td>
              <StylesAsClasses>{component}</StylesAsClasses>
            </td>
            <td>
              <CodeExample>
                <StylesAsClasses>{component}</StylesAsClasses>
              </CodeExample>
            </td>
          </tr>
          {/* <tr>
            <td>JSS</td>
            <td>
              <CodeExample>
                <ProvideSheet>{component}</ProvideSheet>
              </CodeExample>
            </td>
          </tr> */}
        </tbody>
      </table>
    </div>
  )
}

const CodeExample = ({ children }) => (
  <pre style={{ margin: 10 }}>{pretty(renderToStaticMarkup(children))}</pre>
)

export default SubstyleExample
