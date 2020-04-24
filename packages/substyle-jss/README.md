# Use substyled components with JSS

Follow these instructions if you want to use a substyled React component in a your web application and [JSS](https://github.com/cssinjs/jss) is your css-in-js library of choice. Internally, substyle-jss uses [css-jss](https://github.com/cssinjs/jss/tree/master/packages/css-jss), which is available since JSS monorepo version 10.

#### Why do you need this?

Substyled components usually carry some internal style definitions. Per default, these style definitions will be rendered as `style` attributes of the DOM elements. Inline styles have some limitations, though. For example, there is no support for `:hover` rules or media queries. Thus, you should let JSS process the inline styles to make sure you get the full user experience provided by the component.

### Installation

First, install `substyle-jss`:

```bash
npm install --save substyle-jss
```

Or, if using Yarn:

```bash
yarn add substyle-jss
```

### Let JSS process the internal component styles

To let JSS process the internal style definitions of a substyled React component pass the result of `viaJss()` as the `style` prop to that component:

```javascript
import { viaJss } from 'substyle-jss'
;<SubstyledComponent style={viaJss()} />
```

### Configure JSS integration for all substyled components

If you are rendering a larger number of different substyled components, it might become tedious to add the `style={viaJss()}` prop to all of them. Then you can render the `StylesViaJss` component somewhere close to the root element of your app. All substyled components will then automatically pass their internal style information to JSS for adding them to the sheet.

```javascript
import { StylesViaJss } from 'substyle-jss'
;<StylesViaJss>
  <SubstyledComponent />
</StylesViaJss>
```

### Provide custom styles

You can pass an object of custom style definitions for all elements rendered by the substyled component. Custom styles are merged with the default styles and then processed written to the stylesheet via JSS.

```javascript
import { viaJss } from 'substyle-jss'
;<SubstyledComponent
  style={viaJss({
    element: {
      fontSize: 12,
    },
  })}
/>
```

If you are using the `StylesViaJss` wrapping component, you can pass the object of custom style definitions directly via the `style` prop:

```javascript
import { StylesViaJss } from 'substyle-jss'
;<StylesViaJss>
  <SubstyledComponent
    style={{
      element: {
        fontSize: 12,
      },
    }}
  />
</StylesViaJss>
```
