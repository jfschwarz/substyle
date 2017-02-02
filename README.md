# substyle

There are a lot of competing styling approaches for React applications, from good old css and css modules to inline styles and css-in-js solutions. How can authors of component libraries make sure that component styles can be seamlessly integrated and customized in any application?

_substyle_ is a simple utility for building universally stylable React components. By using _substyle_ your components will support styling through:

- css ([BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) class names)
- css modules
- inline styles (pure and with [Radium](http://formidable.com/open-source/radium/))
- [Aphrodite](https://github.com/Khan/aphrodite)
- [React Style](https://github.com/js-next/react-style),
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

TODO

### Select style for element

### Pass selected style to string type elements

### Pass selected style to component type elements

### Define default styling

### Define style modifiers

- based on props, as second arg to defaultStyle
- based on state, by deriving a modified style (recommend hoisting state, e.g., recompose withState)

### Organize default styles

- essential styles: co-located with component
- nice example styles/different themes: extra export, css file, or both


## API

The default export of the _substyle_ module is a facade around `defaultStyle`, providing a more versatile API. It's a function that can be be used as a higher-order component for enhancing a React component class by injecting the special ´style´ prop.

#### `substyle(Component)` (default export as higher-order component)

Returns an enhanced version of `Component` which supports `style`, `className`, and `classNames` props and maps them to a single [special `style` prop]().

#### Arguments

- `Component` _(React component)_

The same function can also be used as a factory. This allows to define default styles and modifiers:

#### `substyle([defaultStyles], [mapPropsToModifiers])` (default export as higher-order component factory)

`Returns a version of the higher-order component that is preconfigured to merge `defaultStyles` with user specified style definitions.

#### Arguments

- `defaultStyle` _(Object)_ If specified,

- `mapPropsToModifiers(): modifiers` _(Function | Object)_ If specified,


Enhancing a component with the _substyle_ higher-order function injects a function as the `style` prop. This function has properties assigned to it which are supposed to be passed as props to the root element returned by the component's render function.

### `style([keys])` (injected prop)

Returns a new `style` instance with the nested style definitions for the passed `key`. The return value can be passed as `style` prop to an element of a substyle-enabled component or spread into the props of a DOM element.

It might seem a bit weird at first to use the spread operator on a function, but a function is also just a JavaScript object which supports setting, getting--and spreading--properties.

The `style` property on any instance of the `style` function (`style.style`) contains only the direct styles

_style_ supports chaining, since the return value of _style_ is another instance of the same function.

#### Arguments

- `key` _(string | Array | Object)_ Specifies the key under which to find the nested style definitions. If the component is used with a `className` prop, a new class name will be derived for the element by appending the key to the base class name.
