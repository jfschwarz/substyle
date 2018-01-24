# Use substyled components with JSS

Follow these instructions if you want to use a substyled React component in a your web application and [JSS](https://github.com/cssinjs/jss) is your css-in-js library of choice.

#### Why do you need this?
Substyled components usually carry some internal style definitions. Per default, these style definions will be rendered as `style` attributes of the DOM elements. Inline styles have some limitations, though, e.g. no support for `:hover` rules and media queries. Thus, you should let JSS process the inline styles to make sure you get the full user experience provided by the component.


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

`substyle-jss` provides its own version of [react-jss](https://github.com/cssinjs/react-jss)'s `injectSheet` function. Use it to enhance a substyled component.

```javascript
import { injectSheet } from 'substyle-jss'

const JssSubstyledComponent = injectSheet({})(SubstyledComponent)
```

Now, instead of rendering `SubstyledComponent` you render the enhanced version `JssSubstyledComponent` in your app. All default style definintions of `SubstyledComponent` will be processed by react-jss.


### Configure JSS integration for all substyled components

If you are rendering a larger number of different substyled components, it might become tedious to enhance every single one of these with `injectSheet`. Then you can render the `ProvideSheet` component somewhere close to the root element of your app. All substyled components will then automatically pass their internal style information to JSS for adding them to the sheet.

```javascript
import { ProvideSheet } from 'substyle-jss'

<ProvideSheet>
  <SubstyledComponent />
</ProvideSheet>
```

### Provide custom styles

To provide custom styles for the substyled components, just pass them as the argument to `injectSheet`:

```javascript
import { injectSheet } from 'substyle-jss'

const JssSubstyledComponent = injectSheet({
  // Use an arbitrary rule name for the root element and make sure that the rule names
  // for all other elemenets are prefixed with this rule name and to underscores.
  comp: {
    color: 'red',

    '&:hover': {
      color: 'pink'
    },
  },

  comp__header: {
    height: 68,
  }
})(SubstyledComponent)
```

To find out the correct rule names for referencing the elements in the substyled component, pass a `className` prop with an arbitrary value to the component. The passed value will be rendered as the class name or the root element, while all the other elements will receive class names that are derived from this value. Thus, by inspecting the render result you can find out the rule names you can use in `injectSheet` for defining custom styles.