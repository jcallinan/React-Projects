import React, { Component } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import Owner from '../components/Owner/Owner';
import Answer from '../components/Answer/Answer';

const QuestionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5%;
`;

const QuestionCard = styled.div`
  text-align: left;
  padding: 2%;
  background: lightGray;
  border-radius: 5px;
  margin-bottom: 2%;
`;

const Title = styled.h2`
  width: 100%;
  padding-bottom: 10px;
  text-align: center;
  border-bottom: 1px solid darkGray;
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

const Count = styled.div`
  flex-basis: 80%;
`;

const AnswersTitle = styled.h3`
  text-align: left;
  margin: 2% 0 1%;
`;

const Alert = styled.div`
  text-align: center;
`;

const ROOT_API = 'https://api.stackexchange.com/2.2/';

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: null,
      answers: [],
      loading: true,
      error: '',
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    try {
      const [questionResponse, answersResponse] = await Promise.all([
        fetch(
          `${ROOT_API}questions/${match.params.id}?site=stackoverflow&filter=withbody`,
        ),
        fetch(
          `${ROOT_API}questions/${match.params.id}/answers?order=desc&sort=activity&site=stackoverflow&filter=withbody`,
        ),
      ]);

      const questionJSON = await questionResponse.json();
      const answersJSON = await answersResponse.json();

      if (questionJSON) {
        this.setState({
          question: questionJSON.items ? questionJSON.items[0] : null,
          answers: answersJSON.items || [],
          loading: false,
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: error.message,
      });
    }
  }

  render() {
    const { match } = this.props;
    const { question, answers, loading, error } = this.state;

    if (loading || error) {
      return (
        <>
          <Helmet>
            <title>{`Q&A Feed - Question #${match.params.id}`}</title>
          </Helmet>
          <Alert>{loading ? 'Loading...' : error}</Alert>
        </>
      );
    }

    if (!question) {
      return (
        <>
          <Helmet>
            <title>{`Q&A Feed - Question #${match.params.id}`}</title>
          </Helmet>
          <Alert>Question not found.</Alert>
        </>
      );
    }

    return (
      <QuestionWrapper>
        <QuestionCard>
          <Title>{question.title}</Title>
          <Body dangerouslySetInnerHTML={{ __html: question.body }} />
          <Meta>
            <Count>
              {`Views: ${question.view_count} | Answers: ${question.answer_count}`}
            </Count>
            <Owner data={question.owner} />
          </Meta>
        </QuestionCard>
        <AnswersTitle>{`Answers (${answers.length})`}</AnswersTitle>
        {answers.map((answer) => (
          <Answer key={answer.answer_id} data={answer} />
        ))}
      </QuestionWrapper>
    );
  }
}

export default Question;
