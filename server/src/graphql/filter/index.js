export class AuthorizationError extends Error {
  constructor(message) {
    super(message) // (1)
    this.name = 'AuthorizationError' // (2)
  }
}

export const isAuthenticated = (root, args, context, info) => {
  if (!context.user) {
    return new AuthorizationError('Not authenticated')
  }
}
