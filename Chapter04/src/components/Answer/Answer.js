import React from 'react';
import styled from 'styled-components';
import Owner from '../Owner/Owner';

const AnswerCard = styled.div`
  text-align: left;
  padding: 2%;
  background: #f2f2f2;
  border-radius: 5px;
  margin-bottom: 2%;
`;

const Body = styled.div`
  margin: 2% 0;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 2%;
`;

const Score = styled.div`
  flex-basis: 80%;
  font-weight: bold;
`;

const Answer = ({ data }) => (
  <AnswerCard>
    <Body dangerouslySetInnerHTML={{ __html: data.body }} />
    <Meta>
      <Score>{`Score: ${data.score}`}</Score>
      <Owner data={data.owner} />
    </Meta>
  </AnswerCard>
);

export default Answer;
