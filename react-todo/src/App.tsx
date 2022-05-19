import { FormEvent, useState } from 'react'
import { Todo, TodoStatus } from './constants'
import { uuid } from './util'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [description, setDescription] = useState('')
  const addTodo = (e: FormEvent) => {
    e.preventDefault()
    if (!description) {
      return
    }
    const newTodos = [
      ...todos,
      { id: uuid(), description, status: TodoStatus.Active },
    ]
    setTodos(newTodos)
    setDescription('')
  }
  const toggleTodo = (todoId: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        const status =
          todo.status === TodoStatus.Active
            ? TodoStatus.Complete
            : TodoStatus.Active
        const updatedTodo = { ...todo, status }
        return updatedTodo
      }
      return todo
    })
    setTodos(newTodos)
  }
  const deleteTodo = (todoId: string) => {
    const newTodos = todos.filter((todo) => todo.id !== todoId)
    setTodos(newTodos)
  }
  return (
    <div>
      <form className="todo-form" onSubmit={addTodo}>
        <input
          type="text"
          className="todo-form-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>
      <ul className="list">
        {todos.map((todo) => {
          const isComplete = todo.status === TodoStatus.Complete
          return (
            <li key={todo.id} className="list-item">
              <input
                type="checkbox"
                checked={isComplete}
                onChange={() => toggleTodo(todo.id)}
              />
              <span
                className={`list-item-description ${
                  isComplete ? 'completed' : ''
                }`}
              >
                {todo.description}
              </span>
              <span
                onClick={() => deleteTodo(todo.id)}
                style={{ marginLeft: '20px' }}
              >
                x
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default App
