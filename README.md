# substyle

There are a lot of competing styling approaches for React applications, from good old css and css modules to inline styles and css-in-js solutions. How can authors of component libraries make sure that component styles can be seamlessly integrated and customized in any application?

_substyle_ provides a hook for building universally styleable React components. By using _substyle_ your components will support styling through:

- css ([BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) class names)
- css modules
- inline styles
- [Aphrodite](https://github.com/Khan/aphrodite)
- [Glamor](https://github.com/threepointone/glamor) & [Glamorous](https://glamorous.rocks)
- [JSS](https://github.com/jsstyles/jss)

## Installation

```
npm install --save substyle
```

## Example

Let's create a simple `Popover` component using _substyle_:

```javascript
import useStyles from 'substyle'

const defaultStyle = {
  position: 'relative',

  close: {
    position: 'absolute',

    top: 10,
    right: 10,
  },
}

const Popover = ({ className, classNames, style, children }) => {
  const styles = useStyles(defaultStyle, { className, classNames, style })

  return (
    <div {...styles}>
      <button {...styles('close')}>x</button>

      <span>{children}</span>
    </div>
  )
}
```

Adding `className`, `classNames` and `style` to the component's props makes sure that users can define custom styles in whatever way they fancy:

### For using css, assign `className`

```jsx
// JSX
<Popover className="popover">
  Hello world!
</Popover>

// Rendered HTML
<div class="popover">
  <button class="popover__close">x</button>
  <span>Hello world!</span>
</div>
```

### For using inline styles, assign `style`

```jsx
// JSX
<Popover style={{
  background: 'white',
  close: { right: 0 },
}}>
  Hello world!
</Popover>

// Rendered HTML
<div style="background: white;">
  <button style="right: 0;">x</button>

  <span>Hello world!</span>
</div>
```

### For using css modules, assign `className` and `classNames`

```jsx
import classNames from './Popover.module.css'
// content of this file:
// .popover { ... }
// .popover__close { ... }

// JSX
<Popover className="popover" classNames={classNames}>
  Hello world!
</Popover>

// Rendered HTML
<div class="popover_rty43x0s">
  <button class="popover__close_1mdf3i3l">x</button>
  <span>Hello world!</span>
</div>
```

## How to use it

### Select style for an element

For getting the styling props to pass to an element returned by your component's render functions, call the `styles` function with a key that identifies this element.

```javascript
styles('footer')
```

In some cases, it is also useful to select multiple styles for the same element. This allows to separate some more specific style definitions from base styles shared with other elements, so that the user would have to provide custom definitions for these base styles only once.

```javascript
styles(['item', 'item-last'])
```

### Pass selected style to simple elements

The return value of any `styles()` call carries different properties depending on the styling approach the user of your component chooses to use. For example, the result could have any form of `{ className: 'myComponent__footer' }`, `{ style: { borderTop: '1px solid silver' } }`, `{ 'data-css-rdsogp': true }`, etc. Use [JSX spread attributes](https://gist.github.com/sebmarkbage/07bbe37bc42b6d4aef81#spread-attributes) to pass these props to the element:

```javascript
<div {...styles('footer')} />
```

### Pass selected style to elements of other substyle-enhanced components

If your component `A` renders another component `B`, itself consisting of multiple element that need to be styleable from the outside, you have to make `B` call the `useStyles` hook, too.
Select styles for the `<B />` element by calling the `styles` function with the key you choose for this element.
Instead of spreading the result of this call to the JSX attributes, you pass it down to `<B />` as the `style` prop.
This ensures that also all nested inline style definitions for elements inside of `<B />` are passed down correctly.
You don't need to and should not pass the `className` or `classNames` props to `<B />`, since the `styles` function instance already carries these information.

```javascript
const aStyles = {}

const A = ({ style, className, classNames }) => {
  const styles = useStyles(aStyles, { style, className, classNames })
  return (
    <div {...styles}>
      <B style={styles('b')} /> // only pass `style` prop
      <div {...styles('footer')} />
    </div>
  )
}

const bStyles = {}

// B still reads all three styling props so it can be used independently from A.
// If B is only ever rendered by A, reading the style prop would be sufficient.
const B = ({ style, className, classNames }) => {
  const styles = useStyles(bStyles, { style, className, classNames })
  return <div {...styles} />
}
```

### Define default styling

The first argument of the `useStyles` takes an object of default styles for all elements.
If the user provides a `style` prop these will be merged with the default styles.
User provided styles take precedence.

```javascript
import useStyles from 'substyle'

const defaultStyle = {
  position: 'absolute',

  close: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
}

const Popover = ({ children, style, className, classNames }) => {
  const styles = useStyles(defaultStyle, { style, className, classNames })
  return (
    <div {...styles}>
      <button {...styles('close')}>x</button>
      {children}
    </div>
  )
}
```

Just like the user provided `style` object, default styles are either applied as inline styles or handled by a css-in-js lib via an adapter.
This means that they take precedence over any css rules matching the user provided `className`.
Users will have to declare any custom style overrides as `!important` in their css.
To make your component's styles easy to customize also via css/css modules you should only define default styles that are essential, meaning that the styles are required for the component to function or you expect users to never override them.

Thus, you should refrain from using rich default styling to ship a beautiful default look of your component.
Rather ship some example styles, or even multiple themes for the component, as extra JavaScript and css files.

### Define style modifiers

In many cases you can distinguish between different variants of how a component looks like based on props or state.
Each of these variants might have slightly different default styles and users must be able to customize styling specifically for each variant.
This means each variant needs to be represented by a specific class name and a specific set of inline styles.

While the default styles object can be created inside the render function using the props and and other variables, in most cases it is preferable to keep default styles as a static object outside of the function scope.
Dynamic styling should instead be expressed as variants using a nested inline styles definition for each modifier key.
Following this best practice, all variant-specific styling will always be customizable also via css.

```javascript
const defaultStyle = {
  position: 'absolute',

  '&align-top': {
    top: 0,
  },

  '&align-bottom': {
    bottom: 0,
  },
}

const MyComponent = ({ align, children, style, className, classNames }) => {
  const [active, setActive] = useState(false)
  const styles = useStyles(
    defaultStyle,
    { style, className, classNames },
    {
      '&active': active,
      [`&align-${align}`]: true,
    }
  )
  return (
    <div {...styles}>
      <div {...styles('header')} />
      {children}
    </div>
  )
}
```

### Highly dynamic default styles

If modifiers are not useful because the dynamic parts of the styles cannot practically be organized in a set of variants, you can still assign direct inline styles to elements using the [`inline` helper function](inlineinlineStylesBefore-styles-inlineStylesAfter).

```javascript
import useStyles, { inline } from 'substyle'

const defaultStyle = {}

const Popover = ({ children, height, style, className, classNames }) => {
  const styles = useStyles(defaultStyle, { style, className, classNames })
  return (
    <div {...inline(styles, { height })}>
      <button {...styles('close')}>x</button>
      {children}
    </div>
  )
}
```

You can also create the default styles object in the scope of the render function, even though we generally recommend against it.
However, in this case, you should definitely make sure that the object is memoized across renders, since otherwise this can lead to noticeable hits on rendering performance.

```javascript
import { useMemo } from 'react'

const Popover = ({ children, height, style, className, classNames }) => {
  const theme = useTheme() // reads the active color theme from context
  const styles = useStyles(
    // memoize default styles to only re-compute them if the theme is updated
    useMemo(
      () => ({
        backgroundColor: theme.color.surface,
      }),
      [theme]
    ),
    { style, className, classNames }
  )
  return (
    ...
  )
}
```

## API

### `useStyles(defaultStyles, overrides[, modifiers]])` (default export)

A React hook returning the [`styles` function](#stylekeys-hook-return-value) that you can use to select the styles for each rendered element.

#### `defaultStyle`

The default styles for your component.
These can also include `modifier` sections to define different styling variants.

> **ATTENTION**
> This should usually be a static object that is defined outside your render function.
> If you need highly dynamic styles, read how to do this best [here](#highly-dynamic-default-styles).

#### `overrides`

Accepts `className`, `classNames` and `style`.

`className` and `classNames` only needs to be set on the root component and will then be distributed through the `style` property.
Doing so ensures that BEM class names are generated correctly.

#### `modifiers`

Defines the [modifiers](#define-style-modifiers) as an object with modifiers as keys and boolean values or as an array of modifiers.

### `styles([keys])` (hook return value)

Calling `styles(key)` returns a new `styles` instance with the nested style definitions for the element identified by `key`. Spread the result into the props passed to the addressed React DOM element.

- The `styles` property on the `styles` function instance (`styles.style`) contains only the direct styles to be applied to the addressed element.
- The `className` property on any instance of the `styles` function (`styles.className`) carries the derived css class to be assigned to the addressed element.
- Depending on the specific substyle adapter the user of your component can optionally use, there might be additional properties assigned to the `styles` function instance, such as `styles.data-css-ex63lys` for example. So instead of picking and passing properties one by one, you should generally spread the `styles` function into the props of an element.

> **Note:** It might appear a bit unconventional to apply the spread operator on a function, but actually a function is also just a JavaScript object that can carry properties.

When addressing an element of a composite component, the result must not be spread but passed to that element as the `style` prop. This requires that the element's component uses the `useStyles` hook as well and has opted-in to allow style overrides.

> **Note:** _styles_ supports chaining, since the return value of _styles_ is another instance of the same function.

#### Arguments

- `key` _(string | Array | Object)_ Specifies the key under which to find the nested style definitions. If the component is used with a `className` prop, a new class name will be derived for the element by appending the key to the base class name.

### `inline([inlineStylesBefore], styles, [inlineStylesAfter])`

This utility function helps to assign inline styles to a DOM element while merging them correctly with the substyle styling props for this element. This is useful for styles that are highly dynamic depending on props.

```javascript
import { inline } from 'substyle'
;<div {...inline(styles('element'), { height: props.height })} />
```

#### Arguments

- `inlineStylesBefore` _(Object)_ Inline styles that might be overriden by user-provided inline styles
- `styles` _(Function)_ The styles function instance addressing the element
- `inlineStylesAfter` _(Object)_ Inline styles that will override any user-provided inline styles
