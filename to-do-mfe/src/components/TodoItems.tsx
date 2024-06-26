import React from 'react';
import styled from 'styled-components';
import type TodoTaskType from '../model/TodoTask';
import TodoItem from './TodoItem';

interface Props {
  items: TodoTaskType[],
  updateItem: (item:TodoTaskType) => void
}

const ListContainer = styled.div`
  border-bottom: 1px solid #cbcbcb;
  padding: 0;
  margin: 0;
`

const TodoItems: React.FC<Props> = ({ items, updateItem }) => {
  return <>
    {items.map(item => (
      <ListContainer key={item.id}>
        <TodoItem item={item} key={item.id} updateItem={updateItem} />
      </ListContainer>
    ))}
  </>
}

export default TodoItems;