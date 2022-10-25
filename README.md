# Basic React Apollo QraphQL Subscription headers sample

./src/index.js
```js
[...]
const httpLink = new HttpLink({
  uri: 'http://localhost:1328/query' // <--- ws/wss uri
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:1328/query',
  connectionParams: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // <--- ws/wss uri
    "X-API-Key": process.env.REACT_APP_API_KEY // <--- ws/wss uri
  },
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
```

./src/App.js
```js
[...]
const MESSAGE_RECEIVED = gql`
  subscription messageReceived ($type_id: ID!){
    messageReceived(type_id:$type_id){
      text
      user {
        firstname
      }
    }
  }
`;

function App() {
  const [refresh, setRefresh] = useState(null)
  const [lastMessage, setLastMessage] = useState(null)
  const { loading, error, data } = useSubscription(MESSAGE_RECEIVED, { 
    variables: { 
      type_id: "12884aec-3bf8-45ac-af28-40e236c4ea8f", 
      refesh: refresh 
    } 
  });

  useEffect(() => {
    if (!loading) {
      setRefresh(new Date())  // <--- hack to reload sub
    }
  }, [loading])

  useEffect(() => {
    if (data) {
      setLastMessage(data.messageReceived)
    }
  }, [data])

  if (error) return <p>Error :(</p>;

  return (
    <div>
      {lastMessage?.text}
    </div>
  );
}

export default App;
```