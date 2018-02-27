# substyle

There are a lot of competing styling approaches for React applications, from good old css and css modules to inline styles and css-in-js solutions. How can authors of component libraries make sure that component styles can be seamlessly integrated and customized in any application?

_substyle_ is a simple utility for building universally stylable React components. By using _substyle_ your components will support styling through:

- css ([BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) class names)
- css modules
- inline styles (pure and with [Radium](http://formidable.com/open-source/radium/))
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
import substyle from 'substyle'

const Popover = ({ style, children }) => (
  <div {...style}>
    <button {...style('close')}>x</button>
    { children }
  </div>
)

export default substyle(Popover)
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

In some cases, it is also useful to select multiple styles for the same element. This allows to separate some more specific style definitions from base styles shared with other elments, so that the user would have to provide custom definitions for these base styles only once.

```javascript
style(['item', 'item-last'])
```

### Pass selected style to simple elements

The return value of any `style()` call carries different properties depending on the styling approach the user of your component chooses to use. For example, the result could have any form of `{ className: 'myComponent__footer' }`, `{ style: { borderTop: '1px solid silver' } }`, `{ 'data-css-rdsogp': true }`, etc. Use [JSX spread attributes](https://gist.github.com/sebmarkbage/07bbe37bc42b6d4aef81#spread-attributes) to pass these props to the element:

```javascript
<div {...style('footer')} />
```

### Pass selected style to elements of other substyle-enhanced components

If your component `A` renders another component `B`, itself consisting of multiple element that need to be stylable from the outside, you have to enhance `B` with the `substyle` higher-order component, too.
Select styles for the `<B />` element by calling the `style` prop with the key you choose for this element. Instead of spreading the result of this call to the JSX attributes,
you pass it down to `<B />` as the `style` prop. This ensures that also all nested inline style definitions for elements inside of `<B />` are passed down.

```javascript
const A = (props) => (
  <div {...props.style}>
    <B style={props.style('b')} />
    <div {...style('footer')} />
  </div>
)
```

### Define default styling

```javascript
import { defaultStyle } from 'substyle'

const Popover = ({ style, children }) => (
  <div {...style}>
    <button {...style('close')}>x</button>
    { children }
  </div>
)

const styled = defaultStyle({
  position: 'absolute',

  close: {
    position: 'absolute',
    top: 0,
    right: 0
  }
})
export default style(Popover)
```

### Define style modifiers

In many cases you can distinguish between different variants of how a component looks like based on props.
Each of these variants might have slightly different default styles and users must be able to customize styling
specifically for each variant. This means each variant needs to be represented by a specific class name and a specific
set of inline styles.

While default styles can be provided as a function on props, in most cases it is preferrable to keep default styles as
a static object with the dynamic styling expressed as variants using a nested inline styles definition for each modifier key.
Following this best practice, all variant-specific styling will always be customizable also via css.

```javascript
const styled = defaultStyle({
  position: 'absolute',

  '&align-top': {
    top: 0,
  },

  '&align-bottom': {
    bottom: 0,
  }
}, ({ small, align = 'top'}) => ({
  '&small': small,
  [`&align-${align}`]: true,
}))
```

If variants of the component are defined for different values of internal component states instead of props, you can select the modifiers also inside the component's render function.
To do this, call with `style` prop with the modifier keys first to derive a new instance of the `style` prop that you can then call with element keys and spread as JSX attributes.

```javascript
render() {
  const modifiedStyle = this.props.style({
    '&active': this.state.active
  })
  return (
    <div {...modifiedStyle}>
      <div {...modifiedStyle('header')} />
      ...
    </div>
  )
}
```

An alternative, potentially simpler, approach is lifting the component state further up, e.g., using recompose's `withState`, so that the state values are available as props for you to define the props to modifier keys mapping for `defaultStyle`.

### Organize default styles

- essential styles (required so that the component is functional): co-located with component using `defaultStyle`
- some beautiful example styles/different themes: as extra JavaScript file, css file, or both


## API

The default export of the _substyle_ module is a higher-order component for enhancing a React component class by injecting the special ´style´ prop.

#### `substyle(Component)` (default export)

Returns an enhanced version of `Component` which supports `style`, `className`, and `classNames` props and maps them to a single [special `style` prop](#stylekeys-injected-prop).

#### Arguments

- `Component` _(React component)_ The component to enhance. This component will be rendered with special `style` prop. It will *not* receive the original `style`, `className`, and `classNames` passed to the enhanced version of the component.


There is an additional higher-order component creator function that allows to attach default style definitions for the wrapped component:

#### `defaultStyle([defaultStyles], [mapPropsToModifiers], [shouldUpdate])`

Returns a version of the `substyle` higher-order component which is preconfigured to merge `defaultStyles` with user specified style definitions.

#### Arguments

- `defaultStyles` _(Object | Function: (props) => Object)_ The default style definitions for the component. Also accepts a function mapping props to an object of default styles.

- `mapPropsToModifiers` _(Function: (props) => string[] | Object)_ If specified, the function will be called with props and must return [modifiers](#define-style-modifiers) as an object with modifiers as keys and boolean values or as an array of modifiers.

- `shouldUpdate(): booolean` _(Function: (nextProps, props) => boolean)_ Only useful, if `defaultStyles` parameter is a function. `shouldUpdate` must return `true` if the result of that function will change for the new `props`. This enables some performance optimizations as it prevents unnecessary merges of default styles with user provided inline styles.


Enhancing a component with the _substyle_ higher-order function injects a function as the `style` prop. This function has properties assigned to it which are supposed to be passed as props to the root element returned by the component's render function.

### `style([keys])` (injected prop)

Returns a new `style` instance with the nested style definitions for the passed `key`. The return value can be passed as `style` prop to an element of a substyle-enabled component or spread into the props of a DOM element.

It might seem a bit weird at first to use the spread operator on a function, but a function is also just a JavaScript object which supports setting, getting--and spreading--properties.

The `style` property on any instance of the `style` function (`style.style`) contains only the direct styles

_style_ supports chaining, since the return value of _style_ is another instance of the same function.

#### Arguments

- `key` _(string | Array | Object)_ Specifies the key under which to find the nested style definitions. If the component is used with a `className` prop, a new class name will be derived for the element by appending the key to the base class name.
