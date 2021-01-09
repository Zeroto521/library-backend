import pkg from 'apollo-server'

const { ApolloServer, gql } = pkg

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
    allBooks: [Book!]!
  }
`

const resolvers = {
  Query: {
    bookCount: () => data.books.length,
    authorCount: () => data.authors.length,
    allBooks: () => data.books
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
