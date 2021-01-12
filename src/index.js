import { ApolloServer } from 'apollo-server'
import mongoose from 'mongoose'

import { typeDefs, resolvers } from './graphqls.js'
import config from './config.js'
import logger from './logger.js'

logger.info('connecting to', config.MONGODB_URL)
mongoose.connect(config.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  logger.info('connected to MongoDB')
}).catch((error) => {
  logger.info('error connecting to MongoDB:', error.message)
})

const server = new ApolloServer({ typeDefs, resolvers })

server.listen(config.PORT).then(({ url }) => {
  logger.info(`Server ready at ${url}`)
})
