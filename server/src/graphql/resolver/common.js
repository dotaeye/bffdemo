module.exports = {
  Query: {
    appName: async (root, data, context) => {
      return 'App Name'
    }
  },

  Mutation: {
    setAppName: async (root, data, context) => {
      return 'Set App Name'
    }
  }
}
