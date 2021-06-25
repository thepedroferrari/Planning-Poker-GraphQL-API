import { GraphQLServer, PubSub } from "graphql-yoga"

import { typeDefs } from "./schema/schema"
import { resolvers } from "./resolvers/resolvers"

const options = {
  port: 8000,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
}

const pubsub = new PubSub()
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })

server.start(options, ({ port }) => {
  console.log(`Server started on https://localhost:${port}/`)
})
