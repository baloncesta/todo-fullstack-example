import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateTodoResponse = {
  __typename?: 'CreateTodoResponse';
  message: Scalars['String'];
  todo?: Maybe<Todo>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createTodo: CreateTodoResponse;
};


export type MutationCreateTodoArgs = {
  description: Scalars['String'];
  status: TodoStatus;
};

export type Query = {
  __typename?: 'Query';
  todos: Array<Maybe<Todo>>;
};

export type Todo = {
  __typename?: 'Todo';
  description: Scalars['String'];
  id: Scalars['ID'];
  status?: Maybe<TodoStatus>;
};

export enum TodoStatus {
  Active = 'Active',
  Completed = 'Completed'
}

export type CreateTheTodoMutationVariables = Exact<{
  description: Scalars['String'];
  status: TodoStatus;
}>;


export type CreateTheTodoMutation = { __typename?: 'Mutation', createTodo: { __typename?: 'CreateTodoResponse', todo?: { __typename?: 'Todo', id: string, status?: TodoStatus | null, description: string } | null } };

export type GetTodosQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTodosQuery = { __typename?: 'Query', todos: Array<{ __typename?: 'Todo', id: string, description: string, status?: TodoStatus | null } | null> };


export const CreateTheTodoDocument = gql`
    mutation createTheTodo($description: String!, $status: TodoStatus!) {
  createTodo(description: $description, status: $status) {
    todo {
      id
      status
      description
    }
  }
}
    `;
export type CreateTheTodoMutationFn = Apollo.MutationFunction<CreateTheTodoMutation, CreateTheTodoMutationVariables>;

/**
 * __useCreateTheTodoMutation__
 *
 * To run a mutation, you first call `useCreateTheTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTheTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTheTodoMutation, { data, loading, error }] = useCreateTheTodoMutation({
 *   variables: {
 *      description: // value for 'description'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useCreateTheTodoMutation(baseOptions?: Apollo.MutationHookOptions<CreateTheTodoMutation, CreateTheTodoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTheTodoMutation, CreateTheTodoMutationVariables>(CreateTheTodoDocument, options);
      }
export type CreateTheTodoMutationHookResult = ReturnType<typeof useCreateTheTodoMutation>;
export type CreateTheTodoMutationResult = Apollo.MutationResult<CreateTheTodoMutation>;
export type CreateTheTodoMutationOptions = Apollo.BaseMutationOptions<CreateTheTodoMutation, CreateTheTodoMutationVariables>;
export const GetTodosDocument = gql`
    query getTodos {
  todos {
    id
    description
    status
  }
}
    `;

/**
 * __useGetTodosQuery__
 *
 * To run a query within a React component, call `useGetTodosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTodosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTodosQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTodosQuery(baseOptions?: Apollo.QueryHookOptions<GetTodosQuery, GetTodosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTodosQuery, GetTodosQueryVariables>(GetTodosDocument, options);
      }
export function useGetTodosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTodosQuery, GetTodosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTodosQuery, GetTodosQueryVariables>(GetTodosDocument, options);
        }
export type GetTodosQueryHookResult = ReturnType<typeof useGetTodosQuery>;
export type GetTodosLazyQueryHookResult = ReturnType<typeof useGetTodosLazyQuery>;
export type GetTodosQueryResult = Apollo.QueryResult<GetTodosQuery, GetTodosQueryVariables>;