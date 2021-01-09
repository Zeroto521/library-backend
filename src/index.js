import pkg from 'apollo-server'

const { ApolloServer, gql } = pkg

import data from './data.js'

const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    born: Int!
    authorCount: Int
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
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
`

const resolvers = {
  Query: {
    bookCount: () => data.books.length,
    authorCount: () => data.authors.length,
    allBooks: (_, args) => {
      let res = data.books
      if (args.author) {
        res = res.filter(book => book.author === args.author)
      }

      if (args.genre) {
        res = res.filter(book => book.genres.includes(args.genre))
      }

      return res
    },
    allAuthors: () => data.authors
  },
  Author: {
    authorCount: (root) => {
      return data.books.filter(book => book.author === root.name).length
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
