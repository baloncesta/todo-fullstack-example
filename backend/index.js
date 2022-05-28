import { ApolloServer, gql } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'

const uuid = () => {
  // Public Domain/MIT
  let d = new Date().getTime() //Timestamp
  let d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0 //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

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
    todo: Todo
  }

  type DeleteTodoResponse {
    todo: Todo
  }

  type UpdateTodoResponse {
    todo: Todo
  }

  type Query {
    todos: [Todo]
  }

  type Mutation {
    createTodo(description: String!, status: TodoStatus!): TodoResponse!
    deleteTodo(id: ID!): DeleteTodoResponse!
    updateTodo(
      id: ID!
      description: String!
      status: TodoStatus!
    ): UpdateTodoResponse!
  }
`

let todos = []

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    createTodo: (ctx, { description }) => {
      const todo = {
        id: uuid(),
        description,
        status: 'active',
      }
      todos.push(todo)
      return {
        todo,
      }
    },
    deleteTodo: (ctx, { id }) => {
      const index = todos.findIndex((todo) => todo.id === id)
      const todo = todos[index]
      return {
        todo,
      }
    },
    updateTodo: (ctx, { id, description, status }) => {
      const index = todos.findIndex((todo) => todo.id === id)
      const todo = { ...todos[index], description, status }
      todos[index] = todo
      return {
        todo,
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
