# Use substyled components with glamor and glamorous

Follow these instructions if you want to use a substyled React component in a your web application and [glamor](https://github.com/threepointone/glamor) is your css-in-js library of choice.

#### Why do you need this?
Substyled components usually carry some internal style definitions. Per default, these style definions will be rendered as `style` attributes of the DOM elements. Inline styles have some limitations, though, e.g. no support for `:hover` rules and media queries. Thus, you should let glamor process the inline styles to make sure you get the full user experience provided by the component.


### Installation

First, install `substyle-glamor`:

```bash
npm install --save substyle-glamor
```

Or, if using Yarn:

```bash
yarn add substyle-glamor
```


### Let glamor process the internal component styles

```javascript
import { asDataAttributes, asClasses } from 'substyle-glamor'

// generate data-* attributes
<SubstyledComponent style={asDataAttributes()} />

// or generate classes
<SubstyledComponent style={asClasses()} />
```


### Provide custom styles

To provide custome styles for the substyled components, just pass them as the argument to `asDataAttributes` or `asClasses`:

```javascript
import { asDataAttributes } from 'substyle-glamor'

const style = asDataAttributes({
  color: 'red',
  ':hover': {
    color: 'pink'
  },

  header: {
    height: 68,
  }
})

<SubstyledComponent style={style} />
```


### Configure glamor integration for all substyled components

If you are rendering substyled components at a lot of places in your app, it might become tedious to use `asDataAttributes`/`asClasses` every single time. Then you can render the `StylesAsDataAttributes` and `StylesAsClasses` components somewhere close to the root element of your app. All substyled components will then automatically process their internal style information through glamor.