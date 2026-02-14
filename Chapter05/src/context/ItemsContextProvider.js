import React from 'react';

export const ItemsContext = React.createContext();

const initialValue = {
  itemsByList: {},
  loading: true,
  error: '',
};

const reducer = (value, action) => {
  switch (action.type) {
    case 'GET_ITEMS_START':
      return {
        ...value,
        loading: true,
        error: '',
      };
    case 'GET_ITEMS_SUCCESS': {
      const { listId, items } = action.payload;

      return {
        ...value,
        itemsByList: {
          ...value.itemsByList,
          [listId]: items,
        },
        loading: false,
      };
    }
    case 'GET_ITEMS_ERROR':
      return {
        ...value,
        loading: false,
        error: action.payload,
      };
    case 'ADD_ITEM_SUCCESS': {
      const listId = action.payload.listId;
      const existingItems = value.itemsByList[listId] || [];

      return {
        ...value,
        itemsByList: {
          ...value.itemsByList,
          [listId]: [...existingItems, action.payload],
        },
        loading: false,
      };
    }
    case 'ADD_ITEM_ERROR':
      return {
        ...value,
        loading: false,
        error: 'Something went wrong...',
      };
    default:
      return value;
  }
};

async function fetchData(dataSource) {
  try {
    const data = await fetch(dataSource);
    const dataJSON = await data.json();

    if (dataJSON) {
      return await { data: dataJSON, error: false };
    }
  } catch (error) {
    return { data: false, error: error.message };
  }
}

async function postData(dataSource, content) {
  try {
    const data = await fetch(dataSource, {
      method: 'POST',
      body: JSON.stringify(content),
    });
    const dataJSON = await data.json();

    if (dataJSON) {
      return await { data: dataJSON, error: false };
    }
  } catch (error) {
    return { data: false, error: error.message };
  }
}

const ItemsContextProvider = ({ children }) => {
  const [value, dispatch] = React.useReducer(reducer, initialValue);

  const getItemsRequest = async id => {
    dispatch({ type: 'GET_ITEMS_START' });

    const result = await fetchData(
      `https://my-json-server.typicode.com/pranayfpackt/-React-Projects/lists/${id}/items`,
    );

    if (Array.isArray(result.data)) {
      dispatch({
        type: 'GET_ITEMS_SUCCESS',
        payload: { listId: Number(id), items: result.data },
      });
    } else {
      dispatch({ type: 'GET_ITEMS_ERROR', payload: result.error });
    }
  };

  const addItemRequest = async content => {
    const result = await postData(
      'https://my-json-server.typicode.com/pranayfpackt/-React-Projects/lists',
      content,
    );

    if (result.data && result.data.hasOwnProperty('id')) {
      dispatch({ type: 'ADD_ITEM_SUCCESS', payload: content });
    } else {
      dispatch({ type: 'ADD_ITEM_ERROR' });
    }
  };

  return (
    <ItemsContext.Provider
      value={{ ...value, getItemsRequest, addItemRequest }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export default ItemsContextProvider;
