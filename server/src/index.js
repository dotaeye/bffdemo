import { GraphQLServer, PubSub } from 'graphql-yoga'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import queryComplexity, { simpleEstimator } from 'graphql-query-complexity'
import depthLimit from 'graphql-depth-limit'
import config from './config'
import { typeDefs, resolvers } from './graphql'
import buildloaders from './graphql/dataloader'
import services from './services'

const pubsub = new PubSub()
const port = 4600

const complexityRule = queryComplexity({
  maximumComplexity: 500,
  variables: {},
  onComplete: complexity => {
    console.log('Determined query complexity: ', complexity)
  },
  createError: (max, actual) => {
    return new Error(
      `Query is too complex: ${actual}. Maximum allowed complexity: ${max}`
    )
  },
  estimators: [
    simpleEstimator({
      defaultComplexity: 1
    })
  ]
})

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => {
    let user = null
    if (req.request) {
      const Authorization = req.request.get('Authorization')
      if (Authorization) {
        let authInfo = null
        try {
          // authInfo = jwt.verify(Authorization, config.jwt.secret)
          authInfo = 'isAuthenticated'
        } catch (e) {}
        user = authInfo
      }
    }

    let context = {
      ...req,
      user,
      services,
      config,
      pubsub
    }
    const dataloaders = buildloaders(context)
    context = Object.assign(context, {
      dataloaders
    })
    return context
  }
})

const options = {
  playground: '/',
  validationRules: [depthLimit(5)],
  formatResponse: gqlResponse => {
    return {
      ...gqlResponse,
      code: gqlResponse.errors && gqlResponse.errors.length > 0 ? 200 : 0,
      message: '',
      now: Date.now()
    }
  },
  port
}

server.start(options, () => {
  console.log(
    `Server started, url  http://localhost:${port} for incoming requests.`
  )
})
