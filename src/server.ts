import { ApolloServer, PubSub } from "apollo-server-express"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import session from "express-session"
import http from "http"
import { connectDb } from "./db"
import "./env"
import { JWT_SECRET, ROOT_DOMAIN } from "./env"
import { resolvers } from "./resolvers/resolvers"
import { typeDefs } from "./schema/schema"
import { cookieSettings } from "./settings/cookieSettings"
import { corsSettigs } from "./settings/corsSettings"
import { graphqlServerOptions } from "./settings/graphqlServerOptions"

const PORT = graphqlServerOptions.port
const pubsub = new PubSub()

async function startApolloServer() {
  // GraphQL Layer
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res, pubsub }),
    introspection: true,
    playground: true,
  })

  await server.start()

  // Express APP
  const app = express()
  app.set("trust proxy", 1)
  app.use(session(cookieSettings))
  app.use(cors(corsSettigs))
  app.use(cookieParser(JWT_SECRET))
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  server.applyMiddleware({ app, cors: false })

  const httpServer = http.createServer(app)
  server.installSubscriptionHandlers(httpServer)

  await new Promise((resolve) => httpServer.listen(PORT, resolve as () => void))
  console.info(
    `🚀 Server ready at https://${ROOT_DOMAIN}:${PORT}${server.graphqlPath}`,
  )
  console.info(
    `🚀 Subscriptions ready at wss://${ROOT_DOMAIN}:${PORT}${server.subscriptionsPath}`,
  )
  return { server, app, httpServer }
}

connectDb().then(async () => {
  startApolloServer()
})
