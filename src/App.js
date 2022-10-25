import { gql, useSubscription } from '@apollo/client';
import { useEffect, useState } from 'react';

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
      setRefresh(new Date())
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
