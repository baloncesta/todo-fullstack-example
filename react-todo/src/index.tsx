// @ts-ignore
import apolloLogger from 'apollo-link-logger'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  HttpLink,
} from '@apollo/client'
import TodoGQL from './gql-example/TodoGQL'

// https://github.com/apollographql/apollo-client/issues/6850

const links = [new HttpLink({ uri: 'http://localhost:3001/graphql' })]
// logging apollo logger conditionally
// localStorage.getItem('logDev')
if (true) {
  links.unshift(apolloLogger)
}

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
  link: ApolloLink.from(links),
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  process.env.REACT_APP_GQL_MODE ? (
    <ApolloProvider client={client}>
      <TodoGQL />
    </ApolloProvider>
  ) : (
    <App />
  )
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
