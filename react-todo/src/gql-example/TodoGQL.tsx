import { useEffect, useState } from 'react'
import Form from './Form'
import {
  GetTodosDocument,
  GetTodosQuery,
  TodoStatus,
  useCreateTheTodoMutation,
  useDeleteTheTodoMutation,
  useGetTodosQuery,
  useUpdateTheTodoMutation,
} from './generated-types'

const TodoItemInput = ({ todo }: { todo: any }) => {
  const [updateTheTodo] = useUpdateTheTodoMutation()
  const [theDescription, setTheDescription] = useState('')
  const updateTodo = () => {
    updateTheTodo({
      variables: {
        id: todo.id,
        description: theDescription,
        status: todo.status,
      },
      update: (cache, { data }) => {
        const todoItem = data?.updateTodo.todo
        if (!todoItem) {
          return
        }
        cache.updateQuery<GetTodosQuery>(
          {
            query: GetTodosDocument,
          },
          (data) => {
            if (!data) {
              return
            }
            const todos = [...data.todos].map((todo) =>
              todo?.id === todoItem.id ? { ...todo, ...todoItem } : todo
            )
            return {
              todos,
            }
          }
        )
      },
    })
  }
  useEffect(() => {
    setTheDescription(todo.description)
  }, [todo.description])
  return (
    <>
      <input
        type="text"
        value={theDescription}
        onChange={(e) => setTheDescription(e.target.value)}
      />
      <button onClick={updateTodo}>submit</button>
    </>
  )
}

const TodoItem = ({ todo }: { todo: any }) => {
  const [deleteTheTodo] = useDeleteTheTodoMutation()
  const deleteTodo = (id: string) => {
    deleteTheTodo({
      variables: { id },
      update: (cache, { data }) => {
        const todoItem = data?.deleteTodo.todo
        if (!todoItem) {
          return
        }
        cache.updateQuery<GetTodosQuery>(
          {
            query: GetTodosDocument,
          },
          (data) => {
            if (!data) {
              return
            }
            const todos = [...data.todos].filter(
              (todo) => todoItem.id !== todo?.id
            )
            return {
              todos,
            }
          }
        )
      },
    })
  }
  return (
    <li>
      <TodoItemInput todo={todo} />
      <span>{todo?.description}</span>
      <span onClick={() => deleteTodo(todo.id)}>x</span>
    </li>
  )
}

const TodoGQL = () => {
  const { data, loading, error } = useGetTodosQuery()
  const [addTodo] = useCreateTheTodoMutation()

  const addTheTodo = (description: string) => {
    addTodo({
      variables: {
        description,
        status: TodoStatus.Active,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createTodo: {
          __typename: 'CreateTodoResponse',
          todo: {
            __typename: 'Todo',
            id: 'a',
            status: TodoStatus.Active,
            description,
          },
        },
      },
      update: (cache, { data }) => {
        const todoItem = data?.createTodo.todo
        if (todoItem) {
          cache.updateQuery<GetTodosQuery>(
            {
              query: GetTodosDocument,
            },
            (data) => {
              if (!data) {
                return
              }
              return {
                todos: [...data.todos, todoItem],
              }
            }
          )
        }
      },
    })
  }
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  const todos = data?.todos || []
  return (
    <>
      <Form onSubmit={addTheTodo} />
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo?.id} todo={todo} />
        ))}
      </ul>
    </>
  )
}

export default TodoGQL
