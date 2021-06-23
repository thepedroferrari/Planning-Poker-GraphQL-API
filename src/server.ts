import { GraphQLServer } from "graphql-yoga"

import { typeDefs } from "./schema/schema"
import { resolvers } from "./resolvers/resolvers"

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(({ port }) => {
  console.log(`Server started on https://localhost:${port}/`)
})
