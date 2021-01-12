import { gql } from 'apollo-server'
import { v1 as uuidv1 } from 'uuid'
import pkg from 'apollo-server'

import data from './data.js'

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
    author: Author!
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

    editAuthor(
      name: String!
      born: Int!
    ): Author    
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
        const author = {
          name: args.author,
          id: uuidv1(),
        }
        data.authors = data.authors.concat(author)
      }
      const book = { ...args, id: uuidv1() }
      data.books = data.books.concat(book)

      return book
    },
    editAuthor: (_, args) => {
      let author = data.authors.find(author => author.name === args.name)
      if (author) {
        author = { ...author, born: args.born }
        const otherAuthors = data.authors.filter(author => author.name !== args.name)
        data.authors = [...otherAuthors, author]
      } else {
        return null
      }

      return author
    }
  }
}

export { typeDefs, resolvers }
