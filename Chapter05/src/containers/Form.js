import React from 'react';
import styled from 'styled-components';
import { ListsContext } from '../context/ListsContextProvider';
import { ItemsContext } from '../context/ItemsContextProvider';
import SubHeader from '../components/Header/SubHeader';
import FormItem from '../components/FormItem/FormItem';
import Button from '../components/Button/Button';

const FormWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin: 2% 5%;
`;

const SubmitButton = styled(Button)`
  background: blue;
  margin: 2% 0;
`;

const Form = ({ match, history }) => {
  const listId = Number(match.params.id);
  const { list, getListRequest } = React.useContext(ListsContext);
  const { addItemRequest } = React.useContext(ItemsContext);
  const [title, setTitle] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [price, setPrice] = React.useState('');

  React.useEffect(() => {
    if (!list.id || list.id !== listId) {
      getListRequest(listId);
    }
  }, [getListRequest, list.id, listId]);

  const listTitle = list.id === listId ? list.title : 'Loading list...';

  const handleOnSubmit = e => {
    e.preventDefault();
    addItemRequest({
      title,
      quantity,
      price,
      id: Math.floor(Math.random() * 100),
      listId,
    });
    history.goBack();
  };

  return (
    <>
      {history && (
        <SubHeader
          goBack={() => history.goBack()}
          title={`Add Item to ${listTitle}`}
        />
      )}
      <FormWrapper>
        <form onSubmit={handleOnSubmit}>
          <FormItem
            id='title'
            label='Title'
            placeholder='Insert title'
            value={title}
            handleOnChange={setTitle}
          />
          <FormItem
            id='quantity'
            label='Quantity'
            type='number'
            placeholder='0'
            value={quantity}
            handleOnChange={setQuantity}
          />
          <FormItem
            id='price'
            label='Price'
            type='number'
            placeholder='0.00'
            value={price}
            handleOnChange={setPrice}
          />
          <SubmitButton>Add Item</SubmitButton>
        </form>
      </FormWrapper>
    </>
  );
};

export default Form;
