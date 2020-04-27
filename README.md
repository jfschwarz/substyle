# substyle

There are a lot of competing styling approaches for React applications, from good old css and css modules to inline styles and css-in-js solutions. How can authors of component libraries make sure that component styles can be seamlessly integrated and customized in any application?

_substyle_ is a simple utility for building universally styleable React components. By using _substyle_ your components will support styling through:

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
import { useStyles } from 'substyle'

const defaultStyle = {
  position: 'relative',

  close: {
    position: 'absolute',

    top: 10,
    right: 10,
  },
}

const Popover = ({ className, style, children }) => {
  const styles = useStyles(defaultStyle, { className, style })

  return (
    <div {...styles}>
      <button {...styles('close')}>x</button>

      <span>{children}</span>
    </div>
  )
}
```

That's all there is for making the styles of the container `div` and the `button` element customizable by users of the `Popover` component.

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

## How to use it

### Select style for an element

For getting the styling props to pass to an element returned by your component's render functions, call the `style` function with a key that identifies this element.

```javascript
style('footer')
```

In some cases, it is also useful to select multiple styles for the same element. This allows to separate some more specific style definitions from base styles shared with other elements, so that the user would have to provide custom definitions for these base styles only once.

```javascript
style(['item', 'item-last'])
```

### Pass selected style to simple elements

The return value of any `style()` call carries different properties depending on the styling approach the user of your component chooses to use. For example, the result could have any form of `{ className: 'myComponent__footer' }`, `{ style: { borderTop: '1px solid silver' } }`, `{ 'data-css-rdsogp': true }`, etc. Use [JSX spread attributes](https://gist.github.com/sebmarkbage/07bbe37bc42b6d4aef81#spread-attributes) to pass these props to the element:

```javascript
<div {...style('footer')} />
```

### Pass selected style to elements of other substyle-enhanced components

If your component `A` renders another component `B`, itself consisting of multiple element that need to be styleable from the outside, you have to make `B` call the `useStyles` hook, too.
Select styles for the `<B />` element by calling the `style` prop with the key you choose for this element. Instead of spreading the result of this call to the JSX attributes,
you pass it down to `<B />` as the `style` prop. This ensures that also all nested inline style definitions for elements inside of `<B />` are passed down.
Be aware that components need to opt-in to making their styles customizable.
Doing so ensure that you can decide when style should be part of your API.
To enable `B` to accept styles from a parent component you need to pass the `style` prop to the hook.

```javascript
const aStyles = {}

const A = () => {
  const styles = useStyles(aStyles)
  return (
    <div {...styles}>
      <B style={styles('b')} />
      <div {...styles('footer')} />
    </div>
  )
}

const bStyles = {}

const B = ({ style }) => {
  const styles = useStyles(bStyles, { style })

  return <div {...styles} />
}
```

### Define default styling

```javascript
import { useStyles } from 'substyle'

const defaultStyle = {
  position: 'absolute',

  close: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
}

const Popover = ({ children }) => {
  const styles = useStyles(defaultStyle)
  return (
    <div {...styles}>
      <button {...styles('close')}>x</button>
      {children}
    </div>
  )
}
```

### Define style modifiers

In many cases you can distinguish between different variants of how a component looks like based on props.
Each of these variants might have slightly different default styles and users must be able to customize styling specifically for each variant.
This means each variant needs to be represented by a specific class name and a specific set of inline styles.

While default styles can be provided as a function on props, in most cases it is preferable to keep default styles as a static object with the dynamic styling expressed as variants using a nested inline styles definition for each modifier key.
Following this best practice, all variant-specific styling will always be customizable also via css.

```javascript
const defaultStyles = {
  position: 'absolute',

  '&align-top': {
    top: 0,
  },

  '&align-bottom': {
    bottom: 0,
  },
}
```

If variants of the component are defined for different values of internal component states, you can merge state values with props in the `useStyles` hook call:

```javascript
const MyComponent = ({ align, children }) => {
  const [active, setActive] = useState(false)
  const styles = useStyles(defaultStyle, {
    '&active': active,
    [`&align-${align}`]: true,
  })
  return (
    <div {...styles}>
      <div {...styles('header')} />
      {children}
    </div>
  )
}
```

### Organize default styles

- essential styles (required so that the component is functional): co-located with component using `createUseStyle`
- some beautiful example styles/different themes: as extra JavaScript file, css file, or both

## API

### `useStyles(defaultStyles[, modifiers][, overrides])` (default export)

Returns the [`styles` function](#stylekeys-hook-return-value) that is configured as per the passed `style`, `className`, and `classNames` props.

#### `defaultStyle`

The default styles for your component.
These can also include `modifier` sections to express that your component should look different when the outside conditions change.

> **ATTENTION**
> This should usually be a static object that is defined outside your render function.
> If you define this inside your render function this may result in performance degradations as `substyle` will recalculate styles all the time.
> If you need to make this object dynamic please only update it when the respective dynamic parts change.

#### `modifiers`

Defines the [modifiers](#define-style-modifiers) as an object with modifiers as keys and boolean values or as an array of modifiers.

#### `overrides`

Accepts `className`, `classNames` and `style`.
Use this if you want to make styles part of the components API.

`className` only needs to be set on the root component and will then be distributed through the `style` property.
Doing so ensures that BEM class names are generated correctly.

> **Note:** If it is not for theming purposes, you should generally avoid defining the `defaultStyles` as a function on props. Styles depending dynamically on props should rather be defined as inline styles directly. The [`inline` util function](#inlineinlineStylesBefore-style-inlineStylesAfter) comes in handy for doing so.

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

### `inline([inlineStylesBefore], style, [inlineStylesAfter])`

This utility function helps to assign inline styles to a DOM element while merging them correctly with the substyle styling props for this element. This is useful for styles that are highly dynamic depending on props.

```javascript
import { inline } from 'substyle'
;<div {...inline(style('element'), { height: props.height })} />
```

#### Arguments

- `inlineStylesBefore` _(Object)_ Inline styles that might be overriden by user-provided inline styles
- `style` _(Function)_ The style function instance addressing the element
- `inlineStylesAfter` _(Object)_ Inline styles that will override any user-provided inline styles
