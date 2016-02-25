# substyle

_substyle_ is a simple helper function for writing reusable React components that are stylable through both, CSS and inline styles. In its core, it is a simple mapping of the `style` and `className` prop values:

```javascript
({ style, className }, key) => ({
  className: key ? className && `${className}__${key}` : className,
  style: key ? style && style[key] : style
})
```


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
