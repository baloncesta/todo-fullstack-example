/* eslint-disable @typescript-eslint/no-unused-vars */

import { gql, useMutation, useQuery } from '@apollo/client'

// before autogen - we could use manual template strings

const useExample = () => {
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
}
