export default `
    type Todo {
      id: ID!
      description: String!
      status: String!
    }
    type Query {
      Todo(id: ID!): Todo
      allTodos: [Todo]
    }
    type Mutation {
      createTodo(todo: Todo): Todo
      updateTodo(todo: Todo): Todo
      deleteTodo(id: ID!): Todo
    }
`;