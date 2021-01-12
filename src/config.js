import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT

let MONGODB_URL = process.env.MONGODB_URL

export default {
  MONGODB_URL,
  PORT
}
