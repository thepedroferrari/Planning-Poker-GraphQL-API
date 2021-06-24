import { GraphQLServer } from "graphql-yoga"

import { typeDefs } from "./schema/schema"
import { resolvers } from "./resolvers/resolvers"

const options = {
  port: 8000,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(options, ({ port }) => {
  console.log(`Server started on https://localhost:${port}/`)
})
