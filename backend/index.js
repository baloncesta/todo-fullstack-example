import { ApolloServer, gql } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  enum TodoStatus {
    active
    complete
  }
  type Todo {
    id: ID!
    description: String!
    # temp
    status: TodoStatus!
  }

  type TodoResponse {
    todo: Todo!
  }

  type Query {
    todos: [Todo]
  }

  type Mutation {
    createTodo(description: String!, status: TodoStatus!): TodoResponse!
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    todos: () => [{ id: 1, description: 'foo', status: 'active' }],
  },
  Mutation: {
    createTodo: (ctx, payload) => {
      return {
        todo: { id: 1, description: payload.description, status: 'active' },
      }
    },
  },
}

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
}

async function startApolloServer(typeDefs, resolvers) {
  const app = express()
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    cors: corsOptions,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
  await server.start()
  server.applyMiddleware({ app })
  await new Promise((resolve) => httpServer.listen({ port: 3001 }, resolve))
  console.log(`🚀 Server ready at http://localhost:3001${server.graphqlPath}`)
}
startApolloServer(typeDefs, resolvers)
// import { ApolloServer, gql } from 'apollo-server-express'
// import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
// import http from 'http'
// import express from 'express'
// import cors from 'cors'
// // import datum from './data.js'
// const PORT = 3001

// const server = async () => {
//   const app = express()
//   const httpServer = http.createServer(app)
// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true,
// }
//   app.use(cors(corsOptions))

// // Construct a schema, using GraphQL schema language
// const typeDefs = gql`
//   type Todo {
//     id: ID!
//     description: String!
//     # temp
//     status: String!
//   }
//   type Query {
//     getTodos: [Todo]
//   }
// `

// // Provide resolver functions for your schema fields
// const resolvers = {
//   Query: {
//     getTodos: () => [{ id: 1, description: 'foo', status: 'active' }],
//   },
// }
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     csrfPrevention: true,
//     plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   })
//   await server.start()
//   server.applyMiddleware({ app, cors: corsOptions })
//   app.listen({ port: 4000 }, () =>
//     console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
//   )
// }
// server()
// // const data = datum
// // app.use(cors())
// // // jsonGraphqlExpress.default(data)
// // app.use('/graphql', (req, res) => {
// //   res.send({})
// // })
// // app.listen(PORT, () => {
// //   console.log(`listening on port: ${PORT}`)
// // })
