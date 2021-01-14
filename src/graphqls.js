import { gql } from 'apollo-server'

import Author from './models/author.js'
import Book from './models/book.js'

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
    bookCount: async () => {
      const res = await Book.find()
      return res.length
    },
    authorCount: async () => {
      const res = await Author.find()
      return res.length
    },
    allBooks: async (_, args) => {
      let res = await Book.find()

      if (args.author) {
        res = res.filter(book => book.author.name === args.author)
      }

      if (args.genre) {
        res = res.filter(book => book.genres.includes(args.genre))
      }

      return res
    },
    allAuthors: async () => await Author.find()
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id })
      return books.length
    }
  },
  Book: {
    author: async (root) => {
      const author = await Author.findById(root.author)
      return {
        id: author.id,
        name: author.name,
        born: author.born
      }
    }
  },
  Mutation: {
    addBook: async (_, args) => {
      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = await new Author({ name: args.author }).save()
      }

      const book = await new Book({
        title: args.title,
        published: args.published,
        author,
        genres: args.genres
      }).save()

      return book
    },
    editAuthor: async (_, args) => {
      let author = await Author.findOne({ name: args.name })

      if (author) {
        author.born = args.born
        await author.save()
      }

      return author
    }
  }
}

export { typeDefs, resolvers }
