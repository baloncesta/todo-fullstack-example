import { FormEvent, useState } from 'react'

const Form = ({ onSubmit }: { onSubmit: any }) => {
  const [description, setDescription] = useState('')
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(description)
  }
  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-form-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">submit</button>
    </form>
  )
}

export default Form
