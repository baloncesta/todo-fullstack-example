import { useQuery, gql, useMutation } from '@apollo/client'
import { Todo, TodoStatus } from '../constants'
import Form from './Form'

const TodoGQL = () => {
  const CREATE_TODO = gql`
    mutation createTheTodo($description: String!, $status: String!) {
      createTodo(description: $description, status: $status) {
        id
        description
        status
      }
    }
  `
  const TODOS = gql`
    query getTodos {
      allTodos {
        id
        description
        status
      }
    }
  `
  const { loading, error, data } = useQuery(TODOS, {})
  const [addTodo, { data: todoData, loading: todoLoading, error: todoError }] =
    useMutation(CREATE_TODO, {
      update: (cache, mutationResult) => {
        cache.updateQuery(
          {
            query: TODOS,
          },
          (data) => {
            console.log(data)
            return {
              ...data,
              allTodos: [...data.allTodos, mutationResult.data.createTodo],
            }
          }
        )
      },
    })
  const addTheTodo = (description: string) => {
    addTodo({
      variables: {
        __typename: 'Todo',
        description,
        status: TodoStatus.Active,
      },
    })
  }
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  return (
    <>
      <Form onSubmit={addTheTodo} />
      <ul>
        {data.allTodos.map((todo: Todo) => (
          <li key={todo.id}>{todo.description}</li>
        ))}
      </ul>
    </>
  )
}

export default TodoGQL
