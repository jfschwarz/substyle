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
import { useStyle } from 'substyle'

const Popover = props => {
  const style = useStyle(props)
  return (
    <div {...style}>
      <button {...style('close')}>x</button>
      {props.children}
    </div>
  )
}
```

That's all there is for making the styles of the container `div` and the `button` element customizable by users of the `Popover` component.

##### For using css, assign `className`

```javascript
// JSX                                        // Rendered HTML

<Popover className="popover">                 // <div class="popover">
  <span>Hello world!</span>                   //   <button class="popover__close">x</button>
</Popover>                                    //   <span>Hello world!</span>
                                              // </div>
```

##### For using inline styles, assign `style`

```javascript
// JSX                                        // Rendered HTML

<Popover style={{                             // <div style="background: white;">
  background: 'white',                        //   <button style="right: 0;">x</button>
  close: { right: 0 },                        //   <span>Hello world!</span>
}}>                                           // </div>
  <span>Hello world!</span>
</Popover>
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

If your component `A` renders another component `B`, itself consisting of multiple element that need to be styleable from the outside, you have to make `B` call the `useStyle` hook, too.
Select styles for the `<B />` element by calling the `style` prop with the key you choose for this element. Instead of spreading the result of this call to the JSX attributes,
you pass it down to `<B />` as the `style` prop. This ensures that also all nested inline style definitions for elements inside of `<B />` are passed down.

```javascript
const A = props => {
  const style = useStyle(props)
  return (
    <div {...style}>
      <B style={style('b')} />
      <div {...style('footer')} />
    </div>
  )
}
```

### Define default styling

```javascript
import { createUseStyle } from 'substyle'

const useStyle = createUseStyle({
  position: 'absolute',

  close: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
})

const Popover = props => {
  const style = useStyle(props)
  return (
    <div {...style}>
      <button {...style('close')}>x</button>
      {props.children}
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
const useStyle = createUseStyle(
  {
    position: 'absolute',

    '&align-top': {
      top: 0,
    },

    '&align-bottom': {
      bottom: 0,
    },
  },
  ({ small, align = 'top' }) => ({
    '&small': small,
    [`&align-${align}`]: true,
  })
)
```

If variants of the component are defined for different values of internal component states, you can merge state values with props in the `useStyle` hook call:

```javascript
const MyComponent = props => {
  const [active, setActive] = useState(false)
  const style = useStyle({
    ...props,
    active,
  })
  return (
    <div {...style}>
      <div {...style('header')} />
      {props.children}
    </div>
  )
}
```

### Organize default styles

- essential styles (required so that the component is functional): co-located with component using `createUseStyle`
- some beautiful example styles/different themes: as extra JavaScript file, css file, or both

## API

The default export of the _substyle_ module is a higher-order component for enhancing a React component class by injecting the special ´style´ prop.

#### `useStyle(props)` (default export)

Returns the [`style` function](#stylekeys-hook-return-value) that is configured as per the passed `style`, `className`, and `classNames` props.

#### Arguments

- `props` _(Object)_ The props of the component

There is an additional creator function for the hook that allows to define some default style definitions:

#### `createUseStyle([defaultStyles], [mapPropsToModifiers], [getDependsOn])`

Returns a version of the `substyle` higher-order component which is preconfigured to merge `defaultStyles` with user specified style definitions.

#### Arguments

- `defaultStyles` _(Object | Function: (props) => Object)_ The default style definitions for the component. It can also be defined as a function mapping props to an object of default styles.

- `mapPropsToModifiers` _(Function: (props) => string[] | Object)_ If specified, the function will be called with props and must return [modifiers](#define-style-modifiers) as an object with modifiers as keys and boolean values or as an array of modifiers.

- `getDependsOn()` _(Function: (nextProps, props) => boolean)_ This prop is useful to optimize performance if the `defaultStyles` parameter is defined as a function. `getDependsOn` will be called with props and must return an array of dependencies. If any of the values in this array changes compared to the previous render, the default styles will be recalculated, otherwise the memoized styles from the last render will be used.

### `style([keys])` (hook return value)

Calling `style(key)` returns a new `style` instance with the nested style definitions for the element identified by `key`. Spread the result into the props passed to the addressed React DOM element.

- The `style` property on the `style` function instance (`style.style`) contains only the direct styles to be applied to the addressed element.
- The `className` property on any instance of the `style` function (`style.className`) carries the derived css class to be assigned to the addressed element.
- Depending on the specific substyle adapter the user of your component can optionally use, there might be additional properties assigned to the `style` function instance, such as `style.data-css-ex63lys` for example. So instead of picking and passing properties one by one, you should generally spread the `style` function into the props of an element.

> **Note:** It might appear a bit unconventional to apply the spread operator on a function, but actually a function is also just a JavaScript object than can carry properties.

When addressing an element of a composite component, the result must not be spread but passed to that element as the `style` prop. This requires that the element's component uses the `useStyle` hook as well.

> **Note:** _style_ supports chaining, since the return value of _style_ is another instance of the same function.

#### Arguments

- `key` _(string | Array | Object)_ Specifies the key under which to find the nested style definitions. If the component is used with a `className` prop, a new class name will be derived for the element by appending the key to the base class name.
