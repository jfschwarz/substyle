// @flow
import pretty from 'pretty'
import Radium from 'radium'
import React, { useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { EnhancerProvider } from 'substyle'
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
              <label for="titleSize">Title size</label>
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
              <label for="contentColor">Content text color</label>
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

      <h2>Output</h2>

      <div style={{ margin: 20, padding: 20, border: '1px solid black' }}>
        <EnhancerProvider style={defaultStyle}>{component}</EnhancerProvider>
      </div>

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
            <td>Class names</td>
            <td>
              <CodeExample>
                {pretty(
                  renderToStaticMarkup(
                    <EnhancerProvider>
                      <ExampleComponent
                        style={defaultStyle}
                        className="example"
                      />
                    </EnhancerProvider>
                  )
                )}
              </CodeExample>
            </td>
          </tr>
          <tr>
            <td>Radium</td>
            <td>
              <CodeExample>
                {pretty(
                  renderToStaticMarkup(
                    <EnhancerProvider enhancer={Radium}>
                      {component}
                    </EnhancerProvider>
                  )
                )}
              </CodeExample>
            </td>
          </tr>
          <tr>
            <td>Glamor (through data attribute)</td>
            <td>
              <CodeExample>
                {pretty(
                  renderToStaticMarkup(
                    <StylesAsDataAttributes>{component}</StylesAsDataAttributes>
                  )
                )}
              </CodeExample>
            </td>
          </tr>
          <tr>
            <td>Glamor (through class names)</td>
            <td>
              <CodeExample>
                {pretty(
                  renderToStaticMarkup(
                    <StylesAsClasses>{component}</StylesAsClasses>
                  )
                )}
              </CodeExample>
            </td>
          </tr>
          <tr>
            <td>JSS</td>
            <td>
              <CodeExample>
                {pretty(
                  renderToStaticMarkup(<ProvideSheet>{component}</ProvideSheet>)
                )}
              </CodeExample>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const CodeExample = ({ children }) => (
  <pre style={{ margin: 10 }}>{children}</pre>
)

export default SubstyleExample
