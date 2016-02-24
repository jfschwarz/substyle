# substyle
Universal styling for reusable React components

## Example

Let's create a reusable `Popover` component:

```javascript
const Popover = (props) => (
  <div {...substyle(props)}>
    <button {...substyle(props, 'close')}>x</button>
    { props.children }
  </div>
)
```

By using _substyle_, our `Popover` component can now be used with CSS as well as with inline styles:

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


