import { useEffect, useState } from 'react'
import Form from './Form'
import {
  GetTodosDocument,
  GetTodosQuery,
  TodoFragment,
  TodoFragmentDoc,
  TodoStatus,
  useCreateTheTodoMutation,
  useDeleteTheTodoMutation,
  useGetTodosQuery,
  useUpdateTheTodoMutation,
} from './generated-types'

/**
 * Since this is used multiple times - the update todo
 * logic was abstracted into a hook to be utilized by multiple
 * components
 */
const useUpdateTheTodo = () => {
  const [updateTheTodo] = useUpdateTheTodoMutation()
  const update = (updatedTodo: any) => {
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
        cache.updateFragment<TodoFragment>(
          {
            id: cache.identify({
              id: updatedTodo.id,
              __typename: 'Todo',
            }),
            fragment: TodoFragmentDoc,
          },
          (_data) => updatedTodo
        )
      },
    })
  }
  return update
}

const TodoItemToggle = ({ todo }: { todo: any }) => {
  const updateTheTodo = useUpdateTheTodo()
  const toggleTodo = () => {
    const updatedTodo = {
      id: todo.id,
      description: todo.description,
      status:
        todo.status === TodoStatus.Active
          ? TodoStatus.Complete
          : TodoStatus.Active,
    }
    updateTheTodo(updatedTodo)
  }
  return (
    <label className="container">
      <input
        type="checkbox"
        onChange={toggleTodo}
        checked={todo.status === TodoStatus.Complete}
      />
      <span className="checkmark"></span>
    </label>
  )
}

const TodoItemInput = ({ todo }: { todo: any }) => {
  const updateTheTodo = useUpdateTheTodo()
  const [theDescription, setTheDescription] = useState('')
  const [inputVisible, setInputVisible] = useState(false)
  const updateTodo = () => {
    const updatedTodo = {
      id: todo.id,
      description: theDescription,
      status: todo.status,
    }
    updateTheTodo(updatedTodo)
  }
  useEffect(() => {
    setTheDescription(todo.description)
  }, [todo.description])
  const completed = todo.status === TodoStatus.Complete
  return (
    <>
      {inputVisible ? (
        <div className="todo-form">
          <input
            type="text"
            value={theDescription}
            className="todo-form-description"
            onChange={(e) => setTheDescription(e.target.value)}
          />
          <button onClick={updateTodo}>submit</button>
        </div>
      ) : (
        <div>
          <span onClick={() => setInputVisible(!inputVisible)}>
            <span className={completed ? 'strike' : ''}>
              {todo?.description}
            </span>
          </span>
        </div>
      )}
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
    <li
      style={{
        display: 'flex',
        margin: '20px',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'flex',
        }}
      >
        <TodoItemToggle todo={todo} />
        <TodoItemInput todo={todo} />
      </div>
      <div>
        <span
          style={{ marginLeft: '20px' }}
          onClick={() => deleteTodo(todo.id)}
        >
          x
        </span>
      </div>
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
    <div style={{ width: '500px' }}>
      <Form onSubmit={addTheTodo} />
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo?.id} todo={todo} />
        ))}
      </ul>
    </div>
  )
}

export default TodoGQL
