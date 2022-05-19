export enum TodoStatus {
  Active = 'Active',
  Complete = 'Complete',
}

export type Todo = {
  id: string
  description: string
  status: TodoStatus
}
