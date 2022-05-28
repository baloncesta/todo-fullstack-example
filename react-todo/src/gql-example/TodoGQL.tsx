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

const TodoItemToggle = ({ todo }: { todo: any }) => {
  const [updateTheTodo] = useUpdateTheTodoMutation()
  const toggleTodo = () => {
    const updatedTodo = {
      id: todo.id,
      description: todo.description,
      status:
        todo.status === TodoStatus.Active
          ? TodoStatus.Complete
          : TodoStatus.Active,
    }
    updateTheTodo({
      variables: updatedTodo,
      optimisticResponse: {
        __typename: 'Mutation',
        updateTodo: {
          __typename: 'UpdateTodoResponse',
          todo: {
            __typename: 'Todo',
            ...updatedTodo,
          },
        },
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
              todo?.id === todoItem.id ? updatedTodo : todo
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
    <input
      type="checkbox"
      onChange={toggleTodo}
      checked={todo.status === TodoStatus.Complete}
    />
  )
}

const TodoItemInput = ({ todo }: { todo: any }) => {
  const [updateTheTodo] = useUpdateTheTodoMutation()
  const [theDescription, setTheDescription] = useState('')
  const updateTodo = () => {
    const updated = {
      id: todo.id,
      description: theDescription,
      status: todo.status,
    }
    updateTheTodo({
      variables: updated,
      optimisticResponse: {
        __typename: 'Mutation',
        updateTodo: {
          __typename: 'UpdateTodoResponse',
          todo: {
            __typename: 'Todo',
            ...updated,
          },
        },
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
      <TodoItemToggle todo={todo} />
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
