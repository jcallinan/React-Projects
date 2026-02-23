import React from 'react';
import { Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
import styled from 'styled-components/native';
import { GET_CONVERSATION } from '../constants';
import ConversationActions from '../Components/Conversation/ConversationActions';
import ConversationBody from '../Components/Conversation/ConversationBody';

const ConversationWrapper = styled(View)`
  flex: 1;
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const ConversationBodyText = styled(Text)`
  font-size: 20px;
  color: black;
`;

const Conversation = ({ route }) => {
  const userName = route.params?.userName ?? '';
  const { loading, data, subscribeToMore } = useQuery(GET_CONVERSATION, {
    variables: { userName },
  });

  return (
    <ConversationWrapper>
      {loading ? (
        <ConversationBodyText>Loading...</ConversationBodyText>
      ) : (
        <ConversationBody
          messages={data.conversation.messages}
          subscribeToMore={subscribeToMore}
          userName={userName}
        />
      )}
      <ConversationActions userName={userName} />
    </ConversationWrapper>
  );
};

export default Conversation;