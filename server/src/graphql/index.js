import fs from 'fs'
import path from 'path'

const root = path.join(__dirname)
const resolvers = []
const schemas = []

schemas.push(`
  type Query {
    appName: String!
  }
`)

schemas.push(`
  type Mutation {
    setAppName: String
  }
`)

schemas.push(`
  type Subscription {
    AppName: String
  }
`)

const batchFolders = ['schema', 'resolver']

batchFolders.forEach(folder => {
  const folderPath = path.join(root, folder)
  fs.readdirSync(folderPath).forEach(filename => {
    const item = require(path.join(folderPath, filename))
    folder === 'schema' ? schemas.push(item) : resolvers.push(item)
  })
})

module.exports = {
  typeDefs: schemas,
  resolvers
}
