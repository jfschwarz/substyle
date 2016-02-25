# substyle

_substyle_ is a simple helper function for writing reusable React components that are stylable through both, CSS and inline styles. In its core, it is nothing more than a simple mapping of the `style` and `className` prop values:

```javascript
({ style, className }, key) => ({
  className: key ? className && `${className}__${key}` : className,
  style: key ? style && style[key] : style
})
```

## Motivation

First, let's clarify the term _reusable component_. Reuse here does NOT mean components being used in multiple other components inside a single React application, but refers to **reuse across multiple applications**. Thus, reusable components are usually distributed as npm modules. While you can of course include CSS files in npm modules, there is no way of actually coupling reusable components and their stylesheets without making assumptions about the environment. Many libraries make do with using some prefixed class names and pointing users to a CSS file in the readme, however, this has the following problems: It's all too easy to forget about including the CSS (or removing it once the component is not used anymore) and there's always a risk of global class name conflicts.

Eliminating CSS in favor of inline styles solves these problems as inline style definitions are properly coupled with components and there is no need to deal with global class names. ...


## Example

Let's create a reusable `Popover` component using _substyle_:

```javascript
const Popover = (props) => (
  <div {...substyle(props)}>
    <button {...substyle(props, 'close')}>x</button>
    { props.children }
  </div>
)
```

That's it: Our `Popover` component can now be used with CSS as well as with inline styles.

##### For using CSS, assign `className`

```javascript
// JSX                                        // Rendered HTML

<Popover className="popover">                 // <div class="popover">
  ...                                         //   <button class="popover__close">x</button>
</Popover>                                    //   ...
                                              // </div>
```

##### For using inline styles, assign `style`

```javascript
// JSX                                        // Rendered HTML
                         
<Popover style={{                             // <div style="background: white;">
  background: 'white',                        //   <button style="right: 0;">x</button>
  close: { right: 0 }                         //   ...  
}}>                                           // </div>
  ...                                  
</Popover>
```

So what does this achieve? First, it assigns class names derived from the element's `className` prop. If the component is used without a `className`, it's safe to assume that none of the child elements require a class name to be set. Second, if a `style` object is supplied to the element, it selects the nested sub object under the specified key for the child element. By using the same keys for derived class names and nested element style definitions, a consistent naming scheme is established.
