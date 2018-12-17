const isAuthenticated = (root, args, context, info) => {
  if (!context.user) {
    return new Error('Not authenticated')
  }
}

export { isAuthenticated }
