import Form from './Form'
import {
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
      update: (cache) => {
        console.log('foo')
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
