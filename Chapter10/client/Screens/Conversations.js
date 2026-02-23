import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
import styled from 'styled-components/native';
import { GET_CONVERSATIONS } from '../constants';
import ConversationItem from '../Components/Conversation/ConversationItem';

const ConversationsWrapper = styled(View)`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const ConversationsList = styled(FlatList)`
  width: 100%;
`;

const ConversationsText = styled(Text)`
  font-size: 20px;
  color: black;
`;

const Conversations = ({ navigation }) => {
  const { loading, data } = useQuery(GET_CONVERSATIONS);

  if (loading) {
    return (
      <ConversationsWrapper>
        <ConversationsText>Loading...</ConversationsText>
      </ConversationsWrapper>
    );
  }

  return (
    <ConversationsWrapper>
      <ConversationsList
        data={data.conversations}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <ConversationItem item={item} navigation={navigation} />
        )}
      />
    </ConversationsWrapper>
  );
};

export default Conversations;