const inline = (...args) =>
  args.reduce(
    (result, arg) => ({
      ...result,
      ...(typeof arg === 'function' ? arg : {}),
      style: {
        ...result.style,
        ...(typeof arg === 'function' ? arg.style : arg),
      },
    }),
    {}
  )

export default inline
