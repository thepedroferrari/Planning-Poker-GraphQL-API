import path from "path"
import dotenvSafe from "dotenv-safe"

// Load environment configuration
dotenvSafe.config({
  path: path.resolve(__dirname, "..", ".env"),
  example: path.resolve(__dirname, "..", ".env.example"),
})

export const {
  MONGO_URL,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_DB_NAME,
  COOKIE_SECRET,
  JWT_SECRET,
  ROOT_DOMAIN,
  SERVER_PORT,
} = <{ [key: string]: string }>process.env
