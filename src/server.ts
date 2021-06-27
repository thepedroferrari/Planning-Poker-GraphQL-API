import { ApolloServer, PubSub } from "apollo-server-express"
import cors from "cors"
import express from "express"
import session from "express-session"
import { connectDb } from "./db"
import "./env"
import { resolvers } from "./resolvers/resolvers"
import { typeDefs } from "./schema/schema"
import { cookieSettings } from "./settings/cookieSettings"
import { corsSettigs } from "./settings/corsSettings"
import { graphqlServerOptions } from "./settings/graphqlServerOptions"

const pubsub = new PubSub()

async function startApolloServer() {
  // GraphQL Layer
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res, pubsub }),
  })

  await server.start()

  // Express APP
  const app = express()
  app.set("trust proxy", 1)
  app.use(session(cookieSettings))
  app.use(cors(corsSettigs))
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  server.applyMiddleware({ app })

  await new Promise(() => {
    app.listen(8000)
    console.log(`🚀 Server ready at http://localhost:${graphqlServerOptions.port}${server.graphqlPath}`)
  })
  return { server, app }
}

connectDb().then(async () => {
  startApolloServer()
})
