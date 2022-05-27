import { gql } from '@apollo/client'
import Form from './Form'
import {
  GetTodosDocument,
  GetTodosQuery,
  TodoStatus,
  useCreateTheTodoMutation,
  useGetTodosQuery,
} from './generated-types'

const TodoGQL = () => {
  const { data, loading, error } = useGetTodosQuery()
  console.log(error, data, loading)
  const [addTodo] = useCreateTheTodoMutation()

  const addTheTodo = (description: string) => {
    addTodo({
      variables: {
        description,
        status: TodoStatus.Active,
      },
      update: (cache, { data }) => {
        if (data?.createTodo.todo) {
          const result = cache.readQuery<GetTodosQuery>({
            query: GetTodosDocument,
          })
          if (!result) {
            return
          }
          cache.writeQuery({
            query: GetTodosDocument,
            data: {
              ...result,
              todos: [...result.todos, data?.createTodo.todo],
            },
          })
        }
      },
    })
  }
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  return (
    <>
      <Form onSubmit={addTheTodo} />
      <ul>
        {data?.todos.map((todo) => (
          <li key={todo?.id}>{todo?.description}</li>
        ))}
      </ul>
    </>
  )
}

export default TodoGQL
