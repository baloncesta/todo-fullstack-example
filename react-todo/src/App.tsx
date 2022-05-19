import { FormEvent, useState } from 'react'

enum TodoStatus {
  Active = 'Active',
  Complete = 'Complete',
}

type Todo = {
  id: string
  description: string
  status: TodoStatus
}

function uuid() {
  // Public Domain/MIT
  var d = new Date().getTime() //Timestamp
  var d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0 //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 //random number between 0 and 16
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
