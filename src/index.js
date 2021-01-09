import { v1 as uuidv1 } from 'uuid'
import pkg from 'apollo-server'

import data from './data.js'

const { ApolloServer, gql } = pkg

const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int
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

  type Mutation {
    addBook(
      title: String!
      author: String
      published: Int!
      genres: [String!]!
    ): Book
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
    bookCount: (root) => {
      return data.books.filter(book => book.author === root.name).length
    }
  },
  Mutation: {
    addBook: (_, args) => {
      if (!data.authors.find(author => author.name === args.author)) {
        data.authors.concat({
          name: args.author,
          id: uuidv1(),
        })

      }
      const book = { ...args, id: uuidv1() }
      data.books = data.books.concat(book)

      return book
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
