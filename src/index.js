import { ApolloServer, gql } from 'apollo-server'

import data from './data.js'

const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    born: Int! 
  }

  type Book {
    id: ID!
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
  }
`

const resolvers = {
  Query: {
    bookCount: () => data.books.length,
    authorCount: () => data.authors.length
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
