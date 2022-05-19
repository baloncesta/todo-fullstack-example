import { useQuery, gql, useMutation } from '@apollo/client'
import { Todo, TodoStatus } from '../constants'
import { uuid } from '../util'
import Form from './Form'

const TodoGQL = () => {
  const CREATE_TODO = gql`
    mutation createTheTodo($id: ID!, $description: String!, $status: String!) {
      createTodo(id: $id, description: $description, status: $status) {
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
    useMutation(CREATE_TODO)
  // const TODOS_FRAGMENT = gql`
  //   fragment TodosFragment on Todo {
  //     id
  //     description
  //     status
  //   }
  // `
  const addTheTodo = (description: string) => {
    addTodo({
      variables: { id: uuid(), description, status: TodoStatus.Active },
    })
    // client.cache.writeFragment({
    //   id: `Todo:3`,
    //   fragment: TODOS_FRAGMENT,
    //   data: {
    //     id: uuid(),
    //     description,
    //     status: TodoStatus.Active,
    //     __typename: 'Todo',
    //   },
    // })
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
