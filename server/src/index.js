import { GraphQLServer, PubSub } from 'graphql-yoga'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import Mock from 'mockjs'
import queryComplexity, { simpleEstimator } from 'graphql-query-complexity'
import { express as expressVoyager } from 'graphql-voyager/middleware'
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

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const Random = Mock.Random
const min = 100
const max = 99999
const mocks = {
  Int: () => Random.natural(min, max),
  Float: () => Random.float(min, max),
  String: () => Random.ctitle(10, 5),
  Date: () => Random.time()
}
addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true })

const server = new GraphQLServer({
  schema,
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
  formatError: err => {
    const originalError = (err && err.originalError) || {}
    console.log('formatError')
    return {
      ...err,
      noAuth: originalError.name === 'AuthorizationError'
    }
  },
  formatResponse: res => {
    console.log('formatResponse')
    return {
      ...res,
      code: res.errors && res.errors.length > 0 ? 200 : 0,
      message: '',
      now: Date.now()
    }
  },
  port
}

server.express.use('/voyager', expressVoyager({ endpointUrl: '/' }))

server.start(options, () => {
  console.log(
    `Server started, url  http://localhost:${port} for incoming requests.`
  )
})
